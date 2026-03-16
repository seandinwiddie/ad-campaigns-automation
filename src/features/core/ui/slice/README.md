# UI Slice

These files define the Redux surface for global UI state.

## Files
- `uiSlice.ts`: Stores page selection, the example brief template, temporary credential inputs, validation states and messages, modal/loading flags, and elapsed pipeline time.
- `uiActions.ts`: Re-exports the UI actions used by screens, listeners, and tests.
- `uiSelectors.ts`: Exposes raw UI state plus derived values such as trimmed inputs and button-enabled conditions.
