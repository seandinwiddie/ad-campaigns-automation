/**
 * Defines the creative feature state that tracks every requested variant and aggregate completion metrics.
 * The state stores the full creative job map alongside rollup counters so the app can render both
 * detailed variant status and high-level progress for the creative generation stage.
 *
 * **User Story:**
 * - As a user waiting for creatives to finish, I want the app to track every variant and overall
 *   progress so I can see both per-output status and total completion at a glance.
 */
import type { Creative } from './creativeType';

/**
 * State of all creative outputs in the application.
 */
export interface CreativeState {
  /** Map of creative IDs (productId_ratio) to their detail records. */
  creatives: Record<string, Creative>;
  /** Total number of successfully completed creatively variants. */
  completedCount: number;
  /** Total number of creative variants requested in the current pipeline. */
  totalCount: number;
  /** Global progress of creative generation (0-100). */
  progressPct: number;
}
