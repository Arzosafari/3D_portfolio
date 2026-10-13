/**
 * Minimal OpenAI-compatible chat client.
 *
 * Any provider exposing `POST {AI_BASE_URL}/chat/completions` with a bearer
 * token works (OpenAI, OpenRouter, Groq, Together, a local gateway…), so the
 * site is not locked to one vendor. The key lives only in this process; it is
 * never sent to the browser and never logged.
 */

const BASE_URL = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const MODEL = process.env.AI_MODEL || 'gpt-4o-mini';
const API_KEY = (process.env.AI_API_KEY || '').trim();
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 45000);

export class AiError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = 'AiError';
    this.code = code;
    this.status = status;
  }
}

export function aiConfigured() {
  return API_KEY.length > 0;
}

export function aiModel() {
  return MODEL;
}

/** One chat completion call. Throws AiError with an honest, user-safe message. */
async function complete(messages, maxTokens) {
  if (!aiConfigured()) {
    throw new AiError(
      'not_configured',
      503,
      'The live AI service is not connected yet — an API key still needs to be added. No model was called.',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response;
  try {
    response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new AiError('timeout', 504, 'The AI provider took too long to respond. Please try again.');
    }
    throw new AiError('unreachable', 502, 'The AI provider could not be reached. Please try again.');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) {
    throw new AiError('rate_limited', 429, 'The AI provider is rate limiting requests right now. Please try again in a moment.');
  }
  if (response.status === 401 || response.status === 403) {
    throw new AiError('unauthorized', 502, 'The AI provider rejected the configured credentials.');
  }
  if (!response.ok) {
    throw new AiError('provider_error', 502, `The AI provider returned an error (${response.status}).`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new AiError('bad_response', 502, 'The AI provider returned a response that could not be read.');
  }

  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text.trim()) {
    throw new AiError('empty_response', 502, 'The AI provider returned an empty response.');
  }
  return text.trim();
}

/** Plain-text answer (the assistant, chat-style tools). */
export function chatText({ system, messages, maxTokens = 800 }) {
  return complete([{ role: 'system', content: system }, ...messages], maxTokens);
}

/** Pull the first JSON object out of a model reply, tolerating code fences. */
function extractJson(text) {
  const cleaned = text.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Structured answer. `validate` receives the parsed object and returns a
 * list of problems (empty = acceptable), so a malformed reply is retried once
 * and then reported honestly instead of being shown as if it were good.
 */
export async function chatJson({ system, user, maxTokens = 1400, validate }) {
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  let lastProblems = ['the reply was not valid JSON'];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const prompt = attempt === 0
      ? messages
      : [
        ...messages,
        { role: 'assistant', content: '(previous reply could not be used)' },
        {
          role: 'user',
          content: `That reply could not be used (${lastProblems.join('; ')}). Reply with ONLY the JSON object, no prose and no code fences.`,
        },
      ];

    const text = await complete(prompt, maxTokens);
    const parsed = extractJson(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      lastProblems = ['the reply was not valid JSON'];
      continue;
    }
    const problems = validate ? validate(parsed) : [];
    if (problems.length === 0) return parsed;
    lastProblems = problems;
  }

  throw new AiError('invalid_output', 502, 'The AI provider returned a response in an unusable format. Please try again.');
}
