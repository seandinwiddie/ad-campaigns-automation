import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/features/core/api/slice/apiSlice';
import settingsReducer from '@/features/core/settings/slice/settingsSlice';
import { saveCredentialInputs } from '@/features/core/settings/slice/settingsWorkflowActions';
import { settingsListenerMiddleware } from '@/features/core/settings/listeners/settingsListener';
import uiReducer from '@/features/core/ui/slice/uiSlice';
import {
  requestDropboxValidation,
  requestLeonardoValidation,
  setDropboxAccessTokenInput,
  setLeonardoApiKeyInput,
} from '@/features/core/ui/slice/uiActions';

const flushAsyncWork = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

const createTestStore = () =>
  configureStore({
    reducer: {
      settings: settingsReducer,
      ui: uiReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .prepend(settingsListenerMiddleware.middleware)
        .concat(apiSlice.middleware),
  });

describe('settingsListener', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('saves trimmed credential inputs and navigates home', () => {
    const store = createTestStore();

    store.dispatch(setLeonardoApiKeyInput('  leo-key  '));
    store.dispatch(setDropboxAccessTokenInput('  dropbox-token  '));
    store.dispatch(saveCredentialInputs());

    const state = store.getState();
    expect(state.settings.leonardoApiKey).toBe('leo-key');
    expect(state.settings.dropboxAccessToken).toBe('dropbox-token');
    expect(state.ui.currentPage).toBe('home');
  });

  it('stores Leonardo validation success in Redux state', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const store = createTestStore();
    store.dispatch(setLeonardoApiKeyInput('valid-key'));
    store.dispatch(requestLeonardoValidation());
    await flushAsyncWork();

    const state = store.getState();
    expect(state.ui.leonardoValidationStatus).toBe('success');
    expect(state.ui.leonardoValidationMessage).toBeNull();
  });

  it('stores Dropbox validation failures in Redux state', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Dropbox token rejected',
    });

    const store = createTestStore();
    store.dispatch(setDropboxAccessTokenInput('bad-token'));
    store.dispatch(requestDropboxValidation());
    await flushAsyncWork();

    const state = store.getState();
    expect(state.ui.dropboxValidationStatus).toBe('error');
    expect(state.ui.dropboxValidationMessage).toBe('Dropbox token rejected');
  });
});
