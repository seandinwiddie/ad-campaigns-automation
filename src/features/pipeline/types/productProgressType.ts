/**
 * Defines the smallest per-product progress record the pipeline needs to render status and recover from failures.
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
