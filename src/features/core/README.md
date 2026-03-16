# Core Infrastructure

This directory contains the shared infrastructure that the rest of the application builds on: provider access, saved credentials, and cross-screen UI state.

## Composition
- `api/`: Provider-facing integration layers for Leonardo and Dropbox.
- `settings/`: Durable credential storage and validation workflow orchestration.
- `ui/`: Global SPA routing, draft inputs, validation messages, and timing state.
- `types/`: Small shared vocabulary for the core domains themselves.
