import type { AppPage } from './appPageType';

export interface UiState {
  isLoading: boolean;
  activeModal: string | null;
  currentPage: AppPage;
  briefRawText: string;
  leonardoApiKeyInput: string;
  dropboxAccessTokenInput: string;
  elapsedSeconds: number;
}
