/**
 * Approved Text Content: Portfolio Orientation
 * Governed by:
 * - docs/STAGE-05-PORTFOLIO-ORIENTATION.md (Sections 4, 8, 41-43)
 * - specs/001-project-01-portfolio-experience/spec.md (FR-003, FR-017, FR-019)
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.2)
 */

export interface PortfolioOrientationContent {
  id: "orientation";
  identity: {
    name: string;
    role: string;
    stageBadge: string;
  };
  proposition: {
    heading: string;
    statement: string;
    recordStatement: string;
  };
  actions: {
    primary: {
      label: string;
      sublabel: string;
      to: string;
      ariaLabel: string;
    };
    secondary: {
      label: string;
      to: string;
      ariaLabel: string;
    };
  };
  evidencePreview: {
    heading: string;
    description: string;
  };
}

export const orientationContent: PortfolioOrientationContent = {
  id: "orientation",
  identity: {
    name: "Adnan Abdullahi",
    role: "Computer Scientist • Engineer",
    stageBadge: "Stage 08 — Engineering Implementation",
  },
  proposition: {
    heading: "Engineering Proposition",
    statement:
      "Engineering is more than building technology; it is understanding people and problems, making informed decisions, and using technology responsibly to create useful solutions.",
    recordStatement:
      "This engineering record shows how I understand problems, make decisions, build solutions, verify results, and grow through the process.",
  },
  actions: {
    primary: {
      label: "Explore the Engineering Record",
      sublabel: "Central engineering project experience & evidence gateway",
      to: "/project-01",
      ariaLabel: "Explore the Engineering Record",
    },
    secondary: {
      label: "View Engineering Approach",
      to: "/approach",
      ariaLabel: "View Engineering Approach",
    },
  },
  evidencePreview: {
    heading: "Engineering Record",
    description:
      "Projects, investigations, decisions, verification, and reflection.",
  },
} as const;

export default orientationContent;
