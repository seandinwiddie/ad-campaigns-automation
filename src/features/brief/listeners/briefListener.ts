import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setBriefRawText } from '@/features/core/ui/slice/uiActions';
import { clearBrief } from '@/features/brief/slice/briefActions';
import { clearBriefEditor } from '@/features/brief/slice/briefWorkflowActions';

export const briefListenerMiddleware = createListenerMiddleware();

briefListenerMiddleware.startListening({
  actionCreator: clearBriefEditor,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(setBriefRawText(''));
    listenerApi.dispatch(clearBrief());
  },
});
