import { settingsSlice } from './settingsSlice';

/**
 * Exported actions from the settings slice for updating and clearing
 * persistent API credentials.
 */
export const {
  setLeonardoApiKey,
  clearLeonardoApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} = settingsSlice.actions;
