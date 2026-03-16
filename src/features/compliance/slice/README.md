# Compliance Slice

These files implement the compliance reducer and its public Redux surface.

## Files
- `complianceSlice.ts`: Stores brand colors, prohibited words, issue records, and per-product reports, and includes the reducer logic for audits and report generation.
- `complianceActions.ts`: Re-exports the compliance actions used by the pipeline and UI.
- `complianceSelectors.ts`: Reads guideline inputs, issue lists, and UI-friendly report collections from state.
