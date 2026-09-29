/**
 * Verification Domain Models: V1–V10 Quality Evaluation Framework
 * Governed by:
 * - specs/001-project-01-portfolio-experience/data-model.md (Section 2.8)
 * - specs/001-project-01-portfolio-experience/tasks.md (Task T008)
 * - docs/STAGE-08-ENGINEERING-IMPLEMENTATION.md (Section 6)
 */

/**
 * The 10 constitutional verification categories defined in STAGE-08 Section 6.
 */
export type VerificationCategory =
  | 'V1_FUNCTIONAL'
  | 'V2_EXPERIENCE_BEHAVIORAL'
  | 'V3_VISUAL_DESIGN_FIDELITY'
  | 'V4_RESPONSIVE'
  | 'V5_ACCESSIBILITY'
  | 'V6_PERFORMANCE'
  | 'V7_SECURITY'
  | 'V8_COMPATIBILITY'
  | 'V9_CONTENT_EVIDENCE_INTEGRITY'
  | 'V10_BUILD_DEPLOYMENT'

/**
 * Standardized status for any verification assessment item.
 */
export type VerificationStatus =
  | 'verified'
  | 'partially_verified'
  | 'not_verified'
  | 'not_applicable'

/**
 * An individual verifiable criterion evaluated within a verification category.
 */
export interface VerificationCheck {
  id: string
  category: VerificationCategory
  name: string
  criterion: string
  status: VerificationStatus
  evidenceRef: string
  notes?: string
}

/**
 * Structured summary for a specific verification category.
 */
export interface VerificationCategorySummary {
  category: VerificationCategory
  label: string
  checks: VerificationCheck[]
  summaryStatus: VerificationStatus
}

/**
 * Complete evaluation record capturing the status of all V1–V10 categories.
 */
export interface VerificationRecord {
  id: string
  timestamp: string
  evaluator?: string
  categories: Record<VerificationCategory, VerificationCategorySummary>
}
