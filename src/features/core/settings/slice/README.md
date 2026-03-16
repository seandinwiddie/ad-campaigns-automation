# Settings Slice

These files define the Redux API for validated provider credentials.

## Files
- `settingsSlice.ts`: Stores the durable Leonardo and Dropbox credentials after validation.
- `settingsActions.ts`: Re-exports the credential actions used outside the reducer file.
- `settingsSelectors.ts`: Exposes raw credentials and readiness checks for the rest of the app.
- `settingsWorkflowActions.ts`: Declares the semantic `saveCredentialInputs` action that middleware expands into validation, persistence, and navigation.
