/**
 * Re-exports UI slice actions so screens and listeners can drive navigation and transient form state consistently.
 */
import { uiSlice } from './uiSlice';

/**
 * Exported actions from the UI slice for toggling UI state, 
 * navigation, and input management.
 */
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
