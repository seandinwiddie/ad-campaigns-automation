# Pipeline Listeners

This folder contains the orchestration code that turns a validated brief into finished outputs.

## Files
- `pipelineListener.ts`: Watches `startPipeline`, validates prerequisites, resolves or generates source assets, composes and uploads creative variants, runs compliance checks, and records per-product and overall pipeline outcomes.
- `pipelineImageUtils.ts`: Browser-only helpers for canvas-based image composition, overlay text rendering, dominant-color detection, and Data URL to base64 conversion.
