/**
 * Approved Text Content: Deep Engineering (Deeper Inspection Layer)
 * Governed by:
 * - Penpot Prototype: Project 01 — Portfolio Experience > 04 — Prototype > 05 — Deep Engineering
 * - specs/001-project-01-portfolio-experience/spec.md (FR-008, FR-009, FR-015, FR-018)
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.6, 2.7)
 * - specs/001-project-01-portfolio-experience/contracts/ui-contracts.md (Section 5)
 * - docs/STAGE-04-DESIGN-FOUNDATIONS-ACCEPTANCE-CHECKPOINT.md
 */

import type { DeepEngineering, EvidenceItem } from "@/models/experience";

export interface DeepEngineeringContent extends DeepEngineering {
  eyebrow: string;
  contextLabel: string;
  intro: string;
  flowSequence: string[];
  narrativeParagraphs: string[];
  scopeStatement: string;
  validationGap: string;
  action: {
    label: string;
    to: string;
    ariaLabel: string;
  };
}

export const designFoundationsEvidence: EvidenceItem = {
  id: "EVID-DF-01",
  problem:
    "An initial inspection appeared to indicate that the approved semantic color system had not been correctly implemented on homepage shapes, and could not locate the Foundations board.",
  requirement:
    "Faithfully materialize Direction C Light semantic color system and maintain traceable token bindings without raw hardcoded fills (FR-018, Stage 04 Checkpoint).",
  decision:
    "Rather than treating the inspection result as proof of implementation failure or modifying the product prematurely, treat the discrepancy itself as an object of investigation.",
  technicalWork:
    "Direct inspection of the active Global token set via Penpot plugin API and direct search on page 02 — Foundations for board 01 — Color System.",
  evidence:
    "All 16 color tokens and 8 semantic roles confirmed present; homepage shape tokens verified bound in shape.tokens; Foundations swatches verified.",
  verification:
    "Resolved fills strictly match approved token hex codes; discrepancy traced to inspection/API limitations and incorrect search assumption.",
  outcome:
    "Stage 04 accepted without unnecessary modifications; zero code or design regression.",
  reflection:
    "Verification failures should prompt an audit of verification tooling and inspection paths before altering product artifacts; avoids churn caused by false-negative tooling reports.",
  growth:
    "Established disciplined reconciliation workflow: Implementation → Verification → Apparent Discrepancy → Investigation → Reconciliation → Acceptance.",
  uncertainty:
    "Workspace evidence needed clearer materialization; no claims of unverified production metrics or deployment outcomes.",
};

export const deepEngineeringContent: DeepEngineeringContent = {
  id: "deep-engineering",
  title: "Deep Engineering",
  subtitle: "Design Foundations",
  eyebrow: "PROJECT 01 / DEEPER INSPECTION",
  contextLabel: "PROJECT 01",
  parentProject: "project-01",
  intro:
    "Deeper inspection moves from the resulting interface into the evidence behind engineering decisions.",
  narrativeParagraphs: [
    "An initial inspection appeared to indicate that the approved semantic color system had not been correctly implemented.",
    "Rather than treating the inspection result as proof of implementation failure, the discrepancy itself became an object of investigation.",
    "The relevant token set and semantic bindings were inspected directly. The evidence established that the approved tokens existed, resolved correctly, and were applied to the relevant shapes.",
  ],
  flowSequence: [
    "Implementation",
    "Verification",
    "Apparent Discrepancy",
    "Investigation",
    "Reconciliation",
    "Acceptance",
  ],
  caseStudy: {
    title: "Design Foundations Verification",
    overview:
      "Investigation and verification of the semantic color system and token bindings across design foundations.",
    evidenceItems: [designFoundationsEvidence],
  },
  scopeStatement:
    "This project does not yet claim production implementation, deployment outcomes, or real-world user metrics that have not been established.",
  validationGap:
    "Current validation has identified a different gap: the evidence already recorded in the engineering workspace needs to be materialized more clearly so that the actual engineering journey can be inspected as a coherent system.",
  action: {
    label: "Back to Project 01",
    to: "/project-01",
    ariaLabel: "Back to Project 01",
  },
  returnDestination: "project-01",
};

export default deepEngineeringContent;
