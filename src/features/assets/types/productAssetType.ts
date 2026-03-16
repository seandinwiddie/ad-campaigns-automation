/**
 * Defines the simplified per-product asset model that the UI consumes in status and results views.
 */
import type { ProductAssetStatus } from './productAssetStatusType';

/**
 * Output representation of a product asset used in the dashboard.
 */
export interface ProductAsset {
  /** The name of the product. */
  productName: string;
  /** Current state of asset resolution or generation. */
  status: ProductAssetStatus;
  /** URL or path to the asset image. */
  imagePath: string | null;
  /** True if the asset was newly created by AI during this session. */
  isGenerated: boolean;
}
