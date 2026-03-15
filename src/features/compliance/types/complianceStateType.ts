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
