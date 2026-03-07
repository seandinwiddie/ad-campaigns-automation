import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { ASPECT_RATIOS } from '@/features/creative/constants/formatAspectRatios';

export const selectCreatives = (state: RootState) => state.creative.creatives;
export const selectCreativeProgress = (state: RootState) => state.creative.progressPct;
export const selectCompletedCount = (state: RootState): number => state.creative.completedCount;
export const selectTotalCount = (state: RootState): number => state.creative.totalCount;
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
