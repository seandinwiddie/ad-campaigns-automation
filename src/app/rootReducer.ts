import { combineReducers } from '@reduxjs/toolkit';
import settingsReducer from '@/features/core/settings/slice/settingsSlice';
import uiReducer from '@/features/core/ui/slice/uiSlice';
import briefReducer from '@/features/brief/slice/briefSlice';
import assetsReducer from '@/features/assets/slice/assetsSlice';
import creativeReducer from '@/features/creative/slice/creativeSlice';
import complianceReducer from '@/features/compliance/slice/complianceSlice';
import pipelineReducer from '@/features/pipeline/slice/pipelineSlice';
import { apiSlice } from '@/features/core/api/slice/apiSlice';

export const rootReducer = combineReducers({
  settings: settingsReducer,
  ui: uiReducer,
  brief: briefReducer,
  assets: assetsReducer,
  creative: creativeReducer,
  compliance: complianceReducer,
  pipeline: pipelineReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
