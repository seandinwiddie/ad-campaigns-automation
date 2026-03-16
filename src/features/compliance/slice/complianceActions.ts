/**
 * Re-exports compliance actions so the pipeline can apply guidelines and record audit results centrally.
 * This gives the rest of the application a stable action module for loading brand rules,
 * triggering audits, and storing compliance reports without coupling to slice construction.
 *
 * **User Story:**
 * - As a developer integrating compliance checks into the pipeline, I want one place to import
 *   compliance actions so I can apply guidelines and record audit outcomes consistently.
 */
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
