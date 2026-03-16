/**
 * Re-exports settings slice actions so credential updates stay decoupled from reducer internals.
 * This provides a stable action entry point for the rest of the app, keeping settings updates
 * explicit while hiding the slice declaration behind a smaller public surface.
 *
 * **User Story:**
 * - As a developer wiring settings flows, I want one module for credential actions so I can save or
 *   clear provider tokens without depending on the reducer implementation file.
 */
import { settingsSlice } from './settingsSlice';

/**
 * Exported actions from the settings slice for updating and clearing
 * persistent API credentials.
 */
export const {
  setLeonardoApiKey,
  clearLeonardoApiKey,
  setDropboxAccessToken,
  clearDropboxAccessToken,
} = settingsSlice.actions;
