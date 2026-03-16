# Settings Listeners

This folder contains the setup orchestration that connects UI inputs to provider validation and durable settings.

## Files
- `settingsListener.ts`: Reads trimmed UI inputs, calls RTK Query validation mutations, maps provider failures into user-facing messages, persists cleaned credentials on save, and routes the app back to `home`.
