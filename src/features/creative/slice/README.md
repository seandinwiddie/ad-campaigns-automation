# Creative Slice

These files define the Redux API for multi-format creative generation.

## Files
- `creativeSlice.ts`: Initializes per-product creative jobs, tracks completion or failure, stores persisted output metadata, calculates progress, and builds default output paths.
- `creativeActions.ts`: Re-exports the public creative actions used by listeners and tests.
- `creativeSelectors.ts`: Maps raw creative state into gallery-ready view models grouped by product with ratio metadata and display-friendly error information.
