/**
 * The AI Lab's real interactive concepts, shared by the lab UI and its
 * computational 3D environment. Each has a working demo on the page.
 */

export type LabFeature = 'assistant' | 'recommendations' | 'personalization' | 'search';

export interface LabFeatureInfo {
  id: LabFeature;
  number: string;
  title: string;
  description: string;
  glyph: string;
}

export const labFeatures: LabFeatureInfo[] = [
  { id: 'assistant', number: '01', title: 'AI assistant', description: 'Useful answers, built around your brand.', glyph: '↗' },
  { id: 'recommendations', number: '02', title: 'Smart recommendation', description: 'Help people find their next best choice.', glyph: '✳' },
  { id: 'personalization', number: '03', title: 'Personalization', description: 'A relevant experience for every visitor.', glyph: '◉' },
  { id: 'search', number: '04', title: 'Intelligent search', description: 'Understand the intent behind a question.', glyph: '⌕' },
];
