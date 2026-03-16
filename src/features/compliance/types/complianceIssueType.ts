/**
 * Detailed description of a brand safety violation.
 * Each issue represents a concrete rule breach discovered during compliance checks so
 * the app can surface exactly what failed and why for a generated campaign asset.
 *
 * **User Story:**
 * - As a user investigating a compliance failure, I want each issue to describe the type of violation
 *   and the specific problem so I know what needs to be corrected.
 */
export interface ComplianceIssue {
  /** The category of the violation. */
  type: 'brand_color' | 'prohibited_word';
  /** Human-readable explanation of the issue. */
  detail: string;
}
