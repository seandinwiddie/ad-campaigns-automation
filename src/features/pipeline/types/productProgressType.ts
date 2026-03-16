/**
 * Defines the smallest per-product progress record the pipeline needs to render status and recover from failures.
 * Each record isolates the current state of one product inside the larger run so the pipeline can
 * update items independently and the UI can show which products are pending, active, complete, or failed.
 *
 * **User Story:**
 * - As a user reviewing run progress, I want each product to have its own tracked progress record
 *   so I can see which items are done and which ones still need attention.
 */
import type { ProductStatus } from './productStatusType';

/**
 * Tracks the detailed progress and potential error for a specific product.
 */
export interface ProductProgress {
  /** Unique identifier for the product. */
  productId: string;
  /** Current status of this product's generation workflow. */
  status: ProductStatus;
  /** Optional error message if the status is 'failed'. */
  error?: string;
}
