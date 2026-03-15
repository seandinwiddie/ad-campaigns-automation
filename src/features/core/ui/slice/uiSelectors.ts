/**
 * Selectors for accessing and deriving global UI state, including validation 
 * statuses and input availability for various features.
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { ValidationStatus } from '@/features/core/ui/types/uiStateType';

/** Selects the global loading status. */
export const selectIsLoading = (state: RootState): boolean => state.ui.isLoading;
/** Selects the ID of the currently active modal. */
export const selectActiveModal = (state: RootState): string | null => state.ui.activeModal;
/** Selects the currently active page/screen in the application. */
export const selectCurrentPage = (state: RootState) => state.ui.currentPage;
/** Selects the raw JSON/YAML text of the brief from the editor. */
export const selectBriefRawText = (state: RootState): string => state.ui.briefRawText;
/** Selects the current value of the Leonardo API key input field. */
export const selectLeonardoApiKeyInput = (state: RootState): string => state.ui.leonardoApiKeyInput;
/** Selects the current value of the Dropbox access token input field. */
export const selectDropboxAccessTokenInput = (state: RootState): string => state.ui.dropboxAccessTokenInput;
/** Selects the validation status of the Leonardo API key. */
export const selectLeonardoValidationStatus = (state: RootState): ValidationStatus =>
  state.ui.leonardoValidationStatus;
/** Selects the feedback message from the last Leonardo validation attempt. */
export const selectLeonardoValidationMessage = (state: RootState): string | null =>
  state.ui.leonardoValidationMessage;
/** Selects the validation status of the Dropbox access token. */
export const selectDropboxValidationStatus = (state: RootState): ValidationStatus =>
  state.ui.dropboxValidationStatus;
/** Selects the feedback message from the last Dropbox validation attempt. */
export const selectDropboxValidationMessage = (state: RootState): string | null =>
  state.ui.dropboxValidationMessage;
/** Selects the total elapsed time of the current pipeline execution. */
export const selectElapsedSeconds = (state: RootState): number => state.ui.elapsedSeconds;

/** Selects the brief text with leading/trailing whitespace removed. */
export const selectTrimmedBriefRawText = createSelector([selectBriefRawText], (briefRawText) => briefRawText.trim());

/** Returns true if the brief editor has content that can be parsed. */
export const selectCanLoadBrief = createSelector(
  [selectTrimmedBriefRawText],
  (briefRawText) => briefRawText.length > 0
);

/** Selects the Leonardo API key input with leading/trailing whitespace removed. */
export const selectTrimmedLeonardoApiKeyInput = createSelector(
  [selectLeonardoApiKeyInput],
  (leonardoApiKeyInput) => leonardoApiKeyInput.trim()
);

/** Selects the Dropbox access token input with leading/trailing whitespace removed. */
export const selectTrimmedDropboxAccessTokenInput = createSelector(
  [selectDropboxAccessTokenInput],
  (dropboxAccessTokenInput) => dropboxAccessTokenInput.trim()
);

/** Returns true if the Leonardo API key can be validated (has content and no pending request). */
export const selectCanTestLeonardoApiKey = createSelector(
  [selectTrimmedLeonardoApiKeyInput, selectLeonardoValidationStatus],
  (leonardoApiKeyInput, validationStatus) =>
    leonardoApiKeyInput.length > 0 && validationStatus !== 'pending'
);

/** Returns true if the Dropbox access token can be validated (has content and no pending request). */
export const selectCanTestDropboxToken = createSelector(
  [selectTrimmedDropboxAccessTokenInput, selectDropboxValidationStatus],
  (dropboxAccessTokenInput, validationStatus) =>
    dropboxAccessTokenInput.length > 0 && validationStatus !== 'pending'
);

/** Returns true if both Leonardo and Dropbox credentials have content. */
export const selectHasCredentialInputs = createSelector(
  [selectTrimmedLeonardoApiKeyInput, selectTrimmedDropboxAccessTokenInput],
  (leonardoApiKeyInput, dropboxAccessTokenInput) =>
    leonardoApiKeyInput.length > 0 && dropboxAccessTokenInput.length > 0
);
