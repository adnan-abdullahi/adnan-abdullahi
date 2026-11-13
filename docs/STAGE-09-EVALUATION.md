# Stage 09 — Evaluation

**Status:** Active — Database migration completed (Stage 2.9); integration accepted (Stage 2.10); universal PyMySQL and fail-closed TLS hardened (Stages 3.1–3.2D); proxy-aware rate-limiting implemented (Stage 3.4C); integrated deployment architecture implemented and verified (Stages 3.5A–3.5G); second Render deployment executed on commit 1aff35b (health checks succeeded, HTTP 200 confirmed, origin protection confirmed); Stage 3.6B investigation identified DRF BrowsableAPIRenderer HTML template lookup and unhandled exception logging gap; Stage 3.6C JSONRenderer restriction and production console logging implemented and verified locally across 136 backend unit tests and 163 frontend tests; third Render deployment attempt pending owner execution
**Project:** Project 01 — Professional Engineering Portfolio
**Stage:** 09 of 10
**Governing project record:** `docs/PROJECT-01.md`
**Governing Baseline Commit:** `1aff35becb354c6b3bbe9736b60e9ff7e574da12` (`1aff35b`)

## 1. Purpose

Stage 09 evaluates the implemented portfolio as an engineering product and, subject to feasibility and explicit authorization, as a publicly accessible system.

The stage connects deployment with evaluation. Deployment is a means of creating a real environment in which to evaluate the portfolio; a hosting provider reporting a successful deployment is not, by itself, evidence that the product works correctly.

The stage must establish what is already supported by Stage 08 evidence, identify remaining uncertainties, investigate deployment paths, evaluate the deployed system if deployment is authorized and feasible, and produce a defensible findings and closure record.

## 2. Starting Baseline

Stage 08 was formally closed on 2026-10-27. Its recorded baseline reports:

- TypeScript check: 0 reported errors.
- Unit tests: 119 passed across 9 suites.
- Automated accessibility tests: 15 passed.
- End-to-end tests: 188 passed, 1 intentional mobile desktop-header skip, 0 failed.
- Production build: successful.

Governing evidence:
- `docs/STAGE-08-ENGINEERING-IMPLEMENTATION.md`
- `journal/P1-STAGE08-ENGINEERING-IMPLEMENTATION.md`

These results are the recorded Stage 08 baseline, not proof of production deployment or live-system behavior. Stage 09 reuses this evidence where appropriate and reruns checks when changes, environment differences, or evaluation questions make it necessary.

## 3. Stage Boundary

### In scope

1. Establish an evaluation protocol and a traceable baseline.
2. Review the existing Stage 08 evidence and identify material uncertainties without needlessly repeating accepted tests.
3. Conduct a read-only deployment-readiness audit.
4. Compare feasible hosting and database options under cost and reliability constraints.
5. Propose the smallest justified changes required for a secure, reproducible deployment.
6. After explicit approval, prepare and deploy the frontend and backend using provider infrastructure.
7. After deployment is authorized and available, test the public application and its integration.
8. Evaluate usability, responsive behavior, accessibility, performance, compatibility, security configuration, contact-form behavior, reliability, and evidence integrity in proportion to the system.
9. Record findings, limitations, approved remediation, verification results, and a human closure decision.

### Non-scope

Stage 09 does not authorize:

- Any unapproved spending, paid plan, domain purchase, or subscription.
- Creating accounts or changing settings on external services without explicit approval.
- Deployment or publication without explicit approval.
- Repository or application changes merely because an audit identifies a possible improvement.
- Unnecessary architecture, multi-region infrastructure, premature scaling, or speculative product features.
- Claims of production readiness, security, accessibility conformance, reliability, or successful email delivery without corresponding evidence.
- Reopening accepted prior-stage decisions without material evidence.
- Committing, pushing, merging, tagging, or changing GitHub configuration without explicit authorization.

## 4. Sequential Work Structure

### 09.1 — Evaluation Plan and Baseline

**Status:** Recorded (2026-10-27).

The boundary, Stage 08 baseline, sequence, acceptance criteria, and authorization controls are recorded in this document and the Stage 09 journal.

Exit condition: The stage boundary, baseline, and acceptance criteria are recorded and reviewed.

### 09.2 — Deployment Feasibility and Readiness Audit

**Status:** Completed — read-only audit (2026-10-27). Reconciled with Stage 3.2A findings (2026-11-10). Detailed record: `docs/DEPLOYMENT.md`.

The audit evaluated candidates:
- Cloudflare Pages for the static Vue/Vite frontend (Free tier).
- Render Web Service for the Django API: evaluated Render Free ($0) initially, then conducted Stage 3.2A readiness assessment recommending Render Starter ($7/month) to eliminate cold starts and spin-down.
- TiDB Cloud Serverless in MySQL-compatible mode for persistent contact records.

Exit condition: A written audit distinguishes confirmed facts, uncertainties, trade-offs, constraints, and proposed changes. **Satisfied:** `docs/DEPLOYMENT.md` records the audit, findings, and official provider references.

### 09.3 — Deployment Preparation

**Status:** Hardening, live database migration, integration acceptance, universal driver, proxy-aware rate limiting, deployment architecture implementation, first deployment failure investigation, and health-check integration correction completed; documentation reconciled (2026-11-13).

Implemented, verified, and committed:
- **Migration Credential Architecture:** Platform-neutral `backend/credential_vault.py` with deterministic precedence (`DB_MIGRATE_*` environment variables -> Windows Credential Manager -> fail closed). Verified by 29 unit tests.
- **Liveness Health Probe:** Dedicated stateless endpoint `GET /api/health/` returning HTTP 200 in 0 database queries. Verified by automated tests.
- **Contact Notification Dispatcher:** Resend HTTPS API via `urllib.request` in `backend/contact/notifications.py`, bypassing blocked SMTP ports. Post-commit decoupled dispatch ensures message persistence is primary.
- **Universal PyMySQL Architecture (Stage 3.2B):** Replaced native `mysqlclient` with pure-Python `pymysql>=1.1.1,<2.0` across Windows and Linux, eliminating C-extension compilation dependencies on Render.
- **Fail-Closed Remote Database TLS (Stage 3.2D):** `backend/config/settings.py` enforces that remote connections require `DB_SSL_CA` pointing to an existing file on disk and enforce `DB_SSL_MODE='VERIFY_IDENTITY'`. Local loopback connections retain clean unencrypted baseline.
- **Live Database Migration (Stage 2.9):** Executed `contact.0001_initial` against live TiDB Cloud Serverless cluster (`gateway01.eu-central-1.prod.aws.tidbcloud.com:4000`, `portfolio_db`). Schema verified with `django_migrations` and `contact_message` (11 columns, 4 secondary indexes).
- **Integration Acceptance (Stage 2.10):** Dispatched live submission; verified Option A persistence with permanent synthetic record `e767aae8-0cf2-44af-b51c-1c23a07e8642`. Verified honeypot rejection (T-02) and CRLF rejection (T-03).
- **Render Deployment Readiness Audit (Stage 3.4A):** Analyzed deployment readiness for Render Starter, discovering reverse-proxy IP collusion risks under `REMOTE_ADDR`.
- **Rate-Limiting Investigation (Stage 3.4B):** Evaluated reverse-proxy visitor identification strategies and approved Cloudflare `CF-Connecting-IP` fail-closed architecture.
- **Proxy-Aware Rate Limiting Implementation (Stage 3.4C):** Implemented production visitor identity via `CF-Connecting-IP` with fail-closed HTTP 400 validation, canonical IPv4/IPv6 normalization, and `DEBUG=True` fallback. Verified by 13 unit tests.
- **Deployment Boundary Investigation (Stage 3.5A):** Investigated Cloudflare-to-Render origin protection, API subdomain routing, and TiDB network access boundaries.
- **Architecture Decision Validation (Stage 3.5B):** Project owner approved three integrated deployment decisions: (1) Cloudflare-to-Render origin protection via `X-Origin-Secret` and Django middleware, (2) Dedicated Cloudflare-proxied API subdomain `api.adnanabdullahi.com`, (3) Retaining TiDB Cloud Serverless default network access with strict TLS (`VERIFY_IDENTITY`) and least-privilege runtime credentials (`portfolio_user`).
- **Integrated Deployment Architecture Implementation (Stage 3.5C):** Implemented `CloudflareOriginSecretMiddleware` verifying `X-Origin-Secret`, supporting multi-secret rotation, fail-closed in production (`DEBUG=False`), and health check exemption; expanded backend tests to 124 unit tests.
- **Independent Engineering Audit (Stage 3.5D):** Audited Stage 3.5C implementation; approved with two LOW findings (LOW-01 health exemption method restriction, LOW-02 non-short-circuit secret iteration).
- **LOW Findings Corrections & Verification (Stage 3.5E):** Restricted health check exemption to GET/HEAD (unsupported methods return HTTP 403 without secret, HTTP 405 with secret); eliminated short-circuiting in secret iteration; verified with 125 backend unit tests, 163 frontend unit tests, and successful frontend build.
- **Documentation Reconciliation (Stage 3.5F & Stage 3.5G):** Reconciled all 7 governing documents and environment templates (commit `51ff6cc`).
- **First Render Deployment Attempt & Failure Investigation (Stage 3.6A):** First deployment of commit `51ff6cc` to Render Starter provisioned, installed dependencies, built, and launched Gunicorn successfully; however, Render's internal health check pinging `/api/health/` repeatedly failed with HTTP 400 Bad Request, timing out the deployment. Diagnostic investigation and isolated WSGI pipeline reproduction proved that internal Render health checks do not traverse Cloudflare, presenting internal container Host headers (`*.onrender.com`, `10.x.x.x:PORT`, `0.0.0.0:PORT`) that caused Django's `SecurityMiddleware` and `CommonMiddleware` to raise `django.core.exceptions.DisallowedHost` (HTTP 400) downstream of `CloudflareOriginSecretMiddleware`.
- **Health-Check Integration Correction (Stage 3.6A):**
  - Updated `CloudflareOriginSecretMiddleware` to intercept `GET` and `HEAD` on `/api/health` and `/api/health/` and return directly at the middleware edge (`JsonResponse({'status': 'healthy'}, status=200)` or `HttpResponse(b'', content_type='application/json', status=200)`), short-circuiting before downstream `ALLOWED_HOSTS` checks.
  - Added direct route for `/api/health` in `backend/config/urls.py` to prevent HTTP 301 redirects during health checks.
  - Added explicit `head()` method to `HealthCheckView` in `backend/contact/views.py`.
  - Appended `RENDER_EXTERNAL_HOSTNAME` dynamically to `ALLOWED_HOSTS` in `backend/config/settings.py`.
  - Expanded test coverage in `backend/tests/test_health.py` with 6 new tests covering all failure modes.
- **Stage 3.6A Local Commit and Push:** Created consolidated commit `1aff35b` (`fix(stage-09): resolve render health-check host rejection and reconcile documentation`) and synchronized to GitHub `main`.
- **Second Render Deployment Attempt & Live Health Verification:**
  - Render deployment of commit `1aff35b` succeeded: dependency installation, build, and Gunicorn startup finished cleanly.
  - Render's internal health check succeeded, confirming the Stage 3.6A middleware edge-return correction resolved the `DisallowedHost` failure.
  - Public probe to `https://api.adnanabdullahi.com/api/health/` returned HTTP 200 OK (`{"status": "healthy"}`).
  - Origin secret enforcement verified live: direct ingress to `https://<render-host>.onrender.com/api/contact/` returned HTTP 403 Forbidden ("Missing or empty origin secret"), confirming that `CloudflareOriginSecretMiddleware` is actively intercepting and rejecting unauthenticated traffic.
  - Cloudflare Transform Rule verified: proxied traffic passed through Cloudflare with injected `X-Origin-Secret` reached the Django application layer.
- **Stage 3.6B Investigation (Contact API Rendering & Production Logging):**
  - Project owner observed that browser access (`Accept: text/html`) to proxied `GET /api/contact/` returned HTTP 500 Internal Server Error, and Render container logs contained no Python error traceback.
  - Investigation proved that DRF content negotiation selected `BrowsableAPIRenderer` because `DEFAULT_RENDERER_CLASSES` was unset; in this headless API lacking `TEMPLATES`, `BrowsableAPIRenderer` raised `TemplateDoesNotExist: rest_framework/api.html`.
  - Concurrently, Django's default `DEBUG=False` logging routes `django.request` 500 errors only to `mail_admins` (which drops them when `ADMINS` is empty), explaining the absence of tracebacks in container logs.
- **Stage 3.6C Implementation & Regression Expansion:**
  - Configured `DEFAULT_RENDERER_CLASSES = ['rest_framework.renderers.JSONRenderer']` in `backend/config/settings.py`, guaranteeing all responses render strictly as JSON and `GET /api/contact/` returns HTTP 405 Method Not Allowed without template lookups.
  - Configured `LOGGING` dictionary with `StreamHandler` (`console`) directing `django.request` ERROR logs to stdout/stderr with `propagate: False`.
  - Added 5 regression tests in `backend/tests/test_contact_api.py` covering HTML Accept headers, JSON Accept headers, and logging configuration.
- **Regression Suite:** **136 backend unit tests** (in isolated SQLite test environment) and **163 frontend unit tests** (299 total) passing cleanly.
- **Consolidated Git Commits:** Commits `279d41c`, `884904d`, `7b6cdd7`, `51ff6cc`, `1aff35b` created and synchronized to GitHub.

Pending authorization & execution:
- Commit and push of Stage 3.6C JSONRenderer and production console logging correction.
- Triggering third Render deployment attempt and verifying live contact endpoint behavior.

Exit condition: Approved changes are implemented, tested, and reconciled; no secrets are committed; the local development workflow remains functional. **Satisfied:** Codebase is hardened and reconciled; deployment execution awaits owner authorization.

### 09.4 — Public Deployment

**Status:** In Progress (Second Render deployment attempt succeeded with commit `1aff35b`; third deployment attempt pending with Stage 3.6C JSONRenderer and console logging corrections).

Activities include provisioning the evaluated Render Starter Web Service, configuring Cloudflare Pages for static frontend hosting, establishing environment variables, connecting the public frontend to the backend API, and verifying live container health.

Exit condition: Public URLs and the exact deployed source revision are recorded, basic health checks succeed, and costs align with owner decisions.

### 09.5 — Live-System Evaluation

**Status:** Pending successful deployment.

Evaluation areas:
- Public route loading, direct navigation, refresh and hash routing.
- Primary and secondary navigation, including mobile navigation.
- Responsive layouts and visual fidelity.
- Accessibility, including manual assistive-technology review where available.
- Contact form validation, API integration, success/error states, and live Resend email delivery.
- Production configuration, exposed-secret checks, allowed hosts, CORS, throttling, and error handling.
- Production build, browser compatibility, performance, and uptime behavior.
- Database persistence and documented limitations.
- Correspondence between evaluated deployed revision and recorded source revision.

Exit condition: Results distinguish pass, fail, partial, not tested, and not applicable; each material finding links to evidence.

### 09.6 — Findings, Remediation and Closure

**Status:** Pending.

Activities:
- Classify findings by severity and consequence.
- Propose responses before changing the product.
- Obtain explicit authorization for material changes.
- Verify approved fixes and rerun affected checks.
- Record residual risks, free-tier constraints, and unresolved issues.
- Present the evidence for a human decision on Stage 09 closure.

Exit condition: The record supports a clear closure decision or explicitly states why the stage remains open.

## 5. Evaluation Acceptance Criteria

Stage 09 can be proposed for closure only when applicable criteria have evidence and unresolved limitations are explicitly accepted or remain blockers:

1. **Traceability:** Stage 08 baseline and Stage 09 results are linked to their records and source revision.
2. **Feasibility:** Deployment architecture, candidate hosting plans, and constraints are documented.
3. **Local integrity:** Deployment preparation preserves local development workflow and existing quality baseline.
4. **Public availability:** If deployment is authorized and feasible, frontend and backend are reachable through public HTTPS URLs.
5. **Functional behavior:** Applicable routes, navigation, interactions and refresh behavior work in the evaluated environment.
6. **Integration:** The deployed frontend communicates with the backend using production configuration.
7. **Contact behavior:** Form validation and API outcomes are verified; email delivery is claimed only if an actual delivery test succeeds.
8. **Accessibility and responsiveness:** Automated results and appropriate human/manual checks are recorded without unsupported conformance claims.
9. **Security:** Production settings and secret-handling risks are reviewed and material findings are addressed or explicitly accepted.
10. **Reliability and operations:** Persistence, hosting tier limitations, uptime, logs, and backup limitations are documented.
11. **Cost:** Cost boundaries align strictly with approved owner decisions.
12. **Evidence integrity:** Findings, fixes, limitations, and the deployed revision are accurately documented.
13. **Human closure:** Stage 09 is not marked closed solely by an automated result or agent recommendation.

## 6. Decision and Authorization Controls

Material work follows:

**Observation → Investigation → Finding → Proposal → Human Decision → Authorization → Execution → Verification → Record**

In particular:
- A readiness audit is read-only.
- A recommendation is not authorization.
- Stage 09 being active is not blanket authorization to deploy.
- No external account, repository setting, deployment, or production change is made without explicit approval.

## 7. Current Progress

- [x] Stage 09 marked as started in `docs/PROJECT-01.md`.
- [x] Stage 09 purpose, boundary, sequence, and acceptance criteria recorded.
- [x] Stage 08 baseline and known deployment-relevant facts recorded.
- [x] 09.2 read-only deployment-readiness audit completed and recorded in `docs/DEPLOYMENT.md`.
- [x] Provisional architecture and key limitations documented.
- [x] Human review and decision on the proposed architecture completed.
- [x] Portable migration credential architecture (Option A) approved, implemented, and verified locally.
- [x] Liveness health endpoint (`GET /api/health/`) implemented and verified.
- [x] Contact notification architecture via Resend HTTPS API implemented and verified.
- [x] Django 5.2.18 LTS dependency alignment completed and verified (Stage 2.5).
- [x] TiDB Cloud database baseline and CHECK constraint audit completed (Stage 2.6).
- [x] Model-level data integrity for `ContactMessage` implemented and verified (Stage 2.7).
- [x] Stage 2.8 repository reconciliation and logical commits completed (`6bf376a`).
- [x] Controlled database migration execution against TiDB Cloud (`contact.0001_initial` in Stage 2.9).
- [x] Live application and database integration acceptance testing with synthetic record (Stage 2.10).
- [x] Read-only hosting architecture investigation (Stage 3.1).
- [x] Render Starter Web Service readiness assessment ($7/month candidate) (Stage 3.2A).
- [x] Universal PyMySQL implementation across Windows and Linux, removing `mysqlclient` (Stage 3.2B).
- [x] Independent security and implementation review (Stage 3.2C).
- [x] Fail-closed database TLS guard and test strengthening to 80 backend unit tests (Stage 3.2D).
- [x] Consolidated local Git commit `279d41c` created and synchronized with GitHub.
- [x] Stage 3.3 documentation reconciliation audit and update completed (`884904d`).
- [x] Stage 3.4A Render deployment preparation audit completed.
- [x] Stage 3.4B read-only rate-limiting and reverse-proxy investigation completed.
- [x] Stage 3.4C proxy-aware rate-limiting implementation, independent review, and test expansion to 93 backend unit tests completed.
- [x] Stage 3.5A deployment boundary and infrastructure readiness investigation completed.
- [x] Stage 3.5B architecture decision validation completed and approved by project owner.
- [x] Stage 3.5C integrated deployment architecture implemented (origin secret middleware, API subdomain routing, TiDB TLS).
- [x] Stage 3.5D independent engineering audit completed (verdict: approved with minor findings).
- [x] Stage 3.5E LOW findings corrected and verified (health method restrictions, non-short-circuit rotation, 125 backend unit tests).
- [x] Stage 3.5F documentation inspection and reconciliation proposal approved.
- [x] Stage 3.5G documentation reconciliation implemented and local commit executed (`51ff6cc`).
- [x] First Render deployment attempt executed on commit `51ff6cc` (build and startup succeeded; deployment timed out due to internal health check HTTP 400).
- [x] Stage 3.6A deployment failure investigation completed (isolated WSGI trace proved Django `DisallowedHost` rejections on internal Render health-check Host headers).
- [x] Stage 3.6A health-check integration correction implemented and verified (middleware direct return, dual URL routes, HEAD method, dynamic `RENDER_EXTERNAL_HOSTNAME`, 131 backend tests).
- [x] Stage 3.6A documentation reconciliation completed and commit `1aff35b` synchronized to GitHub.
- [x] Second Render deployment attempt executed on commit `1aff35b` (build and startup succeeded; internal health checks succeeded; `https://api.adnanabdullahi.com/api/health/` returned HTTP 200; origin protection verified returning HTTP 403 on direct Render hits).
- [x] Stage 3.6B contact API and production logging investigation completed (identified DRF BrowsableAPIRenderer `TemplateDoesNotExist` failure and missing console error logging).
- [x] Stage 3.6C contact API JSON rendering and production console logging correction implemented and verified (136 backend unit tests, 163 frontend unit tests).
- [x] Stage 3.6C documentation reconciliation completed.
- [ ] Third Render deployment attempt execution and live contact verification (09.4).
- [ ] Cloudflare Pages frontend deployment and cross-origin API integration (09.4).
- [ ] Post-deployment live-system acceptance testing (09.5).

**Current stage position:** 09.4 / Stage 3.6C — Contact API JSON rendering and production console logging implemented and verified across 136 backend tests and 163 frontend tests; documentation reconciled; third Render deployment attempt pending owner execution.
