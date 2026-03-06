import { uiSlice } from './uiSlice';

export const {
  setLoading,
  setActiveModal,
  setCurrentPage,
  setBriefRawText,
  loadExampleBriefText,
  setApiKeyInput,
  setDropboxAccessTokenInput,
  setElapsedSeconds,
  incrementElapsed,
  resetElapsed,
} = uiSlice.actions;
