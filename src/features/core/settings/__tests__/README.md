# Settings Tests

These tests cover both the saved-settings reducer and the setup orchestration layer.

## Files
- `settingsSlice.test.ts`: Verifies storing, clearing, and checking availability of saved credentials.
- `settingsListener.test.ts`: Confirms that input values are trimmed, provider validation results are written to UI state, and successful saves persist credentials before navigating home.
