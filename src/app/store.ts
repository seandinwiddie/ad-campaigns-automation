import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/features/core/api/slice/apiSlice';
import { initializeStore, persistenceMiddleware } from '@/app/persistenceMiddleware';
import { listenerMiddleware } from '@/features/pipeline/listeners/pipelineListener';
import { rootReducer, type RootState } from '@/app/rootReducer';

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const base = getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      })
        .prepend(persistenceMiddleware.middleware)
        .prepend(listenerMiddleware.middleware)
        .concat(apiSlice.middleware);

      const isDev = process.env.NODE_ENV === 'development';
      if (isDev && typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { createLogger } = require('redux-logger');
        return base.concat(
          createLogger({
            collapsed: true,
            duration: true,
            diff: true,
          })
        );
      }

      return base;
    },
    devTools: process.env.NODE_ENV === 'development',
  });
};

export const store = makeStore();

// Initialize the store from localStorage after the initial hydration cycle
// to avoid mismatch errors and keep components purely presentational.
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initializeStore(store.dispatch);
  }, 0);
}

export type { RootState };
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;
