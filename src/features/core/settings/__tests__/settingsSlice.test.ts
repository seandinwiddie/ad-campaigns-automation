import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../slice/settingsSlice';
import { setApiKey, clearApiKey } from '../slice/settingsActions';
import { selectApiKey, selectHasApiKey } from '../slice/settingsSelectors';
import type { SettingsState } from '../types/settingsStateType';

function createTestStore(preloadedState?: { settings: SettingsState }) {
  return configureStore({
    reducer: { settings: settingsReducer },
    preloadedState,
  });
}

describe('Story 1: API Key Configuration', () => {
  describe('Given no stored API key', () => {
    it('Then selectHasApiKey returns false', () => {
      const store = createTestStore();
      const state = store.getState();
      expect(selectHasApiKey({ settings: state.settings } as any)).toBe(false);
    });

    it('Then selectApiKey returns null', () => {
      const store = createTestStore();
      const state = store.getState();
      expect(selectApiKey({ settings: state.settings } as any)).toBeNull();
    });
  });

  describe('When setApiKey is dispatched', () => {
    it('Then selectApiKey returns the key', () => {
      const store = createTestStore();
      store.dispatch(setApiKey('sk-test-key-12345'));
      const state = store.getState();
      expect(selectApiKey({ settings: state.settings } as any)).toBe('sk-test-key-12345');
    });

    it('Then selectHasApiKey returns true', () => {
      const store = createTestStore();
      store.dispatch(setApiKey('sk-test-key-12345'));
      const state = store.getState();
      expect(selectHasApiKey({ settings: state.settings } as any)).toBe(true);
    });
  });

  describe('When clearApiKey is dispatched', () => {
    it('Then selectApiKey returns null', () => {
      const store = createTestStore();
      store.dispatch(setApiKey('sk-test-key-12345'));
      store.dispatch(clearApiKey());
      const state = store.getState();
      expect(selectApiKey({ settings: state.settings } as any)).toBeNull();
    });

    it('Then selectHasApiKey returns false', () => {
      const store = createTestStore();
      store.dispatch(setApiKey('sk-test-key-12345'));
      store.dispatch(clearApiKey());
      const state = store.getState();
      expect(selectHasApiKey({ settings: state.settings } as any)).toBe(false);
    });
  });
});
