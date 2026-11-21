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

**Stage 09 — Evaluation: Complete, Accepted and Closed (2026-11-15).**

Stage 09 evaluated the implemented portfolio as an engineering product and live public system. Its sequential progression included:
1. Evaluation plan and baseline (09.1 — recorded).
2. Deployment feasibility and read-only readiness audit (09.2 — completed; updated with Stage 3.2A findings in `docs/DEPLOYMENT.md`).
3. Deployment preparation and backend hardening (09.3 — completed and verified against TiDB):
   - Portable migration credential architecture (`credential_vault.py`).
   - Dedicated stateless liveness health probe (`GET /api/health/`).
   - Contact notification service using Resend HTTPS API (`notifications.py`) with decoupled dispatch.
   - Django 5.2.18 LTS dependency alignment for MySQL 8.0.11 protocol string compatibility.
   - Model-level data integrity for `ContactMessage` compensating for disabled TiDB CHECK constraints.
   - Initial schema migration (`contact.0001_initial`) applied out-of-band to TiDB Cloud Serverless (Stage 2.9).
   - Live integration acceptance with synthetic record `e767aae8...` (Stage 2.10).
   - Universal pure-Python PyMySQL driver strategy implemented (Stage 3.2B, commit `279d41c`).
   - Fail-closed remote database TLS guards enforcing CA certificate existence and `VERIFY_IDENTITY` mode (Stage 3.2D).
   - Documentation reconciliation (Stage 3.3, commit `884904d`).
   - Proxy-aware rate-limiting via `CF-Connecting-IP` (Stage 3.4, commit `7b6cdd7`).
   - Integrated deployment architecture (`CloudflareOriginSecretMiddleware`, API subdomain, TiDB TLS) (Stage 3.5, commit `51ff6cc`).
   - Stage 3.6A health-check middleware direct return resolving container `DisallowedHost` rejections (commit `1aff35b`).
   - Stage 3.6C DRF JSONRenderer restriction and production console logging resolving incident D09-14 (commit `3b8e2e6`).
4. Public deployment (09.4 — completed & verified 2026-11-14): Vue 3 application deployed to Cloudflare Worker service `adnan-abdullahi` (`https://adnanabdullahi.com`); backend deployed to Render Starter `adnan-abdullahi-api` (`https://api.adnanabdullahi.com`).
5. Live-system evaluation (09.5 — completed & accepted 2026-11-15): Route loading, mobile navigation, responsive styling, accessibility, contact persistence in TiDB Cloud Serverless (`d82896fc...`), Resend email delivery to owner inbox, and edge security verified.
6. Findings, remediation, and human closure (09.6 — complete): Stage 09 formally closed under Criterion 13 by project owner on 2026-11-15.

The governing Stage 09 plan is **`docs/STAGE-09-EVALUATION.md`**. The chronological engineering record is **`journal/P1-STAGE09-EVALUATION.md`**. The deployment architecture and candidate evaluation record is **`docs/DEPLOYMENT.md`**.

**Stage 10 — Reflection and Growth: ON HOLD — TEMPORARILY PAUSED BY PROJECT OWNER (Paused 2026-11-21; Opened 2026-11-15).**

The temporary hold applies to the **entire Stage 10** and all of its internal subdivisions (Stage 10.1 and Stage 10.2). This is a temporary pause, not completion, cancellation, rejection, or permanent closure:
1. Stage 10.1 — Engineering Journey Reconstruction and Reflection: Reconstructed Stages 01–09, captured project owner's eight core reflection findings, and synthesized preliminary growth assessment. Reviewed and **ACCEPTED** by the project owner on `2026-11-21`; all historical reflection records remain preserved intact.
2. Stage 10.2 — Engineering Capability and Gap Assessment: **IN PROGRESS — PAUSED / ON HOLD (INCOMPLETE)**. Problem-investigation exercises were started and preliminary findings—including one explicitly preserved unanswered question—are recorded for future continuation.

- **Hold Reason:** "Stage 10 is temporarily placed on hold to prioritise investigation and research into two proposed portfolio enhancements: an AI Portfolio Assistant and a Downloadable CV. These enhancements will be investigated before the next portfolio evaluation and preparation of Version 1.01."
- **Resumption Condition:** "Stage 10 will remain on hold until the project owner explicitly authorises its resumption."

The governing Stage 10 plan is **`docs/STAGE-10-REFLECTION-AND-GROWTH.md`**. The chronological engineering journal is **`journal/P1-STAGE10-REFLECTION-AND-GROWTH.md`**.

**Proposed Interim Work — Portfolio Enhancement Research: PROPOSED — DISCOVERY AND RESEARCH ONLY (2026-11-21).**

While Stage 10 is on hold, two proposed portfolio enhancements are chartered for discovery and requirements definition before the next portfolio evaluation and preparation of Version 1.01 (without introducing a Stage 11 to the ten-stage development model):
1. **Research 1 — AI Portfolio Assistant:** Discovery into an AI-powered conversational assistant grounded in approved owner information (functionality, architecture, data sources, provider, security, privacy, cost, and feasibility remain undecided).
2. **Research 2 — Downloadable CV:** Discovery into providing downloadable professional CV documents in PDF and Microsoft Word (`.docx`) formats (placement, structure, format strategy, maintenance, accessibility, and privacy/disclosure remain undecided).

Both research areas are awaiting discovery and requirements definition. **Implementation is not authorized for either enhancement.** The governing research charter is **`docs/PORTFOLIO-ENHANCEMENT-RESEARCH.md`**.

**Current position:** Stage 09 complete, accepted, and closed on `2026-11-15`. Entire Stage 10 — Reflection and Growth placed **ON HOLD** on `2026-11-21` (Stage 10.1 accepted on `2026-11-21` and preserved; Stage 10.2 — Engineering Capability and Gap Assessment in progress, incomplete, and paused). Proposed next work is **Portfolio Enhancement Research** (AI Portfolio Assistant and Downloadable CV) on a discovery-only basis under `docs/PORTFOLIO-ENHANCEMENT-RESEARCH.md`.

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
**Stage 09:** Complete, Accepted and Closed (2026-11-15) — 09.1 baseline recorded; 09.2 audit completed; 09.3 deployment hardening, live TiDB migration (Stage 2.9), integration acceptance (Stage 2.10), universal PyMySQL and fail-closed TLS (Stages 3.2B/3.2D, commit `279d41c`); Stage 3.3 documentation reconciliation (commit `884904d`); Stage 3.4 proxy-aware rate-limiting identity correction (commit `7b6cdd7`); Stage 3.5 integrated deployment architecture (commit `51ff6cc`); Stage 3.6A health-check integration correction implemented, committed (commit `1aff35b`), and deployed to Render; second Render deployment verified health check HTTP 200 and origin secret protection HTTP 403; Stage 3.6B investigation identified DRF BrowsableAPIRenderer HTML template lookup and production logging gap; Stage 3.6C JSONRenderer restriction and production console logging implemented, verified locally (commit `3b8e2e6`), deployed to Render, and verified live on production; 09.4 public deployment completed on Cloudflare Worker service (`adnan-abdullahi`) and Render Starter (`adnan-abdullahi-api`); 09.5 live-system evaluation completed with Option A TiDB persistence and Resend email delivery verified; 09.6 human evaluation accepted and Stage 09 closed by project owner on 2026-11-15
**Stage 10:** ON HOLD — Temporarily Paused by Project Owner (2026-11-21) — Entire Stage 10 paused (Stage 10.1 accepted `2026-11-21` and preserved; Stage 10.2 — Engineering Capability and Gap Assessment in progress, incomplete, and paused)
**Portfolio Enhancement Research:** Proposed — Discovery and Research Only (AI Portfolio Assistant; Downloadable CV in PDF and `.docx` — awaiting discovery and requirements definition; implementation not authorized)

Stage 08 closure is documented in:

**`docs/STAGE-08-ENGINEERING-IMPLEMENTATION.md`**

Its detailed implementation history, technical decisions, verification evidence, discrepancy record, and remaining uncertainty are maintained in:

**`journal/P1-STAGE08-ENGINEERING-IMPLEMENTATION.md`**

Stage 09's governing plan, chronological journal, and deployment record are:
- `docs/STAGE-09-EVALUATION.md`
- `journal/P1-STAGE09-EVALUATION.md`
- `docs/DEPLOYMENT.md`

Stage 10's governing plan and chronological journal are:
- `docs/STAGE-10-REFLECTION-AND-GROWTH.md`
- `journal/P1-STAGE10-REFLECTION-AND-GROWTH.md`

The Portfolio Enhancement Research discovery charter is:
- `docs/PORTFOLIO-ENHANCEMENT-RESEARCH.md` (research journal intentionally deferred until research begins)

Stage 10 remains on hold until the project owner explicitly authorises its resumption. The next proposed activity is discovery and requirements definition for the AI Portfolio Assistant and Downloadable CV under `docs/PORTFOLIO-ENHANCEMENT-RESEARCH.md`. All project work remains subject to observation → investigation → proposal → human decision → authorization → execution → verification controls.

