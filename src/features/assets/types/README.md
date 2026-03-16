# Asset Types

This folder defines both the internal asset-state model and the simplified asset shape used by the UI.

## Files
- `assetStatusType.ts`: Full internal asset lifecycle union from discovery through failure.
- `assetType.ts`: Normalized per-product asset record with provider output, URLs, and error fields.
- `assetsStateType.ts`: Feature state wrapper with the asset map and derived readiness fields.
- `productAssetStatusType.ts`: Simplified status union for results and status displays.
- `productAssetType.ts`: UI-facing asset summary with product name, image path, status, and generated flag.
