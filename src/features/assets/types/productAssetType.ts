/**
 * Defines the simplified per-product asset model that the UI consumes in status and results views.
 * It adapts lower-level asset workflow data into a presentation-friendly shape with a product label,
 * display image path, simplified status, and a flag that distinguishes generated assets from reused ones.
 *
 * **User Story:**
 * - As a user looking at campaign outputs, I want each product card to expose the asset name, status,
 *   image location, and whether it was AI-generated so I can review results without reading raw state.
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
