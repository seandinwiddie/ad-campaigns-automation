/**
 * Status of a single creative variant generation.
 * The union models the lifecycle of an individual variant from queueing through success or failure,
 * allowing reducers and UI components to branch on a fixed set of workflow outcomes.
 *
 * **User Story:**
 * - As a user tracking creative generation, I want each variant to report a clear status so I know
 *   whether it is waiting, in progress, finished, or failed.
 */
export type CreativeStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
