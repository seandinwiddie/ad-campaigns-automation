import { ScreenRouter } from '@/components/screens/ScreenRouter';

/**
 * The main entry point for the root route.
 * Renders the ScreenRouter to handle conditional navigation between screens.
 * 
 * **User Story:**
 * - As a developer, I want a single entry point that delegates routing 
 *   to a dedicated controller so I can maintain a clean root structure.
 */
export default function Page() {
  return <ScreenRouter />;
}
