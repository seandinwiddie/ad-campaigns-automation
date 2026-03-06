import { creativeSlice } from './creativeSlice';

export const { initCreatives, creativeCompleted, creativePersisted, creativeFailed, resetCreatives } =
  creativeSlice.actions;
