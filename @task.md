1) Context & Problem Statement
Type-checking fails and error handling can crash the process. Local dev is brittle (hardcoded port, missing health check, env hygiene gaps), and there are no tests. A transitive-only dependency (`nanoid`) risks unpredictable installs. These issues block contributors and increase prod risk.

2) Goals & Non-Goals
Goals: restore green `tsc`; prevent crash-on-error; add health check; improve config hygiene; enable PORT override; ensure dependencies are explicit; add minimal smoke tests; reduce logging risk.
Non-Goals: full DB migration from MemStorage; UI redesign; observability stack; auth.

3) Constraints & Assumptions
Assume Node ≥18, single service on port 5000 by default. Dev server cannot bind in this environment; validate via types and unit/smoke tests. Keep changes minimal and backwards compatible.

4) Stakeholders & Tentative Owners
Backend/Infra maintainer (server/runtime), Frontend maintainer (DX/tests), Project maintainer (releases).

5) Current State Snapshot (minimal)
- Express API with Vite middleware; static serving in prod.
- In-memory storage; Drizzle/Neon present but unused by default.
- OpenAI integration for recommendations/itineraries.
- `tsc` failing; no tests; error handler rethrows; logs include response bodies.

6) Ordered Task List
- T-001: Remove error rethrow; add structured error logging
  Why/Impact: Prevents server crashes on API errors; improves reliability.
  DoD: Middleware responds with JSON and logs error without throwing; unit test added.
  Acceptance: Triggered route error does not terminate process; log contains status/message only.
  Dependencies: none. Effort: S. Risk: Low. Evidence: server/index.ts:42–48.
- T-002: Fix Vite `ServerOptions` typing (`allowedHosts`)
  Why/Impact: Restores green `tsc`, unblocks CI and contributors.
  DoD: Replace boolean with `true` or string[]; `npm run check` passes.
  Acceptance: `tsc` exits 0 locally. Dependencies: none. Effort: S. Risk: Low. Evidence: server/vite.ts:25–31; TS2322.
- T-003: Add `.env` hygiene and dev loading
  Why/Impact: Prevents secret leaks; smooths local setup.
  DoD: Add `.env` to `.gitignore`; create `.env.example` (OPENAI_API_KEY, DATABASE_URL, PORT); `dotenv` loaded in dev only.
  Acceptance: Example file present; dev reads env; prod unaffected. Effort: S. Risk: Low. Evidence: .gitignore:1–6.
- T-005: Add `/api/health` endpoint
  Why/Impact: Simple liveness check for users/ops.
  DoD: GET `/api/health` returns `{status, uptime, env}` 200.
  Acceptance: Curl returns 200 JSON. Effort: S. Risk: Low. Evidence: no existing endpoint.
- T-006: Allow `PORT` override
  Why/Impact: Enables flexible deploys and local conflicts avoidance.
  DoD: Use `const port = Number(process.env.PORT ?? 5000)`.
  Acceptance: Server listens on supplied PORT (where supported). Effort: S. Risk: Low. Evidence: server/index.ts:59–67.
- T-004: Declare `nanoid` as direct dependency
  Why/Impact: Removes reliance on hoisting; reproducible installs.
  DoD: Add to `dependencies`; lock updated.
  Acceptance: `npm ci` installs `nanoid` top-level; dev works. Effort: S. Risk: Low. Evidence: import in server/vite.ts:10; absent in package.json.
- T-008: Reduce response-body logging
  Why/Impact: Lowers accidental data leakage risk and noisy logs.
  DoD: Log only method, path, status, duration; behind debug flag for body logging.
  Acceptance: Logs omit response JSON by default. Effort: S. Risk: Low. Evidence: server/index.ts:24–26.
- T-007: Introduce minimal tests (Vitest + Supertest)
  Why/Impact: Prevent regressions; validate health and parks list.
  DoD: Add `npm test`; tests for `/api/health` and `/api/parks` happy path using in-memory storage.
  Acceptance: `npm test` passes locally; included in CI later. Effort: M. Risk: Low. Evidence: no tests; tsconfig excludes `**/*.test.ts`.

7) Success Metrics & Acceptance Summary
- `npm run check` passes; `npm test` passes; `/api/health` returns 200; server doesn’t terminate on handled errors; logs exclude bodies by default; env hygiene in place.

8) Open Questions & Simplest Safe Assumptions
- DB vs MemStorage: continue MemStorage; add DB switch later.
- CI: assume none; future task to add.
