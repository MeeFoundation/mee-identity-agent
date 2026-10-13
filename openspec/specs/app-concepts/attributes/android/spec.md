# app-concepts/attributes/android Specification

## Purpose

The Android-specific presentation of attribute pickers in the app-concepts attribute form. Shared behavior is in `app-concepts/attributes`.

## Requirements

### Requirement: Android date picker presentation
On Android, tapping a `date` attribute SHALL open the system date picker dialog. Confirming a date SHALL report it and close the dialog. Dismissing the dialog SHALL close it and SHALL NOT change the stored value.

#### Scenario: Confirming a date
- **WHEN** the user opens `date_of_birth` on Android, picks 5 May 1985 and confirms
- **THEN** the dialog closes and the host receives `1985-05-05`

#### Scenario: Cancelling the dialog
- **WHEN** the user opens the date dialog on Android and cancels it
- **THEN** the dialog closes and the stored date is unchanged
