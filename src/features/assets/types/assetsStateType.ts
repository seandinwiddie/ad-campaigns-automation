/**
 * Defines the persisted asset feature state, including cached records and derived readiness flags.
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
