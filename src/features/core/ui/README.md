# UI Feature

This feature owns the app-wide SPA shell state: page routing, temporary form inputs, validation messages, loading flags, modal state, and the pipeline timer.

## Composition
- `slice/`: Reducers, public actions, and selectors for the global UI store.
- `types/`: Navigation and UI-state contracts.
- `__tests__/`: Coverage for routing, draft-state, and timer behavior.
