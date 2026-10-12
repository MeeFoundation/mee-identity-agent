## MODIFIED Requirements

### Requirement: Info list components
The design system SHALL provide the Info list building blocks of the Tellipod app:
- **Section label**: small uppercase muted text that names a section.
- **Empty-state card**: a white rounded card with a centred title and message, and an optional full-width "+ action" button below them.
- **Category row**: a white rounded row with an icon in a circle, a label, a count badge and a trailing chevron. It may also show an optional preview line in smaller muted text below the label. The whole row is a button whose accessible name includes the label, the count and, when shown, the preview line.
- **Record row**: a white rounded row that summarises one record. It has an icon in a circle, a title, an optional secondary line, an optional meta line in smaller muted text, and a trailing chevron. The whole row is a button whose accessible name includes the title and, when shown, the secondary and meta lines.
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

### Requirement: Form card component
The shared form card SHALL show a header row containing an icon in a circle, the form's title and a chevron control that collapses and expands the card. The header row SHALL expose its expanded state to assistive technology. When expanded, the card SHALL show its field rows and optional footer actions. Each field row SHALL show a small label above its value. A field row given an edit action SHALL show a trailing edit button, whose accessible label SHALL include the field label. A field row given no edit action is read-only and SHALL show no edit button.

#### Scenario: Collapse and expand
- **WHEN** a participant activates the header of an expanded form card
- **THEN** the field rows are hidden and the header reports the collapsed state, and activating it again shows them

#### Scenario: Edit button label
- **WHEN** a screen reader user reaches the edit button of the Brand name row
- **THEN** it is announced with a translated label that includes "Brand name"

#### Scenario: Read-only field row
- **WHEN** a field row labelled Dose is given no edit action
- **THEN** it shows "Dose" and its value, and no edit button is shown or reachable by keyboard
