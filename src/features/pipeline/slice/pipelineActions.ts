import { pipelineSlice } from './pipelineSlice';

export const {
  startPipeline,
  advanceStep,
  setPipelineStatus,
  prepareLocalization,
  setLocalizedCampaignMessage,
  productCompleted,
  productFailed,
  pipelineComplete,
  pipelineFailed,
  pipelineError,
  setCurrentProduct,
  resetPipeline,
} = pipelineSlice.actions;
