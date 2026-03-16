/**
 * Defines the compliance feature state for guideline inputs, detected issues, and per-product reports.
 * It stores both the rules loaded from the brief and the outputs of automated checks, allowing
 * the pipeline and results screens to reason about campaign-wide compliance from one source of truth.
 *
 * **User Story:**
 * - As the app evaluates brand safety, I want the compliance state to keep guidelines, issues,
 *   and product reports together so every part of the workflow can access the current audit results.
 */
import type { ComplianceIssue } from './complianceIssueType';
import type { ComplianceReport } from './complianceReportType';

/**
 * State for tracking brand safety and guideline adherence across all assets.
 */
export interface ComplianceState {
  /** The master list of hex codes to check against. */
  brandColors: string[];
  /** The master blacklist of prohibited terminology. */
  prohibitedWords: string[];
  /** Flattened list of all detected issues across the campaign. */
  issues: ComplianceIssue[];
  /** Map of product IDs to their individual compliance reports. */
  reports: Record<string, ComplianceReport>;
}
