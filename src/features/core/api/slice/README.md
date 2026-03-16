# API Slice

This folder contains the browser-facing async boundary for provider communication.

## Files
- `apiSlice.ts`: Defines RTK Query mutations for Leonardo validation, Leonardo image generation, Dropbox token validation, and Dropbox creative upload, and exports the generated hooks.
- `apiSlice.test.ts`: Verifies that HTTP success and failure responses are normalized into the data and error shapes expected by the rest of the app.
