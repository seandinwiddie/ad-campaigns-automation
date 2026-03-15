import { createAction } from '@reduxjs/toolkit';

/**
 * Action dispatched to trigger the persistence of current credential inputs
 * into the application settings state.
 */
export const saveCredentialInputs = createAction('settings/saveCredentialInputs');
