/**
 * Re-exports asset slice actions so the rest of the app can dispatch asset workflow events from one place.
 * This module keeps the public action surface small and explicit, which lets listeners and screens
 * trigger asset state changes without depending on slice implementation details.
 *
 * **User Story:**
 * - As a developer wiring the pipeline together, I want a single asset-actions entry point so I can
 *   dispatch resolution and generation events consistently without importing the reducer module directly.
 */
import { assetsSlice } from './assetsSlice';

/**
 * Exported actions from the assets slice to manage image resolution,
 * tracking generation progress, and resetting the asset state.
 */
export const { resolveAsset, assetGenerating, assetGenerated, assetFailed, resetAssets } = assetsSlice.actions;
