## ADDED Requirements

### Requirement: Attachment row component
The design system SHALL provide an attachment row that summarises one attached file. It SHALL show a square, rounded icon tile with a light background and the flow's file icon, the file name, a smaller muted detail line, and a trailing "more actions" button with a vertical three-dot icon. A long file name SHALL be truncated on one line rather than wrap or push the "more actions" button out of the row.

The "more actions" button SHALL always be present and SHALL be a separate button from the rest of the row: activating it SHALL run only the flow's menu action. Its accessible name SHALL include the file name.

When the flow gives the row an open action, the rest of the row SHALL be one button whose accessible name includes the file name and the detail line, and activating it SHALL run only the open action. When the flow gives no open action, the rest of the row SHALL not be operable and SHALL not show hover or focus styling.

#### Scenario: More actions is a separate, named button
- **WHEN** a screen reader user reaches the attachment row for "funny-moment.mp4" with the detail line "10 MB · Aug 7"
- **THEN** a button named "More actions for funny-moment.mp4" is announced, and activating it runs only the flow's menu action

#### Scenario: Row with an open action
- **WHEN** the flow gives the attachment row for "photo-Sofia.jpg" an open action and a participant activates the row outside the "more actions" button
- **THEN** only the open action runs, and the row is announced as a button whose name includes "photo-Sofia.jpg" and "1.5 MB · Jun 19"

#### Scenario: Row without an open action
- **WHEN** the flow gives the attachment row no open action
- **THEN** the "more actions" button is the row's only control, and activating the rest of the row does nothing

#### Scenario: Long file name
- **WHEN** an attachment row shows a file name longer than the row is wide
- **THEN** the name is truncated with an ellipsis on one line and the "more actions" button stays fully visible

### Requirement: Attachment list component
The design system SHALL provide an attachment list: one white rounded card that holds the flow's attachment rows in the given order, with a horizontal divider between consecutive rows and none before the first or after the last. It SHALL be announced as a list whose items are the rows.

#### Scenario: Rows share one card
- **WHEN** an attachment list holds four attachment rows
- **THEN** the four rows are shown inside one white rounded card, separated by three dividers

#### Scenario: Announced as a list
- **WHEN** a screen reader user reaches an attachment list with four rows
- **THEN** it is announced as a list of four items

### Requirement: Sheet action list component
The design system SHALL provide a sheet action list for the content of a bottom sheet: a vertical list of actions, each one a full-width button with a leading icon and a label. An action SHALL have either the default tone, with dark gray icon and label, or the danger tone, with red icon and label. Activating an action SHALL run only that action's handler. Each action SHALL be announced as a button named by its label.

#### Scenario: Activating an action
- **WHEN** a sheet action list shows "Save to device", "Rename" and "Delete file" and a participant activates "Rename"
- **THEN** only the "Rename" handler runs

#### Scenario: Danger tone
- **WHEN** an action in a sheet action list has the danger tone
- **THEN** its icon and label are shown in red, and the other actions keep the default tone

### Requirement: Floating action button component
The design system SHALL provide a floating action button: a rounded button with the primary brand gradient, white leading icon and white label, and a drop shadow. It SHALL be pinned to the bottom-right of the flow screen above the home indicator and SHALL stay in place while the content behind it scrolls. It SHALL be announced as a button named by its label, and activating it SHALL run the flow's action.

#### Scenario: Pinned while scrolling
- **WHEN** a screen with a floating action button labelled "Add attachment" scrolls its content
- **THEN** the button stays at the bottom-right of the screen, above the home indicator

#### Scenario: Activating the button
- **WHEN** a participant activates the floating action button labelled "Add attachment"
- **THEN** the flow's action runs, and the button is announced as "Add attachment"
