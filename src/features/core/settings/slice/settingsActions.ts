import { settingsSlice } from './settingsSlice';

export const {
  setApiKey,
  clearApiKey,
  setOpenAiApiKey,
  clearOpenAiApiKey,
  setPollinationsApiKey,
  clearPollinationsApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} = settingsSlice.actions;
