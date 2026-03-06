import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SettingsState } from '@/features/core/settings/types/settingsStateType';

const initialState: SettingsState = {
  apiKey: null,
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
    setDropboxAccessToken(state, action: PayloadAction<string>) {
      state.dropboxAccessToken = action.payload;
    },
    clearDropboxAccessToken(state) {
      state.dropboxAccessToken = null;
    },
  },
});
export default settingsSlice.reducer;
