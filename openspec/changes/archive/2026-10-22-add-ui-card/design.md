## Context

`@mee/ui` (`packages/ui/src`) holds `Button`, `CellInfo` and `Tabs`. Each is a single file with a local `colors` object, `StyleSheet`, a `.stories.tsx` and a `.test.tsx` next to it. `Tabs` already animates with `react-native-reanimated` (`withTiming`, `Easing`, `ReduceMotion`). The package has no state library, so shared UI state lives in the consuming app (Jotai atoms there). Icons exist only in the Tellipod app (`apps/app-tellipod/src/shared/ui/icons`, drawn with `react-native-svg`), which `@mee/ui` cannot import. See proposal.md for why a container is needed.

Figma nodes 38:2735, 820:14161, 820:18488 and 13:10668 show one pattern: a rounded surface that holds content (rows, a form block, an empty-state message, an icon-and-text onboarding block, a photo with a button) and optionally a footer action. A form block ("Contact info") has a header row, rows, and its own footer ("Add contact info"), and can expand. In 820:14161 and 820:18488 that form block sits inside a container whose footer is "Create form" / "Add form"; this is a container holding a block, not a form inside a form. The Attachments / Subpods / Members rows are header-only blocks. The `CellInfo` header numbers (8/16 padding, 8 gap, 32px icon holder) already match the Figma header row.

## Goals / Non-Goals

**Goals:**
- A blank `Panel` container usable for any content, and a `Card` form block that adds header, expand/collapse and its own footer, sharing one surface and one footer action.
- Expandable behavior that parent screens can drive from their own state.
- Icons available inside `@mee/ui`.
- No changes to `Button` or `Tabs`, and to `CellInfo` only the one accessibility prop in decision 9.

**Non-Goals:**
- A "Section Title" header and the uppercase section heading.
- A shared token module: components follow `CellInfo` and keep a local `colors` object.
- Moving the existing Tellipod app icons into `@mee/ui`.

## Decisions

**1. `Panel` and `Card` are separate, sharing internal parts.**
`Panel` is the blank container: surface, content, optional always-visible footer. `Card` is a form block: the same surface, plus a header, a collapsible body and a footer shown while expanded. Both are built from three internal parts kept in `PanelParts.tsx` (not exported from the package): the surface, the content wrapper that hides the last row's divider, and the footer action. A single component with every prop would blur two roles, and a pure `Card` could not hold content like a photo with a button without carrying an unused header and expansion API. Putting the parts in one internal module avoids a circular import between `Panel` and `Card`.

**2. Header is a render prop, `header: (state: { expanded: boolean; toggle: () => void }) => ReactNode`.**
The consumer writes the `CellInfo` and passes `onPress={toggle}`, `accessibilityState={{ expanded }}` and `trailing={<CardChevron expanded={expanded} />}`. Alternatives: `Card` clones the header element to inject props, which silently loses them when the header is not a `CellInfo`; or header props that duplicate `CellInfo`'s mini-group layout. The render prop is explicit and typed.

**3. Controlled with an uncontrolled fallback.**
`expanded` + `onExpandedChange` is the primary API, matching `Tabs` (`value` / `onValueChange`), so an app can keep expansion in a Jotai atom. `defaultExpanded` seeds an internal state when `expanded` is `undefined`. When neither is given the card is expanded, so a card that never toggles is a static block.

**4. Expandable is inferred from use, not a flag.**
A card collapses only when the consumer calls `toggle` or controls `expanded`. Header-only navigation blocks use the same component.

**5. Footer is data, not a slot.**
`footer: { label, icon?, variant: 'outline' | 'ghost', onPress }`, one type (`PanelFooter`) for both components. Only these two shapes appear in the designs. It does not reuse `Button`, whose variants (`primary`, `secondary`, `danger`) do not match, and changing `Button` is out of scope.

**6. Footer visibility follows its component.**
A `Panel` footer is always visible. A `Card` footer is rendered inside the collapsible region, so collapsing hides it while a surrounding `Panel`'s footer stays. No extra visibility logic is needed.

**7. Height animation with Reanimated.**
The body is wrapped in an animated container whose height is driven by a shared value between 0 and the measured content height (`onLayout`), with `withTiming` and `ReduceMotion.System`, the same pattern family as `Tabs`. The first render sets the height without animating, and a collapsed body is hidden from accessibility and touches while its content stays mounted for measurement.
Alternatives: `LayoutAnimation` (global, inconsistent between platforms) and unmounting the body on collapse (loses the measured height and the animation).

**8. Last-row dividers are overlapped and covered, never clipped.**
`CellInfo` always draws a 1px bottom border, which would show a line above a footer button and under a header-only block, where the design shows none. The content wrapper has a -1px bottom margin, so the last row's border overlaps the next element by one pixel; the footer carries a 1px opaque strip at its top that covers it, and at the card's bottom edge the surface's own rounded clip cuts it. `Card` applies the same -1px margin to the whole card when only the header is visible (collapsed, or no body and no footer). The header's divider stays above an expanded body. Nothing uses `overflow: hidden` around the content, because that would cut the shadow of a contained form, which is what separates it from the footer below it (Figma 820:15452). An earlier version clipped the content and skipped the clip when a child's type was a registered `Panel` or `Card`; it failed for a `Card` rendered by a consumer's wrapper component, which is the normal case, so type detection was dropped. The cost is that the last pixel of arbitrary content (for example a photo) can be covered by the footer strip. `CellInfo` is unchanged.
Alternative: have consumers override the border through `style`, pushing the problem into every call site.

**9. `CellInfo` forwards `accessibilityState` to its pressable.**
The header must announce expanded or collapsed and it is a `CellInfo`, whose pressable accepts no state. `CellInfoBase` gains `accessibilityState?: AccessibilityState`, applied only on the `Pressable` branch. It is a pure addition. Alternatives: drop the state from the spec (leaves screen-reader users without the cue); wrap the header in a second `Pressable` (two buttons, split touch target); clone the header (decision 2's rejected approach).

**10. Icons are components in `@mee/ui` built on `react-native-svg`.**
One file per icon under `packages/ui/src/icons`, with `size` and `color` props and the Figma path data, following the pattern of the Tellipod icons. `react-native-svg` is a peer dependency (apps already use `15.16.0`) and a dev dependency of the package. `CardChevron` renders `ChevronRightIcon` and rotates it, replacing a hand-drawn chevron. Alternatives: images (not recolourable, blurry at other sizes); keeping icons in the app and passing them in (what the stories cannot do, and the icons are shared design-system assets).

**11. Stories use render functions, not args carrying React elements.**
Storybook's arg inference walks every arg value. React elements created while a story file loads (during a render) carry the rendering component as their owner, so the walk reached React Navigation's `LinkingContext` and threw, which stopped Storybook from launching. `CellInfo.stories.tsx` is converted to render-only stories, and the new stories follow the same rule.

**12. `Panel` has an optional `gap`.**
Several forms in one container need spacing, and the designs do not define it, so it is a prop (default none) applied to the content wrapper, not a baked-in value. The stories use 12px, matching the spacing between the navigation cards.

**13. Colours and shadow are local.**
Following `CellInfo`, `PanelParts.tsx` holds a local `colors` object (white surface, `alpha/dark/5`, `stroke/gray/accent` `#CBD5E1`, `text/gray/solid` `#334155`). Extracting shared tokens is a separate change.

## Risks / Trade-offs

- [Clipping a divider by layout is fragile if `CellInfo`'s border width changes] → Tests assert the clipping on the content wrapper for each case, so a change fails loudly.
- [Measuring body height with `onLayout` can report 0 before the first layout, or when the content changes size while collapsed] → Re-measure on every layout, treat an unmeasured body as auto-height on first render, and animate only after the first measurement.
- [A render-prop header lets a consumer forget `onPress={toggle}`, producing a card that cannot expand] → Stories show the standard pattern, and `Card` stays valid as a static block.
- [Hand-converted icon paths could drift from Figma] → Paths are copied from the Figma assets unchanged, and the icon story is the visual check against the design.
- [`react-native-svg` becomes a peer dependency of `@mee/ui`] → Both apps already depend on the same version; installing requires `pnpm install`.
- [Figma shows divider lines inconsistently between node 38:2735 (every row) and 820:14161 (last row only, in a near-invisible colour)] → Follow `CellInfo`'s divider under every row and hide the last one; do not change `CellInfo` to match one node.

## Open Questions

- The right default spacing between several forms in one container, once a design shows it. It does not change the API.
