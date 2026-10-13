/**
 * Client for the AI Lab backend (server/), reached through the dev server's
 * same-origin /api proxy. No credentials live here — the provider key stays on
 * the server. Every failure surfaces the server's own honest message.
 */

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface OutfitPiece {
  garment: string;
  role: string;
  reason: string;
}

export interface Outfit {
  name: string;
  summary: string;
  pieces: OutfitPiece[];
  whyItWorks: string;
  weatherFit: string;
  occasionFit: string;
  styling: string[];
  alternatives: string[];
}

export interface OutfitInput {
  occasion: string;
  weather: string;
  temperature: string;
  season: string;
  style: string;
  colors: string;
  wardrobe: string;
  notes: string;
  avoid: string;
  feedback?: string[];
}

export interface Explanation {
  title: string;
  groundedInProvidedText: boolean;
  problem: string;
  mainIdea: string;
  method: string;
  concepts: Array<{ term: string; meaning: string }>;
  howItWorks: string[];
  contributions: string[];
  limitations: string[];
  prerequisites: string[];
  followUps: string[];
}

export interface Concept {
  title: string;
  intuition: string;
  steps: string[];
  example: string;
  limitations: string[];
  next: string[];
}

export interface AiHealth {
  ok: boolean;
  aiConfigured: boolean;
  model: string | null;
}

export class LabError extends Error {}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new LabError('Could not reach the AI service. Please check your connection and try again.');
  }

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new LabError(payload?.error || `The AI service could not complete that request (${response.status}).`);
  }
  return payload as T;
}

export const labApi = {
  async health(): Promise<AiHealth> {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) return { ok: false, aiConfigured: false, model: null };
      return (await response.json()) as AiHealth;
    } catch {
      return { ok: false, aiConfigured: false, model: null };
    }
  },

  chat(messages: ChatTurn[], input: string) {
    return post<{ reply: string }>('/api/ai/chat', { messages, input });
  },

  outfit(input: OutfitInput) {
    return post<{ outfit: Outfit }>('/api/ai/outfit', input);
  },

  explain(mode: 'question' | 'title' | 'text', text: string) {
    return post<{ explanation: Explanation }>('/api/ai/explain', { mode, text });
  },

  concept(topic: string, level: 'beginner' | 'intermediate' | 'technical', question = '') {
    return post<{ concept: Concept }>('/api/ai/concept', { topic, level, question });
  },
};
