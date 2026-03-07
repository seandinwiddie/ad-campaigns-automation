import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SettingsState } from '@/features/core/settings/types/settingsStateType';

const initialState: SettingsState = {
  leonardoApiKey: null,
  dropboxAccessToken: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLeonardoApiKey(state, action: PayloadAction<string>) {
      state.leonardoApiKey = action.payload;
    },
    clearLeonardoApiKey(state) {
      state.leonardoApiKey = null;
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
