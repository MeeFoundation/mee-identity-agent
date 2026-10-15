## Why

Development-only features are tied to the local dev server: the screen catalogue, display codes and Figma links, variant labels, and flows, variants and cases marked hidden. A designer or reviewer looking at the deployed app can't see unfinished work, or which variant they're in, without running the project locally.

## What Changes

- **Dev mode** becomes a runtime state of the app. It is on:
  - always on the local dev server, as today;
  - on a deployed (production) build when the page is opened with `?mode=dev`. It then stays on for that browser tab, across navigation and reloads, until the tab closes or the page is opened with `?mode=off`.
- **What dev mode shows:** a production build in dev mode behaves as a development build for every requirement that tells the two apart:
  - the catalogue, display codes and Figma links;
  - variant information;
  - hidden flows, variants and cases, with their "Hidden in production" label;
  - analytics console output.
- **Analytics:** when dev mode is turned on by the URL, nothing is sent to Matomo for the rest of that tab's session, so reviewers' runs never reach study data. Events still go to the browser console. The dev server's analytics are unchanged.
- **Indicator:** when dev mode is on through the URL, the home page shows a "Dev mode" note with a "Turn off" action, which reloads the app with `?mode=off`.
- **Other values:** any other `mode` value is ignored. On the dev server, `?mode=off` has no effect.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-ux-flows/flow-runtime`: adds a "Dev mode" requirement. It defines how dev mode is turned on and off, says a production build in dev mode follows the development-build behaviour of every `app-ux-flows` requirement, and adds the home page indicator.
- `app-ux-flows/flow-analytics`: adds an "Analytics in dev mode" requirement. Dev mode turned on by the URL sends nothing to Matomo and writes events to the console.

## Impact

- New `apps/app-ux-flows/src/shared/lib/dev-mode.ts`. It works out dev mode once, at load, from the build, the `mode` URL parameter and the tab's `sessionStorage`, and also records where dev mode came from.
- These places switch from `import.meta.env.DEV` to dev mode:
  - `slices/flow/registry.ts` (hidden items);
  - `routes/home.tsx` (the catalogue and the assigned variant);
  - `routes/flow.$screenId.tsx` (the variant label).

  The analytics diagnostic warnings stay on the dev server only.
- `app/analytics.ts`: console output follows dev mode, and Matomo is left out when dev mode came from the URL.
- `slices/home/home-page.tsx` and `app/locales/en.ts`: the dev mode note and the "Turn off" action.
- `DEPLOYMENT.md`: documents `?mode=dev` and `?mode=off`.
- No dependency or container changes. It isn't access control: the hidden code already ships in the bundle, and `?mode=dev` only shows it.
