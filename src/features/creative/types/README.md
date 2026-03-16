# Creative Types

This folder defines the creative feature’s internal and UI-facing data model.

## Files
- `creativeAspectRatioType.ts`: Allowed ratio literals for creative jobs.
- `creativeStatusType.ts`: Internal lifecycle states for a creative variant.
- `formatCreativeStatusType.ts`: UI-facing status values for rendered outputs.
- `formatAspectRatioType.ts`: Width, height, ratio, and label contract for a supported format.
- `composeOptionsType.ts`: Optional styling inputs for text overlay composition.
- `creativeType.ts`: Canonical per-variant record tracked by the reducer.
- `creativeMetadataType.ts`: Campaign context attached to a generated variant.
- `creativeOutputType.ts`: Simplified output record for review screens.
- `creativeStateType.ts`: Reducer-state wrapper with variant map and aggregate progress metrics.
