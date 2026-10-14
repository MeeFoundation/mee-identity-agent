## MODIFIED Requirements

### Requirement: Home, Ginger tabs and Ginger Info
`home` SHALL be shown as in EXP-PET-003: a greeting, a "Pods" section label, one Ginger pod row, and the app tab bar with Home active. Activating the Ginger row SHALL show `ginger-notes`. Ask Telli, Notifications and Navigation SHALL be recorded and do nothing else.

`ginger-notes` and `ginger-info` SHALL show the Ginger pod top bar and tabs as in EXP-PET-003:
- back SHALL show `home`;
- Notes and Info SHALL switch tabs;
- Chat SHALL be recorded and do nothing else;
- the menu control SHALL be recorded and do nothing else;
- the breadcrumb SHALL do nothing.

`ginger-info` SHALL show the layout of EXP-PET-003 variant A in every variant: a "Forms" section with the Pet form row, a divider, then the category rows Medical (count 1, no preview line), Attachments 0, Subpods 0 and Members 1. Activating Medical SHALL show `medical`. The Pet row and the other category rows SHALL be recorded and do nothing else.

#### Scenario: Ginger opens on Notes
- **WHEN** a participant on `home` activates the Ginger row
- **THEN** `ginger-notes` is shown with the Notes tab selected, and `pod_opened` is recorded

#### Scenario: Same path in every variant
- **WHEN** participants in variants A, B and C each open Ginger from Home and select the Info tab
- **THEN** each sees the same `ginger-info`, with a Medical row that shows count 1 and no preview of the medication

#### Scenario: Menu is recorded
- **WHEN** a participant on `ginger-info` activates the menu control
- **THEN** the activation is recorded and `ginger-info` stays shown

#### Scenario: Notifications is inert
- **WHEN** a participant on `home` activates the Notifications tab
- **THEN** `app_tab_selected` is recorded with `tab` `notifications` and `home` stays shown

### Requirement: Experiment analytics events
EXP-PET-004 SHALL declare and record these interaction events. Every variant SHALL use the same event name for the same intent:
- `pod_opened`: the Ginger row on `home` was activated.
- `pod_tab_selected`: a Ginger tab was activated. Property `tab`: `notes`, `chat` or `info`.
- `app_tab_selected`: an app tab bar tab other than Home was activated. Property `tab`: `telli`, `notifications` or `navigation`.
- `info_row_selected`: an Info row that does nothing else was activated. Property `row`: `pet_form`, `attachments`, `subpods` or `members`.
- `pod_menu_selected`: a top bar menu control was activated. Property `screen`: `ginger-notes`, `ginger-info`, `medical` or `medication`.
- `medical_opened`: the Medical row was activated.
- `medication_viewed`: the medication item was activated, opening `medication`.
- `add_medication_selected`: "+ Add medication" was activated.
- `medication_edit_started`: an entry point into editing the schedule was activated. Property `entry_point`: `details_edit` (the Frequency pencil on `medication`), `list_edit` (variant B's "Edit medication") or `inline_schedule` (variant C's "Change schedule").
- `medication_field_edit_selected`, `medication_field_saved` and `medication_field_edit_cancelled`: a field other than Frequency was opened for editing, saved, or cancelled. Properties `entry_point` (`details_edit` or `list_edit`, where the form is shown), and `field`: `activeIngredient`, `brandName`, `manufacturer`, `dose`, `doseForm` or `startDate`.
- `medication_schedule_changed`: a Frequency option other than the selected one was chosen. Properties `entry_point`, `from` and `to`. `from` and `to` are frequencies: `1`, `2` or `3`.
- `medication_edit_cancelled`: editing the schedule was cancelled, by Cancel on the Frequency field or by "Close" on variant B's list form. Properties `entry_point`, and `changed`: whether the selection differed from the record.
- `medication_update_saved`: "Save" was activated on the Frequency field. Properties `entry_point`, `from` and `to`.

The runtime's own lifecycle events, including `flow_completed` when the schedule is saved, SHALL be recorded as for every flow. Apart from schedule frequencies and field ids, no event SHALL carry medication content or text typed by the participant.

#### Scenario: Entry point identifies the path
- **WHEN** a participant in variant B starts editing from the list, and another in variant B starts from the Frequency pencil on the details screen
- **THEN** both record `medication_edit_started`, with `entry_point` `list_edit` and `details_edit` respectively

#### Scenario: Save is recorded with the change
- **WHEN** a participant saves the schedule from once to twice per day inline
- **THEN** `medication_update_saved` is recorded with `entry_point` `inline_schedule`, `from` `1` and `to` `2`, followed by `flow_completed`

#### Scenario: Cancelling after a change is visible
- **WHEN** a participant selects "2 times per day" in the Frequency field and activates Cancel
- **THEN** `medication_edit_cancelled` is recorded with `changed` true

#### Scenario: Wrong-field edits are visible
- **WHEN** a participant edits and saves the dose on `medication`
- **THEN** `medication_field_edit_selected` and `medication_field_saved` are recorded with `field` `dose`, and the typed value is not recorded

#### Scenario: Notifications tab is recorded
- **WHEN** a participant activates the Notifications tab on `home`
- **THEN** `app_tab_selected` is recorded with `tab` `notifications`, and no other event
