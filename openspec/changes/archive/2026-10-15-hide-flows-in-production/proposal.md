## Why

Every registered flow, variant and case is on the deployed app's home page, so a showcase or variant that is still being built ships to testers as soon as it is merged. Authors need to keep unfinished work in the codebase, and see it on the dev server, without anyone seeing it in production.

## What Changes

- A flow, an experiment's variant and a showcase's case can each be marked **hidden**.
- In production builds, anything hidden is treated as if it were not declared:
  - a hidden flow is not listed and its URLs show the not-found state;
  - a hidden variant or case has no start action and isn't in the briefing's "Try case" actions, and `?variant=` or `?case=` naming it is removed from the URL like an unknown one;
  - a hidden variant is never automatically assigned; a stored assignment to it is discarded and replaced;
  - if a hidden variant is the default, or a hidden case is the first case, the first visible one takes its place;
  - a flow whose variants or cases are all hidden is hidden as a whole.
- On the dev server (`pnpm dev`) hidden items work as today. A "Hidden in production" label on the home page shows they are hidden.
- Section counts on the home page count only the flows that are listed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-ux-flows/flow-runtime`: flows and cases may be declared hidden. The registry, home page and case selection leave out hidden items in production builds, and the home page labels them in development builds.
- `app-ux-flows/flow-variants`: variants may be declared hidden. In production, variant selection and the `variant` URL parameter treat hidden variants as undeclared.

## Impact

- `apps/app-ux-flows/src/slices/flow/runtime/define-flow.ts`: an optional `hidden` field on flows, variants and cases.
- `apps/app-ux-flows/src/slices/flow/registry.ts`: in production, filters hidden flows and strips hidden variants and cases. A new pure helper and its tests sit beside it.
- `apps/app-ux-flows/src/routes/home.tsx`, `src/slices/home/*`: the dev-only "Hidden in production" label.
- `apps/app-ux-flows/src/app/locales/en.ts`: the label string.
- Routes, variant selection, case resolution and the briefing are unchanged, because they already read flows from the registry.
- No dependency, deployment or Docker changes. The production build decides what is hidden, so every container image hides the same items.
