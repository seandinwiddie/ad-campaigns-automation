# Creative Automation Pipeline - Video Demo Script

This document outlines the script and instructions for recording the 2–3 minute demo video of the **Creative Automation Pipeline**.

## Preparation

- Ensure the application is running: `npm run dev` or `docker compose up`.
- Have at least one valid AI key (**Gemini** or **OpenAI**) ready.
- Optionally have a valid **Dropbox Access Token** ready if you want to demo cloud upload instead of local download fallback.
- Have the `briefs/example-brief.json` or `.yaml` file available.
- Clear `localStorage` or start in Incognito to show the initial onboarding/settings screen.

---

## Script & Walkthrough

### 1. Introduction (0:00 - 0:20)
- **Visual**: Start on the **Settings Screen** (initial state).
- **Audio/Action**: "Welcome to the Creative Automation Pipeline. This tool automates the generation of social media assets for global marketing teams. We're starting on the Settings screen where we configure our credentials."

### 2. Configuration (0:20 - 0:45)
- **Visual**: Type/Paste one AI key and optionally a **Dropbox Access Token**.
- **Action**: Click the "Test" button for each value you enter to show real-time validation. Once verified, click "Save Credentials".
- **Audio/Action**: "I'll enter my credentials here. The system allows for both Gemini and OpenAI. Gemini is our primary engine, but notice we can test each key individually to ensure they are valid. Dropbox is optional. If it is missing or invalid, the pipeline still completes and the results remain downloadable. Once I click save, these are securely stored in the app's state via our Redux store and persisted for future sessions."

### 3. Campaign Brief (0:45 - 1:15)
- **Visual**: Move to the **Home Screen** (Brief Editor).
- **Action**: Load the `example-brief.json`. Show the JSON content briefly.
- **Audio/Action**: "Now, let's load a campaign brief. This JSON defines our products—in this case, the 'EcoBottle' and 'SolarCharger'—along with the campaign message and target audience. Clicking 'Validate & Load' prepares our pipeline."

### 4. Pipeline Execution (1:15 - 1:50)
- **Visual**: Redirect to **Pipeline Screen**.
- **Action**: Click "Run Pipeline for 2 Products".
- **Audio/Action**: "As we start the pipeline, notice the first few steps: **Automatic Localization**. The system identifies the target region—Mexico in this case—and translates our campaign message into Spanish using our AI engine. Once localized, it proceeds to resolve assets and generate creatives for all three social media formats in parallel."

### 5. Progress & Parallelism (1:50 - 2:15)
- **Visual**: Watch the progress bars. If a Gemini error occurs, show a brief "Switching to OpenAI" or "Retrying" state if visible.
- **Audio/Action**: "The pipeline operates in parallel for maximum efficiency. A key feature here is our **Resilience Logic**: if Gemini experiences high demand—a common occurrence with preview models—the system automatically falls back to OpenAI for that specific task without interrupting the overall flow."

### 6. Results & Output Gallery (2:15 - 2:45)
- **Visual**: Automatically redirect to **Results Screen**.
- **Action**: Scroll through the **Output Gallery**, then point to the **Compliance & Quality Audit** table below it.
- **Audio/Action**: "The pipeline is complete! In our Output Gallery, we see the Spanish-localized creatives for each product. But here's the best part: **Automated Compliance**. Each asset is scanned to ensure brand colors are present and that no prohibited words made it into the copy. This ensures every output is safe and brand-consistent."

### 7. Success Metrics & Verification (2:45 - 3:00)
- **Visual**: Highlight the **Success Metrics** card (Time Saved, Efficiency).
- **Action**: If Dropbox is configured, briefly show the Dropbox file structure. Otherwise point to the `Download PNG` buttons and any `Download Only` badges in Results.
- **Audio/Action**: "We've saved hours of manual design time. If Dropbox is configured, assets are organized there by product and ratio. If not, the results are still immediately usable through direct download. Thanks for watching!"

---

## Recording Tips

- **Resolution**: Record at 1080p (1920x1080).
- **Speed**: If GenAI generation is slow, you can pause the recording or speed up that segment in post-production.
- **Voice**: Use a clear, steady voice or add a high-quality AI voiceover.
- **Privacy**: Ensure NO sensitive API keys or tokens are fully visible in the final video (blur them if necessary, or use dummy keys that "look" real for the demo if the logic allows).
