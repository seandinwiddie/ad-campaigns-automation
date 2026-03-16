/**
 * Simplified execution status for product assets in the UI.
 * This trims the richer internal asset workflow into a compact set of statuses that results
 * screens and status tables can display without exposing reducer-specific implementation details.
 *
 * **User Story:**
 * - As a user reviewing product results, I want each asset to show a concise status label so I can
 *   scan quickly and see which products are ready, still running, or failed.
 */
export type ProductAssetStatus = 'pending' | 'resolved' | 'generating' | 'generated' | 'failed';
