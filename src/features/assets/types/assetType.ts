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
