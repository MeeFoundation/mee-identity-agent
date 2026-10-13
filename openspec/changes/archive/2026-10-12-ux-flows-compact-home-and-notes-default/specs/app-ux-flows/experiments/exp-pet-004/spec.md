## MODIFIED Requirements

### Requirement: Apoquel fixture
A run SHALL start from the Ginger pod fixture of the Pets pods: avatar photo, title "Ginger", breadcrumb "Pets" and one member. The pod SHALL hold exactly one medication record, shaped after `pets:Medication`. By default it is Apoquel:
- active ingredient Oclacitinib,
- brand name Apoquel,
- manufacturer Zoetis,
- dose 16 mg,
- dose form Tablet,
- frequency `1`,
- start date 2026-09-14.

The code that starts a run SHALL be able to supply a different pod or medication record through the flow's initial state. The run SHALL NOT depend on state from any other flow, and no screen SHALL fetch data. Ginger SHALL always open on the Notes tab from Home.

#### Scenario: Default record
- **WHEN** a run starts without a supplied medication record
- **THEN** every screen that shows the medication shows Apoquel, 16 mg, Once per day

#### Scenario: Other flows unaffected
- **WHEN** a participant runs EXP-PET-003 after an EXP-PET-004 run saved a new schedule
- **THEN** EXP-PET-003 still shows its own default medication, unchanged

### Requirement: Home, Ginger tabs and Ginger Info
`home` SHALL be shown as in EXP-PET-003: a greeting, a "Pods" section label, one Ginger pod row, and the app tab bar with Home active. Activating the Ginger row SHALL show `ginger-notes`. Ask Telli and Navigation SHALL be recorded and do nothing else.

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
