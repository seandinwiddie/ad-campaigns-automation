/**
 * Represents an error encountered for a specific product during a pipeline step.
 */
export interface PipelineError {
  /** The name of the product that failed. */
  productName: string;
  /** The stage of the pipeline where the error occurred (e.g., 'generating'). */
  step: string;
  /** The human-readable error message. */
  message: string;
}
