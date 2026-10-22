## Why

The Mee design system defines a Cell info component (Figma "Cell info", node 13:12972) used for list rows that show a member, a group, a labeled value, or an info prompt. `@mee/ui` has only `Button` and `Tabs`, so each screen would have to rebuild these rows. A shared `CellInfo` gives apps one tested implementation of every variant in the design.

## What Changes

- Add a `CellInfo` component to `@mee/ui` that renders the eight Figma variants: `member`, `mini-group`, `info`, `suggested-info`, `another-user-submitted`, `conflicting-data`, `info-added-in-chat` and `add-info-in-chat`.
- Each variant has its own padding, gap, bottom border and text styles from the design, with data supplied as props (label, value, section, role, name, avatar initial) so no copy is hardcoded.
- Trailing icons, the mini-group leading icon and the `info` NEW badge are supplied through `ReactNode` slots or a `isNew` flag. `@mee/ui` does not import app icon sets or `react-native-svg`, matching the `Tabs` decision.
- Rows are pressable when an `onPress` is given, with button accessibility semantics and a combined accessible label.
- Add `CellInfo.stories.tsx` covering every variant, the `isNew` badge, long-text truncation and press behavior.
- Add a component test for rendering and press behavior, following `Tabs.test.tsx`.

## Capabilities

### New Capabilities
- `packages/ui/cell-info`: the `CellInfo` component, its eight variants, content slots, press behavior and accessibility.

### Modified Capabilities
- `packages/ui/storybook`: no requirement change; the existing "Story per component" and "Variant and state coverage" requirements already apply to `CellInfo`.

## Impact

- `packages/ui/src`: new `CellInfo.tsx`, `CellInfo.stories.tsx`, `CellInfo.test.tsx`, export from `index.ts`.
- No new dependencies and no native changes.
- No change to apps; the stories are visible through app-tellipod's Storybook.
- Icons from the design (chevron-right, passport, pencil, plus, plus-lg, exclamation-circle) are not added to `@mee/ui`; stories reuse app-tellipod icons only if reachable, otherwise simple placeholder glyphs like `Tabs.stories.tsx`.
