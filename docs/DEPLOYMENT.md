# Deployment Architecture, Readiness, and Candidate Evaluation Record

**Project:** Project 01 — Professional Engineering Portfolio
**Stage:** 09 — Evaluation (Stage 3.6C Reconciliation)
**Status:** Render Health-Check Resolved & Deployed (1aff35b); Contact API JSON Rendering & Production Console Logging Implemented; Third Deployment Attempt Pending Owner Execution
**Initial Audit Date:** 2026-10-27
**Reconciled Date:** 2026-11-13
**Governing Stage Plan:** `docs/STAGE-09-EVALUATION.md`
**Governing Baseline Commit:** `1aff35becb354c6b3bbe9736b60e9ff7e574da12` (`1aff35b`)

---

## 1. Objective and Cost Constraint Evolution

### 1.1 Initial Zero-Cost Baseline (Stage 09.2 Audit — 2026-10-27)
The initial evaluation audit identified a zero-cost path to make the Vue/Vite portfolio and Django contact API publicly reachable without requiring payment cards, paid domains, or paid subscriptions. Under that baseline:
- Frontend: Cloudflare Pages ($0 free tier).
- Backend: Render Free Web Service ($0 free tier).
- Database: TiDB Cloud Serverless Starter ($0 free tier quota).
- Notifications: Resend HTTPS API ($0 free tier).

### 1.2 Evaluation of Render Starter Web Service (Stage 3.2A — 2026-11-10)
During Stage 3.2A, a dedicated readiness assessment evaluated whether the Render Free Web Service was suitable for a professional engineering portfolio. The assessment established that Render Free introduces severe operational limitations:
- **Inactivity Spin-Down:** Free instances spin down after 15 minutes of inactivity.
- **Cold-Start Latency:** Subsequent incoming HTTP requests incur a 50–60+ second cold-start delay, creating unacceptable friction for visitors submitting contact inquiries.
- **Monthly Hour Limits:** Free instances are capped at 750 free instance hours per month across an account, risking mid-month suspension.

To eliminate these failure modes, the project owner authorized evaluating the **Render Starter Web Service** ($7/month published base price) as the preferred backend hosting candidate. The Starter tier provides:
- 100% continuous instance uptime (never spins down; zero cold-start delay).
- 512 MB dedicated RAM and 0.5 shared CPU.
- Custom domain support and automated managed TLS.

**Current Cost Boundary:**
- **Frontend:** Cloudflare Pages (Free, $0/month).
- **Backend:** Render Starter Web Service ($7/month evaluated candidate; awaiting owner provisioning).
- **Database:** TiDB Cloud Serverless (Existing cluster, $0/month within free tier quota).
- **Email:** Resend HTTPS API (Free tier, 3,000 emails/month, 100 emails/day, $0/month).

*Operating Rule:* Render Starter is an evaluated candidate, **not** an already provisioned or deployed service. No external hosting account has been configured, and no live deployment has been executed.

---

## 2. Verified Source Code Architecture

### 2.1 Frontend (`app/`)
- **Technology Stack:** Vue 3 (Composition API), TypeScript 5.x, Vite.
- **Routing Topography:** Hash-based routing (`createWebHashHistory()`) implemented in `app/src/router/index.ts`. All public routes are hash-anchored (`/#/orientation`, `/#/project-01`, `/#/approach`, `/#/record`, `/#/deep-engineering`, `/#/about`, `/#/contact`).
- **Static Host Compatibility:** Hash routing guarantees 100% compatibility with static edge hosts like Cloudflare Pages. The web server serves `index.html` on root, and client-side JavaScript handles view resolution without server rewrite rules or `_redirects`.
- **API Contact Dispatch:** Dispatches `POST` requests to backend origin resolved dynamically via `resolveApiUrl("/api/contact/")` in `app/src/services/api.ts`. In production on Cloudflare Pages, configured via `VITE_API_BASE_URL=https://api.adnanabdullahi.com`; in local development, leaves `VITE_API_BASE_URL` unset to leverage Vite's local dev proxy (`http://127.0.0.1:8000`).
- **Build Output:** Produced at `app/dist` via root script `npm run build` (`vue-tsc -b && vite build`).

### 2.2 Backend (`backend/`)
- **Technology Stack:** Python 3.14, Django 5.2.18 LTS, Django REST Framework 3.15+.
- **Origin Protection & Health-Check Integration Architecture (`CloudflareOriginSecretMiddleware`):**
  - Positioned immediately after `CorsMiddleware` in `settings.MIDDLEWARE`.
  - Enforces shared secret authentication via `X-Origin-Secret` header to block direct ingress targeting Render's underlying `*.onrender.com` host.
  - Constant-time secret verification via `hmac.compare_digest` across all comma-separated candidate secrets in `CF_ORIGIN_SECRET` without short-circuiting to prevent timing side-channels.
  - Fail-closed in production (`DEBUG=False`): returns HTTP 403 Forbidden if secret is missing, mismatched, or if `CF_ORIGIN_SECRET` is unset/empty.
  - Safe development bypass: in `DEBUG=True`, origin-secret verification is bypassed to support direct local API testing.
  - Platform Liveness Probe Exemption & Direct Middleware Response:
    - `GET` and `HEAD` requests to `/api/health` and `/api/health/` are intercepted and satisfied directly at the middleware boundary, returning HTTP 200 OK (`{"status": "healthy"}`) for GET and empty-body HTTP 200 for HEAD.
    - Resolves the Render deployment failure (D09-13): internal Render infrastructure health probes originate inside Render's network, do not traverse Cloudflare, and send internal/container Host headers (e.g. `*.onrender.com`, `10.x.x.x:PORT`, `0.0.0.0:PORT`). Direct middleware return bypasses downstream `SecurityMiddleware`/`CommonMiddleware` `ALLOWED_HOSTS` validation, eliminating `DisallowedHost` HTTP 400 rejections.
    - Health checks require zero Cloudflare headers (`CF-Connecting-IP`, `X-Origin-Secret`), execute 0 database queries, and make zero external network calls.
    - Unsupported methods (`POST`, `PUT`, `DELETE`) to the health endpoint require a valid origin secret; without a secret they are rejected with HTTP 403 by this middleware, and with a secret they receive HTTP 405 from downstream DRF handling.
  - Environment-Aware Host Configuration: `backend/config/settings.py` dynamically appends `RENDER_EXTERNAL_HOSTNAME` to `ALLOWED_HOSTS` if populated by the Render container environment.
  - Direct URL Routing: `backend/config/urls.py` registers both `/api/health/` and `/api/health` directly to prevent HTTP 301 redirects during health checks.
  - Verified by 30 dedicated origin-secret unit tests and 15 health-endpoint unit tests.
- **Headless JSON Rendering Architecture (`backend/config/settings.py`):**
  - Configures `REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = ['rest_framework.renderers.JSONRenderer']`.
  - Permanently eliminates Django REST Framework's default content negotiation fallback to `BrowsableAPIRenderer`. When incoming requests (such as direct browser navigation or debugging probes) present `Accept: text/html`, DRF strictly renders standard JSON responses (e.g. `{"detail": "Method \"GET\" not allowed."}` with HTTP 405 Method Not Allowed on `GET /api/contact/`).
  - Resolves incident D09-14: without `DEFAULT_RENDERER_CLASSES`, `BrowsableAPIRenderer` attempted to load `rest_framework/api.html`, which failed in this headless Django service because `TEMPLATES` is empty, raising `TemplateDoesNotExist: rest_framework/api.html` and causing an unhandled HTTP 500 error.
- **Production Console Error Logging (`backend/config/settings.py`):**
  - Configures standard `LOGGING` dictionary with `logging.StreamHandler` (`console`) emitting timestamps, log levels, logger names, and formatted messages to stdout/stderr.
  - Attaches `console` handler to `root` logger at `INFO` and `django.request` logger at `ERROR` with `propagate: False`.
  - Resolves incident D09-14 logging gap: under `DEBUG=False`, Django's default logging routes unhandled 500 exceptions exclusively to `mail_admins` (which silently discards them when `ADMINS` is empty). This explicit configuration guarantees that unhandled server exceptions and full Python tracebacks are immediately visible in Render runtime container logs.
- **Database Driver Architecture (Universal PyMySQL):**
  - Completely pure-Python driver strategy implemented in commit `279d41c`. Native `mysqlclient==2.3.0` was eliminated to prevent Linux C-extension compilation failures (`gcc`, `python3-dev`, `libmysqlclient-dev`).
  - `backend/requirements.txt` declares `pymysql>=1.1.1,<2.0` universally across all platforms.
  - `backend/config/__init__.py` universally aliases `pymysql` as `MySQLdb` via `pymysql.install_as_MySQLdb()` and sets `pymysql.version_info = (2, 2, 1, 'final', 0)` to satisfy Django's MySQL engine requirements.
- **Fail-Closed Remote Database TLS (`backend/config/settings.py`):**
  - Database configuration is built via `build_database_config(env=None, base_dir=None, is_migrate=False)`.
  - **Host Classification:** Canonical local loopback hosts (`127.0.0.1`, `localhost`, `::1`) are recognized via `LOCAL_DATABASE_HOSTS = frozenset({'127.0.0.1', 'localhost', '::1'})`. Canonical local connections permit clean, unencrypted communication for local development.
  - **Fail-Closed CA Enforcement:** Any non-local host (including `gateway01.eu-central-1.prod.aws.tidbcloud.com`) strictly requires `DB_SSL_CA`. If missing or empty, raises `RuntimeError`.
  - **Filesystem CA Verification:** Validates that the CA bundle exists on disk via `ca_path.is_file()`. Supports rooted POSIX paths (`/etc/ssl/certs/ca-certificates.crt`) as well as relative paths (`certs/isrgrootx1.pem`). Missing files raise `RuntimeError`.
  - **Strict Mode Enforcement:** Remote connections strictly enforce `DB_SSL_MODE='VERIFY_IDENTITY'` (or default to it when omitted). Any weaker mode (`VERIFY_CA`, `REQUIRED`, `DISABLED`) or unsupported value raises `RuntimeError`.
  - **PyMySQL TLS Mapping:** Generates `ssl={'ca': ca_output, 'check_hostname': True}`. The unsupported native `mysqlclient` keyword `ssl_mode` is never passed.
  - **Test Runner Isolation:** `is_test_command` routes test invocations to in-memory SQLite (`:memory:`), guaranteeing that automated test suites run in hermetic isolation with zero database network calls.
- **Active Dependencies (`backend/requirements.txt`):**
  ```text
  Django>=5.2.18,<5.3
  djangorestframework>=3.15,<4.0
  django-cors-headers>=4.4,<5.0
  gunicorn>=23.0,<24.0; sys_platform != 'win32'
  pymysql>=1.1.1,<2.0
  python-dotenv>=1.0,<2.0
  ```
- **Liveness Health Endpoint:** Dedicated stateless probe at `GET /api/health/` returning HTTP 200 OK (`{"status": "healthy"}`) in 0 database queries.
- **Contact API Endpoint:** `POST /api/contact/` implementing Option A (Database-First) persistence, honeypot anti-spam (`website` field), 60-second SHA-256 duplicate suppression heuristic, and DRF `AnonRateThrottle` (5 requests/hour per IP).
- **Contact Notifications:** Resend HTTPS API via `urllib.request` in `backend/contact/notifications.py`. Bypasses blocked SMTP ports (25, 465, 587). Post-commit decoupled dispatch guarantees that notification failures never invalidate or roll back committed contact records.
- **Migration & Credential Portability:** `backend/credential_vault.py` provides deterministic resolution: environment variables (`DB_MIGRATE_USER`, `DB_MIGRATE_PASSWORD`) take precedence; on Windows, falls back to Windows Credential Manager (`portfolio_db_migrator`); on Linux, fails closed. Runtime web service strictly uses `portfolio_user` from environment.

---

## 3. Architecture Candidates & Infrastructure Status

```
+-------------------------------------------------------------+
|                      VISITOR BROWSER                        |
|                                                             |
|   +-----------------------------------------------------+   |
|   |         Cloudflare Pages (Static Frontend)          |   |
|   |  - Host: https://adnanabdullahi.com                 |   |
|   |  - Vue 3 + TypeScript + Vite (/app/dist)            |   |
|   |  - Hash routing (createWebHashHistory)              |   |
|   |  - Dynamic API resolution: resolveApiUrl()          |   |
|   +--------------------------+--------------------------+   |
+------------------------------|------------------------------+
                               |
                               | HTTPS POST https://api.adnanabdullahi.com/api/contact/
                               | JSON Payload: { name, email, message, website }
                               v
+-------------------------------------------------------------+
|               CLOUDFLARE EDGE (DNS & Security)              |
|                                                             |
|  - CNAME api.adnanabdullahi.com -> <render>.onrender.com    |
|  - Cloudflare Proxy: Enabled (Orange Cloud)                 |
|  - Injects CF-Connecting-IP (canonical visitor client IP)   |
|  - Transform Rule injects: X-Origin-Secret: <secret>        |
+------------------------------+------------------------------+
                               |
                               | Authenticated Proxied Traffic
                               v
+-------------------------------------------------------------+
|               RENDER STARTER WEB SERVICE (Backend)          |
|              (Evaluated Candidate — $7/month)               |
|                                                             |
|   +-----------------------------------------------------+   |
|   |   Gunicorn (1 worker, 2 threads) + Django 5.2.18    |   |
|   |  - CloudflareOriginSecretMiddleware (X-Origin-Secret) |   |
|   |  - Continuous uptime (Zero cold-start delay)        |   |
|   |  - 512 MB RAM, 0.5 CPU, Ephemeral Linux FS          |   |
|   |  - Liveness Health Probe: GET /api/health/ (exempt) |   |
|   |  - DRF Throttling (CF-Connecting-IP) & Honeypot     |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              | TLS 1.3 (Port 4000)          |
|                              | PyMySQL (OpenSSL verify)     |
|                              | User: portfolio_user (DML)   |
|                              v                              |
|   +-----------------------------------------------------+   |
|   |         TiDB CLOUD SERVERLESS (Existing DB)         |   |
|   |  - Endpoint: gateway01.eu-central-1...:4000         |   |
|   |  - Database: portfolio_db (Migrated in Stage 2.9)   |   |
|   |  - Tables: django_migrations, contact_message       |   |
|   |  - 1 Permanent Synthetic Record (Stage 2.10)        |   |
|   |  - Default 0.0.0.0/0 IP Access (Dynamic Render IP)  |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              | Post-Commit Decoupled HTTPS  |
|                              v                              |
|   +-----------------------------------------------------+   |
|   |               RESEND HTTPS EMAIL API                |   |
|   |  - Endpoint: https://api.resend.com/emails          |   |
|   |  - Free tier (3,000 emails/mo, 100/day)             |   |
|   |  - Reply-To: visitor's validated email              |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

### 3.1 Frontend — Cloudflare Pages (Evaluated Candidate)
- **Candidate Status:** Recommended static frontend host; build and preview pending owner account authorization.
- **Build Configuration:**
  - Build Command: `npm run build`
  - Build Output Directory: `app/dist`
  - Root Directory: Repository root (npm workspace root).
- **Limits:** 500 builds/month, 1 concurrent build, unlimited bandwidth.
- **Routing:** Supported natively via `createWebHashHistory()`.

### 3.2 Backend — Render Starter Web Service (Evaluated Candidate)
- **Candidate Status:** Evaluated candidate; awaiting owner provisioning decision.
- **Compute Sizing:** 512 MB RAM, 0.5 shared CPU.
- **Process Model:** 1 Gunicorn worker with 2 threads (`--timeout 60`).
- **Filesystem:** Ephemeral. Application is strictly stateless; zero persistent data written to local disk.
- **Health Checks:** Probes `/api/health/`.
- **Superseded Option:** Render Free Web Service ($0) was superseded due to 15-minute spin-down, 50–60 second cold starts, and 750-hour monthly account limit.
- **Rejected Option:** Render Free PostgreSQL was rejected because instances expire and delete data after 30 days.

### 3.3 Database — TiDB Cloud Serverless (Existing Verified Cluster)
- **Status:** **MIGRATED & INTEGRATION ACCEPTED**.
- **Cluster Endpoint:** `gateway01.eu-central-1.prod.aws.tidbcloud.com:4000` (AWS Frankfurt).
- **Database:** `portfolio_db`.
- **Migration History (Stage 2.9 — 2026-11-08):**
  - Initial migration `contact.0001_initial` applied successfully via out-of-band `portfolio_migrator` execution.
  - Tables present: `django_migrations` and `contact_message`.
  - Columns: 11 total (`id`, `name`, `email`, `subject`, `message`, `delivery_status`, `delivery_attempts`, `last_delivery_error`, `content_hash`, `created_at`, `updated_at`).
  - Indexes: 4 secondary B-Tree indexes on `created_at`, `email`, `delivery_status`, `content_hash`.
- **Live Integration State (Stage 2.10 — 2026-11-09):**
  - Synthetic test submission verified live Option A persistence: record `e767aae8-0cf2-44af-b51c-1c23a07e8642` (content hash `e27514b6...`) is permanently retained as engineering verification evidence.
  - Total database row count: strictly **1**.
  - Controlled abuse tests (T-01 baseline, T-02 honeypot HTTP 400 rejection, T-03 CRLF HTTP 400 rejection) confirmed zero extraneous writes.
- **CHECK Constraint Notice:** TiDB Cloud Serverless runs with `tidb_enable_check_constraint = OFF`. DDL `CHECK` constraints are parsed but unenforced by the engine. Data integrity for `delivery_status` is enforced at the Django application model layer (`ContactMessage.clean()` and `save()`).

---

## 4. Audit Findings and Reconciliation Matrix

| ID | Finding | Initial Risk / Impact (2026-10-27) | Resolved Implementation & Status (2026-11-10) | Current Status |
| :--- | :--- | :--- | :--- | :--- |
| **D09-01** | Production frontend cannot rely on Vite's localhost proxy. | Contact submissions fail or target wrong origin. | Hash routing deployed; production API base URL / CORS origins to be configured at deployment. | **Ready for Configuration** |
| **D09-02** | Migration credentials depended on Windows Credential Manager. | Linux deployment would crash on import. | Implemented platform-neutral `credential_vault.py` with environment variable precedence (`DB_MIGRATE_*`), Windows fallback, and fail-closed resolution. Verified by 29 tests. | **Resolved Locally & Verified** |
| **D09-03** | No dedicated health-check route existed. | Hosting probes would hit contact endpoint or fail. | Implemented `GET /api/health/` returning HTTP 200 in 0 DB queries. Verified by automated tests. | **Resolved Locally & Verified** |
| **D09-04** | Email defaulted to console backend; Render blocks SMTP. | Outbound notifications fail on serverless/container hosts. | Implemented Resend HTTPS API dispatcher (`backend/contact/notifications.py`) using `urllib.request`. Decoupled from persistence. | **Resolved Locally & Verified** |
| **D09-05** | CORS and allowed hosts defaulted to localhost. | Production cross-origin requests rejected. | Environment-configurable via `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `settings.py`. | **Ready for Configuration** |
| **D09-06** | Free Render web service suffers 15-minute spin-down and cold starts. | 50–60s latency, request timeouts, poor UX. | Evaluated Render Starter Web Service ($7/mo) in Stage 3.2A. Continuous 24/7 uptime eliminates cold starts. | **Evaluated Candidate** |
| **D09-07** | Free database quotas and migration compatibility unverified. | Incompatible protocol strings or unmigrated schema. | Django LTS 5.2.18 aligned; TiDB migration executed in Stage 2.9; integration accepted in Stage 2.10. | **Migrated & Verified** |
| **D09-08** | Native `mysqlclient` required C compilation headers on Linux. | Build failures on Render due to missing `libmysqlclient-dev`. | Implemented universal pure-Python PyMySQL across Windows and Linux; removed `mysqlclient` in commit `279d41c`. | **Resolved & Committed** |
| **D09-09** | Remote database TLS was permissive (fail-open) if CA was missing. | Unencrypted remote connection attempts if misconfigured. | Implemented fail-closed TLS guards in `settings.py`: requires `DB_SSL_CA` file on disk and enforces `DB_SSL_MODE='VERIFY_IDENTITY'`. | **Resolved & Committed** |
| **D09-10** | Default `REMOTE_ADDR` rate throttling colludes all visitors behind Render's reverse proxy (`10.x.x.x`). | 5 submissions from any visitor exhausts hourly quota application-wide. | Implemented production visitor identity extraction via `CF-Connecting-IP` with fail-closed HTTP 400 validation, canonical IPv4/IPv6 normalization, and `DEBUG=True` fallback. Verified locally by 13 new unit tests. | **Resolved Locally & Verified** |
| **D09-11** | Direct ingress to `*.onrender.com` bypasses Cloudflare edge security and rate limiting. | Threat actors can flood origin directly or spoof headers. | Implemented `CloudflareOriginSecretMiddleware` verifying `X-Origin-Secret` via constant-time `hmac.compare_digest`. Supports comma-separated secrets for zero-downtime rotation. Fails closed in production (`DEBUG=False`). Narrow `GET`/`HEAD` exemption on `/api/health/`. Verified by 30 unit tests. | **Resolved Locally & Verified** |
| **D09-12** | API routing boundary between frontend (`adnanabdullahi.com`) and backend API. | Frontend cannot reach backend or hits incorrect origin. | Dedicated Cloudflare-proxied CNAME subdomain `api.adnanabdullahi.com` pointing to Render, with client requests dispatched via `resolveApiUrl()` and `VITE_API_BASE_URL`. Preserves Vite local proxy when unset. Verified by unit tests. | **Resolved Locally & Verified** |
| **D09-13** | First Render deployment health checks repeatedly returned HTTP 400, timing out deployment. | Web service never enters healthy live state; deployment fails. | Confirmed root cause: Render's internal health check pings the container directly using internal Host headers (`*.onrender.com`, `10.x.x.x`, `0.0.0.0`). The previous middleware exemption passed requests downstream (`self.get_response`), triggering Django `DisallowedHost` (HTTP 400). Corrected by returning `JsonResponse({'status': 'healthy'}, status=200)` for GET and empty-body 200 for HEAD directly from `CloudflareOriginSecretMiddleware`, bypassing `ALLOWED_HOSTS` and reverse-proxy header checks for health probes. Added direct `/api/health` route in `urls.py`, explicit `head()` in `HealthCheckView`, and `RENDER_EXTERNAL_HOSTNAME` in `ALLOWED_HOSTS`. Verified by 6 new unit tests; committed (`1aff35b`), deployed to Render, and verified live returning HTTP 200 on `https://api.adnanabdullahi.com/api/health/`. | **Resolved, Committed (1aff35b) & Deployed** |
| **D09-14** | Direct browser access (`Accept: text/html`) to proxied `GET /api/contact/` returned HTTP 500 with no traceback in Render container logs. | Headless API without `TEMPLATES` raises `TemplateDoesNotExist: rest_framework/api.html` when DRF defaults to `BrowsableAPIRenderer` on HTML Accept headers; default production logging silences 500 errors when `ADMINS` is empty. | Configured `DEFAULT_RENDERER_CLASSES = ['rest_framework.renderers.JSONRenderer']` in `REST_FRAMEWORK` to enforce headless JSON responses across all request types (ensuring `GET /api/contact/` returns clean HTTP 405 JSON without template lookups); configured `LOGGING` dictionary with `StreamHandler` console handler for `django.request` ERROR records. Verified by 5 new unit tests (136 backend unit tests total). | **Resolved Locally & Verified (Pending Next Deployment)** |

---

## 5. Technical Specifications & Deployment Guidance

### 5.1 Credential Architecture & Out-of-Band Migration Security Rule

1. **Role Separation:**
   - **Runtime Identity (`portfolio_user`):** Used exclusively by the Render web service. Grants strictly limited to DML: `SELECT, INSERT, UPDATE` on `portfolio_db.*`. Has zero DDL privileges and zero `DELETE` privilege.
   - **Migration Identity (`portfolio_migrator`):** Used exclusively for executing schema migrations out-of-band via `python manage.py migrate`. Grants include `CREATE, ALTER, DROP, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE`.
2. **CRITICAL SECURITY RULE FOR RENDER:**
   - The Render Web Service dashboard must **NEVER** contain `DB_MIGRATE_USER` or `DB_MIGRATE_PASSWORD`.
   - Migrations are never executed automatically during Render container build or startup.
   - Migrations are executed strictly out-of-band by the authorized operator from a secure workstation.

### 5.2 Render Starter Configuration Specification

- **Service Type:** Web Service (Python)
- **Root Directory:** `backend`
- **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command:**
  ```bash
  gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 60
  ```
- **Health Check Path:** `/api/health/`
- **Instance Type:** Starter (512 MB RAM, 0.5 CPU, $7/month)
- **Auto-Deploy:** Optional (manual deploy recommended for initial release)
- **Proposed Linux CA Bundle Path:** `/etc/ssl/certs/ca-certificates.crt`
  *(Note: This is Ubuntu's standard system CA bundle path. Its existence must be verified in the actual Render Linux container environment.)*

#### Proposed Render Environment Variable Matrix

| Variable Name | Required Value / Description | Sensitivity |
| :--- | :--- | :--- |
| `DJANGO_SECRET_KEY` | High-entropy random string (>= 50 chars) | Secret |
| `DJANGO_DEBUG` | `False` | Configuration |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,api.adnanabdullahi.com,<render-internal-host>` | Configuration |
| `CORS_ALLOWED_ORIGINS` | `https://adnanabdullahi.com` | Configuration |
| `CF_ORIGIN_SECRET` | High-entropy shared secret or comma-separated list of secrets (for rotation) matching Cloudflare Transform Rule | Secret |
| `DB_NAME` | `portfolio_db` | Configuration |
| `DB_USER` | `portfolio_user` (TiDB runtime username) | Configuration |
| `DB_PASSWORD` | Runtime database user password | Secret |
| `DB_HOST` | `gateway01.eu-central-1.prod.aws.tidbcloud.com` | Configuration |
| `DB_PORT` | `4000` | Configuration |
| `DB_SSL_MODE` | `VERIFY_IDENTITY` | Configuration |
| `DB_SSL_CA` | `/etc/ssl/certs/ca-certificates.crt` | Configuration |
| `RESEND_API_KEY` | Resend API secret key (`re_...`) | Secret |
| `CONTACT_NOTIFICATION_TO` | Portfolio owner email address | Secret |
| `CONTACT_NOTIFICATION_FROM` | Authorized sender identity (e.g. `Portfolio Contact <onboarding@resend.dev>`) | Configuration |

*Prohibited on Render:* `DB_MIGRATE_USER`, `DB_MIGRATE_PASSWORD`, `EMAIL_SIMULATION_ALLOWED`.

#### 5.2.1 Reverse-Proxy, Rate-Limiting, and Cache Architecture
- **Visitor Identification:** Public requests route through Cloudflare Pages/DNS to Render. Cloudflare injects the trusted `CF-Connecting-IP` header. Django extracts and normalizes this header to enforce the 5 requests/hour quota.
- **Fail-Closed Security:** In production (`DEBUG=False`), requests missing `CF-Connecting-IP`, containing whitespace-only or multi-valued headers, or presenting malformed addresses return HTTP 400 Bad Request without writing to TiDB or invoking Resend. `REMOTE_ADDR` and `HTTP_X_FORWARDED_FOR` are strictly ignored.
- **Origin Ingress Protection & Health-Check Direct Return (`CloudflareOriginSecretMiddleware`):**
  - Direct requests to `*.onrender.com` that bypass Cloudflare are blocked fail-closed with HTTP 403 Forbidden.
  - Cloudflare edge injects `X-Origin-Secret` via a Request Header Transform Rule on all proxy routes.
  - Django middleware validates `X-Origin-Secret` using `hmac.compare_digest` across all comma-separated candidate secrets in `CF_ORIGIN_SECRET` without short-circuiting to prevent timing side-channels.
  - In production (`DEBUG=False`), if `CF_ORIGIN_SECRET` is unset, whitespace-only, or empty, the middleware fails closed (HTTP 403) on protected endpoints.
  - Liveness probe direct return: `GET` and `HEAD` requests to `/api/health` and `/api/health/` return directly at the middleware edge (`JsonResponse({'status': 'healthy'}, status=200)` for GET; empty-body `HttpResponse(b'', content_type='application/json', status=200)` for HEAD). This short-circuits the pipeline before downstream `SecurityMiddleware` or `CommonMiddleware` host header validation, allowing Render's internal hosting probes (which use internal container Host headers like `*.onrender.com`, `10.x.x.x:PORT`, or `0.0.0.0:PORT` and lack Cloudflare headers) to succeed cleanly without triggering `DisallowedHost` (HTTP 400). Unsupported methods on `/api/health` return HTTP 403 without a valid secret and HTTP 405 with a valid secret.
  - Zero-downtime secret rotation:
    1. Initial secret: `CF_ORIGIN_SECRET=secret_v1` on Render and Cloudflare.
    2. Add candidate: Update Render to `CF_ORIGIN_SECRET=secret_v2,secret_v1`.
    3. Update Cloudflare: Modify Transform Rule header to `secret_v2`.
    4. Verify traffic: Confirm requests succeed with `secret_v2`.
    5. Prune old secret: Update Render to `CF_ORIGIN_SECRET=secret_v2`.
- **Cache & Concurrency Model:** Gunicorn runs with 1 worker and 2 threads (`--workers 1 --threads 2`). Django's default `LocMemCache` uses an internal `threading.Lock()`, safely sharing rate-limit state between threads without external Redis infrastructure.
- **Known Cache Limitations:**
  - *Worker Restarts:* Because `LocMemCache` resides in process memory, restarting Gunicorn (due to deploys, health recycles, or server restarts) clears accumulated rate-limit counters. For this portfolio, this fail-open-on-restart behavior is acceptable.
  - *Multi-Worker / Multi-Instance Scaling:* If workers are scaled (`--workers > 1`) or multiple Render instances are deployed, in-memory caches will diverge, multiplying the effective limit by the worker/instance count. A centralized cache (such as Redis) would be required only at that future scale.
- **Private Service-to-Service Limitation:** Any non-Cloudflare traffic (internal probes, direct webhooks) hitting `/api/contact/` lacks `CF-Connecting-IP` and `X-Origin-Secret` and will receive HTTP 403 or HTTP 400. (Health probes at `/api/health` and `/api/health/` explicitly short-circuit at the middleware edge and are completely unaffected).

### 5.3 Resend Notification Architecture & Email Acceptance Criteria

1. **Decoupled Operation:** Message persistence to MySQL/TiDB is primary. A downstream notification failure marks `delivery_status='failed'` on the database record, but returns HTTP 201 Created and the UUID receipt to the visitor.
2. **Sender Domain Rules:**
   - Testing sender identity: `onboarding@resend.dev` delivers notifications strictly to the email registered with the Resend account.
   - Production domain: Sending from a custom domain (e.g., `contact@adnanabdullahi.com`) requires configuring SPF and DKIM DNS records at the domain registrar.
3. **Reply-To Integrity:** The visitor's submitted email is supplied in the `reply_to` field. The `from` address is never spoofed as the visitor.
4. **Live Verification Status:** End-to-end email transmission to an external inbox was deliberately not executed during Stage 2.10 to preserve free quota limits. Live notification delivery will be verified during Stage 09.4 post-deployment acceptance testing.

### 5.4 Cloudflare DNS and Transform Rule Configuration Specification

1. **DNS Architecture (Custom Subdomain):**
   - **Hostname:** `api.adnanabdullahi.com`
   - **Type:** CNAME
   - **Target:** `<app-name>.onrender.com` (assigned Render web service domain)
   - **Proxy Status:** Proxied (Orange Cloud enabled)
   - **SSL/TLS Mode:** Full (Strict)
2. **Request Header Transform Rule (Origin Protection):**
   - **Rule Name:** `Inject-Render-Origin-Secret`
   - **Scope / Filter:** `(http.host eq "api.adnanabdullahi.com")`
   - **Action:** Set static request header:
     - Header Name: `X-Origin-Secret`
     - Header Value: `<high-entropy-random-secret>` (matching active secret in Render `CF_ORIGIN_SECRET`)
3. **Frontend Integration:**
   - Cloudflare Pages custom domain: `https://adnanabdullahi.com`
   - Build environment variable: `VITE_API_BASE_URL=https://api.adnanabdullahi.com`

---

## 6. Explicitly Unverified Deployment Details (What Has NOT Been Done)

To preserve engineering accuracy and avoid false claims of operational readiness:

1. **Render Deployment Status (Second Deployment Successful; Third Deployment Pending):** The second Render deployment attempt (commit `1aff35b`) succeeded: dependency installation, build, and Gunicorn startup finished cleanly; Render's internal health check succeeded; and `https://api.adnanabdullahi.com/api/health/` returned HTTP 200. Direct ingress to `https://<render-host>.onrender.com/api/contact/` returned HTTP 403 Forbidden ("Missing or empty origin secret"), verifying that `CloudflareOriginSecretMiddleware` is actively running and protecting the origin. A browser inspection of proxied `GET /api/contact/` revealed an unhandled `TemplateDoesNotExist` error (D09-14), which has been resolved locally in Stage 3.6C. Cloudflare Pages has not yet been provisioned. Live deployment remains pending the third deployment attempt with the Stage 3.6C correction.
2. **Live Render-to-TiDB Handshake on Contact Submission Pending Verification:** While container health checks pass, no live contact form submission has yet been dispatched from the production frontend to verify runtime write connectivity from the live Render Linux container to TiDB Cloud.
3. **Render CA Bundle Path Unverified on Host:** `/etc/ssl/certs/ca-certificates.crt` is the standard Linux path tested locally via mocking and path normalization; its presence on the specific Render container image will be exercised upon the first live database write.
4. **Live Email Delivery Unverified:** Live delivery of a visitor notification email to the owner's personal inbox via Resend HTTPS API has not yet been tested.
5. **Cross-Origin DNS and Browser Negotiation Unverified:** Live cross-origin communication between a Cloudflare Pages domain and a Render domain has not yet been tested in a live browser.
6. **Live Reverse-Proxy Header Propagation Unverified:** Delivery and preservation of `CF-Connecting-IP` across Cloudflare edge to Render Gunicorn backend has been verified via isolated unit tests, but not yet observed during a real contact submission on provisioned infrastructure.
7. **Live Origin Secret Header Injection Confirmed on Host:** Real-world origin protection was confirmed during the second deployment: direct hits without `X-Origin-Secret` received HTTP 403 Forbidden, and proxied requests traversing Cloudflare reached the application view layer. Live contact submission end-to-end verification remains pending deployment of commit Stage 3.6C.

---

## 7. Audit Disposition & Progression

- **Baseline Code State:** Codebase is hardened, fail-closed, pure-Python, proxy-aware, origin-protected, health-check verified, DRF JSON-rendered, and verified by **136 backend unit tests** (in isolated SQLite test environment) and **163 frontend unit tests** (**299 total tests**).
- **Database State:** `portfolio_db` is migrated (Stage 2.9) and integration-accepted (Stage 2.10) with 1 permanent synthetic record.
- **Evaluated Architecture:** Cloudflare Pages (Frontend, $0) + Render Starter (Backend, $7/month candidate) + TiDB Cloud Serverless (Database, $0 quota) + Resend (Notifications, $0 quota).
- **Next Required Step:** Commit and push the Stage 3.6C JSONRenderer and production console logging correction and execute the third Render deployment attempt.
