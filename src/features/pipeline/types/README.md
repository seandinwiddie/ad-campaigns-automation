# Pipeline Types

This folder defines the data model for the automation workflow.

## Files
- `pipelineStatusType.ts`: Allowed top-level pipeline stages.
- `productStatusType.ts`: Allowed per-product execution states.
- `productProgressType.ts`: Per-product progress record with optional failure details.
- `pipelineMetricsType.ts`: End-of-run metrics used by the results screen.
- `pipelineErrorType.ts`: Product-specific failure record with step and message.
- `pipelineStateType.ts`: Full reducer-state snapshot for the orchestration feature.
