import type { RootState } from '@/app/store';

export const selectBrief = (state: RootState) => state.brief.brief;
export const selectIsBriefValid = (state: RootState): boolean => state.brief.isValid;
export const selectValidationErrors = (state: RootState) => state.brief.validationErrors;
export const selectBriefLoading = (state: RootState): boolean => state.brief.loading;
export const selectProducts = (state: RootState) => state.brief.brief?.products ?? [];
