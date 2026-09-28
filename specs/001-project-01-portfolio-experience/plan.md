# Implementation Plan: Project 01 — Portfolio Experience

**Branch**: `001-project-01-portfolio-experience` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-project-01-portfolio-experience/spec.md`

---

## Summary

Build a functioning, client-side static software implementation of the accepted Project 01 portfolio experience, faithfully materializing its five core experience states (Portfolio Orientation, Project 01, Engineering Approach, Engineering Record, Deep Engineering), the progressive inspection model, the established return paths, the Stage 04 design foundations (IBM Plex Sans, semantic colors, spacing), and the Evidence & Evaluation System.

The application is structured as a **Vue + TypeScript + Vite** static client application with zero backend/database dependencies, utilizing self-hosted fonts and assets, CSS Custom Properties for design tokens, semantic HTML5 for accessibility, hash-based client routing for universal static host compatibility, **sticky top contextual mobile navigation** preserving the return-path model, and a dedicated verification suite covering the ten Stage 08 verification categories (V1–V10). Deployment is strictly governed by **tagged releases**, triggered by an explicitly created release tag rather than on every push to main.

---

## Approved Technical Decisions (Resolved)

The following three implementation decisions have been explicitly reviewed and approved:

1. **Implementation Stack**: **Vue + TypeScript + Vite**
   - **Resolution**: Vue 3 (Composition API with Single-File Components) + TypeScript 5.x + Vite.
   - **Requirements Satisfied**: FR-001 (functioning software implementation), FR-018 (visual foundations fidelity), FR-020 (systematic verification framework), SC-001 (100% of core experience states rendered and interactive).
   - **Rationale**: Vue 3 provides lightweight, declarative component rendering and clean separation of concerns with minimal runtime overhead (~33KB gzipped). TypeScript provides compile-time type safety for the 9-part evidence relationship chain (`Problem → Requirement → Decision → Technical Work → Evidence → Verification → Outcome → Reflection → Growth`). Vite provides lightning-fast local development and produces pure static assets (`dist/`) with zero server runtime requirements.

2. **Mobile Navigation**: **Sticky Top Contextual Navigation**
   - **Resolution**: Sticky top contextual navigation bar on mobile viewports (<768px).
   - **Requirements Satisfied**: FR-004, FR-010 (established return paths), FR-020 (V4 Responsive, V5 Accessibility), User Story 5 (orientation clarity: "Where am I?", "How do I return?").
   - **Rationale**: Keeps current inspection depth, location breadcrumbs, and explicit return actions ("Return to Project 01" / "Return to Portfolio Orientation") visible and immediately accessible at all times on small screens without obscuring content or creating dead ends.

3. **Deployment Strategy**: **Tagged Releases**
   - **Resolution**: Static web deployment (e.g. GitHub Pages via GitHub Actions) is triggered exclusively by explicitly created release tags (e.g., `v1.0.0`) rather than every push to `main`.
   - **Requirements Satisfied**: FR-001, FR-020 (V10 Build & Deployment Verification), Constitution Principle 1 (Human Judgment and Responsibility).
   - **Rationale**: Ensures human authorization serves as the explicit deployment gate. Intermediate commits on `main` undergo automated testing and build verification without altering the live production environment until a human deliberately creates a release tag.

---

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (Node.js runtime v24.21.0 on host environment)

**Primary Dependencies**: Vue 3 (Composition API / Single-File Components), Vite 5.x / 6.x (development server and static bundler), hash-based client router

**Storage**: N/A (Pure static client application; URL hash state and in-memory view state only; zero external database or persistent storage required)

**Testing**: Vitest (unit/component testing), Playwright (E2E navigation & visual regression), axe-core (automated accessibility auditing)

**Target Platform**: Modern Desktop and Mobile Web Browsers (Chrome, Edge, Firefox, Safari)

**Project Type**: Client-Side Static Web Application (Single-Page Application)

**Performance Goals**: Initial load < 1s on standard broadband; total production bundle < 150KB gzip; 60fps transitions; 0 external runtime network calls

**Constraints**: Completely offline-capable; pure static output (`dist/`); zero backend, database, authentication, CMS, analytics, or AI runtime services; strict fidelity to Stage 04 design tokens and approved Stage 06/07 content

**Scale/Scope**: 5 primary experience views, 1 deeper inspection case study (Design Foundations), 1 verification matrix view, ~15 modular Vue components

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                        | Gate Requirement                                                                                         | Status   | Evidence / Implementation in Plan                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Human Judgment & Responsibility**           | AI tools assist; decisions require human authorization; no consequential change by automated tool alone. | **PASS** | Plan incorporates approved human decisions; deployment strictly gated by human-created release tags.                                    |
| **2. Evidence Before Assertion**                 | Claims grounded in empirical facts; no unsupported outcomes.                                             | **PASS** | `EvidenceItem` and data models strictly distinguish established facts from assumptions; outcomes reflect verified Stage 06/07 evidence. |
| **3. Understand Before Implement**               | Spec precedes plan; plan precedes tasks; tasks precede code.                                             | **PASS** | Strictly honors the progression: Spec approved → Plan created & updated → Tasks deferred until plan authorized.                         |
| **4. Traceability**                              | Preserves chain: Requirement → Spec → Plan → Task → Implementation → Verification → Evidence.            | **PASS** | Every technical choice directly maps to spec requirements (FR-001–FR-020) and V1–V10 categories.                                        |
| **5. Verification Distinct from Implementation** | Working code is not verification; systematically covers V1–V10.                                          | **PASS** | Quickstart and plan specify concrete verification test runners for all ten categories (V1–V10).                                         |
| **6. Investigate Discrepancies**                 | Observation → Investigation → Human Decision before changing product.                                    | **PASS** | Discrepancy handling protocol integrated into verification workflow; no silent fixes allowed.                                           |
| **7. Controlled Scope**                          | Zero backend, database, auth, CMS, analytics, AI features, or speculative scope.                         | **PASS** | Explicit Non-Requirements strictly preserved; pure client-side static scope enforced.                                                   |
| **8. Preserve Established Decisions**            | Stages 01–07 decisions and Stage 04 design foundations remain closed constraints.                        | **PASS** | Uses IBM Plex Sans, semantic color tokens, and approved content verbatim; no redesign authorized.                                       |
| **9. Responsible & Human-Centered**              | Accessible, understandable, visitor empowerment to inspect evidence.                                     | **PASS** | Semantic HTML5, sticky top mobile return navigation, focus management, WCAG AA contrast, and transparent evidence inspection.           |
| **10. Uncertainty Must Remain Visible**          | Open questions preserved; no manufactured certainty.                                                     | **PASS** | `EvidenceItem` and `EngineeringRecord` explicitly preserve visible uncertainty models.                                                  |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-project-01-portfolio-experience/
├── spec.md              # Approved Feature Specification
├── checklists/
│   └── requirements.md  # Specification Quality Checklist
├── plan.md              # Implementation Plan (This file)
├── research.md          # Technical Research resolving implementation unknowns
├── data-model.md        # Domain Entities & Navigation State Model
├── quickstart.md        # Setup & Systematic Verification Guide
├── contracts/
│   └── ui-contracts.md  # UI View, Routing, & State Interface Contracts
└── tasks.md             # Implementation Tasks (Phase 2 - DEFERRED until plan authorization)
```

### Source Code (repository root layout for implementation)

```text
app/
├── index.html                  # HTML entry point with semantic shell
├── package.json                # Project dependencies (vue, vite, typescript, etc.) and scripts
├── tsconfig.json               # TypeScript configuration (strict mode)
├── vite.config.ts              # Vite static build configuration with @vitejs/plugin-vue
├── public/
│   └── assets/
│       ├── fonts/              # Self-hosted IBM Plex Sans WOFF2 files
│       │   ├── ibm-plex-sans-light.woff2
│       │   ├── ibm-plex-sans-regular.woff2
│       │   ├── ibm-plex-sans-medium.woff2
│       │   └── ibm-plex-sans-semibold.woff2
│       └── icons/              # Modular SVG assets (connectors, badges)
└── src/
    ├── main.ts                 # Application bootstrapping (Vue 3 instance)
    ├── App.vue                 # Root application component with ExperienceShell
    ├── router/
    │   └── index.ts            # Hash-based client router and history stack
    ├── styles/
    │   ├── tokens.css          # Stage 04 semantic color and spacing tokens
    │   ├── typography.css      # IBM Plex Sans @font-face and typographic scale
    │   ├── layout.css          # CSS Grid and Flexbox responsive layouts
    │   └── components.css      # Component-specific styles
    ├── models/
    │   ├── experience.ts       # Navigation state, depth, and view types
    │   ├── evidence.ts         # EvidenceItem and 9-part relationship chain
    │   └── verification.ts     # VerificationRecord and V1–V10 categories
    ├── content/
    │   ├── orientation.ts      # Approved Stage 05/06 orientation copy
    │   ├── project01.ts        # Approved Stage 06/07 Project 01 overview
    │   ├── approach.ts         # Approved Stage 06/07 Engineering Approach copy
    │   ├── record.ts           # Approved Stage 06/07 Engineering Record & decisions
    │   └── deep-engineering.ts # Approved Design Foundations evidence case study
    ├── components/
    │   ├── Header.vue          # Contextual desktop header with route breadcrumbs
    │   ├── MobileNav.vue       # Sticky top contextual navigation for mobile viewports
    │   ├── DepthIndicator.vue  # Visual depth level badge (Entry, Context, Dimension, Deep)
    │   ├── ReturnRail.vue      # Deterministic lateral return navigation controls
    │   ├── DimensionCard.vue   # Reusable card for Approach and Record links
    │   ├── EvidenceCard.vue    # Traceable 9-part evidence node component
    │   └── VerificationMatrix.vue # UI component rendering V1–V10 status
    └── views/
        ├── OrientationView.vue # Portfolio Orientation entry view
        ├── Project01View.vue   # Project 01 central hub view
        ├── ApproachView.vue    # Engineering Approach dimension view
        ├── RecordView.vue      # Engineering Record dimension view
        └── DeepEngineeringView.vue # Deep Engineering inspection view

tests/
├── unit/
│   ├── router.test.ts          # Unit tests for hash routing and return paths
│   └── models.test.ts          # Unit tests for evidence data models
├── e2e/
│   └── navigation.spec.ts      # Playwright E2E test for full Experience Map traversal
└── a11y/
    └── accessibility.spec.ts   # Automated axe-core accessibility audit across all 5 views
```

**Structure Decision**: A clean single-project Vue 3 + TypeScript architecture (`app/` and `tests/`) separating data models, approved content, visual tokens, reusable Vue components, and views. This provides maximum testability, zero runtime overhead, and direct 1-to-1 mapping with the approved information architecture.

---

## Complexity Tracking

> **Violations**: None. The plan strictly avoids all speculative architecture, full-stack frameworks, databases, authentication, server runtimes, or external CDNs.

| Proposed Pattern                 | Why Needed                                                                                                                                                            | Simpler Alternative Rejected Because                                                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vue 3 + TypeScript + Vite**    | Provides reactive component rendering and clean SFC templating with minimal runtime (~33KB gzipped); TypeScript enforces compile-time type safety on evidence chains. | Plain vanilla JS rejected because it lacks type validation for complex evidence models and component lifecycle structure; full-stack SSR frameworks (Nuxt/Next) rejected because they violate controlled scope. |
| **Hash-Based Client Router**     | Supports instant state transitions, back/forward history, and deep linking across static file hosting without server URL rewrite rules.                               | Multi-page HTML files rejected because they destroy transient navigation state and create choppy transitions between progressive depth levels.                                                                  |
| **Sticky Top Mobile Navigation** | Preserves orientation ("Where am I?", "How do I return?") and guarantees access to established return paths on mobile screens without obscuring content.              | Floating bottom bar rejected because it can obscure lower evidence content; non-sticky navigation rejected because visitors lose immediate return access on long pages.                                         |
| **Self-Hosted WOFF2 Fonts**      | Guarantees complete offline execution, zero external network requests, zero third-party tracking, and reproducible visual rendering.                                  | Google Fonts CDN rejected because it introduces an external network failure point, privacy tracking, and violates security/offline principles.                                                                  |
| **CSS Custom Properties**        | Direct 1-to-1 representation of Stage 04 design tokens without extra runtime overhead.                                                                                | Tailwind/CSS-in-JS rejected because they add compilation layers and override the established semantic token system.                                                                                             |
| **Tagged Releases Deployment**   | Guarantees that public deployment occurs only upon explicit human release tagging, preserving human authority as the deployment gate.                                 | Deploying on every push to `main` rejected because it risks publishing unverified intermediate states to production without deliberate human authorization.                                                     |

---

## Remaining Implementation Details (To be operationalized in Tasks)

The primary architectural and technical decisions are now resolved. The remaining minor implementation-level details to be structured during task generation (`tasks.md`) are:

1. **Router package choice**: Lightweight custom hash listener vs. `vue-router` in hash mode (`createWebHashHistory`).
2. **Component style scoping**: Scoped `<style scoped>` within Vue Single-File Components vs. modular CSS files.
3. **CI workflow definition**: Concrete GitHub Actions YAML configuration specifying Node version, test execution, static build step, and release-tag trigger condition.
