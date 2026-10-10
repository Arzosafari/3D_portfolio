/**
 * The studio's real capabilities, shared by the Capabilities system,
 * its 3D node structure and the Home preview.
 */

export interface Capability {
  number: string;
  title: string;
  short: string;
  detail: string;
  tag: string;
  symbol: string;
}

export const capabilities: Capability[] = [
  {
    number: '01',
    title: 'AI-powered websites',
    short: 'Useful intelligence, built into the journey.',
    detail: 'From a first-time visitor’s question to a returning customer’s next step, we add AI where it makes a digital experience more helpful—not more complicated.',
    tag: 'INTELLIGENT BY DESIGN',
    symbol: '✳',
  },
  {
    number: '02',
    title: '3D & interactive experiences',
    short: 'A little depth. A lot more feeling.',
    detail: 'We use interaction, movement, and dimensional visuals to make a brand feel memorable while keeping the experience clear, fast, and accessible.',
    tag: 'BUILT TO BE FELT',
    symbol: '◈',
  },
  {
    number: '03',
    title: 'Intelligent assistants',
    short: 'Conversations with a real job to do.',
    detail: 'Purpose-built assistants can guide discovery, answer product questions, qualify a project, or route a customer to the right person with context intact.',
    tag: 'HUMAN WHEN IT MATTERS',
    symbol: '↗',
  },
  {
    number: '04',
    title: 'Personalized experiences',
    short: 'Relevant journeys, without the noise.',
    detail: 'Thoughtful content and product recommendations adapt to what someone needs, helping each visitor find a better path through your digital world.',
    tag: 'RELEVANT, NOT INTRUSIVE',
    symbol: '◎',
  },
];
