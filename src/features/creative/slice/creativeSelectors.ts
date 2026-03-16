/**
 * Selectors for tracking creative generation progress and mapping state 
 * to UI ViewModels for the gallery view.
 * They expose both the raw creative records and the gallery-oriented projections that group
 * variants by product and compute display-ready card data for results screens.
 *
 * **User Story:**
 * - As a user reviewing generated assets, I want creative selectors to organize outputs by product
 *   and format so the gallery can show progress and results in a way that is easy to scan.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { ASPECT_RATIOS } from '@/features/creative/constants/formatAspectRatios';

/**
 * Selects the total map of all generated creative ad variants.
 */
export const selectCreatives = (state: RootState) => state.creative.creatives;

/**
 * Selects the overall creative generation progress percentage.
 */
export const selectCreativeProgress = (state: RootState) => state.creative.progressPct;

/**
 * Selects the total number of creative variants that have completed processing (success or fail).
 */
export const selectCompletedCount = (state: RootState): number => state.creative.completedCount;

/**
 * Selects the total number of creative variants requested for the current brief.
 */
export const selectTotalCount = (state: RootState): number => state.creative.totalCount;

/**
 * Alias for selecting the entire creatives map.
 */
export const selectAllCreatives = (state: RootState) => state.creative.creatives;

const FORMAT_RATIO_LOOKUP = Object.fromEntries(
  ASPECT_RATIOS.map((format) => [format.ratio, format.width / format.height])
) as Record<string, number>;

export type OutputGalleryCardViewModel = {
  id: string;
  aspectRatio: string;
  ratio: number;
  outputUrl: string | null;
  status: string;
  errorMessage: string;
};

export type OutputGallerySectionViewModel = {
  productName: string;
  variantCount: number;
  creatives: OutputGalleryCardViewModel[];
};

/**
 * Derives the ViewModel for the results gallery.
 * Groups creatives by product and provides formatted data for display cards.
 */
export const selectOutputGallerySections = createSelector(
  [selectAllCreatives],
  (creatives): OutputGallerySectionViewModel[] => {
    const groupedCreatives: Record<string, OutputGalleryCardViewModel[]> = {};

    for (const creative of Object.values(creatives)) {
      if (!groupedCreatives[creative.productId]) {
        groupedCreatives[creative.productId] = [];
      }

      groupedCreatives[creative.productId].push({
        id: creative.id,
        aspectRatio: creative.aspectRatio,
        ratio: FORMAT_RATIO_LOOKUP[creative.aspectRatio] ?? 1,
        outputUrl: creative.outputUrl ?? null,
        status: creative.status,
        errorMessage: creative.error ?? 'Unknown generation error',
      });
    }

    return Object.entries(groupedCreatives).map(([productName, productCreatives]) => ({
      productName,
      variantCount: productCreatives.length,
      creatives: productCreatives,
    }));
  }
);
