# Brief Slice

These files define the Redux API for loading, clearing, and reading the campaign brief.

## Files
- `briefSlice.ts`: Stores the parsed brief, validation status, loading state, and validation errors, and consumes `loadBrief`.
- `briefActions.ts`: Re-exports the slice actions used to reset or clear brief state.
- `briefWorkflowActions.ts`: Declares the higher-level `clearBriefEditor` action that listeners translate into coordinated resets.
- `briefSelectors.ts`: Exposes raw brief data plus derived values such as product count, product IDs, and the run-button label.
