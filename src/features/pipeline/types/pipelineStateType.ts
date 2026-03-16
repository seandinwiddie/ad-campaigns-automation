/**
 * Defines the full pipeline state snapshot that powers progress screens, failure reporting, and final metrics.
 */
import type { PipelineError } from './pipelineErrorType';
import type { PipelineMetrics } from './pipelineMetricsType';
import type { PipelineStatus } from './pipelineStatusType';
import type { ProductProgress } from './productProgressType';
import type { ProductStatus } from './productStatusType';

/**
 * Global state for the automation pipeline.
 * Tracks the orchestration of all per-product workflows.
 */
export interface PipelineState {
  /** The high-level lifecycle status of the entire pipeline. */
  status: PipelineStatus;
  /** Timestamp when the pipeline started processing (Unix ms). */
  startTime: number | null;
  /** Timestamp when the pipeline reached a terminal state (Unix ms). */
  endTime: number | null;
  /** Detailed progress tracking for each product ID. */
  products: Record<string, ProductProgress>;
  /** Aggregated performance and business value metrics. */
  metrics: PipelineMetrics | null;
  /** Fatal error message if the entire pipeline crashed. */
  error: string | null;
  /** Collection of individual errors encountered for products. */
  errors: PipelineError[];
  /** The ID of the product currently being processed. */
  currentProduct: string | null;
  /** Overall percentage of completion (0-100). */
  progressPct: number;
  /** List of IDs for products that failed at any stage. */
  failedProducts: string[];
  /** Map of product IDs to their simplified execution status. */
  productStatuses: Record<string, ProductStatus>;
}
