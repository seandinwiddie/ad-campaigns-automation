/**
 * Covers the UI slice contract for navigation, draft inputs, and elapsed-time tracking.
 */
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slice/uiSlice';
import {
  setCurrentPage,
  setBriefRawText,
  loadExampleBriefText,
  setLeonardoApiKeyInput,
  incrementElapsed,
  resetElapsed,
} from '../slice/uiActions';
import {
  selectCurrentPage,
  selectBriefRawText,
  selectLeonardoApiKeyInput,
  selectElapsedSeconds,
} from '../slice/uiSelectors';

function createTestStore() {
  return configureStore({
    reducer: { ui: uiReducer },
  });
}

describe('Story 0: UI State and SPA Routing', () => {
  describe('Given default state', () => {
    it('Then current page starts on settings', () => {
      const store = createTestStore();
      const state = store.getState();
      expect(selectCurrentPage({ ui: state.ui } as any)).toBe('settings');
    });
  });

  describe('When setCurrentPage is dispatched', () => {
    it('Then SPA route is updated in Redux state', () => {
      const store = createTestStore();
      store.dispatch(setCurrentPage('home'));
      const state = store.getState();
      expect(selectCurrentPage({ ui: state.ui } as any)).toBe('home');
    });
  });

  describe('When setBriefRawText is dispatched', () => {
    it('Then brief form state is stored in Redux', () => {
      const store = createTestStore();
      store.dispatch(setBriefRawText('campaignName: Spring Launch'));
      const state = store.getState();
      expect(selectBriefRawText({ ui: state.ui } as any)).toBe('campaignName: Spring Launch');
    });
  });

  describe('When loadExampleBriefText is dispatched', () => {
    it('Then brief input is populated with template content', () => {
      const store = createTestStore();
      store.dispatch(loadExampleBriefText());
      const state = store.getState();
      const briefText = selectBriefRawText({ ui: state.ui } as any);
      expect(briefText).toContain('campaignName');
      expect(briefText).toContain('products');
    });
  });

  describe('When setLeonardoApiKeyInput is dispatched', () => {
    it('Then Leonardo API key form input is tracked in Redux', () => {
      const store = createTestStore();
      store.dispatch(setLeonardoApiKeyInput('leonardo-test-key'));
      const state = store.getState();
      expect(selectLeonardoApiKeyInput({ ui: state.ui } as any)).toBe('leonardo-test-key');
    });
  });

  describe('When incrementElapsed and resetElapsed are dispatched', () => {
    it('Then elapsed timer is incremented and reset by reducers', () => {
      const store = createTestStore();
      store.dispatch(incrementElapsed());
      store.dispatch(incrementElapsed());
      expect(selectElapsedSeconds({ ui: store.getState().ui } as any)).toBe(2);

      store.dispatch(resetElapsed());
      expect(selectElapsedSeconds({ ui: store.getState().ui } as any)).toBe(0);
    });
  });
});
