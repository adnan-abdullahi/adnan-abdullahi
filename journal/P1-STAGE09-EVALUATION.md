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


---

## Session 04 — Stage 2.9: Controlled TiDB Initial Database Migration

**Date:** 2026-11-08
**Position:** Stage 2.9 — Initial Database Migration & Least-Privilege Verification

### Purpose

Execute the initial database schema migration for the contact application (`contact/0001_initial`) against the live TiDB Cloud Serverless database under strict credential and privilege segregation, and verify post-migration schema integrity.

### Target Database Environment

- **Database Engine:** TiDB Cloud Serverless
- **Reported Engine Version:** `8.0.11-TiDB-v8.5.3-serverless`
- **Region:** `eu-central-1` (AWS)
- **Gateway Endpoint:** `gateway01.eu-central-1.prod.aws.tidbcloud.com:4000`
- **Database Name:** `portfolio_db`
- **Pre-Migration Baseline:** Clean unmigrated database with 0 tables and zero migration history.
- **Engine Constraint Variable:** `tidb_enable_check_constraint = 0` (Django emitted warning `models.W027` noting un-enforced DDL `CHECK` constraints).

### Identity and Privilege Separation Architecture

The system enforces strict least-privilege role segregation between migration operations and runtime application execution:

1. **Migration Account (`2b7q2qfZv9FUWMC.migrator`):**
   - Active Grants: `GRANT USAGE ON *.* TO '2b7q2qfZv9FUWMC.migrator'@'%'` and `GRANT SELECT, INSERT, CREATE, INDEX ON portfolio_db.* TO '2b7q2qfZv9FUWMC.migrator'@'%'`.
   - Operational Scope: Used exclusively for running schema migrations via `manage.py migrate`.
   - Security Boundary: Zero administrative privileges, zero `ALTER`, zero `DROP`, zero `DELETE`.
2. **Runtime Application Account (`2b7q2qfZv9FUWMC.portfolio_user`):**
   - Active Grants: `GRANT USAGE ON *.* TO '2b7q2qfZv9FUWMC.portfolio_user'@'%'` and `GRANT SELECT, INSERT, UPDATE ON portfolio_db.* TO '2b7q2qfZv9FUWMC.portfolio_user'@'%'`.
   - Operational Scope: Used exclusively by the Django application server during runtime operations.
   - Security Boundary: Zero DDL (`CREATE`, `DROP`, `ALTER`), zero administrative privileges, zero `DELETE` privilege. Runtime account can write and update contact records, but cannot modify database structure or purge records.

### Windows Credential Manager Integration and Encoding Fix

Migration credentials are dynamically resolved from Windows Credential Manager under the target name `portfolio_db_migrator`:

- **Defect Discovery:** Windows GUI Credential Manager stores credential secrets as UTF-16LE binary blobs with byte-order marks (`\xff\xfe`). Standard UTF-8 decoding in Python failed when reading GUI-saved secrets.
- **Implementation:** Implemented `decode_credential_blob()` in `backend/credential_vault.py` with multi-encoding fallback (UTF-16LE with BOM detection, falling back to UTF-8 and raw decoding).
- **Test Coverage:** Verified by 29 automated unit tests in `backend/tests/test_credentials.py` (committed in `6bf376a`).

### Migration Execution

Under explicit owner authorization, the initial migration command was executed:

```powershell
py -3 manage.py migrate contact 0001 --noinput
```

- **Execution Timestamp:** `2026-11-08 09:33:29.087525`
- **Exit Code:** `0`
- **Output:** `Applying contact.0001_initial... OK`

### Post-Migration Schema Verification

Inspection of `portfolio_db` confirmed the presence of exactly two tables:

1. `django_migrations`:
   - Contains applied record: `app = 'contact'`, `name = '0001_initial'`, `applied = 2026-11-08 09:33:29.087525`.
2. `contact_message`:
   - **Application Columns (11 total):**
     - `id`: `char(32)` (UUID primary key)
     - `name`: `varchar(100)`
     - `email`: `varchar(254)`
     - `subject`: `varchar(200)`
     - `message`: `longtext`
     - `delivery_status`: `varchar(20)`
     - `delivery_attempts`: `int`
     - `last_delivery_error`: `longtext`
     - `content_hash`: `varchar(64)`
     - `created_at`: `datetime(6)`
     - `updated_at`: `datetime(6)`
   - **Secondary B-Tree Indexes (4 total):**
     - `contact_message_created_at_idx` on `(created_at)`
     - `contact_message_email_idx` on `(email)`
     - `contact_message_delivery_status_idx` on `(delivery_status)`
     - `contact_message_content_hash_idx` on `(content_hash)`

### Discrepancy Investigation (Part 3C)

Following migration, the automated verification script exited with code `1`:

- **Root Cause:** Line 82 of the verification runner attempted cross-user grant inspection: `cursor.execute("SHOW GRANTS FOR '2b7q2qfZv9FUWMC.portfolio_user'@'%';")` while authenticated as `migrator`. In MySQL/TiDB, viewing grants of another user requires administrative `SELECT` privilege on the internal `mysql` catalog, resulting in MySQL Error `1044: Access denied for user 'migrator'@'%' to database 'mysql'`.
- **Classification:** Verification script harness defect, not a migration failure or database defect.
- **Remediation & Independent Proof:** Independent queries using `SHOW GRANTS FOR CURRENT_USER()` under each distinct identity confirmed that both `migrator` and `portfolio_user` retain exact documented least-privilege grants.

### Status

Stage 2.9 completed successfully. Database baseline established with correct schema and verified privilege boundaries. Ready for Stage 2.10 integration testing.

---

## Session 05 — Stage 2.10: Application and Database Integration Acceptance

**Date:** 2026-11-09
**Position:** Stage 2.10 — Application and Database Integration Acceptance

### Purpose

Perform end-to-end integration acceptance testing of the Django backend against the live TiDB Cloud Serverless database, verifying Option A (Database-First) persistence, failure-safe decoupled notification handling, abuse mitigation (honeypot, CRLF injection), and formal acceptance closure.

### Key Milestones and Sub-Stage Chronology

#### 1. Part 1: Integration Readiness Audit
- **Architecture Validation:** Verified Option A (Database-First) request flow: client submissions are validated and persisted to TiDB first; notification dispatch is secondary and decoupled.
- **Runtime Identity:** Confirmed runtime configuration uses `2b7q2qfZv9FUWMC.portfolio_user` with TLS verification against `isrgrootx1.pem`.
- **Notification Decoupling Verification:** Notification credentials intentionally left unconfigured (`RESEND_API_KEY` empty) to verify that database persistence succeeds even when external notification delivery fails.
- **Automated Test Suite Isolation:** Audited 64 backend unit tests and 56 frontend tests; confirmed that all automated test suites execute in isolated in-memory environments (SQLite / Happy-DOM) with zero network calls and zero TiDB interaction.

#### 2. Part 2: Controlled Integration Test Preparation
- **Synthetic Test Payload Specification:**
  - `name`: `"Controlled Integration Test"`
  - `email`: `"test.integration@adnanabdullahi.local"`
  - `subject`: `"Stage 2.10 Integration Verification"`
  - `message`: `"Verification of TiDB persistence and decoupled delivery failure handling."`
  - Computed Content Hash (SHA-256): `e27514b6946181550ce26ad99dc5da6735b8225afbd3b9d47da0fe0233616a65`
- **Permanent Retention Policy:** Established that because `portfolio_user` lacks `DELETE` privilege, any persisted synthetic record cannot be removed via application endpoints and will be retained as permanent engineering evidence in `portfolio_db`.

#### 3. Part 3: Controlled Live Contact Submission
- **Execution:** Under explicit owner authorization, exactly ONE live POST was dispatched to `http://127.0.0.1:8000/api/contact/`.
- **API Response:** `HTTP 201 Created` with record UUID `e767aae8-0cf2-44af-b51c-1c23a07e8642`.
- **Live Database Persistence:** Row count in `portfolio_db.contact_message` transitioned from `0` to `1`.
- **Decoupled Notification Handling:** The missing `RESEND_API_KEY` was handled gracefully. Record state transitioned to `delivery_status = 'failed'`, `delivery_attempts = 0`, and the missing key diagnostic was recorded in `last_delivery_error`.
- **Client Decoupling:** The client received a clean `HTTP 201 Created` response. Zero external notification emails were dispatched.

#### 4. Part 3C: Controlled Submission Runner Discrepancy Investigation
- **Discrepancy:** The execution harness reported `Exited with code 1` post-submission.
- **Root Cause:** The runner script invoked `django.setup()` in the parent Python verification process without defining `DJANGO_SETTINGS_MODULE=config.settings`, triggering `django.core.exceptions.ImproperlyConfigured`.
- **Verification:** The HTTP POST, API response, and database persistence had completed prior to the runner error. A separate read-only SQL query verified record `e767aae8-0cf2-44af-b51c-1c23a07e8642` was intact, fully populated, and correctly formatted in TiDB.

#### 5. Part 4A: Delivery and Error-Handling Implementation Audit
- **Decoupled Notification Architecture:** Direct HTTPS communication via `urllib.request` to Resend API avoids blocked SMTP ports (25, 465, 587) on serverless/container hosts.
- **State Machine:** Robust delivery tracking across `pending`, `sent`, `failed`, and `simulated` states.
- **Honeypot Protection:** Hidden `website` field; non-empty submissions are immediately rejected with `HTTP 400 Bad Request` (`{"status": "error", "message": "Invalid submission."}`).
- **CRLF & Header Injection Defense:** Strict newline validation on `name` and `subject` prevents email header injection attacks.
- **Duplicate Prevention:** SHA-256 content hashing enforces a 60-second duplicate suppression window.
- **Rate Limiting:** Django REST Framework `AnonRateThrottle` limits unauthenticated requests to 5 requests / hour per IP.

#### 6. Part 4B: Controlled Integration Test Planning
- Risk-classified remaining test vectors and formulated minimal-impact test sequence:
  - Approved: T-01 (read-only baseline check), T-02 (honeypot rejection), T-03 (CRLF rejection).
  - Deferred: Duplicate submission test (avoided creating a second permanent database row), rate-limit exhaustion test (avoided 60-minute local IP lockout), live Resend email delivery (deferred to Stage 09.4 production deployment).

#### 7. Part 4C: Controlled Execution of T-01, T-02, and T-03
Under explicit owner authorization, the three approved tests were executed:

- **T-01 (Live TiDB Baseline Integrity):**
  - Confirmed baseline row count of `1`.
  - Confirmed synthetic record `e767aae8-0cf2-44af-b51c-1c23a07e8642` intact with SHA-256 hash `e27514b6...`.
- **T-02 (Honeypot Rejection):**
  - Dispatched POST with populated `website: "https://spam.example.com"`.
  - Result: `HTTP 400 Bad Request` with payload `{"status": "error", "message": "Invalid submission."}`.
  - Zero database writes; zero emails dispatched; TiDB row count remained `1`.
- **T-03 (Input Validation & CRLF Rejection):**
  - Dispatched POST with newline in name: `name: "Test\nName"`.
  - Result: `HTTP 400 Bad Request` with payload `{"status": "error", "errors": {"name": ["Name cannot contain newline characters."]}}`.
  - Zero database writes; zero emails dispatched; TiDB row count remained `1`.
- **Post-Execution Database Audit:**
  - Live TiDB row count strictly remained at `1`.
  - Zero phantom records created; original synthetic record intact.

### Acceptance Assessment Matrix

| Dimension | Evaluation Criteria | Result | Evidence & Basis |
| :--- | :--- | :--- | :--- |
| **1. Database Schema & Migration** | Migration applied; tables and indexes present in TiDB. | **ACCEPTED** | `contact.0001_initial` applied; `django_migrations` and `contact_message` (11 cols, 4 indexes) verified. |
| **2. Privilege Segregation** | Separation between migrator and runtime accounts. | **ACCEPTED** | `migrator` restricted to DDL/insert; `portfolio_user` restricted to DML (no DDL, no DELETE). |
| **3. Option A Persistence** | Database-first persistence with decoupled notification failure. | **ACCEPTED** | Synthetic record `e767aae8...` persisted; unconfigured email handled cleanly; client received HTTP 201. |
| **4. Abuse & Edge Defense** | Honeypot, CRLF injection, and validation safeguards active. | **ACCEPTED** | T-02 and T-03 confirmed HTTP 400 rejections; zero writes to database. |
| **5. Test Isolation & Coverage** | Automated test suites execute in isolation without live writes. | **ACCEPTED** | 64 backend unit tests and 56 frontend tests pass in isolated in-memory harnesses. |
| **6. Evidence Preservation** | Synthetic test record preserved; zero database pollution. | **ACCEPTED** | Record `e767aae8...` retained as permanent engineering evidence; total row count strictly 1. |
| **7. Operational Boundaries** | Known limitations and edge conditions documented. | **ACCEPTED** | All 6 known operational boundaries documented in engineering records. |

### Documented Operational Boundaries and Limitations

1. **TiDB Engine CHECK Constraints (`tidb_enable_check_constraint = 0`):**
   - TiDB Cloud Serverless parses but does not enforce DDL `CHECK` constraints at the storage engine layer. Data integrity for `delivery_status` is enforced strictly at the Django application model layer (`ContactMessage.clean()` and `save()`). Direct raw SQL statements bypass model validation.
2. **Phase 1 Notification Retry Mechanism:**
   - In Phase 1, contact submissions record failed notification attempts with `delivery_status = 'failed'`. There is no automated background retry worker or queue scheduler (Celery/Redis); failed notifications require manual operational review or a dedicated retry script.
3. **Deferred Live Email Delivery:**
   - Real end-to-end email transmission via Resend HTTPS API was deliberately deferred to Stage 09.4 deployment to avoid prematurely consuming monthly free-tier email quotas.
4. **Rate Limiting Concurrency in Multi-Worker Environments:**
   - Django REST Framework's default throttling utilizes Django's local memory cache (`LocMemCache`). In multi-worker production deployments without a shared cache (e.g., Redis), rate-limiting counters are tracked per-worker process.
5. **Duplicate Submission Window Concurrency Heuristic:**
   - The 60-second duplicate prevention heuristic performs an application-level pre-save query against `content_hash`. Highly concurrent simultaneous submissions within milliseconds could theoretically race.
6. **Permanent Retention of Synthetic Record:**
   - Test record `e767aae8-0cf2-44af-b51c-1c23a07e8642` remains permanently in `portfolio_db.contact_message` as immutable verification evidence, consistent with `portfolio_user` lacking `DELETE` permissions.

### Closure Recommendation

Stage 2.10 has successfully satisfied all documented acceptance criteria and verified the robustness of the application/database integration pipeline.

**Verdict: READY TO CLOSE WITH RECORDED LIMITATIONS**


---

## Session 06 — Stage 3.1: Read-Only Hosting Architecture Investigation

**Date:** 2026-11-09
**Position:** Stage 3.1 — Read-Only Hosting Architecture Investigation
**Mode:** STRICTLY READ-ONLY

### Purpose

Investigate the proposed deployment architecture restricted to three selected services: Cloudflare Pages (frontend), Render (backend), and existing TiDB Cloud Serverless (database), establishing viability, boundaries, and integration constraints without introducing alternative providers.

### Architectural Findings

1. **Frontend Hosting (Cloudflare Pages):**
   - **Static Serving:** Serves static production bundle generated by `npm run build` from `app/dist`.
   - **Routing Topography:** Vue application uses client-side hash routing (`createWebHashHistory`). This delivers 100% static host compatibility on Cloudflare Pages without requiring complex server rewrite rules or `_redirects` configuration.
   - **Cost & Limits:** Standard free tier provides 500 builds/month, unlimited bandwidth, and free SSL on `*.pages.dev` or custom domains.
2. **Backend Hosting (Render):**
   - **Runtime Environment:** Linux container execution with Gunicorn WSGI. Dynamic port binding via `$PORT`.
   - **Persistence Limitation:** Render provides an ephemeral local filesystem. Stateless application architecture is strictly required; all contact records must persist to the external TiDB database.
   - **Operational Gaps in Free Web Service:** Free instances spin down after 15 minutes of inactivity, incur 50–60+ second cold-start delays on subsequent requests, and are subject to monthly instance hour limits.
3. **Database (TiDB Cloud Serverless):**
   - **Existing Cluster:** Active cluster `gateway01.eu-central-1.prod.aws.tidbcloud.com:4000` with existing `portfolio_db`.
   - **Schema State:** Successfully migrated in Stage 2.9 with `django_migrations` and `contact_message` tables. 1 permanent synthetic record retained from Stage 2.10.
   - **TLS Mandate:** TiDB Cloud mandates TLS encrypted connections on port 4000 using Let's Encrypt ISRG Root X1 certificate authority.
4. **Driver Compilation Risk Identified:**
   - Active `requirements.txt` included `mysqlclient==2.3.0` for Linux platforms. Building `mysqlclient` on Render requires system-level C development headers (`default-libmysqlclient-dev` or `libmariadb-dev`, `python3-dev`, `gcc`), introducing potential container build failures or driver incompatibility.

### Recommendations & Progression

- Recommend evaluating Render's paid Starter plan ($7/month) to overcome the operational blockers of the free tier.
- Recommend resolving the Linux `mysqlclient` C-extension compilation dependency by evaluating a universal pure-Python driver strategy (PyMySQL).

---

## Session 07 — Stage 3.2A: Render Starter Deployment Readiness Assessment

**Date:** 2026-11-10
**Position:** Stage 3.2A — Render Starter Deployment Readiness Assessment
**Mode:** STRICTLY READ-ONLY

### Purpose

Conduct a rigorous readiness assessment for deploying the Django backend to a Render Starter Web Service ($7/month published base price), evaluating compute, memory, continuous availability, and configuration parameters.

### Evaluation Findings

1. **Operational Improvements Over Free Tier:**
   - **Continuous Availability:** Unlike the Free tier, Starter Web Services **never spin down** due to inactivity. Eliminates 50–60 second cold starts and prevents request timeouts on first-time visitor contact submissions.
   - **Predictable Compute Resources:** 512 MB RAM, 0.5 shared CPU.
   - **Uptime Quotas:** Starter instances run 24/7 without monthly instance-hour exhaustion or mid-month suspension.
2. **Resource Sizing & Concurrency Model:**
   - Django memory footprint at baseline is ~45–60 MB.
   - Recommended Gunicorn configuration: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 60`.
   - Memory allocation with 1 worker and 2 threads is estimated at ~80–120 MB total, leaving ample headroom below the 512 MB limit to prevent out-of-memory (OOM) container termination.
3. **Health Check Probing:**
   - Render Starter supports custom HTTP health check endpoints.
   - Configured path: `/api/health/`.
   - Returns HTTP 200 OK with `{"status": "healthy"}` in 0 database queries, providing an accurate liveness indicator for container orchestration.
4. **Cost Boundary Evolution:**
   - The project owner approved evaluating the $7/month Starter plan as an acceptable investment to ensure professional reliability and eliminate free-tier degradation.
   - Free services remain for frontend (Cloudflare Pages) and database (TiDB Cloud Serverless free quota).
   - Render Starter remains an **evaluated candidate**, not yet provisioned or deployed.

---

## Session 08 — Stage 3.2B: Universal PyMySQL Implementation

**Date:** 2026-11-10
**Position:** Stage 3.2B — Universal PyMySQL Implementation and Driver Compatibility
**Mode:** Controlled Local Implementation and Verification

### Purpose

Eliminate the identified Linux deployment risk of `mysqlclient==2.3.0` by implementing a universal pure-Python PyMySQL driver strategy across both Windows development and Linux deployment environments.

### Implementation Details

1. **Dependency Modernization (`backend/requirements.txt`):**
   - Removed `mysqlclient==2.3.0`.
   - Removed platform conditional marker `sys_platform == 'win32'`.
   - Declared `pymysql>=1.1.1,<2.0` as a universal dependency across all environments.
2. **Universal Driver Aliasing (`backend/config/__init__.py`):**
   - Removed Windows platform gate (`if sys.platform == 'win32':`).
   - Unconditionally alias `pymysql` as `MySQLdb` using `pymysql.install_as_MySQLdb()`.
   - Overrode `pymysql.version_info = (2, 2, 1, 'final', 0)` to satisfy Django's MySQL engine version validation without requiring native C extensions.
3. **Automated Verification:**
   - Added `backend/tests/test_database_config.py`.
   - Confirmed 52 existing backend tests passed in SQLite in-memory isolation.
   - Verified that Django ORM successfully mapped to PyMySQL driver.

---

## Session 09 — Stage 3.2C: Independent Implementation and Security Review

**Date:** 2026-11-10
**Position:** Stage 3.2C — Independent Implementation and Security Acceptance Review
**Mode:** STRICTLY READ-ONLY

### Purpose

Independently inspect the Stage 3.2B changes, verify cross-platform driver behavior, and audit security configurations prior to acceptance.

### Findings and Identified Gaps

1. **Driver Portability:** Verified. Pure-Python PyMySQL cleanly eliminated native compilation dependencies and satisfied Django 5.2.18 LTS initialization requirements.
2. **Identified Security Gap (Permissive / Fail-Open TLS):**
   - In `backend/config/settings.py`, database TLS was conditionally attached only if `DB_SSL_CA` was non-empty.
   - If `DB_SSL_CA` was missing, empty, or pointed to a nonexistent path on a remote host (e.g. TiDB Cloud), Django would proceed without SSL configuration, allowing unencrypted plaintext fallback attempts.
   - Weaker or unsupported SSL modes (`VERIFY_CA`, `REQUIRED`, `DISABLED`, or typos) were not strictly validated or rejected.
3. **Identified Testing Gap (Duplicated Test Logic):**
   - `backend/tests/test_database_config.py` tested a local duplicate helper (`_build_options`) rather than the live configuration logic in `config.settings`.

### Disposition

Stage 3.2C recommended gating full acceptance behind Stage 3.2D to enforce fail-closed remote TLS guards and direct testing of the Django settings module.

---

## Session 10 — Stage 3.2D: Fail-Closed Database TLS Guard and Test Strengthening

**Date:** 2026-11-10
**Position:** Stage 3.2D — Fail-Closed Database TLS Guard and Test Strengthening
**Mode:** Controlled Local Implementation and Verification

### Purpose

Implement fail-closed validation for remote database connections in `backend/config/settings.py` and refactor `backend/tests/test_database_config.py` to directly exercise the production settings builder.

### Implementation Details

1. **Host Classification & Local Loopback Protection (`backend/config/settings.py`):**
   - Defined `LOCAL_DATABASE_HOSTS = frozenset({'127.0.0.1', 'localhost', '::1'})`.
   - Implemented `is_local_database_host(host: str) -> bool`.
   - Guaranteed unencrypted baseline connectivity for canonical local development addresses without requiring dummy certificates.
2. **Fail-Closed Configuration Builder (`build_database_config`):**
   - Remote hosts strictly require `DB_SSL_CA`. If missing or empty, raises `RuntimeError("DB_SSL_CA is required for remote database connections... Plaintext remote database connections are strictly prohibited.")`.
   - Validates that the CA bundle file actually exists on the filesystem (`ca_path.is_file()`). Resolves relative paths against `BASE_DIR` and safely handles rooted POSIX paths (e.g., `/etc/ssl/certs/ca-certificates.crt`). Raises `RuntimeError` if file is missing.
   - Enforces `DB_SSL_MODE='VERIFY_IDENTITY'` (or defaults to it if omitted). Rejects any weaker mode (`VERIFY_CA`, `REQUIRED`, `DISABLED`, etc.) with `RuntimeError`.
   - Supplies `ssl={'ca': ca_output, 'check_hostname': True}` to PyMySQL; omits the unsupported native `ssl_mode` keyword.
   - Preserves credential isolation: least-privilege `portfolio_user` for runtime; `is_migrate` dynamically queries `credential_vault`.
   - Preserves `is_test_command` SQLite in-memory isolation for unit tests.
3. **Strengthened Automated Unit Test Suite (`backend/tests/test_database_config.py`):**
   - Completely replaced duplicate helper with direct imports: `build_database_config`, `is_local_database_host`, `LOCAL_DATABASE_HOSTS`, `BASE_DIR`.
   - Expanded suite to 16 comprehensive unit tests across 3 classes:
     - `TestDatabaseDriverRegistration` (3 tests: `sys.modules['MySQLdb']` alias, `version_info` check, Django engine binding).
     - `TestHostClassification` (3 tests: canonical local hosts, empty default, remote hosts & lookalikes).
     - `TestFailClosedRemoteDatabaseTls` (10 tests: valid CA + `VERIFY_IDENTITY`, missing CA fail-closed, invalid CA path fail-closed, missing mode default, unsupported mode fail-closed, weaker modes fail-closed, local baseline without CA, Render system CA bundle path, absence of native `ssl_mode` keyword, and real OpenSSL context generation via `Connection._create_ssl_ctx` with `certs/isrgrootx1.pem`).
4. **Verification Evidence:**
   - `python manage.py check`: 0 issues (0 silenced).
   - `tests.test_database_config`: 16/16 passed in 0.149s.
   - Full backend test suite (`python manage.py test`): **80/80 passed** in 1.621s (16 config tests, 32 contact API tests, 29 credential tests, 3 health tests).
   - Frontend unit suite (`npm --prefix app run test:unit`): **160 passed** across 10 suites.
   - Total regression test baseline: **240 automated checks passing cleanly**.

---

## Session 11 — Git Commit Preparation, Execution, and Remote Synchronization

**Date:** 2026-11-10
**Position:** Stage 3.2 Consolidated Commit and Verification
**Mode:** Controlled Local Staging and Commit

### Purpose

Create one consolidated local Git commit containing the approved Stage 3.2B and Stage 3.2D database driver and TLS security improvements, and verify repository synchronization.

### Execution Record

1. **Pre-Staging Verification:**
   - Verified active branch was `main` at baseline commit `58e22369eb3b3fde8967055f036d62f1662958e0`.
   - Working tree contained exactly 3 modified files (`backend/requirements.txt`, `backend/config/__init__.py`, `backend/config/settings.py`) and 1 untracked file (`backend/tests/test_database_config.py`).
2. **Explicit Staging:**
   - Staged exclusively the 4 approved files using explicit individual file paths:
     ```powershell
     git add backend/requirements.txt
     git add backend/config/__init__.py
     git add backend/config/settings.py
     git add backend/tests/test_database_config.py
     ```
   - Verified staged diff: 4 files changed, 410 insertions(+), 57 deletions(-).
3. **Commit Creation:**
   - Created local commit:
     ```text
     commit 279d41c75df82d663bc35c4a4a89f6ed34ed2f86
     Author: Adnan Abdullahi
     Date:   2026-11-10

     feat(backend): enforce secure cross-platform database connectivity
     ```
4. **Post-Commit Verification:**
   - Working tree clean (`nothing to commit, working tree clean`).
   - Full backend test suite re-verified: 80/80 passed cleanly.
   - Commit was synchronized to remote tracking branch `origin/main` on GitHub.
   - Baseline established for Stage 3.3 documentation reconciliation.
