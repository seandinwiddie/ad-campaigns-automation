/**
 * Selectors for retrieving user settings and checking credential availability.
 */
import type { RootState } from '@/app/store';

export const selectLeonardoApiKey = (state: RootState): string | null => state.settings.leonardoApiKey;
export const selectHasLeonardoApiKey = (state: RootState): boolean =>
  state.settings.leonardoApiKey !== null && state.settings.leonardoApiKey.length > 0;
export const selectDropboxAccessToken = (state: RootState): string | null => state.settings.dropboxAccessToken;
export const selectHasDropboxAccessToken = (state: RootState): boolean =>
  state.settings.dropboxAccessToken !== null && state.settings.dropboxAccessToken.length > 0;
export const selectHasSavedCredentials = (state: RootState): boolean =>
  selectHasLeonardoApiKey(state) && selectHasDropboxAccessToken(state);
