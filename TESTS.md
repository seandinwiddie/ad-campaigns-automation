# Test Strategy

This project uses three complementary test layers:

1. **BDD slice tests (Jest)**
2. **UI workflow tests (Playwright E2E)**
3. **Component/system visual tests (Storybook + Storybook test-runner)**

## 1) BDD Tests (Jest)

These tests validate reducer/thunk behavior and state transitions from user-story scenarios.

Run:

```bash
npm test -- --runInBand
```

Current suites include:

- `src/features/core/settings/__tests__/settingsSlice.test.ts`
- `src/features/brief/__tests__/briefSlice.test.ts`
- `src/features/assets/__tests__/assetsSlice.test.ts`
- `src/features/creative/__tests__/creativeSlice.test.ts`
- `src/features/compliance/__tests__/complianceSlice.test.ts`
- `src/features/pipeline/__tests__/pipelineSlice.test.ts`
- `src/features/core/ui/__tests__/uiSlice.test.ts`
- `src/features/core/api/slice/apiSlice.test.ts`

## 2) Playwright E2E

These tests validate end-to-end UX and user flows in the browser.

Run:

```bash
npm run test:e2e
```

For more stable local runs (reduced parallel flake), use:

```bash
npm run test:e2e -- --workers=1
```

Current E2E coverage includes:

- Settings credential validation:
  - valid Gemini key
  - invalid Gemini key with explicit reason
  - valid Dropbox token
  - invalid Dropbox token with explicit reason
- Pipeline execution flows:
  - organized output view by product + aspect ratio
  - localization flow
  - invalid API key error path
  - missing credential path with explicit reason and recovery action (`Open Settings`)

## 3) Storybook + Storybook Test Runner

Storybook is used for component-level rendering and interaction coverage.

Start Storybook:

```bash
npm run storybook
```

Run Storybook tests (requires Storybook server running):

```bash
npm run test:storybook
```

Recommended workflow:

1. Start Storybook (`npm run storybook`)
2. In a second terminal, run `npm run test:storybook`

## Credential Matrix Checks

To validate behavior with and without local credentials:

1. Run E2E with current `.env.local`
2. Run E2E again with `.env.local` temporarily blanked
3. Restore `.env.local`

Expected behavior:

- UI should always show explicit failure reasons for invalid key/token.
- Pipeline should show explicit reason + recovery action when required credentials are missing.
