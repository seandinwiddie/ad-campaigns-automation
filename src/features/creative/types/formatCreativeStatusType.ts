/**
 * Status of the per-format creative composition workflow.
 * This narrows composition outcomes for UI-facing output records so each rendered format
 * can report whether it is still composing, has completed, or has failed.
 *
 * **User Story:**
 * - As a user reviewing an individual creative format, I want a clear per-format status so I know
 *   whether that specific output is still being composed, finished, or needs attention.
 */
export type FormatCreativeStatus = 'pending' | 'composing' | 'completed' | 'failed';
