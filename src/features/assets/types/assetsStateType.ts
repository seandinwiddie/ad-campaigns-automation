/**
 * Defines the persisted asset feature state, including cached records and derived readiness flags.
 * The state shape stores both the raw asset map and the derived tracking fields that let the
 * workflow know which products still need generation and when the entire asset stage is complete.
 *
 * **User Story:**
 * - As the automation pipeline advances through products, I want the asset feature state to tell me
 *   which products still need images and whether asset resolution is finished for the whole brief.
 */
import type { Asset } from './assetType';

/**
 * Redux state for project-level asset management.
 */
export interface AssetsState {
  /** Map of product IDs to their associated asset records. */
  assets: Record<string, Asset>;
  /** IDs of products that require AI generation. */
  missingAssetProductIds: string[];
  /** True if all products have either an existing or a generated asset. */
  allAssetsResolved: boolean;
}
