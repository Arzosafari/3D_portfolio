/**
 * The AI Lab's four working tools, shared by the lab UI and its 3D environment.
 * Each one calls a real backend route (see server/index.mjs) — none of them is a
 * scripted demo.
 */

export type LabToolId = 'portfolio-assistant' | 'fashion-studio' | 'paper-explainer' | 'concept-explorer';

/**
 * How the Lattice scene should behave while a tool is open. The scene already
 * knows these four flows (converge / expand / sweep / orbit), so the tools drive
 * it without the scene needing to know about the tools themselves.
 */
export type LabSceneMode = 'assistant' | 'recommendations' | 'search' | 'personalization';

export interface LabToolInfo {
  id: LabToolId;
  number: string;
  title: string;
  description: string;
  glyph: string;
  scene: LabSceneMode;
}

export const labTools: LabToolInfo[] = [
  {
    id: 'portfolio-assistant',
    number: '01',
    title: 'Portfolio assistant',
    description: 'Ask about the research, projects and skills on this site.',
    glyph: '↗',
    scene: 'assistant',
  },
  {
    id: 'fashion-studio',
    number: '02',
    title: 'Fashion intelligence studio',
    description: 'Build an outfit from an occasion, weather and your own wardrobe.',
    glyph: '✳',
    scene: 'recommendations',
  },
  {
    id: 'paper-explainer',
    number: '03',
    title: 'Research & paper explainer',
    description: 'Break down a paper, an abstract or a research question.',
    glyph: '◧',
    scene: 'search',
  },
  {
    id: 'concept-explorer',
    number: '04',
    title: 'AI concept explorer',
    description: 'Learn any AI concept at the depth you choose.',
    glyph: '◉',
    scene: 'personalization',
  },
];
