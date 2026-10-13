# faratech_lab — Immersive 3D Portfolio

A responsive creative-technology studio website built as **one connected 3D universe of distinct page worlds**, in a white-and-navy design system. Every route keeps its own page, content and behavior; behind each one renders a purpose-built WebGL environment — never the same scene with different labels.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev        # Vite dev server (prints a local URL, usually http://localhost:5173)
```

For a production build:

```bash
npm run build
npm run preview
```

Checks:

```bash
npx tsc -b         # strict TypeScript pass
npm run smoke      # jsdom render test of every page, the scene host and the route→world map
```

The experience uses no API key, account, external image, HDRI, or paid service. All 3D textures (interface wireframes, project artwork, monograms, grids, glows) are drawn procedurally at runtime. Chat and discovery use a local mock AI provider by default and work offline. Optional provider settings are documented in `.env.example`.

## Pages & their 3D worlds

| Route | Page | World (concept) |
| --- | --- | --- |
| `/` | Home | **Meridian Atrium** — a silver-ribbed architectural corridor the camera flies through as you scroll: entry → work wall → capability monoliths → intelligence core → contact portal |
| `/work` | Work | **The Exhibition** — each real concept project is a framed installation over a plinth with a subject-specific motif; hovering/opening a card flies the camera to it |
| `/capabilities` | Capabilities | **The System** — four monoliths crowned by discipline emblems, tied by light beams to a central hub; selecting a capability moves the camera to that node |
| `/ai-lab` | AI Lab | **The Lattice** — a computational node field around a reasoning core; the four working demos drive data-flow behavior (converge / expand / orbit / sweep) |
| `/our-team` | Our Team | **The Atelier** — a warm studio hall with floating portrait installations (monograms from real names until photography exists) |
| `/about` | About | **Strata** — four luminous architectural layers; scrolling lifts the camera through the narrative |
| `/contact` | Contact | **The Portal** — a minimal luminous gate; the camera approaches as you scroll toward the real contact actions |
| `/assistant`, `/discovery`, `/process` | Working tools | **The Corridor** — the original persistent vault corridor, reacting to the AI request lifecycle and the discovery profile |
| `/admin` | Admin panel | No scene (functional CRUD panel, unchanged) |

## Architecture

```text
src/
├── App.tsx                         # Routes (unchanged URLs), layouts, scroll restoration
├── main.tsx                        # Entry + self-hosted fonts (Space Grotesk, Inter variable)
├── styles.css                      # White-and-navy design system, all component styles
├── data/                           # Single source of truth shared by pages and scenes
│   ├── projects.ts  capabilities.ts  labFeatures.ts  team.ts
├── environment/
│   ├── EnvironmentProvider.tsx     # Scroll/pointer refs, active section, AI state, profile, focus channel
│   ├── SceneHost.tsx               # Route-aware host: one lazy canvas at a time, transition veil, WebGL fallback
│   ├── SceneCanvas.tsx             # Shared render surface (dpr caps, mobile quality budget)
│   ├── SceneLighting.tsx           # Shared navy lighting rig + pointer-follow accent light
│   ├── CameraRig.tsx               # ZoneCamera (scroll/focus-driven), PointerDrift, boot reveal
│   ├── textures.ts                 # Procedural canvas textures (glow, grid, interfaces, project art, monograms)
│   ├── tokens3d.ts                 # 3D palette, fog presets, motion timing
│   ├── EnvironmentScene.tsx        # Corridor world (assistant/discovery/process)
│   └── scenes/                     # One world per page + shared sceneParts (beams, floors, dust, pools)
├── components/  features/  pages/  # Existing site structure, preserved content
└── services/aiService.ts           # Offline mock + provider interface + same-origin HTTP adapter
```

**Design tokens.** Deep midnight navy `#07152F`, dark blue `#0B1F3A`, rich navy `#102B50`, pure white, off-white `#F5F7FB`, cool silver `#DCE4EF`, and a single restrained icy-blue highlight `#8CB8F5` for lighting, active states, and focal points. **White pages, navy worlds.** Navy carries the cinematic environments — the 3D world each route opens with. Everything readable is a white page printed on top of that world: navy ink, light rules, and one icy-blue accent. Home opens directly inside its atrium world; every other route renders a `.world-band` slice of its world above the white page.

**Focus channel.** Page UI and its world stay in sync through `setFocus()` on the environment provider (`work:0`, `cap:2`, `lab:search`, `team:1`…). Scenes read `focusRef` inside `useFrame`, so hovering a card moves the camera without re-rendering the 3D tree.

**Page transitions.** Navigating between routes paints a brief non-blocking veil sweep (pointer-events: none, skipped for reduced motion) while the new world fades in — continuity without ever delaying navigation. Browser back/forward, direct URLs and refresh all work: each route is a real page.

## Performance & accessibility

- Exactly **one WebGL canvas mounted at a time**; scene modules are route-split and lazy (per-scene chunks in `dist/`).
- Pixel-ratio caps, disabled antialiasing, reduced geometry counts and simplified interactions on narrow viewports; adaptive camera framing for portrait aspect ratios.
- `prefers-reduced-motion`: cameras hold a single composed frame, boot reveals complete instantly, CSS animation/transition durations collapse, the transition veil is skipped.
- No WebGL: a layered CSS navy environment replaces the canvas; all content remains fully readable.
- All content is real HTML: semantic sections, keyboard-accessible navigation with visible focus and `aria-current` page state, dialog-based project details, labeled forms and controls. Nothing essential is hover-only or canvas-only.
- EN/FA bilingual with full RTL support (unchanged language toggle in the nav).

## AI architecture / connecting a real model

`src/services/aiService.ts` separates AI business logic from the React UI: an `AiProvider` contract, a working local mock, and a same-origin `createHttpProvider()` adapter expecting:

- `POST /api/ai/chat` with `{ messages, input }`, returning `{ reply: string }`
- `POST /api/ai/recommend` with `{ industry, goal, style }`, returning an `ExperienceRecommendation`

To use the adapter after deploying those backend routes, set `VITE_AI_PROVIDER=http` and `VITE_AI_API_BASE=/api/ai`. Implement the routes server-side and **never put provider credentials in a `VITE_*` variable or frontend code.** With HTTP mode disabled, the assistant and recommendation flow remain fully usable offline.

## Admin panel

See `ADMIN_PANEL_README.md`. The `/admin` route (Laravel-backed CRUD for projects and team members) is intentionally left as a purely functional tool — no scene is mounted there.
