export type ChatRole = 'assistant' | 'user';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface DiscoveryAnswers {
  industry: string;
  goal: string;
  style: string;
}

export interface ExperienceRecommendation {
  title: string;
  summary: string;
  rationale: string;
  features: string[];
  category: string;
}

export interface AiProvider {
  sendMessage(messages: ChatMessage[], input: string): Promise<string>;
  generateRecommendation(answers: DiscoveryAnswers): Promise<ExperienceRecommendation>;
}

const wait = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const industryPatterns: Array<[RegExp, string]> = [
  [/fashion|apparel|clothing|style|boutique|wardrobe/i, 'fashion'],
  [/health|clinic|medical|doctor|wellness|patient/i, 'healthcare'],
  [/restaurant|cafe|coffee|food|dining|hospitality/i, 'restaurant'],
  [/shop|commerce|retail|product|store|e-?commerce|selling/i, 'commerce'],
  [/software|saas|technology|tech|platform|startup/i, 'technology'],
  [/consult|agency|law|accounting|professional service|service business/i, 'professional services'],
];

function inferIndustry(text: string): string | null {
  return industryPatterns.find(([pattern]) => pattern.test(text))?.[1] ?? null;
}

const industryAdvice: Record<string, string> = {
  fashion: 'For a fashion brand, I’d shape the storefront around editorial storytelling and easy discovery: an immersive collection page, a stylist assistant that learns occasion and fit, and recommendations based on what shoppers actually browse.',
  healthcare: 'For a healthcare experience, the first win is clarity and confidence: plain-language service pages, a thoughtful intake journey, and an assistant that can guide people to the right next step without trying to diagnose them.',
  restaurant: 'For a restaurant, I’d bring the experience to life before someone walks in: a richly visual menu, frictionless booking, and an assistant that can answer practical questions about hours, dietary needs, and private dining.',
  commerce: 'For a commerce brand, I’d connect discovery to decision: an editorial storefront, useful product guidance, and recommendations that make the next best choice feel personal rather than pushy.',
  technology: 'For a technology product, I’d make the value easy to understand: a clear product story, an interactive demo, and an assistant that turns a visitor’s use case into a relevant product path.',
  'professional services': 'For a services business, I’d build trust before the first call: focused expertise pages, a guided project brief, and an assistant that helps a prospect understand the right next step.',
};

function createMockProvider(): AiProvider {
  return {
    async sendMessage(messages, input) {
      await wait(680 + Math.min(input.length * 5, 300));
      const allUserText = [...messages.filter((message) => message.role === 'user').map((message) => message.content), input].join(' ');
      const lower = input.toLowerCase();
      const industry = inferIndustry(allUserText);
      const userTurns = messages.filter((message) => message.role === 'user').length;

      if (/price|cost|budget|how much|pricing/i.test(lower)) {
        return 'A useful first step is to scope the outcome, not guess at a number. A focused launch experience is very different from a full product platform with custom AI. I’d map the essential pages, interactions, and integrations first—then shape a realistic build plan. What needs to be in version one?';
      }

      if (/how.*ai|ai.*help|use ai|artificial intelligence/i.test(lower)) {
        const contextLine = industry && industryAdvice[industry]
          ? industryAdvice[industry]
          : 'AI is most useful when it removes a real point of friction: helping a visitor find the right thing, get a confident answer, or take the next step without waiting.';
        return `${contextLine} I’d start with one high-value moment, make it genuinely helpful, and keep a clear path to a human when needed. Where do customers tend to get stuck today?`;
      }

      if (/feature|recommend|should (i|we) build|what kind of|website/i.test(lower) && industry) {
        const goal = /lead|inquir|book|contact/i.test(allUserText) ? 'lead generation' : /brand|awareness|stand out/i.test(allUserText) ? 'brand building' : 'a clear customer journey';
        return `${industryAdvice[industry]} For your goal of ${goal}, I’d make the main action obvious from the first screen and use AI to support the decision—not distract from it. What should a new visitor be able to do in their first minute?`;
      }

      if (industry && userTurns <= 1) {
        return `${industryAdvice[industry]} The right starting point depends on your most important customer action. Is your priority to drive sales, generate enquiries, or make the experience more useful for people who already know you?`;
      }

      if (/design|look|visual|style|feel/i.test(lower)) {
        return 'I’d give the visual system a strong point of view, then let the interactions do the work: a memorable first impression, clear hierarchy, and motion that explains what is possible. The most polished result still needs to feel unmistakably like your business. Do you have a reference mood, or should we define one together?';
      }

      if (/hello|hi\b|hey\b|start|begin/i.test(lower) && userTurns <= 1) {
        return 'Hi, I’m faratech_lab—your first-pass digital experience strategist. Tell me what you do and what you want the website to change for your business. I’ll help turn that into a useful starting point.';
      }

      if (industry) {
        return `${industryAdvice[industry]} Based on what you’ve shared, I’d prototype the key customer moment first, then add the smallest useful AI layer around it. If you could improve one thing about the experience today, what would it be?`;
      }

      if (userTurns >= 2) {
        return 'That gives us a good direction. I’d turn it into a small first release: one clear audience, one primary action, and one intelligent interaction that earns its place. From there we can measure what helps and build on what works. Want to explore the structure, visual direction, or AI features next?';
      }

      return 'A strong first version starts with the people you want to reach and the moment you want to improve for them. From there, we can shape the right mix of story, interaction, and AI—without adding complexity just for the sake of it. What does success look like for your business?';
    },

    async generateRecommendation(answers) {
      await wait(720);
      const industry = answers.industry.toLowerCase();
      const goal = answers.goal.toLowerCase();
      const style = answers.style;
      let title = 'Intelligent Digital Experience';
      let category = 'A considered starting point';
      let features = ['A clear, conversion-focused landing page', 'An AI assistant for useful first answers', 'A tailored path to the right next step'];
      let summary = `A ${style.toLowerCase()} experience built around what ${answers.industry.toLowerCase()} customers need most.`;
      let rationale = `The ${style.toLowerCase()} direction pairs with your goal to ${goal.toLowerCase()}, while keeping the experience focused on real customer value.`;

      if (industry.includes('fashion')) {
        title = 'Premium AI Commerce Experience';
        category = 'Made for fashion';
        features = ['AI styling assistant for fit, occasion, and discovery', 'Personalized product recommendations', 'Editorial collection pages with shoppable stories', 'A conversion-focused mobile storefront'];
        summary = 'A distinctive storefront that makes finding a personal point of view feel effortless.';
      } else if (industry.includes('health')) {
        title = 'Human-Centered Care Platform';
        category = 'Made for healthcare';
        features = ['Plain-language service and care journeys', 'A safe assistant for navigation and FAQs', 'Accessible appointment and intake flows', 'Clear hand-off to a care professional'];
        summary = 'A calm, confidence-building digital front door that helps people find the right care information.';
      } else if (industry.includes('restaurant')) {
        title = 'Intelligent Hospitality Experience';
        category = 'Made for hospitality';
        features = ['Visual, easy-to-browse menu experience', 'Reservation and private-event guidance', 'A guest assistant for practical questions', 'Location-aware hours and visit details'];
        summary = 'A warm digital welcome that turns curiosity into a memorable visit.';
      } else if (industry.includes('commerce') || industry.includes('e-commerce')) {
        title = 'Adaptive Commerce Experience';
        category = 'Made for retail';
        features = ['Guided product discovery', 'Personalized recommendations', 'An AI assistant for product questions', 'A faster path from browse to checkout'];
        summary = 'A flexible shopping experience that helps people move from browsing to the right choice.';
      } else if (industry.includes('tech')) {
        title = 'Interactive Product Platform';
        category = 'Made for technology';
        features = ['An interactive product explainer', 'Use-case based onboarding', 'An assistant for product discovery', 'Focused conversion paths for each audience'];
        summary = 'A product story that makes complex technology easier to understand and try.';
      } else if (industry.includes('professional')) {
        title = 'Intelligent Services Studio';
        category = 'Made for services';
        features = ['A clear expertise-led brand experience', 'A guided project discovery assistant', 'Focused service pages for high-intent visitors', 'A concise, useful enquiry flow'];
        summary = 'A high-trust digital presence that makes expertise easier to understand and act on.';
      }

      if (/brand/i.test(goal)) {
        features = ['A distinctive editorial brand story', 'Immersive, art-directed landing experience', ...features.slice(0, 2)];
        rationale = `Your ${style.toLowerCase()} direction gives the brand room to be memorable; intelligent details then make that first impression useful for ${answers.industry.toLowerCase()} audiences.`;
      } else if (/lead|generat/i.test(goal)) {
        features = ['A focused landing page for high-intent visitors', 'A guided AI enquiry assistant', 'Clear proof points and conversion paths', features[features.length - 1]];
      } else if (/support|automat/i.test(goal)) {
        features = ['An always-available assistant for common questions', 'Thoughtful escalation to a real person', 'A searchable, structured knowledge base', features[0]];
      } else if (/customer experience|experience/i.test(goal)) {
        features = ['Personalized journeys for different visitor needs', 'An assistant that understands context', 'Accessible, low-friction interactions', features[0]];
      }

      return { title, summary, rationale, features: [...new Set(features)].slice(0, 4), category };
    },
  };
}

/**
 * Adapter for a future same-origin backend. Keep provider credentials on the server;
 * this client sends only conversation data to your own API routes.
 */
export function createHttpProvider(basePath = '/api/ai'): AiProvider {
  return {
    async sendMessage(messages, input) {
      const response = await fetch(`${basePath}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, input }),
      });
      if (!response.ok) throw new Error('The assistant could not respond right now. Please try again.');
      const data: { reply?: string } = await response.json();
      if (!data.reply) throw new Error('The assistant returned an empty response. Please try again.');
      return data.reply;
    },
    async generateRecommendation(answers) {
      const response = await fetch(`${basePath}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!response.ok) throw new Error('We could not build a recommendation right now. Please try again.');
      return response.json() as Promise<ExperienceRecommendation>;
    },
  };
}

// The default is an offline mock. Set VITE_AI_PROVIDER=http only after you have
// deployed the matching same-origin backend routes; provider keys stay server-side.
const providerMode = import.meta.env.VITE_AI_PROVIDER;
const apiBasePath = import.meta.env.VITE_AI_API_BASE ?? '/api/ai';
let provider: AiProvider = providerMode === 'http'
  ? createHttpProvider(apiBasePath)
  : createMockProvider();

export const aiService = {
  sendMessage(messages: ChatMessage[], input: string) {
    return provider.sendMessage(messages, input);
  },
  generateRecommendation(answers: DiscoveryAnswers) {
    return provider.generateRecommendation(answers);
  },
  setProvider(nextProvider: AiProvider) {
    provider = nextProvider;
  },
};
