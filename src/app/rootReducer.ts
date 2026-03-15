/**
 * The Root Reducer combines all feature-specific slices into a single state tree.
 * 
 * **User Story:**
 * - As a developer, I want a centralized state management structure that 
 *   modularly handles settings, brief extraction, asset generation, and compliance auditing.
 * 
 * Features managed:
 * - settings: API credentials
 * - ui: Navigation, current page, and global UI state
 * - brief: Campaign requirement data and validation
 * - assets: Source images and brand assets
 * - creative: Generation results and variants
 * - compliance: Asset checking results
 * - pipeline: Orchestration state of the generation process
 */
import { combineReducers } from '@reduxjs/toolkit';
import settingsReducer from '@/features/core/settings/slice/settingsSlice';
import uiReducer from '@/features/core/ui/slice/uiSlice';
import briefReducer from '@/features/brief/slice/briefSlice';
import assetsReducer from '@/features/assets/slice/assetsSlice';
import creativeReducer from '@/features/creative/slice/creativeSlice';
import complianceReducer from '@/features/compliance/slice/complianceSlice';
import pipelineReducer from '@/features/pipeline/slice/pipelineSlice';
import { apiSlice } from '@/features/core/api/slice/apiSlice';

/**
 * The combined root reducer for the Redux store.
 */
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

/**
 * The root state type, representing the structure of the entire Redux state.
 */
export type RootState = ReturnType<typeof rootReducer>;
