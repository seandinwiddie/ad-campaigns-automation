/**
 * Results of automated brand safety checks for a single product asset.
 * The report consolidates the scanner findings into a UI-friendly summary so each product can
 * show detected colors, prohibited words, and an overall compliance verdict in one record.
 *
 * **User Story:**
 * - As a campaign reviewer, I want a per-product compliance report so I can see which creative passed,
 *   what colors were detected, and whether any forbidden language was found.
 */
export interface ComplianceReport {
  /** Name of the product analyzed. */
  productName: string;
  /** True if only approved colors were detected (simulated). */
  colorCompliance: boolean;
  /** List of colors identified by the scanner. */
  detectedColors: string[];
  /** Keywords found that violate brand guidelines. */
  prohibitedWordsFound: string[];
  /** Overall pass/fail result based on all rules. */
  isCompliant: boolean;
}
