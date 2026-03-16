/**
 * Covers the pipeline slice state machine, per-product progress tracking, and summary metric calculation.
 * The suite documents how the pipeline moves through its major stages, how product-level outcomes are
 * recorded, and how end-of-run metrics are calculated from the completed work.
 *
 * **User Story:**
 * - As a user running the campaign automation pipeline, I want the app to track stage transitions,
 *   per-product outcomes, and final efficiency metrics so I can understand what happened during the run.
 */
import { configureStore } from '@reduxjs/toolkit';
import pipelineReducer, {
} from '../slice/pipelineSlice';
import { startPipeline, advanceStep, productCompleted, productFailed, pipelineComplete, resetPipeline } from '../slice/pipelineActions';
import { selectMetrics, selectPipelineStatus, selectProducts, selectStartTime } from '../slice/pipelineSelectors';
import type { PipelineState } from '../types/pipelineStateType';

function createTestStore(preloadedState?: { pipeline: PipelineState }) {
  return configureStore({
    reducer: { pipeline: pipelineReducer },
    preloadedState,
  });
}

describe('Story 6: Pipeline Progress & Story 8: Error Handling', () => {
  describe('State machine transitions', () => {
    it('Given idle state, transitions: idle -> validating -> resolving -> generating -> composing -> complete', () => {
      const store = createTestStore();
      expect(selectPipelineStatus({ pipeline: store.getState().pipeline } as any)).toBe('idle');

      store.dispatch(startPipeline({ productIds: ['p1', 'p2'] }));
      expect(selectPipelineStatus({ pipeline: store.getState().pipeline } as any)).toBe('validating');

      store.dispatch(advanceStep());
      expect(selectPipelineStatus({ pipeline: store.getState().pipeline } as any)).toBe('resolving');

      store.dispatch(advanceStep());
      expect(selectPipelineStatus({ pipeline: store.getState().pipeline } as any)).toBe('generating');

      store.dispatch(advanceStep());
      expect(selectPipelineStatus({ pipeline: store.getState().pipeline } as any)).toBe('composing');

      store.dispatch(advanceStep());
      expect(selectPipelineStatus({ pipeline: store.getState().pipeline } as any)).toBe('complete');
    });
  });

  describe('When startPipeline is dispatched', () => {
    it('Then status is validating and startTime is set', () => {
      const store = createTestStore();
      const before = Date.now();
      store.dispatch(startPipeline({ productIds: ['p1'] }));
      const state = store.getState();
      expect(selectPipelineStatus({ pipeline: state.pipeline } as any)).toBe('validating');
      const startTime = selectStartTime({ pipeline: state.pipeline } as any);
      expect(startTime).toBeGreaterThanOrEqual(before);
      expect(startTime).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('When productCompleted is dispatched', () => {
    it('Then updates per-product status to completed', () => {
      const store = createTestStore();
      store.dispatch(startPipeline({ productIds: ['p1', 'p2'] }));
      store.dispatch(productCompleted({ productId: 'p1' }));
      const products = selectProducts({ pipeline: store.getState().pipeline } as any);
      expect(products['p1'].status).toBe('completed');
      expect(products['p2'].status).toBe('pending');
    });
  });

  describe('When productFailed is dispatched', () => {
    it('Then marks product as failed with error, others continue', () => {
      const store = createTestStore();
      store.dispatch(startPipeline({ productIds: ['p1', 'p2'] }));
      store.dispatch(productFailed({ productId: 'p1', error: 'Generation failed' }));
      const products = selectProducts({ pipeline: store.getState().pipeline } as any);
      expect(products['p1'].status).toBe('failed');
      expect(products['p1'].error).toBe('Generation failed');
      // Other products remain unaffected
      expect(products['p2'].status).toBe('pending');
    });
  });

  describe('When pipelineComplete is dispatched', () => {
    it('Then calculates metrics (timeSaved, campaignsGenerated, efficiencyGain)', () => {
      const store = createTestStore();
      store.dispatch(startPipeline({ productIds: ['p1', 'p2'] }));
      store.dispatch(
        pipelineComplete({
          successCount: 2,
          totalProducts: 2,
          elapsedSeconds: 120,
        })
      );
      const state = store.getState();
      expect(selectPipelineStatus({ pipeline: state.pipeline } as any)).toBe('complete');
      const storedMetrics = selectMetrics({ pipeline: state.pipeline } as any);
      expect(storedMetrics).not.toBeNull();
      expect(storedMetrics!.timeSavedSeconds).toBeGreaterThan(0);
      expect(storedMetrics!.campaignsGenerated).toBe(6);
      expect(storedMetrics!.efficiencyGain).toBeGreaterThan(0);
      expect(storedMetrics!.successCount).toBe(2);
      expect(storedMetrics!.totalProducts).toBe(2);
    });
  });

  describe('When resetPipeline is dispatched', () => {
    it('Then returns to idle state', () => {
      const store = createTestStore();
      store.dispatch(startPipeline({ productIds: ['p1'] }));
      store.dispatch(advanceStep());
      store.dispatch(resetPipeline());
      const state = store.getState();
      expect(selectPipelineStatus({ pipeline: state.pipeline } as any)).toBe('idle');
      expect(selectStartTime({ pipeline: state.pipeline } as any)).toBeNull();
      expect(selectMetrics({ pipeline: state.pipeline } as any)).toBeNull();
      expect(Object.keys(selectProducts({ pipeline: state.pipeline } as any))).toHaveLength(0);
    });
  });
});
