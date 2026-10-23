# packages/ui/cell-info Specification

## Purpose

Defines the shared `CellInfo` component of `@mee/ui`: a list row that shows a member, a group, a labeled value or an info prompt, in the variants defined by the Mee design system.

## Requirements

### Requirement: Variants
`CellInfo` SHALL support the variants `member`, `mini-group`, `info`, `suggested-info`, `another-user-submitted`, `conflicting-data`, `info-added-in-chat` and `add-info-in-chat`. Every variant SHALL render as a full-width row with a 1px bottom border and no other border, and SHALL show only the content the variant defines.

#### Scenario: Member variant
- **WHEN** `CellInfo` is rendered as `member` with a name, a role and an avatar initial
- **THEN** the row shows a 48px circular avatar with the initial, the name with the role beneath it, and a trailing icon slot, with 12px gap, 12px left padding, 16px right padding and 12px vertical padding, a 72px minimum height and an `stroke/gray/light` bottom border

#### Scenario: Mini-group variant
- **WHEN** `CellInfo` is rendered as `mini-group` with a name and a leading icon
- **THEN** the row shows a 32px circular avatar holding the icon, the name filling the remaining width, and a trailing icon slot, with 8px gap, 8px left padding, 16px right padding, 8px vertical padding and an `stroke/gray/light` bottom border

#### Scenario: Info variant
- **WHEN** `CellInfo` is rendered as `info` with a label and a value
- **THEN** the row shows the label above the value on the left and a trailing icon slot on the right, with 12px gap, no left padding, 8px right padding, 12px vertical padding and an `stroke/gray/soft` bottom border

#### Scenario: Suggested info variant
- **WHEN** `CellInfo` is rendered as `suggested-info` with a label, a suggested note and a value
- **THEN** the label is followed on the same line by the suggested note in the error text color, the value is beneath, the trailing icon slot is on the right, and the right padding is 4px

#### Scenario: Another user submitted variant
- **WHEN** `CellInfo` is rendered as `another-user-submitted` with a label, a value and an avatar initial
- **THEN** the row shows the label above the value on the left and a 32px circular avatar with the initial on the right, on a `surface/brand/light` fill, with no horizontal padding

#### Scenario: Conflicting data variant
- **WHEN** `CellInfo` is rendered as `conflicting-data` with a label and a value
- **THEN** the row shows the label above the value on the left and a trailing icon slot on the right, with 4px right padding

#### Scenario: Info added in chat variant
- **WHEN** `CellInfo` is rendered as `info-added-in-chat` with a section, a label and a value
- **THEN** the first line shows the section, a "/" separator and the label in the semibold extra-small style, the value is beneath, the trailing icon slot is on the right, and the vertical padding is 10px

#### Scenario: Add info in chat variant
- **WHEN** `CellInfo` is rendered as `add-info-in-chat` with a section and a label
- **THEN** the row shows a single line with the section, a "/" separator and the label in the base text size, with no value line, a trailing icon slot on the right and 10px vertical padding

### Requirement: Content and typography
`CellInfo` SHALL render all text from its props and SHALL NOT contain hardcoded copy other than the "/" separator. Text SHALL use Public Sans: names and values at 16px with 24px line height Medium; labels and roles at 12px/16px (labels) or 14px/20px (roles) Regular; member avatar initials at 18px Bold. Text colors SHALL follow the design: names `text/default/title`, values `text/default/body`, labels and roles `text/default/subtle`, and the suggested note `text/error/solid`.

#### Scenario: Values come from props
- **WHEN** a consumer passes a label and a value
- **THEN** exactly those strings are shown and no placeholder text such as "Label" or "Value" appears

#### Scenario: Optional role omitted
- **WHEN** the `member` variant is rendered without a role
- **THEN** no empty role line is reserved beneath the name

### Requirement: New badge
The `info` variant SHALL support a NEW badge that is shown next to the label when requested by the consumer. The badge SHALL be a 16px-high pill with a `surface/error/solid` fill and white 10px semibold text.

#### Scenario: Badge requested
- **WHEN** `info` is rendered with the new flag set and a badge text
- **THEN** the pill is shown after the label, 4px from it

#### Scenario: Badge not requested
- **WHEN** `info` is rendered without the new flag
- **THEN** no badge is shown

### Requirement: Icon slots
`CellInfo` SHALL accept consumer-provided content for the trailing icon of every variant that has one, and for the leading icon of `mini-group`, and SHALL NOT bundle icons. When no trailing content is provided, the row SHALL reserve no space for it.

#### Scenario: Trailing icon provided
- **WHEN** a consumer passes a trailing element
- **THEN** it is shown at the end of the row, vertically centered

#### Scenario: No trailing icon
- **WHEN** no trailing element is passed
- **THEN** the row ends at the content and its right padding

### Requirement: Truncation
Text that does not fit the row width SHALL be truncated to one line with an ellipsis, and the trailing icon and avatar SHALL keep their size.

#### Scenario: Long value
- **WHEN** a value is longer than the available width
- **THEN** the value is shown on one line ending with an ellipsis and the trailing icon is not pushed out of the row

### Requirement: Press behavior
`CellInfo` SHALL be pressable when the consumer provides a press handler, and SHALL otherwise be static and not announce itself as interactive.

#### Scenario: Press handler provided
- **WHEN** the user presses a row that has a press handler
- **THEN** the handler is called once

#### Scenario: No press handler
- **WHEN** a row is rendered without a press handler
- **THEN** it is not exposed as a button

### Requirement: Accessibility
A pressable `CellInfo` SHALL be exposed with the button role and an accessible name combining its visible text in reading order (for example name and role, or label and value). A static `CellInfo` SHALL expose its text to assistive technology as normal text.

#### Scenario: Screen reader announces a pressable row
- **WHEN** a screen reader focuses a pressable `info` row with the label "Phone" and the value "555 0100"
- **THEN** it announces a button named with the label and the value

### Requirement: Stories
`CellInfo` SHALL have a colocated story file that shows every variant, the NEW badge, truncated text and a pressable row.

#### Scenario: All variants viewable
- **WHEN** the user opens the `CellInfo` stories
- **THEN** each of the eight variants can be viewed, as can the NEW badge, a long-text row and a row with a press handler

### Requirement: Accessibility state
A pressable `CellInfo` SHALL accept an accessibility state from the consumer (for example `expanded`, `selected` or `disabled`) and SHALL expose it to assistive technology together with its button role and accessible name. A static `CellInfo` SHALL NOT expose an accessibility state.

#### Scenario: Expanded state on a pressable row
- **WHEN** a pressable `mini-group` row is rendered with the accessibility state `expanded` set to true
- **THEN** assistive technology reports the row as a button that is expanded

#### Scenario: State changes with the consumer
- **WHEN** the consumer re-renders the pressable row with `expanded` set to false
- **THEN** assistive technology reports the row as collapsed

#### Scenario: No accessibility state
- **WHEN** a pressable row is rendered without an accessibility state
- **THEN** the row's role and accessible name are unchanged and no state is reported

#### Scenario: Static row ignores state
- **WHEN** a row without a press handler is rendered with an accessibility state
- **THEN** the row is static and does not report that state
