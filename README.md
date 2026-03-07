# Creative Automation Pipeline

A production-grade MVP for automating creative asset generation across social media campaigns. This application accepts structured campaign briefs, resolves or generates hero images via Leonardo AI, produces format-specific creatives (1:1, 9:16, 16:9) with text overlays, and organizes outputs for immediate deployment.

## Features

- **Multi-Format Generation**: Produces creatives in 1:1 (Square), 9:16 (Stories), and 16:9 (Landscape) aspect ratios.
- **GenAI Asset Generation**: Automatically generates missing hero images.
- **Structured Output**: Organizes generated assets by product and aspect ratio in a deterministic folder structure.
- **Brand Compliance**: Automated brand color detection and prohibited word flagging.
- **FP Architecture**: Built with a strict Functional Programming architecture using Redux Toolkit and RTK Query.

## Tech Stack

- **Framework**: Next.js (App Router)
- **State Management**: Redux Toolkit (RTK) + RTK Query
- **GenAI API**: Leonardo AI
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Resizing) & [node-canvas](https://github.com/Automattic/node-canvas) (Text Overlay)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Testing**: Jest (BDD/Unit) & Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional)
- Leonardo AI API Key
- Dropbox Access Token (for output persistence)

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

### Running the Application (Docker)

```bash
docker compose up --build
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Configure API Keys**: On the first launch, you will be directed to the Settings screen. Enter your Leonardo AI API key and Dropbox access token.
2. **Submit Brief**: Upload a campaign brief in JSON or YAML format (see `briefs/example-brief.json` for structure).
3. **Execute Pipeline**: Click "Run Pipeline" to begin the generation process.
4. **View Results**: Browse the generated creatives in the Results screen and verify outputs in the `output/` directory or your Dropbox.

## API Keys

Use real credentials for end-to-end testing:

### Leonardo AI API Key

1. Open `https://app.leonardo.ai/api-access`
2. Sign in with Leonardo AI account
3. Click **Create New Key**
4. Copy the key
5. Paste it into **Leonardo AI API Key** on the app Settings screen

### Dropbox Access Token

1. Open `https://www.dropbox.com/developers/apps`
2. Create a Dropbox app (for testing, `Scoped access` + `App folder` is sufficient)
3. In app settings, generate an access token
4. Copy the token
5. Paste it into **Dropbox Access Token** on the app Settings screen

After both values are set, run the pipeline normally without any mocked network requests.

## Credential Validation UX

- The Settings screen includes explicit **Test** actions for both Leonardo AI API key and Dropbox access token.
- On success, the UI shows:
  - `✓ Connection successful` (Leonardo AI)
  - `✓ Dropbox linked successfully` (Dropbox)
- On failure, the UI shows a clear reason returned by the API:
  - `✗ Connection failed. Reason: ...`
  - `✗ Dropbox link failed. Reason: ...`
- If the pipeline is started without required credentials, Pipeline screen shows:
  - `Pipeline encountered errors.`
  - `Reason: API key not configured` or `Reason: Dropbox access token not configured`
  - `Open Settings` action for recovery

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