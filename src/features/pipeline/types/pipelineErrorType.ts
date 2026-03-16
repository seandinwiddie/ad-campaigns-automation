/**
 * Represents an error encountered for a specific product during a pipeline step.
 * The record preserves which product failed, which stage failed, and the message returned so
 * the app can surface actionable error details without losing workflow context.
 *
 * **User Story:**
 * - As a user troubleshooting a failed campaign run, I want each pipeline error tied to a product and
 *   step so I can tell exactly where the automation broke down.
 */
export interface PipelineError {
  /** The name of the product that failed. */
  productName: string;
  /** The stage of the pipeline where the error occurred (e.g., 'generating'). */
  step: string;
  /** The human-readable error message. */
  message: string;
}
