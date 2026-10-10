/**
 * Shared 3D design tokens — the white & navy visual universe.
 * Every page scene draws its palette, fog, lighting colors and motion
 * timing from these constants so the site reads as one connected world.
 */

export const PALETTE = {
  /** Deep midnight navy — cinematic backgrounds, fog, shadows. */
  midnight: '#07152F',
  /** Dark blue — mid-tone environment surfaces. */
  deep: '#0B1F3A',
  /** Rich navy — structural geometry base color. */
  navy: '#102B50',
  /** Pure white — key light, typography, bright edges. */
  white: '#FFFFFF',
  /** Soft off-white — panels, secondary surfaces. */
  offWhite: '#F5F7FB',
  /** Cool silver — metal architecture, reflections. */
  silver: '#DCE4EF',
  /** Restrained icy blue — accents, active states, focal light. */
  ice: '#8CB8F5',
  /** Deeper ice for gradients and fills. */
  iceDeep: '#5E93DC',
  /** Muted steel blue for distant structure. */
  steel: '#31517E',
} as const;

/** Fog presets per environment mood. */
export const FOG = {
  home: { color: PALETTE.midnight, density: 0.024 },
  work: { color: '#081B38', density: 0.03 },
  capabilities: { color: PALETTE.midnight, density: 0.028 },
  lab: { color: '#050F24', density: 0.034 },
  team: { color: PALETTE.deep, density: 0.026 },
  about: { color: PALETTE.midnight, density: 0.022 },
  contact: { color: '#081B38', density: 0.026 },
  corridor: { color: PALETTE.midnight, density: 0.02 },
} as const;

/** Shared motion language: damping lambdas (higher = snappier). */
export const MOTION = {
  cameraDamp: 1.9,
  cameraFovDamp: 1.6,
  objectDamp: 1.4,
  colorDamp: 1.35,
  pointerDamp: 2.1,
  /** Seconds for a page scene's boot reveal. */
  bootDuration: 2.4,
} as const;

/** Camera parallax amplitude driven by pointer position. */
export const PARALLAX = { x: 0.34, y: 0.18 } as const;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Cubic ease-out — the studio's standard reveal curve. */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

export const isNarrow = () => typeof window !== 'undefined' && window.innerWidth < 680;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
