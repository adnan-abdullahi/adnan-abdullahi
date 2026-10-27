# Stage 09 — Evaluation

**Status:** Started — Planning and baseline (2026-10-27)  
**Project:** Project 01 — Professional Engineering Portfolio  
**Stage:** 09 of 10  
**Governing project record:** `docs/PROJECT-01.md`

## 1. Purpose

Stage 09 evaluates the implemented portfolio as an engineering product and, subject to feasibility and explicit authorization, as a publicly accessible system.

The stage connects deployment with evaluation. Deployment is a means of creating a real environment in which to evaluate the portfolio; a hosting provider reporting a successful deployment is not, by itself, evidence that the product works correctly.

The stage must establish what is already supported by Stage 08 evidence, identify remaining uncertainties, investigate a zero-cost deployment path, evaluate the deployed system if deployment is authorized and feasible, and produce a defensible findings and closure record.

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

These results are the recorded Stage 08 baseline, not proof of production deployment or live-system behavior. Stage 09 should reuse this evidence where appropriate and rerun checks when changes, environment differences, or evaluation questions make it necessary.

Known deployment-relevant facts requiring investigation:
- The frontend is a Vue 3 / TypeScript / Vite application.
- The Django REST backend provides the contact endpoint at `/api/contact/`.
- Local development uses the Vite proxy to `http://127.0.0.1:8000`; a production frontend must not depend on that local address.
- The backend currently uses MySQL configuration.
- Django migration execution uses a credential retrieved from Windows Credential Manager, which requires investigation before a cloud deployment workflow can be considered portable.
- The email backend defaults to Django's console email backend, which logs messages rather than delivering real email.
- Current backend host, CORS, secret, database and debug settings must be evaluated for a production environment.

These are investigation inputs, not authorization to change the implementation or migrate the database.

## 3. Stage Boundary

### In scope

1. Establish an evaluation protocol and a traceable baseline.
2. Review the existing Stage 08 evidence and identify material uncertainties without needlessly repeating accepted tests.
3. Conduct a read-only deployment-readiness audit.
4. Compare feasible hosting and database options under the strict zero-cost constraint.
5. Propose the smallest justified changes required for a secure, reproducible deployment.
6. After explicit approval, prepare and deploy the frontend and backend using free plans and provider subdomains.
7. After deployment is authorized and available, test the public application and its integration.
8. Evaluate usability, responsive behavior, accessibility, performance, compatibility, security configuration, contact-form behavior, reliability, and evidence integrity in proportion to the system.
9. Record findings, limitations, approved remediation, verification results, and a human closure decision.

### Non-scope

Stage 09 does not authorize:

- Any paid hosting, paid plan, subscription, domain purchase, or other spend.
- Creating accounts or changing settings on external services without explicit approval.
- Deployment or publication without explicit approval.
- Repository or application changes merely because an audit identifies a possible improvement.
- A database migration before investigation and explicit approval.
- Unnecessary architecture, multi-region infrastructure, premature scaling, or new product features.
- Claims of production readiness, security, accessibility conformance, reliability, or successful email delivery without corresponding evidence.
- Reopening accepted prior-stage decisions without material evidence.
- Committing, pushing, merging, tagging, or changing GitHub configuration without explicit authorization.

Free hosting is subject to provider limits and terms. The target is zero required monetary cost, not a promise of unlimited capacity or permanent availability.

## 4. Sequential Work Structure

### 09.1 — Evaluation Plan and Baseline

**Status:** In progress.

Activities:
- Record this stage boundary and evaluation sequence.
- Identify the accepted Stage 08 baseline and its evidence.
- Separate verified facts from unknowns and proposed work.
- Establish evaluation categories and acceptance criteria.

Exit condition: The stage boundary, baseline, and acceptance criteria are recorded and reviewed.

### 09.2 — Zero-Cost Deployment Feasibility and Readiness Audit

**Status:** Pending.

Activities:
- Inspect deployment-related frontend and backend configuration read-only.
- Determine frontend build and routing requirements.
- Determine the production API URL and CORS requirements.
- Investigate MySQL hosting compatibility and alternatives without changing databases.
- Investigate how migrations and secrets can be handled without a dependency on the developer's local Windows Credential Manager.
- Review persistence, backup, cold-start, free-tier and service-limit implications.
- Determine how contact submissions should be delivered and whether an appropriate free email API exists.
- Compare options and recommend the smallest viable architecture.

Exit condition: A written audit distinguishes confirmed facts, uncertainties, trade-offs, free-tier constraints, and proposed changes. No implementation or external-service change is made during this audit.

### 09.3 — Deployment Preparation

**Status:** Pending explicit review and approval.

Activities may include approved environment/configuration changes, reproducible build and start commands, secure environment variable handling, database connectivity, migration procedure, frontend API configuration, CORS/allowed-host configuration, and deployment documentation.

Exit condition: Approved changes are implemented and verified locally; no secrets are committed; the local development workflow remains functional.

### 09.4 — Public Deployment

**Status:** Pending explicit authorization.

Activities may include creating or configuring the selected free hosting services, deploying the frontend and backend, configuring a free database option, and connecting the public frontend to the API.

Use provider-provided subdomains; do not purchase a custom domain.

Exit condition: Public URLs and the exact deployed source revision are recorded, basic health checks succeed, and actual costs remain zero.

### 09.5 — Live-System Evaluation

**Status:** Pending successful deployment.

Evaluation areas:
- Public route loading, direct navigation, refresh and hash routing.
- Primary and secondary navigation, including mobile navigation.
- Responsive layouts and visual fidelity.
- Accessibility, including an appropriate manual assistive-technology review where available.
- Contact form validation, API integration, success/error states and actual delivery behavior.
- Production configuration, exposed-secret checks, allowed hosts, CORS, throttling and error handling.
- Production build, browser compatibility, performance and cold-start behavior.
- Database persistence and documented limitations.
- Correspondence between the evaluated deployed revision and the recorded source revision.

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
2. **Feasibility:** A zero-cost deployment architecture and its constraints are documented.
3. **Local integrity:** Approved deployment preparation preserves the local development workflow and existing quality baseline.
4. **Public availability:** If deployment is authorized and feasible, frontend and backend are reachable through public HTTPS URLs.
5. **Functional behavior:** Applicable routes, navigation, interactions and refresh behavior work in the evaluated environment.
6. **Integration:** The deployed frontend communicates with the backend using production configuration.
7. **Contact behavior:** Form validation and API outcomes are verified; email delivery is claimed only if an actual delivery test succeeds.
8. **Accessibility and responsiveness:** Automated results and appropriate human/manual checks are recorded without unsupported conformance claims.
9. **Security:** Production settings and secret-handling risks are reviewed and material findings are addressed or explicitly accepted.
10. **Reliability and operations:** Persistence, free-tier limitations, cold starts, logs and backup limitations are documented.
11. **Cost:** No paid service, domain, or subscription is required or introduced.
12. **Evidence integrity:** Findings, fixes, limitations, and the deployed revision are accurately documented.
13. **Human closure:** Stage 09 is not marked closed solely by an automated result or agent recommendation.

If public deployment proves infeasible within the zero-cost boundary, Stage 09 must document the evidence and the remaining gap; it must not describe the application as publicly deployed.

## 6. Decision and Authorization Controls

Material work follows:

**Observation → Investigation → Finding → Proposal → Human Decision → Authorization → Execution → Verification → Record**

In particular:
- A readiness audit is read-only.
- A recommendation is not authorization.
- Stage 09 being active is not blanket authorization to deploy.
- No paid service or domain is permitted under the project's stated constraint.
- No external account, repository setting, deployment, or production change is made without explicit approval.

## 7. Initial Open Questions

These questions are intentionally unresolved until the readiness audit provides evidence:

- Which free hosting combination best fits the Vue/Vite frontend and Django API?
- Can the existing MySQL requirement be supported sustainably at zero cost, or would an approved database change be needed?
- How can database migrations be run securely without relying on a credential stored only in Windows Credential Manager?
- What free and reliable method, if any, can deliver contact messages to the intended inbox?
- What data persistence, sleep/cold-start, backup, bandwidth, build-minute, and usage limits apply to the chosen services?
- Which manual assistive-technology and performance checks are practical with the available tools?

## 8. Current Progress

- [x] Stage 09 marked as started in `docs/PROJECT-01.md`.
- [x] Stage 09 purpose, boundary, sequence, and acceptance criteria drafted.
- [x] Stage 08 baseline and known deployment-relevant facts recorded.
- [ ] Review and agree the Stage 09 boundary.
- [ ] Conduct the read-only deployment-readiness audit.
- [ ] Record the zero-cost architecture recommendation.
- [ ] Seek approval before implementation or external changes.

**Current stage position:** 09.1 — Evaluation Plan and Baseline. The next sequential activity is review of this boundary, followed by 09.2 read-only deployment-readiness audit. No deployment has been performed.
