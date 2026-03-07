# Test Strategy

This repo currently verifies a Leonardo-only MVP across unit, E2E, and Storybook layers.

## Core checks

```bash
npm run lint
./node_modules/.bin/tsc --noEmit
npm test -- --runInBand
npm run build
```

## E2E

```bash
npm run test:e2e
```

Current E2E coverage focuses on:

- Leonardo credential validation
- Dropbox credential validation
- successful pipeline execution
- missing credential recovery
- explicit Leonardo error reporting
- MVP behavior with localization disabled

## Storybook

```bash
npm run storybook
npm run test:storybook
```

Storybook stories should reflect the live Leonardo-only state model and error messages.

## Post-MVP

- Localization-specific E2E scenarios return after a dedicated text provider is selected.
