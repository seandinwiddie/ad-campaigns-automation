/**
 * Re-exports UI slice actions so screens and listeners can drive navigation and transient form state consistently.
 * It exposes the full UI action surface from a dedicated module, making it easier for screens,
 * listeners, and tests to coordinate navigation and temporary input state from one import path.
 *
 * **User Story:**
 * - As a developer connecting screens and listeners, I want one UI actions module so I can update
 *   navigation, validation messaging, and draft inputs without importing the slice directly.
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
