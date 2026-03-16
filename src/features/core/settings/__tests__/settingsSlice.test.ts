/**
 * Covers the settings slice contract for storing and clearing external provider credentials.
 */
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../slice/settingsSlice';
import { setLeonardoApiKey, clearLeonardoApiKey } from '../slice/settingsActions';
import { selectLeonardoApiKey, selectHasLeonardoApiKey } from '../slice/settingsSelectors';
import type { SettingsState } from '../types/settingsStateType';

function createTestStore(preloadedState?: { settings: SettingsState }) {
  return configureStore({
    reducer: { settings: settingsReducer },
    preloadedState,
  });
}

describe('Story 1: API Key Configuration', () => {
  describe('Given no stored Leonardo API key', () => {
    it('Then selectHasLeonardoApiKey returns false', () => {
      const store = createTestStore();
      const state = store.getState();
      expect(selectHasLeonardoApiKey({ settings: state.settings } as any)).toBe(false);
    });

    it('Then selectLeonardoApiKey returns null', () => {
      const store = createTestStore();
      const state = store.getState();
      expect(selectLeonardoApiKey({ settings: state.settings } as any)).toBeNull();
    });
  });

  describe('When setLeonardoApiKey is dispatched', () => {
    it('Then selectLeonardoApiKey returns the key', () => {
      const store = createTestStore();
      store.dispatch(setLeonardoApiKey('leonardo-test-key-12345'));
      const state = store.getState();
      expect(selectLeonardoApiKey({ settings: state.settings } as any)).toBe('leonardo-test-key-12345');
    });

    it('Then selectHasLeonardoApiKey returns true', () => {
      const store = createTestStore();
      store.dispatch(setLeonardoApiKey('leonardo-test-key-12345'));
      const state = store.getState();
      expect(selectHasLeonardoApiKey({ settings: state.settings } as any)).toBe(true);
    });
  });

  describe('When clearLeonardoApiKey is dispatched', () => {
    it('Then selectLeonardoApiKey returns null', () => {
      const store = createTestStore();
      store.dispatch(setLeonardoApiKey('leonardo-test-key-12345'));
      store.dispatch(clearLeonardoApiKey());
      const state = store.getState();
      expect(selectLeonardoApiKey({ settings: state.settings } as any)).toBeNull();
    });

    it('Then selectHasLeonardoApiKey returns false', () => {
      const store = createTestStore();
      store.dispatch(setLeonardoApiKey('leonardo-test-key-12345'));
      store.dispatch(clearLeonardoApiKey());
      const state = store.getState();
      expect(selectHasLeonardoApiKey({ settings: state.settings } as any)).toBe(false);
    });
  });
});
