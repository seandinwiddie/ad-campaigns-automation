export interface ComplianceIssue {
  type: 'brand_color' | 'prohibited_word';
  detail: string;
}
