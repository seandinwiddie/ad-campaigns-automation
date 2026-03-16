/**
 * Re-exports brief slice actions so workflows can reset parsed brief state without importing the reducer.
 * It defines the public action surface for brief state transitions, keeping listener code and UI
 * interactions decoupled from the internal slice declaration.
 *
 * **User Story:**
 * - As a developer connecting brief workflows, I want a single module for brief actions so I can
 *   reset or clear parsed brief state without reaching into the reducer implementation.
 */
import { briefSlice } from './briefSlice';

/**
 * Exported actions from the brief slice for clearing or resetting the campaign brief state.
 */
export const { resetBrief, clearBrief } = briefSlice.actions;
