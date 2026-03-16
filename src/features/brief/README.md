# Brief Feature

This feature turns raw JSON or YAML campaign input into the validated brief that drives the rest of the application.

## Composition
- `slice/`: Parsed brief state, selectors, reducer-local actions, and workflow-level brief actions.
- `thunks/`: Parsing and validation logic that normalizes user input into the canonical brief model.
- `listeners/`: Side effects that keep raw editor text and parsed brief state synchronized.
- `types/`: The brief, product, brand-guideline, validation-error, and feature-state contracts.
- `__tests__/`: Coverage for parsing, validation, and clear-brief workflow behavior.
