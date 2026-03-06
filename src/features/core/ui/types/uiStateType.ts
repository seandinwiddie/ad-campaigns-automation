import type { AppPage } from './appPageType';

export interface UiState {
  isLoading: boolean;
  activeModal: string | null;
  currentPage: AppPage;
  briefRawText: string;
  apiKeyInput: string;
  dropboxAccessTokenInput: string;
  elapsedSeconds: number;
}
