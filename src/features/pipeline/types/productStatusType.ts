/**
 * The execution status of a single product within the automation pipeline.
 * The union keeps per-product workflow reporting constrained to the statuses that matter for
 * progress displays, retry logic, and end-of-run summaries.
 *
 * **User Story:**
 * - As a user scanning product progress, I want each product to have a simple status label so I can
 *   tell whether it is waiting, being processed, completed, or failed.
 */
export type ProductStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
