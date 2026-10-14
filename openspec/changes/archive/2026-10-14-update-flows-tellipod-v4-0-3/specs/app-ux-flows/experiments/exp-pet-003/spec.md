## MODIFIED Requirements

### Requirement: Home
`home` SHALL show a greeting, a "Pods" section label and one pod row for Ginger, with Ginger's avatar, the title "Ginger" and the breadcrumb "Pets". The app tab bar SHALL be shown with Home active. Activating the Ginger row SHALL open Ginger on the tab the run starts pods on. Activating the Ask Telli, Notifications or Navigation tab SHALL be recorded and SHALL do nothing else. Activating Home SHALL do nothing.

#### Scenario: Open Ginger
- **WHEN** a participant on `home` activates the Ginger row in a run that starts pods on the Notes tab
- **THEN** `ginger-notes` is shown

#### Scenario: Ask Telli is inert
- **WHEN** a participant on `home` activates Ask Telli
- **THEN** `home` stays shown

#### Scenario: Notifications is inert
- **WHEN** a participant on `home` activates the Notifications tab
- **THEN** `app_tab_selected` is recorded with `tab` `notifications` and `home` stays shown

### Requirement: Experiment analytics events
EXP-PET-003 SHALL declare and record these interaction events. Every variant SHALL use the same event name for the same intent:
- `pod_opened`: the Ginger row on `home` was activated. Property `tab`: `notes` or `info`, the tab it opened on.
- `pod_tab_selected`: a Ginger tab was activated. Property `tab`: `notes`, `chat` or `info`.
- `app_tab_selected`: an app tab bar tab other than Home was activated. Property `tab`: `telli`, `notifications` or `navigation`.
- `info_row_selected`: an Info row that does nothing else was activated. Property `row`: `pet_form`, `attachments`, `subpods` or `members`.
- `medical_opened`: the Medical row was activated (variants A and B).
- `medication_opened`: a medication row was activated. Property `entry_point`: `medical_screen` or `ginger_info`.
- `add_medication_selected`: "+ Add medication" was activated. Property `entry_point`: `medical_screen` or `ginger_info`.

No event SHALL carry medication content or text typed by the participant.

#### Scenario: Same outcome, different path
- **WHEN** a participant in variant A opens Clavamox from `medical`, and another in variant C opens it from `ginger-info`
- **THEN** both record `medication_opened`, with `entry_point` `medical_screen` and `ginger_info` respectively

#### Scenario: Add medication is recorded only
- **WHEN** a participant in variant A activates "+ Add medication" on `medical`
- **THEN** `add_medication_selected` is recorded with `entry_point` `medical_screen`, `medical` stays shown, and the record is unchanged

#### Scenario: Wrong turn is visible
- **WHEN** a participant on `ginger-info` activates Attachments
- **THEN** `info_row_selected` is recorded with `row` `attachments`

#### Scenario: Notifications tab is recorded
- **WHEN** a participant activates the Notifications tab on `home`
- **THEN** `app_tab_selected` is recorded with `tab` `notifications`, and no other event
