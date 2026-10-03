# NOVA AI STUDIO

A responsive creative-technology studio website built around one persistent architectural 3D environment. The dark, editorial experience carries through every section instead of ending at the hero; a custom corridor of metal vaults, glass information planes, floor wayfinding, and restrained data paths shifts with scrolling, assistant activity, and a visitor's discovery profile.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). The experience uses no API key, account, external image, font, HDRI, or paid service. Chat and discovery use a local mock AI provider by default and work offline.

For a production build:

```bash
npm run build
npm run preview
```

Optional provider settings are documented in `.env.example`. The default provider is the local mock.

## What's interactive

- A single fixed Canvas stays behind the whole page as the shared environment. Scroll carries the camera through the architectural sequence; pointer movement influences the camera and a soft light with eased response.
- The environment reacts to the active section and to idle, thinking, responding, discovery, and success states. The assistant's request lifecycle drives visible changes in lighting, route intensity, and data pulses.
- The discovery flow updates the environment as each answer is chosen. Industry, goal, and visual direction subtly influence accent color, architectural proportion, and panel arrangement; the generated recommendation holds a distinct success state.
- Slow scene boot reveal without loader copy, warm-white editorial typography, a near-black palette, and restrained blue-violet accents.
- Responsive navigation, expandable capabilities, a four-step process, a multi-turn business assistant with starter prompts/retry/reset, a three-step project discovery flow, four working AI Lab demos, three interactive selected concept experiments, about/contact/footer.
- Portfolio experiments are explicitly identified as self-initiated concepts, not commissioned client work.

## Project structure

```text
src/
├── App.tsx                         # Page content, persistent Canvas, section mapping
├── main.tsx                        # React/Vite entry
├── styles.css                      # Layout, dark editorial theme, responsive and reduced-motion styles
├── environment/
│   ├── EnvironmentProvider.tsx     # Active section, scroll/pointer refs, AI state, discovery profile
│   ├── EnvironmentStage.tsx        # Lazy Canvas stage and mobile rendering budget
│   └── EnvironmentScene.tsx        # One persistent architectural R3F scene
├── components/
│   ├── BrandSymbol.tsx
│   ├── Capabilities.tsx
│   ├── HowWeBuild.tsx
│   ├── Navigation.tsx
│   ├── Reveal.tsx                  # IntersectionObserver reveal
│   └── ...                         # Reusable concept presentation components
├── features/
│   ├── assistant/ChatAssistant.tsx
│   ├── discovery/DiscoveryFlow.tsx
│   ├── lab/ExperienceLab.tsx
│   └── work/SelectedExperiments.tsx
└── services/
    └── aiService.ts                # Offline mock, provider interface, same-origin HTTP adapter
```

## AI architecture / connecting a real model

`src/services/aiService.ts` separates AI business logic from the React UI. It defines the `AiProvider` contract, a working local mock, and a same-origin `createHttpProvider()` adapter. The HTTP adapter expects:

- `POST /api/ai/chat` with `{ messages, input }`, returning `{ reply: string }`
- `POST /api/ai/recommend` with `{ industry, goal, style }`, returning an `ExperienceRecommendation`

To use the adapter after deploying those backend routes, set:

```env
VITE_AI_PROVIDER=http
VITE_AI_API_BASE=/api/ai
```

Implement the routes in a server or serverless function, validate inputs and outputs there, and call OpenAI or another provider from the server. **Never put provider credentials in a `VITE_*` variable or frontend code.** With HTTP mode disabled, the assistant and recommendation flow remain fully usable offline.

## Environment and performance

The environment is an original sequence of architectural vaults with glass information planes, floor paths, signal lines, and sparse markers. It uses no stock model or image asset and avoids a decorative hero object. A single shared scene persists behind entry, capabilities, assistant, discovery, process, AI Lab, concepts, about, and contact.

The Canvas and WebGL scene are lazy-loaded, so the content renders while the scene initializes. Mobile uses a lower device-pixel ratio, disables antialiasing, and renders fewer/lower-detail vaults. The scene honors `prefers-reduced-motion` by holding the camera and structure still while retaining state and color feedback. Page content remains semantic, keyboard accessible, and readable over the environment; no external stylesheets, fonts, or imagery are required.
