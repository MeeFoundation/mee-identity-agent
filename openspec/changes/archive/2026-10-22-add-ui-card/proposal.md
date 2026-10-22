## Why

The Tellipod Info screens group content in white rounded containers: member lists, form blocks with rows ("Contact info"), navigation rows (Attachments / Subpods / Members), the empty "no forms yet" message, and the onboarding card with an icon, text and buttons. A container can carry a footer action ("Create form", "Invite member"), and a form block inside it can expand and collapse. `@mee/ui` has the rows (`CellInfo`) but no container, so every screen would re-implement the surface, the footer actions and the expand behavior. The designs also use icons (pencil, plus, folder-plus and others) that `@mee/ui` cannot show, because its icons live in the Tellipod app.

## What Changes

- Add a `Panel` component to `@mee/ui`: the blank container with a white, rounded, elevated surface, arbitrary content (rows, a form block, an empty-state message, a photo with a button) and an optional footer action. It hides the divider of the last content row so no line appears above the footer or at the bottom edge, keeps the shadow of any contained form visible, and takes an optional `gap` between content children.
- Add a `Card` component to `@mee/ui`: a form block built on the same surface, with a header supplied through a render prop that receives `{ expanded, toggle }`, a body and an optional footer action shown while expanded. Expansion is controlled through `expanded` / `onExpandedChange`, with `defaultExpanded` as an uncontrolled fallback, and the body animates open and closed.
- A `Panel` can contain `Card`s (a container with a form block and a "Create form" footer); `Card` and `Panel` are siblings sharing the surface and the footer action, not nested forms.
- Add `CardChevron`, an exported chevron that rotates with `expanded`, for a header's `trailing` slot.
- Add an icon set to `@mee/ui` (`react-native-svg`), starting with the icons the stories and `CardChevron` need.
- Add an optional `accessibilityState` prop to `CellInfo` (pressable rows only), because the `CellInfo` header is the element that must announce expanded or collapsed.
- Add stories and tests for `Panel`, `Card` and the icons, matching the existing `CellInfo` and `Tabs` coverage. Stories do not use `args` that contain React elements.

Out of scope: the "Section Title" header from Figma 38:2735, the uppercase section heading ("FORMS"), shared colour/shadow tokens, moving the existing Tellipod app icons into `@mee/ui`, and a fixed spacing between forms (the designs show one form per container, so `Panel` takes an optional `gap`).

## Capabilities

### New Capabilities
- `packages/ui/panel`: the `Panel` container, its content and divider rules, and its footer action.
- `packages/ui/card`: the `Card` form block, its header render prop, expand/collapse behavior, footer, and `CardChevron`.
- `packages/ui/icons`: the shared icon set of `@mee/ui`.

### Modified Capabilities
- `packages/ui/cell-info`: a pressable `CellInfo` accepts an accessibility state, so a `Card` header built from a `CellInfo` can announce whether it is expanded or collapsed.

The existing `packages/ui/storybook` requirements ("Story per component", "Variant and state coverage") already apply to the new components without changing.

## Impact

- `packages/ui/src/Panel.tsx`, `PanelParts.tsx` (internal), `Card.tsx`, `icons/*`, their stories and tests (new), and `packages/ui/src/index.ts` (new exports).
- New dependency: `react-native-svg` as a peer and dev dependency of `@mee/ui` (already used by the apps; needs `pnpm install` to link). Animation uses `react-native-reanimated`, already a dependency.
- `CellInfo` gains one optional prop, `accessibilityState`, forwarded to its pressable row. `CellInfo.stories.tsx` stops passing React elements through `args`, which crashed Storybook's arg inference. `Button` and `Tabs` are untouched.
- No app code changes; apps adopt `Panel`, `Card` and the icons in later changes.
