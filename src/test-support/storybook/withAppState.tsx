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

export const createAppStorybookState = (): RootState =>
  rootReducer(undefined, { type: '@@storybook/INIT' });

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

export const withAppState: Decorator = (Story, context) => {
  const store = createAppStorybookStore((context.args as StoryArgsWithState).mockState);
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
