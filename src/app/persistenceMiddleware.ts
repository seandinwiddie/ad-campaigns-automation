import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import {
  setApiKey,
  clearApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} from '@/features/core/settings/slice/settingsActions';
import {
  setCurrentPage,
  setApiKeyInput,
  setDropboxAccessTokenInput,
  incrementElapsed,
  resetElapsed,
} from '@/features/core/ui/slice/uiActions';
import { startPipeline, pipelineComplete, pipelineError, resetPipeline } from '@/features/pipeline/slice/pipelineActions';

const API_KEY_STORAGE_KEY = 'ad-campaigns-api-key';
const DROPBOX_TOKEN_STORAGE_KEY = 'ad-campaigns-dropbox-token';

export const persistenceMiddleware = createListenerMiddleware();

// Persist API key to localStorage when it changes
persistenceMiddleware.startListening({
  matcher: isAnyOf(setApiKey, clearApiKey, setDropboxAccessToken, clearDropboxAccessToken),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const apiKey = state.settings.apiKey;
    const dropboxAccessToken = state.settings.dropboxAccessToken;
    try {
      if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }

      if (dropboxAccessToken) {
        localStorage.setItem(DROPBOX_TOKEN_STORAGE_KEY, dropboxAccessToken);
      } else {
        localStorage.removeItem(DROPBOX_TOKEN_STORAGE_KEY);
      }
    } catch {
      // localStorage not available (SSR)
    }
  },
});

// Navigate to home after saving API key
persistenceMiddleware.startListening({
  actionCreator: setApiKey,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setCurrentPage('home'));
  },
});

// Navigate to pipeline when pipeline starts + start elapsed timer
persistenceMiddleware.startListening({
  actionCreator: startPipeline,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(setCurrentPage('pipeline'));
    listenerApi.dispatch(resetElapsed());

    // Tick every second while pipeline is running
    while (true) {
      await listenerApi.delay(1000);
      const state = listenerApi.getState() as RootState;
      const status = state.pipeline.status;
      if (status === 'complete' || status === 'error' || status === 'idle') {
        break;
      }
      listenerApi.dispatch(incrementElapsed());
    }
  },
});

// Navigate to results on pipeline complete
persistenceMiddleware.startListening({
  actionCreator: pipelineComplete,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setCurrentPage('results'));
  },
});

// On resetPipeline, navigate to home
persistenceMiddleware.startListening({
  actionCreator: resetPipeline,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setCurrentPage('home'));
    listenerApi.dispatch(resetElapsed());
  },
});

// Load API key from localStorage on app init
export const initializeStore = (dispatch: (action: unknown) => void) => {
  try {
    const persistedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const persistedDropboxToken = localStorage.getItem(DROPBOX_TOKEN_STORAGE_KEY);
    if (persistedApiKey) {
      dispatch(setApiKey(persistedApiKey));
      dispatch(setApiKeyInput(persistedApiKey));
    }
    if (persistedDropboxToken) {
      dispatch(setDropboxAccessToken(persistedDropboxToken));
      dispatch(setDropboxAccessTokenInput(persistedDropboxToken));
    }
    if (persistedApiKey || persistedDropboxToken) {
      dispatch(setCurrentPage('home'));
    }
  } catch {
    // localStorage not available (SSR)
  }
};
