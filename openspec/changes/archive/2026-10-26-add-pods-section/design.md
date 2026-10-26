## Context

See proposal.md for motivation. Current state in `apps/app-tellipod/src/features/pods`:

- `PodList` loads pods through `usePodList` and delegates rendering to `PodListView`, which owns the pending, error and empty states. Its empty state is hard-coded to the localized text `pod.list.empty`.
- `PodCard` already matches the design's 60/68-point "Card-Cell" row, so the section reuses it unchanged.
- `shared/ui` holds the design tokens (`colors`, `spacing`, `radii`, `typography`). It lacks `surface/brand/soft` #F3F8F8, `text/default/body` #1E293B, the XS semibold typography style, the 2XL semibold style and the SM regular style used by the design.
- `shared/ui/icons` has a chevron-right but no arrow-right, plus-lg or cookie icon. `@mee/ui` has a `Button` with only primary, secondary and danger variants, no icon support and no gradient, so it does not express the design's "Add Pod" or "Maybe later" buttons.
- `expo-linear-gradient` and `react-native-mmkv` are already app-tellipod dependencies; the header already uses `LinearGradient`.
- The home route (`app/(tabs)/index.tsx`) is a placeholder; wiring the section into it is not part of this change.

## Goals / Non-Goals

**Goals:**
- One `PodsSection` component, in the pods feature, that matches Home-3's "Recent Pods" block and Home-1's empty card.
- Keep `PodListView`'s default behavior unchanged for existing consumers.
- Stories for every state, runnable without a network.

**Non-Goals:**
- Persisting the "Maybe later" dismissal across launches, and creating the add-pod and see-all-pods screens.
- Changing `@mee/ui`.
- The "New info shared with you" row and the Categories grid.

## Decisions

**1. The section lives in `features/pods/ui` and is composed by the screen.** It needs the pods data hook and `PodCard`, both inside the feature, and it is used by a single screen. A widget would only add a layer; placing it in the feature keeps FSD import direction (`app` -> `features`) and lets the feature barrel export it. Alternative: a `widgets/pods-section` widget - rejected because nothing outside the pods feature is composed into it.

**2. Empty content is a slot on `PodListView`/`PodList`, not a copy of the state logic.** Add an optional `empty` prop (a React node) to both. `PodListView` shows it instead of the default message only in the loaded-and-empty branch, so pending and error handling stay in one place and existing callers and tests are untouched. Alternative: `PodsSection` reads `usePodList` itself and decides which state to render - rejected because it would duplicate the pending/error/limit logic and drift from `pod-list`.

**3. The section has to know when to hide its header.** The header must be absent in the empty state only, yet the header sits above the list. `PodsSection` therefore calls `usePodList` for the list state and renders the list through `PodListView`, instead of through `PodList`. It passes the CTA card as `empty` and hides the header when the list is loaded and empty. `PodList` stays as it is, apart from forwarding `empty`, so other consumers are unaffected. Alternative: render the header inside the list view - rejected because it would put home-screen layout into a generic list.

**4. Callbacks only; no persistence.** `onAddPod`, `onDismissEmpty`, `onSeeAll` and `onPodPress` are props. The user did not answer the "Maybe later" question, so this takes the recommended option; persisting the dismissal can be added by the screen (MMKV is available) without changing the section's API. The card stays visible after pressing "Maybe later" until its owner stops rendering the section.

**5. Local buttons for the card instead of changing `@mee/ui` `Button`.** The "Add Pod" button needs a gradient, an inner highlight and an icon, and "Maybe later" needs a text-only style; neither exists in `@mee/ui` and changing it would affect other apps. Build a small private `EmptyPodsCard` in the feature using `Pressable` and `expo-linear-gradient`, and revisit extracting a shared button variant when a second use appears. Alternative: add `ghost` and `icon` to `@mee/ui` `Button` - rejected as out of scope and cross-app.

**6. Tokens and icons are added to `shared/ui`, not inlined.** Add `surfaceBrandSoft`, `textDefaultBody`, and the `xsSemibold`, `smRegular` and `2xlSemibold` typography entries, and the arrow-right, plus and cookie icons in the existing SVG-icon style (with `IconProps`), registered in the icons index and gallery story. Icon paths come from the Figma assets' SVGs; they are copied once into icon components, never referenced by URL.

**7. Layout and limit.** The section is a vertical stack with 12-point gaps; the home screen's 20-point gutter and the 32-point gap between sections belong to the screen. The default `limit` is supplied by the screen (Home-3 shows two rows); the section requires it rather than defaulting it.

**8. Stories use the mock API, not the network.** The five stories render the presentational pieces with fixed data, like `PodListView.stories.tsx` does, so the stories do not need the pods store. This requires `PodsSection` to be split into a presentational view that takes the list state and a thin wrapper that supplies it from `usePodList`, matching the `PodList`/`PodListView` split.

**9. Optional "See all pods" and "Add Pod" handlers.** The app has no screen for either, and project rules forbid placeholder handlers. `onSeeAll` and `onAddPod` are therefore optional: the header link and the card's primary button render only when their handler exists. Home passes neither until the screens exist, so wiring them later is one prop each. Alternative: pass no-op handlers - rejected as placeholder code that shows controls that do nothing.

**10. Home wiring and session-long dismissal.** A `HomePods` widget (`widgets/home-pods`) renders a `ScrollView` with 20-point padding containing `PodsSection` with `params={{ sort: 'last_activity' }}` and `limit={2}` (Home-3 shows two rows), and `app/(tabs)/index.tsx` renders it after declaring the home chrome. The widget exists because a test file inside `app/` would be picked up as a route, and because it keeps the route file thin. The params object is a module constant so `usePodList`'s request memo stays stable. A pod press calls `router.push` to `/pods/[id]` with the pod id. "Maybe later" sets a plain Jotai atom (not persisted, kept in the pods feature store) that the widget reads. Because the widget cannot tell whether the list is empty, and a dismissed card must not hide pods that arrive later, the section gets an optional `hideEmpty` prop: when true and the list has loaded empty, the section renders nothing. The footer is not an overlay in this app, so the design's 96-point bottom spacer is not needed. Alternative: persist with MMKV - deferred by the user.

## Risks / Trade-offs

- [The section is split in two (view and data wrapper), which adds a file] -> It mirrors the existing `PodList`/`PodListView` split and is what makes the stories network-free.
- [The CTA card's buttons duplicate button styling that may later live in `@mee/ui`] -> Keep them private to the card and small; extract when a second screen needs them.
- [The card stays visible after "Maybe later" until the screen reacts] -> Documented in the spec; the screen owns dismissal. Until the screen is wired, the callback has no visible effect.
- [Missing tokens are added with values read from Figma] -> Values are taken from the design's variables (#F3F8F8, #1E293B); the verification task compares them with the frames.

## Open Questions

- Where "Add Pod" and "See all pods" will navigate, and whether "Maybe later" should persist across launches. Both are deferred; adding either later changes only the Home screen wiring.
