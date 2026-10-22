## Context

`AppFooter` (`apps/app-tellipod/src/widgets/app-footer/app-footer.tsx`) is the custom `tabBar` for the expo-router tabs layout. It renders text-only tabs with hard-coded colors, an unread dot driven by `unreadNotificationsAtom`, and hides itself when `chromeAtom.footer === 'hidden'`. Shared tokens live in `src/shared/ui/tokens.ts`; icons are hand-ported SVG components in `src/shared/ui/icons/` (react-native-svg, `color`/`size` props). `react-native-reanimated` 4.x is already used by the header and the `@mee/ui` Tabs, both with `ReduceMotion.System`. See proposal.md for motivation.

Design (Figma node 13:1056, tab variants 13:1061 inactive / 13:1065 active): tab = 24pt icon, 2pt gap, 10/14pt Public Sans Medium label with 0.05 tracking, padding 16 top / 10 bottom; inactive label `#334155`, active label and filled icon brand `#4f868e`; bar = `rgba(255,255,255,0.8)`, 1pt white border (top/sides), 28pt top radius, shadow `0 -1 30 rgba(2,6,23,0.1)`, 8pt horizontal padding; badge 8pt `#b91c1c` with 2pt white border at top-right of the bell.

## Goals / Non-Goals

**Goals:**
- Match the Figma footer for surface, tab layout, typography, colors, icons and badge.
- Smooth color-only transition on tab change, with no scaling or movement of icon or label.
- Keep existing behavior: tab press/navigation semantics, accessibility roles and states, unread indicator, hidden footer.

**Non-Goals:**
- Background blur (see Decision 4), dark mode, or changes to routes, screens or the header.
- Animating the footer's appearance/disappearance.
- Extracting a reusable tab-bar component into `@mee/ui`.

## Decisions

1. **Layered content with an opacity cross-fade (no new dependency).** Each tab renders its content twice at identical position: an inactive layer (outline icon, slate label) in normal flow and, stacked above it at `absoluteFill`, an active layer (filled icon, brand label). A single shared progress value (0 → 1) per tab drives the active layer's `opacity` via `useAnimatedStyle`, so the color appears to change in place while icon and label never move or scale. Transitions use `withTiming` (~250 ms, `Easing.out(Easing.cubic)`, `ReduceMotion.System`), matching the Tabs component. The initial value is set directly from `focused` so there is no mount animation.
   *Alternatives:* (a) Animating `color` on the icon and label directly — the icon components take a plain `color` prop, so it cannot be driven by a shared value without changing every icon; rejected. (b) A radial reveal with a growing circular clip — needs measured layout and animated width/height/offset for no visual benefit once only a color change is wanted; rejected. (c) `@react-native-masked-view/masked-view` or SVG `ClipPath` — extra native module or font handling; rejected.

2. **Both layers use the same icon component with a `color` prop; filled/outline are separate components.** Add `HomeIcon`, `TelliGuideIcon`, `BellIcon`, `NavigationIcon` each with an `outline` and `filled` export (or a `variant` prop) in `shared/ui/icons`, ported from the Figma SVGs (downloaded with `curl -L`, never referencing temporary Figma URLs). The icons come from Bootstrap Icons: filled house and bell are `house-fill` and `bell-fill`. The Telli Guide glyph is custom and the list-nested glyph is line-only, so neither has a filled variant; their active layer reuses the same glyph in the brand color.

3. **Tab content as a small internal component, route-to-icon map in the footer.** A `FooterTab` component (in the `app-footer` slice) takes `focused`, `label`, `icon`, `badge`. The route name → icon mapping is a constant in the footer. The unread badge sits above both layers, outside the fading layer, so it stays fully visible in both states. The tab root must not use `flex: 1`: inside the auto-height `Pressable` it would collapse to zero height.

4. **No blur.** The design's `backdrop-blur(10px)` needs a blur view (`expo-blur`, not installed — a native dependency requiring user-approved install and rebuild). The 80% white fill is kept, which is visually near-identical over the app's light screens. If the blur is wanted later it is an additive change to the surface only.

5. **Surface and safe area.** The container uses an 80%-white background, 1pt `strokeDefaultMain` border on top/left/right, `radii['3xl']` top corners, and the upward shadow (iOS shadow props plus `elevation` for Android, as in `HeaderSurface`). The Figma "home indicator" row is a device chrome mock, so the real bottom inset (`useSafeAreaInsets().bottom`) replaces it, with the design's 8pt gap as the minimum bottom padding. Tab padding follows the design (16 top, 10 bottom, 2 gap).

6. **Tokens.** Add the missing values to `tokens.ts` rather than inlining: `textBrandMain` (`#4f868e`), `textGraySolid` (`#334155`), `surfaceErrorSolid` (`#b91c1c`), `alphaWhite80`, plus an `xxsMedium` typography entry (Public Sans Medium, 10/14, 0.05 tracking), `spacing[4]` (16), `radii` already has `3xl`, and `motion.footerDuration`.

7. **Label copy.** Only the visible tab label changes: `footer['ask-telli']` becomes "Telli Guide". The route name `ask-telli` and the screen's own title are unchanged (assumption: the screen title stays "Ask Telli" until the design says otherwise).

## Risks / Trade-offs

- **Overlapping text while fading** → The inactive layer stays opaque beneath the fading active layer, so antialiased glyph edges may blend slightly mid-transition; the end states are exact.
- **Text rendered twice** → Accessibility would announce duplicates; mitigate by marking the decorative layers `accessible={false}` / `importantForAccessibility="no-hide-descendants"` and keeping the Pressable's own `accessibilityLabel` and `tab` role/selected state.
- **Missing filled icons for two tabs** → Fallback in Decision 2; visible difference is limited to the glyph fill, not the color animation.
- **No blur** → Slight visual difference from Figma when content scrolls under the footer; documented above.
- **Existing tests query tab labels by text** (`getByText('Home')`) → Duplicated label text would break them; implement the inactive layer as the only layer exposed to queries and update tests deliberately.
