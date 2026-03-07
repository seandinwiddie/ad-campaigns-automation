import type { Asset } from './assetType';

export interface AssetsState {
  assets: Record<string, Asset>;
  missingAssetProductIds: string[];
  allAssetsResolved: boolean;
}
