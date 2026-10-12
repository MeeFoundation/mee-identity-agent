## MODIFIED Requirements

### Requirement: Info list components
The design system SHALL provide the Info list building blocks of the Tellipod app:
- **Section label**: small uppercase muted text that names a section.
- **Empty-state card**: a white rounded card with a centred title and message, and an optional full-width "+ action" button below them.
- **Category row**: a white rounded row with an icon in a circle, a label, a count badge and a trailing chevron. It may also show an optional preview line in smaller muted text below the label. The whole row is a button whose accessible name includes the label, the count and, when shown, the preview line.
- **Record row**: a white rounded row that summarises one record. It has an icon in a circle, a title, an optional secondary line, an optional meta line in smaller muted text, and a trailing chevron. The whole row is a button whose accessible name includes the title and, when shown, the secondary and meta lines. A record row may also have an optional action. The action is a text control shown below the row's lines, inside the same white rounded card. It is a separate button from the row: activating it runs only the action. Activating the row runs only the row's action.
- **Divider**: a horizontal rule.

#### Scenario: Empty-state card action
- **WHEN** a participant activates the action of an empty-state card
- **THEN** the flow's action runs

#### Scenario: Category row is one button
- **WHEN** a screen reader user reaches a category row labelled Members with count 1
- **THEN** it is announced as one button whose name includes "Members" and "1"

#### Scenario: Category row preview
- **WHEN** a category row labelled Medical with count 1 has the preview line "Clavamox · 2 times per day"
- **THEN** the preview is shown below "Medical", and the row is announced as one button whose name includes "Medical", "1" and "Clavamox · 2 times per day"

#### Scenario: Category row without preview
- **WHEN** a category row is given no preview line
- **THEN** it looks and is announced as before, with no empty line below the label

#### Scenario: Record row is one button
- **WHEN** a screen reader user reaches a record row titled Clavamox with the secondary line "62.5 mg · 2 times per day" and the meta line "Started Oct 6, 2026"
- **THEN** it is announced as one button whose name includes all three, and activating it runs the flow's action

#### Scenario: Record row action
- **WHEN** a record row titled Apoquel has the action "Edit medication" and a participant activates that action
- **THEN** only the action's handler runs, the row's own action does not, and the action is announced as a separate button named "Edit medication"

#### Scenario: Record row without action
- **WHEN** a record row is given no action
- **THEN** it looks and is announced as before, with no empty space below its lines

### Requirement: Text field component
The shared TextField SHALL show a visible label above the input and SHALL associate the label with the input for assistive technology. Its default, hover, focus and disabled appearances SHALL follow the Figma Text Field component. The value the participant types SHALL be reported to the flow on every change, as today. A flow MAY ask for a number or a date input instead of plain text. The value is still reported as text, and a date as `YYYY-MM-DD`.

#### Scenario: Label is associated with the input
- **WHEN** a participant clicks the TextField's label
- **THEN** keyboard focus moves into the input

#### Scenario: Typing updates flow state
- **WHEN** a participant types into a TextField on a flow screen
- **THEN** the flow receives each new value and the input shows the focused appearance from the design system

#### Scenario: Number input
- **WHEN** a flow asks for a number TextField labelled "Dose (mg)"
- **THEN** it is announced as a spin button named "Dose (mg)" and offers a numeric keyboard on touch devices

### Requirement: Form card component
The shared form card SHALL show a header row containing an icon in a circle, the form's title and a chevron control that collapses and expands the card. The header row SHALL expose its expanded state to assistive technology. When expanded, the card SHALL show its field rows and optional footer actions. Each field row SHALL show a small label above its value. A field row given an edit action SHALL show a trailing edit button, whose accessible label SHALL include the field label. A field row given no edit action is read-only and SHALL show no edit button. A field row MAY be given an editor while its field is being edited. It then shows the editor in place of its label, value and edit button, and keeps the field label available to assistive technology.

#### Scenario: Collapse and expand
- **WHEN** a participant activates the header of an expanded form card
- **THEN** the field rows are hidden and the header reports the collapsed state, and activating it again shows them

#### Scenario: Edit button label
- **WHEN** a screen reader user reaches the edit button of the Brand name row
- **THEN** it is announced with a translated label that includes "Brand name"

#### Scenario: Read-only field row
- **WHEN** a field row labelled Dose is given no edit action
- **THEN** it shows "Dose" and its value, and no edit button is shown or reachable by keyboard

#### Scenario: Field row in edit mode
- **WHEN** a field row labelled Dose is given an editor
- **THEN** the editor is shown where the value and edit button were, inside the same card

## ADDED Requirements

### Requirement: Radio group field component
The shared radio group field SHALL show a visible label above a vertical list of options. Each option has a radio indicator and a label, and exactly one option is selected. It SHALL be announced as a radio group named by its label. An option SHALL be selectable by pointer, by activating its label, or by keyboard: arrow keys move the selection within the group, and Tab enters and leaves the group as one stop. A selected option SHALL use the brand colour, and focus SHALL show the design system's focus ring. Selecting an option SHALL give the flow its value.

#### Scenario: Choose an option
- **WHEN** a participant activates the label "2 times per day" in a radio group labelled Schedule
- **THEN** that option becomes selected, the previously selected one is cleared, and the flow receives its value

#### Scenario: Keyboard selection
- **WHEN** a keyboard user tabs into the group and presses the down arrow
- **THEN** the next option becomes selected and focused, and a further Tab leaves the group

#### Scenario: Announced as a group
- **WHEN** a screen reader user reaches the group
- **THEN** it is announced as a radio group named "Schedule", with the selected option and the number of options


### Requirement: Inline field editor component
The shared inline field editor SHALL hold one field's input in place, followed by a "Save" and a "Cancel" action in one row. On opening, focus SHALL move to its first control. "Save" MAY be made unavailable by the flow, for example while the value is unchanged or invalid. Pressing Enter in a text, number or date input SHALL save when "Save" is available. The editor itself SHALL NOT change any data: Save and Cancel only report to the flow.

#### Scenario: Focus on open
- **WHEN** an inline field editor holding a TextField is shown
- **THEN** keyboard focus is in the TextField

#### Scenario: Enter saves
- **WHEN** a participant presses Enter in its TextField while "Save" is available
- **THEN** the flow's save action runs

#### Scenario: Save unavailable
- **WHEN** the flow marks "Save" unavailable and a participant presses Enter
- **THEN** nothing is saved and "Save" cannot be activated
