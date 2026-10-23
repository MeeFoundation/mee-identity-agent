# packages/ui/card Specification

## Purpose

Defines the shared `Card` component of `@mee/ui`: a form block with an optional header, a body of rows or other content, an optional footer action and optional expand/collapse behavior, drawn on the same surface as `Panel`.

## Requirements

### Requirement: Surface
`Card` SHALL use the same surface as `Panel`: white, a 16px corner radius, a 1px `alpha/dark/5` outline and the `Box shadow/1st Level` elevation, clipping its content to the rounded corners and filling the available width. A `Card` MAY be placed inside a `Panel`, which shows it edge to edge.

#### Scenario: Card with only a body
- **WHEN** `Card` is rendered with children and no header and no footer
- **THEN** the children are shown on the white rounded surface with no header row and no footer row

#### Scenario: Content is clipped to the corners
- **WHEN** a child of `Card` has a background that extends to the card edge
- **THEN** the child does not draw outside the card's 16px rounded corners

#### Scenario: Card inside a panel
- **WHEN** a `Card` is a child of a `Panel`
- **THEN** the card keeps its own surface and is shown edge to edge within the panel

### Requirement: Header
`Card` SHALL accept a header as a function that receives the card's current state (`expanded` and a `toggle` function) and returns the header content. `Card` SHALL render the returned content as the first row, above the body, without adding padding or a border of its own.

#### Scenario: Header receives state
- **WHEN** `Card` is rendered with a header function
- **THEN** the function is called with the current expanded state and a toggle function

#### Scenario: Header is a mini-group cell
- **WHEN** the header function returns a `CellInfo` of variant `mini-group`
- **THEN** the row is shown at the top of the card with that variant's own padding and appearance

#### Scenario: No header
- **WHEN** `Card` is rendered without a header
- **THEN** no header row is shown and the body starts at the top edge of the card

### Requirement: Expand and collapse
`Card` SHALL support an expanded state that shows the body and a collapsed state that hides it, while the header stays visible in both. The expanded state SHALL be controllable by the consumer through an `expanded` value and an `onExpandedChange` callback, and SHALL fall back to an internal state initialised from `defaultExpanded` when `expanded` is not provided. Calling the header's `toggle` SHALL request the opposite of the current expanded state. A `Card` with no header, or whose consumer never calls `toggle`, SHALL always show its body.

#### Scenario: Controlled expansion
- **WHEN** `Card` is rendered with `expanded` set to true and the header's `toggle` is called
- **THEN** `onExpandedChange` is called with false and the card stays expanded until the consumer changes `expanded`

#### Scenario: Uncontrolled expansion
- **WHEN** `Card` is rendered with `defaultExpanded` set to true, without `expanded`, and `toggle` is called
- **THEN** the body collapses and `onExpandedChange`, if provided, is called with false

#### Scenario: Collapsed card
- **WHEN** `Card` is collapsed
- **THEN** the header is shown and the body is not visible

#### Scenario: Default state
- **WHEN** `Card` is rendered with neither `expanded` nor `defaultExpanded`
- **THEN** the card is expanded

#### Scenario: Non-expandable card
- **WHEN** `Card` is rendered with a header whose content never calls `toggle`
- **THEN** the body is shown and the card behaves as a static container

### Requirement: Expand animation
When the expanded state changes, `Card` SHALL animate the body's height between hidden and fully shown instead of switching instantly. The body SHALL be shown at its full height on first render without animating. When the user has requested reduced motion, the change SHALL be applied without animation.

#### Scenario: Expanding
- **WHEN** a collapsed card becomes expanded
- **THEN** the body grows from zero height to its full height

#### Scenario: Collapsing
- **WHEN** an expanded card becomes collapsed
- **THEN** the body shrinks to zero height and is no longer reachable by assistive technology once collapsed

#### Scenario: First render
- **WHEN** an expanded card is first rendered
- **THEN** the body is shown at full height without an animation

#### Scenario: Reduced motion
- **WHEN** the system reduced-motion setting is on and the expanded state changes
- **THEN** the body is shown or hidden without an animation

### Requirement: Footer action
`Card` SHALL accept an optional footer action with the same fields and the same appearance as the footer action of `Panel` (a label, an optional leading icon, a press handler, and the `outline` or `ghost` style), and SHALL render it as the last row of the card, below the body. The footer action SHALL belong to the card that declares it and SHALL be shown only while that card is expanded. Pressing the footer action SHALL call the press handler, and the footer SHALL be announced as a button named by its label.

#### Scenario: Outline footer
- **WHEN** `Card` has a footer action with the `outline` style, the label "Add contact info" and a plus icon
- **THEN** the card ends with a bordered 44px button showing the icon and the label

#### Scenario: Pressing the footer
- **WHEN** the user presses the footer action
- **THEN** the footer's press handler is called

#### Scenario: Collapsed card hides its footer
- **WHEN** a card with a footer action is collapsed
- **THEN** the footer action is not visible

#### Scenario: Container footer stays visible
- **WHEN** a `Card` inside a `Panel` with a footer action is collapsed
- **THEN** the panel's footer action is still visible

### Requirement: Row dividers
`Card` SHALL NOT show the bottom divider of the last row of its body, whether the body ends at the card's bottom edge or is followed by a footer action. `Card` SHALL NOT show the bottom divider of its header when nothing is shown below the header (the card is collapsed, or has no body and no footer). The divider between a header and an expanded body SHALL remain visible, as SHALL the dividers between body rows. The body SHALL NOT be clipped other than at the card's own rounded corners, whatever it contains.

#### Scenario: Header-only card
- **WHEN** `Card` has a `CellInfo` header, no body and no footer
- **THEN** no divider line is shown under the header at the bottom of the card

#### Scenario: Last body row without footer
- **WHEN** an expanded card's last body row is a `CellInfo` and the card has no footer action
- **THEN** no divider line is shown under that row at the bottom of the card

#### Scenario: Last body row followed by a footer
- **WHEN** an expanded card's last body row is a `CellInfo` and the card has a footer action
- **THEN** no divider line is shown between the row and the footer

#### Scenario: Rows inside the body
- **WHEN** an expanded card's body has several `CellInfo` rows
- **THEN** the divider between consecutive rows is shown

#### Scenario: Header over an expanded body
- **WHEN** an expanded card has a `CellInfo` header followed by a body
- **THEN** the header's divider is shown between the header and the body

#### Scenario: Collapsed card
- **WHEN** a card with a body and a footer action is collapsed
- **THEN** no divider line is shown under the header at the bottom of the card

### Requirement: Header chevron
`@mee/ui` SHALL export a `CardChevron` that takes an `expanded` value and shows a 16px chevron pointing right when collapsed and down when expanded. When `expanded` changes the chevron SHALL rotate between the two orientations with an animation, and SHALL change without animation when the user has requested reduced motion. The chevron SHALL be usable in the `trailing` slot of a `CellInfo`.

#### Scenario: Collapsed chevron
- **WHEN** `CardChevron` is rendered with `expanded` false
- **THEN** the chevron points right

#### Scenario: Expanded chevron
- **WHEN** `CardChevron` is rendered with `expanded` true
- **THEN** the chevron points down

#### Scenario: Chevron follows the card
- **WHEN** a header renders `CardChevron` with the card's `expanded` state and the card is toggled
- **THEN** the chevron rotates to match the new state

### Requirement: Accessibility of the expanded state
`Card` SHALL expose its expanded state to assistive technology so that a header which calls `toggle` can announce whether the body is expanded or collapsed.

#### Scenario: Toggle control state
- **WHEN** the header function receives the card state
- **THEN** it can mark its pressable header with the `expanded` accessibility state using the received `expanded` value
