import type { PipelineError } from './pipelineErrorType';
import type { PipelineMetrics } from './pipelineMetricsType';
import type { PipelineStatus } from './pipelineStatusType';
import type { ProductProgress } from './productProgressType';
import type { ProductStatus } from './productStatusType';

export interface PipelineState {
  status: PipelineStatus;
  startTime: number | null;
  endTime: number | null;
  products: Record<string, ProductProgress>;
  metrics: PipelineMetrics | null;
  error: string | null;
  errors: PipelineError[];
  currentProduct: string | null;
  progressPct: number;
  failedProducts: string[];
  productStatuses: Record<string, ProductStatus>;
}
