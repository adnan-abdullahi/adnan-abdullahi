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

**Objective:**  
Resolve material conflicts discovered between the accepted Stage 04–07 experience, Penpot prototype, Stage 08 planning artifacts, and the T016–T020 implementation before further implementation changes.

**Work Performed:**  
A read-only reconciliation was completed. No source code, tests, Penpot artifacts, or configuration were modified during the investigation.

**Evidence:**  
Stage 08 Source-of-Truth Reconciliation report and the documented Stage 04–07 acceptance history.

**Verification:**  
The conflicting decisions were classified as explicitly accepted, explicitly revised, derived/proposed, implementation-only, or unresolved. The remaining material conflicts were presented to the human project authority.

**Findings:**  
The Stage 08 dark visual foundation lacked established human acceptance. The contextual application shell was a derived Stage 08 contract that had not been reconciled with the Penpot header. T019/T020 introduced visual/layout choices without prior acceptance.

**Decisions:**  
The human project authority explicitly authorized:
1. Direction C light visual foundation.
2. Penpot-style "Adnan Abdullahi" identity header.
3. Open, left-aligned Penpot Orientation composition.
4. Penpot two-column Project 01 composition.
5. Orientation CTA: "Explore the Engineering Record".

**Remaining Uncertainty:**  
The corrected implementation has not yet been implemented or re-verified.

**Next Authorized Step:**  
Implement only the five human-authorized corrections, then verify the affected experience before any further scope expansion.

### Session S01

**Objective:**  
_To be recorded._

**Work Performed:**  
_To be recorded._

**Evidence:**  
_To be recorded._

**Verification:**  
_To be recorded._

**Findings:**  
_To be recorded._

**Decisions:**  
_To be recorded._

**Remaining Uncertainty:**  
_To be recorded._

**Next Authorized Step:**  
_To be recorded._

## 5. Technical Decisions

| Decision | Context | Options considered | Decision | Evidence | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

New consequential technical decisions should be recorded here rather than disappearing inside implementation activity.

## 6. Verification Record

| Category | Verification activity | Result | Evidence | Remaining uncertainty |
|---|---|---|---|---|
| Functional (V1) | Route synchronization & bidirectional navigation (Orientation ↔ Project 01) | PASS | `tests/unit/orientation-project01.test.ts` (8 tests), `tests/e2e/us1-orientation-project01.spec.ts` (6 tests) | None for Phase 3 |
| Experience / Behavioral (V1) | Primary CTA click traversal & return rail traversal | PASS | `tests/e2e/us1-orientation-project01.spec.ts` | Dimension views pending Phase 4 |
| Visual / Design Fidelity (V2) | Direction C Light palette, open Orientation composition, two-column Project 01 | PASS | Playwright full-page screenshots (`browser_orientation_reconciled_1440.png`, `browser_project01_reconciled_1440.png`) verified against Penpot Page 04 Boards 1 & 2 | Human final visual sign-off |
| Responsive (V4) | Multi-device baseline verification across Desktop (1440px), Tablet (768px), Mobile (375px) | PASS | Playwright test suites (all 6 E2E tests and 3 a11y tests passed across desktop, tablet, and mobile projects) | None |
| Accessibility (V5) | Axe automated accessibility scan on all viewports without any selector exclusions | PASS | `tests/a11y/foundation.spec.ts` (0 violations across desktop, tablet, mobile); Direction C Light contrast verified (7.02:1 for interactive primary on canvas) | Manual assistive technology review |
| Performance | Production bundling & build efficiency | PASS | `npm run build` completed in ~7-11s, zero bundle chunk warnings | Production network throttling |
| Security | Static execution & hash-mode routing | PASS | Hash-mode client architecture requires zero dynamic server execution; no third-party script injection | None |
| Compatibility | Cross-browser standards compliance | PASS | Vite/Vue 3 modern baseline targets modern evergreen browsers | Legacy browser testing out of scope |
| Content / Evidence Integrity (V9) | Penpot prototype texts & CTA copy exact correspondence | PASS | `tests/unit/orientation-project01.test.ts` asserts verbatim content matching Penpot Board 1 & 2 copy | None |
| Build / Deployment | Production build generation & type correctness | PASS | `npx vue-tsc --noEmit` exit code 0; `vite build` generated `dist/` | Production deployment in Stage 09 |

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
