/**
 * Settings listener manages the credential validation and persistence workflow.
 * It interacts with the Leonardo and Dropbox APIs to verify user-provided keys.
 * 
 * **User Story:**
 * - As a user, I want my API keys to be validated in real-time so I know
 *   immediately if I've entered an incorrect or expired key.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '@/app/rootReducer';
import { apiSlice } from '@/features/core/api/slice/apiSlice';
import { setDropboxAccessToken, setLeonardoApiKey } from '@/features/core/settings/slice/settingsActions';
import { saveCredentialInputs } from '@/features/core/settings/slice/settingsWorkflowActions';
import {
  dropboxValidationFailed,
  dropboxValidationSucceeded,
  leonardoValidationFailed,
  leonardoValidationSucceeded,
  requestLeonardoValidation,
  requestDropboxValidation,
  setCurrentPage,
} from '@/features/core/ui/slice/uiActions';
import {
  selectTrimmedDropboxAccessTokenInput,
  selectTrimmedLeonardoApiKeyInput,
} from '@/features/core/ui/slice/uiSelectors';

/**
 * Listener middleware for handling settings-related validation and persistence.
 */
export const settingsListenerMiddleware = createListenerMiddleware();

/**
 * Resolves a human-readable error message from an API mutation error.
 * 
 * @param error - The raw error from the API mutation.
 * @returns A processed error string.
 */
const getMutationErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Request failed. Please verify the value and try again.';
  }

  const errorRecord = error as {
    data?: unknown;
    error?: unknown;
  };

  if (typeof errorRecord.data === 'string' && errorRecord.data.trim().length > 0) {
    return errorRecord.data;
  }

  if (errorRecord.data && typeof errorRecord.data === 'object') {
    const nestedMessage = (errorRecord.data as { error?: { message?: unknown } }).error?.message;
    if (typeof nestedMessage === 'string' && nestedMessage.trim().length > 0) {
      return nestedMessage;
    }
  }

  if (typeof errorRecord.error === 'string' && errorRecord.error.trim().length > 0) {
    return errorRecord.error;
  }

  return 'Request failed. Please verify the value and try again.';
};

settingsListenerMiddleware.startListening({
  actionCreator: requestLeonardoValidation,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const apiKey = selectTrimmedLeonardoApiKeyInput(state);

    if (!apiKey) {
      listenerApi.dispatch(leonardoValidationFailed('Leonardo API key is required.'));
      return;
    }

    const result = await listenerApi.dispatch(apiSlice.endpoints.testLeonardoApiKey.initiate({ apiKey }));

    if ('data' in result && result.data) {
      listenerApi.dispatch(leonardoValidationSucceeded());
      return;
    }

    listenerApi.dispatch(
      leonardoValidationFailed(getMutationErrorMessage((result as { error?: unknown }).error))
    );
  },
});

settingsListenerMiddleware.startListening({
  actionCreator: requestDropboxValidation,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const accessToken = selectTrimmedDropboxAccessTokenInput(state);

    if (!accessToken) {
      listenerApi.dispatch(dropboxValidationFailed('Dropbox access token is required.'));
      return;
    }

    const result = await listenerApi.dispatch(apiSlice.endpoints.testDropboxToken.initiate({ accessToken }));

    if ('data' in result && result.data) {
      listenerApi.dispatch(dropboxValidationSucceeded());
      return;
    }

    listenerApi.dispatch(
      dropboxValidationFailed(getMutationErrorMessage((result as { error?: unknown }).error))
    );
  },
});

settingsListenerMiddleware.startListening({
  actionCreator: saveCredentialInputs,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const leonardoApiKey = selectTrimmedLeonardoApiKeyInput(state);
    const dropboxAccessToken = selectTrimmedDropboxAccessTokenInput(state);

    if (!leonardoApiKey || !dropboxAccessToken) {
      return;
    }

    listenerApi.dispatch(setLeonardoApiKey(leonardoApiKey));
    listenerApi.dispatch(setDropboxAccessToken(dropboxAccessToken));
    listenerApi.dispatch(setCurrentPage('home'));
  },
});
