## Why

`app-tellipod` is a bare Expo Router shell with three placeholder tabs and the default tab bar, while the Tellipod Figma (v4.0.3) defines four primary screens, a pod detail screen, and header/footer chrome that changes per screen. We need the navigable skeleton, the chrome mechanism, and a persisted onboarding gate in place before feature work and the onboarding animation begin.

## What Changes

- Add placeholder screens that show only their name: Home, Ask Telli ("search or ask"), Notifications, Navigation, and Pod info (pushed, with a pod id).
- Add the Notifications tab, so the footer has four tabs: Home, Ask Telli, Notifications, Navigation.
- Add an app header and an app footer rendered once by the layouts, driven by a shared chrome store.
- Add a per-screen hook through which a screen declares its header variant and footer visibility; chrome applies on focus and is released on blur.
- Add a footer unread indicator on Notifications, driven by its own store independent of the active screen.
- Add an onboarding screen (title and a Start button only) shown on first launch, with completion persisted across app restarts and gating the rest of the app.
- Introduce Jotai, MMKV storage and i18next in `app-tellipod`; all user-facing strings go through i18next.

## Capabilities

### New Capabilities
- `app-tellipod/app-shell`: placeholder screens, the four-tab footer, the header variants, and the mechanism by which screens control header and footer.
- `app-tellipod/onboarding`: first-launch onboarding gate and persisted completion state.

### Modified Capabilities

## Impact

- `apps/app-tellipod/src/app/**` (route files, root and tabs layouts) and new FSD layers beside them (`shared`, `widgets`, `features`).
- `apps/app-tellipod/package.json`: add `jotai`, `react-native-mmkv`, `i18next`, `react-i18next`; requires `pnpm install` and a native rebuild of the iOS/Android projects (MMKV is a native module).
- No changes to `@mee/core` or other apps. Header search behaviour, Navigation screen tree variants, onboarding steps/animation and real notification data are out of scope.
