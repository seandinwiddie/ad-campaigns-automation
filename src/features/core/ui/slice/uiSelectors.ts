import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { ValidationStatus } from '@/features/core/ui/types/uiStateType';

export const selectIsLoading = (state: RootState): boolean => state.ui.isLoading;
export const selectActiveModal = (state: RootState): string | null => state.ui.activeModal;
export const selectCurrentPage = (state: RootState) => state.ui.currentPage;
export const selectBriefRawText = (state: RootState): string => state.ui.briefRawText;
export const selectLeonardoApiKeyInput = (state: RootState): string => state.ui.leonardoApiKeyInput;
export const selectDropboxAccessTokenInput = (state: RootState): string => state.ui.dropboxAccessTokenInput;
export const selectLeonardoValidationStatus = (state: RootState): ValidationStatus =>
  state.ui.leonardoValidationStatus;
export const selectLeonardoValidationMessage = (state: RootState): string | null =>
  state.ui.leonardoValidationMessage;
export const selectDropboxValidationStatus = (state: RootState): ValidationStatus =>
  state.ui.dropboxValidationStatus;
export const selectDropboxValidationMessage = (state: RootState): string | null =>
  state.ui.dropboxValidationMessage;
export const selectElapsedSeconds = (state: RootState): number => state.ui.elapsedSeconds;

export const selectTrimmedBriefRawText = createSelector([selectBriefRawText], (briefRawText) => briefRawText.trim());

export const selectCanLoadBrief = createSelector(
  [selectTrimmedBriefRawText],
  (briefRawText) => briefRawText.length > 0
);

export const selectTrimmedLeonardoApiKeyInput = createSelector(
  [selectLeonardoApiKeyInput],
  (leonardoApiKeyInput) => leonardoApiKeyInput.trim()
);

export const selectTrimmedDropboxAccessTokenInput = createSelector(
  [selectDropboxAccessTokenInput],
  (dropboxAccessTokenInput) => dropboxAccessTokenInput.trim()
);

export const selectCanTestLeonardoApiKey = createSelector(
  [selectTrimmedLeonardoApiKeyInput, selectLeonardoValidationStatus],
  (leonardoApiKeyInput, validationStatus) =>
    leonardoApiKeyInput.length > 0 && validationStatus !== 'pending'
);

export const selectCanTestDropboxToken = createSelector(
  [selectTrimmedDropboxAccessTokenInput, selectDropboxValidationStatus],
  (dropboxAccessTokenInput, validationStatus) =>
    dropboxAccessTokenInput.length > 0 && validationStatus !== 'pending'
);

export const selectHasCredentialInputs = createSelector(
  [selectTrimmedLeonardoApiKeyInput, selectTrimmedDropboxAccessTokenInput],
  (leonardoApiKeyInput, dropboxAccessTokenInput) =>
    leonardoApiKeyInput.length > 0 && dropboxAccessTokenInput.length > 0
);
