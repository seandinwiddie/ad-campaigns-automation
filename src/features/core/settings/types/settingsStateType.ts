/**
 * Persisted application settings, primarily service credentials.
 */
export interface SettingsState {
  /** The validated Leonardo.ai API key. */
  leonardoApiKey: string | null;
  /** The validated Dropbox OAuth2 access token. */
  dropboxAccessToken: string | null;
}
