## Context

`@mee/ui` components are single React Native files in `packages/ui/src/` with a hardcoded `colors` object, `StyleSheet.create` styles and Public Sans font names such as `PublicSans_600SemiBold` (see `CellInfo.tsx`, `Button.tsx`). There is no shared token module. Slots hold consumer-provided nodes and icons are not bundled (see the `cell-info` spec). Each component has a colocated `*.stories.tsx` and `*.test.tsx`, and is exported from `index.ts`.

The Figma Badge page (node 4:8701) is a variant matrix: type x style x size x shape. Size XXS to M differ in height, padding, label style and slot size; types differ only in their color set; shapes differ in radius and content.

## Goals / Non-Goals

**Goals:**
- One `Badge` component that renders the whole Figma matrix from props, with values taken from design tokens.
- No per-variant branching beyond lookup tables.

**Non-Goals:**
- Migrating the private NEW badge in `CellInfo`.
- Introducing a shared token module for `@mee/ui`.
- Pressable or dismissible badges.

## Decisions

**Flat props, not a discriminated union.** `type`, `variant` for the style, `size`, `shape`, `children` (label or value), `leading`, `icon` and `trailingIcon` slots, and `style`. The style prop is named `variant` instead of `style` because `style` is already the layout style prop in React Native. A union that forbids slots on `circle` and `dot` is stricter than `CellInfo` needs here; instead the component ignores slots for those shapes and the spec states it. Alternative: a union like `CellInfoProps`. Rejected because the shapes share every other prop and the union would multiply the stories and tests for little safety.

**Lookup tables for color and size.** A `colors` table keyed by type holds `solid`, `soft`, `light` and `text` values, and a `sizes` table keyed by size holds height, padding, font size, line height, letter spacing, slot size and radius. Style selection is a function of the style: solid uses `solid` for fill, border and `#FFFFFF` text; light uses `soft`, `light` and `text`; outlined uses transparent fill, `light` and `text`. This keeps the 5 x 3 x 4 matrix to two small tables and one function. The table values are the Figma token hex values and follow how `CellInfo` names them.

**Shape handling.** `rounded` uses the size radius, `pill` and `circle` use 9999. `circle` sets `minWidth` to the height and centers the text, so widths grow with the value as in Figma. `dot` renders an empty `View` of 4/8/12/16px. Dot is rendered without a label, so `children` is ignored.

**Label padding.** The Figma label has its own horizontal padding equal to the badge padding. The label gets that padding on its own `Text` wrapper, so slots sit the same distance from the label as the badge edge does. Circle badges keep the 2px outer padding from the design.

**Truncation.** The label is a single-line `Text` with `numberOfLines={1}` and `flexShrink: 1`; slots get `flexShrink: 0`, as in `CellInfo`.

**Accessibility.** The container is a plain `View`; text is exposed by its `Text`. A `dot` sets `accessible={false}` and `importantForAccessibility="no-hide-descendants"` unless `accessibilityLabel` is given, in which case it is `accessible` with that label.

**Fonts.** The label uses `PublicSans_600SemiBold`, already loaded by the apps that use `CellInfo`.

## Risks / Trade-offs

- [The color values are duplicated in a local table, as in other components] → They stay in one table in `Badge.tsx` so a future shared token module can replace them in one place.
- [The design places a leading dot inside rounded and pill badges, and its color was not confirmed from the design context] → Render it in the badge's text color; confirm against Figma while implementing and adjust the one style if it differs.
- [Figma does not draw every combination; for example some sizes lack circle or dot in a given style] → The component supports every combination, which is a superset of the design and costs nothing in code.
- [The `CellInfo` NEW badge stays duplicated] → Tracked as a follow-up change; it is out of scope here.
