# TODO — Creative Automation Pipeline

> Implementation checklist derived from [PLAN.MD](./PLAN.MD).
> Mark `[/]` for in-progress, `[x]` for done.

## Hard Constraints (Must Follow)

- [/] **Keep all business logic in pure reducers inside `*Slice.ts` files**
- [/] Non-slice files may exist only as thin, logic-free adapters/wiring when unavoidable

---

## Phase 0: BDD Test Harness
> **Write ALL Given-When-Then scenarios as failing tests BEFORE any implementation.**

- [x] Set up Jest + `@testing-library/react` for BDD slice/component tests
- [x] Set up Playwright for E2E browser tests
- [x] **Story 1 tests**: API Key Configuration
  - [x] `settingsSlice.test.ts` — reducer/selector behavior for API key set/clear state transitions
- [x] **Story 2 tests**: Campaign Brief Input
  - [x] `briefSlice.test.ts` — valid JSON accepted, valid YAML accepted, invalid brief rejected with field-level errors
- [x] **Story 3 tests**: Asset Resolution
  - [x] `assetsSlice.test.ts` — existing asset reused (no GenAI call), missing asset triggers generation
- [x] **Story 4 tests**: Multi-Format Creative Generation
  - [x] `creativeSlice.test.ts` — 1:1, 9:16, 16:9 outputs produced; campaign message overlaid
- [x] **Story 5 tests**: Organized Output
  - [x] E2E test — output gallery renders product/aspect-ratio variants after pipeline completion
- [x] **Story 6 tests**: Pipeline Progress & Success Metrics
  - [x] `pipelineSlice.test.ts` — state machine: idle → running → complete/error; metrics calculated
- [x] **Story 7 tests**: Brand Compliance (Bonus)
  - [x] `complianceSlice.test.ts` — brand color detection, prohibited word flagging
- [x] **Story 8 tests**: Error Handling & Recovery
  - [x] `pipelineSlice.test.ts` — one product fails, others succeed; invalid API key prompts settings
- [x] **Story 9 tests**: Multi-Language Localization
  - [x] E2E test — campaign message localized for target region, English preserved in metadata


---

## Phase 1: Project Scaffolding
> Next.js + TypeScript + Redux Toolkit + Docker + UI libraries.

- [x] Initialize Next.js App Router project with TypeScript
  ```bash
  npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'
  ```
- [x] Install core dependencies
  ```bash
  npm install @reduxjs/toolkit react-redux js-yaml sharp canvas
  ```
- [x] **shadcn/ui setup**
  ```bash
  pnpm dlx shadcn@latest init
  pnpm dlx shadcn@latest add button input card progress form table tabs dialog
  ```
  - [x] Verify components available under `src/components/elements/generic/`
- [x] **VengeanceUI setup**
  ```bash
  npm install tailwindcss @tailwindcss/postcss postcss
  npm install framer-motion clsx tailwind-merge lucide-react
  ```
  - [x] Create `postcss.config.mjs` with `@tailwindcss/postcss` plugin
  - [x] Add `@import "tailwindcss";` to `src/app/globals.css`
  - [x] Create `src/common/cn.ts` with shared `cn` helper
  ```bash
  npx vengeance-ui add animated-button animated-hero logo-slider glow-border-card
  ```
- [x] Create directory structure per PLAN.MD (3 files per domain: *Slice.ts, *Selectors.ts, *Thunks.ts)
  - [x] `src/features/core/` — `types/` (`*Type.ts`), apiSlice, uiSlice + uiSelectors, settingsSlice + settingsSelectors, `__tests__` folders as siblings to `slice/`
  - [x] `src/features/brief/` — briefSlice + briefSelectors, thunks/briefThunks, types, __tests__
  - [x] `src/features/assets/` — assetsSlice + assetsSelectors, generationApi, types, __tests__
  - [x] `src/features/creative/` — creativeSlice + creativeSelectors, constants, thunks (resize/compose), types, __tests__
  - [x] `src/features/compliance/` — complianceSlice + complianceSelectors, __tests__
  - [x] `src/features/pipeline/` — pipelineSlice + pipelineSelectors, pipelineListener, __tests__
  - [x] `src/components/elements/generic/` — shadcn/ui primitives (Button, Card, Input, Progress, Table, Alert, Badge, Heading, Text, Textarea, Label, ImageCard, StatusList)
  - [x] `src/components/elements/unique/` — BriefEditor, PipelineProgress, OutputGallery, ComplianceReport (composed of generic only)
  - [x] `src/components/screens/` — StoreProvider, ScreenRouter, SettingsScreen, HomeScreen, PipelineScreen, ResultsScreen (composed of generic + unique)
  - [x] `src/app/` — layout.tsx, page.tsx (single SPA entry), globals.css, rootReducer.ts, store.ts, hooks.ts, persistenceMiddleware.ts
  - [x] `briefs/example-brief.json`, `briefs/example-brief.yaml`
  - [x] `public/assets/input/`, `public/briefs/example-brief.json`
  - [x] `stories/`
- [x] Create `Dockerfile` with node-canvas system deps (cairo, pango, libjpeg)
- [x] Create `docker-compose.yml` with volume mounts for `briefs/`, `output/`, `public/assets/input/`
- [x] Create `.env.example` (document env vars, no values)
- [x] Add `output/` to `.gitignore`

---

## Phase 2: Redux Store Foundation
> All state in Redux. Zero React logic. Fat reducers, thin actions.

- [x] **`store.ts`** — `configureStore` with RTK Query middleware, redux-logger
- [x] **`rootReducer.ts`** — centralized reducer composition for app state
- [x] **Typed hooks** — `useAppDispatch`, `useAppSelector` in `src/app/hooks.ts`
- [x] **`apiSlice.ts`** — RTK Query base API slice (Gemini base URL)
- [x] **`settingsSlice.ts`** — API key state + persistence listener middleware (localStorage)
  - [x] Reducers: `setApiKey`, `clearApiKey`, `setDropboxAccessToken`, `clearDropboxAccessToken`
  - [x] **`settingsSelectors.ts`** — `selectApiKey`, `selectHasApiKey`, `selectDropboxAccessToken`, `selectHasDropboxAccessToken`
- [x] **`uiSlice.ts`** — modals, nav, loading states
  - [x] Reducer: `setLoading`, `setActiveModal`, `setCurrentPage`
  - [x] **`uiSelectors.ts`** — `selectIsLoading`, `selectActiveModal`, `selectCurrentPage`, `selectBriefRawText`, `selectApiKeyInput`, `selectDropboxAccessTokenInput`, `selectElapsedSeconds`
- [x] Verify: all tests from Phase 0 Story 1 pass

---

## Phase 3: Campaign Brief Domain
> Brief parsing, validation, and type definitions — all in pure reducers.

- [x] **Brief types** (`*Type.ts`, one per file) — `campaignBriefType.ts`, `productType.ts`, `brandGuidelinesType.ts`, `validationErrorType.ts`, `briefStateType.ts`
- [x] **`briefThunks.ts`** (`features/brief/thunks/`) encapsulates parse/validate logic: JSON/YAML → `CampaignBrief` (uses `js-yaml`)
- [x] **`briefSlice.ts`** — pure reducers ONLY:
  - [x] `resetBrief`, `clearBrief` — reset state
  - [x] extraReducers for `loadBrief` thunk (pending/fulfilled/rejected)
- [x] **`briefSelectors.ts`** — `selectBrief`, `selectProducts`, `selectValidationErrors`, `selectIsBriefValid`, `selectBriefLoading`
- [x] **`briefThunks.ts`** (`features/brief/thunks/`) — `loadBrief` async thunk (parse raw input, validate required fields)
- [x] **`briefSlice.test.ts`** — BDD scenarios from Story 2
- [x] Create `briefs/example-brief.json` with 2+ products, region, audience, message
- [x] Create `briefs/example-brief.yaml` variant
- [x] Verify: all Story 2 tests pass

---

## Phase 4: Asset Resolution & GenAI Generation
> RTK Query for Gemini image generation. Pure reducers for resolution logic.

- [x] **`generationApi.ts`** — RTK Query endpoint for Gemini image generation
  - [x] `generateImage` mutation: product name + brief context → image blob
  - [x] Uses API key from `settingsSlice` via `prepareHeaders`
- [x] **`assetsSlice.ts`** — pure reducers ONLY:
  - [x] `resolveAsset` — check `public/assets/input/` for existing image
  - [x] `assetGenerating`, `assetGenerated`, `assetFailed`, `resetAssets`
- [x] **`assetsSelectors.ts`** — `selectAssets`, `selectAssetByProductId`, `selectMissingAssets`, `selectAllAssetsResolved`
- [x] **`assetsSlice.test.ts`** — BDD scenarios from Story 3
- [x] Add demo brand assets to `public/assets/input/` (e.g., `ecobottle.png`)
- [x] Verify: all Story 3 tests pass

---

## Phase 5: Creative Composition (Resize + Text Overlay)
> Sharp for resize/crop. node-canvas for text overlay. Parallel processing.

- [x] **Creative types** (`*Type.ts`, one per file) — ratio/status/metadata/output/state type files in `features/creative/types/`
  - [x] 1:1 = 1080×1080, 9:16 = 1080×1920, 16:9 = 1920×1080
- [x] **`resizeImageThunk.ts`** (`features/creative/thunks/`) — Sharp: resize and crop hero image to each format
- [x] **`composeCreativeThunk.ts`** (`features/creative/thunks/`) — Sharp SVG text overlay on resized image
  - [x] Configurable font, position, color, and shadow
- [x] **`creativeSlice.ts`** — pure reducers:
  - [x] Creative lifecycle reducers (`initCreatives`, `creativePersisted`, `creativeFailed`)
  - [x] `creativeCompleted` — mark product/format combination done
  - [x] Selector: `selectCreativesForProduct`, `selectAllCreatives`
- [x] **`creativeSlice.test.ts`** — BDD scenarios from Story 4
- [x] Implement parallel processing via `Promise.all` across formats
- [x] Verify: all Story 4 tests pass

---

## Phase 6: Pipeline Orchestration
> State machine and business orchestration in pure reducers inside `pipelineSlice.ts`.

- [x] **`pipelineSlice.ts`** — state machine (pure reducers):
  - [x] States: `idle` → `validating` → `resolving` → `generating` → `composing` → `complete` / `error`
  - [x] `startPipeline`, `advanceStep`, `productCompleted`, `productFailed`, `pipelineComplete`
  - [x] Track per-product progress, elapsed time
  - [x] Calculate success metrics: time saved, campaigns generated, efficiency gain
  - [x] Selectors: `selectPipelineStatus`, `selectProgress`, `selectMetrics`, `selectFailedProducts`
- [/] If listener middleware is used, keep it as thin wiring only (no business logic)
  - [/] Business orchestration currently remains in listener middleware
  - [x] Handle per-product errors without blocking other products
- [x] **`pipelineSlice.test.ts`** — BDD scenarios from Stories 6 & 8
- [x] Verify: all Story 6 + Story 8 tests pass

---

## Phase 7: Output Organization
> Save creatives to structured Dropbox paths: `/output/<product>/<ratio>/creative.png`

- [x] Implement output save orchestration via RTK Query Dropbox upload mutation in pipeline listener
- [x] Organize: `output/ecobottle/1x1/`, `output/ecobottle/9x16/`, etc.
- [x] **E2E test** — BDD scenarios from Story 5
- [x] Verify: all Story 5 tests pass

---

## Phase 8: Brand Compliance
> Pure reducer logic for color detection and prohibited word flagging.

- [x] **`complianceSlice.ts`** — pure reducers:
  - [x] `checkBrandColors` — sample dominant colors from output image, compare to configured brand colors
  - [x] `checkProhibitedWords` — scan campaign message against word list
  - [x] Selectors: `selectComplianceReport`, `selectViolations`
- [x] **`complianceSlice.test.ts`** — BDD scenarios from Story 7
- [x] Create sample brand guidelines (colors, prohibited words)
- [x] Verify: all Story 7 tests pass

---

## Phase 9: Multi-Language Localization
> Translate campaign messages via GenAI for target regions.

- [x] Add RTK Query endpoint for text translation
- [x] Update `pipelineListener.ts` to translate message when target region ≠ English
- [x] Preserve original English message in output metadata
- [x] **E2E test** — BDD scenario from Story 9
- [x] Verify: all Story 9 tests pass

---

## Phase 10: UI — Presentational Components
> SPA architecture. All components presentational ONLY. Zero `useState`/`useEffect`/`useRouter` in `.tsx`. Generic elements from shadcn/ui or VengeanceUI exclusively.

- [x] **Generic Elements** (`src/components/elements/generic/`) — shadcn/ui primitives:
  - [x] `Button.tsx` — variants: default, outline, ghost, success, destructive
  - [x] `Input.tsx` — text input
  - [x] `Textarea.tsx` — multiline text input
  - [x] `Card.tsx` — Card, CardHeader, CardTitle, CardValue, CardDescription
  - [x] `Progress.tsx` — Radix progress bar
  - [x] `Label.tsx` — Radix form label
  - [x] `Badge.tsx` — success/error/warning/info/default
  - [x] `Alert.tsx` — Alert, AlertTitle, AlertItem (success/error/info)
  - [x] `Table.tsx` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
  - [x] `Heading.tsx` — h1/h2/h3 variants
  - [x] `Text.tsx` — body/muted/label/mono/bold/tabular
  - [x] `ImageCard.tsx` — image with badge overlay + footer
  - [x] `StatusList.tsx` — StatusList + StatusListItem (highlighted)
- [x] **Unique Elements** (`src/components/elements/unique/`) — composed of generic only:
  - [x] `BriefEditor.tsx` — Textarea + Button + Alert (dispatches to briefSlice + uiSlice)
  - [x] `PipelineProgress.tsx` — Text + Progress + StatusList (reads from pipelineSlice + uiSlice)
  - [x] `OutputGallery.tsx` — ImageCard grid grouped by product (reads from creativeSlice)
  - [x] `ComplianceReport.tsx` — Table + Badge (reads from complianceSlice)
- [x] **Screens** (`src/components/screens/`) — composed of generic + unique:
  - [x] `ScreenRouter.tsx` — reads `uiSlice.currentPage`, renders correct screen
  - [x] `SettingsScreen.tsx` — Label + Input + Button (Gemini API key + Dropbox access token entry)
  - [x] `HomeScreen.tsx` — Heading + Text + BriefEditor + Button
  - [x] `PipelineScreen.tsx` — Heading + PipelineProgress + Alert + Button
  - [x] `ResultsScreen.tsx` — Heading + Card (metrics) + OutputGallery + ComplianceReport + Button
  - [x] `StoreProvider.tsx` — Redux Provider wrapper
- [x] **Root layout** (`layout.tsx`) — wraps with StoreProvider
- [x] **Single page** (`page.tsx`) — renders `<ScreenRouter />`
- [x] Storybook stories for all components in `stories/`
- [/] Verify: Storybook coverage (`npm run storybook`, `npm run test:storybook`)
- [x] **UX Overhaul (Phase 2)**:
  - [x] Unified "raw shadcn" component usage
  - [x] Flattened layout (removed card-in-card nesting)
  - [x] Integrated `framer-motion` micro-interactions
  - [x] Synchronized Playwright E2E tests with current selectors and error assertions
  - [x] Added `Separator.stories.tsx` and `AspectRatio.stories.tsx`

---

## Phase 11: Docker & Local Execution

- [x] Finalize `Dockerfile` — node-canvas system deps, multi-stage build
- [x] Finalize `docker-compose.yml` — port 3000, volume mounts
- [x] Test `docker-compose up` — app starts, all pages load
- [x] Test full pipeline end-to-end inside Docker container

---

## Phase 12: Documentation & Demo

- [x] **README.md** — comprehensive:
  - [x] How to run (Docker + local dev)
  - [x] Example input (campaign brief JSON/YAML)
  - [x] Example output (screenshot of gallery + folder structure)
  - [x] Architecture overview + design decisions
  - [x] Tech stack rationale
  - [x] Assumptions and limitations
  - [x] Success metrics explanation
- [x] **Record 2–3 min demo video** (Walkthrough artifact created):
  - [x] Settings → enter API key + Dropbox access token
  - [x] Upload campaign brief
  - [x] Pipeline execution with progress
  - [x] Output gallery + folder structure
  - [x] Success metrics display

---

## Pre-Merge Refactoring Checklist
> Apply to every PR before merging.

- [x] No business logic in components (presentational ONLY)
- [x] All state in Redux (no `useState`, `useReducer`, `useEffect`, `useRouter`, `useRef`, `useCallback`)
- [x] Only `useAppSelector` and `useAppDispatch` in `.tsx` files
- [x] All data fetching uses RTK Query
- [x] All form state in Redux (uiSlice holds input values)
- [x] SPA routing via `uiSlice.currentPage` (no Next.js router in components)
- [x] Selectors in separate `*Selectors.ts` files; thunks in separate `*Thunks.ts` files, actions in separate `*Actions.ts` files
- [x] Files < 300 lines, preferably **one function per file**; separated but domain and subdomain.
- [x] BDD tests exist for all reducers
- [x] E2E tests assert data presence, not just containers
- [x] Screens composed of generic + unique elements only
- [x] Unique elements composed of generic elements only
- [x] Generic elements sourced exclusively from shadcn/ui or VengeanceUI
