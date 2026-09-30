/**
 * Approved Text Content: Engineering Approach (Project Dimension)
 * Governed by:
 * - Penpot Prototype: Project 01 — Portfolio Experience > 04 — Prototype > 03 — Engineering Approach
 * - docs/PROJECT-01.md (Engineering Principle)
 * - specs/001-project-01-portfolio-experience/spec.md (FR-005, FR-012, FR-017)
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.4)
 */

export interface ApproachSection {
  heading: string
  body: string
}

export interface EngineeringApproachContent {
  id: 'engineering-approach'
  title: string
  eyebrow: string
  contextLabel: string
  parentProject: 'project-01'
  intro: string
  governingPhilosophy: string
  technologyPrinciple: string
  sections: ApproachSection[]
  actions: {
    primary: {
      label: string
      to: string
      ariaLabel: string
    }
    secondary: {
      label: string
      to: string
      ariaLabel: string
    }
  }
  deeperInspectionDestination: 'deep-engineering'
  returnDestination: 'project-01'
}

export const approachContent: EngineeringApproachContent = {
  id: 'engineering-approach',
  title: 'Engineering Approach',
  eyebrow: 'PROJECT 01 / DIMENSION',
  contextLabel: 'PROJECT 01',
  parentProject: 'project-01',
  intro:
    'The work is not treated as a straight path from idea to implementation. Understanding comes first, decisions are made under uncertainty, and the result is evaluated against the evidence available.',
  governingPhilosophy:
    'Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity',
  technologyPrinciple:
    'Technology is treated as an instrument that assists engineering work. Human understanding, judgment, responsibility, and verification remain central.',
  sections: [
    {
      heading: 'Methodology & Inquiry',
      body: 'The work is not treated as a straight path from idea to implementation. Understanding comes first, decisions are made under uncertainty, and the result is evaluated against the evidence available.'
    },
    {
      heading: 'Governing Engineering Philosophy',
      body: 'Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity'
    },
    {
      heading: 'Technology as Instrument',
      body: 'Technology is treated as an instrument that assists engineering work. Human understanding, judgment, responsibility, and verification remain central.'
    }
  ],
  actions: {
    primary: {
      label: 'Continue to Deep Engineering',
      to: '/deep-engineering',
      ariaLabel: 'Continue to Deep Engineering'
    },
    secondary: {
      label: 'Back to Project 01',
      to: '/project-01',
      ariaLabel: 'Back to Project 01'
    }
  },
  deeperInspectionDestination: 'deep-engineering',
  returnDestination: 'project-01'
} as const

export default approachContent

