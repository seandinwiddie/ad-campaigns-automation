/**
 * Re-exports pipeline slice actions so listeners and screens can drive orchestration without reducer coupling.
 * It provides the public action surface for starting runs, advancing stages, recording product results,
 * and resetting the workflow from outside the slice module.
 *
 * **User Story:**
 * - As a developer wiring the automation flow, I want one pipeline-actions module so screens and listeners
 *   can coordinate the workflow without importing the reducer implementation directly.
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
