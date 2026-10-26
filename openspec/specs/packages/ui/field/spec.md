# packages/ui/field Specification

## Purpose

Defines the composable form-field parts of `@mee/ui` (`Field` and `InputGroup` families): a labelled, bordered text input with helper text, counter, error message and leading and trailing adornments, from which any single-line text form can be assembled.

## Requirements

### Requirement: Field composition
`@mee/ui` SHALL export `Field`, `FieldLabel`, `FieldDescription`, `FieldCounter`, `FieldError`, `FieldFooter`, `InputGroup`, `InputGroupAddon`, `InputGroupText` and `InputGroupInput`. A field SHALL be assembled by placing the label, one `InputGroup` and the helper parts as children of `Field`, in any order the consumer chooses. `Field` SHALL stack its children vertically and take the full available width.

#### Scenario: Typical field
- **WHEN** a consumer renders a `Field` containing a `FieldLabel`, an `InputGroup` with an `InputGroupInput`, and a `FieldDescription`
- **THEN** the label, the bordered input and the description are shown top to bottom in that order

#### Scenario: Input group without a field
- **WHEN** an `InputGroup` with an `InputGroupInput` is rendered outside any `Field`
- **THEN** it renders and behaves as a text input with its own focus and filled state and no label

### Requirement: Shared field state
`Field` SHALL accept `invalid` and `disabled`, both off by default, and a `size` (S, M or L, default M), and SHALL apply them to every part inside it without the consumer repeating them on each part. The field SHALL also treat itself as focused while its text input has focus and as filled while the text input has a non-empty value, whether the input is controlled or uncontrolled.

#### Scenario: Disabled applied to all parts
- **WHEN** a `Field` is rendered with `disabled`
- **THEN** its label, input box, adornments and helper text all show the disabled appearance and the text input cannot be edited or focused

#### Scenario: Invalid applied to all parts
- **WHEN** a `Field` is rendered with `invalid`
- **THEN** its label, input box, counter and error message all show the error appearance

#### Scenario: Filled from user input
- **WHEN** the user types into an uncontrolled `InputGroupInput`
- **THEN** the field becomes filled, and becomes not filled again when the text is cleared

#### Scenario: Filled from a controlled value
- **WHEN** a controlled `InputGroupInput` is given a non-empty `value`
- **THEN** the field is filled on first render

### Requirement: Label content
`FieldLabel` SHALL show its text, followed by an asterisk when `required` is set, followed by the consumer-supplied `optional` text (for example a translated "(Optional)") at 75% opacity when it is given, followed, for the `above` placement only, by a consumer-supplied tooltip element, if any, separated by 4px. The label text SHALL use the size of the field (12px/16px for S, 14px/20px for M, 16px/24px for L). `@mee/ui` SHALL NOT supply any user-facing wording of its own. Label text SHALL use `text/default/body`.

#### Scenario: Required label
- **WHEN** a `FieldLabel` with the text "Email" is rendered with `required`
- **THEN** the label reads "Email*"

#### Scenario: Optional label
- **WHEN** a `FieldLabel` with the text "Nickname" is rendered with `optional` set to " (Optional)"
- **THEN** the label reads "Nickname (Optional)" with the "(Optional)" part dimmed

#### Scenario: No optional text
- **WHEN** a `FieldLabel` is rendered without `optional`
- **THEN** no optional marker is shown

#### Scenario: Tooltip slot
- **WHEN** a `FieldLabel` is given a tooltip element
- **THEN** the element is shown after the label text

### Requirement: Label placements
`FieldLabel` SHALL support three placements. With `above` (the default) the label SHALL be shown above the input box as a child of `Field`. With `edge` the label SHALL be a child of `InputGroup` and, at rest, occupy the input area like a placeholder; when the field is focused or filled it SHALL float up to sit on the top border of the box, masking the border behind its text, with the box height unchanged. With `inside` the label SHALL be a child of `InputGroup` and, at rest, occupy the input area like a placeholder; when the field is focused or filled it SHALL move to the top of the box at 12px/16px and the entered text SHALL move down to a second line beneath it, with the box height unchanged.

#### Scenario: Above label at rest
- **WHEN** a field with an `above` label is empty and not focused
- **THEN** the label is shown above the box and the box is empty apart from its placeholder, if any

#### Scenario: Edge label at rest
- **WHEN** a field with an `edge` label is empty and not focused
- **THEN** the label text is shown inside the box where the entered text would appear, in the placeholder colour

#### Scenario: Edge label floats
- **WHEN** the field with an `edge` label gains focus or has a value
- **THEN** the label moves onto the top border of the box and the box height does not change

#### Scenario: Inside label floats
- **WHEN** the field with an `inside` label gains focus or has a value
- **THEN** the label moves to the top of the box, the entered text is shown below it, and the box height does not change

#### Scenario: Floating is animated
- **WHEN** a floating label changes between resting and floated
- **THEN** the label and, for `inside`, the text line animate between the two positions, except when the system's reduce-motion setting is on, in which case they change immediately

#### Scenario: Floating label with an existing value
- **WHEN** a field with an `edge` or `inside` label is first rendered with a value
- **THEN** the label is shown floated immediately, without animating

#### Scenario: Placeholder with a floating label
- **WHEN** a field with an `edge` or `inside` label has a placeholder
- **THEN** the placeholder is shown only while the label is floated and the field is empty

#### Scenario: Floating placement outside an input group
- **WHEN** a `FieldLabel` with placement `edge` or `inside` is rendered outside an `InputGroup`
- **THEN** rendering fails with an error that says floating labels must be placed inside an `InputGroup`

### Requirement: Sizes
`InputGroup` SHALL support sizes S, M and L, taking the size of the surrounding `Field` unless given its own, and M when there is no `Field`. For `above` and `edge` labels the box SHALL be 30px (S), 36px (M) or 44px (L) high; for `inside` labels it SHALL be 40px, 48px or 56px high, resting or floated. The box SHALL have 12px horizontal padding (border included). Entered text, prefix text and the resting label SHALL be 12px/16px (S), 14px/20px (M) or 16px/24px (L) Public Sans Regular. The automatic alert icon SHALL be 14px (S and M) or 20px (L); other icons are sized by the consumer, with 14px (S), 16px (M) and 20px (L) being the design sizes.

#### Scenario: Default size
- **WHEN** an `InputGroup` with an `above` label is rendered without a size
- **THEN** the box is 36px high

#### Scenario: Small and large sizes
- **WHEN** an `InputGroup` with an `above` label is rendered with size S or L
- **THEN** the box is 30px or 44px high respectively, and its text uses the S or L sizes

#### Scenario: Size from the field
- **WHEN** an `InputGroup` without a size is placed in a `Field` with size L
- **THEN** the box is 44px high

#### Scenario: Inside label sizes
- **WHEN** an `InputGroup` with an `inside` label is rendered at size S, M or L, empty or filled
- **THEN** the box is 40px, 48px or 56px high

### Requirement: Box appearance and states
The box SHALL have a white `surface/default/main` fill, a 1px `stroke/gray/accent` border and a 12px corner radius. When focused it SHALL show a 1px `stroke/brand/solid` border and a 3px outer ring in `alpha/outline/brand`. When the field is invalid it SHALL show a 1px `stroke/error/solid` border, the label SHALL use `text/error/solid`, and the box SHALL show an exclamation-circle icon at the start of its trailing adornments. When disabled it SHALL show a `surface/gray/light` fill with text in `text/default/disabled`. When the field is both focused and invalid, the border SHALL stay `stroke/error/solid` and the 3px outer ring SHALL be `alpha/outline/error`. Entered text SHALL use `text/default/body`; placeholder and prefix text SHALL use `text/default/placeholder`. A disabled box SHALL keep its `stroke/gray/accent` border.

#### Scenario: Default box
- **WHEN** a field is not focused, valid and enabled
- **THEN** the box has a white fill and a 1px light grey border with a 12px radius

#### Scenario: Focused box
- **WHEN** the text input gains focus
- **THEN** the box shows the brand border and the 3px outer ring

#### Scenario: Invalid box
- **WHEN** the field is invalid
- **THEN** the border, label and error message are red and an exclamation-circle icon is shown before the other trailing adornments

#### Scenario: Disabled box
- **WHEN** the field is disabled
- **THEN** the box has the grey fill and its text is dimmed

### Requirement: Text input
`InputGroupInput` SHALL be a single-line native text input that accepts the standard text input props of the platform, including `value`, `defaultValue`, `onChangeText`, `placeholder`, `keyboardType`, `secureTextEntry`, `maxLength`, `onFocus` and `onBlur`, and SHALL call consumer handlers in addition to updating the field state. It SHALL render the platform text input unless the consumer supplies another text input component, and SHALL fill the space between the leading and trailing adornments. Pressing anywhere on the box SHALL focus the text input.

#### Scenario: Different text input component
- **WHEN** `InputGroupInput` is given another text input component to render, such as the one a bottom sheet requires for keyboard handling
- **THEN** that component is rendered in place of the native text input and receives the same props and ref, and the field still tracks its focus and value

#### Scenario: Props pass through
- **WHEN** `InputGroupInput` is given `secureTextEntry` and `keyboardType`
- **THEN** the input hides its text and shows that keyboard

#### Scenario: Consumer handlers still called
- **WHEN** the user focuses the input and types
- **THEN** the consumer's `onFocus` and `onChangeText` are called and the field state updates

#### Scenario: Press on box focuses input
- **WHEN** the user presses on an area of the box outside the text itself
- **THEN** the text input receives focus

#### Scenario: Disabled input
- **WHEN** the field is disabled
- **THEN** pressing the box does not focus the input

### Requirement: Adornments
`InputGroupAddon` SHALL place its children inside the box before the input (`align="start"`) or after it (`align="end"`), centred vertically, with 8px between children and 8px between the addon and the input. `InputGroupText` SHALL show static text such as a prefix, in the placeholder colour, followed by 2px and then the input. Any element, including icons and badges, SHALL be usable as an addon child.

#### Scenario: Leading icon and prefix
- **WHEN** a start addon contains an icon and an `InputGroupText` with the text "https://"
- **THEN** the icon and then "https://" are shown before the entered text

#### Scenario: Trailing add-ons
- **WHEN** an end addon contains two badges and a chevron icon
- **THEN** they are shown at the right end of the box in that order with 8px between them

#### Scenario: Invalid icon placement
- **WHEN** the field is invalid and has an end addon
- **THEN** the exclamation-circle icon is shown after the input and before the addon's own children, and is shown even when there is no end addon

### Requirement: Helper text
`FieldDescription` SHALL show helper text below the box in `text/default/subtle` at 12px/16px, using the remaining row width. `FieldCounter` SHALL show a short string, such as "0 / 20", right-aligned. `FieldFooter` SHALL lay its children out in one row with 8px between them so that a description and a counter share a line. `FieldError` SHALL show its message below the box in `text/error/solid` at 12px/16px only while the field is invalid. When the field is invalid, `FieldDescription` and `FieldCounter` SHALL also use `text/error/solid`. The gap between the box and the helper row SHALL be 2px.

#### Scenario: Description and counter
- **WHEN** a `FieldFooter` contains a description "Helper text" and a counter "0 / 20"
- **THEN** the description is at the left of one row and the counter at the right of the same row

#### Scenario: Error shown only when invalid
- **WHEN** a `FieldError` is rendered in a field that is not invalid
- **THEN** nothing is shown for it

#### Scenario: Error shown when invalid
- **WHEN** a `FieldError` with the message "Enter a valid email" is rendered in an invalid field
- **THEN** the message is shown below the box in red

#### Scenario: Helper text turns red
- **WHEN** the field becomes invalid
- **THEN** its description and counter switch to the error colour

### Requirement: Accessibility
The text input SHALL be exposed to assistive technology with the field's label text as its accessible name (unless the consumer gives one), SHALL expose the field's disabled state, and, because React Native has no invalid state, SHALL expose the `FieldError` message as its accessibility hint while the field is invalid. `FieldError` SHALL be announced when it appears. Tooltip, adornment and decorative icon elements SHALL NOT be required for the input to be understood.

#### Scenario: Label as accessible name
- **WHEN** a screen reader focuses an input inside a `Field` with a `FieldLabel` "Email"
- **THEN** it announces the input as "Email"

#### Scenario: Error exposed
- **WHEN** the field is invalid and shows an error message
- **THEN** the message is announced and is the input's accessibility hint

#### Scenario: Disabled state exposed
- **WHEN** the field is disabled
- **THEN** the input is exposed as disabled
