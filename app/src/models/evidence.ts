/**
 * Evidence Domain Models: 9-Part Traceability Chain & Deep Engineering
 * Governed by:
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.6 - 2.7)
 * - specs/001-project-01-portfolio-experience/tasks.md (Task T008)
 * - specs/001-project-01-portfolio-experience/contracts/ui-contracts.md (Section 5)
 */

/**
 * Atomic traceable evidence item embodying the 9-part relationship chain:
 * Problem → Requirement → Decision → Technical Work → Evidence → Verification → Outcome → Reflection → Growth
 * Plus optional explicit visible uncertainty.
 */
export interface EvidenceItem {
  id: string                    // e.g. "EVID-DF-01"
  problem: string               // What concrete engineering problem was encountered
  requirement: string           // Traceable requirement satisfied
  decision: string              // Engineering decision taken
  technicalWork: string         // Concrete technical work performed
  evidence: string              // Verifiable artifact or record
  verification: string          // Method and criteria used to verify
  outcome: string               // Observed empirical result (never an unsupported claim)
  reflection: string            // Engineering reflection on the approach
  growth: string                // Competency, architectural, or process improvement
  uncertainty?: string          // Explicit visible open questions (if any)
}

/**
 * Domain entity representing the Deep Engineering inspection level.
 * Governed by data-model.md Section 2.6.
 * Invariant: Must return strictly to 'project-01'.
 */
export interface DeepEngineering {
  id: 'deep-engineering'
  title: string                 // "Deep Engineering"
  parentProject: 'project-01'
  subtitle: string              // e.g. "Design Foundations"
  caseStudy: {
    title: string               // "Design Foundations Verification"
    overview: string
    evidenceItems: EvidenceItem[]
  }
  returnDestination: 'project-01' // Strict contextual return to central project
}
