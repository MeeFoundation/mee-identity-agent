## MODIFIED Requirements

### Requirement: Bottom sheet component
The shared bottom sheet SHALL slide up from the bottom of the flow screen over the current content when it opens, including when its screen is opened directly, and SHALL slide back down when it is dismissed, before the flow's dismiss action runs. While it is open, the content behind it SHALL be dimmed by a dark, semi-transparent backdrop that fades in as the sheet opens and fades out as it closes. It SHALL contain a grabber, a title, an optional description and the flow's content. It SHALL be modal:
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

#### Scenario: Background is dimmed
- **WHEN** a bottom sheet is open
- **THEN** the content behind it is shown under a dark, semi-transparent backdrop, and the sheet itself is not dimmed

#### Scenario: Sheet slides in and out
- **WHEN** a bottom sheet's screen is shown
- **THEN** the sheet starts below the bottom edge of the screen and slides up into place
- **WHEN** the participant then dismisses it
- **THEN** the sheet slides down out of view, and only then does the flow's dismiss action run
