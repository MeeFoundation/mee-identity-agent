## Context

- Figma node 4:7861 is one variant of the "Tab" component set (4:7862): States Default, Hover, Focus, Active × Sizes M (36px) and L (44px). The Tab has an optional left icon, label and optional right icon. The Figma "Tabs horizontal" container is a separate library component and was not part of the request.
- `@mee/ui` is consumed from source (`main: src/index.ts`) and has only `Button`, which hardcodes its colors locally. Design tokens (`colors`, `spacing`, `radii`, `fontFamilies`) live in app-tellipod (`src/shared/ui/tokens.ts`), which `@mee/ui` cannot import.
- `@mee/ui` has no animation dependency. app-tellipod already uses `react-native-reanimated` ~4.7.1, and Storybook for `@mee/ui` runs inside app-tellipod.
- Public Sans fonts are loaded by the consuming app (`PublicSans_600SemiBold`).

## Goals / Non-Goals

**Goals:**
- A reusable `Tabs` whose selected surface slides to the selected tab.
- Faithful Figma visuals for all four states and both sizes.

**Non-Goals:**
- Tab panels or content switching, swipe-between-pages, vertical tabs ("Tabs vertical" in Figma), badges or closable tabs.
- Moving app-tellipod tokens into `@mee/ui` or refactoring `Button`.
- Code Connect mapping for the Figma component.

## Decisions

1. **Yes, the sliding bubble is possible: one absolutely positioned indicator, not per-tab backgrounds.** Each tab reports its `onLayout` (x, width). The indicator is an `Animated.View` behind the tab row whose `translateX` and `width` are shared values driven by the selected tab's layout via `withTiming`. Alternative: animate each tab's own background opacity; rejected because it cross-fades rather than moving, which is not the effect the user described.

2. **Reanimated, as a peer dependency of `@mee/ui`.** Animation runs on the UI thread and matches how app-tellipod already animates. The built-in `Animated` API cannot animate `width` with the native driver, so the bubble would run on the JS thread. Trade-off: `@mee/ui` now requires Reanimated from its consumers (peer plus dev dependency, like `react` and `react-native` today).

3. **Timing, not spring.** `withTiming` of about 250ms with an ease-out curve. A spring that overshoots would push the bubble over neighbouring tabs' labels. Reduced motion is respected by setting values directly (`useReducedMotion`). Exact duration is a tuning detail for the story.

4. **Controlled API with a generic key.** `Tabs` takes `items: { key, label, iconLeft?, iconRight? }[]`, `value` and `onValueChange(key)`, plus `size?: 'M' | 'L'`. Icons are `ReactNode` slots, so `@mee/ui` does not depend on app icon sets or `react-native-svg`. Alternative considered: compound components (`<Tabs><Tab/></Tabs>`); rejected as heavier for no current need, and `items` makes layout measurement and scroll-into-view simpler.

5. **State visuals by layer.** The indicator renders the Active surface (white, 1px `rgba(2,6,23,0.1)` border, two-layer shadow `0 0 3 rgba(2,6,23,0.07)` + `0 2 2 rgba(2,6,23,0.05)`), so tabs themselves only draw Hover and Focus. Hover uses `Pressable`'s hover state (web and pointer devices; on touch the pressed state shows the same fill). Focus uses `onFocus`/`onBlur`, drawn as a 2px border; the border is inset-sized so the tab does not change size. Unselected text color is `#0f172a`; hover and focus text is `#1e293b`, as in the design.

6. **Horizontal `ScrollView` for overflow, with scroll-to-selected.** On selection change, scroll so the selected tab's measured frame is inside the viewport. No scroll indicator.

7. **Tokens kept local to the component file, like `Button`.** Values are named constants at the top of `Tabs.tsx` (colors, sizes, padding, radius) with the Figma token name in the constant name. Promoting shared tokens into `@mee/ui` is a separate change.

8. **Container from Figma "Tabs horizontal" (node 6466:3053).** The tab row sits in a track: `alpha/dark/5` fill (`rgba(2,6,23,0.05)`), 1px `alpha/dark/10` border, 1px gap between tabs, padding 4px and radius 12px for M, padding 6px and radius 14px for L. The border is drawn outside the padding box in RN, so content padding is the Figma padding minus 1px to keep the 44px (M) and 56px (L) overall heights. The container hugs its content up to the available width, and the scroll view lives inside it so only the tabs scroll. The Figma background blur (15px) is not reproduced: it has no core RN equivalent, and behind a 5% tint it is barely visible. Revisit if the track is placed over imagery.

9. **Story in `Tabs.stories.tsx`** with a stateful wrapper (the control state is a story concern, so `useState` is acceptable there), stories for M, L, icons, many tabs (overflow) and varied label lengths to show width animation. Hover and Focus are reviewed interactively on a device.

## Risks / Trade-offs

- [Indicator flashes at the wrong place before layouts are measured] → Render the indicator only after the selected tab has reported its layout, and set (not animate) the first position.
- [Layout changes after labels change leave the indicator stale] → The indicator target is derived from stored layouts and re-applied when the selected tab's layout updates.
- [Hover is invisible on touch devices] → Acceptable: pressed state provides the same fill; hover is a pointer/web affordance.
- [Reanimated peer dependency breaks other consumers of `@mee/ui`] → Only app-tellipod consumes `@mee/ui` today, and it already depends on Reanimated. Documented in the proposal impact.
- [Reanimated, `pnpm install` and iOS pods] → `react-native-reanimated` resolves from the hoisted root `node_modules`; adding it to `@mee/ui`'s dev dependencies needs `pnpm install` run by the user, and no native change is needed because app-tellipod already links it.
