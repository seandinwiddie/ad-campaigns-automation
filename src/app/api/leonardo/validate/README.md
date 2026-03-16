# Leonardo Validate Route

This folder contains the server route for Leonardo credential checks.

## Files
- `route.ts`: Implements `POST /api/leonardo/validate`, trims and validates `apiKey`, delegates to `validateLeonardoApiKey`, and returns either the provider result or the original failure/status.
- `route.test.ts`: Mocks the Leonardo client and verifies missing-key handling, malformed JSON behavior, input trimming, and HTTP error forwarding.
