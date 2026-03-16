# Asset Slice

These files implement the Redux surface for asset resolution.

## Files
- `assetsSlice.ts`: Defines the asset reducers, stores per-product asset records, and recalculates `missingAssetProductIds` plus `allAssetsResolved`.
- `assetsActions.ts`: Re-exports the public asset actions so listeners and screens do not import the slice directly.
- `assetsSelectors.ts`: Reads raw assets, per-product records, unresolved products, and the aggregate readiness signal used by later pipeline steps.
