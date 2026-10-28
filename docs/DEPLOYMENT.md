# Deployment — Zero-Cost Feasibility and Readiness Record

**Project:** Project 01 — Professional Engineering Portfolio  
**Stage:** 09 — Evaluation  
**Status:** Provisional architecture recommendation; no deployment performed  
**Audit date:** 2026-10-27  
**Governing stage plan:** `docs/STAGE-09-EVALUATION.md`

## 1. Objective and Cost Constraint

Identify a viable path to make the Vue/Vite portfolio and Django contact API publicly reachable while keeping required monetary cost at zero.

The proposal must not require a paid hosting plan, purchased domain, paid database, paid email subscription, or payment-card-backed spending. Free services have limits and may suspend or restrict use when quotas are exhausted; this is not equivalent to unlimited production availability.

No external account has been created or configured, and no application or hosting change has been made as part of this audit.

## 2. Read-Only Repository Findings

### Frontend

- Application: Vue 3, TypeScript, Vite.
- Build script: `npm run build` in the `app` workspace; runs `vue-tsc -b && vite build`.
- Root package defines an npm workspace for `app`, with root scripts delegating build and tests.
- Vite output is expected at `app/dist` under the current default Vite configuration.
- Local development proxy: `/api` → `http://127.0.0.1:8000`.
- Contact submission uses relative URL `/api/contact/`.

**Implication:** A static host can serve the frontend, but a separate API origin requires an explicit production API base URL or an equivalent routing arrangement. The development proxy must remain for local development and must not be mistaken for a production API route. A production change should preserve current tests and local behavior.

### Backend

- Django REST Framework exposes `/api/contact/`.
- Contact submissions are persisted to a relational database before notification dispatch; the API returns HTTP 201 after the database receipt succeeds.
- The current database engine is `django.db.backends.mysql`, configured by environment variables.
- Dependencies include Django, Django REST Framework, django-cors-headers, `mysqlclient==2.3.0`, and python-dotenv.
- `DJANGO_SECRET_KEY` is required at startup.
- `DJANGO_DEBUG` defaults to false; `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` are environment-configurable.
- CORS defaults currently list local development origins only.
- Anonymous contact submissions are rate-limited to 5/hour.
- No dedicated health-check route was found in the inspected URL configuration; `/api/contact/` is a POST endpoint and is not a suitable assumption for an HTTP-200 health check.
- No deployment-specific Dockerfile, Procfile, or Render Blueprint was found in the inspected repository search.

### Migration and credential portability

The settings module detects migration commands and then imports `credential_vault.py` to retrieve a migration identity from Windows Credential Manager. That module initializes Windows-only `ctypes.windll` APIs at import time.

**Finding:** The existing migration path is Windows-specific. A Linux-hosted deployment cannot safely assume that this path will work; in the current code, importing the module on a non-Windows runtime is expected to fail before the `ImportError` handler can handle it. This is a deployment blocker to resolve through an approved portable credential/migration design. Do not weaken the database's least-privilege intent or put secrets in source control to work around it.

### Contact notifications

- Django defaults to `django.core.mail.backends.console.EmailBackend`.
- That backend logs email content rather than delivering a real email.
- Render's free web services block outbound SMTP on ports 25, 465, and 587.

**Finding:** Real notification delivery is not established. A successful HTTP 201 currently means the database receipt succeeded; it must not be described as proof that an email was delivered. A suitable free email API, its sender-verification requirements, limits, and compatibility with the zero-cost constraint remain to be investigated. Do not claim the live contact workflow is fully operational until an actual delivery test succeeds or the user approves a clearly documented alternative.

### Data persistence and operational needs

The contact API stores visitor name, email, message, and delivery diagnostics. A production database must therefore be persistent, protected, and appropriate for personal data. An ephemeral local SQLite database or the backend service's local filesystem is not an acceptable persistent store for this workflow.

## 3. Provisional Zero-Cost Architecture

### Frontend — Cloudflare Pages

**Recommendation:** Use Cloudflare Pages for the static Vue/Vite frontend, subject to account authorization and a successful build preview.

Official references:
- Vue deployment guide: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vue-site/
- Pages limits: https://developers.cloudflare.com/pages/platform/limits/

The current Cloudflare Pages Free limits page reports 500 builds per month, one concurrent build, and a 20-minute build timeout. Static assets are distributed through Cloudflare's network. Use the provider's `pages.dev` subdomain and avoid purchasing a domain.

Initial build configuration to validate:
- Repository root: repository root, because the root package declares the npm workspace.
- Build command: `npm run build`.
- Output directory: `app/dist`.

This is a proposal, not yet tested against a live Cloudflare build. The repository is private; Git-provider integration permissions must be reviewed and explicitly authorized.

### Backend — Render Free Web Service

**Provisional option:** Render Free Web Service for the Django API, using a provider subdomain.

Official reference: https://render.com/docs/free

Current documented limitations include:
- The service spins down after 15 minutes without inbound traffic and can take about a minute to start again.
- The local filesystem is ephemeral.
- Free services may restart and have usage limits.
- Free web services cannot send outbound SMTP on ports 25, 465, or 587.
- Render explicitly positions free instances for testing, hobby projects, and previews rather than production applications.

**Interpretation:** Render may be acceptable for a no-cost public portfolio evaluation or demonstration, but its free backend should not be represented as production-grade or continuously available. If the project later requires dependable production contact handling, uptime, or persistent operational guarantees, a paid service may be necessary; that would be outside the current zero-cost constraint and must not be introduced without a new decision.

Official service reference: https://render.com/docs/web-services

### Database — TiDB Cloud Starter, MySQL-compatible

**Provisional option:** TiDB Cloud Starter in MySQL-compatible mode, subject to compatibility testing.

Official references:
- Free quotas and limitations: https://docs.pingcap.com/tidbcloud/serverless-limitations/
- Plan selection and spending limit: https://docs.pingcap.com/tidbcloud/select-cluster-tier/
- MySQL compatibility: https://docs.pingcap.com/tidbcloud/mysql-compatibility/

The current official docs state that the first five MySQL-compatible Starter instances per organization have a free quota of 5 GiB row-based storage, 5 GiB columnar storage, and 50 million request units per month. The free option does not require a credit card. When the free quota is reached, new connections may be restricted until the quota resets. Setting the spending limit to zero is necessary to preserve the no-spend requirement.

**Advantages:** It may preserve the existing Django MySQL engine and avoid a database-engine migration.

**Uncertainties to verify:** Compatibility of the current schema/migrations and `mysqlclient` driver, connection/TLS configuration, service region, quota behavior, credential handling, and whether the service terms fit the intended public contact workload.

Do not create a database or migrate data during this audit.

### Why not Render Free Postgres?

Render's official free-plan documentation says free Postgres databases expire 30 days after creation and have no backups. That is unsuitable as the default persistent database for the contact form. A different persistent free database option must be validated before deployment.

## 4. Zero-Cost Constraint Controls

Before any external setup:
- Confirm that every selected service is explicitly on a $0/free tier.
- Where a spending limit exists, set it to zero.
- Do not add a payment method merely to enable a service.
- Confirm whether the service suspends, throttles, or deletes data when its free quota or lifetime limit is reached.
- Use free provider subdomains only.
- Do not accept a trial that later automatically converts to a paid plan.
- Record the relevant provider terms and date checked.

The goal is no required monetary cost. The plan cannot promise permanent availability, unlimited usage, or unchanged provider terms.

## 5. Audit Findings and Proposed Responses

| ID | Finding | Risk / impact | Proposed response | Status |
|---|---|---|---|---|
| D09-01 | Production frontend cannot rely on Vite's localhost API proxy. | Contact submissions will target the wrong origin or fail. | Introduce a production API base URL or approved equivalent while retaining the local proxy. | Proposed; approval required |
| D09-02 | Migration credentials depend on Windows Credential Manager. | Linux migration execution is expected to fail. | Implemented Option A: platform-neutral credential_vault with fail-closed precedence (DB_MIGRATE_* -> Windows vault -> fail closed) and out-of-band TLS migration execution. | Implemented locally; live database connectivity unverified |
| D09-03 | No dedicated health-check route was found. | Hosting health checks may fail or require an unsuitable endpoint. | Implemented locally: GET /api/health/ process liveness endpoint (unauthenticated, 0 DB queries, 0 secrets). | Implemented locally; live hosting verification pending |
| D09-04 | Contact email defaults to console backend / Render blocks SMTP. | Outbound SMTP is blocked on Render free tier. | Implemented locally: Resend HTTPS API notification service (Option A post-commit decoupled dispatch, reply-to visitor, zero secret exposure). | Implemented locally; live provider verification pending |
| D09-05 | CORS and allowed hosts default to local development values. | Public frontend requests may be rejected or host validation may fail. | Configure narrowly scoped production origins/hosts through environment variables. | Proposed; approval required |
| D09-06 | Free Render web service has cold starts and is not recommended by Render for production. | Delayed first request and limited reliability. | Treat as a demonstration/evaluation environment only under the current $0 constraint. | Constraint accepted for evaluation only; human confirmation still required |
| D09-07 | Free database quotas can restrict connections; some free database plans expire. | Contact form may become unavailable or data may be lost. | Prefer a validated persistent MySQL-compatible free tier with spending capped at $0; document quota and backup limits. | Provisional |
| D09-08 | No dedicated production deployment configuration was found in the inspected files/search. | Setup may be non-reproducible. | Implemented locally: Declared Gunicorn in requirements.txt with sys_platform != 'win32' marker. Documented Render build/start commands and root directory. | Implemented locally; live hosting verification pending |

### 5.1 Database Credential Architecture & Privilege Separation (Finding D09-02)

Following review in Stage 09.3, the database credential architecture (Option A) was implemented locally across `backend/credential_vault.py`, `backend/config/settings.py`, `backend/.env.example`, and `backend/tests/test_credentials.py`.

#### 1. Runtime vs. Migration Identities
- **Runtime Identity (`portfolio_user`):**
  - Used exclusively by the runtime web service (WSGI/ASGI), local development server (`runserver`), and read-only utilities.
  - Demonstrated application requirements: strictly `SELECT, INSERT, UPDATE` on `portfolio_db.*` (conforming to `ContactMessage` query behavior in `backend/contact/views.py`).
  - Prohibited privileges: `DELETE`, `CREATE`, `ALTER`, `DROP`, `REFERENCES`, `INDEX`.
- **Migration Identity (`portfolio_migrator`):**
  - Used exclusively for executing schema migrations via `python manage.py migrate` out-of-band from the developer workstation or dedicated migration runner.
  - Required privileges: `SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES` on `portfolio_db.*` (subject to TiDB Cloud supported database-level grants).

#### 2. Safe Credential Handling & Out-of-Band Execution
- **Render Secret Isolation:** The Render Web Service dashboard must **never** contain `DB_MIGRATE_USER` or `DB_MIGRATE_PASSWORD`. Only runtime `DB_USER` and `DB_PASSWORD` are configured on Render.
- **Deterministic Credential Resolution:**
  - If either `DB_MIGRATE_USER` or `DB_MIGRATE_PASSWORD` is present in the environment, the environment is the chosen source.
  - If incomplete, empty, or whitespace-only, the system fails closed immediately with `RuntimeError` without querying the Windows vault or falling back to `portfolio_user`.
  - Passwords are preserved byte-for-byte (never trimmed).
  - If neither environment variable is configured: on Windows, falls back to Windows Credential Manager (`portfolio_db_migrator`); on Linux, fails closed with `RuntimeError`.
  - Zero secrets or password tokens are leaked into exception messages or logs.

#### 3. Remote TLS Configuration
- TiDB Cloud Serverless mandates encrypted TLS connections on port `4000` (Let's Encrypt ISRG Root X1 root certificate).
- Environment-controlled via `DB_SSL_MODE=VERIFY_IDENTITY` and `DB_SSL_CA` in `backend/config/settings.py`. When unconfigured, local unencrypted MySQL on `127.0.0.1:3306` remains undisturbed.

#### 4. Verification Status and Boundaries
- **Completed Locally:**
  - Automated unit test suite (`backend/tests/test_credentials.py`): 17 tests passing.
  - Existing backend regression suite (`backend/contact/tests.py`): 14 tests passing.
  - Frontend unit tests and production build passing.
  - Simulated non-Windows subprocess import safety verified.
- **Pending Verification:**
  - Genuine Linux kernel verification (Docker was not available on the local Windows host; container verification remains pending).
  - Remote TiDB TLS handshake, hostname verification, and gateway reachability (port 4000).
  - Live migration execution and table creation in TiDB Cloud.
- **Explicit Boundary:** The system is **NOT production-verified**. Live database connectivity, accounts, and external services remain unconfigured pending explicit approval.

### 5.2 Deployment Hardening & Startup Architecture (Findings D09-03, D09-08)

Following Stage 09.3-A specification and approval, deployment hardening was implemented locally across `backend/config/urls.py`, `backend/contact/views.py`, `backend/requirements.txt`, and `backend/tests/test_health.py`.

#### 1. Liveness Health Endpoint (`GET /api/health/`)
- **Purpose:** Stateless, unauthenticated process liveness probe for the hosting platform (Render).
- **Behavior:** Returns HTTP 200 OK with `application/json` payload `{"status": "healthy"}`.
- **Strict Boundary:** Executes zero database queries (`assertNumQueries(0)`) and makes zero external network calls.
- **Limitations:** A successful response confirms that Gunicorn and Django routing are responsive; it does **not** establish database readiness, contact-form persistence, or email delivery. If the database is unreachable, `/api/health/` still returns 200 while `/api/contact/` returns sanitized HTTP 500 without restarting the container.

#### 2. Backend Production Startup Configuration (Render)
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **WSGI Dependency:** Declared as `gunicorn>=23.0,<24.0; sys_platform != 'win32'` in `backend/requirements.txt`. On Linux (Render), Gunicorn is installed; on Windows development machines, Gunicorn is skipped cleanly.
- **Startup Command:**
  ```bash
  gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 60
  ```
- **Resource Sizing:** 1 worker with 2 threads is chosen for Render's 512 MB RAM / 0.1 CPU free container to avoid memory pressure while handling concurrent health probes and contact submissions.
- **Production Environment Rules:**
  - `DJANGO_DEBUG=False` must be configured in Render dashboard environment variables.
  - `DJANGO_SECRET_KEY` must be configured with a secure random key on Render and never committed.
  - **Zero Startup Migrations:** Startup must **never** run `python manage.py migrate`. Migrations are executed out-of-band via Option A architecture.

#### 3. Frontend Static Hosting Architecture (Cloudflare Pages)
- **Router Configuration:** Retains `createWebHashHistory()` in `app/src/router/index.ts`.
- **Public URL Topology:** Visitor-facing routes are hash-based (`/#/orientation`, `/#/project-01`, `/#/approach`, `/#/record`, `/#/deep-engineering`, `/#/about`, `/#/contact`).
- **Static Compatibility:** Static hosts serve `index.html` on root, and client-side hash routing resolves views natively in the browser without server rewrite rules or `_redirects`.

#### 4. Unverified Deployment Assumptions
- Live Render `$PORT` binding, container initialization, and edge TLS proxy forwarding remain unverified until deployment.
- Live Gunicorn startup on a genuine Linux host remains unverified locally (Windows development uses `runserver`).
- Live TiDB Cloud Serverless connectivity, TLS handshake (port 4000), and account permissions remain unverified.
- Live Resend HTTPS API reachability and domain verification remain unverified until external account configuration and live acceptance testing.

### 5.3 Contact Email Notification Architecture (Finding D09-04)

Following Stage 09.3-F implementation, production email notifications use the **Resend HTTPS API** rather than SMTP, bypassing Render's outbound SMTP restrictions.

#### 1. Decoupled Persistence vs. Email Delivery (Option A)
- **Database is Primary Source of Truth:** Visitor submissions are validated and committed to MySQL/TiDB in an atomic transaction before any notification attempt.
- **Truthful Visitor Receipt:** The visitor receives HTTP 201 Created and their UUID receipt confirmation immediately upon successful database commit.
- **Fault-Isolated Dispatch:** If the Resend API call fails (HTTP 4xx/5xx, network timeout, DNS failure, or missing configuration), the database record is **never** rolled back or deleted. The system logs a server-side warning and marks `delivery_status='failed'` with a sanitized diagnostic string on the database record. The visitor is never told the message was unsaved.
- **Zero Diagnostic Leakage:** Neither the Resend API key nor raw visitor message contents are ever stored in `delivery_error` or leaked to error responses.

#### 2. Resend Account & Sender Domain Requirements
- **Cost Constraint:** Resend's free tier provides 3,000 emails/month and 100 emails/day, requiring no credit card and strictly satisfying the zero-cost requirement.
- **Domain Verification:** In production, sending from a custom domain (e.g., `contact@yourdomain.com`) requires configuring SPF and DKIM DNS records in your domain registrar per Resend instructions.
- **Testing Sender Identity:** For initial deployment or testing prior to domain verification, Resend provides `onboarding@resend.dev` to deliver notifications exclusively to the email address registered with the Resend account.
- **Reply-To Integrity:** The visitor's validated email address is supplied as the `reply_to` parameter in the Resend payload. The sender (`from`) is never spoofed as the visitor, ensuring strict DMARC/SPF compliance and allowing the portfolio owner to click "Reply" directly in their email client.

#### 3. Required Environment Variables
The following environment variables must be configured:
- `RESEND_API_KEY`: Secret API token generated in the Resend dashboard (`re_...`). In local development (`DEBUG=True`), setting this to `simulate` logs notification dispatch without making outbound HTTP calls. In production (`DEBUG=False`), `simulate` is prohibited and fails closed unless `EMAIL_SIMULATION_ALLOWED=True` is explicitly configured.
- `EMAIL_SIMULATION_ALLOWED`: Optional override flag defaulting to `False`. Must remain `False` in production.
- `CONTACT_NOTIFICATION_TO`: Portfolio owner's email address designated to receive visitor notifications.
- `CONTACT_NOTIFICATION_FROM`: Authorized sender identity (e.g. `Portfolio Contact <contact@yourdomain.com>` or `Portfolio Contact <onboarding@resend.dev>`).

#### 4. Secure API-Key Configuration in Render
- In the Render Dashboard, navigate to the Backend Web Service > **Environment**.
- Add `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, and `CONTACT_NOTIFICATION_FROM`.
- Render automatically treats custom environment variables as secure secrets.
- **CRITICAL:** Never commit `RESEND_API_KEY` or personal email addresses to Git or `backend/.env.example`.

#### 5. Live Email Delivery Acceptance Test
After deploying to Render with configured Resend environment variables:
1. Open the portfolio contact form at the live Cloudflare Pages URL (or send `POST /api/contact/` via curl to Render).
2. Submit a test inquiry with a valid name, your personal test email, and message.
3. Verify the frontend displays the confirmation receipt message with a valid UUID.
4. Verify in the database (or Render application logs) that `delivery_status` transitioned to `sent` and `delivery_attempts` is `1`.
5. Check the owner's email inbox: confirm receipt of the notification containing the reference ID, visitor name, visitor email, timestamp, and message.
6. Click "Reply" in your email client: confirm the destination address is the visitor's email address (`reply_to`), not the sender address.

## 6. Required Approval Before Implementation

The audit does not authorize:
- Changing source code or tests.
- Changing database engines or schema.
- Changing database privileges or migration credentials.
- Creating/configuring Cloudflare, Render, TiDB, or email-provider accounts.
- Deploying or making the site public.
- Setting external service environment variables.
- Adding any paid service, payment method, domain purchase, or subscription.

The next decision is whether the project owner approves the proposed architecture for a **zero-cost public evaluation/demo**, understanding that the free backend has cold starts and is not a production reliability commitment. If approved, implementation proposals should be presented individually before any material change is executed.

## 7. Audit Disposition

**Read-only audit:** Completed against the current GitHub source and official provider documentation on 2026-10-27.  
**Provisional architecture:** Cloudflare Pages frontend + Render Free Django API + TiDB Cloud Starter MySQL-compatible database.  
**Real email delivery:** Implemented locally via Resend HTTPS API (Finding D09-04); live acceptance testing pending.
**Public deployment:** Not performed.  
**Source changes:** None as part of this audit.  
**Next stage step:** Review the findings and obtain explicit approval before 09.3 deployment preparation.
