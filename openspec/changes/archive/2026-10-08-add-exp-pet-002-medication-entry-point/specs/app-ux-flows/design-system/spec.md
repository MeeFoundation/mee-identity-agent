## ADDED Requirements

### Requirement: Pod top bar component
The shared pod top bar SHALL follow the Tellipod app's `home-topbar` design:
- a leading back control,
- the pod's avatar,
- the pod's title,
- a breadcrumb line of one or more segments separated by chevrons, with an optional leading icon,
- a trailing menu control.

It MAY contain a tab bar below this row. Each control SHALL be a button with an accessible label from the app's translations, and SHALL run the action the flow provides. The top bar SHALL NOT include a device status bar.

#### Scenario: Top bar with tabs
- **WHEN** a flow screen renders the pod top bar with a title, a breadcrumb and tabs
- **THEN** the back control, avatar, title, breadcrumb and menu control are shown in one row, and the tabs are shown below it

#### Scenario: Controls are labelled
- **WHEN** a screen reader user moves through the pod top bar
- **THEN** the back and menu controls are announced with their translated labels

### Requirement: Segmented tabs component
The shared segmented tabs SHALL show two or more equal-width tabs in a rounded track, with the selected tab raised on a white surface. Exactly one tab SHALL be selected, as decided by the flow. Activating a tab SHALL report that tab to the flow. The tabs SHALL be operable with the keyboard, and SHALL expose the tab role and selected state to assistive technology.

#### Scenario: Activating a tab
- **WHEN** a participant activates a tab that is not selected
- **THEN** the flow is told which tab was activated

#### Scenario: Keyboard navigation
- **WHEN** a tab has keyboard focus and the participant presses the right arrow key
- **THEN** focus moves to the next tab

### Requirement: Info list components
The design system SHALL provide the Info list building blocks of the Tellipod app:
- **Section label**: small uppercase muted text that names a section.
- **Empty-state card**: a white rounded card with a centred title and message, and an optional full-width "+ action" button below them.
- **Category row**: a white rounded row with an icon in a circle, a label, a count badge and a trailing chevron. The whole row is a button whose accessible name includes the label and the count.
- **Divider**: a horizontal rule.

#### Scenario: Empty-state card action
- **WHEN** a participant activates the action of an empty-state card
- **THEN** the flow's action runs

#### Scenario: Category row is one button
- **WHEN** a screen reader user reaches a category row labelled Members with count 1
- **THEN** it is announced as one button whose name includes "Members" and "1"

### Requirement: Bottom sheet component
The shared bottom sheet SHALL slide up from the bottom of the flow screen over the current content. Following the Figma Modal, the content behind it SHALL stay undimmed and SHALL be covered by an invisible backdrop. It SHALL contain a grabber, a title, an optional description and the flow's content. It SHALL be modal:
- focus moves into it when it opens and stays inside it while it is open,
- the content behind it cannot be operated,
- it is announced as a dialog with its title.

Pressing Escape or activating the backdrop, that is, tapping outside the sheet, SHALL run the flow's dismiss action.

#### Scenario: Dismiss with Escape
- **WHEN** a bottom sheet is open and the participant presses Escape
- **THEN** the flow's dismiss action runs

#### Scenario: Background is not operable
- **WHEN** a bottom sheet is open
- **THEN** buttons behind the sheet cannot be activated by pointer or keyboard

### Requirement: Select field component
The shared select field SHALL show a visible label above a closed control that displays the selected option and a chevron, styled after the Figma Text Field component. The label SHALL be associated with the control. Opening it SHALL list the options, and an option SHALL be selectable with pointer or keyboard. An option MAY be marked unavailable: it is shown but cannot be selected.

#### Scenario: Choose an option
- **WHEN** a participant opens the select and chooses an available option
- **THEN** the control shows that option and the flow receives its value

#### Scenario: Unavailable option
- **WHEN** a participant tries to choose an option marked unavailable
- **THEN** the selection does not change

### Requirement: Form card component
The shared form card SHALL show a header row containing an icon in a circle, the form's title and a chevron control that collapses and expands the card. The header row SHALL expose its expanded state to assistive technology. When expanded, the card SHALL show its field rows and optional footer actions. Each field row SHALL show a small label above its value and a trailing edit button. The edit button's accessible label SHALL include the field label.

#### Scenario: Collapse and expand
- **WHEN** a participant activates the header of an expanded form card
- **THEN** the field rows are hidden and the header reports the collapsed state, and activating it again shows them

#### Scenario: Edit button label
- **WHEN** a screen reader user reaches the edit button of the Brand name row
- **THEN** it is announced with a translated label that includes "Brand name"

### Requirement: AI suggestion component
The shared AI suggestion SHALL be a single button on a brand-tinted surface. It shows a sparkle icon, a small caption (for example "AI Suggestion") and the suggested action's label. Activating it SHALL run the flow's action.

#### Scenario: Accept a suggestion
- **WHEN** a participant activates an AI suggestion
- **THEN** the flow's action runs

## MODIFIED Requirements

### Requirement: Existing component contracts preserved
The shared components SHALL keep the props that flows already pass to them: Button, TextField, Checkbox and Header. Existing flow screens and flow-specific components SHALL keep working without code changes to their screens. Flow-specific components and the flow completion view SHALL be styled with the theme tokens.

#### Scenario: Example flow runs unchanged
- **WHEN** a participant goes through the `exp-pet-002` flow in either variant
- **THEN** every screen uses the design system's tokens and components, and the shared Button keeps the props and defaults described above

### Requirement: Styled home page
The home page SHALL use the design system:
- a page header with the app title
- one card per registered flow, showing the flow's title, its description when declared, and its start or variant-choice actions as design-system Buttons
- in development builds, the flow's experiment catalogue inside its card
- the "Start new test session" action as a design-system Button

The home page SHALL NOT be drawn inside the device frame. It SHALL keep the variant visibility rules of the flow runtime: variant choice only for explicit flows, and variant information and the experiment catalogue only in development builds.

#### Scenario: Home page shows flow cards
- **WHEN** a participant opens the home page
- **THEN** each registered flow appears as a card with its title, description and start actions, styled with the design system, and the page is not wrapped in a device frame

#### Scenario: Automatic flow card hides variant information
- **WHEN** a production build shows the home page and a flow uses automatic variant assignment
- **THEN** that flow's card shows a single start action and no variant names, assignment or catalogue
