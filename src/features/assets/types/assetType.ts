/**
 * Defines the normalized asset record that moves through asset resolution and AI generation.
 * It captures the canonical per-product asset shape used internally, including provider output,
 * reusable URLs, workflow status, and any failure reason recorded during processing.
 *
 * **User Story:**
 * - As the pipeline tracks every product image, I want one normalized asset record so existing files,
 *   generated images, and failures can be handled uniformly throughout the app.
 */
import type { AssetStatus } from './assetStatusType';

/**
 * Detailed record for a specific image asset linked to a product.
 */
export interface Asset {
  /** Unique ID of the product this asset represents. */
  productId: string;
  /** Workflow status of the asset. */
  status: AssetStatus;
  /** Existing cloud URL (if found). */
  url?: string;
  /** Base64 string of the newly generated image. */
  imageData?: string;
  /** Error message if processing failed. */
  error?: string;
}
