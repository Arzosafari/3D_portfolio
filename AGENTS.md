# Working notes for automated/agent sessions

## What this project is
Frontend-only Vite + React 19 + TypeScript SPA (`nova-ai-studio`): a 3D portfolio
site using react-three-fiber/three. There is **no server-side code in this repo**.

## Run it (Base44 sandbox)
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
This runs the repo's own `npm run dev` (Vite) from the bind-mounted source on
container port 5173, published as host port **3000**. Live reload works through
the bind mount (the mount is local to the Docker VM, so inotify fires normally —
no polling needed).

## Dependencies
`node_modules` is not committed and `node_modules/` is gitignored. The Compose
`command` runs `npm ci` on startup when `node_modules` is missing or
`package-lock.json` is newer than it. If you add/ship a dependency, nothing extra
is required — the next container start picks it up from the lockfile. Because the
source is bind-mounted, edits need no image rebuild.

## Environment / credentials
None required. `VITE_AI_PROVIDER` defaults to `mock`, so the AI assistant
(`/assistant`) and discovery flow (`/discovery`) work fully offline with a local
mock provider (`src/services/aiService.ts`). `.env.example` only documents an
optional future HTTP provider (`VITE_AI_PROVIDER=http` +
`VITE_AI_API_BASE=/api/ai`), which needs backend routes that do not exist here.
No `VITE_*` file or `.env` is needed to boot.

## No database
There is no DB, migration or seed step.

## /admin is not functional here
`src/admin/*` (login + projects/team CRUD) is hardcoded to a **separate Laravel
backend at `http://localhost:8000/api`** (`src/admin/api.js`) that lives outside
this repository (see `ADMIN_PANEL_README.md`). The login page renders, but any
login/CRUD request fails because that backend is not part of this checkout. This
is expected, not a sandbox misconfiguration. Making `/admin` work would mean
building or importing that backend — out of scope unless the user asks.

## Host / origin
`vite.config.ts` already sets `server.allowedHosts: true` and
`server.host: '0.0.0.0'`, so the preview's proxied host and origin are accepted
without sandbox-specific overrides. No `BASE44_*` value is hardcoded anywhere.

## Checks (optional, host-side)
```bash
npx tsc -b     # strict TypeScript pass
npm run smoke  # jsdom render test of every page, scene host, route→world map
```
These run through the project's own tooling and are not wired into the container.

## Verifying the app actually works
Load `http://localhost:3000/` and confirm the served HTML contains
`/@vite/client` and `/@react-refresh` — that proves the live dev server (not a
prebuilt bundle) is serving the cloned source. Then load `/`, `/work`,
`/ai-lab` and `/admin` (login screen) and confirm the nav plus page content
render with no console errors. WebGL scenes fall back to a CSS navy environment
where WebGL is unavailable; that fallback is intentional.
