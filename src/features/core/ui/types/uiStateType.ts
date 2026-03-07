import type { AppPage } from './appPageType';

export type ValidationStatus = 'idle' | 'pending' | 'success' | 'error';

export interface UiState {
  isLoading: boolean;
  activeModal: string | null;
  currentPage: AppPage;
  briefRawText: string;
  leonardoApiKeyInput: string;
  dropboxAccessTokenInput: string;
  leonardoValidationStatus: ValidationStatus;
  leonardoValidationMessage: string | null;
  dropboxValidationStatus: ValidationStatus;
  dropboxValidationMessage: string | null;
  elapsedSeconds: number;
}
