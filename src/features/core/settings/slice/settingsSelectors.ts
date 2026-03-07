import type { RootState } from '@/app/store';

export const selectApiKey = (state: RootState): string | null => state.settings.apiKey;
export const selectHasApiKey = (state: RootState): boolean =>
  state.settings.apiKey !== null && state.settings.apiKey.length > 0;
export const selectOpenAiApiKey = (state: RootState): string | null => state.settings.openAiApiKey;
export const selectHasOpenAiApiKey = (state: RootState): boolean =>
  state.settings.openAiApiKey !== null && state.settings.openAiApiKey.length > 0;
export const selectHasAnyAiApiKey = (state: RootState): boolean =>
  selectHasApiKey(state) || selectHasOpenAiApiKey(state);
export const selectPollinationsApiKey = (state: RootState): string | null => state.settings.pollinationsApiKey;
export const selectHasPollinationsApiKey = (state: RootState): boolean =>
  state.settings.pollinationsApiKey !== null && state.settings.pollinationsApiKey.length > 0;
export const selectDropboxAccessToken = (state: RootState): string | null => state.settings.dropboxAccessToken;
export const selectHasDropboxAccessToken = (state: RootState): boolean =>
  state.settings.dropboxAccessToken !== null && state.settings.dropboxAccessToken.length > 0;
