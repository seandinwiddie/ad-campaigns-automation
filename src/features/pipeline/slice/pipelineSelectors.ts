import type { RootState } from '@/app/store';
import type { ProductStatus } from '@/features/pipeline/types/productStatusType';

export const selectPipelineStatus = (state: RootState) => state.pipeline.status;
export const selectStartTime = (state: RootState) => state.pipeline.startTime;
export const selectProducts = (state: RootState) => state.pipeline.products;
export const selectMetrics = (state: RootState) => state.pipeline.metrics;
export const selectPipelineError = (state: RootState) => state.pipeline.error;
export const selectPipelineErrors = (state: RootState) => state.pipeline.errors;
export const selectCurrentProduct = (state: RootState) => state.pipeline.currentProduct;
export const selectOriginalCampaignMessage = (state: RootState) => state.pipeline.originalCampaignMessage;
export const selectLocalizedCampaignMessage = (state: RootState) => state.pipeline.localizedCampaignMessage;
export const selectTargetLanguage = (state: RootState) => state.pipeline.targetLanguage;
export const selectFailedProducts = (state: RootState) => state.pipeline.failedProducts;
export const selectProgress = (state: RootState): number => state.pipeline.progressPct;
export const selectProductStatuses = (state: RootState): Record<string, ProductStatus> => state.pipeline.productStatuses;
