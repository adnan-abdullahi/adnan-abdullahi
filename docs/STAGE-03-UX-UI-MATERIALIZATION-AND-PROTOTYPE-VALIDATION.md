# STAGE 3 — UX/UI MATERIALIZATION & PROTOTYPE VALIDATION

**Project:** Project 01 — Professional Engineering Portfolio  
**Stage:** 3 of 10  
**Status:** Historical — Stage 3 subsequently completed; see current project state in `docs/PROJECT-01.md`  
**Primary Instrument:** Penpot  
**Preceding Stage:** Stage 2 — Product Experience & Structure Discovery  
**Following Stage:** Stage 4 — Design Foundations in Penpot *(historical wording in this record previously identified Stage 4 as Product Specification; that model was subsequently superseded)*

---

## 0. Record Disposition

This record preserves the historical Stage 3 specification, implementation checkpoints, validation reasoning, and evidence as they developed.

The original `Status: Initiating` and references to Stage 4 as **Product Specification** are historical and are not current project guidance.

At project level, Stage 3 is completed. The current project position is governed by `docs/PROJECT-01.md`.

This record is not retroactively rewritten to imply a Stage 3 acceptance event that is not explicitly recorded here. Its historical evidence remains preserved.

---

Stage 3 exists to materialize the UX/UI structure established during Stage 2 into an actual interactive interface and to determine whether that design works when experienced as a real product.

The purpose is not to produce decorative mockups.

The purpose is to expose the design to practical experience so that assumptions about structure, navigation, hierarchy, interaction, accessibility, content density, progressive depth, and professional evaluation can be examined.

The design is therefore treated as a hypothesis that must be experienced and evaluated.

---

## 2. Relationship to Stage 2

Stage 2 established the conceptual experience and structural model of the portfolio.

Stage 3 takes those decisions into an actual interface.

The transition is:

**UX/UI Design → Materialization → Experience → Evaluation → Revision → Re-experience → Validation**

Stage 3 does not replace Stage 2.

It tests whether the decisions made in Stage 2 remain effective when materialized.

If materialization exposes weaknesses in the Stage 2 model, the earlier decisions may be revised.

Such revision is considered normal engineering iteration rather than failure.

---

## 3. Engineering Question

The central engineering question for this stage is:

> **Does the materialized portfolio experience allow a professional visitor to understand, inspect, question, and evaluate the engineer and the evidence without unnecessary friction or unsupported interpretation?**

Supporting questions include:

- Can a new visitor understand what this portfolio represents?
- Can a visitor understand that the portfolio itself is Project 01?
- Can a visitor understand the relationship between capability and evidence?
- Can a visitor enter the engineering depth of Project 01 progressively?
- Can a visitor understand why important decisions were made?
- Can a visitor distinguish claims from evidence?
- Can a visitor understand uncertainty, iteration, and incomplete work where relevant?
- Can a visitor navigate without confusion?
- Can the interface support accessibility?
- Does the visual system communicate technical maturity without becoming decorative?
- Does the interface help a professional evaluator form justified confidence?
- Does the experience preserve human judgment and responsibility when technology or AI assistance is involved?

---

## 4. Materialization Principle

Penpot is an instrument for materialization and validation.

It is not the source of engineering truth.

The authoritative reasoning remains in the engineering record.

Penpot materializes that reasoning into:

- screens
- layouts
- components
- typography
- spacing
- visual hierarchy
- interaction states
- navigation
- prototype connections
- responsive considerations
- accessibility considerations

The design must remain traceable to the experience and structural decisions established in Stage 2.

---

## 5. Prototype Scope

The first prototype will not attempt to represent every possible page or future feature.

It will materialize the minimum set of experiences necessary to test the core portfolio model.

The initial prototype should allow a visitor to experience at least:

1. Portfolio orientation
2. Engineer identity and professional positioning
3. Project 01 overview
4. Project 01 engineering depth
5. Capability-to-evidence relationships
6. Evidence and decision context
7. Professional next action

The prototype may expand only when additional materialization is necessary to answer an engineering question.

---

## 6. Core Experience Model

The primary visitor experience follows the progressive depth model established in Stage 2:

**Orientation → Professional Evidence → Deep Engineering**

A visitor should not be forced immediately into technical depth.

The interface should allow increasing inspection depth according to visitor interest and evaluation needs.

The intended external evaluation loop is:

**Discover → Understand → Question → Explore → Verify → Judge → Go Deeper → Judge Again**

---

## 7. Core Information Relationships

The prototype must preserve the principal information relationships established in Stage 2.

### Engineering Evidence Chain

**Problem → Requirement → Decision → Technical Work → Evidence → Verification → Outcome → Reflection → Growth**

### Portfolio Structure

**Engineer → Capability → Project → Evidence**

These relationships should be experienced through the interface rather than presented as disconnected documentation.

---

## 8. Initial Prototype Areas

The first Penpot materialization will examine the following areas.

### 8.1 Portfolio Orientation

Purpose:

Allow an unfamiliar visitor to understand:

- who the engineer is
- what the portfolio represents
- what can be evaluated
- where to begin

### 8.2 Project 01 Overview

Purpose:

Explain that the portfolio is itself an engineering project and provide a clear entry into its evidence.

### 8.3 Project 01 Deep Engineering

Purpose:

Allow a technically interested visitor to inspect:

- problem
- investigation
- requirements
- constraints
- decisions
- implementation
- verification
- evaluation
- reflection

### 8.4 Capability and Evidence

Purpose:

Allow a visitor to understand how capability claims are supported by actual evidence.

### 8.5 Evidence and Decision Context

Purpose:

Allow a visitor to understand not only what was produced but why important engineering decisions were made.

### 8.6 Professional Action

Purpose:

Provide a clear next step for a visitor who wants to continue the professional relationship.

---

## 9. Visual Design Direction

The visual system should communicate:

- precision
- confidence
- curiosity
- humanity
- technical maturity
- restraint

The interface should avoid:

- unnecessary decoration
- excessive animation
- visual noise
- technology-for-technology's-sake
- exaggerated claims
- artificial complexity
- generic developer-portfolio patterns that do not support the evidence model

Visual hierarchy should follow:

**Orientation → Context → Inspection**

---

## 10. Component Formation Principle

Components should not be created merely because a design tool allows componentization.

The design system should evolve from actual repeated needs.

The governing sequence is:

**Need → Repeated Pattern → Component → Reusable Behavior → Design-System Rule**

This preserves engineering purpose and prevents premature abstraction.

---

## 11. Interface States

Where relevant, the prototype should represent meaningful states such as:

- proposed
- investigating
- active
- validated
- implemented
- tested
- completed
- superseded
- uncertain

States must communicate actual project conditions rather than creating artificial complexity.

---

## 12. Accessibility Validation

Accessibility is part of engineering quality.

The prototype must therefore be examined for:

- semantic hierarchy
- logical reading order
- keyboard interaction considerations
- visible focus
- sufficient contrast
- information that does not depend solely on color
- readable typography
- meaningful labels
- appropriate interaction targets
- alternative text requirements
- reduced-motion considerations
- understandable interface states
- clear error and recovery behavior where applicable

Penpot validation does not replace implementation-level accessibility testing.

It establishes accessibility intent before implementation.

---

## 13. Interaction Principle

Interactions should exist because they improve:

- understanding
- navigation
- inspection
- verification
- task completion

Interactions should not exist merely to demonstrate technical capability.

Motion should be purposeful and should respect reduced-motion requirements.

---

## 14. Prototype Validation Tests

The prototype will be evaluated against the following failure conditions.

### Test 1 — Impressive but Empty

Can the interface look professional while failing to provide meaningful evidence?

### Test 2 — Evidence Without Context

Can a visitor see artifacts without understanding what problem or decision produced them?

### Test 3 — Excessive Depth

Can a visitor become overwhelmed by engineering detail before understanding the basic context?

### Test 4 — Insufficient Depth

Can a technically interested evaluator obtain enough evidence to evaluate engineering capability?

### Test 5 — Claim Inflation

Does the interface imply capability beyond what the evidence supports?

### Test 6 — Human Judgment

Does the interface make clear that engineering responsibility remains with the engineer, including when technology or AI assistance is used?

### Test 7 — Engineer Growth

Does the portfolio communicate learning, adaptation, reflection, and development rather than presenting engineering as a finished state?

---

## 15. Materialization Method

The Penpot work will proceed incrementally.

### Pass 1 — Structural Materialization

Materialize:

- page structure
- navigation
- major sections
- content hierarchy
- information relationships
- basic responsive structure

Do not optimize visual polish yet.

### Pass 2 — Visual System

Materialize:

- typography
- spacing
- layout rhythm
- visual hierarchy
- component patterns
- visual states

### Pass 3 — Interaction

Materialize:

- navigation behavior
- prototype connections
- expandable/deeper inspection patterns where justified
- meaningful states

### Pass 4 — Accessibility Review

Inspect the materialized design against the accessibility requirements established above.

### Pass 5 — Experience Review

Use the prototype as an actual visitor rather than as its creator.

Attempt to answer the Stage 3 engineering questions.

### Pass 6 — Revision

Revise only where evidence from experience demonstrates that revision is necessary.

### Pass 7 — Re-validation

Experience the revised prototype again.

The cycle continues until the design is sufficiently validated for progression to Product Specification.

---

## 16. Implementation Checkpoint — Portfolio Orientation

This checkpoint records the verified Penpot progress for the Portfolio Orientation screen. It does not claim completion of the entire portfolio or of every Stage 3 activity.

### Pass 1 — Visual Foundation

**Status:** PASS

Verified in Penpot:

- The orientation board is `1440 × 840`.
- The approved IBM Plex Sans typography system and required hierarchy are present.
- The primary action background, primary and secondary actions, engineering identity, proposition, record statement, and Engineering Record evidence preview are present.
- No placeholder image, legacy gray header, or decorative utility rectangle was introduced or retained.
- The proposition and record statement remain separate content elements.

### Pass 2 — Semantic Structure

**Status:** PASS

Exactly four semantic groups were created inside the existing `1280 × 800` content wrapper:

- `Header`: Header Identity, Engineering Record, Approach, About, Contact
- `Hero`: Name, Role
- `Actions`: Primary Action Background, Primary Action, Secondary Action
- `Evidence`: Evidence Heading, Evidence Description

The Container, Header, Hero, Engineering Proposition, Engineering Record Statement, Actions, and Evidence remain direct children of the existing wrapper. Existing content, geometry, typography, text, fills, strokes, and CTA relationships were preserved. No objects were deleted or duplicated.

### Pass 2A — Architecture Assessment

**Status:** PASS / KEEP CURRENT STRUCTURE

This was a read-only architecture assessment; no Penpot mutation was performed during Pass 2A.

The board, wrapper, and Container remain stable. The Container remains a visual boundary/background rectangle. Header, Hero, Actions, and Evidence are semantically clear groups, but no auto-layout, flex layout, frame conversion, component, variant, or new design token was introduced. The primary action is the strongest future reusable interaction candidate, while further componentization and layout behavior remain intentionally deferred.

The architectural decision was:

> We should not optimize the Penpot structure before we have enough evidence from the actual product requirements to know what needs to be reusable or responsive.

This checkpoint records implementation and verification evidence only. It does not represent the entire portfolio as complete.

---

## 17. Evidence to Capture

Stage 3 should produce evidence of:

- materialized screens
- component decisions
- interaction decisions
- prototype flows
- design revisions
- discovered problems
- validation observations
- accessibility considerations
- rejected or superseded design approaches
- reasons for significant changes

The objective is not to document every click made in Penpot.

The objective is to preserve meaningful engineering evidence.

---

## 18. Design Decision Record

Important design decisions should record, where appropriate:

### Context

What situation or problem required the decision?

### Decision

What was chosen?

### Reasoning

Why was it chosen?

### Alternatives

What meaningful alternatives were considered?

### Evidence

What observation, requirement, principle, or validation informed the decision?

### Result

What happened after materialization?

### Revision

Was the decision retained, changed, or superseded?

This structure keeps design work connected to engineering reasoning.

---

## 19. Relationship to Product Specification

Stage 3 does not finalize implementation requirements.

Instead, it produces a sufficiently validated experience from which the Product Specification can be developed.

The relationship is:

**Stage 2 — Discover Structure**

↓

**Stage 3 — Materialize and Validate Experience**

↓

**Stage 4 — Specify the Product**

The Product Specification must reflect what was learned during Stage 3 rather than simply documenting the original assumptions from Stage 2.

---

## 20. Exit Criteria

Stage 3 may be considered complete when:

- the core portfolio experience has been materialized
- the major navigation structure has been experienced
- the progressive-depth model works sufficiently
- Project 01 can be understood and inspected
- evidence relationships remain understandable
- important interactions have been validated
- accessibility considerations have been reviewed
- significant usability problems have been addressed or consciously accepted
- important design decisions are recorded
- meaningful revisions are represented honestly
- the prototype provides sufficient confidence to proceed to Product Specification

Completion does not mean the design is perfect.

It means the experience is sufficiently understood and validated to support the next engineering stage.

---

## 21. Stage 3 Foundational Principle

> **Materialize the experience so that assumptions can be experienced, questioned, tested, revised, and validated before implementation.**

---

## 22. Current Status

**Stage 3 status:** Historical — Portfolio Orientation was materialized and structurally verified; the current project state is governed by `docs/PROJECT-01.md`

**Penpot status:** Portfolio Orientation materialized in Penpot; the verified implementation checkpoint is recorded above

**Validation status:** Pass 1, Pass 2, and the read-only Pass 2A architecture assessment verified for Portfolio Orientation

**Implementation status:** Portfolio Orientation implementation checkpoint complete; broader portfolio implementation not complete

**Next immediate action:** No current Stage 3 action is established by this historical record; subsequent work is governed by the current project state recorded in `docs/PROJECT-01.md`.
