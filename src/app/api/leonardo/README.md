# Leonardo API Namespace

This folder groups the Leonardo-specific App Router endpoints. The actual provider integration lives in `src/features/core/api/client`, while this namespace owns the HTTP boundary exposed by Next.js.

## Composition
- `generate/`: Image-generation endpoint that proxies long-running Leonardo jobs.
- `validate/`: Credential-validation endpoint used during setup.
