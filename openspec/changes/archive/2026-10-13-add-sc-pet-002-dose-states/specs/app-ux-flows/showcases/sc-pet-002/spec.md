## Purpose

Defines the showcase SC-PET-002 "Medication doses" in `app-ux-flows`. It shows the due-dose states that EXP-PET-005's fixture doesn't reach: giving a dose that is overdue, and undoing a dose marked as given by mistake. The showcase is for demos and discussion: it has cases instead of variants, records no analytics, and carries its own explanations and open questions.

## ADDED Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-002`, display code `SC-PET-002` and title "Medication doses", listed after `sc-pet-001`. It SHALL have the two cases defined in "Cases". `medical` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `medical`: Ginger's Medical screen, as in EXP-PET-005: top bar, due-dose card, Medications with Apoquel and an inert "+ Add medication", and the Dose history row;
- `give-dose`: the give sheet over `medical`;
- `undo-dose`: the undo sheet over `medical`;
- `dose-history`: Ginger's dose history, as in EXP-PET-005.

Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame | Node |
|---|---|---|
| `medical` | SC-PET-002-A - Medical (dose overdue) | 1390-30353 |
| `give-dose` | SC-PET-002-A - Give dose (sheet over Medical) | 1390-30383 |
| `undo-dose` | SC-PET-002-B - Undo dose (sheet over Medical) | 1390-30478 |
| `dose-history` | SC-PET-002-B - Dose history | 1390-30541 |

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B on the home page
- **THEN** the flow starts on `medical` with the briefing for "Undo a dose"

### Requirement: Fixture
Every case SHALL start from Ginger's shared pod (the participant and Sam), Apoquel 16 mg tablet twice a day, the past courses and the dose history of EXP-PET-005, built back from the case's scheduled time. No screen SHALL fetch data.

#### Scenario: Previous dose by Sam
- **WHEN** either case starts
- **THEN** the history's newest Apoquel dose is Sam's, scheduled 12 hours before the case's current dose

### Requirement: Cases
The showcase SHALL have exactly these two cases, in this order:
- `a`, display code `SC-PET-002-A`, "Overdue dose": the dose is scheduled three hours before the run and not given. Goal: "Ginger's morning Apoquel is overdue. Give it to her now and record it."
- `b`, display code `SC-PET-002-B`, "Undo a dose": the dose was scheduled 15 minutes before the run and given by the participant 10 minutes before it. Goal: "You marked Ginger's Apoquel as given by mistake. Undo it."

#### Scenario: Overdue dose
- **WHEN** case A starts
- **THEN** the card shows the warning treatment "Overdue · due at {scheduled time}" with "Mark as given", and the give sheet shows "Scheduled: {scheduled time}"

#### Scenario: Give the overdue dose
- **WHEN** the reviewer confirms the give sheet in case A
- **THEN** `medical` shows the given card and the toast "Apoquel marked as given", and the run completes without a completion view

#### Scenario: Undo a dose
- **WHEN** the reviewer activates "Undo" in case B and confirms "Mark as not given"
- **THEN** `medical` shows the card as due with "Mark as given", the toast "Apoquel marked as not given", the run completes without a completion view, and `dose-history` no longer lists the dose

### Requirement: Undo sheet
The undo sheet SHALL show "Undo Ginger's dose?", "Apoquel · 16 mg tablet", "Given {day} {time} · You", a destructive "Mark as not given" and "Keep as given". "Keep as given", dismissing and browser back SHALL return to `medical` with nothing changed. When the dose is not given, `undo-dose` SHALL show `medical` instead of the sheet; when it is given, `give-dose` SHALL show `medical` instead of the sheet.

#### Scenario: Keep as given
- **WHEN** the reviewer opens the undo sheet in case B and activates "Keep as given"
- **THEN** `medical` shows the dose still given, with no toast

### Requirement: Briefing
The showcase SHALL provide a description, each case's goal and description, a hint for every screen, an explanation of every screen, and open questions: who should be told about an undo (flow), when an overdue dose should be skipped (case A), whether undo should be limited (case B), whether the overdue treatment is urgent enough (Medical), and whether the toast should offer an immediate Undo (undo sheet).

#### Scenario: Every key is translated
- **WHEN** either case is briefed
- **THEN** its goal, hints, screen explanations and open questions are all shown as English text, with no raw keys
