# packages/ui/toast Specification

## Purpose

Defines the shared `Toast` component of `@mee/ui`: a compact message card for confirmations and notices, in the types and layouts defined by the Mee design system. It is purely presentational; the consumer decides when and where it appears.

## Requirements

### Requirement: Types
`Toast` SHALL support the types `primary`, `secondary`, `tertiary`, `dark`, `success`, `danger` and `warning`, with `primary` as the default. Each type SHALL set the card fill, the 1px border, and the colors of the icon, title, description and actions as follows. The icon and the close button SHALL use the title color.

| Type | Fill | Border | Icon, title and close | Description | Action | Default icon |
|---|---|---|---|---|---|---|
| primary | #F3F8F8 | #9AC2C6 | #314248 | #374E53 | #3B5B63 | info-circle |
| secondary | #FFFFFF | #E2E8F0 | #0F172A | #1E293B | #3B5B63 | info-circle |
| tertiary | #F8FAFC | #CBD5E1 | #0F172A | #1E293B | #3B5B63 | info-circle |
| dark | #0F172A | #334155 | #FFFFFF | #FFFFFF | #C3DCDE | info-circle |
| success | #F2F7EE | #A6C492 | #2E3F28 | #35482C | #3F5932 | check-circle |
| danger | #FEF2F2 | #FCA5A5 | #7F1D1D | #991B1B | #B91C1C | exclamation-octagon |
| warning | #FEFAEC | #F6CB53 | #753312 | #8E3D12 | #AE4F0F | exclamation-triangle |

#### Scenario: Success colors
- **WHEN** a `success` toast with a title and a description is rendered
- **THEN** it has a #F2F7EE fill, a 1px #A6C492 border, a #2E3F28 title and a #35482C description

#### Scenario: Dark type
- **WHEN** a `dark` toast with a title and an action is rendered
- **THEN** it has a #0F172A fill, a 1px #334155 border, a white title and icon, and a #C3DCDE action

#### Scenario: Default type
- **WHEN** a toast is rendered without a type
- **THEN** it is a `primary` toast

#### Scenario: Every type is available
- **WHEN** a toast is rendered with each of the seven types
- **THEN** each renders with its own fill, border, text, icon and action colors from the table

### Requirement: Card appearance
`Toast` SHALL be a card with an 8px corner radius, 16px horizontal and 12px vertical padding, an 8px gap between its avatar, content and trailing parts, and the design system's `shadow-3` elevation. It SHALL fill the width its parent gives it, so that the parent controls the toast's width and position on screen. Title and description text SHALL use Public Sans at 14px with a 20px line height, the title in semibold and the description in regular.

#### Scenario: Fills available width
- **WHEN** a toast is placed in a parent 370px wide
- **THEN** the toast is 370px wide

#### Scenario: Long text wraps
- **WHEN** a toast has a title or description longer than the available width
- **THEN** the text wraps onto further lines, the card grows in height and nothing is clipped

### Requirement: Content slots
`Toast` SHALL accept a title, a description, an icon and an avatar, each optional. A slot that is not provided SHALL leave no empty space. When an icon is shown, it SHALL sit before the title with a 6px gap, and the description and bottom actions SHALL align with the title text rather than the icon. The default icon of each type SHALL be the 16px glyph named in the type table, in the title color. A consumer MAY replace the icon, or hide it.

#### Scenario: Title only
- **WHEN** a toast is rendered with only a title
- **THEN** the card shows the icon and the title on a single line with no empty description row

#### Scenario: Description aligns with title
- **WHEN** a toast has an icon, a title and a description
- **THEN** the description's left edge is aligned with the title text's left edge

#### Scenario: Hidden icon
- **WHEN** a toast is rendered with the icon hidden
- **THEN** the title and description start at the card's left padding

#### Scenario: Avatar
- **WHEN** a toast is given an avatar
- **THEN** the avatar is shown at the left edge of the card, 40px across, vertically aligned with the content, and the content is placed after it with an 8px gap

### Requirement: Actions
`Toast` SHALL accept up to two text actions, each with a label and a press handler. The consumer SHALL be able to place the actions either on the right, before the close button, or at the bottom, under the description and aligned with the title text. Action labels SHALL be 14px regular Public Sans in the type's action color, with 16px between actions. Pressing an action SHALL call only that action's handler. Each action SHALL be exposed to assistive technology as a button with its label.

#### Scenario: Right placement
- **WHEN** a toast has two actions placed on the right
- **THEN** both labels appear on the title row, before the close button, 16px apart

#### Scenario: Bottom placement
- **WHEN** a toast has two actions placed at the bottom
- **THEN** both labels appear in a row under the description, aligned with the title text

#### Scenario: Press action
- **WHEN** the user presses the second action
- **THEN** the second action's handler runs and the first action's handler does not

### Requirement: Close button
`Toast` SHALL show a 20px `x` close button at its trailing edge when a close handler is provided, and SHALL NOT show it otherwise. Pressing it SHALL call the handler. The button SHALL be exposed to assistive technology as a button with a consumer-provided label, and its touch target SHALL be at least 44px.

#### Scenario: Close shown
- **WHEN** a toast is rendered with a close handler
- **THEN** a close button is shown at the trailing edge and pressing it calls the handler

#### Scenario: No close handler
- **WHEN** a toast is rendered without a close handler
- **THEN** no close button is shown

### Requirement: Accessibility announcement
`Toast` SHALL be announced to assistive technology as a status message when it appears, and its title and description SHALL be readable as one unit.

#### Scenario: Screen reader
- **WHEN** a toast appears while a screen reader is active
- **THEN** its title and description are announced without the user moving focus

### Requirement: Stories
The `Toast` stories SHALL cover every one of the seven types; the combinations of avatar, icon, title, description and actions, with actions on the right and at the bottom; a long-text toast; and a toast without a close button. They SHALL also include two layouts taken from the Tellipod designs: a full-width, title-only success toast with a close button pinned to the bottom edge of a screen, and the same toast floating over scrolled content.

#### Scenario: Types story
- **WHEN** the user views the `Toast` stories
- **THEN** all seven types can be viewed side by side

#### Scenario: Tellipod layouts
- **WHEN** the user views the Tellipod toast stories
- **THEN** one story shows the toast pinned above the bottom edge of an empty screen, and another shows it overlapping scrolled cards
