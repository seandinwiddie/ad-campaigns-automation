import type { AppPage } from './appPageType';

/**
 * Status of an asynchronous validation check (e.g., API key validation).
 */
export type ValidationStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * Global state for the application's user interface.
 * Tracks navigation, input fields, and transient validation messages.
 */
export interface UiState {
  /** Global loading overlay indicator. */
  isLoading: boolean;
  /** Name of the modal currently overlaying the screen. */
  activeModal: string | null;
  /** The current high-level view/screen being displayed. */
  currentPage: AppPage;
  /** Raw JSON/YAML string from the brief editor. */
  briefRawText: string;
  /** Transient API key input in the Settings screen. */
  leonardoApiKeyInput: string;
  /** Transient access token input in the Settings screen. */
  dropboxAccessTokenInput: string;
  /** Validation state of the Leonardo API key input. */
  leonardoValidationStatus: ValidationStatus;
  /** Error or success details for Leonardo validation. */
  leonardoValidationMessage: string | null;
  /** Validation state of the Dropbox access token input. */
  dropboxValidationStatus: ValidationStatus;
  /** Error or success details for Dropbox validation. */
  dropboxValidationMessage: string | null;
  /** Counter for simulation or progress estimation. */
  elapsedSeconds: number;
}
