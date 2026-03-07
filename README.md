# Creative Automation Pipeline

Leonardo-only MVP for generating missing campaign hero images, composing social creatives in `1:1`, `9:16`, and `16:9`, and persisting outputs to Dropbox.

## Current Scope

- Leonardo AI is the only image generation provider in the repo.
- Dropbox is the only persistence target in the repo.
- Campaign messages are reused as-is across regions for MVP.
- Localization is intentionally disabled and tracked as post-MVP work.

## Stack

- Next.js App Router
- TypeScript
- Redux Toolkit + RTK Query
- Sharp for image processing
- Dropbox Files API
- Jest, Playwright, Storybook

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Credentials

Enter both values in the Settings screen:

- `Leonardo API Key`
- `Dropbox Access Token`

The app validates both values before use. Leonardo requests go through internal Next.js API routes so the browser talks to `/api/leonardo/*` rather than directly to Leonardo.

## Workflow

1. Open Settings and save Leonardo + Dropbox credentials.
2. Load or paste a campaign brief in JSON or YAML.
3. Validate the brief.
4. Run the pipeline.
5. Review generated creatives and compliance output.

## Tests

```bash
npm run lint
./node_modules/.bin/tsc --noEmit
npm test -- --runInBand
npm run build
```

Optional:

```bash
npm run test:e2e
npm run storybook
npm run test:storybook
```

## Post-MVP

- Reintroduce localization behind a dedicated text provider.
- Add additional storage backends if needed.
- Add provider abstraction only after Leonardo-first MVP is stable.
