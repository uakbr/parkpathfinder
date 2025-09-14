# Repository Guidelines

## Project Structure & Module Organization
- `client/` – React + Vite UI (Tailwind, shadcn/ui). Entry: `src/main.tsx`, routes in `src/pages/` and components in `src/components/`.
- `server/` – Express API and dev server glue. Routes in `routes.ts`, AI logic in `ai.ts`, static serving in `vite.ts`.
- `shared/` – Cross‑shared types and Drizzle schema (`schema.ts`).
- Build output: `dist/` (`dist/public` for client assets).

## Build, Test, and Development Commands
- `npm run dev` – Starts Express on port 5000 and mounts Vite middleware for the client.
- `npm run build` – Builds client via Vite and bundles server via esbuild into `dist/`.
- `npm start` – Runs the production bundle (`NODE_ENV=production node dist/index.js`).
- `npm run check` – Type-checks the whole repo with strict TS.
- `npm run db:push` – Applies Drizzle schema to the configured Postgres database.
 - `npm test` / `npm run test:watch` – Run Vitest unit/smoke tests.
 - `npm run smoke` – One-off API smoke (health, parks) without binding a port.

## Coding Style & Naming Conventions
- TypeScript, strict mode; prefer explicit types at module boundaries.
- Indentation: 2 spaces; trailing commas where valid; single quotes or import-style defaults.
- Files: React components in kebab-case (`park-detail.tsx`), component symbols in PascalCase, functions/variables in camelCase.
- Imports: use path aliases `@/…` (client) and `@shared/…` (shared). Keep React components pure and small.

## Testing Guidelines
- Vitest + Supertest are configured. Put tests under `tests/` named `*.test.ts(x)`.
- Keep tests deterministic; mock network/AI calls and avoid binding ports.
- Example: `tests/api.test.ts` hits `/api/health` and `/api/parks` via an in-memory Express app.

## Commit & Pull Request Guidelines
- Use imperative, present-tense summaries (≤72 chars). Recommended Conventional Commits: `feat|fix|refactor|docs|chore(scope): message` (e.g., `feat(client): add trip planner map`).
- PRs must include: brief description, linked issues, local verification steps (`npm run dev`, screenshots for UI), and note any schema changes (`npm run db:push`).

## Security & Configuration Tips
- Required env vars: `OPENAI_API_KEY` (AI features), `DATABASE_URL` (for Postgres/Drizzle). Create a local `.env`; do not commit secrets. See `.env.example`.
- The app serves on `PORT` (default 5000). In production, ensure `dist/public/` exists before `npm start`.

## CI & Deploy
- GitHub Actions: `CI` workflow runs type-checks, tests, and build on PRs and main.
- Container image: `deploy-ghcr` builds and pushes `ghcr.io/<owner>/<repo>:<tag|sha|latest>`.
- Runtime secrets: provide `OPENAI_API_KEY`, `DATABASE_URL`, and `PORT` to your container platform.
- GitHub Pages: `pages` workflow builds the client (`dist/public`) and deploys to Pages. Configure `PAGES_API_BASE_URL` repo secret to point the UI to your API.
- Configure `BASE_PATH` automatically for project pages (`/<repo>/`).
