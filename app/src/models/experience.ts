/**
 * Core Domain Models: Experience & Navigation State
 * Governed by:
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.1 - 2.5)
 * - specs/001-project-01-portfolio-experience/tasks.md (Task T007)
 * - specs/001-project-01-portfolio-experience/spec.md (FR-002 - FR-010)
 */

/**
 * The five canonical locations across the accepted Project 01 portfolio experience.
 * Zero invented or unapproved destinations permitted.
 */
export type ExperienceLocation =
  | 'orientation'          // Portfolio Orientation (Entry / Context)
  | 'project-01'           // Project 01 (Central Project Context)
  | 'engineering-approach' // Engineering Approach (Dimension of Project 01)
  | 'engineering-record'   // Engineering Record (Dimension of Project 01)
  | 'deep-engineering'     // Deep Engineering (Deeper Inspection Level)
  | 'about'                // About (Professional Narrative)

/**
 * The four progressive inspection depth levels.
 * Enforces the progressive depth hierarchy (Entry -> Context -> Dimension -> Deeper).
 */
export type InspectionDepth =
  | 'entry'             // Depth Level 0: Context
  | 'project-context'   // Depth Level 1: Central Project
  | 'dimension'         // Depth Level 2: Approach / Record
  | 'deeper-inspection' // Depth Level 3: Deep Engineering

/**
 * Active navigation and traversal context state.
 * Enforces return-path availability and forward traversal possibilities.
 */
export interface ExperienceState {
  currentLocation: ExperienceLocation
  currentDepth: InspectionDepth
  historyStack: ExperienceLocation[]
  canReturnToProject01: boolean
  canReturnToOrientation: boolean
  availableForwardPaths: ExperienceLocation[]
}

/**
 * Domain entity representing the Portfolio Orientation entry state.
 */
export interface PortfolioOrientation {
  id: 'orientation'
  title: string            // "Portfolio Orientation"
  subtitle: string         // "Desktop / Entry Context"
  description: string      // Approved orientation narrative
  entryDestination: 'project-01'
  metadata: {
    role: string
    stage: string
  }
}

/**
 * Domain entity representing the central Project 01 context.
 */
export interface Project01 {
  id: 'project-01'
  title: string            // "Project 01"
  subtitle: string         // "Portfolio Experience"
  overview: string         // Approved Project 01 summary
  dimensions: {
    approachId: 'engineering-approach'
    recordId: 'engineering-record'
  }
  returnDestination: 'orientation'
}

/**
 * Domain entity representing the Engineering Approach dimension.
 */
export interface EngineeringApproach {
  id: 'engineering-approach'
  title: string            // "Engineering Approach"
  parentProject: 'project-01'
  governingPhilosophy: string // "Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity"
  sections: Array<{
    heading: string
    body: string
  }>
  deeperInspectionDestination: 'deep-engineering'
  returnDestination: 'project-01'
}

/**
 * An individual decision entry in the chronological Engineering Record.
 */
export interface DecisionRecord {
  id: string
  timestamp?: string
  topic: string
  problem: string
  decision: string
  revisionHistory?: string[]
  status: 'decided' | 'revised' | 'unresolved'
}

/**
 * Domain entity representing the Engineering Record dimension.
 */
export interface EngineeringRecord {
  id: 'engineering-record'
  title: string            // "Engineering Record"
  parentProject: 'project-01'
  chronologicalEntries: DecisionRecord[]
  visibleUncertainties: Array<{
    topic: string
    description: string
    status: 'unresolved'
  }>
  deeperInspectionDestination: 'deep-engineering'
  returnDestination: 'project-01'
}

/**
 * An atomic, traceable unit in the Evidence & Evaluation System.
 * Governed by specs/001-project-01-portfolio-experience/data-model.md (Section 2.7)
 */
export interface EvidenceItem {
  id: string
  problem: string
  requirement: string
  decision: string
  technicalWork: string
  evidence: string
  verification: string
  outcome: string
  reflection: string
  growth: string
  uncertainty?: string
}

/**
 * Domain entity representing the Deep Engineering deeper-inspection level.
 * Governed by specs/001-project-01-portfolio-experience/data-model.md (Section 2.6)
 */
export interface DeepEngineering {
  id: 'deep-engineering'
  title: string
  parentProject: 'project-01'
  subtitle: string
  caseStudy: {
    title: string
    overview: string
    evidenceItems: EvidenceItem[]
  }
  returnDestination: 'project-01'
}

