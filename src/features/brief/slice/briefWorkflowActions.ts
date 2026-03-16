/**
 * Declares workflow-level brief actions that listeners translate into coordinated UI and state resets.
 * This separates higher-level orchestration intents from reducer-local actions so middleware can
 * respond to a single semantic event and fan that out into multiple state changes.
 *
 * **User Story:**
 * - As a user clearing the brief editor, I want one workflow action to reset every related part of the
 *   brief experience so the form and parsed state return to a clean starting point together.
 */
import { createAction } from '@reduxjs/toolkit';

/**
 * Action dispatched to clear the current content within the brief editor UI.
 */
export const clearBriefEditor = createAction('brief/clearBriefEditor');
