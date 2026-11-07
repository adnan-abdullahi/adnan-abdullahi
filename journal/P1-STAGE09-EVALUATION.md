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

---

## Session 03 — Database Compatibility, Integrity, and Reconciliation (Stages 2.3–2.8)

**Date:** 2026-11-07  
**Position:** Stage 09 Validation — Stages 2.3 through 2.8 (Reconciliation in Progress)

### Purpose

Record the verified engineering sequence for database driver compatibility, Django version alignment, database integrity auditing, model-level validation enforcement, and Git repository reconciliation.

### Verified Engineering Sequence

1. **Stage 2.3 — Cross-Platform Database Connectivity & TLS Compatibility:**
   - Identified a fatal Windows Schannel TLS 1.3 decryption defect (`SEC_E_DECRYPT_FAILURE` / `0x80090330`) in native `mysqlclient` (built against MariaDB Connector/C) when connecting to TiDB Cloud Serverless over TLS.
   - Resolved by conditionally substituting `pymysql` as `MySQLdb` in `backend/config/__init__.py` exclusively on Windows (`sys.platform == 'win32'`), utilizing Python's built-in OpenSSL stack.
   - Retained native `mysqlclient` on Linux and Render environments.
   - Implemented platform-aware TLS options in `backend/config/settings.py`: configured `ssl_mode: VERIFY_IDENTITY` for native `mysqlclient` on Linux, and `ssl: {'ca': ..., 'check_hostname': True}` for PyMySQL on Windows.

2. **Stage 2.4 & 2.5 — Django/TiDB Version Compatibility & Controlled Alignment:**
   - TiDB Cloud advertises MySQL protocol version string `8.0.11-TiDB-Serverless`.
   - Django 6.1.2 rejects MySQL versions below 8.0.13 at connection initialization (`NotSupportedError: MySQL 8.0.13 or later is required (found 8.0.11)`).
   - In Stage 2.5, aligned the Django dependency in `backend/requirements.txt` to `Django>=5.2.18,<5.3`. Django 5.2.18 LTS supports MySQL 8.0.11, resolving the initialization check without custom monkey-patching.
   - Added conditional dependency `pymysql>=1.1.1,<2.0; sys_platform == 'win32'`.

3. **Stage 2.6 — Database Integrity and Migration Compatibility Investigation:**
   - Conducted an evidence-based audit of TiDB Cloud Serverless using an approved read-only inspection account (`portfolio_mcp`).
   - Inspected global system variable: `tidb_enable_check_constraint = OFF`. In this TiDB configuration, `CHECK` constraints defined in DDL are parsed and stored in metadata, but are **not** enforced by the storage engine during `INSERT` or `UPDATE`.
   - Verified the current TiDB database baseline: `portfolio_db` contains **0 tables** and **zero migration history**.
   - Verified that `sqlmigrate contact 0001` outputs a DDL `CHECK` constraint on `delivery_status`, but due to the engine setting, raw SQL writes would bypass constraint checks.

4. **Stage 2.7 — Model-Level Data Integrity Implementation and Acceptance:**
   - Implemented application-level validation on `ContactMessage` in `backend/contact/models.py` to guard `delivery_status` against invalid values before persistence.
   - Implemented dedicated `clean_delivery_status()` validating against `STATUS_CHOICES`.
   - Overrode `clean()` to include delivery status validation in standard model validation workflows.
   - Overrode `save()` with carefully scoped validation: guards full model saves (`objects.create()`, `save()`), and guards partial updates when `'delivery_status'` is present in `update_fields`. Empty `update_fields` calls are handled safely as no-ops.
   - Added 8 dedicated unit tests in `backend/tests/test_contact_api.py` covering valid creations, valid transitions, invalid status rejection, case/whitespace boundary assertions, partial update scoping, and empty `update_fields` no-ops.
   - Completed a strictly read-only acceptance audit: 52 out of 52 backend tests passing cleanly.

5. **Stage 2.8 — Repository Inventory, Reconciliation, and Logical Commits (In Progress):**
   - Conducted read-only inventory establishing a clean working tree with 5 modified tracked files (+217 insertions, -3 deletions) and 0 untracked files.
   - Preserved all existing changes and divided them into logical, bisectable commits:
     - Commit 1 (`fix(backend)`): Cross-platform database driver and TLS configuration.
     - Commit 2 (`feat(contact)`): Model-level delivery status integrity and 8 unit tests.
     - Commit 3 (`docs(validation)`): Documentation and journal reconciliation (active).
   - Final regression verification and push handover to project owner remain in progress.

### Evidence & Verification Summary

- **Backend Test Suite:** 52 passed, 0 failures, 0 errors, 0 silenced issues (ran in ~1.1s).
- **Test Database Isolation:** Test suite executed strictly against an isolated in-memory SQLite database (`--settings=config.settings`). Zero writes occurred against TiDB.
- **Migration Status:** Zero migration drift detected via `makemigrations --dry-run` (`No changes detected`). No database migrations were executed; `portfolio_db` remains in an unmigrated 0-table baseline.
- **Application Validation Boundary:** Model validation safeguards application flows utilizing model `save()`. Direct raw SQL queries, `QuerySet.update()`, and `QuerySet.bulk_create()` / `bulk_update()` bypass Django model methods and are not protected by application-level validation.

### Status and Next Steps

Stage 2.8 is in progress. Upon completion of documentation updates, final test suite verification will be run and the push instructions will be handed over to the project owner. Live database migration and public deployment remain unexecuted and strictly gated behind project owner authorization.
