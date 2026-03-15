import { assetsSlice } from './assetsSlice';

/**
 * Exported actions from the assets slice to manage image resolution,
 * tracking generation progress, and resetting the asset state.
 */
export const { resolveAsset, assetGenerating, assetGenerated, assetFailed, resetAssets } = assetsSlice.actions;
