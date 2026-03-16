# Assets Feature

This feature owns source-image resolution for the campaign pipeline. It tracks whether each product already has an asset, needs AI generation, or failed during processing.

## Composition
- `slice/`: Redux reducers, action re-exports, and selectors for the asset lifecycle and readiness flags.
- `types/`: Internal asset records plus simplified UI-facing asset models.
- `__tests__/`: Reducer and selector coverage for resolved, pending, and generated asset flows.
