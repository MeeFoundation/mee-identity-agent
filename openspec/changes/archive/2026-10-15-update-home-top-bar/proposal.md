## Why

The app's Home header in the prototypes is out of date. The Tellipod design's `home-topbar` (Figma node 905:15156, Mee – Tellipod App v4.0.3) adds a privacy line, "Device-to-device sharing, pod members only.", and a "Search, or ask Telli…" field. It also places the avatar beside the greeting instead of above it. Two copies of the old header exist, so they would drift apart again with every design update.

## What Changes

- A shared **Home top bar** component following `home-topbar`:
  - the user's avatar initial (48 px) to the left of the greeting;
  - under the greeting, a shield-lock icon and the line "Device-to-device sharing, pod members only.";
  - a full-width "Search, or ask Telli…" field with a search icon.
- **Inert search field:** it looks like a field but accepts no text and does nothing. Each flow may be told when it is activated.
- **Only the Home screen** changes. Pod top bars and every other screen stay as they are. Two Home screens use the new component:
  - SC-PET-001's `home`;
  - the shared Ginger Home used by EXP-PET-003, EXP-PET-004 and EXP-PET-005.
- **Experiments** record a new `search_selected` event when the search field is activated, so a wrong turn into search is measurable. SC-PET-001 records nothing, as showcases are not tracked.
- **Greeting** stays "Welcome, Alice". The Figma frame's "Bogdan" is placeholder data.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-ux-flows/design-system`: adds a "Home top bar component" requirement.
- `app-ux-flows/showcases/sc-pet-001`: "Home" shows the new top bar, with an inert search field.
- `app-ux-flows/experiments/exp-pet-003`:
  - "Home" shows the new top bar, and the search field is recorded;
  - "Experiment analytics events" adds `search_selected`.
- `app-ux-flows/experiments/exp-pet-004`:
  - "Home, Ginger tabs and Ginger Info" shows the new top bar;
  - "Experiment analytics events" adds `search_selected`.
- `app-ux-flows/experiments/exp-pet-005`:
  - "Baseline path in every variant" shows the new top bar;
  - "Experiment analytics events" adds `search_selected`.

## Impact

- New `apps/app-ux-flows/src/shared/ui/home-top-bar.tsx`, registered in `shared/ui/pod-components.ts`.
- `src/slices/flow/flows/sc-pet-001/components/home-view.tsx` and `src/slices/flow/pods/ginger/components/ginger-home-view.tsx` replace their inline headers with it. `GingerHomeView` gains an `onSearchSelect` callback.
- EXP-PET-003, EXP-PET-004 and EXP-PET-005:
  - their Home screens pass `onSearchSelect`;
  - their `*Events` types gain `search_selected`.
- `src/app/locales/en.ts`: `ui.homeTopBar.*` strings.
- Running studies of EXP-PET-003/004/005 will see the new Home header from the next deployment. If a study is live, use the `hidden` flag or wait.
- No dependency changes. The shield-lock and search icons are the design's SVGs, added to `src/shared/ui/icons/`.
