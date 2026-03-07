# Leonardo-Only MVP Plan

## Objective

Ship a clean, working MVP that:

- accepts a campaign brief in JSON or YAML
- generates missing hero images with Leonardo AI only
- composes creatives in `1:1`, `9:16`, and `16:9`
- uploads outputs to Dropbox
- reports pipeline and compliance results in the UI

## In Scope

- Leonardo API key entry and validation
- Dropbox access token entry and validation
- Leonardo generation via internal Next.js API routes
- Redux-driven pipeline orchestration
- Jest, Playwright, and Storybook coverage for the Leonardo-only flow
- docs that match the current implementation

## Out of Scope For MVP

- localization or translation
- additional image providers
- any additional provider integrations
- alternate storage backends

## Implementation Plan

1. Remove all non-Leonardo provider state, routes, tests, stories, and docs.
2. Keep Leonardo requests behind server routes so the browser uses internal endpoints.
3. Keep localization commented out in orchestration and document it as post-MVP.
4. Verify lint, typecheck, unit tests, build, and then E2E and Storybook coverage.
5. Leave `dev-other` as the branch holding the pre-cleanup snapshot for future integrations.

## Post-MVP Backlog

- add a dedicated text provider for localization
- add translated metadata fields when localization returns
- evaluate multi-provider abstraction only after Leonardo MVP is stable
