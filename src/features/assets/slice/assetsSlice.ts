import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Asset } from '../types/assetType';
import type { AssetsState } from '../types/assetsStateType';

const initialState: AssetsState = {
  assets: {},
  missingAssetProductIds: [],
  allAssetsResolved: false,
};

const recalculateDerived = (state: AssetsState): void => {
  const values = Object.values(state.assets);
  state.missingAssetProductIds = values.filter((asset) => asset.status === 'pending').map((asset) => asset.productId);
  state.allAssetsResolved =
    values.length > 0 && values.every((asset) => asset.status === 'resolved' || asset.status === 'generated');
};

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resolveAsset(state, action: PayloadAction<{ productId: string; url?: string }>) {
      const { productId, url } = action.payload;
      if (url) {
        state.assets[productId] = { productId, status: 'resolved', url };
      } else {
        state.assets[productId] = { productId, status: 'pending' };
      }
      recalculateDerived(state);
    },
    assetGenerating(state, action: PayloadAction<string>) {
      const productId = action.payload;
      state.assets[productId] = {
        ...state.assets[productId],
        productId,
        status: 'generating',
      };
      recalculateDerived(state);
    },
    assetGenerated(state, action: PayloadAction<{ productId: string; imageData: string }>) {
      const { productId, imageData } = action.payload;
      state.assets[productId] = {
        ...state.assets[productId],
        productId,
        status: 'generated',
        imageData,
      };
      recalculateDerived(state);
    },
    assetFailed(state, action: PayloadAction<{ productId: string; error: string }>) {
      const { productId, error } = action.payload;
      state.assets[productId] = {
        ...state.assets[productId],
        productId,
        status: 'failed',
        error,
      };
      recalculateDerived(state);
    },
    resetAssets(state) {
      Object.assign(state, initialState);
    },
  },
});
export default assetsSlice.reducer;
