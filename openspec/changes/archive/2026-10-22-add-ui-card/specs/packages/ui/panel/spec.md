## Purpose

Defines the shared `Panel` component of `@mee/ui`: the blank container surface that holds arbitrary content, such as rows, a form block, an empty-state message or a photo with a button, with an optional footer action.

## ADDED Requirements

### Requirement: Surface
`Panel` SHALL render its content on a white surface with a 16px corner radius, a 1px `alpha/dark/5` outline and the `Box shadow/1st Level` elevation (a 1px `alpha/always/dark/5` shadow, 20px blur, 1px spread, offset 1px down), and SHALL clip its content to the rounded corners. `Panel` SHALL fill the width available to it.

#### Scenario: Panel with content only
- **WHEN** `Panel` is rendered with children and no footer
- **THEN** the children are shown on the white rounded surface with no footer row

#### Scenario: Content is clipped to the corners
- **WHEN** a child of `Panel` has a background that extends to the panel edge
- **THEN** the child does not draw outside the panel's 16px rounded corners

#### Scenario: Empty panel
- **WHEN** `Panel` is rendered without children and without a footer
- **THEN** only the empty surface is shown

### Requirement: Arbitrary content
`Panel` SHALL render whatever children it is given, without adding padding of its own, so that a consumer can place rows, a `Card`, an empty-state message, or a photo with a button inside it.

#### Scenario: Rows
- **WHEN** `Panel` contains several `CellInfo` rows
- **THEN** the rows are shown one under another across the full width of the panel

#### Scenario: Form block with a footer
- **WHEN** `Panel` contains a `Card` and has a footer action
- **THEN** the card is shown edge to edge on the panel and the footer action is shown beneath it

#### Scenario: Empty-state message
- **WHEN** `Panel` has a footer action and contains a `Card` whose body is an empty-state message
- **THEN** the message is shown on the card's surface and the footer action is shown beneath it

#### Scenario: Photo with a button
- **WHEN** `Panel` contains an image and a button
- **THEN** both are shown inside the panel's rounded surface without being cut off at the corners except by the rounding

### Requirement: Row dividers
`Panel` SHALL NOT show the bottom divider of the last row of its content, whether the content ends at the panel's bottom edge or is followed by a footer action. Dividers between rows SHALL remain visible. This SHALL NOT clip the content other than at the panel's own rounded corners, whatever the content is, including a `Card` rendered by a consumer's own wrapper component.

#### Scenario: Last row without footer
- **WHEN** the last row of a `Panel` is a `CellInfo` and the panel has no footer action
- **THEN** no divider line is shown under that row at the bottom of the panel

#### Scenario: Last row followed by a footer
- **WHEN** the last row of a `Panel` is a `CellInfo` and the panel has a footer action
- **THEN** no divider line is shown between the row and the footer action

#### Scenario: Rows inside the content
- **WHEN** a `Panel` has several `CellInfo` rows
- **THEN** the divider between consecutive rows is shown

#### Scenario: Content containing a card
- **WHEN** a `Panel` contains a `Card`, directly or through a component that renders one
- **THEN** the card is shown in full and its edge and shadow are not clipped by the panel's content area

### Requirement: Contained surfaces keep their shadow
When a `Panel` contains a `Panel` or a `Card`, the contained surface's outline and shadow SHALL stay visible, including below it, so that the contained surface is visibly separated from a footer action or a following surface. The `Panel` SHALL still clip everything to its own rounded corners.

#### Scenario: Form above the footer
- **WHEN** a `Panel` contains a `Card` and has a footer action
- **THEN** the card's bottom edge and shadow are visible between the card and the footer action

#### Scenario: Card inside a wrapper component
- **WHEN** a `Panel` contains a component that renders a `Card`, and the panel has a footer action
- **THEN** the card's shadow is visible between the card and the footer action, as for a direct `Card` child

#### Scenario: Shadow stays inside the panel
- **WHEN** a contained card's shadow would extend past the panel's edge
- **THEN** the shadow is clipped at the panel's rounded corners

### Requirement: Content spacing
`Panel` SHALL accept an optional `gap`, in pixels, and SHALL apply it as vertical spacing between its content children. Without `gap` the children SHALL touch each other.

#### Scenario: Gap between forms
- **WHEN** a `Panel` with a `gap` of 12 contains two `Card`s
- **THEN** the two cards are separated by 12px and each keeps its own surface and shadow

#### Scenario: No gap
- **WHEN** a `Panel` without `gap` contains two `Card`s
- **THEN** the cards are shown directly one under another

### Requirement: Footer action
`Panel` SHALL accept an optional footer action with a label, an optional leading icon, a press handler and a style of `outline` or `ghost`, and SHALL render it as the last row of the panel, below the content, always visible. Both styles SHALL be a full-width, 44px high button with a 12px corner radius, with the icon before the label, and the label in Public Sans SemiBold at 16px with a 24px line height in `text/gray/solid`. The `outline` style SHALL have a 1px `stroke/gray/accent` border and sit in a container with 8px horizontal padding, 4px top padding and 8px bottom padding. The `ghost` style SHALL have no border and sit in a container with 8px horizontal padding and 4px vertical padding. Pressing the footer action SHALL call the press handler.

#### Scenario: Outline footer
- **WHEN** `Panel` has a footer action with the `outline` style, the label "Invite member" and a plus icon
- **THEN** the panel ends with a bordered 44px button showing the icon and the label

#### Scenario: Ghost footer
- **WHEN** `Panel` has a footer action with the `ghost` style
- **THEN** the panel ends with a 44px button with no border showing the icon and the label

#### Scenario: Pressing the footer
- **WHEN** the user presses the footer action
- **THEN** the footer's press handler is called

#### Scenario: Footer is exposed as a button
- **WHEN** assistive technology reads the footer action
- **THEN** it is announced as a button named by the footer label
