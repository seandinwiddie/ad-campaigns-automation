/**
 * Results of automated brand safety checks for a single product asset.
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
