import { configureStore } from '@reduxjs/toolkit';
import creativeReducer, {
  ASPECT_RATIOS,
  getCreativeOutputPath,
} from '../slice/creativeSlice';
import { initCreatives, creativeCompleted, creativePersisted } from '../slice/creativeActions';
import { selectCompletedCount, selectCreativeProgress, selectCreatives, selectTotalCount } from '../slice/creativeSelectors';
import type { CreativeState } from '../types/creativeStateType';

function createTestStore(preloadedState?: { creative: CreativeState }) {
  return configureStore({
    reducer: { creative: creativeReducer },
    preloadedState,
  });
}

const buildProductName = (id: string): string => `product-${id}`;

describe('Story 4: Multi-Format Creative Generation', () => {
  describe('When initCreatives is called with products', () => {
    it('Then creates entries for all 3 aspect ratios per product', () => {
      const store = createTestStore();
      const productIds = ['p1', 'p2'];
      store.dispatch(initCreatives({ productIds }));
      const state = store.getState();
      const creatives = selectCreatives({ creative: state.creative } as any);

      // 2 products x 3 ratios = 6 creatives
      expect(Object.keys(creatives)).toHaveLength(6);

      // Each product should have all 3 aspect ratios
      for (const productId of productIds) {
        for (const ratio of ASPECT_RATIOS) {
          const id = `${productId}_${ratio}`;
          expect(creatives[id]).toBeDefined();
          expect(creatives[id].productId).toBe(productId);
          expect(creatives[id].aspectRatio).toBe(ratio);
          expect(creatives[id].status).toBe('pending');
        }
      }

      expect(selectTotalCount({ creative: state.creative } as any)).toBe(6);
      expect(selectCompletedCount({ creative: state.creative } as any)).toBe(0);
    });
  });

  describe('When creativeCompleted is dispatched', () => {
    it('Then updates status and increments completedCount', () => {
      const store = createTestStore();
      store.dispatch(initCreatives({ productIds: ['p1'] }));
      store.dispatch(creativeCompleted({ id: 'p1_1:1', outputUrl: '/output/p1_1x1.png' }));

      const state = store.getState();
      const creatives = selectCreatives({ creative: state.creative } as any);
      expect(creatives['p1_1:1'].status).toBe('completed');
      expect(creatives['p1_1:1'].outputUrl).toBe('/output/p1_1x1.png');
      expect(selectCompletedCount({ creative: state.creative } as any)).toBe(1);
    });
  });

  describe('When creativePersisted is dispatched without Dropbox persistence', () => {
    it('Then keeps the creative completed and marks it as download-only', () => {
      const store = createTestStore();
      const productName = buildProductName('p1');
      store.dispatch(initCreatives({ productIds: ['p1'] }));
      store.dispatch(
        creativePersisted({
          id: 'p1_1:1',
          productName,
          formatName: '1x1',
          outputUrl: 'data:image/png;base64,test',
          storageMode: 'download',
          storageError: 'Dropbox token not configured. Download this PNG directly from Results.',
          metadata: {
            originalCampaignMessage: 'Stay Green',
            localizedCampaignMessage: 'Stay Green',
            targetRegion: 'United States',
            generatedAtIso: '2026-03-07T00:00:00.000Z',
          },
        })
      );

      const state = store.getState();
      const creatives = selectCreatives({ creative: state.creative } as any);
      expect(creatives['p1_1:1'].status).toBe('completed');
      expect(creatives['p1_1:1'].storageMode).toBe('download');
      expect(creatives['p1_1:1'].storageError).toContain('Download this PNG directly');
      expect(creatives['p1_1:1'].outputPath).toBe(getCreativeOutputPath(productName, '1x1'));
    });
  });

  describe('selectCreativeProgress', () => {
    it('Then returns correct percentage', () => {
      const store = createTestStore();
      store.dispatch(initCreatives({ productIds: ['p1'] }));
      // 0 of 3 = 0%
      expect(selectCreativeProgress({ creative: store.getState().creative } as any)).toBe(0);

      store.dispatch(creativeCompleted({ id: 'p1_1:1' }));
      // 1 of 3 = 33%
      expect(selectCreativeProgress({ creative: store.getState().creative } as any)).toBe(33);

      store.dispatch(creativeCompleted({ id: 'p1_16:9' }));
      // 2 of 3 = 67%
      expect(selectCreativeProgress({ creative: store.getState().creative } as any)).toBe(67);

      store.dispatch(creativeCompleted({ id: 'p1_9:16' }));
      // 3 of 3 = 100%
      expect(selectCreativeProgress({ creative: store.getState().creative } as any)).toBe(100);
    });
  });
});
