/**
 * The high-level stages of the automation pipeline.
 * This union is the coarse-grained state machine for the entire run, letting the UI and middleware
 * agree on whether the system is validating inputs, preparing assets, creating creatives, or finished.
 *
 * **User Story:**
 * - As a user watching the automation run, I want the pipeline to report a clear top-level stage
 *   so I know whether the system is validating, generating, composing, complete, or failed.
 */
export type PipelineStatus =
  | 'idle'        // Waiting for user to start
  | 'validating'  // Validating the provided brief
  | 'resolving'   // Checking assets or mapping products
  | 'generating'  // Actively generating AI assets
  | 'composing'   // Building final creative layouts
  | 'complete'    // Finished all products successfully or partially
  | 'error';      // Entire pipeline failed
