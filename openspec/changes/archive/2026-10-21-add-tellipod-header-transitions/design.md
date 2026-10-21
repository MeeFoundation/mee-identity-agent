## Context

`AppHeader` (`widgets/app-header/app-header.tsx`) renders one of `HomeHeader`, `BackSearchHeader` or `PodHeader` from `chromeAtom`, or `null` for `none`. Each variant wraps its content in its own `HeaderSurface` (gradient, bottom radius, border, shadow, safe-area top padding), so a variant change unmounts one surface and mounts another, which is the jump. The header sits above the navigation stack in `app/_layout.tsx`, so it is not animated by the stack. `react-native-reanimated` 4.7 and `react-native-worklets` are already dependencies with pods installed, and `babel-preset-expo` configures the worklets plugin. Nothing in `src/` uses reanimated yet. See proposal.md for scope.

## Goals / Non-Goals

**Goals:**
- Crossfade content and animate surface height on variant change, driven by the existing chrome state.
- Honor reduce-motion; keep existing accessibility and truncation behavior.
- No change to the chrome state model or to what screens declare.

**Non-Goals:**
- Directional (push/back) slide of the header content.
- Animating the footer or the stack transition.
- Animating changes inside a variant (tab selection, greeting).

## Decisions

**1. Hoist `HeaderSurface` into `AppHeader` and render variant content inside it.** The surface then persists across `home`, `back-search` and `pod`, so only content crossfades and the surface looks continuous. The variant components keep their content and drop their `HeaderSurface` wrapper. Alternative: keep one surface per variant and crossfade whole headers; rejected because the gradient, border and shadow would fade through each other and flash. For `none` the surface itself is removed (see 3).

**2. Reanimated layout animations, not manual shared values.** Wrap each variant's content in an `Animated.View` keyed by variant with `entering={FadeIn.duration(200)}` and `exiting={FadeOut.duration(200)}`, and make the surface container an `Animated.View` with `layout={LinearTransition.duration(200)}`. The container height follows its content (no measured heights to track), and an exiting view no longer takes part in layout, so the container animates from the old to the new height as the old content fades. Alternative: `useSharedValue` height driven by `onLayout` measurements of hidden copies; rejected as more code and a measurement pass per variant.

**3. `none` mounts no surface.** `AppHeader` renders the surface only when the variant is not `none`, with the surface itself using `entering`/`exiting` (fade plus height via layout) so the header grows from and collapses to nothing. Alternative: always render a zero-height surface; rejected because the shadow and top inset padding would still show.

**4. Reduce motion via Reanimated's own setting.** Layout animations take `.reduceMotion(ReduceMotion.System)`, which is also the default; each animation is built with it explicitly so the intent is visible and a test can assert it. Alternative: read `AccessibilityInfo.isReduceMotionEnabled` and branch; rejected as duplicating what the library does.

**5. Duration and easing.** 200 ms for content fade and height, `Easing.out(Easing.quad)` for the height. A shared constant in `shared/ui` tokens (`motion.header`) so the 300 ms ceiling in the spec has one source.

**6. Pointer events.** The exiting `Animated.View` gets `pointerEvents="none"`, so only incoming content receives presses.

## Risks / Trade-offs

- [Exiting content positioned over the shrinking container may overflow the rounded corners] → the surface keeps `overflow: 'hidden'`; verify visually on Home → Pod info.
- [Layout animations are not run by the Jest environment] → mock reanimated in `jest.setup.ts` (`react-native-reanimated/mock`) and assert structure (same surface instance, keyed content, reduce-motion option) rather than frames; timing and smoothness are checked on the simulator.
- [Shadow is clipped or flickers while the height changes] → shadow stays on the outer non-clipping view as today; check on a physical-size simulator and adjust.
- [Rapid navigation (back twice) interrupts a transition] → Reanimated cancels and retargets layout animations; verify there is no stuck half-faded header.
- [Safe-area top padding animating with the surface] → padding is part of the surface content so it grows with it; verify nothing shows under the inset mid-transition.
