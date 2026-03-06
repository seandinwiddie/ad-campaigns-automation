import type { RootState } from '@/app/store';

export const selectAssets = (state: RootState) => state.assets.assets;
export const selectAssetByProductId = (state: RootState, productId: string) => state.assets.assets[productId] ?? null;
export const selectMissingAssetProductIds = (state: RootState) => state.assets.missingAssetProductIds;
export const selectMissingAssets = (state: RootState) =>
  state.assets.missingAssetProductIds.map((productId) => state.assets.assets[productId]).filter(Boolean);
export const selectAllAssetsResolved = (state: RootState) => state.assets.allAssetsResolved;
