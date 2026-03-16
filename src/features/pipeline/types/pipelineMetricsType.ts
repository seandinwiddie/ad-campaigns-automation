/**
 * Performance metrics generated at the end of a pipeline run.
 * These values summarize the output volume and time-efficiency of a completed run so the
 * results screen can communicate the value produced by the automation workflow.
 *
 * **User Story:**
 * - As a user reviewing completed work, I want summary metrics for time saved and outputs generated
 *   so I can quantify the benefit of running the campaign pipeline.
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
