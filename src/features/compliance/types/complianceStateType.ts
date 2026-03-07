import type { ComplianceIssue } from './complianceIssueType';
import type { ComplianceReport } from './complianceReportType';

export interface ComplianceState {
  brandColors: string[];
  prohibitedWords: string[];
  issues: ComplianceIssue[];
  reports: Record<string, ComplianceReport>;
}
