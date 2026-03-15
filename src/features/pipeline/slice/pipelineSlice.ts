import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PipelineState } from '@/features/pipeline/types/pipelineStateType';
import type { PipelineStatus } from '@/features/pipeline/types/pipelineStatusType';
import type { ProductStatus } from '@/features/pipeline/types/productStatusType';

const initialState: PipelineState = {
  status: 'idle',
  startTime: null,
  endTime: null,
  products: {},
  metrics: null,
  error: null,
  errors: [],
  currentProduct: null,
  progressPct: 0,
  failedProducts: [],
  productStatuses: {},
};

const STEP_ORDER: PipelineStatus[] = [
  'idle',
  'validating',
  'resolving',
  'generating',
  'composing',
  'complete',
];

const recalculateProgress = (state: PipelineState): void => {
  const entries = Object.values(state.products);
  if (entries.length === 0) {
    state.progressPct = 0;
    state.failedProducts = [];
    state.productStatuses = {};
    return;
  }

  const completed = entries.filter((p) => p.status === 'completed' || p.status === 'failed').length;
  state.progressPct = Math.round((completed / entries.length) * 100);
  state.failedProducts = entries.filter((product) => product.status === 'failed').map((product) => product.productId);
  const statuses: Record<string, ProductStatus> = {};
  for (const entry of entries) {
    statuses[entry.productId] = entry.status;
  }
  state.productStatuses = statuses;
};

/**
 * The pipeline slice manages the state of the campaign generation pipeline.
 * It tracks the overall status, progress of individual products, and performance metrics.
 * 
 * **User Story Context:**
 * - As a marketer, I want to see the real-time progress of my campaign generation.
 * - As a user, I want to be notified of any product failures during the pipeline.
 * - As a manager, I want to see the time saved and efficiency gains from the automated pipeline.
 */
export const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState,
  reducers: {
    /**
     * Starts the pipeline for a set of product IDs.
     * Resets previous metrics and initializes product statuses to 'pending'.
     */
    startPipeline(state, action: PayloadAction<{ productIds: string[] }>) {
      state.status = 'validating';
      state.startTime = Date.now();
      state.endTime = null;
      state.metrics = null;
      state.error = null;
      state.errors = [];
      state.currentProduct = null;
      state.products = {};
      for (const id of action.payload.productIds) {
        state.products[id] = { productId: id, status: 'pending' };
      }
      recalculateProgress(state);
    },
    /**
     * Advances the pipeline to the next predefined step in STEP_ORDER.
     */
    advanceStep(state) {
      const currentIndex = STEP_ORDER.indexOf(state.status);
      if (currentIndex >= 0 && currentIndex < STEP_ORDER.length - 1) {
        state.status = STEP_ORDER[currentIndex + 1];
      }
    },
    /**
     * Manually sets the pipeline status.
     */
    setPipelineStatus(state, action: PayloadAction<PipelineStatus>) {
      state.status = action.payload;
    },
    /**
     * Marks a specific product as successfully completed.
     */
    productCompleted(state, action: PayloadAction<{ productId: string }>) {
      const { productId } = action.payload;
      if (state.products[productId]) {
        state.products[productId].status = 'completed';
      }
      recalculateProgress(state);
    },
    /**
     * Marks a specific product as failed and records the error message.
     */
    productFailed(state, action: PayloadAction<{ productId: string; error: string }>) {
      const { productId, error } = action.payload;
      if (state.products[productId]) {
        state.products[productId].status = 'failed';
        state.products[productId].error = error;
      }
      state.errors.push({
        productName: productId,
        step: 'processing',
        message: error,
      });
      recalculateProgress(state);
    },
    /**
     * Finalizes the pipeline, calculating metrics like time saved and efficiency gains.
     * 
     * @example
     * pipelineComplete({ successCount: 10, totalProducts: 10, elapsedSeconds: 300 })
     */
    pipelineComplete(
      state,
      action: PayloadAction<{ successCount: number; totalProducts: number; elapsedSeconds: number }>
    ) {
      const { successCount, totalProducts, elapsedSeconds } = action.payload;
      const estimatedManualSecondsPerProduct = 45 * 60;
      const manualTotalSeconds = totalProducts * estimatedManualSecondsPerProduct;
      const timeSavedSeconds = Math.max(0, manualTotalSeconds - elapsedSeconds);
      const efficiencyGain = elapsedSeconds > 0 ? Number((manualTotalSeconds / elapsedSeconds).toFixed(2)) : 0;

      state.status = 'complete';
      state.endTime = Date.now();
      state.metrics = {
        timeSavedSeconds,
        campaignsGenerated: successCount * 3,
        efficiencyGain,
        successCount,
        totalProducts,
      };
      state.currentProduct = null;
      recalculateProgress(state);
    },
    /**
     * Sets a global fatal error for the pipeline.
     */
    pipelineFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    /**
     * Sets a global error and transitions status to 'error'.
     */
    pipelineError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'error';
      state.currentProduct = null;
    },
    /**
     * Sets the product currently being processed.
     */
    setCurrentProduct(state, action: PayloadAction<string>) {
      state.currentProduct = action.payload;
      if (state.products[action.payload]) {
        state.products[action.payload].status = 'in_progress';
      }
      recalculateProgress(state);
    },
    /**
     * Resets the entire pipeline state to initial values.
     */
    resetPipeline(state) {
      Object.assign(state, initialState);
    },
  },
});

/**
 * Redux action creators for the pipeline slice.
 */
export const {
  startPipeline,
  advanceStep,
  setPipelineStatus,
  productCompleted,
  productFailed,
  pipelineComplete,
  pipelineFailed,
  pipelineError,
  setCurrentProduct,
  resetPipeline,
} = pipelineSlice.actions;

export default pipelineSlice.reducer;
