# TODO — Creative Automation Pipeline

> Implementation checklist derived from [PLAN.MD](./PLAN.MD).
> Mark `[/]` for in-progress, `[x]` for done.

---

## Phase 0: BDD Test Harness
> **Write ALL Given-When-Then scenarios as failing tests BEFORE any implementation.**

- [ ] Set up Jest + `@testing-library/react` for BDD slice/component tests
- [ ] Set up Playwright for E2E browser tests
- [ ] **Story 1 tests**: API Key Configuration
  - [ ] `settingsSlice.test.ts` — first-time user sees prompt, saves key to localStorage, returning user skips
- [ ] **Story 2 tests**: Campaign Brief Input
  - [ ] `briefSlice.test.ts` — valid JSON accepted, valid YAML accepted, invalid brief rejected with field-level errors
- [ ] **Story 3 tests**: Asset Resolution
  - [ ] `assetsSlice.test.ts` — existing asset reused (no GenAI call), missing asset triggers generation
- [ ] **Story 4 tests**: Multi-Format Creative Generation
  - [ ] `creativeSlice.test.ts` — 1:1, 9:16, 16:9 outputs produced; campaign message overlaid
- [ ] **Story 5 tests**: Organized Output
  - [ ] E2E test — output folder structure: `<product>/<ratio>/`
- [ ] **Story 6 tests**: Pipeline Progress & Success Metrics
  - [ ] `pipelineSlice.test.ts` — state machine: idle → running → complete/error; metrics calculated
- [ ] **Story 7 tests**: Brand Compliance (Bonus)
  - [ ] `complianceSlice.test.ts` — brand color detection, prohibited word flagging
- [ ] **Story 8 tests**: Error Handling & Recovery
  - [ ] `pipelineSlice.test.ts` — one product fails, others succeed; invalid API key prompts settings
- [ ] **Story 9 tests**: Multi-Language Localization
  - [ ] E2E test — campaign message localized for target region, English preserved in metadata

---

## Phase 1: Project Scaffolding
> Next.js + TypeScript + Redux Toolkit + Docker + UI libraries.

- [ ] Initialize Next.js App Router project with TypeScript
  ```bash
  npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'
  ```
- [ ] Install core dependencies
  ```bash
  npm install @reduxjs/toolkit react-redux js-yaml sharp canvas
  ```
- [ ] **shadcn/ui setup**
  ```bash
  pnpm dlx shadcn@latest init
  pnpm dlx shadcn@latest add button input card progress form table tabs dialog
  ```
  - [ ] Verify components copied to `src/components/ui/`
- [ ] **VengeanceUI setup**
  ```bash
  npm install tailwindcss @tailwindcss/postcss postcss
  npm install framer-motion clsx tailwind-merge lucide-react
  ```
  - [ ] Create `postcss.config.mjs` with `@tailwindcss/postcss` plugin
  - [ ] Add `@import "tailwindcss";` to `src/app/globals.css`
  - [ ] Create `src/lib/utils.ts` with shared `cn` helper
  ```bash
  npx vengeance-ui add animated-button animated-hero logo-slider glow-border-card
  ```
- [ ] Create directory structure per PLAN.MD
  - [ ] `src/features/core/` — api, store, ui, settings slices
  - [ ] `src/features/brief/` — slice, types, __tests__
  - [ ] `src/features/assets/` — slice, api, types, __tests__
  - [ ] `src/features/creative/` — slice, types, __tests__
  - [ ] `src/features/compliance/` — slice, __tests__
  - [ ] `src/features/pipeline/` — slice, listeners, __tests__
  - [ ] `src/components/elements/generic/` — forms, layout, ui (shadcn/VengeanceUI only)
  - [ ] `src/components/elements/unique/` — BriefEditor, PipelineProgress, OutputGallery, ComplianceReport
  - [ ] `src/components/screens/`
  - [ ] `src/lib/canvas/`, `src/lib/image/`, `src/lib/brief/`
  - [ ] `briefs/example-brief.json`
  - [ ] `public/assets/input/` — pre-existing demo brand assets
  - [ ] `stories/`
- [ ] Create `Dockerfile` with node-canvas system deps (cairo, pango, libjpeg)
- [ ] Create `docker-compose.yml` with volume mounts for `briefs/`, `output/`, `public/assets/input/`
- [ ] Create `.env.example` (document env vars, no values)
- [ ] Add `output/` to `.gitignore`

---

## Phase 2: Redux Store Foundation
> All state in Redux. Zero React logic. Fat reducers, thin actions.

- [ ] **`store.ts`** — `configureStore` with RTK Query middleware, redux-logger
- [ ] **Typed hooks** — `useAppDispatch`, `useAppSelector` in `src/features/core/store/`
- [ ] **`apiSlice.ts`** — RTK Query base API slice (Gemini Nano Banana base URL)
- [ ] **`settingsSlice.ts`** — API key state + persistence listener middleware (localStorage)
  - [ ] Reducer: `setApiKey`, `clearApiKey`
  - [ ] Selector: `selectApiKey`, `selectHasApiKey`
- [ ] **`uiSlice.ts`** — modals, nav, loading states
  - [ ] Reducer: `setLoading`, `setActiveModal`, `setCurrentPage`
  - [ ] Selector: `selectIsLoading`, `selectActiveModal`
- [ ] Verify: all tests from Phase 0 Story 1 pass

---

## Phase 3: Campaign Brief Domain
> Brief parsing, validation, and type definitions — all in pure reducers.

- [ ] **`brief.ts`** (types) — `CampaignBrief`, `Product`, `BriefValidationError`
- [ ] **`parser.ts`** (lib) — pure function: JSON/YAML → `CampaignBrief` (uses `js-yaml`)
- [ ] **`briefSlice.ts`** — pure reducers for:
  - [ ] `loadBrief` — parse raw input, validate required fields
  - [ ] `validateBrief` — ensure ≥2 products, region, audience, message present
  - [ ] `rejectBrief` — set validation errors
  - [ ] Selectors: `selectBrief`, `selectProducts`, `selectValidationErrors`
- [ ] **`briefSlice.test.ts`** — BDD scenarios from Story 2
- [ ] Create `briefs/example-brief.json` with 2+ products, region, audience, message
- [ ] Create `briefs/example-brief.yaml` variant
- [ ] Verify: all Story 2 tests pass

---

## Phase 4: Asset Resolution & GenAI Generation
> RTK Query for Gemini Nano Banana. Pure reducers for resolution logic.

- [ ] **`generationApi.ts`** — RTK Query endpoint for Gemini Nano Banana image generation
  - [ ] `generateImage` mutation: product name + brief context → image blob
  - [ ] Uses API key from `settingsSlice` via `prepareHeaders`
- [ ] **`assetsSlice.ts`** — pure reducers:
  - [ ] `resolveAsset` — check `public/assets/input/` for existing image
  - [ ] `assetResolved` — mark product as having a hero image
  - [ ] `assetGenerated` — store generated image path
  - [ ] Selector: `selectAssetForProduct`, `selectMissingAssets`
- [ ] **`assetsSlice.test.ts`** — BDD scenarios from Story 3
- [ ] Add demo brand assets to `public/assets/input/` (e.g., `ecobottle.png`)
- [ ] Verify: all Story 3 tests pass

---

## Phase 5: Creative Composition (Resize + Text Overlay)
> Sharp for resize/crop. node-canvas for text overlay. Parallel processing.

- [ ] **`formats.ts`** (types) — aspect ratio definitions: `{ name, width, height, ratio }`
  - [ ] 1:1 = 1080×1080, 9:16 = 1080×1920, 16:9 = 1920×1080
- [ ] **`resizer.ts`** (lib) — Sharp: resize and crop hero image to each format
- [ ] **`composer.ts`** (lib) — node-canvas: overlay campaign message text on resized image
  - [ ] Configurable font, position, color, and shadow
- [ ] **`creativeSlice.ts`** — pure reducers:
  - [ ] `generateCreatives` — orchestrate resize + overlay per product × format
  - [ ] `creativeCompleted` — mark product/format combination done
  - [ ] Selector: `selectCreativesForProduct`, `selectAllCreatives`
- [ ] **`creativeSlice.test.ts`** — BDD scenarios from Story 4
- [ ] Implement parallel processing via `Promise.all` across formats
- [ ] Verify: all Story 4 tests pass

---

## Phase 6: Pipeline Orchestration
> State machine in pipelineSlice. Listener middleware for side effects.

- [ ] **`pipelineSlice.ts`** — state machine (pure reducers):
  - [ ] States: `idle` → `validating` → `resolving` → `generating` → `composing` → `complete` / `error`
  - [ ] `startPipeline`, `advanceStep`, `productCompleted`, `productFailed`, `pipelineComplete`
  - [ ] Track per-product progress, elapsed time
  - [ ] Calculate success metrics: time saved, campaigns generated, efficiency gain
  - [ ] Selectors: `selectPipelineStatus`, `selectProgress`, `selectMetrics`, `selectFailedProducts`
- [ ] **`pipelineListener.ts`** — listener middleware:
  - [ ] Orchestrate: brief validation → asset resolution → GenAI generation → composition → output save
  - [ ] Handle per-product errors without blocking other products
- [ ] **`pipelineSlice.test.ts`** — BDD scenarios from Stories 6 & 8
- [ ] Verify: all Story 6 + Story 8 tests pass

---

## Phase 7: Output Organization
> Save creatives to structured folder: `output/<product>/<ratio>/`

- [ ] Implement API route or server action to save files to `output/` directory
- [ ] Organize: `output/ecobottle/1x1/`, `output/ecobottle/9x16/`, etc.
- [ ] **E2E test** — BDD scenarios from Story 5
- [ ] Verify: all Story 5 tests pass

---

## Phase 8: Brand Compliance
> Pure reducer logic for color detection and prohibited word flagging.

- [ ] **`complianceSlice.ts`** — pure reducers:
  - [ ] `checkBrandColors` — sample dominant colors from output image, compare to configured brand colors
  - [ ] `checkProhibitedWords` — scan campaign message against word list
  - [ ] Selectors: `selectComplianceReport`, `selectViolations`
- [ ] **`complianceSlice.test.ts`** — BDD scenarios from Story 7
- [ ] Create sample brand guidelines (colors, prohibited words)
- [ ] Verify: all Story 7 tests pass

---

## Phase 9: Multi-Language Localization
> Translate campaign messages via GenAI for target regions.

- [ ] Add RTK Query endpoint for text translation
- [ ] Update `pipelineListener.ts` to translate message when target region ≠ English
- [ ] Preserve original English message in output metadata
- [ ] **E2E test** — BDD scenario from Story 9
- [ ] Verify: all Story 9 tests pass

---

## Phase 10: UI — Presentational Components
> All components presentational ONLY. Generic elements from shadcn/ui or VengeanceUI exclusively.

- [ ] **Screens** (compositions of elements only, NO raw markup):
  - [ ] Settings screen (`src/app/settings/page.tsx`) — API key input
  - [ ] Brief entry screen (`src/app/page.tsx`) — upload/paste brief
  - [ ] Pipeline screen (`src/app/pipeline/page.tsx`) — progress display
  - [ ] Results screen (`src/app/results/page.tsx`) — output gallery
- [ ] **Unique Elements**:
  - [ ] `BriefEditor.tsx` — campaign brief entry UI (composed of shadcn Form, Input, Card)
  - [ ] `PipelineProgress.tsx` — execution progress (composed of shadcn Progress, Card)
  - [ ] `OutputGallery.tsx` — generated creatives gallery with download
  - [ ] `ComplianceReport.tsx` — compliance check results table
- [ ] **Generic Elements** (shadcn/ui + VengeanceUI only):
  - [ ] Button, Input, Card, Progress, Form, Table, Tabs, Dialog (shadcn)
  - [ ] AnimatedHero, AnimatedButton, GlowBorderCard, LogoSlider (VengeanceUI)
- [ ] **Root layout** (`layout.tsx`) — Redux Provider wrapper
- [ ] Storybook stories for all components in `stories/`
- [ ] Verify: full Storybook coverage (`npm run storybook`)

---

## Phase 11: Docker & Local Execution

- [ ] Finalize `Dockerfile` — node-canvas system deps, multi-stage build
- [ ] Finalize `docker-compose.yml` — port 3000, volume mounts
- [ ] Test `docker-compose up` — app starts, all pages load
- [ ] Test full pipeline end-to-end inside Docker container

---

## Phase 12: Documentation & Demo

- [ ] **README.md** — comprehensive:
  - [ ] How to run (Docker + local dev)
  - [ ] Example input (campaign brief JSON/YAML)
  - [ ] Example output (screenshot of gallery + folder structure)
  - [ ] Architecture overview + design decisions
  - [ ] Tech stack rationale
  - [ ] Assumptions and limitations
  - [ ] Success metrics explanation
- [ ] **Record 2–3 min demo video**:
  - [ ] Settings → enter API key
  - [ ] Upload campaign brief
  - [ ] Pipeline execution with progress
  - [ ] Output gallery + folder structure
  - [ ] Success metrics display

---

## Pre-Merge Refactoring Checklist
> Apply to every PR before merging.

- [ ] No business logic in components (presentational ONLY)
- [ ] All state in Redux (no `useState`, `useReducer`)
- [ ] All data fetching uses RTK Query
- [ ] Selectors co-located with reducers
- [ ] Files < 300 lines, preferably **one function per file**
- [ ] BDD tests exist for all reducers
- [ ] No `useEffect` for logic
- [ ] E2E tests assert data presence, not just containers
- [ ] Generic elements sourced exclusively from shadcn/ui or VengeanceUI
