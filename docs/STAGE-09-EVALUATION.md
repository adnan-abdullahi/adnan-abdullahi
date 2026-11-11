# Stage 09 — Evaluation

**Status:** Active — Database migration completed (Stage 2.9); integration accepted (Stage 2.10); universal PyMySQL and fail-closed TLS hardened (Stages 3.1–3.2D); Stage 3.4 rate-limiting reverse-proxy identity correction implemented, verified by 93 backend tests, and reconciled; deployment preparation pending owner authorization
**Project:** Project 01 — Professional Engineering Portfolio
**Stage:** 09 of 10
**Governing project record:** `docs/PROJECT-01.md`
**Governing Baseline Commit:** `884904d8ada8c35d35bbd2a99033ce40307fc768`

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

**Status:** Hardening, live database migration, integration acceptance, and universal driver implementation completed; documentation reconciled (2026-11-10).

Implemented, verified, and committed:
- **Migration Credential Architecture:** Platform-neutral `backend/credential_vault.py` with deterministic precedence (`DB_MIGRATE_*` environment variables -> Windows Credential Manager -> fail closed). Verified by 29 unit tests.
- **Liveness Health Probe:** Dedicated stateless endpoint `GET /api/health/` returning HTTP 200 in 0 database queries. Verified by 3 unit tests.
- **Contact Notification Dispatcher:** Resend HTTPS API via `urllib.request` in `backend/contact/notifications.py`, bypassing blocked SMTP ports. Post-commit decoupled dispatch ensures message persistence is primary.
- **Universal PyMySQL Architecture (Stage 3.2B):** Replaced native `mysqlclient` with pure-Python `pymysql>=1.1.1,<2.0` across Windows and Linux, eliminating C-extension compilation dependencies on Render.
- **Fail-Closed Remote Database TLS (Stage 3.2D):** `backend/config/settings.py` enforces that remote connections require `DB_SSL_CA` pointing to an existing file on disk and enforce `DB_SSL_MODE='VERIFY_IDENTITY'`. Local loopback connections retain clean unencrypted baseline.
- **Live Database Migration (Stage 2.9):** Executed `contact.0001_initial` against live TiDB Cloud Serverless cluster (`gateway01.eu-central-1.prod.aws.tidbcloud.com:4000`, `portfolio_db`). Schema verified with `django_migrations` and `contact_message` (11 columns, 4 secondary indexes).
- **Integration Acceptance (Stage 2.10):** Dispatched live submission; verified Option A persistence with permanent synthetic record `e767aae8-0cf2-44af-b51c-1c23a07e8642`. Verified honeypot rejection (T-02) and CRLF rejection (T-03).
- **Render Deployment Readiness Audit (Stage 3.4A):** Analyzed deployment readiness for Render Starter, discovering reverse-proxy IP collusion risks under `REMOTE_ADDR`.
- **Rate-Limiting Investigation (Stage 3.4B):** Evaluated reverse-proxy visitor identification strategies and approved Cloudflare `CF-Connecting-IP` fail-closed architecture.
- **Proxy-Aware Rate Limiting Implementation (Stage 3.4C):** Implemented production visitor identity via `CF-Connecting-IP` with fail-closed HTTP 400 validation, canonical IPv4/IPv6 normalization, and `DEBUG=True` fallback.
- **Regression Suite:** **93 backend unit tests** (in isolated SQLite test environment) and **160 frontend tests** (253 total) passing cleanly.
- **Consolidated Git Commit:** Created and pushed commit `279d41c75df82d663bc35c4a4a89f6ed34ed2f86` (`feat(backend): enforce secure cross-platform database connectivity`) and commit `884904d` (`docs(stage-09): reconcile deployment evaluation records`).
- **Documentation Reconciliation (Stage 3.3 & Stage 3.4C):** Reconciled engineering journal, deployment record, stage evaluation plan, and contact specification.

Pending authorization & execution:
- Project owner provisioning of Render Starter Web Service ($7/month).
- Out-of-band environment variable configuration on Render dashboard.

Exit condition: Approved changes are implemented, tested, and reconciled; no secrets are committed; the local development workflow remains functional. **Satisfied:** Codebase is hardened and reconciled; deployment execution awaits owner authorization.

### 09.4 — Public Deployment

**Status:** Pending explicit authorization.

Activities will include provisioning the evaluated Render Starter Web Service, configuring Cloudflare Pages for static frontend hosting, establishing environment variables, and connecting the public frontend to the backend API.

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
- [ ] Project owner authorization and provisioning of Render Starter Web Service.
- [ ] Production environment variable configuration on hosting providers (09.4).
- [ ] Public deployment and live verification (09.4 & 09.5).

**Current stage position:** 09.3 / Stage 3.4C — Codebase hardened, database migrated, integration accepted, proxy-aware rate limiting implemented and verified by 93 backend unit tests, and documentation reconciled; deployment preparation pending explicit owner authorization.
