/**
 * Approved Text Content: Project 01 (Central Project Context)
 * Governed by:
 * - docs/PROJECT-01.md (Project Definition & Engineering Principle, lines 26-48)
 * - specs/001-project-01-portfolio-experience/spec.md (FR-004, FR-017)
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.3)
 */

export interface ProjectDimensionItem {
  id: 'engineering-approach' | 'engineering-record'
  title: string
  subtitle: string
  description: string
  to: string
  ctaLabel: string
  ariaLabel: string
}

export interface Project01Content {
  id: 'project-01'
  title: string
  subtitle: string
  badge: string
  overview: {
    heading: string
    paragraphs: string[]
  }
  principle: {
    heading: string
    quote: string
    subtext: string
  }
  dimensions: {
    heading: string
    description: string
    items: ProjectDimensionItem[]
  }
  returnDestination: {
    label: string
    to: string
    ariaLabel: string
  }
}

export const project01Content: Project01Content = {
  id: 'project-01',
  title: 'Project 01',
  subtitle: 'Portfolio Experience',
  badge: 'PROJECT 01 / PROFESSIONAL ENGINEERING PORTFOLIO',
  overview: {
    heading: 'The portfolio is itself the first professional engineering project.',
    paragraphs: [
      'It began with a practical uncertainty: how can an engineer provide enough credible evidence of professional engineering capability for another person to reasonably evaluate the work?',
      'Rather than treating the portfolio as a collection of claims and projects, this project develops it as an evidence and evaluation system — where the work, decisions, revisions, verification, and remaining uncertainty can be inspected.'
    ]
  },
  principle: {
    heading: 'Governing Engineering Principle',
    quote: 'Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity',
    subtext: 'Technology is treated as an instrument that assists engineering work. Human understanding, judgment, responsibility, and verification remain central.'
  },
  dimensions: {
    heading: 'Project Dimensions',
    description: 'Explore the core dimensions of Project 01. Each dimension provides direct entry to verified artifacts, decisions, and progressive inspection.',
    items: [
      {
        id: 'engineering-approach',
        title: 'Engineering Approach',
        subtitle: 'Methodology & Inquiry',
        description: 'How the work is understood, advanced, evaluated, and clarified.',
        to: '/approach',
        ctaLabel: 'Inspect Engineering Approach',
        ariaLabel: 'Inspect Engineering Approach'
      },
      {
        id: 'engineering-record',
        title: 'Engineering Record',
        subtitle: 'Decisions & Verifications',
        description: 'What happened, what was decided, what changed, what was verified, and what remains unresolved.',
        to: '/record',
        ctaLabel: 'Inspect Engineering Record',
        ariaLabel: 'Inspect Engineering Record'
      }
    ]
  },
  returnDestination: {
    label: 'Back to Portfolio Orientation',
    to: '/orientation',
    ariaLabel: 'Back to Portfolio Orientation'
  }
} as const

export default project01Content

