import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import {
  setApiKey,
  clearApiKey,
  setOpenAiApiKey,
  clearOpenAiApiKey,
  setPollinationsApiKey,
  clearPollinationsApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} from '@/features/core/settings/slice/settingsActions';
import {
  setCurrentPage,
  setApiKeyInput,
  setOpenAiApiKeyInput,
  setPollinationsApiKeyInput,
  setDropboxAccessTokenInput,
  incrementElapsed,
  resetElapsed,
} from '@/features/core/ui/slice/uiActions';
import { startPipeline, pipelineComplete, resetPipeline } from '@/features/pipeline/slice/pipelineActions';

const API_KEY_STORAGE_KEY = 'ad-campaigns-api-key';
const OPENAI_API_KEY_STORAGE_KEY = 'ad-campaigns-openai-api-key';
const DROPBOX_TOKEN_STORAGE_KEY = 'ad-campaigns-dropbox-token';

const getBootstrapCredential = (value: string | undefined): string | null => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : null;
};

export const persistenceMiddleware = createListenerMiddleware();

// Persist API key to localStorage when it changes
persistenceMiddleware.startListening({
  matcher: isAnyOf(setApiKey, clearApiKey, setOpenAiApiKey, clearOpenAiApiKey, setPollinationsApiKey, clearPollinationsApiKey, setDropboxAccessToken, clearDropboxAccessToken),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const apiKey = state.settings.apiKey;
    const openAiApiKey = state.settings.openAiApiKey;
    const dropboxAccessToken = state.settings.dropboxAccessToken;
    try {
      if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }

      if (openAiApiKey) {
        localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, openAiApiKey);
      } else {
        localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
      }

      if (pollinationsApiKey) {
        localStorage.setItem(POLLINATIONS_API_KEY_STORAGE_KEY, pollinationsApiKey);
      } else {
        localStorage.removeItem(POLLINATIONS_API_KEY_STORAGE_KEY);
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
    const persistedOpenAiApiKey = localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY);
    const persistedPollinationsApiKey = localStorage.getItem(POLLINATIONS_API_KEY_STORAGE_KEY);
    const persistedDropboxToken = localStorage.getItem(DROPBOX_TOKEN_STORAGE_KEY);
    const apiKey = persistedApiKey ?? getBootstrapCredential(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const openAiApiKey = persistedOpenAiApiKey ?? getBootstrapCredential(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    const pollinationsApiKey = persistedPollinationsApiKey ?? getBootstrapCredential(process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY);
    const dropboxToken = persistedDropboxToken ?? getBootstrapCredential(process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN);

    if (apiKey) {
      dispatch(setApiKey(apiKey));
      dispatch(setApiKeyInput(apiKey));
    }
    if (openAiApiKey) {
      dispatch(setOpenAiApiKey(openAiApiKey));
      dispatch(setOpenAiApiKeyInput(openAiApiKey));
    }
    if (pollinationsApiKey) {
      dispatch(setPollinationsApiKey(pollinationsApiKey));
      dispatch(setPollinationsApiKeyInput(pollinationsApiKey));
    }
    if (dropboxToken) {
      dispatch(setDropboxAccessToken(dropboxToken));
      dispatch(setDropboxAccessTokenInput(dropboxToken));
    }
    dispatch(setCurrentPage('home'));
  } catch {
    // localStorage not available (SSR)
  }
};
