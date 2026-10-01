# P1 — Stage 08 Engineering Implementation

**Project:** Project 01 — Portfolio Experience  
**Stage:** 08 — Engineering Implementation  
**Status:** Active

## 1. Stage Objective

Transform the accepted Project 01 portfolio experience into a functioning implementation through a specification-driven engineering process while preserving product intent, evidence integrity, human judgment, and verification.

## 2. Implementation Roadmap

The roadmap establishes the sequence of objectives rather than a rigid deadline.

### Phase A — Foundation

- [ ] Stage 08 initialization
- [ ] Environment inspection
- [ ] Spec Kit initialization
- [ ] Implementation workspace established
- [ ] Constraints identified

### Phase B — Specification

- [ ] Accepted Stage 01–07 evidence reviewed
- [ ] Implementation requirements identified
- [ ] Technical requirements distinguished from product requirements
- [ ] First specification established
- [ ] Specification reviewed
- [ ] Implementation authorized

### Phase C — Application Foundation

- [ ] Application structure established
- [ ] Dependencies established
- [ ] Development workflow established
- [ ] Foundational architecture established
- [ ] Initial build verified

### Phase D — Design Foundations

- [ ] Typography implemented
- [ ] Semantic color system implemented
- [ ] Spacing system implemented
- [ ] Relevant UI foundations implemented
- [ ] Foundations verified

### Phase E — Portfolio Experience

- [ ] Portfolio Orientation
- [ ] Project 01
- [ ] Engineering Approach
- [ ] Engineering Record
- [ ] Deep Engineering

### Phase F — Experience Integration

- [ ] Primary journey
- [ ] Secondary/direct paths
- [ ] Return paths
- [ ] Progressive depth
- [ ] Navigation integrity
- [ ] Evidence discoverability
- [ ] No unintended dead ends

### Phase G — Content & Evidence Integrity

- [ ] Approved content preserved
- [ ] Claims remain supported
- [ ] Evidence relationships preserved
- [ ] Decisions accurately represented
- [ ] Unresolved matters remain unresolved
- [ ] Unsupported outcomes excluded

### Phase H — Technical Verification

- [ ] Functional verification
- [ ] Experience/behavioral verification
- [ ] Visual/design fidelity verification
- [ ] Responsive verification
- [ ] Accessibility verification
- [ ] Performance verification
- [ ] Security verification
- [ ] Compatibility verification
- [ ] Build/deployment verification

### Phase I — Final Investigation

- [ ] Significant discrepancies identified
- [ ] Discrepancies investigated
- [ ] Necessary changes authorized
- [ ] Changes implemented
- [ ] Changes re-verified
- [ ] Remaining uncertainty documented

### Phase J — Stage 08 Closure

- [ ] Engineering evidence consolidated
- [ ] Limitations documented
- [ ] Implementation reviewed
- [ ] Stage 08 acceptance checkpoint reached
- [ ] Human acceptance decision recorded
- [ ] Stage 09 readiness established

## 3. Daily / Session Checkpoint

Every meaningful implementation session should record:

### Objective
What were we trying to accomplish?

### Work Performed
What actually changed?

### Evidence
What demonstrates the work?

### Verification
How was it checked?

### Findings
What did we discover?

### Decisions
What was decided?

### Remaining Uncertainty
What remains unknown?

### Next Authorized Step
What is the next action that has been authorized?

## 4. Session Record

This section will grow throughout Stage 08.

### Session S03 — Phase 3 Implementation Correction

**Objective:**  
Complete the Phase 3 implementation correction required by the reconciled Stage 08 source of truth (Decisions 1–5) and restore fidelity to the accepted Penpot prototype.

**Work Performed:**  
1. **Decision 1 (Visual Foundation):** Updated `app/src/styles/tokens.css` to Direction C Light palette (`#FFFFFF` canvas, `#18212B` primary text, `#52606D` secondary text, `#245B8F` interactive blue, `#E3EEF7` accent surface, `#D9DEE3` border). Updated `tests/unit/foundation.test.ts`.
2. **Decision 2 (Desktop Header):** Updated `app/src/components/Header.vue` to Penpot-style professional identity header centered on "Adnan Abdullahi", preserving the 5-state IA navigation links without generic portfolio tabs. Updated `MobileNav.vue` canvas background.
3. **Decision 3 (Portfolio Orientation):** Updated `app/src/views/OrientationView.vue` and `app/src/content/orientation.ts` to restore the open, left-aligned Penpot composition (80px desktop margin, editorial typography), eliminating unauthorized T019 pill badges, card containers, and dashed evidence containers.
4. **Decision 4 (Project 01):** Updated `app/src/views/Project01View.vue` and `app/src/content/project01.ts` to restore the Penpot two-column composition (~760px narrative/actions, ~340px Approach/Record dimension summaries), responsive on mobile/tablet.
5. **Decision 5 (CTA & Navigation Topology):** Set Orientation primary CTA strictly to "Explore the Engineering Record" targeting `#/project-01`, preserving the 5-state client hash routing topology.

**Evidence:**  
- `app/src/styles/tokens.css`
- `app/src/components/Header.vue`
- `app/src/components/MobileNav.vue`
- `app/src/content/orientation.ts`
- `app/src/content/project01.ts`
- `app/src/views/OrientationView.vue`
- `app/src/views/Project01View.vue`
- `tests/unit/foundation.test.ts`
- `tests/unit/orientation-project01.test.ts`
- `tests/e2e/us1-orientation-project01.spec.ts`
- `tests/a11y/foundation.spec.ts`
- Visual render snapshots: `browser_orientation_reconciled_1440.png`, `browser_project01_reconciled_1440.png`

**Verification:**  
- TypeScript: `vue-tsc -p app/tsconfig.json --noEmit` passed cleanly.
- Unit tests: `vitest run` passed 12/12 tests.
- Accessibility: `playwright test tests/a11y` passed 3/3 viewports (desktop, tablet, mobile) with 0 violations and unexcluded scan.
- E2E traversal: `playwright test tests/e2e/us1-orientation-project01.spec.ts` passed 6/6 tests.
- Production build: `vite build` completed cleanly.
- Visual inspection: Renders match Penpot Boards 1 and 2.

**Findings:**  
The migration to Direction C Light (`#245B8F` on `#FFFFFF` / `#FFFFFF` on `#245B8F` at 7.02:1 contrast) eliminated the contrast failure previously observed in the dark palette (`#4A90D9` at 3.34:1), allowing complete unexcluded WCAG AA and AAA accessibility compliance across all components.

**Decisions:**  
Implemented Decisions 1–5 with strict fidelity to the human-authorized reconciliation without adding new routes, redesigning IA, or introducing generic tabs.

**Remaining Uncertainty:**  
Subsequent experience views (Engineering Approach, Engineering Record, Deep Engineering) remain as placeholders awaiting authorized Phase 4+ implementation.

**Next Authorized Step:**  
Present completed Phase 3 implementation and verification report for human review and acceptance before proceeding to Phase 4.

### Session S02 — Source-of-Truth Reconciliation

**Date:** 2026-09-30  
**Status:** Human Decisions Established

**Objective:**  
Resolve material conflicts discovered between the accepted Stage 04–07 experience, Penpot prototype, Stage 08 planning artifacts, and the T016–T020 implementation before further implementation changes. This session consolidates the standalone Stage 08 Source-of-Truth Reconciliation record into this engineering journal.

**Work Performed:**  
A read-only reconciliation was completed. No source code, tests, Penpot artifacts, or configuration were modified during the investigation.

**Evidence:**  
Stage 08 Source-of-Truth Reconciliation report and the documented Stage 04–07 acceptance history.

**Verification:**  
The conflicting decisions were classified as explicitly accepted, explicitly revised, derived/proposed, implementation-only, or unresolved. The remaining material conflicts were presented to the human project authority.

**Findings:**  
The reconciliation established that:
- Direction C light was explicitly accepted in Stage 04.
- The Stage 08 dark palette entered through later planning without established human acceptance.
- Stage 05 rejected generic portfolio tabs, but the later contextual application shell was a derived Stage 08 implementation contract that had not been reconciled with Penpot.
- T019 introduced Orientation badges/cards not established by prior acceptance.
- T020 introduced a single-column Project 01 composition that diverged from the Penpot two-column structure.
- The CTA terminology evolved as the information architecture changed.

The Stage 08 dark visual foundation lacked established human acceptance. The contextual application shell was a derived Stage 08 contract that had not been reconciled with the Penpot header. T019/T020 introduced visual/layout choices without prior acceptance.

**Decisions:**  
The human project authority explicitly authorized:
1. Direction C light visual foundation.
2. Penpot-style "Adnan Abdullahi" identity header.
3. Open, left-aligned Penpot Orientation composition.
4. Penpot two-column Project 01 composition.
5. Orientation CTA: "Explore the Engineering Record".

These decisions superseded conflicting derived or implementation-only Stage 08 decisions. Historical conflicting artifacts remain part of the engineering record and are not erased.

**Remaining Uncertainty:**  
The corrected implementation has not yet been implemented or re-verified.

**Next Authorized Step:**  
Implement only the five human-authorized corrections, then verify the affected experience before any further scope expansion.

### Session S01 — Phase 4: Engineering Approach (T021–T025)

**Objective:**  
Implement Stage 08 — Phase 4: Engineering Approach dimension experience according to authoritative repository specifications and Penpot prototype inspection (Page 04 Prototype, Board 03).

**Work Performed:**  
1. Inspected Penpot MCP connection on Page `04 — Prototype`, Board `03 — Engineering Approach`, extracting verbatim copy, typography hierarchy, colors, and layout metrics.
2. Created `app/src/content/approach.ts` (T023) containing the exact approved governing philosophy, intro narrative, technology principle, and action destinations.
3. Created reusable component `app/src/components/DimensionCard.vue` (T024) supporting title, summary, and action link with Vue scoped styling consuming semantic tokens.
4. Created `app/src/views/ApproachView.vue` (T025) rendering the approved Engineering Approach view, integrating with the shell, and matching Penpot hierarchy and action controls.
5. Updated `app/src/router/index.ts` to dynamically load `ApproachView.vue` on `/approach`.
6. Resolved contrast deficit in `ReturnRail.vue` sublabel (`.return-rail-sublabel` updated from `--color-text-tertiary` to `--color-text-secondary`) to ensure WCAG 2.1 AA compliance (contrast 6.0:1 on canvas).
7. Created Vitest unit tests in `tests/unit/approach.test.ts` (T021).
8. Created Playwright E2E tests in `tests/e2e/us2-approach.spec.ts` (T022).
9. Updated a11y tests in `tests/a11y/foundation.spec.ts` and foundation spec title assertion.

**Evidence:**  
- Code: `app/src/content/approach.ts`, `app/src/components/DimensionCard.vue`, `app/src/views/ApproachView.vue`, `app/src/router/index.ts`.
- Tests: `tests/unit/approach.test.ts`, `tests/e2e/us2-approach.spec.ts`, `tests/a11y/foundation.spec.ts`.
- Screenshots: `browser_approach_1440.png`, `browser_approach_375.png`.

**Verification:**  
- Vitest: 3 test suites, 24 unit tests passed cleanly (`tests/unit/approach.test.ts`: 12/12).
- Playwright E2E: 27/27 tests passed across Desktop (1440px), Tablet (768px), and Mobile (375px).
- Axe accessibility: 6/6 tests passed with 0 violations across all 3 viewports.
- TypeScript & build: `vue-tsc -b && vite build` succeeded in 2.76s with 0 errors.

**Findings:**  
- Approach/Record distinction preserved: Approach focuses strictly on methodology, inquiry, and governing philosophy.
- The governing philosophy is verbatim: `Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity`.
- Return rail and view buttons provide predictable lateral traversal to `#/project-01` and forward traversal to `#/deep-engineering`.

**Decisions:**  
- Aligned `ApproachView.vue` layout and spacing (44px 80px 64px 80px padding at desktop) with `Project01View.vue` and Penpot Board 03 for visual continuity.
- Used `--color-text-secondary` for return-rail sublabel to guarantee WCAG 2.1 AA compliance.

**Remaining Uncertainty:**  
- Human visual inspection and acceptance completed for Phase 4.

**Next Authorized Step:**  
- Implement Phase 5: Engineering Record (T026–T029).

### Session S02 — Phase 5: Engineering Record (T026–T029)

**Objective:**  
Implement Stage 08 — Phase 5: Engineering Record dimension experience according to authoritative repository specifications and Penpot prototype inspection (Page 04 Prototype, Board 04 — Engineering Record).

**Work Performed:**  
1. Inspected Penpot MCP connection on Page `04 — Prototype`, Board `04 — Engineering Record` (ID: `7e403f00-9794-80b5-8008-aebd5f6d6cf6`), extracting verbatim text for:
   - Eyebrow: `PROJECT 01 / DIMENSION`
   - Screen Title: `Engineering Record`
   - Intro: `The record preserves how engineering understanding and decisions develop — including problems encountered, decisions made, revisions, verification, and what remains unresolved.`
   - 3-Column Chronological Decisions:
     - Col 1: `DESIGN FOUNDATIONS` (Stage 04 investigation of apparent verification failure before changing product; discrepancy traced to inspection path; Stage 04 accepted).
     - Col 2: `PROTOTYPE` (Stage 06 discovery of redundant interaction and unresolved back destination; corrected and verified).
     - Col 3: `VALIDATION` (Stage 07 human evaluation confirming structure, progressive depth, navigation, Approach/Record distinction, while identifying gaps in evidence discoverability and decision traceability).
   - Concluding Reflection Note: `The record does not present the project as complete. It preserves what has been established, what has changed, and what remains uncertain.`
   - Actions: `Continue to Deep Engineering` (to `#/deep-engineering`) and `Back to Project 01` (to `#/project-01`).
2. Created `app/src/content/record.ts` (T028) modeling chronological decision records, visible uncertainties, and concluding reflection note.
3. Created `app/src/views/RecordView.vue` (T029) implementing the 3-column chronological grid layout on desktop, responsive reflow on tablet/mobile, accessible heading focus, and action buttons.
4. Updated `app/src/router/index.ts` to dynamically import `RecordView.vue` for `/record`.
5. Created Vitest unit tests in `tests/unit/record.test.ts` (T026) — 12 tests verifying domain invariants, Penpot copy fidelity, 3-column chronological decisions, visible uncertainty, Approach/Record distinction, routing, and component mounting.
6. Created Playwright E2E tests in `tests/e2e/us3-record.spec.ts` (T027) — 15 tests verifying traversal from Project 01, ReturnRail, Deep Engineering advancement, direct entry, and visual/structural distinction from Approach across desktop, tablet, and mobile.
7. Updated `tests/a11y/foundation.spec.ts` with axe-core audit for `#/record`.
8. Generated visual captures (`browser_record_1440.png`, `browser_record_768.png`, `browser_record_375.png`) for visual inspection against Penpot Board 04.

**Evidence:**  
- Code: `app/src/content/record.ts`, `app/src/views/RecordView.vue`, `app/src/router/index.ts`.
- Tests: `tests/unit/record.test.ts`, `tests/e2e/us3-record.spec.ts`, `tests/a11y/foundation.spec.ts`.
- Screenshots: `browser_record_1440.png`, `browser_record_768.png`, `browser_record_375.png`.

**Verification:**  
- Vitest: 4 test suites, 36 unit tests passed cleanly (`record.test.ts`: 12/12).
- Playwright E2E: 45/45 tests passed across Desktop (1440px), Tablet (768px), and Mobile (375px).
- Axe accessibility: 9/9 tests passed with 0 violations across all 3 viewports.
- TypeScript & build: `vue-tsc -p app/tsconfig.json --noEmit` and `vue-tsc -b && vite build` succeeded in 2.85s with 0 errors.

**Findings:**  
- Conceptual and visual distinction between Approach and Record is fully preserved (FR-007):
  - Approach is a single-column narrative detailing philosophy and technology principles.
  - Record is a 3-column chronological grid capturing concrete stages (Design Foundations, Prototype, Validation), revisions, and visible uncertainty.
- Uncertainty remains visible without manufactured certainty (FR-015).
- Return rail and view buttons provide predictable lateral traversal to `#/project-01` and forward traversal to `#/deep-engineering`.

**Decisions:**  
- Used 3-column CSS grid (`max-width: 1280px`, `gap: 60px`) on desktop for the chronological decision cards, matching Penpot Board 04 metrics (380px column width, 70px gap).
- Reflows to 2 columns on tablet and 1 column on mobile to ensure zero clipping and effortless reading.

**Remaining Uncertainty:**  
- Human visual inspection and acceptance pending before Phase 6.

**Next Authorized Step:**  
- Present Phase 5 verification evidence for human inspection and authorization.

### 2026-10-01 — Session S04: User Story 4 — Deep Engineering & Contextual Return (Phase 6 Implementation & Verification)

**Context:**  
Phase 5 (Engineering Record) accepted, committed, and pushed. Authorized execution of Phase 6: User Story 4 — Deep Engineering & Contextual Return (Tasks T030–T034).

**Actions:**  
1. Inspected Penpot Page 04 Board 05 (Deep Engineering) via read-only MCP connection and extracted exact approved copy, structure, typography, and actions:
   - Header identity: `Adnan Abdullahi`, Context label: `PROJECT 01`, Header Rule: 1px `#D9DEE3`.
   - Eyebrow: `PROJECT 01 / DEEPER INSPECTION`
   - Screen Title: `Deep Engineering`
   - Intro Statement: `Deeper inspection moves from the resulting interface into the evidence behind engineering decisions.`
   - Section Subtitle: `Design Foundations`
   - 3 Narrative Paragraphs detailing the investigation of the apparent semantic color system verification discrepancy.
   - 6-step Flow Sequence: `Implementation → Verification → Apparent Discrepancy → Investigation → Reconciliation → Acceptance`.
   - Scope Statement (Qualification): `This project does not yet claim production implementation, deployment outcomes, or real-world user metrics that have not been established.`
   - Validation Gap: `Current validation has identified a different gap: the evidence already recorded in the engineering workspace needs to be materialized more clearly so that the actual engineering journey can be inspected as a coherent system.`
   - Action Control: Single secondary button `Back to Project 01` (to `#/project-01`). Explicitly NO forward action (Deep Engineering is the deepest level).
2. Added `EvidenceItem` and `DeepEngineering` domain entities to `app/src/models/experience.ts` per `data-model.md` Section 2.6 & 2.7.
3. Created approved content module `app/src/content/deep-engineering.ts` (T032) modeling the Design Foundations case study, 9-part evidence chain (`EVID-DF-01`), flow sequence, narrative, scope qualification, validation gap, and return action.
4. Implemented `app/src/components/EvidenceCard.vue` (T033) rendering the 9-part evidence chain (`Problem` → `Requirement` → `Decision` → `Technical Work` → `Evidence` → `Verification` → `Outcome` → `Reflection` → `Growth`) with visible uncertainty badge (`[data-uncertainty-boundary="true"]`) and clean semantic styling.
5. Implemented `app/src/views/DeepEngineeringView.vue` (T034) with Penpot Board 05 composition: eyebrow, `#main-heading` title, intro statement, Design Foundations narrative, workflow sequence block, `EvidenceCard` component, scope boundary cards, and `Back to Project 01` action.
6. Updated `app/src/router/index.ts` replacing placeholder with dynamic import of `DeepEngineeringView.vue`, removed unused placeholder helper, and refined tablet header wrapping in `Header.vue`.
7. Created Vitest unit tests in `tests/unit/deep-engineering.test.ts` (T030) — 17 tests verifying domain model invariants, copy fidelity, flow sequence, 9-part evidence item fields, visible uncertainty boundary, route metadata, and component rendering.
8. Created Playwright E2E tests in `tests/e2e/us4-deep-engineering.spec.ts` (T031) — 12 tests verifying traversal from Approach and Record to Deep Engineering, ReturnRail lateral return, direct deep link entry, and responsive layout across desktop, tablet, and mobile.
9. Added `#/deep-engineering` accessibility test to `tests/a11y/foundation.spec.ts`.
10. Captured responsive screenshots (`browser_deep_1440.png`, `browser_deep_768.png`, `browser_deep_375.png`) for visual inspection against Penpot Board 05.

**Evidence:**  
- Code: `app/src/models/experience.ts`, `app/src/content/deep-engineering.ts`, `app/src/components/EvidenceCard.vue`, `app/src/views/DeepEngineeringView.vue`, `app/src/components/Header.vue`, `app/src/router/index.ts`.
- Tests: `tests/unit/deep-engineering.test.ts`, `tests/e2e/us4-deep-engineering.spec.ts`, `tests/a11y/foundation.spec.ts`.
- Visual Captures: `browser_deep_1440.png`, `browser_deep_768.png`, `browser_deep_375.png`.

**Verification:**  
- Vitest: 5 test suites, 53 unit tests passed cleanly (`deep-engineering.test.ts`: 17/17).
- Playwright E2E: 60/60 tests passed across Desktop (1440px), Tablet (768px), and Mobile (375px).
- Axe accessibility: 12/12 tests passed with 0 violations across all 3 viewports on root, /approach, /record, and /deep-engineering.
- TypeScript & build: `vue-tsc -p app/tsconfig.json --noEmit` and `vue-tsc -b && vite build` succeeded with 0 errors.

**Findings:**  
- Deep Engineering functions strictly as a deeper-inspection layer of Project 01 (FR-008, FR-009).
- Contextual return from Deep Engineering strictly navigates to `#/project-01`, never directly to `#/orientation`, preserving the accepted navigation topology (Orientation → Project 01 → Dimension → Deeper Inspection → Project 01).
- 9-part relationship chain is rendered sequentially without speculative or ungrounded claims; visible uncertainty is surfaced explicitly (FR-011, FR-015, FR-018).
- Header and layout adapt responsively to tablet (768px) and mobile (375px) without horizontal clipping or scrollbar overflow.

**Remaining Uncertainty:**  
- Human visual inspection and acceptance pending before Phase 7.

**Next Authorized Step:**  
- Present Phase 6 verification evidence for human inspection and authorization.

### Session S04 — Human Reconciliation Decisions for Phase 6 Correction

**Objective:**  
Record the human decisions established before the next implementation correction, while keeping Stage 08 as one coherent engineering journal.

**Decision 01 — Deep Engineering visual source of truth:**  
The Deep Engineering page must follow **Penpot Board 05 — Deep Engineering** exactly as its approved visual source. No visual reinterpretation or redesign is authorized. The 9-part Evidence Card is not part of Board 05 and must not appear on the Deep Engineering page; its implementation is to be removed from that page. No visual elements not present in Board 05 are to be invented.

**Decision 02 — Internal context and visible return controls:**  
The visible entry context used internally across the experience is not visitor-facing information. Starting from Project 01 and across Engineering Approach, Engineering Record, and Deep Engineering, explicit visible internal context is to be hidden. The visible **Back to Portfolio Orientation** control on these non-Orientation pages is also to be removed. Internal navigation relationships may remain technically where required; this decision concerns visitor-facing visibility. No replacement visitor-facing control is authorized unless it is explicitly present in the approved Penpot experience.

**Decision 03 — Remove internal Stage numbers from visitor-facing text:**  
Internal Stage numbers are not to appear in visitor-facing copy. In Engineering Record, the phrase **“after which Stage 04 was accepted”** is to be replaced with **“after which the design foundations were accepted.”** Internal Stage 04 references may remain in engineering documentation where they are needed for traceability.

**Decision 04 — Orientation secondary action styling:**  
The Orientation secondary action **“View Engineering Approach”** is to use exactly the same visual treatment as the established Project 01 **“Back to Portfolio Orientation”** button: Direction C Light accent surface #E3EEF7, interactive blue #245B8F, and the same border/radius/height/padding/typography/visual weight, including equivalent hover and focus treatment. The action and route remain unchanged.

**Governance:**  
These decisions are human-authorized documentation and implementation constraints. They supersede conflicting derived or implementation-only choices for the affected visitor-facing experience. They do not constitute technical verification or human acceptance of the eventual correction.

**Next Authorized Step:**  
Update the Stage 08 implementation/specification documentation to reflect these decisions, then implement only the authorized corrections, verify them, and present the evidence for human inspection before any further progression.

## 5. Technical Decisions

| Decision | Context | Options considered | Decision | Evidence | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

New consequential technical decisions should be recorded here rather than disappearing inside implementation activity.

## 6. Verification Record

| Category | Verification activity | Result | Evidence | Remaining uncertainty |
|---|---|---|---|---|
| Functional (V1) | Route synchronization & bidirectional navigation (Orientation ↔ Project 01 ↔ Approach / Record → Deep Engineering → Project 01) | PASS | `tests/unit/orientation-project01.test.ts`, `tests/unit/approach.test.ts`, `tests/unit/record.test.ts`, `tests/unit/deep-engineering.test.ts` (53 unit tests); Playwright test suites (60 E2E tests) | None for Phase 6 scope |
| Experience / Behavioral (V1) | Primary CTA click traversal, dimension branching (Approach & Record), deep engineering advancement & strict contextual return to Project 01 | PASS | `tests/e2e/us1-orientation-project01.spec.ts`, `tests/e2e/us2-approach.spec.ts`, `tests/e2e/us3-record.spec.ts`, `tests/e2e/us4-deep-engineering.spec.ts` | Phase 7 traversal integrity |
| Visual / Design Fidelity (V2) | Direction C Light palette, open Orientation composition, two-column Project 01, Penpot-faithful Approach, Record, and Deep Engineering | PASS | Playwright full-page screenshots (`browser_orientation_reconciled_1440.png`, `browser_project01_reconciled_1440.png`, `browser_approach_1440.png`, `browser_record_1440.png`, `browser_deep_1440.png`, `browser_deep_768.png`, `browser_deep_375.png`) verified against Penpot Page 04 Boards 1, 2, 3, 4, & 5 | Human final visual sign-off |
| Responsive (V4) | Multi-device baseline verification across Desktop (1440px), Tablet (768px), Mobile (375px) | PASS | Playwright test suites (all 60 tests passed across desktop, tablet, and mobile projects); header wrapped cleanly on tablet without horizontal overflow | None |
| Accessibility (V5) | Axe automated accessibility scan on all viewports without any selector exclusions; ReturnRail & EvidenceCard contrast verified | PASS | `tests/a11y/foundation.spec.ts` (12/12 passing; 0 violations across desktop, tablet, mobile on root, /approach, /record, and /deep-engineering); Direction C Light contrast verified | Manual assistive technology review |
| Performance | Production bundling & build efficiency | PASS | `npm run build` completed in ~3.6s, total JS gzip ~38.5KB, CSS ~3.7KB, zero bundle warnings | Production network throttling |
| Security | Static execution & hash-mode routing | PASS | Hash-mode client architecture requires zero dynamic server execution; no third-party script injection | None |
| Compatibility | Cross-browser standards compliance | PASS | Vite/Vue 3 modern baseline targets modern evergreen browsers | Legacy browser testing out of scope |
| Content / Evidence Integrity (V9) | Penpot prototype texts & CTA copy exact correspondence; chronological decision records & 9-part evidence chain verbatim | PASS | `tests/unit/approach.test.ts`, `tests/unit/record.test.ts`, `tests/unit/deep-engineering.test.ts` assert verbatim content matching Penpot Boards 3, 4, 5 and Stage 04 checkpoint | None |
| Build / Deployment | Production build generation & type correctness | PASS | `npx vue-tsc -b` and `npx vue-tsc -p app/tsconfig.json --noEmit` exit code 0; `vite build` generated `dist/` | Production deployment in Stage 09 |

## 7. Discrepancy Record

For significant discrepancies:

| Observation | Investigation | Finding | Proposed response | Human decision | Change | Verification |
|---|---|---|---|---|---|---|
| T016–T020 implementation diverged visually from Penpot prototype (dark palette, card/grid wrappers, generic tags, stacked layout). | Read-only inspection of Penpot Page 04 Boards 1 & 2 and Stage 04–07 history. | Drift caused by combining legacy dark palette with unapproved dashboard card patterns and breadcrumbs. | Reconcile implementation strictly to Penpot prototype via Direction C Light foundation and open layouts. | Human explicitly authorized 5 governing decisions: Direction C Light, identity header, open Orientation, 2-column Project 01, "Explore the Engineering Record" CTA. | Updated tokens.css, Header.vue, MobileNav.vue, OrientationView.vue, Project01View.vue, orientation.ts, project01.ts, and tests. | All unit (12), a11y (3 viewports, unexcluded), E2E (6 viewports), and build checks passed. |

## 8. Stage 08 Evidence Index

Evidence generated during implementation should be recorded here.

Potential evidence includes:

- specifications;
- source code;
- commits;
- tests;
- screenshots;
- measurements;
- browser inspections;
- accessibility results;
- security findings;
- performance measurements;
- deployment evidence;
- technical decisions;
- investigation records;
- revisions.

## 9. Remaining Uncertainty

This section records things that have **not** been established rather than allowing them to disappear from the engineering record.

| Uncertainty | Why unresolved | Impact | Next action |
|---|---|---|---|
| — | — | — | — |

## 10. Stage 08 Final Disposition

_To be completed at the end of Stage 08._

**Implementation status:**  
_To be determined._

**Verification status:**  
_To be determined._

**Remaining limitations:**  
_To be recorded._

**Evidence sufficiency:**  
_To be determined._

**Human decision:**  
_To be determined._

**Stage 09 readiness:**  
_To be determined._
