'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store';

/**
 * StoreProvider component that wraps its children with the Redux Provider.
 * This is used to provide the Redux store to the client-side components of the application.
 * 
 * **User Story:**
 * - As a developer, I want a high-level provider that injects the application 
 *   state into the React component tree for both the main app and the test environments.
 * 
 * @param children - The child components that require access to the Redux store.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
