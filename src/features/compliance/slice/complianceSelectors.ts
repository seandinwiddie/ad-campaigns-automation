/**
 * Selectors for evaluating brand safety and compliance report status.
 * They centralize how consumers read the configured guidelines, accumulated issues,
 * and product-level reports so every screen uses the same compliance interpretation.
 *
 * **User Story:**
 * - As a user reviewing compliance results, I want shared selectors for issues and reports so the UI
 *   shows a consistent picture of whether my generated campaign assets passed brand checks.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

/**
 * Selects the master list of brand colors defined in the campaign brief.
 */
export const selectBrandColors = (state: RootState) => state.compliance.brandColors;

/**
 * Selects the blacklist of prohibited terms for copy auditing.
 */
export const selectProhibitedWords = (state: RootState) => state.compliance.prohibitedWords;

/**
 * Selects the flattened list of all brand safety issues found across the campaign.
 */
export const selectComplianceIssues = (state: RootState) => state.compliance.issues;

/**
 * Returns true if no compliance issues have been detected across any generated assets.
 */
export const selectIsCompliant = (state: RootState): boolean => state.compliance.issues.length === 0;

/**
 * Selects the map of brand safety reports indexed by product ID.
 */
export const selectAllReports = (state: RootState) => state.compliance.reports;

/**
 * Projects the map of reports into an array format for use in UI tables.
 */
export const selectComplianceReportEntries = createSelector([selectAllReports], (reports) => Object.values(reports));
