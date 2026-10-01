/**
 * Approved Text Content: Engineering Record (Project Dimension)
 * Governed by:
 * - Penpot Prototype: Project 01 — Portfolio Experience > 04 — Prototype > 04 — Engineering Record
 * - docs/PROJECT-01.md (Engineering Record Controls)
 * - specs/001-project-01-portfolio-experience/spec.md (FR-006, FR-007, FR-015, FR-017)
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.5)
 */

export interface DecisionRecordItem {
  id: string;
  stage: string;
  title: string;
  body: string;
  problem?: string;
  decision?: string;
  revisionHistory?: string[];
  status: "decided" | "revised" | "unresolved";
}

export interface VisibleUncertaintyItem {
  topic: string;
  description: string;
  status: "unresolved";
}

export interface EngineeringRecordContent {
  id: "engineering-record";
  title: string;
  eyebrow: string;
  contextLabel: string;
  parentProject: "project-01";
  intro: string;
  chronologicalEntries: DecisionRecordItem[];
  visibleUncertainties: VisibleUncertaintyItem[];
  concludingNote: string;
  actions: {
    primary: {
      label: string;
      to: string;
      ariaLabel: string;
    };
    secondary: {
      label: string;
      to: string;
      ariaLabel: string;
    };
  };
  deeperInspectionDestination: "deep-engineering";
  returnDestination: "project-01";
}

export const recordContent: EngineeringRecordContent = {
  id: "engineering-record",
  title: "Engineering Record",
  eyebrow: "PROJECT 01 / DIMENSION",
  contextLabel: "PROJECT 01",
  parentProject: "project-01",
  intro:
    "The record preserves how engineering understanding and decisions develop — including problems encountered, decisions made, revisions, verification, and what remains unresolved.",
  chronologicalEntries: [
    {
      id: "design-foundations",
      stage: "STAGE 04",
      title: "DESIGN FOUNDATIONS",
      body: "An apparent verification failure was investigated before changing the product. The discrepancy was traced to the inspection path and previous search assumption, after which the design foundations were accepted.",
      problem:
        "Apparent verification failure during typography and token inspection",
      decision:
        "Investigated discrepancy before changing the product; traced to inspection path and search assumption; Stage 04 accepted without unnecessary modifications.",
      status: "decided",
    },
    {
      id: "prototype",
      stage: "STAGE 06",
      title: "PROTOTYPE",
      body: "During prototype materialization, a redundant interaction and an unresolved navigation destination were discovered and corrected. The final topology was then inspected and verified.",
      problem:
        "Redundant open-overlay interaction on Orientation and unresolved back destination on Project 01",
      decision:
        "Removed redundant interaction, repaired unresolved destination to navigate cleanly to Portfolio Orientation, and verified complete 5-state topology.",
      revisionHistory: [
        "Removed redundant open-overlay interaction on Orientation CTA",
        "Repaired unresolved back destination on Project 01 to target Portfolio Orientation",
      ],
      status: "revised",
    },
    {
      id: "validation",
      stage: "STAGE 07",
      title: "VALIDATION",
      body: "Human evaluation established that the prototype's structure, progressive depth, navigation, and Approach/Record distinction were understandable. It also exposed gaps in evidence discoverability, decision traceability, and revision/learning content.",
      problem:
        "First human evaluation of the prototype experience and evidence discoverability",
      decision:
        "Human evaluation confirmed structural clarity, progressive depth, and Approach/Record distinction, while recording explicit gaps in evidence discoverability and decision traceability to be addressed in implementation.",
      status: "decided",
    },
  ],
  visibleUncertainties: [
    {
      topic: "Evidence Discoverability & Decision Traceability",
      description:
        "Human evaluation exposed remaining gaps in evidence discoverability, decision traceability, and revision/learning content to be resolved through progressive inspection.",
      status: "unresolved",
    },
  ],
  concludingNote:
    "The record does not present the project as complete. It preserves what has been established, what has changed, and what remains uncertain.",
  actions: {
    primary: {
      label: "Continue to Deep Engineering",
      to: "/deep-engineering",
      ariaLabel: "Continue to Deep Engineering",
    },
    secondary: {
      label: "Back to Project 01",
      to: "/project-01",
      ariaLabel: "Back to Project 01",
    },
  },
  deeperInspectionDestination: "deep-engineering",
  returnDestination: "project-01",
} as const;

export default recordContent;
