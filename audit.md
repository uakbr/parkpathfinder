# Journal (time-stamped entries only)
[2025-09-14T00:40Z] [Agent 1 - Cartographer] Scanned repo; mapped client/server/shared, build scripts, storage strategy, external deps.
[2025-09-14T00:41Z] [Agent 2 - Static Analyst] Ran type-check; found TS error in `server/vite.ts` (allowedHosts type). Noted error-handler rethrow in `server/index.ts`. Flagged undeclared `nanoid` dep and missing `.env` ignore.
[2025-09-14T00:42Z] [Agent 3 - Runtime Observer] Attempted `npm run dev`; environment cannot bind to port 5000 (ENOTSUP). Captured log. Recorded first-dev friction. Type-check currently fails.
[2025-09-14T00:43Z] [Agent 4 - Product Aligner] Identified critical paths: list parks, view map, AI recommendation, trip itinerary. Prioritized DX/robustness fixes that unblock contributors.
[2025-09-14T00:44Z] [Agent 5 - Task Synthesizer] Built ICE-scored backlog; ordered tasks to fix crash-on-error, restore `tsc` green, improve config hygiene, add health checks and minimal tests.

# Codebase Map
- Repo: single app with three workspaces
- Client (`client/`): React + Vite UI; entry `src/main.tsx`, routes in `src/pages/`, shadcn/ui components under `src/components/ui/`.
- Server (`server/`): Express API + Vite dev middleware (`index.ts`, `routes.ts`, `vite.ts`), AI via OpenAI (`ai.ts`).
- Shared (`shared/`): Drizzle ORM schema/types (`schema.ts`).
- Build: Vite emits to `dist/public`; esbuild bundles server to `dist/index.js`.

# Dependency Graph & Interfaces (minimal)
- Client → HTTP → Server `/api/*`.
- Server → Storage: in-memory `MemStorage` (default), optional Drizzle/Neon code present but not wired by default.
- Server → OpenAI API (chat completions) via `OPENAI_API_KEY`.
- Dev server → Vite middleware; Prod → static serve from `dist/public`.

# Evidence Index
- server/index.ts:42–48 error middleware rethrows -> potential process crash.
- server/vite.ts:25–31,73–88 Vite setup; `allowedHosts: true|string[]` mismatch at 26–31 (TS error), static path resolves to `dist/public` at runtime.
- package.json:7–11 scripts; no `test` script; 13–79 deps (no top-level `nanoid`).
- vite.config.ts:25–35 aliases `@`, `@shared`; build outDir `dist/public` (31–35).
- drizzle.config.ts:3–5 throws if `DATABASE_URL` missing (CLI use only).
- .gitignore:1–6 no `.env` listed.
- Type-check output: TS2322 on `allowedHosts` (server/vite.ts).
- dev.log: ENOTSUP listening on 0.0.0.0:5000 under this environment.

# Findings by Area
- Correctness: Error handler rethrows after responding (crashes process on errors).
- DX/Build: `tsc` fails due to Vite server options type; no tests configured; hardcoded port; missing health endpoint.
- Config/Security: `.env` not ignored; OpenAI/DB envs required but not documented in code; logs echo response bodies (risk of leaking data).
- Dependencies: `nanoid` imported but not declared top-level (relies on hoisting).

# Candidate Tasks Backlog (pre‑prioritization)
- Remove rethrow in error middleware; add structured logging.
- Fix Vite `ServerOptions` typing; make `allowedHosts` a valid value.
- Add `.env` to `.gitignore` and create `.env.example`; optionally `dotenv` load in dev.
- Add `/api/health` endpoint with uptime/env.
- Allow `PORT` override with `process.env.PORT ?? 5000`.
- Declare `nanoid` as a direct dependency.
- Redact/limit API response bodies in logs.
- Introduce minimal test stack (Vitest + Supertest) and smoke tests.

# Risks & Mitigations (live)
- Changing error handling could hide bugs → keep error logging; add tests.
- Tweaking Vite options could affect HMR → keep runtime behavior, change types only.
- Adding `dotenv` may conflict in prod → load only in dev.

# Prioritization Worksheet (ICE)
- Method: ICE = Impact×Confidence÷Effort (1–5 scale; lower Effort is better).
- T-001 25.0, T-002 20.0, T-003 16.0, T-005 15.0, T-006 15.0, T-004 12.0, T-008 12.0, T-007 4.0.
- Ordering chosen by score, then risk reduction and setup unblocking.

# Open Questions & Assumptions
- Use DB storage in lieu of MemStorage? Assume mem by default; DB optional via future task.
- Any auth/PII expected? Assume none for now; still avoid logging bodies.
- CI/CD present? None detected; assume local dev focus first.

# Changelog
- 2025-09-14T00:44Z Journal initialized, evidence captured, initial task list prioritized.
