/**
 * Detailed description of a brand safety violation.
 */
export interface ComplianceIssue {
  /** The category of the violation. */
  type: 'brand_color' | 'prohibited_word';
  /** Human-readable explanation of the issue. */
  detail: string;
}
