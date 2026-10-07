
# Current Portfolio — Design Foundation

**Status:** Human-approved foundation  
**Scope:** Current portfolio direction only  
**Historical reference:** Experiment 01 / Stage 04 remains preserved and is not rewritten by this document.

---

## 1. Purpose

This document defines the current human-approved visual and responsive foundation for the portfolio.

The portfolio is treated as **one coherent environment with four primary content states**:

1. Home
2. Engineering Record
3. About
4. Contact

The four states share the same environmental layer, global header/navigation, reusable central content surface, typography foundation, and responsive principles. State-specific content changes; the global visual language does not.

This document is the authoritative design foundation for the current portfolio direction. It is the basis for subsequent Penpot inspection and separately authorized implementation.

---

## 2. Design Principles

### 2.1 One Portfolio Environment

The portfolio should feel like one continuous experience rather than four independently designed pages.

### 2.2 Visual Restraint

The visual language should remain professional, intentional, technically grounded, human, calm, and contemporary. Visual effects support hierarchy and separation; they are not decoration for its own sake.

### 2.3 Reusable Structure

The following are shared foundations:

- global header;
- global navigation;
- central content surface;
- typography system;
- spacing/composition system;
- responsive behavior.

### 2.4 Human Authority

Technical inspection, agent recommendations, and implementation verification are evidence. They do not constitute human acceptance or authorization.

Agents must not substitute, reinterpret, replace, or materially alter an approved design decision without explicit human authorization.

---

## 3. Authoritative Visual Sources

Five human-supplied images form the current visual source set.

- **SOURCE-01 — Actual portfolio background:** the standalone cinematic image supplied for implementation.
- **SOURCE-02 — Home reference:** approved composed Home screen.
- **SOURCE-03 — Engineering Record reference:** approved composed Engineering Record screen.
- **SOURCE-04 — About reference:** approved composed About screen.
- **SOURCE-05 — Contact reference:** approved composed Contact screen.

SOURCE-01 is an **implementation asset**. SOURCE-02 through SOURCE-05 are **visual reference evidence**.

The supplied images are authoritative visual evidence. Agents must not regenerate, substitute, recolor, retouch, arbitrarily crop, or replace them without explicit human authorization.

The complete source registry, original filenames, dimensions, hashes, and intended repository paths are recorded in:

docs/design-foundation/CURRENT-PORTFOLIO-VISUAL-SOURCES.md

---

## 4. Visual Environment

The portfolio uses the supplied cinematic background as a shared full-bleed environmental layer.

### Background rules

- One authoritative background asset across all four states.
- Full-bleed coverage.
- No global color overlay.
- Same asset across desktop, tablet, and mobile.
- background-size: cover.
- Authoritative focal position: **52% 50%**.
- Natural cropping is expected on narrower/taller viewports.
- No separate mobile background.
- No automatic breakpoint-specific focal repositioning.
- Any future focal-position change requires explicit human authorization.

The background image itself must remain unchanged. Layout behavior adapts around the asset; the asset is not modified to accommodate a layout.

### Canonical implementation location

The approved background is intended to be materialized at:

app/public/assets/portfolio/cinematic-background.png

This path is the canonical implementation reference once the binary is materialized.

---

## 5. Color Foundation

| Role | Value |
|---|---|
| Primary Teal | #14B8A6 |
| Deep Teal | #0F766E |
| Charcoal | #0B1F24 |
| Soft White | #F8FAFC |

### Semantic use

**Primary Teal**
- active navigation;
- important interactive emphasis;
- selected states.

**Deep Teal**
- structural borders;
- secondary brand emphasis;
- supporting interactive states.

**Charcoal**
- primary content surface;
- translucent navigation base.

**Soft White**
- primary text;
- high-contrast interface content.

---

## 6. Central Content Surface

The central content surface is a shared reusable card across the four states.

### Desktop foundation

- Maximum width: **1200px**
- Minimum height: **680px**
- Internal padding: **40px**
- Border radius: **16px**
- Surface: **#0B1F24**
- Border: **1px Deep Teal at 0.22 opacity**

### Elevation

The approved shadow is neutral black:

~~~css
box-shadow:
  0 4px 12px rgba(0, 0, 0, 0.25),
  0 16px 40px rgba(0, 0, 0, 0.45);
~~~

The card grows naturally when content requires more space. The 680px minimum is a desktop composition constraint, not a universal fixed height.

---

## 7. Responsive Card Behavior

### Desktop — >=1024px

- Maximum width: 1200px.
- 40px internal padding.
- 680px minimum height.
- Multi-column content may remain side-by-side when the available space supports it.

### Tablet — 768–1023px

- 24px outer gutter.
- 32px internal padding.
- Approximately 500px relaxed minimum where useful.
- Content-driven growth.
- Internal layouts adapt to available width.

### Mobile — <768px

- 16px outer gutter.
- 24px internal padding.
- No forced minimum height.
- Content-driven height.
- Multi-column content stacks where necessary.
- 16px card radius remains.
- Vertical scrolling is expected over the full-bleed background.

The responsive system prioritizes fluidity and content fit rather than imitation of device-specific conventions.

---

## 8. Global Header

One shared global header is used across Home, Engineering Record, About, and Contact.

The header follows the reference-faithful geometry established during technical inspection:

- the header is intentionally wider than the 1200px content card;
- identity and navigation remain part of one shared header system;
- vertical placement remains consistent across states;
- the active navigation state changes with the current destination.

The header must not be collapsed into the card's 1200px boundary merely for geometric symmetry.

---

## 9. Navigation

The global navigation represents the same four destinations everywhere:

1. Home
2. Engineering Record
3. About
4. Contact

### Desktop navigation surface

- Height: **44px**
- Radius: **22px**
- Item gap: **12px**
- Base surface: Charcoal-derived translucent surface
- Background: rgba(11,31,36,0.60)
- Backdrop blur: **12px**
- Active state: **Primary Teal**
- Active text: **Soft White**

The translucent surface allows the cinematic environment to remain perceptible while maintaining navigation legibility.

### Responsive navigation

There is one navigation architecture.

When available width is insufficient for the full navigation:

- the full navigation transitions to a hamburger control;
- the hamburger represents the same four destinations;
- opening the menu reveals the same four routes;
- active-state semantics remain consistent;
- no separate mobile information architecture is introduced.

The exact transition point is determined by actual layout fit rather than an arbitrary device convention.

No contextual “Return to Project 01” navigation is part of the new global architecture.

---

## 10. Typography Foundation

### Typeface

**Manrope**

Manrope is the authoritative typeface for the current portfolio direction.

IBM Plex Sans remains historical to Experiment 01 and is not the current typography source of truth.

### Scale

| Role | Size |
|---|---:|
| Display | 48px |
| H1 | 36px |
| H2 | 28px |
| H3 | 22px |
| Body | 16px |
| Body Small | 14px |
| Label | 13px |
| Caption | 12px |

### Weights

| Role | Weight |
|---|---:|
| Display | 600 |
| H1 | 600 |
| H2 | 600 |
| H3 | 600 |
| Body | 400 |
| Body Small | 400 |
| Label | 600 |
| Caption | 400 |
| Navigation | 500 |

### Letter spacing

| Role | Tracking |
|---|---:|
| Display | -0.02em |
| H1 | -0.02em |
| H2 | -0.01em |
| H3 | 0 |
| Body | 0 |
| Body Small | 0 |
| Label | 0.04em |
| Caption | 0.01em |
| Navigation | 0 |

### Line height

| Role | Line height |
|---|---:|
| Display | 1.10 |
| H1 | 1.20 |
| H2 | 1.25 |
| H3 | 1.30 |
| Body | 1.60 |
| Body Small | 1.50 |
| Label | 1.20 |
| Caption | 1.40 |
| Navigation | 1.00 |

---

## 11. Composition and Spacing

The new portfolio retains a disciplined 4px-based spacing principle while establishing the following major composition values explicitly:

- 16px — mobile outer gutter
- 24px — tablet outer gutter / mobile card padding
- 32px — tablet card padding
- 40px — desktop card padding
- 44px — navigation height
- 48px — major relational spacing
- 64px — larger composition spacing
- 680px — desktop card minimum height
- 1200px — desktop card maximum width

These values describe the new portfolio composition and do not automatically inherit every historical Stage 04 value.

---

## 12. Four-State Shell

The current portfolio consists of:

### Home

Primary landing state and entry point.

### Engineering Record

Contains the approved Portfolio Development record and explains the portfolio development work without introducing the old multi-project navigation structure.

### About

Presents the approved personal identity and engineering approach.

### Contact

Provides the approved contact experience, including the message form and the approved contact channels.

All four states share:

- the same background;
- the same global header;
- the same navigation;
- the same central surface;
- the same typography foundation;
- the same responsive principles.

---

## 13. Historical Relationship to Stage 04

The original Stage 04 Design Foundations remain the accepted historical foundation for Portfolio Experiment 01.

That historical document is not rewritten by this foundation.

The current portfolio direction is a new design-foundation revision informed by evidence from the completed experiment and subsequent human-approved visual decisions.

Therefore:

- historical Stage 04 remains preserved;
- Experiment 01 remains preserved;
- the current foundation governs the revised portfolio direction;
- neither record is retroactively rewritten to make the other appear to have been the original decision.

---

## 14. Verification Boundary

The design decisions in this document are human-approved.

The following are **verification requirements**, not open design decisions:

1. Browser rendering must be inspected against the supplied reference screens.
2. The 52% / 50% background focal position must be visually checked at implementation sizes.
3. The approved dual-layer shadow must be visually checked in the rendered interface.
4. Responsive behavior must be tested at representative desktop, tablet, and mobile widths.
5. Navigation must be inspected at the actual transition point where the full navigation no longer fits.

Verification evidence does not constitute human acceptance.

If implementation evidence appears inconsistent with the foundation, the discrepancy must be investigated before the product is modified.

---

## 15. Governance and Authorization

This document is a design foundation, not an implementation authorization.

Agents may use it as the source of truth for inspection and for separately authorized implementation work.

No implementation, Penpot modification, commit, merge, push, publication, or deployment is implied by the existence of this document.

The governing sequence remains:

**Human Decision → Design Foundation → Penpot Inspection → Human Review → Authorized Implementation → Technical Verification → Human Inspection → Human Acceptance**

Any future change to an approved design decision requires explicit human authorization.

---

## 16. Current Status

**Design decisions:** Resolved.  
**Visual source set:** Supplied and identified.  
**Foundation:** Human-approved.  
**Implementation:** Not authorized by this document.  
**Penpot reconciliation:** Not yet performed under this foundation.  
**Asset materialization:** Separate authorized task; SOURCE-01 must be preserved exactly.
