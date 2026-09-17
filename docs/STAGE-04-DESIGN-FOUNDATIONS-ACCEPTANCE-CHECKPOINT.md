# STAGE 04 — DESIGN FOUNDATIONS ACCEPTANCE CHECKPOINT

## Project

**Project:** Professional Engineering Portfolio  
**Project Number:** 01  
**Stage:** 04 — Design Foundations in Penpot  
**Status:** ACCEPTED  
**Acceptance Type:** Formal stage checkpoint

---

## 1. Purpose

This artifact records the formal acceptance of Stage 04 — Design Foundations after implementation, read-only inspection, and targeted reconciliation of an apparent verification discrepancy.

The purpose of the acceptance check was not to redesign the portfolio. It was to establish whether the implemented design foundations satisfied the approved decisions and whether sufficient evidence existed to proceed to Stage 05.

---

## 2. Approved Foundation

Stage 04 established the approved design foundation known as:

**Direction C — neutral-first + restrained blue**

### Approved primitive values

- `blue-900` = `#183F63`
- `blue-700` = `#245B8F`
- `blue-100` = `#E3EEF7`
- `neutral-950` = `#18212B`
- `neutral-600` = `#52606D`
- `neutral-200` = `#D9DEE3`
- `neutral-50` = `#F6F7F8`
- `white` = `#FFFFFF`

### Approved semantic roles

- `bg-primary` → `#FFFFFF`
- `bg-secondary` → `#F6F7F8`
- `bg-accent` → `#E3EEF7`
- `text-primary` → `#18212B`
- `text-secondary` → `#52606D`
- `brand-primary` → `#183F63`
- `interactive-primary` → `#245B8F`
- `border-default` → `#D9DEE3`

### Typography foundation

Primary font:

**IBM Plex Sans**

Existing typography tokens were retained, including the approved display, heading, body, label, overline, and caption scales.

The homepage mapping established during Stage 04 included:

- Name → `type-h1`
- Role → `type-h4`
- Engineering Record Statement → `type-body`
- Evidence Description → `type-body`

The Engineering Proposition, Navigation, Primary Action text, Secondary Action text, and Evidence Heading remained intentionally page-specific/manual because no exact foundation token match had been justified.

### Spacing foundation

The established spacing scale remained:

`4, 8, 12, 16, 24, 32, 48, 64px`

---

## 3. Implementation Scope

Stage 04 implementation introduced the approved color token system and applied semantic color bindings to the existing homepage without changing its established structure.

The implementation deliberately did not introduce:

- new components
- variants
- flex layouts
- grid layouts
- unnecessary layout abstractions
- homepage content changes
- board resizing

The homepage remained the existing orientation structure at **1440 × 840**.

---

## 4. Initial Acceptance Inspection

The first read-only acceptance inspection produced two apparent failures:

1. The token API was not discoverable through the inspection path used, causing homepage colors to appear to be raw fills without semantic bindings.
2. A search for a board with a Foundations-related name did not find the Foundations board.

The inspection therefore concluded that Stage 04 was not yet accepted.

This conclusion was treated as a verification discrepancy requiring investigation rather than as an automatic instruction to modify Penpot.

---

## 5. Targeted Reconciliation

A second, narrower read-only inspection investigated the two discrepancies using the relevant Penpot API surfaces.

### 5.1 Token reconciliation

The active `Global` token set was found and verified.

Evidence established that:

- all 16 approved color tokens exist;
- all eight semantic roles exist with the approved values;
- token values resolve correctly;
- homepage semantic bindings are exposed through `shape.tokens`;
- resolved fills correspond to the approved token values.

The homepage therefore is not merely using numerically equivalent colors. The relevant homepage shapes are semantically token-bound.

Two homepage shapes remain raw-fill cases:

- the target board background;
- `Primary Action` text.

These were identified explicitly and do not invalidate the established token system.

### 5.2 Foundations reconciliation

The Foundations work was found under a different board identity:

**Page:** `02 — Foundations`  
**Board:** `01 — Color System`

The board was inspected directly and all eight approved semantic values were confirmed, including explicit role-named swatches for:

- `bg-primary`
- `bg-secondary`
- `bg-accent`
- `text-primary`
- `text-secondary`
- `brand-primary`
- `interactive-primary`
- `border-default`

---

## 6. Reconciliation Result

The apparent conflict between the initial acceptance inspection and the implementation evidence was resolved as:

**Inspection/API limitation plus an incorrect previous search assumption — not implementation failure.**

The token system existed and the homepage bindings were present; the initial inspection simply did not access the authoritative token/binding surfaces.

Likewise, the Foundations board existed but was named `01 — Color System` under the page `02 — Foundations`, so an exact board-name search for "Foundations" was insufficient.

No Penpot modifications were required as a result of the reconciliation.

---

## 7. Acceptance Results

| Criterion | Result |
|---|---|
| Color foundation | PASS |
| Semantic token system | PASS |
| Homepage token bindings | PASS |
| Typography foundation | PASS |
| Spacing foundation | PASS |
| Architecture guardrails | PASS |
| Homepage preservation | PASS |
| Foundations board and swatches | PASS |
| Visual/structural quality | PASS |

### Final decision

**STAGE 04 — DESIGN FOUNDATIONS: ACCEPTED**

The available evidence is sufficient to proceed to the next project stage.

---

## 8. Engineering Record Significance

The acceptance process produced a useful engineering record beyond the design result itself.

The sequence was:

**Implementation → Verification → Apparent discrepancy → Investigation → Reconciliation → Acceptance**

The apparent verification failure was not treated as proof that the implementation was wrong. The inspection method and assumptions were examined before any product modification was considered.

This preserves the project's principle that engineering decisions should be based on evidence and that verification results themselves should be investigated when they conflict with other reliable evidence.

---

## 9. Deferred / Deliberate Items

The following remain deliberately outside Stage 04 scope:

- broader component system development;
- variants;
- responsive screen reconstruction beyond the established foundation;
- interaction-state system development;
- implementation in the frontend codebase;
- full portfolio-screen construction.

These belong to later stages where their requirements and evidence become relevant.

---

## 10. Next Stage

With Stage 04 accepted, the project proceeds to:

**Stage 05 — Portfolio Screens**

The immediate Stage 05 work remains the controlled development of the portfolio screens, beginning with the established orientation/reconstruction work and using the validated foundations rather than reopening already accepted Stage 04 decisions.

---

## Acceptance Principle

> Do not modify the product merely because an inspection appears to indicate failure. First determine whether the failure belongs to the product, the evidence, or the inspection method.
