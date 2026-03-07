import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SettingsState } from '@/features/core/settings/types/settingsStateType';

const initialState: SettingsState = {
  apiKey: null,
  openAiApiKey: null,
  pollinationsApiKey: null,
  dropboxAccessToken: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload;
    },
    clearApiKey(state) {
      state.apiKey = null;
    },
    setOpenAiApiKey(state, action: PayloadAction<string>) {
      state.openAiApiKey = action.payload;
    },
    clearOpenAiApiKey(state) {
      state.openAiApiKey = null;
    },
    setPollinationsApiKey(state, action: PayloadAction<string>) {
      state.pollinationsApiKey = action.payload;
    },
    clearPollinationsApiKey(state) {
      state.pollinationsApiKey = null;
    },
    setDropboxAccessToken(state, action: PayloadAction<string>) {
      state.dropboxAccessToken = action.payload;
    },
    clearDropboxAccessToken(state) {
      state.dropboxAccessToken = null;
    },
  },
});
export default settingsSlice.reducer;
