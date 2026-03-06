import type { RootState } from '@/app/store';

export const selectIsLoading = (state: RootState): boolean => state.ui.isLoading;
export const selectActiveModal = (state: RootState): string | null => state.ui.activeModal;
export const selectCurrentPage = (state: RootState) => state.ui.currentPage;
export const selectBriefRawText = (state: RootState): string => state.ui.briefRawText;
export const selectApiKeyInput = (state: RootState): string => state.ui.apiKeyInput;
export const selectDropboxAccessTokenInput = (state: RootState): string => state.ui.dropboxAccessTokenInput;
export const selectElapsedSeconds = (state: RootState): number => state.ui.elapsedSeconds;
