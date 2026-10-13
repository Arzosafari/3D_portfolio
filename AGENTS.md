# Working notes for automated/agent sessions

## What this project is
Vite + React 19 + TypeScript SPA (3D portfolio, react-three-fiber/three) with a
small Node backend for the AI Lab. Two app services, no database.

## Design: white pages, navy worlds
The 3D environments are navy and are always the backdrop
(`.environment-stage`). Every readable surface is a **white page** on top of
them: `.section-shell` and the per-page section classes are white with navy ink.
`styles.css` ends with a `WHITE PAGES, NAVY WORLDS` layer that governs the navy
world theme above it. `MainLayout` (`src/App.tsx`) renders a `.world-band` — a
slice of the live world — above every route except `/`, which opens inside the
home hero. Only the environment, the home hero, the principle strip and the
footer stay navy.

## Run it (Base44 sandbox)
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- **web** — the repo's own `npm run dev` (Vite) from the bind-mounted source,
  container port 5173 → host port **3000**. Live reload works through the bind
  mount (the mount is local to the Docker VM, so inotify fires; no polling needed).
- **api** — `node index.mjs` from `./server`, container port 4000, **not**
  published. The Vite dev server proxies `/api` to it (`VITE_API_PROXY_TARGET`
  in compose → `vite.config.ts` `server.proxy`), so the browser only ever talks
  to its own origin and the provider key stays server-side.

## Dependencies
Frontend deps live in the bind mount (`node_modules/` is gitignored). The web
service runs `npm ci` at startup when `node_modules` is missing or
`package-lock.json` is newer. **`server/` has zero dependencies on purpose** —
no install step, no lockfile, nothing to keep in sync. Node 22 has global
`fetch`, which is all the AI client needs.

## Environment / credentials
- `AI_API_KEY` — **the one secret**. Not in the repo; delivered at runtime to
  `/run/base44/app.env` (listed last in `env_file:`, so it always wins). Without
  it every AI tool returns an honest 503 (“not connected yet”) — it never falls
  back to scripted answers.
- `AI_BASE_URL` / `AI_MODEL` — non-secret defaults in `.env.base44-defaults`,
  set to **OpenRouter** (`https://openrouter.ai/api/v1`, `openai/gpt-4o-mini`).
  Any OpenAI-compatible endpoint works (`{AI_BASE_URL}/chat/completions`); the
  file carries the one-line Groq swap (`https://api.groq.com/openai/v1`,
  `llama-3.3-70b-versatile`). No code change needed either way.
- `VITE_AI_PROVIDER=http` + `VITE_AI_API_BASE=/api/ai` (compose `environment:`)
  switch the frontend AI service to the real backend. This is site-wide: the
  `/assistant` and `/discovery` pages also use it, so before the key is added
  they show an error rather than scripted mock answers — deliberate.

## Checks
```bash
docker compose -f docker-compose.base44.yml exec -T web npx tsc -b    # strict TS
docker compose -f docker-compose.base44.yml exec -T web npm run smoke # jsdom render of every page
```
`npm run smoke` asserts on **rendered HTML strings**, so text containing `&`
must be written `&amp;` in its expectations (`'Research &amp; paper explainer'`).

## Verifying the AI pipeline without a real key
The whole request/response path (server → provider → validated structured JSON →
tool) can be exercised with a stub provider. Run a tiny OpenAI-compatible server
that answers `/chat/completions` with canned JSON, then start a second copy of
the API on another port pointed at it:
```bash
AI_API_KEY=test AI_BASE_URL=http://127.0.0.1:4999/v1 PORT=5000 node /app/index.mjs
```
That proves plumbing, not model quality — never report it as a live-AI result.
`GET /api/health` reports `aiConfigured`, which the lab shows as its status badge.

## Architecture notes
- `server/index.mjs` holds routes, input ceilings, per-IP rate limiting (24
  requests / 5 min) and error mapping; `provider.mjs` is the OpenAI-compatible
  client (timeouts, honest status mapping, one JSON retry); `prompts.mjs` holds
  system prompts; `knowledge.mjs` is the **grounding source for the portfolio
  assistant** — update it when real profile/project facts arrive.
- `chatJson` validates structured replies against a per-tool schema and retries
  once before failing, so a malformed model reply is never rendered as content.
- The lab tools live in `src/features/lab/tools/`; each drives the 3D Lattice
  scene through the environment focus channel (`lab:<scene>`), so the scene needs
  to know nothing about the tools.

## Not implemented (do not claim otherwise)
PDF upload/extraction in the paper explainer (text paste only); interactive
per-concept diagrams; persistence of outfit feedback (in-session only, used to
re-run the same request); any storage/accounts. There is no DB.

## Outstanding content work
The brand is now `faratech_lab`. The site still carries invented studio fiction:
three concept projects (`src/data/projects.ts`), an Our Team page
(`src/data/team.ts`), and placeholder contact links (`hello@faratechlab.com` —
a stand-in that still needs the owner's real address — plus generic
Instagram/LinkedIn). These need the owner's real links and project details
before they are accurate. The owner's real projects (DermaSense AI, Fashion AI, Gold Price
Prediction, Dynamic Traffic Control, Robotics & Computer Vision) are currently
described only in `server/knowledge.mjs`, for the assistant.

## /admin is not functional here
`src/admin/*` is hardcoded to a separate Laravel backend at
`http://localhost:8000/api` (`src/admin/api.js`) that is **not in this repo**
(see `ADMIN_PANEL_README.md`). The login page renders; every request fails. This
is expected, not a sandbox misconfiguration.

## Host / origin
`vite.config.ts` already sets `server.allowedHosts: true` and
`server.host: '0.0.0.0'`, so the preview's proxied host and origin are accepted
without sandbox-specific overrides. No `BASE44_*` value is hardcoded anywhere.

## Verifying the app actually works
Load `http://localhost:3000/` and confirm the served HTML contains
`/@vite/client` and `/@react-refresh` — that proves the live dev server (not a
prebuilt bundle) is serving the cloned source. Then load `/`, `/work`,
`/ai-lab` and `/admin` (login screen): nav plus page content should render with
no console errors. WebGL scenes fall back to a CSS navy environment where WebGL
is unavailable; that fallback is intentional.
