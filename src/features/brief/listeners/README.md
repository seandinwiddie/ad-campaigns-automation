# Brief Listeners

This folder contains the side effects that coordinate the brief feature with the UI layer.

## Files
- `briefListener.ts`: Watches the semantic `clearBriefEditor` workflow action and fans it out into `setBriefRawText('')` plus `clearBrief()` so the editor and parsed brief never drift apart.
