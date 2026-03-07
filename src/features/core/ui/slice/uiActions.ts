import { uiSlice } from './uiSlice';

export const {
  setLoading,
  setActiveModal,
  setCurrentPage,
  setBriefRawText,
  loadExampleBriefText,
  setApiKeyInput,
  setOpenAiApiKeyInput,
  setPollinationsApiKeyInput,
  setDropboxAccessTokenInput,
  setElapsedSeconds,
  incrementElapsed,
  resetElapsed,
} = uiSlice.actions;
