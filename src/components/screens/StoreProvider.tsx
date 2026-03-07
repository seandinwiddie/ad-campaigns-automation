'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { initializeStore } from '@/app/persistenceMiddleware';

let initialized = false;

const ensureStoreInitialized = (): void => {
  if (initialized || typeof window === 'undefined') {
    return;
  }
  initializeStore(store.dispatch);
  initialized = true;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  ensureStoreInitialized();
  return <Provider store={store}>{children}</Provider>;
}
