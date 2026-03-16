/**
 * Verifies that clearing the brief editor resets both the raw draft text and the parsed brief state.
 * The test captures the coordinated behavior between the brief listener and the UI slice so
 * the text editor and validated brief snapshot cannot drift apart after a reset action.
 *
 * **User Story:**
 * - As a user starting over on my campaign brief, I want one clear action to wipe both the editor text
 *   and the parsed brief results so I do not accidentally run the pipeline with stale data.
 */
import { configureStore } from '@reduxjs/toolkit';
import briefReducer from '@/features/brief/slice/briefSlice';
import { briefListenerMiddleware } from '@/features/brief/listeners/briefListener';
import { clearBriefEditor } from '@/features/brief/slice/briefWorkflowActions';
import uiReducer from '@/features/core/ui/slice/uiSlice';
import { setBriefRawText } from '@/features/core/ui/slice/uiActions';

const createTestStore = () =>
  configureStore({
    reducer: {
      brief: briefReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).prepend(briefListenerMiddleware.middleware),
  });

describe('briefListener', () => {
  it('clears both the raw brief input and brief state', () => {
    const store = createTestStore();

    store.dispatch(setBriefRawText('campaignName: Spring Launch'));
    store.dispatch({
      type: 'brief/loadBrief/fulfilled',
      payload: {
        campaignName: 'Spring Launch',
        products: [
          { id: 'eco-bottle', name: 'EcoBottle', description: 'Reusable bottle' },
          { id: 'solar-charger', name: 'SolarCharger', description: 'Portable charger' },
        ],
        targetRegion: 'United States',
        targetAudience: 'Eco-conscious commuters',
        campaignMessage: 'Stay Green, Live Clean',
      },
    });

    store.dispatch(clearBriefEditor());

    const state = store.getState();
    expect(state.ui.briefRawText).toBe('');
    expect(state.brief.brief).toBeNull();
    expect(state.brief.isValid).toBe(false);
  });
});
