import { briefSlice } from './briefSlice';

/**
 * Exported actions from the brief slice for clearing or resetting the campaign brief state.
 */
export const { resetBrief, clearBrief } = briefSlice.actions;
