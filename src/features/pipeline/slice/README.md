# Pipeline Slice

These files define the Redux surface for pipeline orchestration state.

## Files
- `pipelineSlice.ts`: Stores the top-level lifecycle, per-product status records, current product, errors, progress rollups, and final business metrics.
- `pipelineActions.ts`: Re-exports the pipeline actions used by listeners and screens.
- `pipelineSelectors.ts`: Converts raw pipeline state into view models for progress and results screens, including labels, badges, durations, metrics, and credential-error detection.
