/**
 * The studio's real portfolio content — self-initiated concept experiments.
 * Shared by the Work exhibition, its 3D installations and the Home preview.
 * Nothing here is invented: these are the same three concepts the site shipped with.
 */

export type ProjectArt = 'fashion' | 'health' | 'commerce';

export interface ProjectConcept {
  number: string;
  title: string;
  summary: string;
  discipline: string;
  art: ProjectArt;
  premise: string;
  features: string[];
}

export const projects: ProjectConcept[] = [
  {
    number: '01',
    title: 'AI Fashion Experience',
    summary: 'A more personal way to find your point of view.',
    discipline: 'AI COMMERCE · EDITORIAL',
    art: 'fashion',
    premise: 'A considered storefront concept for a new independent label—built around discovery, not endless scrolling.',
    features: ['Editorial collection stories', 'Conversational styling assistant', 'Preference-led product discovery'],
  },
  {
    number: '02',
    title: 'Intelligent Health Platform',
    summary: 'A calmer, clearer first step into care.',
    discipline: 'HEALTH · HUMAN-CENTERED AI',
    art: 'health',
    premise: 'A digital front door concept that turns complicated healthcare information into a clear and reassuring next step.',
    features: ['Plain-language care navigation', 'Accessible appointment journeys', 'Careful assistant with human hand-off'],
  },
  {
    number: '03',
    title: 'Smart Commerce',
    summary: 'A storefront that learns what useful means.',
    discipline: 'COMMERCE · PERSONALIZATION',
    art: 'commerce',
    premise: 'A commerce experiment for considered objects, where context and taste help the right product surface naturally.',
    features: ['Adaptive product selection', 'Contextual recommendation layer', 'Fast, mobile-first checkout journey'],
  },
];
