/**
 * Brief listener handles side effects related to campaign brief management.
 * It coordinates UI state resets when a brief is cleared.
 * 
 * **User Story:**
 * - As a user, when I clear my campaign brief, I want the editor and all related
 *   validation state to reset so I can start fresh.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setBriefRawText } from '@/features/core/ui/slice/uiActions';
import { clearBrief } from '@/features/brief/slice/briefActions';
import { clearBriefEditor } from '@/features/brief/slice/briefWorkflowActions';

/**
 * Listener middleware for brief-related side effects.
 */
export const briefListenerMiddleware = createListenerMiddleware();

/**
 * Listen for clearBriefEditor and synchronize both the UI raw text 
 * and the parsed brief state.
 */
briefListenerMiddleware.startListening({
  actionCreator: clearBriefEditor,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setBriefRawText(''));
    listenerApi.dispatch(clearBrief());
  },
});
