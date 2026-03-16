# Pipeline Feature

This feature orchestrates the end-to-end automation run, from brief validation and asset handling through creative composition, upload, compliance checks, and final metrics.

## Composition
- `listeners/`: End-to-end workflow orchestration plus browser-side image utilities used during composition and audit steps.
- `slice/`: Pipeline state machine, public actions, and UI-facing progress and results selectors.
- `types/`: Top-level pipeline, per-product progress, metrics, and error contracts.
- `__tests__/`: Reducer-focused coverage for state transitions, per-product outcomes, and completion metrics.
