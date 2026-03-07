# Creative Automation Pipeline

A production-grade MVP for automating creative asset generation across social media campaigns. This application accepts structured campaign briefs, resolves or generates hero images via Gemini 3 Flash Preview, automatically falls back to ChatGPT/OpenAI when Gemini is temporarily overloaded, produces format-specific creatives (1:1, 9:16, 16:9) with text overlays, and organizes outputs for immediate deployment.

## Features

- **Multi-Format Generation**: Produces creatives in 1:1 (Square), 9:16 (Stories), and 16:9 (Landscape) aspect ratios.
- **GenAI Asset Generation**: Automatically generates missing hero images using Gemini 3 Flash Preview.
- **Automatic AI Fallback**: If Gemini returns high-demand temporary errors, generation/translation automatically retries via OpenAI (ChatGPT + GPT Image).
- **Structured Output**: Organizes generated assets by product and aspect ratio in a deterministic folder structure.
- **Brand Compliance**: Automated brand color detection and prohibited word flagging.
- **Multi-Language Support**: Localizes campaign messages based on target regions.
- **FP Architecture**: Built with a strict Functional Programming architecture using Redux Toolkit and RTK Query.

## Tech Stack

- **Framework**: Next.js (App Router)
- **State Management**: Redux Toolkit (RTK) + RTK Query
- **GenAI APIs**: Gemini 3 Flash Preview (primary) + OpenAI (fallback)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Resizing) & [node-canvas](https://github.com/Automattic/node-canvas) (Text Overlay)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) & [VengeanceUI](https://vengenceui.com/)
- **Testing**: Jest (BDD/Unit) & Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional)
- Gemini API Key (Gemini 3 Flash Preview access, primary)
- OpenAI API Key (optional fallback for high-demand Gemini errors)
- Dropbox Access Token (optional cloud output persistence)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ad-campaigns-automation
   ```

2. Setup environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Optional: add `GEMINI_API_KEY`, `OPENAI_API_KEY`, and/or `DROPBOX_ACCESS_TOKEN` to bootstrap Settings on first load.

### Running the Application (Docker)

```bash
docker compose up --build
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Configure Credentials**: On first launch, enter one AI key. Gemini is primary when present, but OpenAI-only runs are also supported. Dropbox is optional.
2. **Submit Brief**: Upload a campaign brief in JSON or YAML format (see `briefs/example-brief.json` for structure).
3. **Execute Pipeline**: After credentials are set, click "Validate & Load Brief" and then "Run Pipeline" to begin generation.
4. **View Results**: Browse the generated creatives in the Results screen. If Dropbox is configured, verify the uploaded assets there. If Dropbox is missing or invalid, use the `Download PNG` actions in Results.

## API Keys

Use real credentials for end-to-end testing:

### Gemini API Key

1. Open `https://aistudio.google.com/app/apikey`
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key
5. Paste it into **Gemini API Key** on the app Settings screen

### OpenAI API Key (Fallback)

1. Open `https://platform.openai.com/api-keys`
2. Create a new secret key
3. Copy the key once (it is only fully shown at creation)
4. Paste it into **OpenAI API Key (Fallback)** on the app Settings screen

### Dropbox Access Token

1. Open `https://www.dropbox.com/developers/apps`
2. Create a Dropbox app (for testing, `Scoped access` + `App folder` is sufficient)
3. In app settings, generate an access token
4. Copy the token
5. Paste it into **Dropbox Access Token** on the app Settings screen

After one AI key is set, run the pipeline normally without mocked network requests.
If Dropbox is configured, completed assets are uploaded to Dropbox using the deterministic path convention `/output/<product>/<ratio>/creative.png`.
If Dropbox is omitted or invalid, the pipeline still completes and Results exposes direct `Download PNG` actions instead.

If `.env.local` contains `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `DROPBOX_ACCESS_TOKEN`, the app hydrates those values into Settings on startup when localStorage is empty.
If only `OPENAI_API_KEY` is present, the app can still validate briefs and run the full pipeline.
If `DROPBOX_ACCESS_TOKEN` is absent or invalid, the app keeps outputs downloadable from Results instead of blocking the run.

## Credential Validation UX

- The Settings screen includes explicit **Test** actions for Gemini, OpenAI fallback, and Dropbox credentials.
- On success, the UI shows:
  - `✓ Connection successful` (Gemini)
  - `✓ OpenAI connection successful` (OpenAI)
  - `✓ Dropbox linked successfully` (Dropbox)
- On failure, the UI shows a clear reason returned by the API:
  - `✗ Connection failed. Reason: ...`
  - `✗ OpenAI connection failed. Reason: ...`
  - `✗ Dropbox link failed. Reason: ...`
- If required credentials are missing:
  - `Validate & Load Brief` and `Run Pipeline...` stay disabled
  - Home header action changes from `Settings` to flashing yellow `Set Keys`
- If Dropbox is unavailable:
  - the pipeline still completes
  - Results shows a warning banner plus `Download PNG` actions for affected creatives

## Architecture & Design Decisions

### Strict FP Standards
Following the [FP Maintenance Strategy](https://github.com/seandinwiddie/lectures/blob/main/technology-maintenance-extensive.md), this project enforces:
- **Presentational Components**: React components contain ZERO business logic.
- **Redux-Only State**: No `useState`, `useEffect`, or `useRouter` in `.tsx` files. All state is managed via Redux.
- **Fat Reducers**: Business logic is centralized in pure reducers within Slice files.
- **RTK Query**: All data fetching and API interactions use RTK Query for caching and state integration.

## Success Metrics

The application calculates and displays success metrics upon completion:
- **Estimated Time Saved**: Based on average manual creative generation time.
- **Campaigns Generated**: Total number of unique creative variations produced.
- **Efficiency Gain**: Percentage reduction in manual overhead.
