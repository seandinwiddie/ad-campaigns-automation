import { settingsSlice } from './settingsSlice';

export const {
  setLeonardoApiKey,
  clearLeonardoApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} = settingsSlice.actions;
