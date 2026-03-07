# TODO

## MVP Stabilization

- [ ] Finish Leonardo-only cleanup and remove any stale provider references from low-signal docs or fixtures.
- [ ] Keep credential persistence and Leonardo server proxy behavior covered by tests.
- [ ] Keep Storybook fixtures aligned with the Redux state shape.

## Verification

- [ ] `npm run lint`
- [ ] `./node_modules/.bin/tsc --noEmit`
- [ ] `npm test -- --runInBand`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] `npm run test:storybook`

## Post-MVP

- [ ] Reintroduce localization behind a dedicated text-generation provider.
- [ ] Decide whether translated text should be stored alongside the original campaign message in metadata.
- [ ] Add retry/backoff tuning for Leonardo generation polling with real production limits.
- [ ] Consider additional persistence targets beyond Dropbox.
