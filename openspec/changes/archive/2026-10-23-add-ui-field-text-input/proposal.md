## Why

`@mee/ui` has no text entry. The Mee design system defines a Text Field (Figma "Text Field - Input / Select / Multiselect") that the apps need for every form, but it is a matrix of 3 label styles x 3 sizes x 10 states plus add-ons. Building it as one configurable `TextInput` would duplicate the label, helper, error and adornment logic and would not extend to the select, checkbox and switch controls that follow.

## What Changes

- Add a composable form-field family to `@mee/ui`, modelled on shadcn's `Field`, so any form can be assembled from the same parts:
  - `Field`: wrapper for one field. Takes `invalid`, `disabled` and `size`, and shares them, the label text and the control's focus and value state with its children through context.
  - `FieldLabel`: label with required marker, optional marker and tooltip slot. `placement` is `above` (default), `edge` or `inside`.
  - `FieldDescription`, `FieldCounter`, `FieldError`, `FieldFooter`: the helper row under the control (`FieldFooter` lays the description and counter out in one row).
  - `InputGroup`, `InputGroupAddon`, `InputGroupText`, `InputGroupInput`: the bordered box with the native text input and its leading and trailing adornments (icons, prefix text, badges, chevron).
- Support sizes S, M and L and the three label placements from the design. `edge` and `inside` labels float when the field is focused or has a value; `inside` moves the entered text down under the floated label.
- Support the focus, filled, alert (invalid) and disabled states from the design.
- Add the `search`, `exclamation-circle` and `question-circle` icons the field needs.
- Add stories and tests for each new part, following the existing `@mee/ui` conventions.

Out of scope for this change: select and multiselect fields (chips), the password-strength meter and progress bar, add-on presets (flag, currency, time, payment method), horizontal orientation, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldSeparator`, `FieldContent`, and the dark-mode column of the design sheet.

## Capabilities

### New Capabilities
- `packages/ui/field`: the `Field` family and `InputGroup` family of `@mee/ui` - label placements, sizes, states, helper row, error display, adornment slots and accessibility wiring.

### Modified Capabilities
- `packages/ui/icons`: adds `SearchIcon`, `ExclamationCircleIcon` and `QuestionCircleIcon` to the exported icon set.

## Impact

- `packages/ui/src`: new `Field` and `InputGroup` modules with stories and tests, three new files under `icons/`, and updated `index.ts` and `icons/index.ts` exports.
- No new dependencies: uses React Native `TextInput` and `Pressable`, `react-native-reanimated` for the floating label (already a peer dependency, used by `Tabs`) and `react-native-svg` for icons.
- No impact on `app-*` workspaces until they adopt the components.
