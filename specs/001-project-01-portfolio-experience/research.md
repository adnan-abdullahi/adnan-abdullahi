# Technical Research: Project 01 — Portfolio Experience

**Feature Branch**: `001-project-01-portfolio-experience`  
**Date**: 2026-09-28  
**Spec**: [spec.md](./spec.md)  
**Status**: Complete (Proposed for Human Review)

---

## Overview

This research document resolves the six known implementation unknowns that were deliberately deferred during specification:

1. Implementation Technology
2. Application Architecture
3. Asset Strategy
4. Responsive Implementation Approach
5. Accessibility Implementation Approach
6. Deployment Mechanism

Each evaluation identifies the requirements satisfied, governing constraints, facts vs. assumptions, alternatives considered, rationale, remaining uncertainties, and human decision points.

---

## 1. Implementation Technology

### Requirement(s) Satisfied

- **FR-001**: Functioning software implementation representing the accepted Project 01 portfolio experience.
- **FR-018**: Faithful materialization of Stage 04 visual foundations (IBM Plex Sans, semantic colors, spacing, layout).
- **FR-020**: Structure enabling systematic verification across V1–V10.
- **SC-001**: 100% of the five core experience states rendered and interactive.
- **SC-006**: Implementation technology resolved systematically through planning.

### Relevant Constraints

- Software runs purely client-side in standard modern web browsers.
- Host engineering environment: Windows with Node.js v24.21.0 and npm 11.19.0 installed.
- No backend, database, CMS, or server-side runtime authorized.
- Must support fast, reproducible local builds and straightforward automated testing.

### Facts vs. Assumptions

- **Established Facts**:
  - Node.js v24.21.0 and npm 11.19.0 are present and operational on the host system.
  - The portfolio experience is composed of five discrete experience views and structured evidence items.
  - All content is static, verified engineering evidence from Stages 01–07.
- **Assumptions**:
  - Standard ES modules and modern browser web standards (HTML5/CSS3/ES2022+) are available across all target desktop and mobile browsers.

### Alternatives Considered

1. **Vanilla HTML/CSS/JavaScript (Zero Build Tooling)**:
   - _Pros_: Zero build dependencies, zero compile steps.
   - _Cons_: No compile-time type checking for complex evidence models (`Problem → Requirement → Decision...`), manual script concatenation, and poorer developer ergonomics for automated verification suites (unit/component testing).
2. **Full-Stack / SSR Framework (e.g., Next.js, Nuxt, Remix)**:
   - _Pros_: Built-in routing and large ecosystems.
   - _Cons_: _Violates Controlled Scope._ Introduces unnecessary Node runtime dependencies, server abstractions, and deployment complexity for a purely static, client-side experience.
3. **Static Client Application with TypeScript + Vite**:
   - _Pros_: Minimal, lightweight, lightning-fast dev server; compiles to static HTML/CSS/JS with zero runtime server requirements; TypeScript provides compile-time verification of data models, state transitions, and evidence integrity; integrates seamlessly with standard testing frameworks (Vitest, Playwright, axe-core).

### Proposed Decision

- **Proposed Stack**: **TypeScript + Vite (Static Client-Side Target)**.
- **Rationale**: Vite produces pure static assets (`dist/`) that can be hosted anywhere, while TypeScript enforces strict type safety on the evidence relationships, navigation states, and verification structures without introducing any server-side infrastructure.

### Remaining Uncertainty & Human Decision Point

- Choice of minimal UI rendering pattern (plain TypeScript Web Components vs. lightweight component library such as Preact or React):
  - _Recommendation_: Plain TypeScript or Preact/React. Human review will authorize the specific component rendering layer prior to implementation.

---

## 2. Application Architecture

### Requirement(s) Satisfied

- **FR-002**: Accepted information architecture (Portfolio Orientation, Project 01, Engineering Approach, Engineering Record, Deep Engineering).
- **FR-003 – FR-010**: Progressive depth, branching from Project 01, and established return paths.
- **FR-011**: Evidence & Evaluation System traceability.
- **SC-002**: Forward and return navigation with zero broken links or dead ends.

### Relevant Constraints

- Non-linear experience map traversal:
  `Orientation → Project 01 ↔ (Approach | Record) → Deep Engineering → Project 01` (and `Project 01 → Orientation`).
- Deep Engineering is a deeper inspection level within Project 01, NOT a separate top-level destination.
- Contextual orientation must answer: "Where am I?", "What am I inspecting?", "How did I get here?", "What can I inspect next?", "How do I return?".

### Facts vs. Assumptions

- **Established Facts**:
  - Exactly five primary experience states exist.
  - State transitions must support browser back/forward and deep linking.
- **Assumptions**:
  - Client-side hash-based routing (`#/orientation`, `#/project-01`, `#/approach`, `#/record`, `#/deep-engineering`) guarantees seamless deep linking on any static file host without requiring server-side URL rewrite rules.

### Alternatives Considered

1. **Multi-Page Static Site (Separate HTML files for each state)**:
   - _Pros_: Simple filesystem mapping.
   - _Cons_: Full page reloads destroy transient navigation context and smooth transitions; duplicate header/navigation boilerplate; harder to maintain dynamic return trails.
2. **Single-Page Application (SPA) with Hash-Based State Router**:
   - _Pros_: Instantaneous transitions; persistent application shell with active depth indicator; preserves history stack and return paths; zero server configuration required.

### Proposed Decision

- **Proposed Architecture**: **Component-Driven SPA with Hash Routing & State Store**.
  - `views/`: 5 view modules matching the five accepted experience states.
  - `components/`: Reusable interface components (`ExperienceShell`, `Header`, `ReturnRail`, `DepthIndicator`, `EvidenceCard`, `VerificationMatrix`).
  - `router/`: Lightweight hash router managing state transitions, return path history, and URL synchronization.
  - `models/`: Strictly typed domain entities for evidence nodes, verification records, and navigation states.
  - `content/`: Structured modules holding verbatim approved copy and evidence records from Stages 06 and 07.

### Remaining Uncertainty & Human Decision Point

- Hash routing (`#/project-01`) vs. HTML5 History API (`/project-01`):
  - Hash routing guarantees 100% compatibility across all static hosts without 404 rewrite handling; History API requires host rewrite configuration.
  - _Recommendation_: Hash routing for robust static hosting. Human review to confirm.

---

## 3. Asset Strategy

### Requirement(s) Satisfied

- **FR-017**: Content and evidence integrity.
- **FR-018**: Design foundations fidelity (IBM Plex Sans typography, semantic color palette, spacing).
- **FR-020**: V3 (Visual), V6 (Performance), V7 (Security).

### Relevant Constraints

- Approved typography is strictly IBM Plex Sans (Light, Regular, Medium, SemiBold, Bold).
- Must avoid external tracking scripts, third-party CDNs, and network dependencies.
- Vector diagrams, connector arrows, and return rails must render crisply across all display resolutions.

### Facts vs. Assumptions

- **Established Facts**:
  - IBM Plex Sans is open-source (OFL) and available in modern WOFF2 formats.
  - Penpot vector assets can be exported as standard SVG code.
- **Assumptions**:
  - Self-hosting fonts in `assets/fonts/` completely isolates the application from external network availability and external privacy tracking.

### Alternatives Considered

1. **External Google Fonts CDN**:
   - _Pros_: Simple `<link>` tag.
   - _Cons_: _Violates Security/Privacy and Offline-First Principles._ Creates third-party network dependency, potential tracking, and fails in offline or restricted environments.
2. **Self-Hosted Local WOFF2 Webfonts & Inline/Modular SVGs**:
   - _Pros_: 100% self-contained, reproducible, fast loading, zero external privacy footprint, fully verifiable offline.

### Proposed Decision

- **Proposed Asset Strategy**:
  - Fonts: Self-hosted **IBM Plex Sans WOFF2** stored in `assets/fonts/`, declared via standard `@font-face` rules.
  - Graphics: Modular **SVGs** stored in `assets/icons/` and `assets/diagrams/`, with connector rails and depth badges rendered using clean SVG elements.

### Remaining Uncertainty & Human Decision Point

- Subsetting font files to optimize bundle size vs. including full Latin character sets:
  - _Recommendation_: Standard Latin WOFF2 subsets (~20KB per weight). Human review to confirm.

---

## 4. Responsive Implementation Approach

### Requirement(s) Satisfied

- **FR-018**: Visual foundations layout and spacing hierarchy.
- **FR-020**: V4 Responsive Verification (usable and legible across established viewport classes).
- **Edge Cases**: Viewport constraints, reflow, no clipped text.

### Relevant Constraints

- Accepted desktop prototype is designed for 1440 × 840.
- Layout must gracefully adapt to smaller desktop, tablet, and mobile screens without horizontal clipping or loss of evidence discoverability.
- Multi-column structures on Engineering Record and Deep Engineering must reflow coherently.

### Facts vs. Assumptions

- **Established Facts**:
  - Desktop baseline is 1440px wide with multi-column structures.
  - Mobile screens (<768px) require single-column stacked hierarchy.
- **Assumptions**:
  - Modern CSS Grid and Flexbox with CSS Custom Properties can implement fluid, responsive layouts without heavy UI frameworks.

### Alternatives Considered

1. **Fixed-Width Viewport / Desktop-Only**:
   - _Pros_: Exact pixel fidelity to 1440 × 840 prototype.
   - _Cons_: _Violates V4 Responsive Verification._ Fails on tablets, laptops, and mobile viewports.
2. **Heavy CSS Framework (Bootstrap, Tailwind)**:
   - _Pros_: Ready-made responsive utilities.
   - _Cons_: Adds build complexity and overrides established Stage 04 design tokens with external styling conventions.
3. **Semantic CSS with CSS Custom Properties & Standard Breakpoints**:
   - _Pros_: Directly implements Stage 04 design tokens (`--color-bg`, `--font-family`, `--space-unit`); uses native CSS Grid/Flexbox; clean breakpoints (`<768px` Mobile, `768px–1024px` Tablet, `>1024px` Desktop).

### Proposed Decision

- **Proposed Approach**: **Native CSS Grid & Flexbox driven by Stage 04 CSS Custom Properties**, with three responsive tiers:
  - **Mobile (< 768px)**: Single-column linear depth traversal; stacked cards; persistent bottom or drawer return navigation.
  - **Tablet (768px – 1024px)**: Adaptive 2-column grid; compact return rail.
  - **Desktop (> 1024px, baseline 1440px)**: Full multi-column experience map layout with dedicated lateral return rails and depth indicators.

### Remaining Uncertainty & Human Decision Point

- Exact mobile navigation placement (sticky top banner vs. sticky bottom navigation bar):
  - _Recommendation_: Sticky top contextual header with explicit "Return to Project 01" button. Human review to confirm.

---

## 5. Accessibility Implementation Approach

### Requirement(s) Satisfied

- **FR-013**: Human judgment and understandable interaction.
- **FR-020**: V5 Accessibility Verification (testable through automated and human inspection, distinguishing verified vs. unverified aspects).
- **Constitution Principle 9**: Responsible and human-centered engineering.

### Relevant Constraints

- Accessibility claims must be verified; no unsupported conformance claims permitted.
- The accepted visual foundation is Stage 04 Direction C: light canvas `#FFFFFF`, primary text `#18212B`, secondary text `#52606D`, primary interactive blue `#245B8F`, accent surface `#E3EEF7`, and border `#D9DEE3`.
- All interactive controls (buttons, navigation links, return rails) must be keyboard accessible and screen-reader navigable.

### Facts vs. Assumptions

- **Established Facts**:
  - Native semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<section>`, `<button>`, `<a>`, `<h1-h6>`) provide robust accessibility semantics by default.
  - The accepted light foundation must be evaluated for accessibility using the actual rendered typography, sizes, and semantic colors; no conformance claim is implied by the palette alone.
- **Assumptions**:
  - Focus management on route transitions is necessary in SPAs to prevent keyboard and screen reader focus from getting lost.

### Alternatives Considered

1. **Generic `<div>` + Click Handlers**:
   - _Pros_: Quick to scaffold.
   - _Cons_: _Fails Accessibility Standards._ Inaccessible to keyboard users and screen readers.
2. **Semantic HTML5 + ARIA Attributes + Focus Management**:
   - _Pros_: Native keyboard navigability (Tab/Shift-Tab/Enter/Space); explicit landmarks (`role="main"`, `role="navigation"`); automated verification using `axe-core`; clear test protocol for manual audit.

### Proposed Decision

- **Proposed Approach**:
  - **Semantic Landmarks**: Structure views with `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.
  - **Interactive Semantics**: Native `<button>` and `<a href="...">` elements for all interactive surfaces.
  - **Focus Management**: On state change, programmatically shift focus to the view's primary heading (`<h1>` with `tabindex="-1"`).
  - **Visible Focus Rings**: Distinct high-contrast outline (`2px solid #4A90D9`, `outline-offset: 2px`) for keyboard focus.
  - **Screen Reader Announcements**: `aria-live="polite"` region to announce state changes and current inspection depth.

### Remaining Uncertainty & Human Decision Point

- Motion preference handling (`prefers-reduced-motion`):
  - _Recommendation_: Disable all transition animations when `prefers-reduced-motion: reduce` is active. Human review to confirm.

---

## 6. Deployment Mechanism

### Requirement(s) Satisfied

- **FR-001**: Functioning software target.
- **FR-020**: V10 Build & Deployment Verification (development/production builds, build verification, deployed-environment inspection).

### Relevant Constraints

- Artifact must be a static distribution directory (`dist/`) containing pure HTML, JS, CSS, and assets.
- Must support automated verification of builds and smoke testing of the deployed artifact.
- Zero server-side infrastructure cost or maintenance burden.

### Facts vs. Assumptions

- **Established Facts**:
  - Repository is connected to GitHub (`origin/main`).
  - GitHub Pages natively supports static hosting directly via GitHub Actions.
- **Assumptions**:
  - A simple GitHub Actions workflow triggered on push/tag can run `npm run test`, `npm run build`, and deploy the resulting `dist/` directory to GitHub Pages.

### Alternatives Considered

1. **Manual Local Build & Manual FTP/File Upload**:
   - _Pros_: No CI setup.
   - _Cons_: Error-prone, lacks build verification audit trail, violates V10.
2. **Containerized Hosting (Docker / Cloud Run / VPS)**:
   - _Pros_: Complete server environment control.
   - _Cons_: _Violates Controlled Scope._ Unnecessary complexity, hosting costs, and security attack surface for static assets.
3. **GitHub Pages via GitHub Actions (Static)**:
   - _Pros_: Native to the repository; reproducible CI build pipeline; automated lint/test/build validation prior to deployment; zero hosting cost; permanent HTTPS.

### Proposed Decision

- **Proposed Approach**: **GitHub Pages via GitHub Actions** for static hosting, using standard `npm run build` producing `dist/`. Local preview verified via `npm run preview` (Vite static server).

### Remaining Uncertainty & Human Decision Point

- Specific GitHub Actions deployment workflow trigger (push to `main` vs. release tag vs. manual workflow dispatch):
  - _Recommendation_: Workflow dispatch or push to `main` with approval gate. Human review to confirm.

---

## Summary of Proposed Technical Decisions

| Unknown                          | Proposed Decision                           | Primary Requirement    | Status                    |
| -------------------------------- | ------------------------------------------- | ---------------------- | ------------------------- |
| **1. Implementation Technology** | TypeScript + Vite (Static Client Target)    | FR-001, FR-018, SC-001 | Proposed for Human Review |
| **2. Application Architecture**  | Component-Driven SPA with Hash Routing      | FR-002–FR-010, SC-002  | Proposed for Human Review |
| **3. Asset Strategy**            | Self-Hosted IBM Plex Sans (WOFF2) + SVGs    | FR-017, FR-018, V3, V6 | Proposed for Human Review |
| **4. Responsive Approach**       | Native CSS Grid/Flexbox + Custom Properties | FR-018, V4             | Proposed for Human Review |
| **5. Accessibility Approach**    | Semantic HTML5 + Focus Management + WCAG AA | FR-013, V5             | Proposed for Human Review |
| **6. Deployment Mechanism**      | GitHub Pages via GitHub Actions             | FR-001, V10            | Proposed for Human Review |

## 7. Human Source-of-Truth Reconciliation — 2026-09-30

A read-only Stage 08 reconciliation investigated the divergence between the accepted Stage 04–07 experience, the Penpot prototype, the Stage 08 specification/planning artifacts, and the T016–T020 implementation.

The human project authority explicitly resolved the identified conflicts as follows:

1. **Visual foundation:** Direction C light remains authoritative: `#FFFFFF`, `#18212B`, `#52606D`, `#245B8F`, `#E3EEF7`, `#D9DEE3`.
2. **Header:** adopt the Penpot-style professional identity header centered on **Adnan Abdullahi**, while preserving the accepted information architecture and without restoring rejected generic portfolio tabs.
3. **Orientation composition:** restore the open, left-aligned Penpot composition; do not retain unauthorized pill badges, CTA card container, or dashed evidence container.
4. **Project 01 composition:** restore the Penpot two-column composition: approximately 760px narrative/action area and 340px dimension-summary area.
5. **Orientation primary CTA:** use **Explore the Engineering Record**.

The Stage 08 dark palette and the T019/T020 visual deviations are therefore superseded as governing product decisions. Historical references remain evidence of how the implementation drift occurred and must not be rewritten as though they never existed.

These decisions govern the subsequent implementation correction. They do not themselves constitute implementation verification.
