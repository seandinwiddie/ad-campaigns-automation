/**
 * Re-exports creative slice actions so the pipeline can manage variant lifecycle events from one surface.
 * It makes the creative workflow events available through a dedicated module, helping listeners,
 * tests, and UI code coordinate creative generation without importing the slice definition.
 *
 * **User Story:**
 * - As a developer orchestrating creative generation, I want one creative-actions module so I can
 *   initialize variants, record completed outputs, and handle failures from a stable API.
 */
import { creativeSlice } from './creativeSlice';

/**
 * Exported actions from the creative slice for initializing generation,
 * tracking output persistence, and handling failures.
 */
export const { initCreatives, creativeCompleted, creativePersisted, creativeFailed, resetCreatives } =
  creativeSlice.actions;
