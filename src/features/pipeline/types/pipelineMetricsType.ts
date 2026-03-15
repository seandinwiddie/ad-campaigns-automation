/**
 * Performance metrics generated at the end of a pipeline run.
 */
export interface PipelineMetrics {
  /** Estimated work time saved in seconds compared to manual creation. */
  timeSavedSeconds: number;
  /** Total number of unique creative variants produced. */
  campaignsGenerated: number;
  /** Calculated efficiency multiplier (e.g., 5.5x faster). */
  efficiencyGain: number;
  /** Number of products successfully processed. */
  successCount: number;
  /** Total number of products present in the original brief. */
  totalProducts: number;
}
