# PROJECT 01 — PORTFOLIO

## STAGE 05 — PORTFOLIO SCREENS

### Portfolio Orientation Screen Reconstruction Specification

**Document Type:** Stage Specification  
**Project:** Personal Engineering Portfolio — Project 01  
**Stage:** 05 — Portfolio Screens  
**Screen:** 01 — Portfolio Orientation  
**Status:** Approved for Controlled Implementation  
**Decision:** RECONSTRUCT  
**Governing Principle:** **Preserve meaning. Rebuild structure. Validate evidence.**

---

## 1. Purpose

The first portfolio screen, **01 — Portfolio Orientation**, serves as the visitor's entry point into the engineering record.

Its purpose is to establish enough context for a visitor to understand:

- who the engineer is;
- the professional role being presented;
- what kind of engineering work the portfolio represents;
- why the work matters;
- where credible evidence of that engineering can be explored; and
- how the visitor can proceed from orientation into deeper evidence and reasoning.

The screen is therefore not merely a landing page.

It is the **orientation-to-evidence gateway** for the portfolio.

---

## 2. Decision — RECONSTRUCT

The existing orientation screen contains meaningful identity and orientation content, but its structure is insufficient for the portfolio's professional and engineering purpose.

The decision is therefore:

> **RECONSTRUCT**

The reconstruction shall:

- preserve meaningful content and intent;
- rebuild the layout structure;
- apply the established design foundations;
- establish a stronger information hierarchy;
- bring evidence closer to the visitor's entry point;
- remove unjustified visual elements;
- establish intentional responsive transformations;
- prepare the screen for accessibility;
- and support eventual engineering implementation.

The governing principle is:

> **Preserve meaning. Rebuild structure. Validate evidence.**

---

## 3. Source Evidence

The existing screen audit identified useful identity and orientation material, but also several structural deficiencies.

### Existing strengths

- Clear personal identity.
- Clear professional role.
- An engineering-record proposition.
- A primary route toward the engineering record.
- A secondary route toward engineering approach/deeper reasoning.

### Existing deficiencies

- Typography does not follow the established foundations.
- Colors are inconsistent with the approved semantic system.
- Layout relies heavily on manual positioning.
- There is no formal container or layout system.
- Content extends beyond the board boundary.
- Responsive transformation is not established.
- Evidence hierarchy is insufficient.
- Placeholder visual content has limited demonstrated value.
- CTAs are represented primarily as visual rectangles rather than interaction-ready structures.
- Accessibility requirements have not been verified.
- Interaction and state definitions are incomplete.
- Meaningful project/outcome evidence is not yet brought sufficiently close to the orientation experience.

The existing screen is therefore treated as **source evidence**, not as a visual template that must be copied.

---

## 4. Existing Content to Preserve

The following concepts remain valuable and shall be preserved conceptually:

### Identity

**Adnan Abdullahi**

### Professional Role

**Computer Scientist • Engineer**

### Engineering Record Proposition

The existing statement communicates the idea that the portfolio is an engineering record rather than merely a collection of claims.

That concept shall remain.

### Primary Action

**Explore the Engineering Record**

This remains the primary route into professional evidence.

### Secondary Action

**View Engineering Approach**

This remains useful as a subordinate route into deeper engineering reasoning.

---

## 5. Content to Reconsider or Retire

Some existing elements do not yet have sufficient justification.

### Profile Image Placeholder

The existing profile image placeholder should not automatically be recreated.

It should remain excluded unless a clear purpose is established for it.

### Generic Gray Rectangles

Generic gray visual rectangles should not be reproduced simply because they existed in the previous composition.

### Generic Navigation

The previous navigation structure:

- Work
- Engineering
- About
- Contact

should not be mechanically copied.

The information architecture must instead serve the engineering record.

### Intended Information Architecture

The emerging information architecture is:

**Orientation → Professional Evidence → Deeper Engineering Understanding**

---

## 6. Information Hierarchy

The screen shall establish the following hierarchy:

1. **Identity**
2. **Professional role**
3. **Engineering proposition**
4. **Primary evidence entry**
5. **Secondary engineering depth**
6. **Beginning of professional evidence**

Evidence must appear early in the visitor journey.

The portfolio should not make strong professional claims and then require the visitor to navigate through several layers before encountering evidence.

The principle is:

> **Evidence over assertion.**

---

## 7. Core Content Flow

The primary content sequence is:

**Navigation**  
↓  
**Identity**  
↓  
**Professional Role**  
↓  
**Engineering Proposition**  
↓  
**Primary Evidence Entry**  
↓  
**Secondary Engineering Depth**  
↓  
**Beginning of Evidence**

This order represents the semantic priority of the experience.

---

## 8. Engineering Proposition

The portfolio should communicate that engineering capability is demonstrated through actual work and evidence.

The portfolio should demonstrate capability across areas such as:

- technical capability;
- professional judgment;
- problem understanding;
- decision-making;
- uncertainty;
- evaluation;
- iteration;
- verification;
- reflection;
- learning.

Technology is positioned as a capability that assists human judgment rather than replaces it.

The portfolio therefore follows the principle:

> **Evidence over assertion.**

The orientation screen should provide enough context to establish this direction without becoming an essay.

Deeper reasoning belongs later in the experience.

---

## 9. Evidence Strategy

The transition from identity to evidence should happen early.

Evidence may include:

- projects;
- engineering decisions;
- investigations;
- experiments;
- verification;
- outcomes;
- lessons;
- uncertainty;
- iteration;
- evaluated alternatives.

The orientation screen does not need to contain the complete engineering record.

However, it must provide a clear and credible path into that record.

A visitor should not need to navigate through many unrelated layers before reaching meaningful evidence.

---

## 10. Container and Layout

The reconstructed screen shall use:

- one primary container;
- a readable maximum width;
- consistent outer gutters;
- predictable alignment;
- controlled information density;
- intentional spatial relationships;
- no horizontal overflow.

Exact dimensions will be established during construction.

The layout must remain compatible with the Stage 04 responsive and accessibility contract.

The container should establish a clear visual boundary for the portfolio's primary content rather than relying on scattered manual offsets.

---

## 11. Desktop Layout

A two-region composition may be used if it is justified by the actual content. A possible structural arrangement is:

```
[ Navigation ]

[ Identity / Proposition ]     [ Supporting Content ]

[ Evidence Entry ]
```

This is not a mandatory visual grid. The structure must be evaluated according to whether it improves:

- information hierarchy;
- readability;
- evidence discovery;
- visual balance;
- professional communication.

The screen should not introduce arbitrary columns simply to make the composition appear more sophisticated.

---

## 12. Tablet Transformation

Tablet presentation shall transform the desktop composition rather than simply shrinking it. The transformation may include:

- reduced navigation complexity;
- reduced supporting visual content;
- preservation of identity;
- preservation of engineering proposition;
- preservation of the primary evidence entry;
- stacking or restructuring when necessary;
- maintaining readable content widths.

The tablet layout must remain intentional rather than becoming a compressed desktop layout.

---

## 13. Mobile Transformation

Mobile shall use a single primary content column. The priority order is:

1. Identity
2. Role
3. Proposition
4. Primary Evidence
5. Secondary Depth
6. Supporting Content

The mobile version shall:

- avoid horizontal scrolling;
- preserve semantic reading order;
- avoid unnecessary decoration;
- maintain readable typography;
- expose evidence without requiring unnecessary navigation depth;
- reduce or omit imagery when its value is low.

Mobile is therefore treated as a genuine layout transformation rather than a reduced desktop canvas.

---

## 14. Responsive Principles

The responsive implementation shall follow these principles:

- Transform rather than merely scale.
- Preserve semantic order.
- Preserve information priority.
- Collapse multi-region layouts when readability cannot be maintained.
- Maintain readable line lengths.
- Avoid clipping.
- Avoid primary horizontal scrolling.
- Present long technical content vertically.
- Prioritize identity, outcome, and key evidence.
- Use exact breakpoints only at implementation level when supported by actual requirements.

No speculative breakpoint token scale should be introduced at this stage.

---

## 15. Typography

The reconstructed screen shall use the established typography foundation:

- **Primary Font Family:** `IBM Plex Sans`

The existing `Source Sans Pro` implementation shall not be carried forward. The established hierarchy shall be reused rather than creating a new type scale. No additional font family or speculative typography system should be introduced.

Typography should reinforce:

- professional identity;
- hierarchy;
- readability;
- technical seriousness;
- calm visual communication.

---

## 16. Color

The reconstructed screen shall use the approved semantic color system:

| Semantic Token        | Value     |
| :-------------------- | :-------- |
| `bg-primary`          | `#FFFFFF` |
| `bg-secondary`        | `#F6F7F8` |
| `bg-accent`           | `#E3EEF7` |
| `text-primary`        | `#18212B` |
| `text-secondary`      | `#52606D` |
| `brand-primary`       | `#183F63` |
| `interactive-primary` | `#245B8F` |
| `border-default`      | `#D9DEE3` |

Raw black and arbitrary gray values should not be recreated where an established semantic token is appropriate. Color exists to support hierarchy, interaction, communication, and readability—not merely as decoration.

---

## 17. Spacing

The established spacing tokens are:
`4` • `8` • `12` • `16` • `24` • `32` • `48` • `64`

Arbitrary manual offsets should not be introduced. Spacing should establish intentional relationships among:

- navigation;
- identity;
- role;
- proposition;
- actions;
- evidence;
- supporting content.

The resulting composition should feel calm, deliberate, and controlled.

---

## 18. Navigation

The portfolio information architecture is:
**Orientation → Professional Evidence → Deeper Engineering Understanding**

Navigation should help visitors understand:

- where they are;
- where they can go;
- why the destination matters.

The previous navigation labels should not be reproduced mechanically. Every navigation item should have a clear reason for existing.

Potential navigation states include: default, active, hover, focus, contextual depth, and unavailable (where applicable). Navigation remains subordinate to the engineering record.

---

## 19. Primary and Secondary Actions

- **Primary:** `Explore the Engineering Record` — The principal visitor action.
- **Secondary:** `View Engineering Approach` — Provides access to deeper reasoning and remains subordinate to the primary evidence path.

During implementation, these must become semantic interactive elements rather than decorative rectangles.

---

## 20. Accessibility

The screen must be designed with accessibility as part of the structure, not as a later cosmetic adjustment. Requirements include:

- semantic heading hierarchy;
- one clear primary page heading;
- logical reading order;
- keyboard accessibility;
- visible focus;
- sufficient contrast;
- meaning that does not depend on color alone;
- meaningful alternative text for informative images;
- decorative images excluded from unnecessary semantic noise;
- readable zoom and reflow;
- no clipped content;
- appropriate touch-target behavior;
- reduced-motion support.

The visual hierarchy must not contradict the semantic hierarchy.

---

## 21. Interaction and State Requirements

The structure should allow for meaningful states:

- **Navigation:** `default`, `active`, `hover`, `focus`, `contextual depth`, `back/return`
- **Links and Actions:** `default`, `hover`, `focus`, `visited`, `unavailable`
- **Selection:** `selected`, `focused`
- **Evidence:** `proposed`, `investigating`, `validated`, `implemented`, `tested`, `completed`, `superseded`, `uncertain`
- **System and Content:** `loading`, `unavailable`, `error`

Status meaning must not depend exclusively on color. Not every state must receive a complete visual implementation immediately, but the structure should be capable of supporting these states when required.

---

## 22. Reduced Motion

Motion should support understanding, navigation, and orientation—it should not exist merely for decoration.

When reduced-motion preferences are active:

- nonessential animation should be removed or reduced;
- transitions must not be the only method of communicating information;
- content must remain understandable without motion.

No motion-token system should be introduced at this stage.

---

## 23. Evidence-Oriented Visual Language

The visual language should be **calm**, **precise**, **restrained**, **evidence-led**, **readable**, and **technically credible**.

**Avoid:**

- unnecessary decoration;
- excessive effects;
- generic portfolio clichés;
- ornamental complexity;
- purposeless visuals.

A visual element should earn its place by contributing to at least one of: orientation, comprehension, evidence, navigation, trust, or professional communication.

---

## 24. Component Strategy

A comprehensive speculative component system should not be created. Potential reusable patterns may eventually include:

- navigation item;
- primary action;
- secondary action;
- project summary;
- evidence block;
- status indicator;
- metadata row.

However, these patterns should emerge from repeated real requirements. Only genuinely required components should be established now.

---

## 25. Explicitly Deferred Systems

The following systems are intentionally deferred:

- comprehensive component library;
- radius scale;
- elevation/shadow system;
- icon system;
- motion-token library;
- breakpoint-token scale;
- formal grid-token taxonomy;
- comprehensive sizing taxonomy.

This deferral is intentional and does not represent incomplete engineering. The objective is to avoid premature abstraction before sufficient evidence exists.

---

## 26. Existing Layer Disposition

### Preserve Conceptually

- identity;
- professional role;
- engineering-record proposition;
- primary evidence action;
- secondary engineering-approach action.

### Rebuild

- header;
- navigation;
- primary container;
- layout;
- typography;
- color;
- spacing;
- actions;
- responsive behavior;
- accessibility structure;
- evidence entry.

### Retire Unless Justified

- profile image placeholder;
- generic gray rectangles;
- decorative placeholders;
- generic navigation that does not match the established information architecture.

---

## 27. Implementation Constraints

Implementation shall:

- use the established foundations;
- avoid duplicate tokens;
- avoid arbitrary raw colors;
- avoid arbitrary typography;
- avoid arbitrary spacing;
- prevent overflow;
- preserve information hierarchy;
- remain reversible and auditable;
- avoid unrelated foundation modifications.

Penpot remains the source of truth for the visual implementation. The reconstruction must remain controlled rather than becoming an unrestricted redesign.

---

## 28. Controlled Implementation Sequence

Implementation shall proceed in this order:

1. Preserve existing evidence before deleting or replacing anything.
2. Establish the primary container.
3. Establish navigation.
4. Establish identity hierarchy.
5. Establish the primary evidence entry.
6. Establish secondary engineering depth.
7. Apply established foundations.
8. Implement responsive transformations.
9. Address accessibility structure.
10. Perform MCP audit.

The MCP audit shall inspect: dimensions, alignment, overflow, layer structure, typography, color, spacing, responsive specimens, unintended leftovers, and foundation integrity.

Inspection and validation are part of the engineering process.

---

## 29. Acceptance Criteria

### Purpose

The screen clearly communicates identity, professional role, engineering purpose, and the path toward evidence.

### Structure

The screen has a coherent container, clear hierarchy, deliberate spacing, no arbitrary positioning, and no unintended overflow.

### Foundations

The screen uses `IBM Plex Sans`, semantic colors, established spacing, and existing design foundations. No unnecessary foundation modifications are introduced.

### Evidence

Evidence is introduced early, clearly accessible through the primary action, and prioritized over unsupported assertion. Deeper reasoning remains subordinate.

### Responsive

The screen provides intentional desktop presentation, meaningful tablet transformation, coherent single-column mobile presentation, no primary horizontal scrolling, and no clipping.

### Accessibility

The screen supports semantic hierarchy, logical reading order, keyboard interaction, visible focus, adequate contrast, meaning beyond color, meaningful alternative text, and reduced-motion requirements.

### Interaction

The structure accommodates navigation states, action states, unavailable/loading/error conditions where necessary, and evidence status that does not depend only on color.

### Engineering Discipline

The reconstruction must be auditable, reversible, evidence-led, free from unnecessary speculative systems, free from premature abstraction, and consistent with previous project decisions.

---

## 30. Validation Method

Validation shall compare the reconstructed screen against:

- this Stage 05 specification;
- Stage 04 design foundations;
- Stage 02 product experience and structure;
- Stage 03 UX/UI materialization and prototype decisions;
- meaningful existing content;
- responsive requirements;
- accessibility requirements.

Validation must distinguish between intended and unintended outcomes, preserved and retired elements, and resolved and unresolved issues.

A screen is not considered complete simply because it appears visually polished. Completion requires satisfaction of the relevant requirements.

---

## 31. Success Definition

Success is not: _“The screen looks better.”_

Success means the reconstructed screen successfully establishes:

- identity;
- professional role;
- engineering purpose;
- an early path to evidence;
- the established design foundations;
- coherent behavior across screen sizes;
- accessibility readiness;
- intentional interaction and state structure;
- inspectability and auditability;
- consistency with the broader engineering journey.

The screen must communicate both who the engineer is and where credible engineering evidence begins.

---

## 32. Final Decision Record

- **Decision:** RECONSTRUCT
- **Reason:** The existing screen contains useful concepts and content, but its structure, evidence hierarchy, responsive behavior, accessibility readiness, visual foundations, and layout discipline are insufficient for the intended professional engineering portfolio.

> **Decision Summary:** Preserve intent. Rebuild structure.  
> **Governing Principle:** Preserve meaning. Rebuild structure. Validate evidence.

---

## 33. Stage 05 Boundary

This specification defines the reconstruction of: **01 — Portfolio Orientation**

It does not authorize unrestricted redesign of the entire portfolio. Stage 05 begins with the orientation screen. Additional portfolio screens shall only be developed after the orientation screen has reached a sufficient level of validation and the next screen has been explicitly specified.

This maintains a controlled engineering process rather than allowing scope to expand without evidence.

---

## 34. Relationship to the Engineering Journey

The portfolio development sequence is:

```
Stage 01 — Product Constitution
   ↓
Stage 02 — Product Experience & Structure Discovery
   ↓
Stage 03 — UX/UI Materialization and Prototype Validation
   ↓
Stage 04 — Design Foundations in Penpot
   ↓
Stage 05 — Portfolio Screens
   ↓
Orientation Screen Reconstruction
   ↓
Controlled Penpot Implementation
   ↓
Validation
```

The repository should preserve this progression. The portfolio is itself a product and an artifact of engineering practice. Therefore, the process used to create it becomes part of the evidence of how it was engineered.

---

## 35. Closing Principle

This portfolio is Project 01. Its value is not only in the final interface—the engineering process itself is evidence.

The project therefore prioritizes:

- understanding before implementation;
- evidence before assertion;
- deliberate decisions before abstraction;
- verification before acceptance;
- iteration when evidence requires it;
- sufficient clarity over unnecessary complexity.

The portfolio should ultimately demonstrate not merely that an engineer can produce an interface, but that the engineer can:

understand → reason → decide → design → build → verify → learn → improve.

> **Build the portfolio as evidence of engineering, not merely as a presentation of engineering.**
> portfolio_orientation_spec.md
> Displaying portfolio_orientation_spec.md.
