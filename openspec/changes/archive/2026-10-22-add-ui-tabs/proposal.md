## Why

The Mee design system defines a Tab component (Figma "Tab", node 4:7861: states Default, Hover, Focus, Active; sizes M and L), but `@mee/ui` only has `Button`. Apps need a shared tab bar, and the selected tab should read as a "bubble" that slides to the newly selected tab instead of each tab flipping its own background.

## What Changes

- Add a `Tabs` component to `@mee/ui`: a horizontal row of tabs with one selected tab, in sizes M (36px) and L (44px).
- Each tab has a label and optional left and right icon slots, matching the Figma Tab layout (icon 24px, 8px gap, 10px radius).
- The selected state is drawn by a single shared indicator (white surface, 1px `alpha/dark/10` border, `shadow-2`) that animates its position and width to the selected tab, using Reanimated.
- Hover (pressed) and keyboard/accessibility focus states follow the design: `surface/gray/light` fill on hover, `surface/gray/soft` fill plus 2px `stroke/brand/strong` border on focus.
- Wrap the tabs in the Figma "Tabs horizontal" container (tinted, bordered track, 1px gap, M and L paddings and radii).
- Add a Storybook story covering sizes, states, icons and the animated selection.
- Add `react-native-reanimated` as a peer dependency (and dev dependency) of `@mee/ui`.

## Capabilities

### New Capabilities
- `packages/ui/tabs`: the `Tabs` component, its visual states and sizes, selection behavior and the animated selection indicator.

### Modified Capabilities
- `packages/ui/storybook`: no requirement change; the existing "Story per component" and "Variant and state coverage" requirements already apply to `Tabs`.

## Impact

- `packages/ui/src`: new `Tabs.tsx`, `Tabs.stories.tsx`, export from `index.ts`.
- `packages/ui/package.json`: new peer and dev dependency on `react-native-reanimated` (needs `pnpm install`, which requires user confirmation).
- No change to apps; app-tellipod already ships Reanimated ~4.7.1 and Storybook, so the story is visible there.
