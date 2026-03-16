# Creative Feature

This feature expands each product into multiple ad-format variants and tracks those outputs through composition and persistence.

## Composition
- `constants/`: Canonical format registry with names, dimensions, and aspect-ratio labels.
- `slice/`: Creative-state reducers, public action re-exports, output-path helpers, and gallery selectors.
- `thunks/`: Image-processing helpers used during creative composition.
- `types/`: Variant, metadata, status, and state contracts for the creative workflow.
- `__tests__/`: Coverage for job fan-out and aggregate progress tracking.
