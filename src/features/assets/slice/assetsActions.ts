/**
 * Re-exports asset slice actions so the rest of the app can dispatch asset workflow events from one place.
 */
import { assetsSlice } from './assetsSlice';

/**
 * Exported actions from the assets slice to manage image resolution,
 * tracking generation progress, and resetting the asset state.
 */
export const { resolveAsset, assetGenerating, assetGenerated, assetFailed, resetAssets } = assetsSlice.actions;
