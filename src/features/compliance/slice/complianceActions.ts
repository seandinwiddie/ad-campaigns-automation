import { complianceSlice } from './complianceSlice';

/**
 * Exported actions from the compliance slice for managing brand guidelines,
 * triggering automated checks, and reporting results.
 */
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
