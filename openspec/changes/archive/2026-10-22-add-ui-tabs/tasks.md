## 1. Setup

- [x] 1.1 Add `react-native-reanimated` (same version as app-tellipod, ~4.7.1) as a peer dependency and dev dependency of `@mee/ui`, after the user confirms running `pnpm install`; verify `pnpm --filter @mee/ui check-types` resolves the module
- [x] 1.2 Create `packages/ui/src/Tabs.tsx` with the prop types (`items`, `value`, `onValueChange`, `size`) and export it from `packages/ui/src/index.ts`; verify `import { Tabs } from '@mee/ui'` type-checks

## 2. Tab visuals

- [x] 2.1 Implement the tab item with label, optional left and right icon slots, sizes M and L (height, padding, 8px gap, 10px radius, Public Sans SemiBold 16/24) using named constants for Figma token values; verify against the Figma screenshots of nodes 4:7861 and 6466:3124
- [x] 2.2 Implement Hover (pressed/hover fill `#f1f5f9`) and Focus (fill `#f8fafc`, 2px `#4f868e` border without changing tab size) states; verify against Figma nodes 4:7899 and 503:2210 in the story
- [x] 2.3 Add tab role, label and selected accessibility state on each tab and a tab list role on the row; verify with a component test that queries by role

## 3. Animated indicator and overflow

- [x] 3.1 Measure each tab with `onLayout` and render one indicator (white, 1px `rgba(2,6,23,0.1)` border, two-layer shadow, 10px radius) behind the tabs that animates `translateX` and `width` to the selected tab with `withTiming`; verify in the story that selecting tabs of different widths slides and resizes the bubble
- [x] 3.2 Place the indicator without animation on first render and when reduced motion is on, and render it only after the selected tab has been measured; verify by reloading the story and observing no slide-in
- [x] 3.3 Keep the indicator aligned when the selected tab's layout changes (e.g. label edited); verify with a story control that changes a label
- [x] 3.4 Wrap the row in a horizontal `ScrollView` and scroll the selected tab into view on selection change; verify with the many-tabs story that selecting an off-screen tab scrolls it fully visible

## 4. Stories and tests

- [x] 4.1 Add `packages/ui/src/Tabs.stories.tsx` (stateful wrapper) covering sizes M and L, with icons, without icons, varied label lengths and many tabs; verify `pnpm --filter app-tellipod storybook:generate` picks it up and the stories render in `pnpm tellipod:storybook:ios`
- [x] 4.2 Add a component test for selection behavior (press unselected tab calls `onValueChange` with its key, press selected tab does not) following existing Jest setup in app-tellipod or the repo's testing convention, and verify it passes; if `@mee/ui` has no test runner, record that in the task notes and cover the behavior in stories instead

## 5. Verification

- [x] 5.1 Run `pnpm check-types` and `pnpm lint` from the repo root and verify both pass with no errors
- [x] 5.2 Run the Storybook on iOS and Android and verify the bubble animation, states and sizes match the Figma Tab set (node 4:7862)
