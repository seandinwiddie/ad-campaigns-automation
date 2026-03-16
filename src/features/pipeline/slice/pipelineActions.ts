/**
 * Re-exports pipeline slice actions so listeners and screens can drive orchestration without reducer coupling.
 */
import { pipelineSlice } from './pipelineSlice';

/**
 * Exported actions from the pipeline slice for managing the lifecycle 
 * of the generation workflow, including progress and error states.
 */
export const {
  startPipeline,
  advanceStep,
  setPipelineStatus,
  productCompleted,
  productFailed,
  pipelineComplete,
  pipelineFailed,
  pipelineError,
  setCurrentProduct,
  resetPipeline,
} = pipelineSlice.actions;
