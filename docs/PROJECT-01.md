# PROJECT 01 — PROFESSIONAL ENGINEERING PORTFOLIO

## Project Identity

**Project:** Professional Engineering Portfolio
**Project Number:** 01
**Repository:** `adnan-abdullahi/adnan-abdullahi`
**Status:** Active
**Purpose:** Professional engineering project

---

## Project Authority

`PROJECT-01.md` is the authoritative project-level record for the current state of Project 01.

This authority applies to project-level lifecycle position, current stage, overall project status, and the high-level distinction between completed, active, deferred, and unresolved work.

Stage-specific records remain the detailed records for the history, reasoning, decisions, evidence, and acceptance of their respective stages.

A current project state does not, by itself, constitute authorization to execute every activity within that stage.

---

## Project Definition

This repository contains the engineering work for Project 01: the development of a professional engineering portfolio.

The portfolio is itself the first professional engineering project.

It is intended to demonstrate, through actual work and evidence, both technical capability and the human qualities required of a professional engineer.

The portfolio is therefore not merely a collection of pages, projects, or claims.

It is a professional engineering product that allows others to understand, inspect, evaluate, and verify the engineer's work, reasoning, capability, growth, and professional judgment.

---

## Engineering Principle

The project follows the principle:

> Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity

Technology is treated as an instrument that assists engineering work.

Human understanding, judgment, responsibility, and verification remain central.

---

## Engineering Record Controls

Project 01 preserves the distinction between historical engineering development and the current project state.

Where historical information could reasonably be mistaken for current guidance, a lightweight disposition may be used to identify its status, such as:

- Current
- Historical
- Superseded
- Deferred
- Rejected
- Unresolved

These dispositions are used where they materially improve clarity and are not required as metadata for every record.

Active and future stages establish a lightweight boundary before meaningful execution or delegation. The boundary identifies:

- Purpose
- Scope
- Non-Scope
- Expected Outcome
- Acceptance
- Authorization

Historical stages are not retroactively reconstructed solely to satisfy this structure. They are updated only where ambiguity materially affects current work.

For material engineering decisions, the record should distinguish, where relevant:

**Proposal → Human Decision → Authorization → Execution → Verification**

The repository does not treat an agent proposal as a human decision or authorization.

Material engineering claims should be supported by evidence appropriate to the claim. Where relevant, the record should distinguish observation, interpretation, proposal, decision, authorization, implementation, verification, and acceptance.

External artifacts remain attributable to their respective tools and sources. Penpot remains the visual design workspace/source, while this repository remains the engineering record. External artifacts should be traceable to relevant engineering decisions, and selected visual evidence may be preserved in the repository when it materially improves independent inspectability.

---

## Project Development Model

The project progresses through:

1. Product Constitution
2. Product Experience & Structure Discovery
3. UX/UI Materialization and Prototype Validation
4. Design Foundations in Penpot
5. Portfolio Screens
6. Prototype
7. Validation
8. Engineering Implementation
9. Evaluation
10. Reflection and Growth

The process is iterative rather than strictly linear.

Evidence discovered during later work may require earlier decisions to be revisited.

### Stage 04 Documentation Note

Stage 04 — Design Foundations in Penpot was completed as part of the project's design process.

The stage established and validated the foundational design decisions required before portfolio screen reconstruction, including:

- Color
- Typography
- Spacing and layout
- Responsive behavior
- Accessibility foundations
- Interaction and state foundations
- Screen-readiness criteria

The formal acceptance checkpoint is recorded in:

**`docs/STAGE-04-DESIGN-FOUNDATIONS-ACCEPTANCE-CHECKPOINT.md`**

The acceptance process included implementation, read-only verification, targeted reconciliation of an apparent inspection discrepancy, and final acceptance.

This checkpoint records the engineering evidence and decision path rather than merely marking the stage as complete.

---

## Stage 05 Closure Note

Stage 05 — Portfolio Orientation has been completed and closed.

The consolidated Stage 05 engineering record remains the governing artifact:

**`docs/STAGE-05-PORTFOLIO-ORIENTATION.md`**

The stage established and verified the Portfolio Orientation structure against the approved information hierarchy and design foundations.

The final Stage 05 reconciliation established:

- **Structure:** Accepted — no material reconstruction required.
- **Color governance:** The intentional manual white used by the Primary Action text was retained; the Portfolio Orientation board background was bound to the existing `Global / bg-primary` token and verified at the same resolved value of `#FFFFFF`.
- **Spacing:** Inspected against the approved `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px` foundation and accepted as-is. No material spacing defect or reconstruction requirement was established.
- **Interactions:** Deliberately deferred. The existing actions remain semantically defined, but their actual destinations belong to subsequent portfolio information architecture and destination work. No speculative interaction was introduced.

The resulting Stage 05 state is:

**Accepted — Portfolio Orientation complete.**

Historical reconstruction decisions remain preserved in the Stage 05 engineering record and are not treated as current defects after reconciliation.

---

## Current Position

Stages 01–07 have been completed and accepted as documented in their governing records.

**Stage 08 — Engineering Implementation: Closed (2026-10-27).**

The Stage 08 implementation and closure record is:

**`docs/STAGE-08-ENGINEERING-IMPLEMENTATION.md`**

The Stage 08 engineering journal, including technical decisions, verification evidence, discrepancy handling, and remaining uncertainty, is:

**`journal/P1-STAGE08-ENGINEERING-IMPLEMENTATION.md`**

The closure commit is `d20454a680da8dddf7f350a7eebf4eaebcc4a0d9` (`chore: close Stage 08 engineering implementation`). The owner pushed this commit to GitHub on 2026-10-27.

The recorded verification baseline is:
- TypeScript check: 0 reported errors.
- Unit tests: 119 passed across 9 suites.
- Accessibility tests: 15 passed.
- End-to-end tests: 188 passed, 1 intentional mobile-project skip, 0 failed.
- Production build: successful.

The mobile skip is limited to the desktop-header navigation test when running under the mobile Playwright project; mobile navigation is covered by separate tests. Manual assistive-technology evaluation and further performance evaluation remain appropriate topics for Stage 09.

**Stage 09 — Evaluation: Active (Started 2026-10-27; Deployment Preparation & Reconciliation Phase).**

Stage 09 formally started with boundary definition and evaluation planning. Its scope integrates evaluation of the implemented portfolio with preparation for, candidate hosting evaluation, and evidence-based evaluation of the public system.

The stage progresses sequentially through:
1. Evaluation plan and baseline (09.1 — recorded).
2. Deployment feasibility and read-only readiness audit (09.2 — completed; updated with Stage 3.2A findings).
3. Deployment preparation and backend hardening (09.3 — completed locally and verified against TiDB):
   - Portable migration credential architecture (`credential_vault.py`) with environment variable precedence.
   - Dedicated stateless liveness health probe (`GET /api/health/`).
   - Contact notification service using Resend HTTPS API (`notifications.py`) with decoupled post-commit dispatch.
   - Django 5.2.18 LTS dependency alignment to support TiDB's MySQL 8.0.11 protocol string.
   - Model-level data integrity for `ContactMessage` compensating for TiDB's disabled CHECK constraints.
   - Controlled initial schema migration (`contact.0001_initial`) executed against TiDB Cloud Serverless (Stage 2.9).
   - Live application/database integration acceptance with synthetic record `e767aae8...` and abuse mitigation (Stage 2.10).
   - Hosting architecture investigation (Stage 3.1) and Render Starter ($7/month) readiness assessment (Stage 3.2A).
   - Universal pure-Python PyMySQL implementation across Windows and Linux, eliminating `mysqlclient` (Stage 3.2B).
   - Fail-closed remote database TLS guards enforcing CA certificate existence and `VERIFY_IDENTITY` mode (Stage 3.2D).
   - Consolidated local Git commit `279d41c75df82d663bc35c4a4a89f6ed34ed2f86` created and synchronized to GitHub.
   - Documentation reconciliation across engineering journal, deployment record, and lifecycle plans (Stage 3.3, commit `884904d`).
   - Proxy-aware rate-limiting identity correction via `CF-Connecting-IP` implemented, verified by 93 backend tests, and reconciled (Stage 3.4, commit `7b6cdd7`).
   - Integrated deployment architecture implemented: `CloudflareOriginSecretMiddleware` verifying `X-Origin-Secret`, dedicated API subdomain `api.adnanabdullahi.com`, TiDB Cloud Serverless TLS verification, independent audit (Stage 3.5D), and LOW findings corrections (Stage 3.5E).
   - Documentation reconciliation across all 7 governing documents and environment templates (Stage 3.5G, commit `51ff6cca62b7cd7785db562a89e96723e72a7172`).
   - First Render deployment attempt executed on commit `51ff6cc` (build and startup succeeded; deployment timed out due to internal health check HTTP 400).
   - Diagnostic investigation and isolated WSGI trace proved Render health probes send internal container Host headers (`*.onrender.com`, `10.x.x.x:PORT`, `0.0.0.0:PORT`) that caused Django `DisallowedHost` (HTTP 400) downstream.
   - Stage 3.6A health-check integration correction implemented: `CloudflareOriginSecretMiddleware` returns direct `JsonResponse` (GET) and empty-body 200 (HEAD) on `/api/health` and `/api/health/` bypassing downstream host validation; `/api/health` dual routing added; explicit `head()` method added; `RENDER_EXTERNAL_HOSTNAME` dynamically registered in `ALLOWED_HOSTS`; test suite expanded with 6 tests to 131 backend tests.
4. Public deployment after explicit owner authorization (09.4 — first attempt executed; second attempt pending).
5. Live-system evaluation (09.5 — pending).
6. Findings, approved remediation, verification, and closure decision (09.6 — pending).

The governing Stage 09 plan is **`docs/STAGE-09-EVALUATION.md`**. The chronological engineering record is **`journal/P1-STAGE09-EVALUATION.md`**. The deployment architecture and candidate evaluation record is **`docs/DEPLOYMENT.md`**.

**Current position:** 09.3 deployment preparation completed; first Render deployment attempt executed resulting in health-check HTTP 400 timeout; Stage 3.6A root cause investigated and integration correction implemented and verified across 131 backend unit tests and 163 frontend unit tests; documentation reconciled. Live deployment verification remains pending the second Render deployment attempt.

## Repository Structure

### `app/`

The actual portfolio product and implementation.

### `assets/`

Product assets such as images, media, fonts, and other required resources.

### `diagrams/`

Engineering diagrams, models, flows, architecture representations, and related visual documentation.

### `docs/`

Authoritative project documentation, specifications, decisions, and other formal artifacts.

### `experiments/`

Experiments, investigations, prototypes, and temporary engineering explorations.

### `journal/`

Engineering observations, process records, reflections, learning, uncertainty, and development history.

---

## Evidence Principle

The project prioritizes evidence over assertion.

Capability claims should be connected to meaningful evidence.

Engineering decisions should, where appropriate, preserve:

- context
- observations
- alternatives
- reasoning
- consequences
- results
- verification
- reflection

Incomplete, failed, uncertain, or superseded work may be represented when it provides meaningful evidence of engineering practice.

Evidence should be appropriate to the claim being made; implementation, observation, or external artifact presence is not by itself equivalent to verification or acceptance.

---

## Repository Principle

The repository is the engineering workspace and historical record for Project 01.

Changes should be made deliberately and committed as meaningful units of work.

The repository should preserve sufficient history to understand how the project developed.

---

## Current Status

**Workspace:** Established
**GitHub repository:** Connected
**Local working directory:** Established
**Project structure:** Established
**Stage 04:** Accepted — Design Foundations in Penpot
**Stage 05:** Closed — Portfolio Screens / Portfolio Orientation
**Stage 06:** Accepted and Closed — Prototype
**Stage 07:** Accepted and Closed — Validation
**Stage 08:** Closed — Engineering Implementation
**Stage 09:** Active — 09.1 baseline recorded; 09.2 audit completed; 09.3 deployment hardening, live TiDB migration (Stage 2.9), integration acceptance (Stage 2.10), universal PyMySQL and fail-closed TLS (Stages 3.2B/3.2D, commit `279d41c`); Stage 3.3 documentation reconciliation (commit `884904d`); Stage 3.4 proxy-aware rate-limiting identity correction (commit `7b6cdd7`); Stage 3.5 integrated deployment architecture (commit `51ff6cc`); Stage 3.6A health-check integration correction implemented, committed (commit `1aff35b`), and deployed to Render; second Render deployment verified health check HTTP 200 and origin secret protection HTTP 403; Stage 3.6B investigation identified DRF BrowsableAPIRenderer HTML template lookup and production logging gap; Stage 3.6C JSONRenderer restriction and production console logging implemented and verified locally across 136 backend tests and 163 frontend tests; documentation reconciled; third Render deployment attempt pending owner execution

Stage 08 closure is documented in:

**`docs/STAGE-08-ENGINEERING-IMPLEMENTATION.md`**

Its detailed implementation history, technical decisions, verification evidence, discrepancy record, and remaining uncertainty are maintained in:

**`journal/P1-STAGE08-ENGINEERING-IMPLEMENTATION.md`**

Stage 09's governing plan, chronological journal, and deployment-readiness record are:
- `docs/STAGE-09-EVALUATION.md`
- `journal/P1-STAGE09-EVALUATION.md`
- `docs/DEPLOYMENT.md`

The next step is project owner review and execution of the third Render deployment attempt to verify live contact endpoint behavior with JSON-only rendering and production console logging. Stage 09 remains subject to observation → investigation → proposal → human decision → authorization → execution → verification controls.

