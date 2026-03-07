import { pipelineSlice } from './pipelineSlice';

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
