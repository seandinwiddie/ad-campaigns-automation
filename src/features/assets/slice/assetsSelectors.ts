/**
 * Selectors for retrieving asset state and calculating missing dependencies.
 */
import type { RootState } from '@/app/store';

/**
 * Selects the total map of all cached assets.
 */
export const selectAssets = (state: RootState) => state.assets.assets;

/**
 * Retrieves a specific asset record for a given product ID.
 */
export const selectAssetByProductId = (state: RootState, productId: string) => state.assets.assets[productId] ?? null;

/**
 * Selects the array of product IDs that currently have no associated source image.
 */
export const selectMissingAssetProductIds = (state: RootState) => state.assets.missingAssetProductIds;

/**
 * Projects a listing of specific asset metadata records for products that are missing images.
 */
export const selectMissingAssets = (state: RootState) =>
  state.assets.missingAssetProductIds.map((productId) => state.assets.assets[productId]).filter(Boolean);

/**
 * Returns true if all products in the current brief have their assets resolved (either existing or generated).
 */
export const selectAllAssetsResolved = (state: RootState) => state.assets.allAssetsResolved;
