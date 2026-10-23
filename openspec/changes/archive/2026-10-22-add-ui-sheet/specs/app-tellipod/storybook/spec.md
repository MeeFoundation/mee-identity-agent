## ADDED Requirements

### Requirement: Sheet-capable rendering context
Every story SHALL render with the hosts a `@mee/ui` `Sheet` needs, so a story can present a sheet and the user can drag, dismiss and type into it exactly as in the app.

#### Scenario: Opening a sheet from a story
- **WHEN** the user presses the open button in a `Sheet` story
- **THEN** the sheet is presented over the story browser and can be dragged down to dismiss

#### Scenario: Other stories unaffected
- **WHEN** a story that does not use a sheet is rendered
- **THEN** it looks and behaves the same as before
