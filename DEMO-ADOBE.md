# Creative Automation Pipeline - Adobe Assessment Video Script

This script is tailored for the Adobe Forward Deployed AI Engineer assessment while staying aligned with the current Leonardo-only MVP in this repository.

## References

- Adobe Forward Deployed AI Engineer job description
- FDE Take-Home Lite brief
- FDE Take-Home Lite FAQ

## Scope Note

- The current MVP focuses on reliable brief ingestion, asset reuse, Leonardo-based generation, multi-format composition, Dropbox persistence, compliance checks, and results reporting.
- Automatic localization is not implemented in the current branch. The pipeline intentionally keeps the original campaign message unchanged.

## Preparation

- Ensure the application is running: `npm run dev` or `docker compose up`.
- Have a valid **Leonardo API Key** ready.
- Have a valid **Dropbox Access Token** ready.
- Have `briefs/example-brief.json` available.
- Clear `localStorage` or start in Incognito to show the initial settings flow.

---

## Script & Walkthrough (2-3 Minutes)

### 1. Introduction & Problem Statement (0:00 - 0:20)
- **Visual**: Start on the **Settings Screen**.
- **Audio/Action**: "This is a demonstration of a Creative Automation Pipeline, built as a practical POC for high-volume campaign production. The goal is to increase campaign velocity, preserve brand consistency, and make creative operations more measurable."

### 2. Credential Validation & External Integrations (0:20 - 0:45)
- **Visual**: Paste the **Leonardo API Key** and **Dropbox Access Token**.
- **Action**: Click **Test** for each credential, then click **Save Credentials**.
- **Audio/Action**: "We begin with explicit credential validation for both external systems. Leonardo provides image generation, and Dropbox provides structured output persistence. This demonstrates reliable third-party API integration and clear operator feedback before any long-running workflow starts."

### 3. Structured Campaign Brief Input (0:45 - 1:10)
- **Visual**: Move to the **Home Screen**.
- **Action**: Click **Load Example**, then **Validate & Load Brief**.
- **Audio/Action**: "The pipeline accepts a structured campaign brief in JSON or YAML. This example contains two products, target audience and region metadata, a campaign message, and brand guidelines including colors and prohibited words."

### 4. Asset Resolution Strategy (1:10 - 1:35)
- **Visual**: Click **Run Pipeline for 3 Products** and point to the **Pipeline Screen**.
- **Audio/Action**: "This run demonstrates two important production cases. EcoBottle and SolarCharger. The operator can watch the workflow advance through validation, asset resolution, generation, and composition."

### 5. Parallel Creative Production (1:35 - 2:00)
- **Visual**: Stay on the progress view while products move through the pipeline.
- **Audio/Action**: "For each product, the system creates three social-ready formats: 1:1, 9:16, and 16:9. That means a single structured brief can produce a full campaign asset set with consistent message treatment across multiple placements."

### 6. Compliance & Quality Checks (2:00 - 2:35)
- **Visual**: On the **Results Screen**, highlight **Compliance & Quality Audit**.
- **Audio/Action**: "After generation, the pipeline runs automated quality checks. It compares detected colors against configured brand colors and flags prohibited words from the brief. This turns brand consistency from a manual review step into a repeatable system behavior."

### 7. Results & Business Value (2:35 - 3:00)
- **Visual**: Highlight the top metrics and scroll the output gallery.
- **Audio/Action**: "The results screen previews every creative grouped by product and format, while the same outputs are persisted to Dropbox. At the top, the app reports Time Saved, Campaigns Ready, and Efficiency Gain, which gives a concrete operational frame for ROI and throughput."

---

## Adobe Assessment Alignment Matrix

| Assessment Requirement | Current Implementation | Notes |
| :--- | :--- | :--- |
| Structured campaign brief input | `loadBrief` supports JSON and YAML | Matches current MVP |
| At least two products | `briefs/example-brief.json` includes 3 products | EcoBottle, SolarCharger, BambooCase |
| Asset reuse plus GenAI generation | Existing assets reused when present; Leonardo generates when missing | Demonstrated by example brief |
| Multi-format output | 1:1, 9:16, and 16:9 variants | Implemented in pipeline |
| Message overlay / composition | Browser-side creative composition with text overlay | Visible in generated previews |
| Organized output persistence | Dropbox upload with product/format output paths | Current MVP requires Dropbox |
| Brand / legal checks | Brand color detection and prohibited word checks | Shown in compliance table |
| Metrics / business value | Time Saved, Campaigns Ready, Efficiency Gain | Visible on results screen |
| Localization | Not implemented in current MVP | Explicitly deferred, not claimed |

## Demo Positioning Guidance

- Keep the pitch grounded in what the branch actually does today.
- Emphasize reliability, structured input, asset reuse, and measurable throughput.
- Do not claim Gemini, OpenAI fallback, localization, or download fallback in this version.
