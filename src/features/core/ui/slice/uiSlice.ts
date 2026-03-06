import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppPage } from '@/features/core/ui/types/appPageType';
import type { UiState } from '@/features/core/ui/types/uiStateType';

const EXAMPLE_BRIEF_TEMPLATE = `{
  "campaignName": "Summer Eco Campaign 2025",
  "products": [
    {
      "name": "EcoBottle",
      "description": "Sustainable water bottle made from recycled ocean plastic"
    },
    {
      "name": "SolarCharger",
      "description": "Portable solar-powered phone charger for outdoor adventures"
    }
  ],
  "targetRegion": "United States",
  "targetAudience": "Environmentally conscious millennials aged 25-35",
  "campaignMessage": "Stay Green, Live Clean",
  "brandGuidelines": {
    "colors": ["#00A86B", "#FFFFFF"],
    "prohibitedWords": ["free", "guaranteed", "miracle", "unlimited"]
  }
}`;

const initialState: UiState = {
  isLoading: false,
  activeModal: null,
  currentPage: 'settings',
  briefRawText: '',
  apiKeyInput: '',
  dropboxAccessTokenInput: '',
  elapsedSeconds: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<AppPage>) => {
      state.currentPage = action.payload;
    },
    setBriefRawText: (state, action: PayloadAction<string>) => {
      state.briefRawText = action.payload;
    },
    loadExampleBriefText: (state) => {
      state.briefRawText = EXAMPLE_BRIEF_TEMPLATE;
    },
    setApiKeyInput: (state, action: PayloadAction<string>) => {
      state.apiKeyInput = action.payload;
    },
    setDropboxAccessTokenInput: (state, action: PayloadAction<string>) => {
      state.dropboxAccessTokenInput = action.payload;
    },
    setElapsedSeconds: (state, action: PayloadAction<number>) => {
      state.elapsedSeconds = action.payload;
    },
    incrementElapsed: (state) => {
      state.elapsedSeconds += 1;
    },
    resetElapsed: (state) => {
      state.elapsedSeconds = 0;
    },
  },
});

export default uiSlice.reducer;
