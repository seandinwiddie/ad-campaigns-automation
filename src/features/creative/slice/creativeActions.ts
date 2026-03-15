import { creativeSlice } from './creativeSlice';

/**
 * Exported actions from the creative slice for initializing generation,
 * tracking output persistence, and handling failures.
 */
export const { initCreatives, creativeCompleted, creativePersisted, creativeFailed, resetCreatives } =
  creativeSlice.actions;
