/**
 * Selectors for accessing campaign brief data and validation status.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

/**
 * Selects the parsed campaign brief object.
 */
export const selectBrief = (state: RootState) => state.brief.brief;

/**
 * Returns true if the current brief has passed all structural and schema validation.
 */
export const selectIsBriefValid = (state: RootState): boolean => state.brief.isValid;

/**
 * Selects the list of specific validation errors found in the current brief.
 */
export const selectValidationErrors = (state: RootState) => state.brief.validationErrors;

/**
 * Returns true if the brief is currently being parsed or validated.
 */
export const selectBriefLoading = (state: RootState): boolean => state.brief.loading;

/**
 * Selects the array of products defined within the campaign brief.
 */
export const selectProducts = (state: RootState) => state.brief.brief?.products ?? [];

/**
 * Selects the number of products in the current brief.
 */
export const selectProductCount = createSelector([selectProducts], (products) => products.length);

/**
 * Selects an array of IDs for all products in the brief.
 */
export const selectProductIds = createSelector([selectProducts], (products) =>
  products.map((product) => product.id)
);

/**
 * Derives a human-readable label for the "Run Pipeline" button based on validation and product count.
 */
export const selectRunPipelineLabel = createSelector(
  [selectIsBriefValid, selectProductCount],
  (isBriefValid, productCount) => (isBriefValid ? `Run Pipeline for ${productCount} Products` : 'Run Pipeline')
);
