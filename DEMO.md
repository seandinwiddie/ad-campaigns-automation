# Creative Automation Pipeline - Video Demo Script

This document outlines a 2-3 minute demo script for the current Leonardo-only MVP.

## Preparation

- Ensure the application is running: `npm run dev` or `docker compose up`.
- Have a valid **Leonardo API Key** ready.
- Have a valid **Dropbox Access Token** ready. The current MVP requires Dropbox to complete the pipeline.
- Have `briefs/example-brief.json` available.
- Clear `localStorage` or start in Incognito to show the initial onboarding/settings screen.

---

## Script & Walkthrough

### 1. Introduction (0:00 - 0:20)
- **Visual**: Start on the **Settings Screen**.
- **Audio/Action**: "Welcome to the Creative Automation Pipeline. This MVP automates creative production for social campaigns by validating credentials, ingesting a structured brief, generating missing hero assets with Leonardo, composing three social formats, and checking compliance before showing results."

### 2. Credential Setup (0:20 - 0:45)
- **Visual**: Enter the **Leonardo API Key** and **Dropbox Access Token**.
- **Action**: Click **Test** for each credential, then click **Save Credentials**.
- **Audio/Action**: "The workflow starts with credential validation. Leonardo powers image generation, and Dropbox is the persistence layer for generated outputs. The app validates each credential up front so the pipeline fails early and clearly if configuration is incomplete."

### 3. Campaign Brief Input (0:45 - 1:15)
- **Visual**: Move to the **Home Screen**.
- **Action**: Click **Load Example**, then **Validate & Load Brief**.
- **Audio/Action**: "The pipeline accepts a structured campaign brief in JSON or YAML. This example includes three products: EcoBottle, SolarCharger, and BambooCase, along with the target region, audience, campaign message, and brand guidelines."

### 4. Pipeline Execution (1:15 - 1:45)
- **Visual**: Point to the validated brief state, then click **Run Pipeline for 3 Products**.
- **Audio/Action**: "Once the brief is validated, the pipeline moves through visible execution stages: validating, resolving assets, generating creatives, and composing outputs."

### 5. Asset Reuse + Generation (1:45 - 2:10)
- **Visual**: Stay on the **Pipeline Screen** as progress updates.
- **Audio/Action**: "This brief demonstrates both asset reuse and GenAI generation. EcoBottle and SolarCharger already have source assets, while BambooCase does not, so the system generates a new hero image with Leonardo. For each product, the app produces 1:1, 9:16, and 16:9 variants."

### 6. Results, Compliance, and Storage (2:10 - 2:45)
- **Visual**: On the **Results Screen**, scroll through **Generated Asset Gallery** and **Compliance & Quality Audit**.
- **Audio/Action**: "The results screen previews each generated creative grouped by product and format. Below that, the compliance audit checks detected brand colors and prohibited words from the brief. At the same time, the pipeline persists the finished creatives to Dropbox in an organized output structure."

### 7. Success Metrics (2:45 - 3:00)
- **Visual**: Highlight the metrics at the top of the **Results Screen**.
- **Audio/Action**: "To quantify value, the app reports Time Saved, Campaigns Ready, and Efficiency Gain. This gives a simple operational view of how much manual campaign production work the pipeline removes."

---

## Recording Tips

- Record at 1080p.
- Keep the brief load and pipeline run visible without rushing the transitions.
- Blur or mask credentials in the final recording.
- If generation takes time, pause or trim that segment in post.
