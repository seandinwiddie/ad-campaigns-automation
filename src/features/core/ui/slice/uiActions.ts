import { uiSlice } from './uiSlice';

export const {
  setLoading,
  setActiveModal,
  setCurrentPage,
  setBriefRawText,
  loadExampleBriefText,
  setLeonardoApiKeyInput,
  setDropboxAccessTokenInput,
  setElapsedSeconds,
  incrementElapsed,
  resetElapsed,
} = uiSlice.actions;
