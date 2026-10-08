## Purpose

Defines experiment EXP-PET-002 "Medication entry point" in `app-ux-flows`. It compares adding a pet's medication through manual entry points (variant A) with a one-tap AI suggestion (variant B), using the Tellipod pod UI and a medication record the server already holds. Hypothesis: when the app surfaces an AI suggestion to add the medication, more participants add the Medication form, and they do it with fewer steps, than when only the manual entry points exist.

## ADDED Requirements

### Requirement: Experiment identity and variants
The application SHALL register an experiment flow with flow id `exp-pet-002`, display code `EXP-PET-002` and title "Medication entry point". It SHALL use automatic variant assignment with exactly two variants:
- `a`, display code `EXP-PET-002-A`: manual entry points only.
- `b`, display code `EXP-PET-002-B`: manual entry points plus an AI suggestion to add the medication.

The flow SHALL declare these screens:
- `ginger-notes`: the pod's Notes tab.
- `ginger-info`: the pod's Info tab.
- `medical`: the Medical sub-pod.
- `add-form`: the Add form bottom sheet.
- `medication-added`: the Info tab after the Medication form was added.

`ginger-notes` SHALL be the initial screen in both variants. Each screen of each variant SHALL reference the Figma frame it implements, in Mee – Tellipod App v4.0.3:

| Variant | Screen | Figma frame |
|---|---|---|
| a | `ginger-notes` | EXP-PET-002-A - Ginger (notes) |
| a | `ginger-info` | EXP-PET-002-A - Ginger (info, with Medical) |
| a | `medical` | EXP-PET-002-A - Medical (empty) |
| a | `add-form` | EXP-PET-002-A - Add medication (modal) |
| a | `medication-added` | EXP-PET-002-A - Medication added |
| b | `ginger-info` | EXP-PET-002-B - Ginger (with quick add) |
| b | `medication-added` | EXP-PET-002-B - Medication added |

Screens that variant B shares with A unchanged SHALL keep A's references.

#### Scenario: Participant is assigned a variant
- **WHEN** a participant with no stored assignment starts EXP-PET-002 from the home page
- **THEN** they are assigned variant `a` or `b`, and the Ginger pod's Notes tab is shown at `/flows/exp-pet-002/ginger-notes`

#### Scenario: Variant forced by URL
- **WHEN** someone opens `/flows/exp-pet-002/ginger-info?variant=b`
- **THEN** the Info tab is shown in variant B, whatever the stored assignment

### Requirement: Pod fixture and server-provided medication record
A run SHALL start from a pod fixture and a medication record. The pod fixture is the pet pod "Ginger": avatar photo, breadcrumb "Pets > Care & Feeding", and one member. The medication record stands for data that already exists on the server and is passed into the flow. Its shape SHALL follow the Tellipod Pets ontology's `pets:Medication`:
- one or more active ingredients, each an ontology term with IRI and label (ChEBI),
- an optional brand name,
- an optional manufacturer,
- a dosage amount: a decimal value plus an optional unit term with IRI, label and symbol (CCO),
- an optional dose form term with IRI and label (DrOn),
- a frequency per day, as free text,
- an optional start date.

The code that starts a run SHALL be able to supply a different record through the flow's initial state. When none is supplied, the record SHALL be:
- active ingredient Amoxicillin (`CHEBI:2676`),
- brand name Clavamox,
- manufacturer Zoetis,
- dose 62.5 mg,
- dose form Tablet (`DRON:00000022`),
- frequency `2`,
- start date 2026-10-06.

At run start the Medication form SHALL NOT yet be added to the pod. No screen SHALL fetch data.

#### Scenario: Default record
- **WHEN** a run starts without a supplied medication record and the participant adds the Medication form
- **THEN** the form shows Amoxicillin, Clavamox, Zoetis, 62.5 mg, Tablet, 2 times per day and Oct 6, 2026

#### Scenario: Supplied record
- **WHEN** a run starts with a supplied record whose brand name is "Baytril" and the participant adds the Medication form
- **THEN** the form shows "Baytril" as the brand name

### Requirement: Pod tabs
`ginger-notes`, `ginger-info` and `medication-added` SHALL show the pod top bar with three tabs: Notes, Chat and Info. The bar has a back control, the Ginger avatar, the title "Ginger", the breadcrumb and a menu control. Activating Notes SHALL show `ginger-notes`. Activating Info SHALL show `ginger-info`. Activating Chat, the menu control or the back control SHALL do nothing. The tab for the current screen SHALL be shown as selected. On `medication-added` that is Info.

#### Scenario: Switch to Info
- **WHEN** a participant on `ginger-notes` activates the Info tab
- **THEN** `ginger-info` is shown with the Info tab selected

#### Scenario: Chat is inert
- **WHEN** a participant activates the Chat tab
- **THEN** the screen and the URL do not change

### Requirement: Notes tab
`ginger-notes` SHALL show the pod's note area with the placeholder "add your notes here and explore more capabilities of the pod by adding forms and chatting with the Telli agent" and a formatting toolbar. Typing in the note area SHALL be possible. The text SHALL be kept for the rest of the run and has no other effect. The toolbar buttons SHALL do nothing.

#### Scenario: Notes placeholder
- **WHEN** a participant opens `ginger-notes` in a new run
- **THEN** the note area is empty and shows the placeholder text

### Requirement: Info tab before the medication is added
While the Medication form has not been added, `ginger-info` SHALL show, in this order:
1. A "Forms" section label.
2. An empty-state card with the title "You have no forms yet", the message "Forms help you hold this pod's info." and a "+ Add form" action that shows `add-form`.
3. A divider.
4. Category rows with counts: Medical 0, Attachments 0, Subpods 0 and Members 1. Activating Medical SHALL show `medical`. The other rows SHALL do nothing.

#### Scenario: Add form opens the sheet
- **WHEN** a participant on `ginger-info` activates "+ Add form"
- **THEN** `add-form` is shown over the Info tab

#### Scenario: Medical opens the sub-pod
- **WHEN** a participant on `ginger-info` activates the Medical row
- **THEN** `medical` is shown

### Requirement: AI suggestion in variant B
In variant B, while the Medication form has not been added, `ginger-info` SHALL show an AI suggestion above the "Forms" section label. It has the caption "AI Suggestion" and the action "Add medication". Activating it SHALL add the Medication form to the pod and show `medication-added`, with no further step. Variant A SHALL NOT show the AI suggestion. In both variants the manual entry points stay available.

#### Scenario: One-tap add in variant B
- **WHEN** a participant in variant B on `ginger-info` activates the AI suggestion
- **THEN** `medication-added` is shown with the Medication form added and no AI suggestion

#### Scenario: Variant A has no suggestion
- **WHEN** a participant in variant A opens `ginger-info`
- **THEN** no AI suggestion is shown

#### Scenario: Manual path in variant B
- **WHEN** a participant in variant B activates "+ Add form" instead of the suggestion
- **THEN** `add-form` is shown exactly as in variant A

### Requirement: Medical sub-pod
`medical` SHALL show a top bar without tabs. The bar has a back control, the Ginger avatar, the title "Medical", the breadcrumb "Ginger >" and a menu control. Below it SHALL be a "Medications" section label. While the Medication form has not been added, the section SHALL hold an empty-state card with the title "No medications yet", the message "Medications help you track what Ginger takes." and a "+ Add medication" action that shows `add-form`. Once the form has been added, the section SHALL show the Medication form card instead. The back control SHALL perform a back navigation. The breadcrumb and the menu control SHALL do nothing.

#### Scenario: Add medication from Medical
- **WHEN** a participant on `medical` activates "+ Add medication"
- **THEN** `add-form` is shown over the Medical screen

#### Scenario: Back from Medical
- **WHEN** a participant who came from `ginger-info` activates the back control on `medical`
- **THEN** `ginger-info` is shown

### Requirement: Add form sheet
`add-form` SHALL show a bottom sheet over the screen it was opened from, either `ginger-info` or `medical`. When opened directly by URL it SHALL appear over `ginger-info`. The sheet SHALL contain:
- a grabber,
- the title "Add form",
- the selected template's description,
- a "Form template" select,
- a full-width primary "Save" button.

The select SHALL list Medication, Pet, Pet Care & Feeding and Contact Info, with Medication selected. Only Medication SHALL be selectable. The others SHALL be shown as unavailable. The Medication description SHALL read "A medication record everyone with access to this pod can see — dose, frequency, and schedule." Activating Save SHALL add the Medication form to the pod and show `medication-added`. Dismissing the sheet, by tapping outside it or pressing Escape, SHALL perform a back navigation and SHALL NOT add the form.

#### Scenario: Save adds the form
- **WHEN** a participant on `add-form` activates Save with Medication selected
- **THEN** `medication-added` is shown and the Medication form is part of the pod for the rest of the run

#### Scenario: Dismiss without saving
- **WHEN** a participant opened `add-form` from `ginger-info` and dismisses the sheet
- **THEN** `ginger-info` is shown and no form has been added

#### Scenario: Saving twice does not duplicate
- **WHEN** the Medication form has already been added and the participant returns to `add-form` with browser back and activates Save
- **THEN** `medication-added` is shown with a single Medication form

### Requirement: Medication form display
Once the Medication form has been added, `ginger-info` and `medication-added` SHALL show the following instead of the empty-state card and the AI suggestion:
1. Under the "Forms" section label, a Medication form card. It has a pill icon, the title "Medication" and a collapse control, and starts expanded.
2. Inside the card, one row per field of the medication record. Each row has a label, a value and an edit control.
3. At the end of the card, a "+ Add contact info" action.
4. Below the card, a "Create form" action.
5. The divider and the category rows, as before.

Fields are shown in this order, with these formats:
- Medication / Active ingredient: the active ingredient labels, comma-separated.
- Brand name.
- Manufacturer.
- Dose: the value followed by the unit symbol, or the value alone when there is no unit.
- Dose form: the term label.
- Frequency: "N times per day" for a whole number above 1, "Once per day" for 1, and the text as is otherwise.
- Start date: a medium date in the app language, for example "Oct 6, 2026".

A field missing from the record SHALL be left out. The collapse control SHALL hide and show the field rows. The edit controls, "+ Add contact info" and "Create form" SHALL do nothing. Opening `medication-added` directly by URL SHALL show the added Medication form.

#### Scenario: Collapse the form
- **WHEN** a participant activates the Medication card's collapse control
- **THEN** the field rows are hidden and the control shows the collapsed state, and activating it again shows them

#### Scenario: Missing field is omitted
- **WHEN** the record has no manufacturer
- **THEN** the card shows no Manufacturer row

#### Scenario: Free-text frequency
- **WHEN** the record's frequency is "as needed"
- **THEN** the Frequency row shows "as needed"

#### Scenario: Info tab keeps the added form
- **WHEN** after adding the form a participant switches to Notes and back to Info
- **THEN** `ginger-info` shows the Medication form card

#### Scenario: Direct link to the result
- **WHEN** someone opens `/flows/exp-pet-002/medication-added` in a new run
- **THEN** the Info tab is shown with the Medication form added
