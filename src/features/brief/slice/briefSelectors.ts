import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

export const selectBrief = (state: RootState) => state.brief.brief;
export const selectIsBriefValid = (state: RootState): boolean => state.brief.isValid;
export const selectValidationErrors = (state: RootState) => state.brief.validationErrors;
export const selectBriefLoading = (state: RootState): boolean => state.brief.loading;
export const selectProducts = (state: RootState) => state.brief.brief?.products ?? [];
export const selectProductCount = createSelector([selectProducts], (products) => products.length);
export const selectProductIds = createSelector([selectProducts], (products) =>
  products.map((product) => product.id)
);
export const selectRunPipelineLabel = createSelector(
  [selectIsBriefValid, selectProductCount],
  (isBriefValid, productCount) => (isBriefValid ? `Run Pipeline for ${productCount} Products` : 'Run Pipeline')
);
