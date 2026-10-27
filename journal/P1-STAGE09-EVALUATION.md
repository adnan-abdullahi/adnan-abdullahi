# Stage 09 — Evaluation Journal

**Project:** Project 01 — Professional Engineering Portfolio  
**Stage:** 09 of 10  
**Started:** 2026-10-27  
**Governing plan:** `docs/STAGE-09-EVALUATION.md`  
**Project record:** `docs/PROJECT-01.md`

## Session 01 — Stage Start, Boundary, and Baseline

**Date:** 2026-10-27  
**Position:** 09.1 — Evaluation Plan and Baseline

### Purpose

Begin Stage 09 in a controlled sequence. Integrate zero-cost deployment into the evaluation stage so the portfolio can be evaluated as a public system if feasibility and explicit authorization are established.

### Source baseline

The Stage 08 closure record reports:
- TypeScript check: 0 reported errors.
- Unit tests: 119 passed across 9 suites.
- Automated accessibility tests: 15 passed.
- End-to-end tests: 188 passed, 1 intentional mobile desktop-header skip, 0 failed.
- Production build: successful.

Sources:
- `docs/STAGE-08-ENGINEERING-IMPLEMENTATION.md`
- `journal/P1-STAGE08-ENGINEERING-IMPLEMENTATION.md`

These are recorded Stage 08 results. They do not establish public deployment, production configuration correctness, real email delivery, or live-system behavior.

### Decisions and constraints

- Stage 09 combines evaluation planning, deployment feasibility, approved deployment preparation, public deployment if authorized, live-system evaluation, and findings/closure.
- Total required monetary cost must remain zero. No paid hosting, domain purchase, subscription, or spend is allowed.
- A read-only audit precedes proposed implementation changes.
- Recommendations do not constitute authorization.
- No repository, external-account, hosting, database, or production change is authorized merely because Stage 09 has started.
- The project owner retains approval authority for material changes and deployment.

### Work completed in this session

1. Updated `docs/PROJECT-01.md` to mark Stage 09 as started and identify 09.1 as the current position.
2. Created `docs/STAGE-09-EVALUATION.md` with the stage purpose, boundary, six sequential work packages, acceptance criteria, decision controls, and open questions.
3. Established this journal as the chronological record.

### Observations versus open questions

**Recorded facts:** The Stage 08 closure record identifies a Vue 3 / TypeScript / Vite frontend, a Django REST contact backend, a MySQL configuration, a local Vite proxy to `127.0.0.1:8000`, a Windows Credential Manager dependency for migration identity, and a console email backend as the default.

**Not yet established:** A feasible zero-cost production architecture; compatibility of the existing database with free hosting; a portable and secure migration procedure; a real-email delivery route; service limits; public application behavior.

These items must be investigated in 09.2 rather than assumed.

### Verification

- Confirmed the current project record before updating it.
- Updated `docs/PROJECT-01.md` on the repository default branch.
- Created `docs/STAGE-09-EVALUATION.md` on the repository default branch.
- The repository write responses returned successful commit identifiers for both operations.
- This journal entry records planning and documentation only; no application code, database, hosting service, or external account has been changed.

### Next step

Proceed sequentially to **09.2 — Zero-Cost Deployment Feasibility and Readiness Audit**. Inspect the relevant source and configuration read-only, distinguish verified facts from unknowns, and prepare an evidence-based architecture recommendation. Do not implement, deploy, or modify external services during the audit.


---

## Session 02 — Zero-Cost Deployment Readiness Audit

**Date:** 2026-10-27  
**Position:** 09.2 — Readiness audit completed; architecture decision pending

### Method

Inspected the current GitHub source read-only, including the Vite configuration, frontend/root package scripts, Django settings and URL configuration, requirements, migration credential utility, contact API view/model/migration, and relevant repository search results. Checked current official provider documentation for Cloudflare Pages, Render Free, and TiDB Cloud Starter.

No application source or test file was changed. No external account was created or configured. No database or deployment was created.

### Findings

1. **Frontend hosting:** The Vue 3 / TypeScript / Vite frontend has a root npm workspace and `npm run build`; Vite's expected output directory is `app/dist`. Cloudflare Pages is a promising static host with a free `pages.dev` address. Its current official limits page reports 500 builds per month and a 20-minute build timeout.
2. **Production API routing:** Contact submission uses relative `/api/contact/`, while the Vite proxy sends `/api` to `http://127.0.0.1:8000` only in local development. A production API origin/configuration or equivalent approved routing arrangement is required; local behavior should be preserved.
3. **Database:** Django currently uses the MySQL backend and `mysqlclient`. TiDB Cloud Starter offers a MySQL-compatible free tier with 5 GiB row storage and 50 million request units per month for eligible free instances; its official docs say a credit card is not required and describe quota restrictions. This is a promising way to avoid a database-engine migration, but driver/schema/migration compatibility has not been tested.
4. **Migration portability:** Django settings import `credential_vault` for migration commands. The module accesses Windows-only `ctypes.windll` APIs during import. On a Linux deployment this is expected to fail; the current `ImportError` handler does not catch an `AttributeError` raised by that Windows-specific initialization. A portable, secret-safe migration process is a blocker.
5. **Health checks:** The inspected URL configuration exposes `/api/contact/`; no dedicated health-check route was found. The contact endpoint is intended for POST submissions and should not be assumed to provide a successful HTTP-200 health response.
6. **Production settings:** Secret key is required, DEBUG defaults to false, and allowed hosts/CORS are environment-controlled. However, CORS defaults to localhost origins, so production values must be configured and narrowly scoped.
7. **Email delivery:** Django defaults to console email backend, which logs messages rather than delivering them. Render Free also blocks outbound SMTP ports 25, 465, and 587. Actual notification delivery is unresolved; HTTP 201 represents database receipt, not proof of email delivery.
8. **Free hosting constraints:** Render documents that its free web service spins down after 15 minutes idle, may take about a minute to wake, uses ephemeral local storage, and is intended for hobby/testing/preview rather than production applications. Its free Postgres expires after 30 days, so it is not recommended for this contact database.
9. **No deployment configuration found:** The inspected repository search did not find a backend Dockerfile, Procfile, Render Blueprint, or dedicated health endpoint. This is an audit observation, not a request to add them without approval.

### Provisional architecture proposal

- Cloudflare Pages for the static frontend.
- Render Free Web Service for the Django API, explicitly treated as a public evaluation/demo service with cold-start and reliability limitations.
- TiDB Cloud Starter MySQL-compatible database, configured with a zero spending limit, subject to compatibility validation.
- Free provider subdomains; no paid domain or paid plan.
- A free email API remains an unresolved investigation item and must be validated before claiming live contact notifications work.

Provider references recorded in `docs/DEPLOYMENT.md`:
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Render Free limitations: https://render.com/docs/free
- TiDB Cloud Starter limits: https://docs.pingcap.com/tidbcloud/serverless-limitations/
- TiDB Cloud plan selection: https://docs.pingcap.com/tidbcloud/select-cluster-tier/
- TiDB MySQL compatibility: https://docs.pingcap.com/tidbcloud/mysql-compatibility/

### Decisions and authorization status

**Proposed, not yet authorized:** Use the architecture above for zero-cost public evaluation.

**Not authorized/performed:** Creating accounts, creating a database, configuring hosting, changing source or tests, changing database permissions, changing the database engine, configuring email, deploying, or exposing the application publicly.

### Verification and record updates

- Created `docs/DEPLOYMENT.md` with source findings, official provider references, risk register, and proposed responses.
- Updated `docs/STAGE-09-EVALUATION.md` to mark 09.1 recorded and 09.2 audit completed.
- Updated `docs/PROJECT-01.md` to reflect the current stage position and pending architecture decision.
- All these changes are documentation-only GitHub updates. The application itself remains unchanged.

### Next step

The project owner should review the provisional architecture and its limitations. Only after explicit approval should 09.3 begin with proposed implementation changes, presented for review before execution. Public deployment requires a separate explicit authorization.
