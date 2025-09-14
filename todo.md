# Journal (time-stamped entries only)
[2025-09-14T00:52-04:00] [Agent 1 - Plan Synthesizer] Parsed @task.md and created @plan.md with phased approach and success metrics.
[2025-09-14T00:53-04:00] [Agent 2 - Implementation] Starting critical path: T-001 (error handler), then T-002 (Vite types).
[2025-09-14T01:18-04:00] [Agent 2 - Implementation] Added CI (ci.yml), GHCR deploy workflow, Dockerfile, and .dockerignore.
[2025-09-14T01:26-04:00] [Agent 2 - Implementation] Added GitHub Pages deploy for client with `BASE_PATH` and `VITE_API_BASE_URL` support. Updated client to use `VITE_API_BASE_URL` and made Vite base configurable.

# Architecture (Current)
- Express API with routes in `server/routes.ts`; dev uses Vite middleware (`server/vite.ts`), prod serves `dist/public`.
- In-memory storage via `MemStorage`.
- Error middleware rethrows causing potential crashes.

# Architecture (Target)
- Same topology, but: non-crashing error middleware; `/api/health`; sanitized request logging; `PORT` override; dotenv dev-only loader.

# Decisions (ADR-style, compact)
- 2025-09-14: Load dotenv via dynamic import in dev to avoid prod dependency; import `server/env.ts` before other modules.
- 2025-09-14: Fix Vite types using `satisfies ServerOptions` to keep literals (no behavior change).

# Backlog (Kanban)
## Backlog
## In-Progress
## Blocked
## Done
- [2025-09-14T00:58-04:00] T-001: Removed rethrow; added structured error logging; guarded body logging via `LOG_RESP_BODY`. Files: `server/index.ts`.
- [2025-09-14T00:59-04:00] T-002: Fixed Vite types using `satisfies ServerOptions`; `npm run check` passes. Files: `server/vite.ts`.
- [2025-09-14T01:01-04:00] T-003: Added `.env` to `.gitignore`, created `.env.example`, and dev-only dotenv loader (`server/env.ts`). Added `dotenv` dep. Files: `.gitignore`, `.env.example`, `server/env.ts`, `package.json`.
- [2025-09-14T01:02-04:00] T-005: Added `/api/health` endpoint. File: `server/routes.ts`.
- [2025-09-14T01:03-04:00] T-006: Enabled `PORT` override. File: `server/index.ts`.
- [2025-09-14T01:04-04:00] T-004: Declared `nanoid` as direct dependency. File: `package.json`.
- [2025-09-14T01:05-04:00] T-008: Redacted response-body logging by default with opt-in flag. File: `server/index.ts`.
 - [2025-09-14T01:12-04:00] T-007: Added Vitest + Supertest tests and config; `npm test` passes. Files: `vitest.config.ts`, `tests/api.test.ts`.
 - [2025-09-14T01:18-04:00] CI/Deploy: Added `.github/workflows/ci.yml` and `.github/workflows/deploy-ghcr.yml`; Dockerized app (`Dockerfile`, `.dockerignore`).
 - [2025-09-14T01:26-04:00] Pages: Added `.github/workflows/pages.yml`; updated `client/src/lib/queryClient.ts` to honor `VITE_API_BASE_URL`; set dynamic `base` in `vite.config.ts`.
## Blocked

# Risks & Mitigations (live)
- HMR changes risk: only adjust types; verify dev compiles.
- Logging PII risk: remove response-body logging by default; opt-in via env.

# Test Matrix & Results
- 2025-09-14T01:08-04:00 `npm run check` → 0 (green).
- 2025-09-14T01:09-04:00 `npm run smoke` →
  - `/api/health` 200 with `{status:'ok', uptime: number, env: 'development'}`
  - `/api/parks` 200 with items=5 (from in-memory fixtures).
- 2025-09-14T01:12-04:00 `npm test` → passed 2/2 (health and parks).
 - 2025-09-14T01:18-04:00 GH Actions YAML validated locally; will run on next push to main/PR.
 - 2025-09-14T01:26-04:00 Build with `BASE_PATH=/<repo>/` succeeded locally; Pages workflow ready.

# Monitoring & Rollback Notes
- Rollback by reverting patches to `server/index.ts` and `server/vite.ts`.

# Future Work / Ideas
- Add CI with type-check + tests; add runtime request ID and correlation logging; DB-backed storage switch.

# Changelog (what shipped when)
- 2025-09-14: Initialized todo.md and started T-001/T-002.
- 2025-09-14: Shipped T-001..T-008; type-checks green; tests and smoke successful.
