import type { RootState } from '@/app/store';

export const selectApiKey = (state: RootState): string | null => state.settings.apiKey;
export const selectHasApiKey = (state: RootState): boolean =>
  state.settings.apiKey !== null && state.settings.apiKey.length > 0;
export const selectDropboxAccessToken = (state: RootState): string | null => state.settings.dropboxAccessToken;
export const selectHasDropboxAccessToken = (state: RootState): boolean =>
  state.settings.dropboxAccessToken !== null && state.settings.dropboxAccessToken.length > 0;
