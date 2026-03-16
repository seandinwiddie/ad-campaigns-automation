/**
 * Selectors and view-model mappers that translate raw pipeline state into progress and results UI data.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { selectElapsedSeconds } from '@/features/core/ui/slice/uiSelectors';
import type { ProductStatus } from '@/features/pipeline/types/productStatusType';

/**
 * Selectors for the pipeline state.
 */

/**
 * Selects the high-level life-cycle status of the pipeline (e.g. idle, generating, complete).
 */
export const selectPipelineStatus = (state: RootState) => state.pipeline.status;

/**
 * Selects the timestamp (Unix ms) when the pipeline started.
 */
export const selectStartTime = (state: RootState) => state.pipeline.startTime;

/**
 * Selects the timestamp (Unix ms) when the pipeline finished or errored.
 */
export const selectEndTime = (state: RootState) => state.pipeline.endTime;

/**
 * Selects the map of product progress records.
 */
export const selectProducts = (state: RootState) => state.pipeline.products;

/**
 * Selects the aggregate performance and business metrics.
 */
export const selectMetrics = (state: RootState) => state.pipeline.metrics;

/**
 * Selects the fatal pipeline error message, if any.
 */
export const selectPipelineError = (state: RootState) => state.pipeline.error;

/**
 * Selects all warning or product-specific errors encountered during the run.
 */
export const selectPipelineErrors = (state: RootState) => state.pipeline.errors;

/**
 * Selects the ID of the product currently under generation or composition.
 */
export const selectCurrentProduct = (state: RootState) => state.pipeline.currentProduct;

/**
 * Selects a list of product IDs that encountered errors.
 */
export const selectFailedProducts = (state: RootState) => state.pipeline.failedProducts;

/**
 * Selects the overall pipeline completion percentage (0-100).
 */
export const selectProgress = (state: RootState): number => state.pipeline.progressPct;

/**
 * Selects simplified status keywords for all products.
 */
export const selectProductStatuses = (state: RootState): Record<string, ProductStatus> => state.pipeline.productStatuses;

/**
 * Presentation copy for the high-level pipeline status banner.
 */
const STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  validating: 'Validating brief...',
  resolving: 'Resolving assets...',
  generating: 'Generating creatives...',
  composing: 'Composing outputs...',
  complete: 'Complete',
  error: 'Error',
};

/**
 * Badge metadata keeps row rendering logic out of the progress screen components.
 */
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

/**
 * Shared duration formatters keep elapsed-time output consistent across progress and results screens.
 */
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

/**
 * ViewModel for a single product row in the pipeline progress display.
 */
export type PipelineProductRowViewModel = {
  productName: string;
  statusLabel: string;
  badgeVariant: 'default' | 'secondary' | 'destructive';
};

/**
 * ViewModel for the overall pipeline progress display.
 */
export type PipelineProgressViewModel = {
  title: string;
  description: string;
  progress: number;
  products: PipelineProductRowViewModel[];
};

/**
 * ViewModel for the performance metrics displayed in the results screen.
 */
export type ResultsMetricsViewModel = {
  timeSavedLabel: string;
  campaignsGenerated: number;
  successSummary: string;
  efficiencyGainLabel: string;
};

/**
 * Checks if a pipeline error is likely due to a credential issue (API key or Dropbox).
 */
export const selectPipelineHasCredentialIssue = createSelector([selectPipelineError], (fatalError) => {
  if (typeof fatalError !== 'string') {
    return false;
  }

  const normalizedError = fatalError.toLowerCase();
  return normalizedError.includes('api key') || normalizedError.includes('dropbox');
});

/**
 * Derives the ViewModel for the PipelineScreen's progress display.
 * Includes formatted step titles, descriptions, and product-specific statuses.
 */
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

/**
 * Derives the ViewModel for the ResultsScreen's metrics display.
 * Calculates formatted labels for time saved and efficiency gains.
 */
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

/**
 * Returns a formatted string representing when the results were generated.
 * Returns null if the pipeline has not completed.
 */
export const selectResultsGeneratedAtLabel = createSelector([selectEndTime], (endTime) =>
  endTime ? new Date(endTime).toLocaleTimeString() : null
);
