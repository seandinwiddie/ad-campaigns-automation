export interface ComplianceReport {
  productName: string;
  colorCompliance: boolean;
  detectedColors: string[];
  prohibitedWordsFound: string[];
  isCompliant: boolean;
}
