/**
 * Re-exports brief slice actions so workflows can reset parsed brief state without importing the reducer.
 */
import { briefSlice } from './briefSlice';

/**
 * Exported actions from the brief slice for clearing or resetting the campaign brief state.
 */
export const { resetBrief, clearBrief } = briefSlice.actions;
