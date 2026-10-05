# Experiment 01 — Initial Portfolio Experience

## Project

**Project:** Professional Engineering Portfolio  
**Project Number:** 01  
**Experiment:** 01 — Initial Portfolio Experience  
**Status:** Closed  
**Purpose:** Record what was learned from designing, implementing, and evaluating the initial portfolio experience before developing the revised portfolio foundation.

---

## 1. Purpose

The initial portfolio experience was developed as a practical experiment in presenting professional identity, engineering work, engineering reasoning, and supporting evidence through a structured portfolio experience.

The experiment progressed through design foundations, portfolio orientation, prototype development, validation, and engineering implementation.

Its purpose was not only to produce a portfolio, but also to learn how the portfolio itself should communicate engineering capability and evidence.

---

## 2. What Was Built

The initial implementation developed a multi-state portfolio experience containing:

- Portfolio Orientation
- Project 01
- Engineering Approach
- Engineering Record
- Deep Engineering
- About

The implementation included routing, responsive layouts, reusable components, content models, unit tests, end-to-end tests, accessibility verification, and production build verification.

The implementation and verification evidence remain preserved in the repository and Git history.

---

## 3. What the Experiment Established

The experiment established several useful foundations.

### Engineering evidence

The portfolio can communicate engineering work through:

- problems encountered;
- decisions made;
- implementation;
- verification;
- revisions;
- uncertainty;
- deeper engineering reasoning.

### Engineering process

The implementation reinforced the sequence:

**Implementation → Verification → Apparent Discrepancy → Investigation → Reconciliation → Acceptance**

The project also demonstrated that an apparent verification failure should be investigated before modifying the product.

### Human evaluation

Implementation and visual inspection exposed aspects of the portfolio experience that were difficult to evaluate adequately from isolated design artifacts alone.

---

## 4. Problems Exposed Through the Experiment

The experiment also exposed structural limitations in the portfolio experience.

### Navigation consistency

Different screens developed different navigation and return patterns.

This created unnecessary complexity in understanding how the visitor moves through the portfolio.

### Global experience consistency

The portfolio increasingly behaved as a collection of related pages rather than as one coherent portfolio environment.

The need to repeatedly reconcile headers, navigation, return controls, contextual indicators, and page structure demonstrated that the global experience had not been established strongly enough before individual screens were developed.

### Overall simplicity

The implemented experience contained more structural depth than is currently necessary for the intended portfolio.

The implementation therefore revealed a need to simplify the visitor experience while preserving the engineering evidence.

### Portfolio completeness

The experiment also exposed missing or insufficiently defined global elements, including the lack of a coherent final global navigation/closing experience.

---

## 5. What Was Learned

The central learning from the experiment is:

> **Individual portfolio screens should not be designed and implemented independently before the global portfolio experience has been sufficiently established.**

The portfolio is better understood as a single system whose visual language, navigation, identity, and interaction model remain coherent while its content changes.

Implementation therefore became an important source of design evidence rather than merely the final execution step.

---

## 6. Resulting Direction

Based on the evidence produced by the experiment, the portfolio direction is being reconsidered.

The revised direction is to establish:

> **One portfolio environment with four primary content states.**

These states are:

1. **Home**
2. **Engineering Record**
3. **About**
4. **Contact**

The states share a common visual and interaction foundation rather than behaving as independently designed experiences.

The approved visual direction developed during subsequent human exploration establishes:

- a persistent cinematic background;
- a consistent header;
- the approved personal identity mark;
- consistent navigation;
- a reusable content card;
- consistent visual treatment across the four states;
- concise state-specific content.

---

## 7. What Is Being Preserved

The revised direction does not invalidate the engineering evidence produced by the initial experiment.

The following remain valuable:

- engineering decisions;
- investigation records;
- verification evidence;
- implementation history;
- accessibility and responsive verification;
- lessons from human inspection;
- uncertainty already identified;
- the repository and Git history.

The previous implementation therefore remains part of the project's engineering history.

---

## 8. What Is Being Reconsidered

The following are being reconsidered as part of the revised portfolio foundation:

- global navigation;
- portfolio information architecture;
- page/state relationships;
- global visual shell;
- background treatment;
- reusable content surface;
- visitor-facing depth;
- amount of navigation required;
- overall portfolio simplicity.

These changes constitute a new design-foundation exercise rather than a retroactive alteration of the original experiment.

---

## 9. Relationship to Previous Stages

The original Stage 04 Design Foundations remain historically valid as the foundation that governed the initial portfolio experience.

The subsequent stages remain the record of the work performed under that foundation.

The revised direction is therefore treated as a new design-foundation revision informed by evidence from the completed experiment.

It does not rewrite or invalidate the original Stage 04 acceptance.

---

## 10. Experiment Disposition

**Experiment 01 — Initial Portfolio Experience**

**Disposition:** Closed as an engineering experiment.

The experiment produced both a functioning portfolio experience and evidence about the limitations of its structure.

Its implementation is preserved.

Its findings inform the next design-foundation revision.

---

## 11. Next Authorized Work

The next work is:

**Revised Portfolio Design Foundation**

The immediate objective is to establish the global portfolio shell before reconstructing the individual content states.

No implementation changes are authorized by this record.

Human inspection and acceptance are required before the revised foundation proceeds to materialization and implementation.
