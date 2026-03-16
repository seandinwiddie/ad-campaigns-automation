/**
 * Persisted application settings, primarily service credentials.
 * The state stores the validated provider tokens that need to survive beyond a single screen
 * so later API calls and pipeline steps can authenticate without re-reading form input.
 *
 * **User Story:**
 * - As a returning user, I want my approved Leonardo and Dropbox credentials stored in settings
 *   so the app can reuse them across screens and sessions.
 */
export interface SettingsState {
  /** The validated Leonardo.ai API key. */
  leonardoApiKey: string | null;
  /** The validated Dropbox OAuth2 access token. */
  dropboxAccessToken: string | null;
}
