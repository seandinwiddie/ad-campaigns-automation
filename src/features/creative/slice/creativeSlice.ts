import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CreativeAspectRatio } from '../types/creativeAspectRatioType';
import type { CreativeState } from '../types/creativeStateType';

export const ASPECT_RATIOS: CreativeAspectRatio[] = ['1:1', '16:9', '9:16'];

export const getCreativeOutputPath = (productName: string, formatName: string): string => {
  const safeProduct = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `output/${safeProduct}/${formatName}/creative.png`;
};

const initialState: CreativeState = {
  creatives: {},
  completedCount: 0,
  totalCount: 0,
  progressPct: 0,
};

const recalculateProgress = (state: CreativeState): void => {
  state.progressPct = state.totalCount === 0 ? 0 : Math.round((state.completedCount / state.totalCount) * 100);
};

export const creativeSlice = createSlice({
  name: 'creative',
  initialState,
  reducers: {
    initCreatives(state, action: PayloadAction<{ productIds: string[] }>) {
      const { productIds } = action.payload;
      state.creatives = {};
      state.completedCount = 0;
      state.totalCount = productIds.length * ASPECT_RATIOS.length;
      state.progressPct = 0;

      for (const productId of productIds) {
        for (const ratio of ASPECT_RATIOS) {
          const id = `${productId}_${ratio}`;
          state.creatives[id] = {
            id,
            productId,
            aspectRatio: ratio,
            status: 'pending',
          };
        }
      }
    },
    creativeCompleted(state, action: PayloadAction<{ id: string; outputUrl?: string }>) {
      const { id, outputUrl } = action.payload;
      if (state.creatives[id]) {
        state.creatives[id].status = 'completed';
        if (outputUrl) state.creatives[id].outputUrl = outputUrl;
        state.completedCount += 1;
        recalculateProgress(state);
      }
    },
    creativePersisted(
      state,
      action: PayloadAction<{
        id: string;
        productName: string;
        formatName: string;
        outputUrl: string;
        storageMode?: 'dropbox' | 'download';
        storageError?: string;
        metadata: {
          originalCampaignMessage: string;
          localizedCampaignMessage: string;
          targetRegion: string;
          generatedAtIso: string;
        };
      }>
    ) {
      const {
        id,
        productName,
        formatName,
        outputUrl,
        storageMode = 'dropbox',
        storageError,
        metadata,
      } = action.payload;
      if (!state.creatives[id]) {
        return;
      }

      state.creatives[id].status = 'completed';
      state.creatives[id].outputUrl = outputUrl;
      state.creatives[id].outputPath = getCreativeOutputPath(productName, formatName);
      state.creatives[id].storageMode = storageMode;
      state.creatives[id].storageError = storageError;
      state.creatives[id].metadata = metadata;
      state.completedCount += 1;
      recalculateProgress(state);
    },
    creativeFailed(state, action: PayloadAction<{ id: string; error: string }>) {
      const { id, error } = action.payload;
      if (state.creatives[id]) {
        state.creatives[id].status = 'failed';
        state.creatives[id].error = error;
        state.completedCount += 1;
        recalculateProgress(state);
      }
    },
    resetCreatives(state) {
      Object.assign(state, initialState);
    },
  },
});
export default creativeSlice.reducer;
