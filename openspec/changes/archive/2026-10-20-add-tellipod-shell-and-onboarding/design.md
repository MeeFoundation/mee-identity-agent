## Context

`apps/app-tellipod` is an Expo Router 5 app (Expo 53, RN 0.79, new architecture). Today `src/app/_layout.tsx` is a Stack with `headerShown: false` wrapping `(tabs)`, and `(tabs)/_layout.tsx` uses the default `Tabs` bar with `index`, `ask-telli` and `navigation`. The app has no state, storage or i18n libraries. `app-concepts` already uses `jotai`, `i18next`, `react-i18next` and `react-native-mmkv`, which is the pattern to follow. Figma (v4.0.3) shows a four-tab footer with an unread dot on Notifications, a welcome header with a search-or-ask field on tab screens, a back+search header on Navigation, and a pod header on Pod info where no footer appears. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- One mechanism for screens to control header and footer, with no stale or flickering chrome.
- Onboarding gate that is correct on the very first rendered frame (no flash of Home or onboarding).
- Thin route files; chrome and onboarding logic live outside `src/app`.

**Non-Goals:**
- Visual fidelity to Figma (colours, spacing, icons), search field behaviour, Navigation tree variants, onboarding steps/animation, real notification data, auth, per-user onboarding state.

## Decisions

### D1: Hybrid chrome - layouts render chrome once, screens declare it through a hook
`AppHeader` is rendered once by the root layout above the Stack; `AppFooter` is passed to `Tabs` as the custom `tabBar`. Both read a Jotai `chromeAtom` (`{ header: 'none' | 'home' | 'back-title' | 'pod', footer: 'visible' | 'hidden' }`). Screens call `useAppChrome({ header, footer })`.
- Alternative A, route-static `options.header`/`tabBarStyle`: no custom state, but duplicates header variants per layout and makes dynamic data (pod name, unread dot) awkward.
- Alternative B, pure store-driven with no defaults: fully dynamic but every screen must set everything, and forgetting to release causes stale chrome.
- Hybrid keeps a static default (`none`/visible) and lets screens override. Pod info has no footer structurally, since it lives in the root Stack outside `Tabs`; the footer flag matters for tab screens (e.g. hiding the footer for a keyboard-heavy screen later).

### D2: Focus-scoped, owner-checked release
`useAppChrome` applies its config in `useFocusEffect` and, on blur, resets to the default only if the atom still belongs to that screen (an owner id stored with the config). This avoids the race where the blurring screen's cleanup clears chrome that the newly focused screen has just set.
- Alternative: reset on unmount. Rejected because tab screens stay mounted and would never release.

### D3: Dynamic data lives in its own atoms
`unreadNotificationsAtom` (a count, 0 for now) feeds the footer badge, and a pod-title atom feeds the `pod` header. They are independent of `chromeAtom`, so footer content never depends on which screen is focused. Per CLAUDE.md, shared state uses Jotai atoms, not `useState`.

### D4: Onboarding gate with `Stack.Protected`, flag in MMKV
The root layout uses `<Stack.Protected guard={!onboarded}>` for `onboarding` and `<Stack.Protected guard={onboarded}>` for `(tabs)` and `pods/[id]`. `onboardedAtom` is created with `atomWithStorage` over an MMKV-backed synchronous storage adapter, so the value is known on first render and no splash hold or flicker is needed. Start sets the atom to true; the guard swap replaces the onboarding screen and removes it from back history. Guarded routes also cover deep links (Expo Router redirects to the first available route).
- Alternative: AsyncStorage plus a splash hold until hydrated. Rejected as it adds an async step and a loading state.
- Alternative: imperative `router.replace` redirects. Rejected since it does not protect deep links and leaves the screen reachable via back.
- The stored key is `onboarding.completed`, per device. Per-user state is deferred until auth exists.

### D5: i18next with a single English resource
`i18next` + `react-i18next`, initialised once at app start with an `en` resource containing screen names, tab labels, onboarding title and Start. No device-locale detection yet.

### D6: Structure
Route files in `src/app/` only render a screen component and call `useAppChrome`. FSD layers beside them: `shared/` (storage adapter, i18n setup, chrome store/hook), `widgets/app-header`, `widgets/app-footer`, `features/onboarding`, and screen components per page. Routes: `(tabs)/index`, `(tabs)/ask-telli`, `(tabs)/notifications`, `(tabs)/navigation`, `pods/[id]`, `onboarding`.

## Risks / Trade-offs

- [MMKV is a native module, so the existing dev build will not contain it] -> user runs `pnpm install` and a native rebuild; CLAUDE.md requires confirmation first, and root-hoisting means the Podfile may need the autolinking search path check noted for app-production.
- [Header rendered at the root sits outside tab navigation, so the `home` variant's search field is shared by three tabs] -> acceptable now; per-tab search state can move into a screen-level atom later.
- [`Stack.Protected` is recent API] -> available in expo-router 5.1 (installed `~5.1.6`); verify during the first task.
- [Owner check adds a little complexity] -> prevents the focus/blur race, covered by a test of two consecutive screens.

## Migration Plan

Nothing is deployed and no data is migrated. The existing `(tabs)` screens are modified in place and `notifications` is added. Rollback is reverting the change.
