## Purpose

The iOS-specific presentation of attribute pickers in the app-concepts attribute form. Shared behavior is in `app-concepts/attributes`.

## ADDED Requirements

### Requirement: iOS date picker presentation
On iOS, tapping a `date` attribute SHALL open a bottom sheet with a spinner-style date picker and a Done action. Each change to the spinner SHALL report the selected date right away. The sheet SHALL close when the user taps Done or taps outside it.

#### Scenario: Scrolling the spinner reports immediately
- **WHEN** the user opens `date_of_birth` on iOS and scrolls the spinner to 5 May 1985
- **THEN** the host receives `1985-05-05` without waiting for Done, and the sheet stays open

#### Scenario: Dismissing the sheet
- **WHEN** the date sheet is open on iOS and the user taps Done or taps outside the sheet
- **THEN** the sheet closes and the field shows the last selected date
