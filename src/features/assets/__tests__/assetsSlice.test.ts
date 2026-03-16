/**
 * Covers the asset slice flow so existing images, missing assets, and generated outputs stay in sync.
 * Each scenario documents a distinct branch of the asset lifecycle: reusing a known image,
 * flagging a product for generation, and storing a finished AI result back into state.
 *
 * **User Story:**
 * - As a marketer preparing a campaign, I want each product to clearly show whether its source image
 *   was found, still needs generation, or has already been created so the pipeline can proceed reliably.
 */
import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from '../slice/assetsSlice';
import { resolveAsset, assetGenerated } from '../slice/assetsActions';
import { selectAssets, selectMissingAssets } from '../slice/assetsSelectors';
import type { AssetsState } from '../types/assetsStateType';

function createTestStore(preloadedState?: { assets: AssetsState }) {
  return configureStore({
    reducer: { assets: assetsReducer },
    preloadedState,
  });
}

describe('Story 3: Asset Resolution', () => {
  describe('Given product with existing asset', () => {
    it('Then resolveAsset marks as resolved with no generation needed', () => {
      const store = createTestStore();
      store.dispatch(resolveAsset({ productId: 'p1', url: 'https://cdn.example.com/bottle.png' }));
      const state = store.getState();
      const assets = selectAssets({ assets: state.assets } as any);
      expect(assets['p1'].status).toBe('resolved');
      expect(assets['p1'].url).toBe('https://cdn.example.com/bottle.png');
      const missing = selectMissingAssets({ assets: state.assets } as any);
      expect(missing).toHaveLength(0);
    });
  });

  describe('Given product without asset', () => {
    it('Then resolveAsset marks as pending and selectMissingAssets includes it', () => {
      const store = createTestStore();
      store.dispatch(resolveAsset({ productId: 'p2' }));
      const state = store.getState();
      const assets = selectAssets({ assets: state.assets } as any);
      expect(assets['p2'].status).toBe('pending');
      const missing = selectMissingAssets({ assets: state.assets } as any);
      expect(missing).toHaveLength(1);
      expect(missing[0].productId).toBe('p2');
    });
  });

  describe('When assetGenerated is dispatched', () => {
    it('Then asset status is generated and image data is stored', () => {
      const store = createTestStore();
      store.dispatch(resolveAsset({ productId: 'p3' }));
      store.dispatch(assetGenerated({ productId: 'p3', imageData: 'base64-image-data' }));
      const state = store.getState();
      const assets = selectAssets({ assets: state.assets } as any);
      expect(assets['p3'].status).toBe('generated');
      expect(assets['p3'].imageData).toBe('base64-image-data');
    });
  });
});
