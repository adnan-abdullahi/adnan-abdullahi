# PROJECT 01 — PORTFOLIO

## STAGE 05 — PORTFOLIO ORIENTATION
### Structural Design Decision

**Status:** Approved for Controlled Implementation  
**Decision:** SINGLE PRIMARY READING COMPOSITION WITH AN EARLY EVIDENCE TRANSITION

---

## 1. Decision

The Portfolio Orientation screen will be reconstructed as a calm, single-primary-reading composition that moves from professional identity into engineering evidence early, while preserving deeper reasoning for subsequent exploration.

The screen will not be redesigned as an arbitrary multi-column composition. A two-region composition remains permissible only if later evidence demonstrates that it materially improves the orientation experience without weakening semantic order or readability.

---

## 2. Governing Relationship

The structural decision follows the approved Stage 05 specification:

**Orientation → Professional Evidence → Deeper Engineering Understanding**

The orientation screen therefore has a specific responsibility: establish who the engineer is, what kind of work is being presented, why the work matters, and where the visitor can begin examining the evidence.

It is not intended to contain the complete engineering method, a philosophy manifesto, or a comprehensive design system.

---

## 3. Structural Model

```text
BOARD
└── Primary Content Container
    ├── Header
    │   ├── Identity
    │   └── Navigation
    └── Main
        ├── Orientation
        │   ├── Name
        │   ├── Role
        │   ├── Proposition
        │   └── Record Statement
        ├── Actions
        │   ├── Primary Evidence Entry
        │   └── Secondary Engineering Depth
        └── Evidence Preview
            ├── Engineering Record
            └── Evidence Description
```

The conceptual reading sequence is:

**Navigation → Identity → Professional Role → Engineering Proposition → Primary Evidence Entry → Secondary Engineering Depth → Beginning of Evidence**

---

## 4. Reasoning Behind the Decision

### 4.1 Semantic order

The composition follows the information hierarchy established by Stage 05 rather than beginning with visual layout conventions. Identity and professional role establish context first; the proposition explains the nature of the work; actions provide routes into deeper material; the evidence preview begins the transition from assertion to inspection.

### 4.2 Evidence should appear early

The portfolio is intended to be evidence-led. The visitor should not have to pass through a large amount of introductory material before reaching the engineering record. The evidence transition is therefore intentionally brought close to the orientation content.

### 4.3 Deeper reasoning belongs deeper

The orientation screen should not attempt to explain every engineering principle, investigation method, failure mode, or decision boundary. Those matters are better demonstrated through the engineering record and deeper project material, where evidence can support them.

### 4.4 Avoid unjustified complexity

The reconstruction should not introduce arbitrary columns, decorative panels, profile imagery, speculative cards, or other visual structures without a demonstrated information or interaction need. Simplicity here is structural discipline, not lack of ambition.

### 4.5 Preserve meaning while rebuilding structure

Existing meaningful content is preserved conceptually. Obsolete or weak structural elements may be retired where the approved Stage 05 specification identifies them as candidates for reconstruction. The reconstruction changes the organization of the experience without changing the underlying purpose of the portfolio.

---

## 5. Explicit Non-Decisions

The following are deliberately not introduced by this decision:

- no profile image requirement;
- no large engineering-philosophy section;
- no methodology diagram on the orientation screen;
- no evidence dump;
- no speculative component library;
- no comprehensive design-system expansion;
- no arbitrary two-column grid;
- no decorative rectangles or visual ornament without purpose;
- no new typography family or type scale;
- no new color direction;
- no new spacing scale.

These exclusions protect the boundary between orientation, evidence, and deeper engineering understanding.

---

## 6. Controlled Implementation Sequence

Implementation will proceed in the following order:

1. Preserve existing evidence before deleting or replacing anything.
2. Establish the primary content container.
3. Establish navigation.
4. Establish identity and professional-role hierarchy.
5. Establish the primary evidence entry.
6. Establish secondary engineering depth.
7. Apply the already-established visual foundations.
8. Implement responsive transformations.
9. Address accessibility structure.
10. Perform a read-only MCP audit and verify the result against this decision and the Stage 05 specification.

The first implementation pass is structural only. Visual polish is deferred until the reconstructed structure has been inspected and verified.

---

## 7. Relationship to Earlier Decisions

This decision does not replace the Project 01 Product Constitution, the Stage 04 design-foundation decisions, or the approved Stage 05 reconstruction specification.

It translates the approved Stage 05 information hierarchy into a concrete structural direction for implementation.

The governing implementation principle remains:

**Preserve meaning. Rebuild structure. Validate evidence.**

---

## 8. Acceptance Condition

The structural reconstruction should be accepted only if inspection shows that:

- the intended semantic order is preserved;
- identity, role, proposition, actions, and evidence remain legible;
- the engineering record is reached early enough to support evidence-led exploration;
- no unsupported decorative or architectural complexity has been introduced;
- the established Direction C visual foundations remain available for the next implementation phase;
- the structure can support responsive transformation without relying on arbitrary desktop geometry.

This document records the design decision that precedes controlled Penpot implementation.
