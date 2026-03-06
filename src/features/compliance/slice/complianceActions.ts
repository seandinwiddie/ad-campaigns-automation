import { complianceSlice } from './complianceSlice';

export const {
  setBrandColors,
  setProhibitedWords,
  checkBrandColors,
  checkProhibitedWords,
  clearIssues,
  setBrandGuidelines,
  setComplianceReport,
  reportComplianceForProduct,
  resetCompliance,
} = complianceSlice.actions;
