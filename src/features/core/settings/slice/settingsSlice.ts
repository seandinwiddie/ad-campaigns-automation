/**
 * Settings slice manages user configuration and API credentials.
 * It's responsible for storing keys for external service integrations.
 * 
 * **User Story:**
 * - As a user, I want to securely provide my API keys so the application can 
 *   communicate with Leonardo.ai and Dropbox on my behalf.
 */
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
    /**
     * Stores the Leonardo.ai API key in the application state.
     */
    setLeonardoApiKey(state, action: PayloadAction<string>) {
      state.leonardoApiKey = action.payload;
    },
    /**
     * Removes the Leonardo.ai API key from the state.
     */
    clearLeonardoApiKey(state) {
      state.leonardoApiKey = null;
    },
    /**
     * Stores the Dropbox access token in the application state.
     */
    setDropboxAccessToken(state, action: PayloadAction<string>) {
      state.dropboxAccessToken = action.payload;
    },
    /**
     * Removes the Dropbox access token from the state.
     */
    clearDropboxAccessToken(state) {
      state.dropboxAccessToken = null;
    },
  },
});

/**
 * Redux action creators for the settings slice.
 */
export const {
  setLeonardoApiKey,
  clearLeonardoApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} = settingsSlice.actions;

export default settingsSlice.reducer;
