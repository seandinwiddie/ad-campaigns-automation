import type { Creative } from './creativeType';

/**
 * State of all creative outputs in the application.
 */
export interface CreativeState {
  /** Map of creative IDs (productId_ratio) to their detail records. */
  creatives: Record<string, Creative>;
  /** Total number of successfully completed creatively variants. */
  completedCount: number;
  /** Total number of creative variants requested in the current pipeline. */
  totalCount: number;
  /** Global progress of creative generation (0-100). */
  progressPct: number;
}
