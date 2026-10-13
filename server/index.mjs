/**
 * AI Lab backend.
 *
 * Zero-dependency Node HTTP service (Node 22 has global fetch). It exists for
 * one reason: secret provider credentials must never reach the browser. The
 * Vite dev server proxies /api here, so the tools call their own origin.
 *
 *   GET  /api/health          — is the live model connected?
 *   POST /api/ai/chat         — portfolio assistant + site assistant
 *   POST /api/ai/recommend    — experience recommendation (discovery flow)
 *   POST /api/ai/outfit       — Fashion Intelligence Studio
 *   POST /api/ai/explain      — research / paper explainer
 *   POST /api/ai/concept      — AI concept explorer
 */

import { createServer } from 'node:http';
import { AiError, aiConfigured, aiModel, chatJson, chatText } from './provider.mjs';
import {
  conceptSystem,
  explainSystemFor,
  outfitSystem,
  portfolioAssistantSystem,
  recommendationSystem,
} from './prompts.mjs';

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '0.0.0.0';
const BODY_LIMIT = 96 * 1024;

/** Input ceilings — public tools cost money, so keep every field bounded. */
const LIMITS = {
  chatInput: 1500,
  chatTurns: 20,
  message: 4000,
  outfitField: 320,
  explainText: 20000,
  topic: 120,
};

const RATE_LIMIT = { windowMs: 5 * 60 * 1000, max: 24 };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ---------------------------------------------------------------- validation

function requireString(value, field, { max, min = 1, optional = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (optional) return '';
    throw new HttpError(400, `“${field}” is required.`);
  }
  if (typeof value !== 'string') throw new HttpError(400, `“${field}” must be text.`);
  const trimmed = value.trim();
  if (trimmed.length < min && !optional) throw new HttpError(400, `“${field}” is too short.`);
  if (max && trimmed.length > max) throw new HttpError(400, `“${field}” is too long (limit ${max} characters).`);
  return trimmed;
}

function requireEnum(value, field, allowed) {
  const text = requireString(value, field);
  if (!allowed.includes(text)) throw new HttpError(400, `“${field}” must be one of: ${allowed.join(', ')}.`);
  return text;
}

function optionalStringArray(value, field, { max = 20, itemMax = 120 } = {}) {
  if (value === undefined || value === null || value === '') return [];
  if (!Array.isArray(value)) throw new HttpError(400, `“${field}” must be a list.`);
  return value.slice(0, max).map((item) => requireString(String(item), field, { max: itemMax }));
}

// --------------------------------------------------- structured reply checks

const isFilled = (value) => typeof value === 'string' && value.trim().length > 0;
const isFilledList = (value) => Array.isArray(value) && value.some(isFilled);

function checkOutfit(data) {
  const problems = [];
  if (!isFilled(data.name)) problems.push('name is missing');
  if (!isFilled(data.summary)) problems.push('summary is missing');
  if (!Array.isArray(data.pieces) || data.pieces.length === 0) problems.push('pieces is missing');
  if (!isFilled(data.whyItWorks)) problems.push('whyItWorks is missing');
  return problems;
}

function checkExplanation(data) {
  const problems = [];
  if (!isFilled(data.title)) problems.push('title is missing');
  if (!isFilled(data.problem)) problems.push('problem is missing');
  if (!isFilled(data.mainIdea)) problems.push('mainIdea is missing');
  if (!isFilled(data.method)) problems.push('method is missing');
  if (!isFilledList(data.howItWorks)) problems.push('howItWorks is missing');
  if (!isFilledList(data.prerequisites)) problems.push('prerequisites is missing');
  return problems;
}

function checkConcept(data) {
  const problems = [];
  if (!isFilled(data.title)) problems.push('title is missing');
  if (!isFilled(data.intuition)) problems.push('intuition is missing');
  if (!isFilledList(data.steps)) problems.push('steps is missing');
  if (!isFilled(data.example)) problems.push('example is missing');
  return problems;
}

function checkRecommendation(data) {
  const problems = [];
  if (!isFilled(data.title)) problems.push('title is missing');
  if (!isFilled(data.summary)) problems.push('summary is missing');
  if (!isFilledList(data.features)) problems.push('features is missing');
  return problems;
}

// ------------------------------------------------------------- rate limiting

const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((at) => now - at < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, list] of hits) {
      if (list.every((at) => now - at >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

// ------------------------------------------------------------------- routing

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > BODY_LIMIT) throw new HttpError(413, 'The request is too large.');
    chunks.push(chunk);
  }
  if (size === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    throw new HttpError(400, 'The request body was not valid JSON.');
  }
}

/** POST /api/ai/chat — grounded portfolio assistant (and the site's assistant). */
async function handleChat(body) {
  const input = requireString(body.input, 'input', { max: LIMITS.chatInput });
  const history = Array.isArray(body.messages) ? body.messages.slice(-LIMITS.chatTurns) : [];
  const messages = history
    .filter((message) => message && (message.role === 'user' || message.role === 'assistant'))
    .map((message) => ({
      role: message.role,
      content: requireString(message.content, 'message', { max: LIMITS.message, optional: true }),
    }))
    .filter((message) => message.content.length > 0);

  const reply = await chatText({
    system: portfolioAssistantSystem,
    messages: [...messages, { role: 'user', content: input }],
    maxTokens: 700,
  });
  return { reply };
}

/** POST /api/ai/recommend — used by the discovery flow. */
async function handleRecommend(body) {
  const industry = requireString(body.industry, 'industry', { max: 120 });
  const goal = requireString(body.goal, 'goal', { max: 200 });
  const style = requireString(body.style, 'style', { max: 120 });

  const data = await chatJson({
    system: recommendationSystem,
    user: `Industry: ${industry}\nGoal: ${goal}\nDesired style: ${style}`,
    maxTokens: 700,
    validate: checkRecommendation,
  });

  return {
    title: String(data.title),
    summary: String(data.summary),
    rationale: isFilled(data.rationale) ? String(data.rationale) : '',
    features: (Array.isArray(data.features) ? data.features : []).filter(isFilled).slice(0, 4).map(String),
    category: isFilled(data.category) ? String(data.category) : 'A considered starting point',
  };
}

/** POST /api/ai/outfit — Fashion Intelligence Studio. */
async function handleOutfit(body) {
  const occasion = requireString(body.occasion, 'occasion', { max: 80 });
  const season = requireString(body.season, 'season', { max: 40 });
  const style = requireString(body.style, 'style', { max: 80 });
  const weather = requireString(body.weather, 'weather', { max: LIMITS.outfitField });
  const temperature = requireString(body.temperature, 'temperature', { max: 40, optional: true });
  const colors = requireString(body.colors, 'colors', { max: LIMITS.outfitField, optional: true });
  const wardrobe = requireString(body.wardrobe, 'wardrobe', { max: 600, optional: true });
  const notes = requireString(body.notes, 'notes', { max: LIMITS.outfitField, optional: true });
  const avoid = requireString(body.avoid, 'avoid', { max: 200, optional: true });
  const feedback = optionalStringArray(body.feedback, 'feedback', { max: 5, itemMax: 160 });

  const request = [
    `Occasion: ${occasion}`,
    `Season: ${season}`,
    `Preferred style: ${style}`,
    `Weather: ${weather}`,
    temperature ? `Temperature: ${temperature}` : 'Temperature: not specified',
    colors ? `Preferred colours: ${colors}` : 'Preferred colours: not specified',
    wardrobe ? `Items they already own (build around these): ${wardrobe}` : 'Items they own: not specified',
    avoid ? `Avoid: ${avoid}` : 'Things to avoid: none stated',
    notes ? `Other preferences: ${notes}` : 'Other preferences: none stated',
    feedback.length ? `Feedback on the previous suggestion (adjust for this): ${feedback.join(' | ')}` : '',
  ].filter(Boolean).join('\n');

  const data = await chatJson({
    system: outfitSystem,
    user: request,
    maxTokens: 1100,
    validate: checkOutfit,
  });

  const pieces = (Array.isArray(data.pieces) ? data.pieces : [])
    .filter((piece) => piece && isFilled(piece.garment))
    .slice(0, 6)
    .map((piece) => ({
      garment: String(piece.garment),
      role: isFilled(piece.role) ? String(piece.role) : '',
      reason: isFilled(piece.reason) ? String(piece.reason) : '',
    }));
  if (pieces.length === 0) throw new AiError('invalid_output', 502, 'The styling reply had no garments in it. Please try again.');

  return {
    outfit: {
      name: String(data.name),
      summary: String(data.summary),
      pieces,
      whyItWorks: String(data.whyItWorks),
      weatherFit: isFilled(data.weatherFit) ? String(data.weatherFit) : '',
      occasionFit: isFilled(data.occasionFit) ? String(data.occasionFit) : '',
      styling: (Array.isArray(data.styling) ? data.styling : []).filter(isFilled).slice(0, 4).map(String),
      alternatives: (Array.isArray(data.alternatives) ? data.alternatives : []).filter(isFilled).slice(0, 3).map(String),
    },
  };
}

/** POST /api/ai/explain — research & paper explainer. */
async function handleExplain(body) {
  const mode = requireEnum(body.mode, 'mode', ['question', 'title', 'text']);
  const text = requireString(body.text, 'text', { max: LIMITS.explainText, min: mode === 'text' ? 200 : 3 });

  const data = await chatJson({
    system: explainSystemFor(mode),
    user: mode === 'text'
      ? `Paper text supplied by the user:\n"""\n${text}\n"""`
      : mode === 'title'
        ? `Paper title supplied by the user: ${text}`
        : `Research question: ${text}`,
    maxTokens: 1800,
    validate: checkExplanation,
  });

  const concepts = (Array.isArray(data.concepts) ? data.concepts : [])
    .filter((concept) => concept && isFilled(concept.term))
    .slice(0, 6)
    .map((concept) => ({
      term: String(concept.term),
      meaning: isFilled(concept.meaning) ? String(concept.meaning) : '',
    }));

  return {
    explanation: {
      title: String(data.title),
      // Only ever true when the model was actually given paper text.
      groundedInProvidedText: mode === 'text' && data.groundedInProvidedText === true,
      problem: String(data.problem),
      mainIdea: String(data.mainIdea),
      method: String(data.method),
      concepts,
      howItWorks: (Array.isArray(data.howItWorks) ? data.howItWorks : []).filter(isFilled).slice(0, 6).map(String),
      contributions: (Array.isArray(data.contributions) ? data.contributions : []).filter(isFilled).slice(0, 6).map(String),
      limitations: (Array.isArray(data.limitations) ? data.limitations : []).filter(isFilled).slice(0, 6).map(String),
      prerequisites: (Array.isArray(data.prerequisites) ? data.prerequisites : []).filter(isFilled).slice(0, 4).map(String),
      followUps: (Array.isArray(data.followUps) ? data.followUps : []).filter(isFilled).slice(0, 4).map(String),
    },
  };
}

/** POST /api/ai/concept — AI concept explorer. */
async function handleConcept(body) {
  const topic = requireString(body.topic, 'topic', { max: LIMITS.topic });
  const level = requireEnum(body.level, 'level', ['beginner', 'intermediate', 'technical']);
  const question = requireString(body.question, 'question', { max: 400, optional: true });

  const data = await chatJson({
    system: conceptSystem,
    user: question
      ? `Concept: ${topic}\nLevel: ${level}\nFollow-up question to answer as well: ${question}`
      : `Concept: ${topic}\nLevel: ${level}`,
    maxTokens: 1400,
    validate: checkConcept,
  });

  return {
    concept: {
      title: String(data.title),
      intuition: String(data.intuition),
      steps: (Array.isArray(data.steps) ? data.steps : []).filter(isFilled).slice(0, 6).map(String),
      example: String(data.example),
      limitations: (Array.isArray(data.limitations) ? data.limitations : []).filter(isFilled).slice(0, 4).map(String),
      next: (Array.isArray(data.next) ? data.next : []).filter(isFilled).slice(0, 4).map(String),
    },
  };
}

const ROUTES = {
  '/api/ai/chat': handleChat,
  '/api/ai/recommend': handleRecommend,
  '/api/ai/outfit': handleOutfit,
  '/api/ai/explain': handleExplain,
  '/api/ai/concept': handleConcept,
};

// --------------------------------------------------------------------- serve

const server = createServer(async (request, response) => {
  const started = Date.now();
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const send = (status, payload) => {
    const body = JSON.stringify(payload);
    response.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-store',
    });
    response.end(body);
  };

  try {
    if (path === '/api/health') {
      if (request.method !== 'GET') throw new HttpError(405, 'Use GET for this endpoint.');
      send(200, { ok: true, aiConfigured: aiConfigured(), model: aiConfigured() ? aiModel() : null });
    } else if (ROUTES[path]) {
      if (request.method !== 'POST') throw new HttpError(405, 'Use POST for this endpoint.');
      const ip = (request.headers['x-forwarded-for'] || '').toString().split(',')[0].trim()
        || request.socket.remoteAddress
        || 'unknown';
      if (isRateLimited(ip)) {
        throw new HttpError(429, 'Too many AI requests in a short time. Please wait a moment and try again.');
      }
      const body = await readJson(request);
      send(200, await ROUTES[path](body));
    } else {
      throw new HttpError(404, 'Not found.');
    }
  } catch (error) {
    const status = error instanceof HttpError || error instanceof AiError ? error.status : 500;
    const message = status === 500
      ? 'The AI service hit an unexpected error.'
      : error.message;
    if (status === 500) console.error('[ai] unhandled', error);
    send(status, { error: message, code: error.code || undefined });
  } finally {
    // Never logs request bodies or credentials.
    console.log(`[ai] ${request.method} ${path} ${response.statusCode} ${Date.now() - started}ms`);
  }
});

server.listen(PORT, HOST, () => {
  const state = aiConfigured() ? `model ${aiModel()} via ${process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1'}` : 'NOT configured (no AI_API_KEY)';
  console.log(`[ai] listening on ${HOST}:${PORT} — ${state}`);
});
