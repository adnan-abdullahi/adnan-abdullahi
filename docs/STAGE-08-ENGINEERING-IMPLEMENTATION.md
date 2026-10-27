# Stage 08 — Engineering Implementation

**Status:** Closed (Authorized 2026-10-27)  
**Project:** Project 01 — Portfolio Experience  
**Stage:** 08 of 10

## 1. Purpose

Stage 08 transforms the accepted Project 01 portfolio experience established through Stages 01–07 into a functioning software implementation.

The implementation is carried out through a specification-driven engineering process using Spec Kit and appropriate engineering tools.

The purpose is not merely to produce working code, but to establish an implementation that remains traceable to the accepted product decisions, experience, design foundations, and evidence established in the preceding stages.

## 2. Starting Point

Stage 08 begins from the accepted state established through:

- Stage 01 — Product Constitution
- Stage 02 — Product Experience & Structure Discovery
- Stage 03 — UX/UI Materialization and Prototype Validation
- Stage 04 — Design Foundations
- Stage 05 — Portfolio Orientation
- Stage 06 — Prototype
- Stage 07 — Validation

The accepted prototype, approved content, Experience Map, engineering records, decisions, and validation findings form the principal product evidence entering implementation.

## 3. Stage 08 Boundary

Stage 08 covers the transformation of the accepted product experience into a functioning implementation.

This includes:

- establishing the implementation environment;
- initializing Spec Kit and the specification-driven workflow;
- translating accepted product requirements into implementation specifications;
- establishing the necessary application structure;
- implementing the accepted portfolio experience;
- implementing relevant design foundations;
- implementing approved content and evidence structures;
- implementing accepted navigation and interaction behavior;
- making and recording necessary technical decisions;
- incrementally verifying the implementation;
- investigating significant discrepancies;
- preserving engineering evidence;
- establishing sufficient technical evidence for Stage 09 Evaluation.

The implementation must remain within the accepted product boundary unless a material conflict or newly discovered requirement requires investigation and human decision.

## 4. Engineering Principle

Stage 08 follows:

> **Understand → Specify → Implement → Verify → Investigate → Revise → Re-verify → Record**

Implementation is not itself verification.

A working implementation does not automatically establish that the implementation satisfies the intended requirement.

Human judgment remains central throughout the process.

Spec Kit, AI agents, automated tests, development tools, and other technologies are instruments that assist engineering work; they do not replace human responsibility for decisions or acceptance.

## 5. Implementation Traceability

Where applicable, implementation should preserve the relationship:

> **Product Requirement → Specification → Implementation → Verification → Evidence**

Existing product decisions should not be silently changed during implementation.

Where implementation requires a new consequential technical decision, the decision should be:

> **Identified → Investigated → Proposed → Decided → Recorded → Implemented → Verified**

## 6. Verification Framework

Stage 08 verifies the implementation across the following relevant categories.

### V1 — Functional Verification

Whether implemented functions operate as intended, including relevant:

- navigation;
- interactions;
- links;
- routes;
- states;
- rendering;
- error behavior.

### V2 — Experience & Behavioral Verification

Whether the implementation preserves the accepted experience, including:

- primary journey;
- progressive depth;
- branching;
- return paths;
- evidence discoverability;
- Approach/Record distinction;
- Deep Engineering path.

### V3 — Visual & Design Fidelity Verification

Whether the implementation faithfully materializes the accepted design foundations, including relevant:

- typography;
- semantic colors;
- spacing;
- hierarchy;
- layout;
- components;
- interaction presentation.

### V4 — Responsive Verification

Whether the experience remains usable across the relevant viewport classes and environments established for implementation.

### V5 — Accessibility Verification

Whether relevant accessibility requirements have been implemented and tested through appropriate automated and human methods.

Testing results must distinguish between what was:

- verified;
- partially verified;
- not verified;
- not applicable.

No unsupported accessibility-conformance claim should be made.

### V6 — Performance Verification

Whether relevant performance characteristics have been examined, including appropriate:

- loading behavior;
- asset behavior;
- runtime behavior;
- performance measurements;
- identified bottlenecks.

### V7 — Security Verification

Whether security risks relevant to the actual implementation have been identified and appropriately tested.

This may include, where applicable:

- exposed secrets;
- dependencies;
- input handling;
- client-side behavior;
- configuration;
- authentication/authorization;
- relevant web security controls;
- software supply-chain concerns.

Security verification must remain proportional to the actual implementation.

### V8 — Compatibility Verification

Whether the implementation behaves correctly in the relevant target environments, including appropriate browser and viewport testing.

No universal compatibility claim should be made without corresponding evidence.

### V9 — Content & Evidence Integrity Verification

Whether the implementation faithfully represents the engineering evidence.

This includes checking that:

- claims remain supported;
- evidence remains traceable;
- decisions remain accurately represented;
- unresolved matters remain unresolved;
- implementation is not presented as verification;
- unsupported outcomes are not introduced;
- engineering history is not manufactured.

### V10 — Build & Deployment Verification

Whether the implementation can be built and delivered correctly, including relevant:

- development builds;
- production builds;
- configuration;
- deployment process;
- deployed artifact;
- production smoke testing;
- correspondence between verified source and deployed result.

## 7. Verification Methods

The verification categories above describe **what is being verified**.

Appropriate methods may include:

- human inspection;
- automated testing;
- unit testing;
- integration testing;
- end-to-end testing;
- browser testing;
- accessibility tooling;
- security tooling;
- dependency analysis;
- performance tooling;
- source inspection;
- build verification;
- deployed-environment inspection.

Methods should be selected according to the claim being verified rather than applied mechanically.

## 8. Discrepancy Handling

When implementation produces a significant discrepancy, the default response is not immediate modification.

The engineering process is:

> **Observation → Interpretation → Investigation → Finding → Proposed Response → Human Decision → Authorization → Change → Verification**

An implementation agent must not silently resolve a material conflict with an accepted product decision.

## 9. Stage 08 Non-Scope

Stage 08 does not authorize:

- redesigning the accepted product merely because implementation is inconvenient;
- reopening completed stages without evidence requiring reconsideration;
- inventing product requirements;
- speculative features;
- unnecessary technologies;
- premature backend systems;
- unsupported production claims;
- fabricated outcomes or metrics;
- fabricated user research;
- treating AI or Spec Kit output as authoritative;
- replacing human decisions with automated decisions;
- changing accepted foundations without authorization;
- unrestricted product expansion.

## 10. Relationship to Stage 09

Stage 08 establishes:

> **What was built and what can be verified about it.**

Stage 09 evaluates:

> **What the resulting evidence means.**

Stage 09 may therefore examine broader questions such as overall portfolio effectiveness, professional communication, external/user evaluation, broader usability, observed outcomes, strengths, weaknesses, and implications of the resulting engineering evidence.

These concerns should not unnecessarily expand Stage 08.

## 11. Stage 08 Acceptance Criteria

Stage 08 may be considered for closure when sufficient evidence establishes that:

1. The accepted Project 01 experience has been implemented within scope. [SATISFIED — All 7 views and Django contact backend implemented]
2. Relevant implementation requirements are traceable to specifications. [SATISFIED — Full bidirectional traceability across spec.md, data-model.md, and ui-contracts.md]
3. Core functionality has been verified. [SATISFIED — 119 unit tests passing across 9 test suites; 188 E2E tests passing]
4. The accepted experience and navigation have been verified. [SATISFIED — Full 7-route navigation topology and return paths verified]
5. Relevant design foundations have been implemented and verified. [SATISFIED — Direction C Light design tokens and self-hosted IBM Plex Sans fonts verified]
6. Relevant responsive behavior has been tested. [SATISFIED — Multi-device verification across Desktop 1440px, Tablet 768px, and Mobile 375px; 1 intentional mobile header test skip preserved]
7. Relevant accessibility behavior has been tested. [SATISFIED — 15 of 15 axe-core accessibility tests passing across desktop, tablet, and mobile with zero violations]
8. Relevant performance behavior has been examined. [SATISFIED — Production bundle ~42.6KB gzip, builds in ~5.9s, zero warnings]
9. Relevant security risks have been examined. [SATISFIED — Static client-side hash routing; Django backend rate-limiting with encrypted credential vault]
10. Relevant compatibility has been examined. [SATISFIED — Cross-browser modern baseline supported via Vite/Vue 3]
11. Content and evidence integrity have been verified. [SATISFIED — Verbatim text asserted against Penpot active boards and Stage 04 checkpoint]
12. The implementation can be built and delivered. [SATISFIED — Production build generated in app/dist/ without warnings]
13. Significant discrepancies have been investigated. [SATISFIED — Documented in Section 13 and journal Discrepancy Record]
14. Remaining limitations and uncertainties have been documented. [SATISFIED — Mobile test skip condition and Stage 09 manual AT audit documented]
15. Sufficient engineering evidence exists for Stage 09 Evaluation. [SATISFIED — Complete evidence index and verification records established]
16. Human acceptance of Stage 08 has been explicitly established. [SATISFIED — Stage 08 formally accepted and authorized for closure and local commit by the owner on 2026-10-27]

## 12. Human Source-of-Truth Reconciliation — 2026-09-30

A read-only reconciliation established the governing decisions for the current implementation correction.

**Human-authorized decisions:**

1. Direction C light remains the accepted visual foundation.
2. The desktop header adopts the Penpot-style professional identity header centered on **Adnan Abdullahi**, while retaining the accepted information architecture and the Stage 05 rejection of generic portfolio tabs.
3. Portfolio Orientation returns to the open, left-aligned Penpot composition without the unauthorized T019 pill badges, CTA card, or dashed evidence container.
4. Project 01 returns to the Penpot two-column composition.
5. The Orientation primary CTA is **Explore the Portfolio Project**, navigating to `/project-01` (reconciling with the authoritative application implementation; superseding the preliminary draft text "Explore the Engineering Record").

The reconciliation also established that the Stage 08 dark palette was introduced without established human acceptance and that the T019/T020 visual treatments were implementation choices. These historical findings remain part of the engineering record.

Implementation correction is authorized only against the five decisions above. After correction, the affected experience must undergo V1–V5 and V9 verification as applicable. No claim of verification is made by this documentation update.

## 13. Application & Specification Reconciliation Records (2026-10-26)

### 13.1 Contact Success Heading Reconciliation
* **Authoritative Application Implementation:** In `app/src/views/ContactView.vue` and `app/src/content/contact.ts`, the heading displayed upon successful contact form submission is **"Message Sent"**.
* **Observed Design Discrepancy:** In Penpot file `Project 01 — Portfolio Experience` (`c828d3cf-7d4e-8145-8008-977e84b5cadf`), Page `03 — Portfolio Screens`, Board 04 (Contact — Desktop), the corresponding text layer displays `"State Preview: Message Received (HTTP 201)"`.
* **Settlement Record:** The application wording ("Message Sent") is confirmed as authoritative for the implemented product. The Penpot text is recorded factually as an observed discrepancy without assigning unsupported historical design intent. Neither code nor Penpot is modified.

### 13.2 Secondary Action Omission on Approach and Record Views
* **Observation:** In `app/src/content/approach.ts` and `app/src/content/record.ts`, `actions.secondary` defines `{ label: "Back to Project 01", to: "/project-01" }`. However, in `ApproachView.vue` and `RecordView.vue`, only the primary forward action (`"Continue to Deep Engineering"`) is rendered.
* **Governing Decision & Evidence:** This omission is governed by documented **Decision 02** in `journal/P1-STAGE08-ENGINEERING-IMPLEMENTATION.md` ("Internal context and visible return controls"), which explicitly removed visible in-canvas return buttons ("Back to Project 01" / "Back to Portfolio Orientation") from non-Orientation views.
* **Automated Test Enforcement:** The non-rendering of the in-canvas secondary return action is explicitly asserted by automated Playwright E2E tests:
  - `tests/e2e/us2-approach.spec.ts` (`test('verifies ReturnRail and in-canvas "Back to Project 01" do not appear on Approach')`)
  - `tests/e2e/us3-record.spec.ts` (`test('verifies ReturnRail and in-canvas "Back to Project 01" do not appear on Record')`)
  Both test suites assert `expect(page.getByRole("link", { name: "Back to Project 01" })).toHaveCount(0)`.

### 13.3 Systematic Component Retirement (2026-10-27)
* **Retired Components:** `app/src/components/ReturnRail.vue`, `app/src/components/DepthIndicator.vue`, and `app/src/components/EvidenceCard.vue`.
* **Rationale:** As established in Penpot reconciliation audits and Human Decision 02, in-canvas return rails, depth pill badges, and isolated card wrappers were superseded by open viewport layouts and inline evidence presentation.
* **Verification:** Zero imports remain across `app/src/`. All 119 unit tests pass, and production build succeeds cleanly.

### 13.4 Final Verification Summary & Intentional Test Boundaries (2026-10-27)
* **Vitest Unit Tests:** 119 passed across 9 suites (0 failed).
* **Playwright Accessibility Tests (`tests/a11y/foundation.spec.ts`):** 15 passed across Desktop, Tablet, and Mobile (0 failed). Test 1 synchronized with `await expect(page.locator("#main-heading")).toBeVisible()`.
* **Playwright End-to-End Tests:** 188 passed, 1 intentionally skipped, 0 failed.
  - **Intentional Skip:** In `tests/e2e/about.spec.ts`, the desktop header traversal test is skipped on the mobile project (`test.skip(isMobile)`), because `.desktop-header-container` is hidden on viewports `< 768px` in favor of `MobileNav.vue`. Mobile navigation is verified by dedicated tests.
* **Production Build:** `vue-tsc` typecheck reports 0 errors; Vite production bundle built in ~5.9s.
