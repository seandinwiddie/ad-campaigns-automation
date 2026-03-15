/**
 * Possible states for a project asset during the resolution workflow.
 */
export type AssetStatus = 
  | 'unresolved'  // Initial state before checking existence
  | 'resolved'    // Found an existing asset to use
  | 'pending'     // Queue for AI generation
  | 'generating'  // Actively communicating with AI provider
  | 'generated'   // Generation complete
  | 'failed';     // Error during resolution or generation
