'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { initializeStore } from '@/app/persistenceMiddleware';

// Initialize store synchronously on module load (client-side only)
if (typeof window !== 'undefined') {
  initializeStore(store.dispatch);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
