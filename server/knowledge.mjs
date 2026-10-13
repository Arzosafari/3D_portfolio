/**
 * The verified portfolio knowledge used to ground the AI Portfolio Assistant.
 *
 * Everything in this file comes from information the site owner supplied.
 * Anything not listed here is UNKNOWN, and the assistant is instructed to say
 * so rather than invent it. Do not add achievements, metrics, publication
 * status, employment history or links unless the owner provides them.
 */

/** Details the owner has not supplied yet — kept explicit so nothing is guessed. */
export const UNKNOWN = [
  'the owner’s name',
  'university, degree program or graduation dates',
  'employers, internships or professional positions',
  'publications, papers or conference submissions',
  'measured results, accuracy figures or benchmarks',
  'repository, demo or dataset links',
  'datasets used, and their sizes',
  'awards, funding or honors',
];

export const owner = {
  role: 'AI graduate student, researcher and developer',
  positioning:
    'Works across AI research and applied engineering: turning research ideas into working, intelligent software systems.',
};

/** Research interests, as supplied by the owner. */
export const researchInterests = [
  'Natural language processing (NLP)',
  'Large language models (LLMs)',
  'Multimodal AI',
  'Medical AI',
  'Intelligent agents and multi-agent systems',
  'Personalized recommendation systems',
  'Reinforcement learning',
  'Computer vision',
  'AI-powered applications and intelligent software systems',
];

/**
 * Projects, with the owner's own one-line descriptions. No results, metrics,
 * publication status or links are recorded because none were provided.
 */
export const projects = [
  {
    id: 'dermasense-ai',
    title: 'DermaSense AI',
    summary:
      'A multi-agent skin-health assistance system combining skin-lesion classification, image explainability, symptom matching, and retrieval-based information.',
    areas: ['Medical AI', 'Multimodal AI', 'Intelligent agents and multi-agent systems', 'Computer vision'],
    technologies: [
      'multi-agent system design',
      'image classification',
      'model explainability',
      'retrieval-based information',
      'symptom matching',
    ],
    whatItDoes:
      'Several cooperating agents handle different parts of a skin-health question: classifying a lesion image, explaining what drove that classification, matching described symptoms, and retrieving supporting information.',
  },
  {
    id: 'fashion-ai',
    title: 'Fashion AI',
    summary:
      'A personalized outfit recommendation system combining contextual factors, global trend information, and preference learning.',
    areas: ['Personalized recommendation systems', 'AI-powered applications'],
    technologies: ['recommender systems', 'preference learning', 'context-aware modelling'],
    whatItDoes:
      'Turns context (occasion, weather, personal style) plus trend signals into outfit suggestions, and adjusts them as it learns a person’s preferences.',
  },
  {
    id: 'gold-price-prediction',
    title: 'Gold Price Prediction',
    summary:
      'A forecasting project combining time-series modeling with financial sentiment information.',
    areas: ['AI-powered applications'],
    technologies: ['time-series forecasting', 'sentiment analysis'],
    whatItDoes:
      'Combines historical price series with sentiment signals from financial text to forecast gold prices.',
  },
  {
    id: 'dynamic-traffic-control',
    title: 'Dynamic Traffic Control',
    summary: 'A reinforcement-learning project for adaptive traffic-signal control.',
    areas: ['Reinforcement learning'],
    technologies: ['reinforcement learning', 'sequential decision making', 'simulation'],
    whatItDoes:
      'Learns signal-timing policies that adapt to live traffic conditions instead of following a fixed schedule.',
  },
  {
    id: 'robotics-computer-vision',
    title: 'Robotics and Computer Vision',
    summary:
      'A robotics project involving visual recognition, state-based decisions, and obstacle avoidance.',
    areas: ['Computer vision', 'AI-powered applications'],
    technologies: ['visual recognition', 'state-based decision making', 'obstacle avoidance'],
    whatItDoes:
      'Lets a robot perceive its surroundings visually, decide based on its current state, and navigate around obstacles.',
  },
];

/** Compact context block handed to the model. Kept factual and structured. */
export function portfolioContext() {
  const lines = [];
  lines.push(`ROLE: ${owner.role}`);
  lines.push(`POSITIONING: ${owner.positioning}`);
  lines.push('');
  lines.push('RESEARCH INTERESTS:');
  researchInterests.forEach((interest) => lines.push(`- ${interest}`));
  lines.push('');
  lines.push('PROJECTS:');
  projects.forEach((project) => {
    lines.push(`- ${project.title} (id: ${project.id})`);
    lines.push(`  Summary: ${project.summary}`);
    lines.push(`  What it does: ${project.whatItDoes}`);
    lines.push(`  Research areas: ${project.areas.join(', ')}`);
    lines.push(`  Technologies: ${project.technologies.join(', ')}`);
  });
  lines.push('');
  lines.push('NOT RECORDED (never invent these, say the portfolio information does not cover them):');
  UNKNOWN.forEach((item) => lines.push(`- ${item}`));
  return lines.join('\n');
}
