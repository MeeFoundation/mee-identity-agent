# app-ux-flows/experiments/exp-pet-003 Specification

## Purpose

Defines experiment EXP-PET-003 "Check current medication" in `app-ux-flows`, which tests scenario SC-PET-003: Alice wants to find out quickly what medication Ginger is taking and how often. The medication record belongs to the Ginger pod and is grouped under Medical on Ginger's Info tab. The three variants differ only in how Medical presents that record on the Info tab. Hypothesis: showing the medication's name and frequency on the Info tab (variants B and C) lets participants answer faster, with fewer wrong turns and no unneeded detail views, than variant A, which shows them one level deeper on the Medical screen. In B and C participants should still recognise Medical as the place where medication belongs.

## Requirements

### Requirement: Experiment identity and variants
The application SHALL register an experiment flow with flow id `exp-pet-003`, display code `EXP-PET-003` and title "Check current medication". It SHALL use explicit variant selection with exactly three variants, in this order:
- `a`, display code `EXP-PET-003-A`, "Medical row": Ginger's Info tab shows a Medical row, and the medication is listed on the Medical screen.
- `b`, display code `EXP-PET-003-B`, "Medical row with preview": the same as `a`, and the Medical row also previews the medication's name and frequency.
- `c`, display code `EXP-PET-003-C`, "Medical inline": Ginger's Info tab shows a Medical section that lists the medication directly, and there is no Medical screen.

The flow SHALL declare these screens:
- `home`: the app's Home with the participant's pods.
- `ginger-notes`: Ginger's Notes tab.
- `ginger-info`: Ginger's Info tab.
- `medical`: the Medical screen. Only variants `a` and `b` implement it.
- `medication`: the read-only details of one medication.

`home` SHALL be the initial screen in every variant. Opening `medical` in variant `c` SHALL behave like opening an undeclared screen of the flow.

#### Scenario: Moderator chooses a variant on the home page
- **WHEN** someone views the home page
- **THEN** the EXP-PET-003 card lets them choose "Medical row", "Medical row with preview" or "Medical inline", and choosing one starts the flow in that variant on Home at `/flows/exp-pet-003/home`

#### Scenario: Direct link without a variant
- **WHEN** someone opens `/flows/exp-pet-003/home` without a `variant` parameter
- **THEN** the flow runs in variant A

#### Scenario: Variant forced by URL
- **WHEN** someone opens `/flows/exp-pet-003/ginger-info?variant=c`
- **THEN** Ginger's Info tab is shown in variant C, whatever the stored assignment

#### Scenario: No Medical screen in variant C
- **WHEN** someone opens `/flows/exp-pet-003/medical?variant=c`
- **THEN** the flow behaves as for an undeclared screen

### Requirement: Usability task and briefing
Every variant SHALL be run with the same task, read to the participant by a moderator: "Ginger is currently taking medication. Find out what medication she is taking and how often it should be given." Nothing in the app SHALL show this task or any hint naming Medical, a screen or a control. The flow SHALL show no briefing, as for every experiment. The flow SHALL never complete by itself: the participant answers out loud, and the moderator records the answer.

#### Scenario: No in-app task
- **WHEN** a participant starts EXP-PET-003 in any variant
- **THEN** no mission card, goal, hint or other text describing the task is shown

#### Scenario: No completion
- **WHEN** a participant has opened every screen of their variant
- **THEN** the run is still in progress and no completion view is shown

### Requirement: Read-only fixture
A run SHALL start from the Ginger pod fixture of the Pets pods: avatar photo, title "Ginger", breadcrumb "Pets" and one member. The pod SHALL hold exactly one medication record. By default it is the Ginger medication fixture shaped after `pets:Medication`:
- active ingredient Amoxicillin,
- brand name Clavamox,
- manufacturer Zoetis,
- dose 62.5 mg,
- dose form Tablet,
- frequency `2`,
- start date 2026-10-06.

The code that starts a run SHALL be able to supply a different pod or medication record through the flow's initial state. The run SHALL NOT depend on state from any other flow. No screen SHALL fetch data. No screen SHALL offer to edit or delete a medication, a form or any field. Wherever medications are listed, a "+ Add medication" action SHALL be shown so the list looks as it does in the product, but it SHALL only be recorded: it SHALL NOT open anything or change the record.

#### Scenario: Default record
- **WHEN** a run starts without a supplied medication record
- **THEN** every screen that shows a medication shows Clavamox, 62.5 mg, 2 times per day

#### Scenario: Supplied record
- **WHEN** a run starts with a medication record whose brand name is "Metacam" and frequency is `1`
- **THEN** every screen that shows a medication shows Metacam and "Once per day" instead

### Requirement: Medication summary
Wherever a screen lists the medication before its details are opened, it SHALL be identified by its name: the brand name, or the active ingredient labels comma-separated when there is no brand name. Its frequency and dose SHALL use the same formats as the medication details. Each listing is labelled below with what it SHALL show:
- **Medication row**: a pill icon; the name as title; "{dose} · {frequency}" as secondary line, for example "62.5 mg · 2 times per day"; "Started {start date}" as meta line when the record has a start date, for example "Started Oct 6, 2026"; and a trailing chevron. Activating it SHALL show `medication`.
- **Medical preview line**: "{name} · {frequency}", for example "Clavamox · 2 times per day".

#### Scenario: Name falls back to the ingredient
- **WHEN** the record has no brand name and the active ingredient Amoxicillin
- **THEN** the medication row's title and the preview line start with "Amoxicillin"

#### Scenario: No start date
- **WHEN** the record has no start date
- **THEN** the medication row shows no meta line

### Requirement: Home
`home` SHALL show the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field, then a "Pods" section label and one pod row for Ginger, with Ginger's avatar, the title "Ginger" and the breadcrumb "Pets". The app tab bar SHALL be shown with Home active. Activating the Ginger row SHALL open Ginger on the tab the run starts pods on. Activating the Ask Telli, Notifications or Navigation tab SHALL be recorded and SHALL do nothing else. Activating the search field SHALL be recorded and SHALL do nothing else. Activating Home SHALL do nothing.

#### Scenario: Open Ginger
- **WHEN** a participant on `home` activates the Ginger row in a run that starts pods on the Notes tab
- **THEN** `ginger-notes` is shown

#### Scenario: Ask Telli is inert
- **WHEN** a participant on `home` activates Ask Telli
- **THEN** `home` stays shown

#### Scenario: Notifications is inert
- **WHEN** a participant on `home` activates the Notifications tab
- **THEN** `app_tab_selected` is recorded with `tab` `notifications` and `home` stays shown

#### Scenario: Search is recorded
- **WHEN** a participant on `home` activates the search field
- **THEN** `search_selected` is recorded and `home` stays shown

### Requirement: Pod opening tab with Notes by default
The flow's initial state SHALL be able to choose whether opening Ginger from Home shows the Info tab or the Notes tab. When it does not choose, Ginger SHALL open on the Notes tab. All variants SHALL share this setting.

#### Scenario: Default opens Notes
- **WHEN** a run starts without choosing a tab and the participant opens Ginger from Home
- **THEN** `ginger-notes` is shown

#### Scenario: Opening on Info
- **WHEN** a run is started with pods opening on the Info tab and the participant opens Ginger from Home
- **THEN** `ginger-info` is shown

### Requirement: Ginger tabs
`ginger-notes` and `ginger-info` SHALL show the pod top bar with a back control, the Ginger avatar, the title "Ginger", the breadcrumb "Pets", a menu control and three tabs: Notes, Chat and Info. The tab for the current screen SHALL be shown as selected. Activating Notes SHALL show `ginger-notes`. Activating Info SHALL show `ginger-info`. Activating Chat SHALL be recorded and SHALL do nothing else. The back control SHALL show `home`. The breadcrumb and the menu control SHALL do nothing. `ginger-notes` SHALL show the pod's empty note area and formatting toolbar, as in EXP-PET-002. Text typed there SHALL be kept for the rest of the run and has no other effect.

#### Scenario: Back to Home
- **WHEN** a participant on `ginger-info` activates the back control
- **THEN** `home` is shown

#### Scenario: Chat is inert
- **WHEN** a participant on `ginger-info` activates the Chat tab
- **THEN** `ginger-info` stays shown with Info selected

### Requirement: Ginger Info in variants A and B
In variants `a` and `b`, `ginger-info` SHALL show, in this order:
1. A "Forms" section label with one record row for the Pet form: a form icon, the title "Pet information" (the Pet form's catalog label) and no secondary line.
2. A divider.
3. Category rows: Medical with count 1, Attachments 0, Subpods 0 and Members 1.

The Medical count SHALL be the number of medication records the pod holds. In variant `b`, the Medical row SHALL also show the medical preview line below its label. In variant `a` it SHALL NOT. Activating the Medical row SHALL show `medical`. Activating the Pet row, Attachments, Subpods or Members SHALL be recorded and SHALL do nothing else.

#### Scenario: Variant A hides the medication
- **WHEN** a participant in variant A opens `ginger-info`
- **THEN** the Medical row shows the count 1, and the medication's name and frequency are not shown on the screen

#### Scenario: Variant B previews the medication
- **WHEN** a participant in variant B opens `ginger-info`
- **THEN** the Medical row shows "Clavamox · 2 times per day" below "Medical"

#### Scenario: Medical opens the Medical screen
- **WHEN** a participant in variant A or B activates the Medical row
- **THEN** `medical` is shown

### Requirement: Ginger Info in variant C
In variant `c`, `ginger-info` SHALL show, in this order:
1. A "Forms" section label with the Pet form row, as in variants A and B.
2. A "Medical" section label followed by one medication row for each medication record and a "+ Add medication" action.
3. A divider.
4. Category rows: Attachments 0, Subpods 0 and Members 1. There SHALL be no Medical row.

Activating the medication row SHALL show `medication`. The Pet row and the category rows SHALL behave as in variants A and B.

#### Scenario: Medication listed inline
- **WHEN** a participant in variant C opens `ginger-info`
- **THEN** a "Medical" section shows Clavamox with "62.5 mg · 2 times per day" and "Started Oct 6, 2026", and no Medical row is shown

#### Scenario: Open details from Info
- **WHEN** a participant in variant C activates the Clavamox row on `ginger-info`
- **THEN** `medication` is shown

### Requirement: Medical screen
In variants `a` and `b`, `medical` SHALL show a top bar without tabs. The bar has a back control, the Ginger avatar, the title "Medical", the breadcrumb "Ginger >" and a menu control. Below it SHALL be a "Medications" section label followed by one medication row for each medication record and a "+ Add medication" action. The back control SHALL perform a back navigation. The breadcrumb and the menu control SHALL do nothing.

#### Scenario: Medication listed on Medical
- **WHEN** a participant in variant A opens `medical`
- **THEN** a "Medications" section shows Clavamox with "62.5 mg · 2 times per day" and "Started Oct 6, 2026"

#### Scenario: Back from Medical
- **WHEN** a participant who came from `ginger-info` activates the back control on `medical`
- **THEN** `ginger-info` is shown

### Requirement: Medication details
`medication` SHALL show a top bar without tabs. The bar has a back control, the Ginger avatar, the title formed from the medication's name, the breadcrumb "Ginger > Medical" and a menu control. The breadcrumb SHALL be the same in every variant, because Medical is where the medication belongs. Below the top bar SHALL be a Medication form card. It has a pill icon, the title "Medication" and a collapse control, and starts expanded. It has one read-only row per field of the record, in the order and formats of EXP-PET-002's medication form display:
- Active ingredient;
- Brand name;
- Manufacturer;
- Dose;
- Dose form;
- Frequency;
- Start date.

A field missing from the record SHALL be left out. The card SHALL have no edit controls, no "+ Add contact info" and no "Create form". The back control SHALL perform a back navigation. The breadcrumb and the menu control SHALL do nothing.

#### Scenario: Full record
- **WHEN** a participant opens `medication` for the default record
- **THEN** the card shows Amoxicillin, Clavamox, Zoetis, 62.5 mg, Tablet, 2 times per day and Oct 6, 2026, with no edit control

#### Scenario: Back to where it was opened
- **WHEN** a participant in variant C opened `medication` from `ginger-info` and activates the back control
- **THEN** `ginger-info` is shown

### Requirement: Experiment analytics events
EXP-PET-003 SHALL declare and record these interaction events. Every variant SHALL use the same event name for the same intent:
- `pod_opened`: the Ginger row on `home` was activated. Property `tab`: `notes` or `info`, the tab it opened on.
- `pod_tab_selected`: a Ginger tab was activated. Property `tab`: `notes`, `chat` or `info`.
- `app_tab_selected`: an app tab bar tab other than Home was activated. Property `tab`: `telli`, `notifications` or `navigation`.
- `search_selected`: the search field in the Home top bar was activated.
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

#### Scenario: Search field is recorded
- **WHEN** a participant on `home` activates the search field
- **THEN** `search_selected` is recorded, and no other event
