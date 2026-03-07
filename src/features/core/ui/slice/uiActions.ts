import { uiSlice } from './uiSlice';

export const {
  setLoading,
  setActiveModal,
  setCurrentPage,
  setBriefRawText,
  loadExampleBriefText,
  setLeonardoApiKeyInput,
  setDropboxAccessTokenInput,
  requestLeonardoValidation,
  leonardoValidationSucceeded,
  leonardoValidationFailed,
  requestDropboxValidation,
  dropboxValidationSucceeded,
  dropboxValidationFailed,
  setElapsedSeconds,
  incrementElapsed,
  resetElapsed,
} = uiSlice.actions;
