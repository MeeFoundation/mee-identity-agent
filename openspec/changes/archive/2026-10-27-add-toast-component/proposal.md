## Why

The Mee Design System (v5.2.4) defines a Toast, and the Tellipod designs already use it for confirmations such as "Invite link sent to Geo". `@mee/ui` has no Toast, so screens would have to build their own. `app-ux-flows` already has a web Toast, but it covers only two of the design's types and none of its avatar or action slots.

## What Changes

- Add a presentational `Toast` to `@mee/ui` with the types `primary`, `secondary`, `tertiary`, `dark`, `success`, `danger` and `warning`, following the Figma Toast component set.
- `Toast` has optional slots: avatar, icon, title, description, actions (placed at the bottom or on the right) and a close button.
- Add the `info-circle`, `check-circle`, `exclamation-octagon`, `exclamation-triangle` and `x` icons to `@mee/ui` for the Toast's per-type default icons and close button.
- Add `Toast.stories.tsx` covering every type, every slot, both action placements, a long-text case, and the two Tellipod layouts: a full-width single-line toast pinned to the bottom edge, and the same toast floating over scrolled content.
- Align the `app-ux-flows` web Toast with the same seven types and slots, and add a Toast requirement to its design-system capability. Existing flows that pass `variant`, `title`, `description`, `action` and `onClose` keep working unchanged.

Out of scope: a toast host, a `showToast()` API, queueing, auto-dismiss, swipe-to-dismiss, and any change to `app-tellipod`. These can follow as a separate change.

Assumption: for `app-ux-flows`, "showcases" means the Toast component aligned to the design and used by the existing `SC-*` flows. No new `SC-*` flow is added, because that would need a flow ID and scenario from the product side.

## Capabilities

### New Capabilities
- `packages/ui/toast`: the `@mee/ui` Toast component, with its types, slots, action placements, close behavior and stories.

### Modified Capabilities
- `packages/ui/icons`: adds the `info-circle`, `check-circle`, `exclamation-octagon`, `exclamation-triangle` and `x` icons.
- `app-ux-flows/design-system`: adds a Toast requirement covering the seven types and the avatar, icon, description and action slots.

## Impact

- `packages/ui/src`: new `Toast.tsx`, `Toast.stories.tsx`, `Toast.test.tsx`; new icon files and exports in `icons/index.ts`; export from `index.ts`.
- `apps/app-ux-flows/src/shared/ui/toast.tsx`: extended types and slots, plus i18n keys for any new labels.
- No new dependencies. `@mee/ui` already has `react-native-svg` and `react-native-reanimated` as peer dependencies.
- `@mee/ui` and `app-ux-flows` stay separate implementations, because the app is a Vite and Tailwind web app that does not consume `@mee/ui`.
