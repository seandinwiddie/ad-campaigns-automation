/**
 * Storybook decorator for providing a mock Redux store to components.
 * Enables stories to simulate different application states (e.g. loaded brief, pending pipeline).
 */
import type { Decorator } from '@storybook/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer, type RootState } from '@/app/rootReducer';
import { apiSlice } from '@/features/core/api/slice/apiSlice';
import { briefListenerMiddleware } from '@/features/brief/listeners/briefListener';
import { settingsListenerMiddleware } from '@/features/core/settings/listeners/settingsListener';

type StoryArgsWithState = {
  mockState?: Partial<RootState>;
};

/**
 * Computes the initial root state for storybook environment.
 * 
 * @returns The default root state of the application.
 */
export const createAppStorybookState = (): RootState =>
  rootReducer(undefined, { type: '@@storybook/INIT' });

/**
 * Creates a mock Redux store for storybook stories.
 * 
 * @param mockState - Optional partial state to override the default state.
 * @returns A configured Redux store.
 */
export const createAppStorybookStore = (mockState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...createAppStorybookState(),
      ...mockState,
    } as RootState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .prepend(settingsListenerMiddleware.middleware)
        .prepend(briefListenerMiddleware.middleware)
        .concat(apiSlice.middleware),
  });

/**
 * Storybook decorator that wraps components in a Redux Provider with a mock store.
 * Expects `mockState` to be provided in the story's `args`.
 * 
 * @param Story - The story component.
 * @param context - The story context containing args.
 */
export const withAppState: Decorator = (Story, context) => {
  const store = createAppStorybookStore((context.args as StoryArgsWithState).mockState);
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
