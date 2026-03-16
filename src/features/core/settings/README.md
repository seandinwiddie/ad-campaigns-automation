# Settings Feature

This feature manages validated provider credentials and the workflow that turns temporary form input into saved settings.

## Composition
- `slice/`: Credential reducers, selectors, public action re-exports, and workflow actions.
- `listeners/`: Middleware that validates credentials through the API slice and persists cleaned values.
- `types/`: The stored settings-state contract.
- `__tests__/`: Coverage for both reducer guarantees and listener orchestration.
