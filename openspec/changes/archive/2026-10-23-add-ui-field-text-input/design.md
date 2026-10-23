## Context

`@mee/ui` is a React Native package with flat component files (`Tabs.tsx`, `Panel.tsx` + `PanelParts.tsx`), colocated `*.stories.tsx` and `*.test.tsx`, and a local `colors` object per component named after Figma tokens (no shared token module). `Tabs` already uses Reanimated with `ReduceMotion.System` and tracks hover/focus with local state. Only `ChevronDownIcon` of the icons the field needs exists today.

Source design: Figma "Mee - Design System v5.2.3", node `4:10661` (Text Field sheet). The Figma component set is one component with a `Style` axis (label above / on edge / inside) x `Size` (S/M/L) x state flags. The structure borrows from shadcn's `Field` family so that other controls (checkbox, switch, select) can later share the same label, description and error parts. See proposal.md for motivation and scope.

## Goals / Non-Goals

**Goals:**
- One set of small parts that covers all three label placements, three sizes and the focus/filled/alert/disabled states of the Figma text field.
- Parts that other controls can reuse later without changing their API.
- Accessible by default: the label names the input and invalid/disabled state is exposed.

**Non-Goals:**
- A single `TextInput` component that takes every option as a prop.
- A shared design-token module (kept as a separate, later change; this change follows the per-file `colors` pattern).
- Hover styling: the design sheet defines no hover state for the field.

## Decisions

### D1. Compose parts instead of configuring one component
`Field` provides state; `FieldLabel`, `FieldDescription`, `FieldCounter`, `FieldError` read it; `InputGroup` draws the box and its addons; `InputGroupInput` is the native input. This mirrors shadcn's `Field`/`Input Group` split and the Figma anatomy (label row, field box, helper row).
*Alternative:* one `TextInput` with `label`, `helper`, `error`, `leftIcon`, `rightAddons` props. Rejected: it would have to grow a prop for every Figma add-on preset and could not host a checkbox or switch later.

### D2. Context carries field state; no ids or `htmlFor`
React Native has no `htmlFor`/`aria-describedby`. `Field` provides a context with `invalid`, `disabled`, `focused`, `filled` and the label text; the input reads it. Focus and filled are derived at runtime from the input and are not props; `invalid` and `disabled` are props on `Field` (replacing shadcn's `data-invalid`).
*Alternative:* pass `invalid`/`disabled` to each part. Rejected: easy to get inconsistent (red label, grey box).

### D3. Accessible name via label registration
`FieldLabel` registers its text (when its children is a string) with the `Field` context; `InputGroupInput` sets it as `accessibilityLabel`, plus `aria-disabled` and `editable`. `aria-labelledby` is not used because it only works on Android in React Native, and React Native 0.88 has no invalid accessibility state, so `FieldError` also registers its text and the input exposes it as `accessibilityHint` while invalid. `FieldError` is an alert live region so errors are announced.
*Trade-off:* a non-string label child gives no accessible name; consumers can pass `accessibilityLabel` to `InputGroupInput` to override.

### D4. Floating labels are children of `InputGroup`
`edge` and `inside` labels are placed by the consumer inside `InputGroup`, where `FieldLabel` reads an `InputGroup` context (size, box fill colour) and draws itself absolutely positioned over the box. The box already knows its size and focus state, so it owns the geometry; `above` stays a normal `Field` child. One `FieldLabel` component and one `placement` prop cover all three.
*Alternative:* always render the label as a sibling and position it by measuring the box. Rejected: brittle offsets, and the box must move the entered text down when an `inside` label floats.
A floating placement outside an `InputGroup` throws a descriptive error rather than rendering mispositioned.

### D5. Floating animation uses transform, not font size
Resting label is the input's text size; floated label is 12px/16px. Reanimated animates a 0-1 progress value driving `translateY`/`translateX` and `scale` (12 divided by the text size: 1, about 0.857 and 0.75 for S, M and L) from the left origin, with `ReduceMotion.System` as in `Tabs`. The box height is fixed in every style (Figma keeps the `inside` box at 40/48/56 whether resting or floated); when an `inside` label floats, the text line moves down 8px to sit under the 16px label. The resting label's horizontal position is where the input starts (after any leading icon and prefix), measured by layout; the floated `edge` label sits at x=10 on the border, and the floated `inside` label starts where the text line begins (after the leading icon). Initial render with a value or focus starts at progress 1 without animating.
*Alternative:* animate `fontSize`. Rejected: not UI-thread animatable and causes text re-layout.

### D6. Edge notch is a masking background
The floated `edge` label has a background matching the box fill (white, or `surface/gray/light` when disabled) that covers the label's whole height, so the 1px border and the 3px focus ring (drawn outside the box) both stop at the label instead of running through its text. Figma's own 4px line-breaker is not enough here because the ring is drawn outside the box. *Trade-off:* it is only correct because the box fill is solid; there is no true cut-out.

### D7. Standalone `InputGroup`
If no `Field` is above it, `InputGroup` creates its own state provider so it works as a bare input (used in quick forms and stories). `size` lives on `Field` so that the label above the box matches the box; `InputGroup` falls back to it.

### D7b. `FieldFooter` row
Composition needs a layout part for the helper row (description left, counter right), so `FieldFooter` is a small row container. The automatic alert icon is rendered by `InputGroupInput` right after the input, so it sits before any end addon without the consumer adding it.

### D8. File layout
`fieldContext.ts` (internal, not exported from the package: the `Field` and `InputGroup` contexts, state hook and size metrics), `Field.tsx` (Field, description, counter, error), `FieldLabel.tsx`, `InputGroup.tsx` (group, addon, text, input). Colours live in a local `colors` object per file. New icons go under `icons/` with their own file and export, following `chevron-down.tsx`.

### D9. No user-facing strings in `@mee/ui`
The "(Optional)" text is passed in by the consumer via `optional`, so translation stays in the apps (i18next).

## Risks / Trade-offs

- [Text sizes for S and L were inferred from line heights in the sheet (S 12/16, L 16/24); the S and L metadata for boxes (30/44, inside 40/56), icons and label-to-box gaps (S 2px, M 6px, L 8px) matches what is implemented] -> Confirm visually on device (task 5.3).
- [Floating label with a tinted parent background looks wrong on `edge`] -> Document the solid-fill assumption in the story; revisit if a design needs it.
- [Android clipping of the `edge` label that overflows the box] -> Verify on Android during implementation; if clipped, move the label to a sibling layer in `InputGroup`.
- [Description and error stack as two lines if a consumer renders both] -> Consumers render one or the other for the single helper line shown in the design; both is allowed.
- [Per-file `colors` objects repeat tokens] -> Accepted here; a shared token module is a separate change.

## Open Questions

- What the `Placeholder=True` variants show for a floated label (assumed: placeholder visible only once the label has floated).
