/**
 * The high-level stages of the automation pipeline.
 */
export type PipelineStatus =
  | 'idle'        // Waiting for user to start
  | 'validating'  // Validating the provided brief
  | 'resolving'   // Checking assets or mapping products
  | 'generating'  // Actively generating AI assets
  | 'composing'   // Building final creative layouts
  | 'complete'    // Finished all products successfully or partially
  | 'error';      // Entire pipeline failed
