/**
 * The Redux store configuration for the application.
 * 
 * **User Story:**
 * - As a developer, I want a single source of truth that integrates
 *   asynchronous side effects, local storage persistence, and real-time listeners.
 * 
 * Integrates various slice reducers and middleware including:
 * - Persistence (localStorage)
 * - Navigation listeners
 * - Brief workflow listeners
 * - Pipeline progress orchestration
 * - RTK Query API middleware
 */
import { configureStore } from '@reduxjs/toolkit';
import { initializeStore } from '@/app/persistenceMiddleware';
import { apiSlice } from '@/features/core/api/slice/apiSlice';
import { persistenceMiddleware } from '@/app/persistenceMiddleware';
import { briefListenerMiddleware } from '@/features/brief/listeners/briefListener';
import { settingsListenerMiddleware } from '@/features/core/settings/listeners/settingsListener';
import { listenerMiddleware } from '@/features/pipeline/listeners/pipelineListener';
import { rootReducer, type RootState } from '@/app/rootReducer';

/**
 * Factory function to create a configured Redux store instance.
 */
const makeStore = () => {
  const isDev = process.env.NODE_ENV === 'development';

  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const base = getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      })
        .prepend(settingsListenerMiddleware.middleware)
        .prepend(briefListenerMiddleware.middleware)
        .prepend(persistenceMiddleware.middleware)
        .prepend(listenerMiddleware.middleware)
        .concat(apiSlice.middleware);

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
    devTools: isDev,
  });
};

export const store = makeStore();

if (typeof window !== 'undefined') {
  initializeStore(store.dispatch);
}

export type { RootState };
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;
