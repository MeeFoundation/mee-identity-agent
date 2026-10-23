## ADDED Requirements

### Requirement: Sheet host
app-tellipod SHALL provide, for every screen, the hosts that let a `@mee/ui` `Sheet` be presented and dragged, so that a screen can open a sheet without setting anything up itself.

#### Scenario: Sheet opened from a screen
- **WHEN** any screen shows a `Sheet` with `visible` set to `true`
- **THEN** the sheet is presented over the screen and can be dragged and dismissed

#### Scenario: Sheet over the footer
- **WHEN** a sheet is presented on a screen that shows the app footer
- **THEN** the sheet is shown above the footer
