import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { selectElapsedSeconds } from '@/features/core/ui/slice/uiSelectors';
import type { ProductStatus } from '@/features/pipeline/types/productStatusType';

export const selectPipelineStatus = (state: RootState) => state.pipeline.status;
export const selectStartTime = (state: RootState) => state.pipeline.startTime;
export const selectEndTime = (state: RootState) => state.pipeline.endTime;
export const selectProducts = (state: RootState) => state.pipeline.products;
export const selectMetrics = (state: RootState) => state.pipeline.metrics;
export const selectPipelineError = (state: RootState) => state.pipeline.error;
export const selectPipelineErrors = (state: RootState) => state.pipeline.errors;
export const selectCurrentProduct = (state: RootState) => state.pipeline.currentProduct;
export const selectFailedProducts = (state: RootState) => state.pipeline.failedProducts;
export const selectProgress = (state: RootState): number => state.pipeline.progressPct;
export const selectProductStatuses = (state: RootState): Record<string, ProductStatus> => state.pipeline.productStatuses;

const STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  validating: 'Validating brief...',
  resolving: 'Resolving assets...',
  generating: 'Generating creatives...',
  composing: 'Composing outputs...',
  complete: 'Complete',
  error: 'Error',
};

const PRODUCT_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  pending: 'default',
  in_progress: 'secondary',
  completed: 'default',
  failed: 'destructive',
};

const PRODUCT_BADGE_LABEL: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
};

const formatElapsed = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
};

export type PipelineProductRowViewModel = {
  productName: string;
  statusLabel: string;
  badgeVariant: 'default' | 'secondary' | 'destructive';
};

export type PipelineProgressViewModel = {
  title: string;
  description: string;
  progress: number;
  products: PipelineProductRowViewModel[];
};

export type ResultsMetricsViewModel = {
  timeSavedLabel: string;
  campaignsGenerated: number;
  successSummary: string;
  efficiencyGainLabel: string;
};

export const selectPipelineHasCredentialIssue = createSelector([selectPipelineError], (fatalError) => {
  if (typeof fatalError !== 'string') {
    return false;
  }

  const normalizedError = fatalError.toLowerCase();
  return normalizedError.includes('api key') || normalizedError.includes('dropbox');
});

export const selectPipelineProgressViewModel = createSelector(
  [selectPipelineStatus, selectCurrentProduct, selectProductStatuses, selectElapsedSeconds, selectProgress],
  (status, currentProduct, productStatuses, elapsedSeconds, progress): PipelineProgressViewModel => ({
    title: STATUS_LABELS[status] ?? status,
    description: currentProduct
      ? `Currently processing: ${currentProduct}`
      : `Elapsed: ${formatElapsed(elapsedSeconds)}`,
    progress,
    products: Object.entries(productStatuses).map(([productName, productStatus]) => ({
      productName,
      statusLabel: PRODUCT_BADGE_LABEL[productStatus] ?? productStatus,
      badgeVariant: PRODUCT_BADGE_VARIANT[productStatus] ?? 'default',
    })),
  })
);

export const selectResultsMetricsViewModel = createSelector(
  [selectMetrics],
  (metrics): ResultsMetricsViewModel | null => {
    if (!metrics) {
      return null;
    }

    return {
      timeSavedLabel: formatDuration(metrics.timeSavedSeconds),
      campaignsGenerated: metrics.campaignsGenerated,
      successSummary: `${metrics.successCount} of ${metrics.totalProducts} successfully processed`,
      efficiencyGainLabel: `${metrics.efficiencyGain}x`,
    };
  }
);

export const selectResultsGeneratedAtLabel = createSelector([selectEndTime], (endTime) =>
  endTime ? new Date(endTime).toLocaleTimeString() : null
);
