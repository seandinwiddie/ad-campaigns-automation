/**
 * Declares workflow-level brief actions that listeners translate into coordinated UI and state resets.
 */
import { createAction } from '@reduxjs/toolkit';

/**
 * Action dispatched to clear the current content within the brief editor UI.
 */
export const clearBriefEditor = createAction('brief/clearBriefEditor');
