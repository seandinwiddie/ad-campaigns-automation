/**
 * Covers startup hydration so saved credentials restore both persistent settings and screen-level input state.
 * The assertions document the expected boot behavior when localStorage contains complete or partial
 * credentials, making the startup contract explicit for future refactors.
 *
 * **User Story:**
 * - As a returning user, I want previously saved credentials to repopulate the app correctly on load
 *   so I can resume my workflow without re-entering tokens or landing on the wrong screen.
 */
import { configureStore } from '@reduxjs/toolkit';
import { initializeStore } from './persistenceMiddleware';
import { rootReducer } from './rootReducer';

const createStore = () =>
  configureStore({
    reducer: rootReducer,
  });

describe('initializeStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hydrates stored credentials into settings, inputs, and home navigation when both values exist', () => {
    localStorage.setItem('ad-campaigns-leonardo-api-key', 'leo-key');
    localStorage.setItem('ad-campaigns-dropbox-token', 'dropbox-token');

    const store = createStore();
    initializeStore(store.dispatch);

    const state = store.getState();
    expect(state.settings.leonardoApiKey).toBe('leo-key');
    expect(state.settings.dropboxAccessToken).toBe('dropbox-token');
    expect(state.ui.leonardoApiKeyInput).toBe('leo-key');
    expect(state.ui.dropboxAccessTokenInput).toBe('dropbox-token');
    expect(state.ui.currentPage).toBe('home');
  });

  it('keeps the user on settings when only one credential is available', () => {
    localStorage.setItem('ad-campaigns-leonardo-api-key', 'leo-key');

    const store = createStore();
    initializeStore(store.dispatch);

    const state = store.getState();
    expect(state.settings.leonardoApiKey).toBe('leo-key');
    expect(state.settings.dropboxAccessToken).toBeNull();
    expect(state.ui.leonardoApiKeyInput).toBe('leo-key');
    expect(state.ui.dropboxAccessTokenInput).toBe('');
    expect(state.ui.currentPage).toBe('settings');
  });
});
