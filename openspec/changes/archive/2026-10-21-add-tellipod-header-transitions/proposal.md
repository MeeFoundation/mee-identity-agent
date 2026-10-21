## Why

Moving between screens in app-tellipod swaps the app header instantly. Its content and height change at once (Home, Navigation and Pod info have different heights), so the header jumps while the page body transitions. Animating the swap makes navigation feel continuous.

## What Changes

- When the header variant changes, the outgoing content fades out and the incoming content fades in, over about 200 ms.
- The header surface animates its height between variants (`none`, `home`, `back-search`, `pod`) instead of jumping, including growing from and collapsing to no header.
- The animation follows the device's reduce-motion setting: when it is on, the header changes without animation.
- A single header surface persists across the `home`, `back-search` and `pod` variants; only its content is swapped.
- No new dependencies: `react-native-reanimated` and `react-native-worklets` are already in app-tellipod.

## Capabilities

### New Capabilities

### Modified Capabilities
- `app-tellipod/app-shell`: adds a requirement describing the header transition between variants, including reduced motion.

## Impact

- `apps/app-tellipod/src/widgets/app-header/` (`AppHeader`, `HeaderSurface`, the three variant components).
- `apps/app-tellipod/jest.setup.ts` and header tests (animation library in the test environment).
- No change to the chrome state model or to screens; no native or dependency changes.
