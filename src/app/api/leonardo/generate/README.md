# Leonardo Generate Route

This folder contains the server route for image generation requests.

## Files
- `route.ts`: Implements `POST /api/leonardo/generate`, trims and validates `prompt` plus `apiKey`, delegates generation to `generateLeonardoImage`, and forwards either the success payload or the upstream error/status.
- `route.test.ts`: Mocks the Leonardo client and verifies request validation, input trimming, and pass-through error handling at the HTTP boundary.
