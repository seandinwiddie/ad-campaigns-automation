# Brief Parsing

This folder contains the async parsing and validation logic behind brief loading.

## Files
- `briefThunks.ts`: Parses JSON first and YAML second, normalizes loose input into a `CampaignBrief`, applies defaults and alias handling, and rejects briefs that fail the business rules.
