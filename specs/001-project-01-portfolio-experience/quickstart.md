# Quickstart & Verification Guide: Project 01 — Portfolio Experience

**Feature Branch**: `001-project-01-portfolio-experience`  
**Date**: 2026-09-28  
**Spec**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)  
**Status**: Complete (Proposed for Human Review)

---

## 1. Prerequisites

Before running or verifying the application in Stage 08, verify the host environment:

- **Node.js**: `>= 20.0.0` (Current host system verified: `v24.21.0`)
- **npm**: `>= 10.0.0` (Current host system verified: `11.19.0`, invoked as `npm.cmd` on Windows)
- **Git**: `>= 2.40.0` (Current host system verified: `2.55.0.windows.5`)
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari with ES2022+ support

---

## 2. Project Setup & Local Run

_(These commands are for use once implementation is human-authorized)_

### Step 1: Install Dependencies

```powershell
npm.cmd install
```

### Step 2: Start Local Development Server

```powershell
npm.cmd run dev
```

- **Local URL**: `http://localhost:5173` (default Vite port)
- **Expected Outcome**: Instant dev server startup with Hot Module Replacement (HMR).

### Step 3: Production Build & Preview

```powershell
npm.cmd run build
npm.cmd run preview
```

- **Expected Outcome**: Generates pure static bundle in `dist/` and runs a local static preview server without external dependencies.

---

## 3. Systematic Verification Matrix (V1–V10)

This quickstart defines the concrete test commands and inspection protocols to verify the implementation against the Stage 08 verification categories.

| Category                      | Verification Method                | Command / Protocol                    | Expected Outcome                                                                                                                        |
| ----------------------------- | ---------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **V1: Functional**            | Automated Unit/Route Tests         | `npm.cmd run test:unit`               | All routes, state transitions, and component mounts pass without errors.                                                                |
| **V2: Experience & Behavior** | End-to-End Navigation Test         | `npm.cmd run test:e2e`                | Automated browser traverses Orientation → Project 01 → Approach / Record → Deep Engineering → Returns to Project 01. Zero broken links. |
| **V3: Visual Fidelity**       | Visual Regression / Token Check    | Manual Inspection & Token Audit       | Typography matches IBM Plex Sans, colors match Stage 04 semantic palette, multi-column desktop layout matches 1440px baseline.          |
| **V4: Responsive**            | Multi-Viewport Emulation           | `npm.cmd run test:responsive`         | Tested at 375px (Mobile), 768px (Tablet), and 1440px (Desktop). No horizontal scroll overflow or clipped evidence text.                 |
| **V5: Accessibility**         | Automated Axe Audit + Keyboard Nav | `npm.cmd run test:a11y`               | Zero critical axe-core violations; keyboard Tab navigation cycles through all interactive surfaces with visible focus rings.            |
| **V6: Performance**           | Lighthouse / Bundle Size Check     | `npm.cmd run build` (inspect `dist/`) | Total production JS/CSS bundle `< 150KB` gzip; zero external CDN network requests.                                                      |
| **V7: Security**              | Dependency & Secret Audit          | `npm.cmd audit`                       | Zero known vulnerabilities; zero exposed credentials or secret tokens in static bundle.                                                 |
| **V8: Compatibility**         | Cross-Browser Smoke Check          | Chrome / Edge / Firefox / Safari      | Identical rendering and interaction across all modern desktop/mobile engines.                                                           |
| **V9: Content & Evidence**    | Text & Traceability Audit          | Manual Evidence Review                | All text matches approved Stage 06/07 copy verbatim; 9-part evidence chain fully rendered for Design Foundations case.                  |
| **V10: Build & Deploy**       | Static Build Verification          | `npm.cmd run build`                   | Clean exit code 0; `dist/index.html` operates locally or in static host preview without runtime errors.                                 |

---

## 4. End-to-End Visitor Journey Walkthrough

To manually verify the progressive inspection model end-to-end:

1. **Step 1 — Entry**: Open `http://localhost:5173#/orientation`.
   - _Verify_: Portfolio Orientation displays context; click "Explore Project 01".
2. **Step 2 — Central Context**: Arrive at `#/project-01`.
   - _Verify_: Project 01 overview renders; depth indicator displays "Project Context"; return link to Orientation is present and functional.
3. **Step 3 — Dimension (Approach)**: Click "Engineering Approach" card.
   - _Verify_: Arrive at `#/approach`; depth indicator displays "Dimension"; governing philosophy is visible; "Inspect Deeper Evidence" button is present.
4. **Step 4 — Deeper Inspection (Deep Engineering)**: Click "Inspect Deeper Evidence".
   - _Verify_: Arrive at `#/deep-engineering`; depth indicator displays "Deeper Inspection"; Design Foundations verification case is rendered with the complete 9-part evidence chain; lateral return rail displays "Return to Project 01".
5. **Step 5 — Return to Project**: Click "Return to Project 01".
   - _Verify_: Arrives cleanly back at `#/project-01` without disorientation or dead ends.
6. **Step 6 — Dimension (Record)**: Click "Engineering Record" card.
   - _Verify_: Arrive at `#/record`; decision log and visible uncertainties are displayed; "Inspect Deeper Evidence" navigates to Deep Engineering; return to Project 01 functions cleanly.
