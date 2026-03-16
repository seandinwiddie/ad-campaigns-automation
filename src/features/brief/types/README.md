# Brief Types

These types define the canonical campaign brief contract consumed by the pipeline.

## Files
- `campaignBriefType.ts`: The normalized campaign-level payload.
- `productType.ts`: Per-product input used by the asset and creative stages.
- `brandGuidelinesType.ts`: Optional colors and prohibited words that feed compliance checks.
- `validationErrorType.ts`: Field-level validation feedback emitted by brief parsing.
- `briefStateType.ts`: Feature-state wrapper for parsed content, validity, loading, and errors.
