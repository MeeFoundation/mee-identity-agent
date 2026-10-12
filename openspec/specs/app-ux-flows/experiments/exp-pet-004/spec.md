# app-ux-flows/experiments/exp-pet-004 Specification

## Purpose

Defines experiment EXP-PET-004 "Update medication" in `app-ux-flows`, which tests how participants discover that an existing medication can be edited and how they get into editing it. Every variant shares the Home → Ginger Info → Medical path of EXP-PET-003-A, and the same details screen. As in the app's other forms, each field has its own edit control and is edited in place. The variants differ only in an optional shortcut under the medication item on the Medical screen. Hypothesis: a shortcut on the list item (variants B and C) gets participants into editing faster and with fewer wrong turns than the details-first path alone (variant A). A field-level inline change (C) is faster still, provided participants recognise it as a change to the stored medical record and confirm it.

## Requirements

### Requirement: Experiment identity and variants
The application SHALL register an experiment flow with flow id `exp-pet-004`, display code `EXP-PET-004` and title "Update medication". It SHALL use explicit variant selection with exactly three variants, in this order:
- `a`, display code `EXP-PET-004-A`, "Details, then edit": the medication item on the Medical screen has no shortcut.
- `b`, display code `EXP-PET-004-B`, "Edit from the list": the medication item has an "Edit medication" shortcut that expands it in place into the medication's form, every field editable.
- `c`, display code `EXP-PET-004-C`, "Change schedule inline": the medication item has a "Change schedule" shortcut that expands it in place into the Frequency field, already in edit mode.

The flow SHALL declare these screens, and every variant SHALL implement every one of them:
- `home`: the app's Home with the participant's pods.
- `ginger-notes`: Ginger's Notes tab.
- `ginger-info`: Ginger's Info tab.
- `medical`: the Medical screen.
- `medication`: the details of the medication.
- `medication-updated`: the Medical screen after the update was saved.

`home` SHALL be the initial screen in every variant.

#### Scenario: Moderator chooses a variant on the home page
- **WHEN** someone views the home page
- **THEN** the EXP-PET-004 card lets them choose "Details, then edit", "Edit from the list" or "Change schedule inline", and choosing one starts the flow in that variant on Home at `/flows/exp-pet-004/home`

#### Scenario: Direct link without a variant
- **WHEN** someone opens `/flows/exp-pet-004/home` without a `variant` parameter
- **THEN** the flow runs in variant A

#### Scenario: Variant forced by URL
- **WHEN** someone opens `/flows/exp-pet-004/medical?variant=c`
- **THEN** the Medical screen is shown in variant C, whatever the stored assignment

### Requirement: Usability task and briefing
Every variant SHALL be run with the same task, read to the participant by a moderator: "Update Ginger's Apoquel schedule from once a day to twice a day." Nothing in the app SHALL show this task or any hint naming Medical, the details screen, an edit control or a screen. The flow SHALL show no briefing, as for every experiment.

#### Scenario: No in-app task
- **WHEN** a participant starts EXP-PET-004 in any variant
- **THEN** no mission card, goal, hint or other text describing the task is shown

### Requirement: Apoquel fixture
A run SHALL start from the Ginger pod fixture of the Pets pods: avatar photo, title "Ginger", breadcrumb "Pets" and one member. The pod SHALL hold exactly one medication record, shaped after `pets:Medication`. By default it is Apoquel:
- active ingredient Oclacitinib,
- brand name Apoquel,
- manufacturer Zoetis,
- dose 16 mg,
- dose form Tablet,
- frequency `1`,
- start date 2026-09-14.

The code that starts a run SHALL be able to supply a different pod or medication record through the flow's initial state. The run SHALL NOT depend on state from any other flow, and no screen SHALL fetch data. Ginger SHALL always open on the Info tab from Home.

#### Scenario: Default record
- **WHEN** a run starts without a supplied medication record
- **THEN** every screen that shows the medication shows Apoquel, 16 mg, Once per day

#### Scenario: Other flows unaffected
- **WHEN** a participant runs EXP-PET-003 after an EXP-PET-004 run saved a new schedule
- **THEN** EXP-PET-003 still shows its own default medication, unchanged

### Requirement: Home, Ginger tabs and Ginger Info
`home` SHALL be shown as in EXP-PET-003: a greeting, a "Pods" section label, one Ginger pod row, and the app tab bar with Home active. Activating the Ginger row SHALL show `ginger-info`. Ask Telli and Navigation SHALL be recorded and do nothing else.

`ginger-notes` and `ginger-info` SHALL show the Ginger pod top bar and tabs as in EXP-PET-003:
- back SHALL show `home`;
- Notes and Info SHALL switch tabs;
- Chat SHALL be recorded and do nothing else;
- the menu control SHALL be recorded and do nothing else;
- the breadcrumb SHALL do nothing.

`ginger-info` SHALL show the layout of EXP-PET-003 variant A in every variant: a "Forms" section with the Pet form row, a divider, then the category rows Medical (count 1, no preview line), Attachments 0, Subpods 0 and Members 1. Activating Medical SHALL show `medical`. The Pet row and the other category rows SHALL be recorded and do nothing else.

#### Scenario: Same path in every variant
- **WHEN** participants in variants A, B and C each open Ginger from Home
- **THEN** each sees the same `ginger-info`, with a Medical row that shows count 1 and no preview of the medication

#### Scenario: Menu is recorded
- **WHEN** a participant on `ginger-info` activates the menu control
- **THEN** the activation is recorded and `ginger-info` stays shown

### Requirement: Medical screen and medication item
`medical` SHALL show a top bar without tabs. The bar has a back control, the Ginger avatar, the title "Medical", the breadcrumb "Ginger >" and a menu control. Below it SHALL be a "Medications" section label, one medication item and a "+ Add medication" action.

The medication item SHALL show, identically in every variant:
- a pill icon;
- the medication's name as title;
- "{dose} · {frequency}" as secondary line, for example "16 mg · Once per day";
- "Started {start date}" as meta line when the record has a start date;
- a trailing chevron.

Activating the item SHALL show `medication`. Below these lines, inside the same item, the item SHALL show the variant's shortcut:
- variant `a`: none;
- variant `b`: the action "Edit medication", which expands the item in place into the medication form (see "List form in variant B");
- variant `c`: the action "Change schedule", which expands the item in place into the Frequency field in edit mode (see "Inline schedule change in variant C").

The shortcut SHALL be a control separate from the item, and activating it SHALL NOT show `medication`. In variants B and C the shortcut SHALL look the same apart from its label.

"+ Add medication" SHALL only be recorded. It SHALL NOT open anything or change the record. It SHALL stay shown while the item is expanded. The back control SHALL perform a back navigation. The menu control SHALL be recorded and do nothing else, and the breadcrumb SHALL do nothing.

#### Scenario: No shortcut in variant A
- **WHEN** a participant in variant A opens `medical`
- **THEN** the Apoquel item shows "16 mg · Once per day" and "Started Sep 14, 2026", and no action is shown under it

#### Scenario: Item opens details in every variant
- **WHEN** a participant in variant B or C activates the Apoquel item itself, not its shortcut
- **THEN** `medication` is shown

#### Scenario: Add medication is recorded only
- **WHEN** a participant activates "+ Add medication" on `medical`
- **THEN** the activation is recorded, `medical` stays shown, and the record is unchanged

### Requirement: In-place field editing
The medication's form SHALL follow the per-field editing pattern of the app's other forms (Figma "Contact info", nodes 820:18835 and 434:23287). The form SHALL show one row per field of the record, in the order and formats of EXP-PET-003's medication details. Each row SHALL have its own edit control (a pencil) named "Edit {field label}", and the form SHALL have no record-level edit action.

Activating a pencil SHALL replace that row's value, in place, with the field's input under a visible label, followed by a "Save" and a "Cancel" action. Focus SHALL move to the input. While a field is edited, the other rows SHALL show no pencil, so only one field is ever edited at a time. The inputs SHALL be:
- Medication / Active ingredient: text, with several ingredients separated by commas;
- Brand name and Manufacturer: text;
- Dose: a number, labelled with the unit, for example "Dose (mg)";
- Dose form: text;
- Frequency: a select with exactly the options "Once per day", "2 times per day" and "3 times per day";
- Start date: a date.

Each input SHALL start from the record's current value. "Save" SHALL be unavailable while the value equals the record's, and while it isn't usable: an empty text, a dose that isn't a positive number, or a missing date. Pressing Enter in a text, number or date input SHALL save when "Save" is available. Changing an input SHALL NOT change the record. Only "Save" SHALL do that, and it SHALL update the existing record, never add one.

Saving a field other than Frequency SHALL update the record and show the row with its new value, with focus back on the row's pencil. The participant SHALL stay where they are, and the run SHALL NOT complete. Saving the Frequency SHALL show `medication-updated`. Cancel SHALL restore the row unchanged, discard the input and put focus back on the row's pencil.

A typed ingredient or dose form SHALL keep its ontology IRI only when it names a term the record already had. Otherwise it is stored by label alone.

#### Scenario: Pencil edits the field in place
- **WHEN** a participant activates "Edit Dose"
- **THEN** the Dose row shows a number input labelled "Dose (mg)" holding 16, with focus in it, and "Save" and "Cancel" below it, and no other row shows a pencil

#### Scenario: Save unavailable until changed
- **WHEN** a participant activates "Edit Frequency" for a record whose frequency is `1`
- **THEN** the select shows "Once per day" and "Save" cannot be activated

#### Scenario: Other fields save in place
- **WHEN** a participant changes the dose to 8 and presses Enter
- **THEN** the row shows "8 mg", focus is on "Edit Dose", the screen stays shown, and the run is not completed

#### Scenario: Selecting does not save
- **WHEN** a participant selects "2 times per day" in the Frequency field and then activates Cancel
- **THEN** the record still says Once per day everywhere

#### Scenario: Saving the schedule updates the existing record
- **WHEN** a participant selects "2 times per day" and activates "Save"
- **THEN** `medication-updated` is shown with exactly one medication, Apoquel, showing "16 mg · 2 times per day"

### Requirement: Medication details
`medication` SHALL show a top bar without tabs. The bar has a back control, the Ginger avatar, the medication's name as title, the breadcrumb "Ginger > Medical" and a menu control. Below the top bar SHALL be the Medication form card, expanded, with the medication's form edited in place as in "In-place field editing". This screen SHALL be the same in every variant. The back control SHALL perform a back navigation. The menu control SHALL be recorded and do nothing else.

#### Scenario: Details offer per-field edit in every variant
- **WHEN** a participant in any variant opens `medication`
- **THEN** the card shows Oclacitinib, Apoquel, Zoetis, 16 mg, Tablet, Once per day and Sep 14, 2026, each row with its own edit control, and no record-level "Edit medication" action

#### Scenario: Edit the frequency from details
- **WHEN** a participant activates "Edit Frequency" on `medication`
- **THEN** the Frequency row becomes a select in place, and `medication` stays shown

### Requirement: List form in variant B
In variant `b`, activating "Edit medication" SHALL replace the medication item on `medical`, in place, with an expanded card. The card is headed with the pill icon and the medication's name, holds the medication's form edited in place as in "In-place field editing", and ends with a "Close" action. Focus SHALL move into the card. "Close" SHALL collapse the card back into the medication item, keeping any field already saved. Leaving `medical` SHALL discard the expansion, and on returning the item SHALL be shown collapsed.

#### Scenario: Edit from the list in variant B
- **WHEN** a participant in variant B activates "Edit medication" under the Apoquel item
- **THEN** the item expands in place into the medication form with a pencil on every field, `medical` stays shown, and "+ Add medication" is still shown

#### Scenario: Change the schedule from the list form
- **WHEN** a participant in variant B expands the form, activates "Edit Frequency", selects "3 times per day" and activates "Save"
- **THEN** `medication-updated` is shown with Apoquel at "3 times per day", without `medication` having been shown

### Requirement: Inline schedule change in variant C
In variant `c`, activating "Change schedule" SHALL replace the medication item on `medical`, in place, with an expanded card. The card is headed "Change schedule" with the pill icon, and shows the medication's name and dose as context, for example "Apoquel · 16 mg". Below that it shows the Frequency field already in edit mode, with the same select, "Save" and "Cancel" as in "In-place field editing". Focus SHALL move into the card. Cancel SHALL collapse it back into the medication item, unchanged. Leaving `medical` SHALL discard the expansion, and on returning the item SHALL be shown collapsed.

#### Scenario: Change inline
- **WHEN** a participant in variant C activates "Change schedule", selects "2 times per day" and activates "Save"
- **THEN** `medication-updated` is shown with Apoquel at "2 times per day", without `medication` having been shown

#### Scenario: Cancel inline
- **WHEN** a participant in variant C expands the item and activates Cancel
- **THEN** the collapsed Apoquel item with "Once per day" and the "Change schedule" action is shown again

### Requirement: Update confirmation and completion
`medication-updated` SHALL show the Medical screen as `medical` does, with the medication item at its saved schedule, and a confirmation "Medication updated" above the Medications section. The confirmation SHALL be announced to assistive technology. Showing it SHALL complete the run in place, without the completion view. The end state SHALL be the same in every variant and for every entry point. Opened directly by URL, `medication-updated` SHALL show the record with frequency `2`, which is the task's target, and complete the run.

#### Scenario: Same end state from every entry point
- **WHEN** one participant saves the Frequency on `medication`, another in variant B's list form, and another in variant C's inline card
- **THEN** each sees `medication-updated` with "Medication updated" and Apoquel at "2 times per day", and each run is completed

#### Scenario: A different schedule is still saved
- **WHEN** a participant selects "3 times per day" and saves
- **THEN** `medication-updated` shows Apoquel at "3 times per day" and the run is completed

### Requirement: Experiment analytics events
EXP-PET-004 SHALL declare and record these interaction events. Every variant SHALL use the same event name for the same intent:
- `pod_opened`: the Ginger row on `home` was activated.
- `pod_tab_selected`: a Ginger tab was activated. Property `tab`: `notes`, `chat` or `info`.
- `app_tab_selected`: an app tab bar tab other than Home was activated. Property `tab`: `telli` or `navigation`.
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
