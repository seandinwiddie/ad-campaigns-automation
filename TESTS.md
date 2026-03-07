# Test Strategy

This project uses three complementary test layers:

1. **BDD slice tests (Jest)**
2. **UI workflow tests (Playwright E2E)**
3. **Component/system visual tests (Storybook + Storybook test-runner)**

## 1) BDD Tests (Jest)

These tests validate reducer/thunk behavior and state transitions from user-story scenarios.

Rule:

- Example/demo briefs may contain concrete sample product names.
- Automated tests must derive names and assertions from the fixture data they pass into the system, not from standalone hard-coded product-name literals.

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
- `src/features/core/api/slice/apiSlice.test.ts` (generateImage: Gemini→OpenAI→Pollinations fallback chain)

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

If your default Playwright port is already in use locally, override it:

```bash
PLAYWRIGHT_PORT=3002 npm run test:e2e -- --workers=1
```

Current E2E coverage includes:

- First load with no credentials: user lands on Home (not Settings)
- Settings credential validation:
  - valid Gemini key
  - invalid Gemini key with explicit reason
  - valid OpenAI key
  - invalid OpenAI key with explicit reason
  - valid Dropbox token
  - invalid Dropbox token with explicit reason
- Pipeline execution flows:
  - organized output view by product + aspect ratio
  - localization flow
  - invalid API key error path
  - OpenAI-only credential path (no Gemini key required)
  - Gemini failure fallback to OpenAI (DALL-E 3, then DALL-E 2)
  - DALL-E 2 fallback when DALL-E 3 fails
  - Gemini and OpenAI both fail → Pollinations.ai free fallback
  - no-credentials path: validate and run enabled, Pollinations free fallback
  - credentials removed in Settings: validate and run remain enabled
  - missing Dropbox token path with Results download fallback
  - invalid Dropbox upload path with Results download fallback

## 3) Storybook + Storybook Test Runner

Storybook is used for component-level rendering and interaction coverage.

Rule:

- Storybook demo/sample content may use example product names.
- Story fixtures should still wire component state from passed mock data rather than baking product-name assumptions into component logic or test assertions.

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

- With no credentials: user lands on Home; `Validate & Load Brief` and `Run Pipeline` are enabled (Pollinations free fallback).
- UI should always show explicit failure reasons for invalid key/token.
- Optional Gemini or OpenAI keys improve results but are not required.
- If Dropbox is missing or invalid, the pipeline should still complete and expose `Download PNG` actions in Results.
