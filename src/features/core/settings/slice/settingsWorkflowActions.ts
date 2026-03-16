/**
 * Declares settings workflow actions that listeners expand into validation and persistence side effects.
 * This semantic action layer lets middleware coordinate trimming, validation, persistence, and navigation
 * from a single intent without overloading the reducer with cross-feature side effects.
 *
 * **User Story:**
 * - As a user saving my service credentials, I want one save action to trigger validation and persistence
 *   so the setup flow behaves like a single step instead of several manual operations.
 */
import { createAction } from '@reduxjs/toolkit';

/**
 * Action dispatched to trigger the persistence of current credential inputs
 * into the application settings state.
 */
export const saveCredentialInputs = createAction('settings/saveCredentialInputs');
