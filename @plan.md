1) Task Brief
Derived from @task.md. Goals: fix crash-on-error, restore green type-checks, add health endpoint, improve env hygiene, allow PORT override, declare `nanoid`, reduce logging risk, and seed minimal tests. Constraints: minimal, backward‑compatible changes; Node ≥18; dev env may not allow binding to ports. Stakeholders: Backend/Infra, Frontend/DX, Project maintainer. Scope excludes DB swap, auth, observability, or UI redesign.

2) Success Metrics & Acceptance Criteria
- `npm run check` exits 0.
- `/api/health` returns 200 JSON with `status:"ok"` and numeric `uptime`.
- Error middleware does not terminate process; logs error once without leaking response bodies (unless opted in).
- `PORT` override works (code path present and testable without binding).
- `nanoid` added as direct dependency; install is reproducible.
- Env hygiene: `.env` ignored; `.env.example` present; dotenv loaded only in dev.

3) Phased Implementation Plan
- Phase 1: Scope & prerequisites
  - Add plan and todo scaffolds, confirm tasks and risks.
- Phase 2: Implementation & tests
  - T‑001 error handler; T‑002 Vite types; T‑003 env hygiene; T‑005 health route; T‑006 PORT override; T‑004 nanoid dep; T‑008 logging.
  - Seed test harness (skeleton) if time permits; otherwise leave as follow‑up.
- Phase 3: Rollout & monitoring
  - Verify `npm run check`; ad‑hoc run where possible; document logs and endpoints.
- Phase 4: Hardening & follow‑ups
  - Add minimal tests and CI gates; document rollback notes.

4) Architecture (minimal)
Current: React/Vite client → Express API (`/api/*`) with in‑memory storage; Vite dev middleware in dev; static serve in prod; OpenAI integration. Target: Same, with safer error handling, health endpoint, and env/port configurability. Key interfaces: Express middlewares/routes; Vite server options. Risks: HMR behavior if types change; loading dotenv in prod (mitigated via dev‑only dynamic import).

5) Backlog Summary
Epics: Reliability/DX, Config Hygiene, Observability. Stories map 1:1 to tasks T‑001…T‑008. Critical path: T‑001 → T‑002 → T‑003 → T‑005 → T‑006.

6) Risk Register & Mitigations
- Dev server HMR breakage: keep functional config; fix types only.
- Error logging silence: keep structured error logs; remove rethrow only.
- Env loader in prod: dynamic import guarded by `NODE_ENV !== 'production'`.

7) Operational Readiness
Simple gates: `npm run check` must pass; health endpoint returns 200; logs are sanitized by default. Rollback: revert the patches; no schema/data migration involved.

8) Definition of Done
Per phase: Phase 2 tasks merged and type‑checks green. Per deliverable: each task’s acceptance criteria in @task.md satisfied and documented in todo.md (Done column) with timestamp and verification notes.
