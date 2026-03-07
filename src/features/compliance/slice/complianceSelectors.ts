import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

export const selectBrandColors = (state: RootState) => state.compliance.brandColors;
export const selectProhibitedWords = (state: RootState) => state.compliance.prohibitedWords;
export const selectComplianceIssues = (state: RootState) => state.compliance.issues;
export const selectIsCompliant = (state: RootState): boolean => state.compliance.issues.length === 0;
export const selectAllReports = (state: RootState) => state.compliance.reports;
export const selectComplianceReportEntries = createSelector([selectAllReports], (reports) => Object.values(reports));
