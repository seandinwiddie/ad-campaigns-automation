import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../slice/settingsSlice';
import { setApiKey, clearApiKey, setOpenAiApiKey, clearOpenAiApiKey } from '../slice/settingsActions';
import { selectApiKey, selectHasAnyAiApiKey, selectHasApiKey, selectHasOpenAiApiKey, selectOpenAiApiKey } from '../slice/settingsSelectors';
import type { SettingsState } from '../types/settingsStateType';

function createTestStore(preloadedState?: { settings: SettingsState }) {
  return configureStore({
    reducer: { settings: settingsReducer },
    preloadedState,
  });
}

describe('Story 1: API Key Configuration', () => {
  describe('Given no stored API keys', () => {
    it('Then AI key selectors return false/null', () => {
      const store = createTestStore();
      const state = store.getState();
      const rootState = { settings: state.settings } as any;

      expect(selectApiKey(rootState)).toBeNull();
      expect(selectOpenAiApiKey(rootState)).toBeNull();
      expect(selectHasApiKey(rootState)).toBe(false);
      expect(selectHasOpenAiApiKey(rootState)).toBe(false);
      expect(selectHasAnyAiApiKey(rootState)).toBe(false);
    });
  });

  describe('When setApiKey is dispatched', () => {
    it('Then Gemini selectors reflect configured state', () => {
      const store = createTestStore();
      store.dispatch(setApiKey('gemini-test-key-12345'));
      const state = store.getState();
      const rootState = { settings: state.settings } as any;

      expect(selectApiKey(rootState)).toBe('gemini-test-key-12345');
      expect(selectHasApiKey(rootState)).toBe(true);
      expect(selectHasAnyAiApiKey(rootState)).toBe(true);
    });
  });

  describe('When setOpenAiApiKey is dispatched', () => {
    it('Then OpenAI selectors reflect configured state', () => {
      const store = createTestStore();
      store.dispatch(setOpenAiApiKey('openai-test-key-12345'));
      const state = store.getState();
      const rootState = { settings: state.settings } as any;

      expect(selectOpenAiApiKey(rootState)).toBe('openai-test-key-12345');
      expect(selectHasOpenAiApiKey(rootState)).toBe(true);
      expect(selectHasAnyAiApiKey(rootState)).toBe(true);
    });
  });

  describe('When AI keys are cleared', () => {
    it('Then selectors return empty state', () => {
      const store = createTestStore();
      store.dispatch(setApiKey('gemini-test-key-12345'));
      store.dispatch(setOpenAiApiKey('openai-test-key-12345'));
      store.dispatch(clearApiKey());
      store.dispatch(clearOpenAiApiKey());

      const state = store.getState();
      const rootState = { settings: state.settings } as any;

      expect(selectApiKey(rootState)).toBeNull();
      expect(selectOpenAiApiKey(rootState)).toBeNull();
      expect(selectHasApiKey(rootState)).toBe(false);
      expect(selectHasOpenAiApiKey(rootState)).toBe(false);
      expect(selectHasAnyAiApiKey(rootState)).toBe(false);
    });
  });
});
