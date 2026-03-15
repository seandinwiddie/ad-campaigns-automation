/**
 * Persistence Middleware handles side-effects that bridge Redux state with external systems:
 * 1. Synchronizing API credentials to localStorage.
 * 2. Managing navigation between screens based on process status.
 * 3. Orchestrating the elapsed timer for the pipeline.
 * 
 * **User Stories:**
 * - "I want my credentials to be remembered so I don't have to enter them every time I open the app."
 * - "I want the app to automatically transition between the brief, processing, and results screens."
 */
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import {
  setLeonardoApiKey,
  clearLeonardoApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} from '@/features/core/settings/slice/settingsActions';
import {
  setCurrentPage,
  setLeonardoApiKeyInput,
  setDropboxAccessTokenInput,
  incrementElapsed,
  resetElapsed,
} from '@/features/core/ui/slice/uiActions';
import { startPipeline, pipelineComplete, resetPipeline } from '@/features/pipeline/slice/pipelineActions';

const LEONARDO_API_KEY_STORAGE_KEY = 'ad-campaigns-leonardo-api-key';
const DROPBOX_TOKEN_STORAGE_KEY = 'ad-campaigns-dropbox-token';

/**
 * Listener middleware for handling persistence-related side effects.
 */
export const persistenceMiddleware = createListenerMiddleware();

// Persist API key to localStorage when it changes
/**
 * Listener to synchronize API credentials (Leonardo and Dropbox) to localStorage
 * whenever any related set or clear action is dispatched.
 */
persistenceMiddleware.startListening({
  matcher: isAnyOf(setLeonardoApiKey, clearLeonardoApiKey, setDropboxAccessToken, clearDropboxAccessToken),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const leonardoApiKey = state.settings.leonardoApiKey;
    const dropboxAccessToken = state.settings.dropboxAccessToken;
    try {
      if (leonardoApiKey) {
        localStorage.setItem(LEONARDO_API_KEY_STORAGE_KEY, leonardoApiKey);
      } else {
        localStorage.removeItem(LEONARDO_API_KEY_STORAGE_KEY);
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

// Navigate to pipeline when pipeline starts + start elapsed timer
/**
 * Listener to handle the initiation of the pipeline.
 * It transitions the UI to the pipeline screen and starts a per-second timer tracker.
 */
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
/**
 * Listener to transition the UI to the results screen once the pipeline has finished processing.
 */
persistenceMiddleware.startListening({
  actionCreator: pipelineComplete,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setCurrentPage('results'));
  },
});

// On resetPipeline, navigate to home
/**
 * Listener to reset the UI to the home screen and clear the elapsed timer.
 */
persistenceMiddleware.startListening({
  actionCreator: resetPipeline,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setCurrentPage('home'));
    listenerApi.dispatch(resetElapsed());
  },
});

// Load API key from localStorage on app init
/**
 * Rehydrates the Redux store from localStorage on application startup.
 * Automatically synchronizes stored credentials back into the Redux and UI state.
 * 
 * @param dispatch - The Redux dispatch function.
 */
export const initializeStore = (dispatch: (action: unknown) => void) => {
  try {
    const persistedLeonardoApiKey = localStorage.getItem(LEONARDO_API_KEY_STORAGE_KEY);
    const persistedDropboxToken = localStorage.getItem(DROPBOX_TOKEN_STORAGE_KEY);
    if (persistedLeonardoApiKey) {
      dispatch(setLeonardoApiKey(persistedLeonardoApiKey));
      dispatch(setLeonardoApiKeyInput(persistedLeonardoApiKey));
    }
    if (persistedDropboxToken) {
      dispatch(setDropboxAccessToken(persistedDropboxToken));
      dispatch(setDropboxAccessTokenInput(persistedDropboxToken));
    }
    if (persistedLeonardoApiKey && persistedDropboxToken) {
      dispatch(setCurrentPage('home'));
    }
  } catch {
    // localStorage not available (SSR)
  }
};
