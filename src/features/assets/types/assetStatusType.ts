/**
 * Possible states for a project asset during the resolution workflow.
 * The union models the full state machine from discovery through AI generation so reducers,
 * selectors, and UI code can branch on a constrained set of meaningful lifecycle values.
 *
 * **User Story:**
 * - As a user following campaign progress, I want each product asset to move through clear statuses
 *   so I can understand whether the system found an image, is generating one, or hit an error.
 */
export type AssetStatus = 
  | 'unresolved'  // Initial state before checking existence
  | 'resolved'    // Found an existing asset to use
  | 'pending'     // Queue for AI generation
  | 'generating'  // Actively communicating with AI provider
  | 'generated'   // Generation complete
  | 'failed';     // Error during resolution or generation
