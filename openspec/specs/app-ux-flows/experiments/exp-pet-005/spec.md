# app-ux-flows/experiments/exp-pet-005 Specification

## Purpose

Defines experiment EXP-PET-005 "Give medication" in `app-ux-flows`. It tests where a time-sensitive pet-care action should appear by comparing how participants find and record a scheduled medication dose.

Every variant shares the baseline path Home → Ginger → Info → Medical → medication details, and a due-dose action on Medical and on details. The variants differ only in whether an earlier, promoted due-dose surface exists, and where it sits: none (A), Ginger's pod (B) or Home (C).

Hypothesis: participants think of a due dose as "what do I need to do now?" rather than "where is this stored?". A promoted surface (B, C) is therefore found sooner and with fewer wrong turns than the Medical baseline (A), without being mistaken for editing the medication.

## Requirements

### Requirement: Experiment identity and variants
The application SHALL register an experiment flow with flow id `exp-pet-005`, display code `EXP-PET-005` and title "Give medication". It SHALL use explicit variant selection with exactly three variants, in this order:
- `a`, display code `EXP-PET-005-A`, "From Medical": no promoted due-dose surface.
- `b`, display code `EXP-PET-005-B`, "On Ginger's pod": a due-dose band on Ginger's pod (see "Pod band in variant B").
- `c`, display code `EXP-PET-005-C`, "On Home": a "Today" section on Home (see "Today section in variant C").

The flow SHALL declare these screens, and every variant SHALL implement every one of them:
- `home`: the app's Home with the participant's pods;
- `ginger-notes`: Ginger's Notes tab;
- `ginger-info`: Ginger's Info tab;
- `medical`: the Medical screen;
- `medication`: the details of the medication;
- `give-dose`: the dose confirmation sheet over the screen it was opened from;
- `undo-dose`: the sheet that reverts a dose given by mistake, over the screen it was opened from;
- `dose-history`: Ginger's medication dose history.

Every screen SHALL reference the Figma frame it implements, in Mee – Tellipod App v4.0.3 (file `cd6NZmMxZHC7qTOk0SXYVW`, page "EXP-PET-005 - Give medication"). The flow declares variant A's frames; variants B and C override the screens their promoted surface changes:

| Screen | A | B | C |
|---|---|---|---|
| `home` | 1390-39755 | 1390-40054 | 1390-40239 |
| `ginger-notes` | 1390-39776 | 1390-40075 | A's |
| `ginger-info` | 1390-39818 | 1390-40210 | A's |
| `medical` | 1390-39843 | A's | A's |
| `medication` | 1390-39936 | A's | A's |
| `give-dose` | 1390-39873 | 1390-40119 | 1390-40265 |
| `undo-dose` | 1390-39989 | A's | A's |
| `dose-history` | 1390-39955 | A's | A's |

`home` SHALL be the initial screen in every variant. Apart from the promoted surface, every screen SHALL look and behave the same in every variant.

#### Scenario: Moderator chooses a variant on the home page
- **WHEN** someone views the home page
- **THEN** the EXP-PET-005 card lets them choose "From Medical", "On Ginger's pod" or "On Home", and choosing one starts the flow in that variant on Home at `/flows/exp-pet-005/home`

#### Scenario: Direct link without a variant
- **WHEN** someone opens `/flows/exp-pet-005/home` without a `variant` parameter
- **THEN** the flow runs in variant A

#### Scenario: Variant forced by URL
- **WHEN** someone opens `/flows/exp-pet-005/ginger-notes?variant=b`
- **THEN** Ginger's Notes tab is shown with the variant B band, whatever the stored assignment

### Requirement: Usability task and briefing
Every variant SHALL be run with the same task, read to the participant by a moderator: "Give Ginger her Apoquel and record that she has taken this dose." Nothing in the app SHALL show this task, or any hint naming Medical, the details screen, the due-dose card or a screen. The flow SHALL show no briefing, as for every experiment.

#### Scenario: No in-app task
- **WHEN** a participant starts EXP-PET-005 in any variant
- **THEN** no mission card, goal, hint or other text describing the task is shown

### Requirement: Apoquel and dose fixture
A run SHALL start from the Ginger pod fixture of the Pets pods: avatar photo, title "Ginger" and breadcrumb "Pets". The pod SHALL have two members: the participant ("You") and Sam. The pod SHALL hold exactly one medication record, shaped after `pets:Medication`. By default it is Apoquel:
- active ingredient Oclacitinib;
- brand name Apoquel;
- manufacturer Zoetis;
- dose 16 mg;
- dose form Tablet;
- frequency `2`;
- start date 2026-09-14.

The pod SHALL also hold exactly one dose of that medication, separate from the medication record. The dose has:
- a scheduled time, which is the moment the run starts;
- a status, `due` or `given`;
- the time it was given, once given.

By default the dose is `due`.

The pod SHALL also hold Ginger's dose history, built relative to the run's start, with no data fetched:
- **Apoquel** doses every 12 hours, back from the current dose to the start date. The most recent one, 12 hours before the current dose, was given by Sam. Earlier ones were given by Sam or by the participant, and a few were missed.
- **Past courses**, each a finished medication record with an end date:
  - Clavamox 62.5 mg tablet, 2 times per day, 2025-03-02 to 2025-03-11;
  - Metacam 0.5 mg liquid, once per day, 2024-06-10 to 2024-06-23;
  - Felimazole 2.5 mg tablet, 2 times per day, 2023-01-10 to 2024-01-09;
  - Prednisolone 5 mg tablet, once per day, 2021-11-01 to 2021-11-14.

Each past dose has a scheduled time, a status (`given` or `missed`), and for a given dose the time given and the member who gave it. The fixture SHALL be the same in every variant and SHALL hold several hundred doses, so the history is long.

The code that starts a run SHALL be able to supply a different pod, a different medication record, and a dose that is already given, through the flow's initial state. The run SHALL NOT depend on state from any other flow, and no screen SHALL fetch data. Ginger SHALL always open on the Notes tab from Home.

#### Scenario: Default state
- **WHEN** a run starts without supplied initial state
- **THEN** every screen that shows the medication shows Apoquel, 16 mg, 2 times per day, and every due-dose surface the variant has shows the dose as due now

#### Scenario: Run started with the dose given
- **WHEN** a run starts with the dose supplied as given
- **THEN** every due-dose surface shows the given state, and no "Mark as given" action is shown

#### Scenario: Other flows unaffected
- **WHEN** a participant runs EXP-PET-004 after an EXP-PET-005 run recorded the dose
- **THEN** EXP-PET-004 shows its own default medication, once per day, with no dose information

### Requirement: Due-dose card
Every due-dose surface SHALL use the same card. In the due state, the card SHALL show:
- a heading "Due now";
- a pill icon;
- the medication's name;
- "{dose} · {frequency}" in the wording of the medication summary, for example "16 mg · 2 times per day";
- a primary action "Mark as given".

The card SHALL support four states with distinct treatments. The fixture uses only due and given.
- **Upcoming:** a neutral treatment, with the scheduled time and no action.
- **Due:** a calm brand-tinted treatment with the action. It SHALL NOT use warning or error colours or icons. Under the medication line it SHALL show the last given dose of that medication: "Last given {day} {time} · {member}", for example "Last given yesterday 10:32 PM · Sam" or "Last given today 8:02 AM · Sam".
- **Overdue:** a warning treatment with the action and the scheduled time.
- **Given:** a success treatment with a check icon, the text "Given · {time given} · {member}" in the device's short time format (for example "Given · 10:32 AM · You"), and no "Mark as given" action. When the participant gave the dose, the card SHALL also show an "Undo" link (see "Undo a dose given by mistake").

In every state the card SHALL show a "History" link, a separate control that opens `dose-history` filtered to the card's medication.

The card SHALL be announced as one labelled region named after its heading and the medication. "Mark as given" SHALL be a separate button. Activating the card outside that button SHALL do nothing.

#### Scenario: Due treatment is not an alarm
- **WHEN** a participant sees the due-dose card in the default state
- **THEN** it shows "Due now", Apoquel and "16 mg · 2 times per day" with a "Mark as given" button, and no warning or error colour or icon

#### Scenario: Given treatment
- **WHEN** the participant gave the dose at 10:32
- **THEN** the card shows a check icon, "Given · 10:32 AM · You" (in an English locale) and an "Undo" link, and no "Mark as given" action

#### Scenario: Someone else's earlier dose is visible
- **WHEN** a participant sees the due-dose card in the default state
- **THEN** the card shows when Sam last gave Apoquel, so the participant can tell the previous dose was given and this one is still due

### Requirement: Baseline path in every variant
`home` SHALL show, as in EXP-PET-004:
- the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field;
- a "Pods" section label;
- one Ginger pod row;
- the app tab bar with Home active.

Activating the Ginger row SHALL show `ginger-notes`. Ask Telli, Notifications, Navigation and the search field SHALL be recorded and do nothing else.

`ginger-notes` and `ginger-info` SHALL show the Ginger pod top bar and tabs as in EXP-PET-004:
- back SHALL show `home`;
- Notes and Info SHALL switch tabs;
- Chat and the menu control SHALL be recorded and do nothing else;
- the breadcrumb SHALL do nothing.

`ginger-info` SHALL show EXP-PET-004's Info layout:
- a "Forms" section with the Pet form row;
- a divider;
- the category rows Medical (count 1, no preview line), Attachments 0, Subpods 0 and Members 2.

Activating Medical SHALL show `medical`. The Pet row and the other category rows SHALL be recorded and do nothing else.

`medical` SHALL show a top bar with back, the Ginger avatar, the title "Medical", the breadcrumb "Ginger >" and a menu control. Below it, in this order:
- the due-dose card;
- a "Medications" section label;
- the Apoquel medication item, showing "16 mg · 2 times per day" and "Started Sep 14, 2026", with a chevron and no action under it;
- a "+ Add medication" action, which is only recorded;
- a "Dose history" row, with a preview line of the last given dose of any medication, which opens `dose-history` with all medications.

Activating the medication item SHALL show `medication`.

`medication` SHALL show a top bar titled with the medication's name, with the trail "Medical", and below it:
- the due-dose card;
- a "Recent doses" section with the medication's last two past doses (given or missed), and a "See all" action that opens `dose-history` filtered to this medication;
- the medication's read-only form, one row per field, in the order and formats of EXP-PET-003's details, with no edit controls.

On every screen, back SHALL perform a back navigation, the menu control SHALL be recorded and do nothing else, and the breadcrumb SHALL do nothing.

#### Scenario: Medical shows the dose in every variant
- **WHEN** participants in variants A, B and C each open `medical`
- **THEN** each sees the same due-dose card above the same Apoquel item

#### Scenario: Details are not a dead end
- **WHEN** a participant activates the Apoquel item on `medical`
- **THEN** `medication` is shown with the due-dose card and its "Mark as given" action above the read-only form

#### Scenario: Wrong turns are allowed
- **WHEN** a participant in variant A opens Notes, then Info, then activates the Pet form row
- **THEN** each step is recorded and the participant stays free to continue, with no redirect or hint

#### Scenario: Notifications is inert
- **WHEN** a participant on `home` activates the Notifications tab
- **THEN** `app_tab_selected` is recorded with `tab` `notifications` and `home` stays shown

#### Scenario: Search is recorded
- **WHEN** a participant on `home` activates the search field
- **THEN** `search_selected` is recorded and `home` stays shown

### Requirement: Pod band in variant B
In variant B, `ginger-notes` and `ginger-info` SHALL show the due-dose card as a band between the Ginger top bar and the tab's content, above the notes area and above the Info list respectively. The band SHALL look and behave the same on both tabs. Switching between Notes and Info SHALL keep it shown. Variants A and C SHALL show no band on these screens, and the tab content SHALL otherwise be identical in all variants.

#### Scenario: Band follows the pod across tabs
- **WHEN** a participant in variant B opens Ginger and switches from Notes to Info
- **THEN** the due-dose card is shown under the top bar on both tabs

#### Scenario: No band in A and C
- **WHEN** a participant in variant A or C opens Ginger
- **THEN** Notes and Info show no due-dose card

### Requirement: Today section in variant C
In variant C, `home` SHALL show a "Today" section above the "Pods" section. It holds the due-dose card, with Ginger's avatar and the name "Ginger" above the medication line, so that the card names the pet outside its pod. Variants A and B SHALL show no Today section, and the rest of Home SHALL be identical in all variants.

#### Scenario: Today names the pet
- **WHEN** a participant in variant C starts the run
- **THEN** Home shows "Today" with a card naming Ginger, Apoquel, "16 mg · 2 times per day", "Due now" and "Mark as given", above the Ginger pod row

#### Scenario: Home unchanged in A and B
- **WHEN** a participant in variant A or B starts the run
- **THEN** Home shows only the greeting, the "Pods" section and the tab bar

### Requirement: Dose history
`dose-history` SHALL show a top bar titled "Dose history", with the trail "Medical", back and an inert, recorded menu control. Below it, in this order:
- a period filter with the options "Week" (7 days), "Month" (30 days), "Year" (365 days) and "All", Month selected on arrival;
- a medication filter with "All medications", then the current medication, then each past course with its years (for example "Clavamox · 2025");
- the doses that match both filters, newest first, grouped under day headings ("Today", "Yesterday", then the date).

Each dose row SHALL show the medication's name and dose, the scheduled time, and the outcome:
- "Given {time} · {member}" for a given dose, "You" when the participant gave it;
- "Missed", in a warning treatment;
- the current dose, once given, as the newest entry.

The current dose SHALL NOT be listed while it is still due.

Opening `dose-history` from Medical SHALL select all medications. Opening it from a dose card or from the details' "See all" SHALL select that card's or details' medication. Changing a filter SHALL update the list immediately and SHALL be kept while the participant stays in the run.

The list SHALL show at most 50 doses at first, followed by a "Show more" action that reveals the next 50, while more exist. When no dose matches the filters, the screen SHALL say so ("No doses in this period") and offer "Show all time", which selects "All". Rows SHALL be read-only.

#### Scenario: Recent history by default
- **WHEN** a participant opens Medical → Dose history in the default state
- **THEN** the last 30 days of Apoquel doses are shown, newest first, starting with Sam's dose 12 hours before the current one, grouped by day

#### Scenario: Filter by a past course
- **WHEN** a participant selects "Clavamox · 2025" and "All"
- **THEN** only Clavamox doses from March 2025 are shown

#### Scenario: Empty period
- **WHEN** a participant selects "Metacam · 2024" while "Month" is selected
- **THEN** the screen says there are no doses in this period and offers "Show all time"

#### Scenario: Long history
- **WHEN** a participant selects "All" with all medications
- **THEN** the first 50 doses and "Show more" are shown, and each "Show more" reveals up to 50 more until none are left

#### Scenario: Given dose appears in history
- **WHEN** a participant gives the current dose and then opens the history
- **THEN** the newest entry is Apoquel, "Given {time} · You"

### Requirement: Shared dose confirmation
Activating "Mark as given" on any due-dose surface SHALL show `give-dose`. It is a bottom sheet over the screen the action was activated on, and it is identical whichever surface opened it. The sheet SHALL show:
- the title "Record Ginger's dose?";
- the medication line "Apoquel · 16 mg tablet";
- "Scheduled: now";
- a primary "Mark as given" button;
- a "Cancel" button.

"Cancel", dismissing the sheet and browser back SHALL each return to the screen underneath with the dose still due and nothing changed. Confirming SHALL record the dose as given, at the current time, and return to the screen underneath. Confirming SHALL NOT change the medication record.

If `give-dose` is opened while the dose is already given, the sheet SHALL NOT be shown, and the screen the sheet would be shown over SHALL be shown instead. If `give-dose` is opened directly by URL, it SHALL be shown over `medical`.

#### Scenario: Same sheet from every surface
- **WHEN** a participant activates "Mark as given" on `medical` in variant A, on `ginger-notes` in variant B, or on `home` in variant C
- **THEN** the same sheet with the same title, content and buttons is shown over that screen

#### Scenario: Cancel changes nothing
- **WHEN** a participant activates Cancel on the sheet
- **THEN** the screen underneath is shown with the dose still due and the medication unchanged

#### Scenario: Confirmation leaves the medication alone
- **WHEN** a participant confirms the sheet
- **THEN** the medication still shows Apoquel, 16 mg, 2 times per day, started Sep 14, 2026, on every screen, and only the dose has changed

### Requirement: Given state and completion
After the dose is confirmed:
- every due-dose surface of the run SHALL show the given state, in place of the due state, and SHALL NOT be removed;
- the screen the participant returns to SHALL show a success toast "Apoquel marked as given", which the participant can close and which is not shown again after leaving that screen;
- the run SHALL complete without a completion view, and the participant SHALL stay on that screen, free to keep navigating.

Screens viewed after completion SHALL still be recorded as screen views.

#### Scenario: Completion from Home in variant C
- **WHEN** a participant in variant C confirms the dose from Home
- **THEN** Home shows the Today card as "Given · {time}" and the toast, the run is completed once, and opening Ginger → Info → Medical shows the same given card above the unchanged Apoquel item

#### Scenario: Completion from the pod in variant B
- **WHEN** a participant in variant B confirms the dose from the band on Notes and then switches to Info
- **THEN** the band shows the given state on both tabs

#### Scenario: Back after completion
- **WHEN** a participant uses browser back or forward after confirming
- **THEN** no confirmation sheet for a due dose is shown again, and the run is not completed a second time

### Requirement: Undo a dose given by mistake
A due-dose card in the given state SHALL show an "Undo" link when the participant gave the dose, and none when another member did. Activating it on any surface SHALL show `undo-dose`: a bottom sheet over the screen the link was activated on, identical whichever surface opened it, with:
- the title "Undo Ginger's dose?";
- the medication line "Apoquel · 16 mg tablet";
- "Given {day} {time} · You", for example "Given today 10:32 AM · You";
- a destructive "Mark as not given" button;
- a "Keep as given" button.

"Keep as given", dismissing the sheet and browser back SHALL return to the screen underneath with nothing changed. Confirming SHALL return the dose to `due` with its scheduled time, remove its time given and who gave it, and leave the medication record unchanged. Every due-dose surface SHALL then show the due (or overdue) state with "Mark as given" again, the dose SHALL no longer be listed in the history, and the screen underneath SHALL show an informational toast "Apoquel marked as not given", which behaves like the given toast. The run SHALL stay completed; giving the dose again SHALL NOT complete it a second time.

If `undo-dose` is opened while the dose is not given, the sheet SHALL NOT be shown, and the screen it would be shown over SHALL be shown instead.

#### Scenario: Undo from Medical
- **WHEN** a participant gives the dose on `medical`, then activates "Undo" on the given card and confirms "Mark as not given"
- **THEN** `medical` shows the card as "Due now" with "Mark as given", the toast "Apoquel marked as not given", and the Dose history row's preview names Sam's previous dose again

#### Scenario: Keep as given
- **WHEN** a participant activates "Undo" and then "Keep as given"
- **THEN** the screen underneath is shown with the dose still given

### Requirement: Experiment analytics events
EXP-PET-005 SHALL declare and record these interaction events. Every variant SHALL use the same event name for the same intent.

| Event | When | Properties |
|---|---|---|
| `medication_give_started` | "Mark as given" on a due-dose card is activated | `entry_point` |
| `medication_give_confirmed` | the sheet's "Mark as given" is activated | `entry_point` |
| `medication_give_cancelled` | the sheet is cancelled, dismissed or left by back | `entry_point` |
| `medication_undo_started` | "Undo" on a given due-dose card is activated | `entry_point` |
| `medication_undo_confirmed` | the undo sheet's "Mark as not given" is activated | `entry_point` |
| `medication_undo_cancelled` | the undo sheet is kept, dismissed or left by back | `entry_point` |
| `pod_opened` | the Ginger row on Home is activated | none |
| `pod_tab_selected` | a Ginger tab is selected | `tab`: `notes`, `chat` or `info` |
| `app_tab_selected` | Ask Telli, Notifications or Navigation is activated | `tab`: `telli`, `notifications` or `navigation` |
| `search_selected` | the search field in the Home top bar is activated | none |
| `info_row_selected` | an inert Info row is activated | `row`: `pet_form`, `attachments`, `subpods` or `members` |
| `medical_opened` | the Medical row is activated | none |
| `medication_viewed` | the medication item on `medical` is activated | none |
| `add_medication_selected` | "+ Add medication" is activated | none |
| `pod_menu_selected` | a menu control is activated | `screen`: `ginger-notes`, `ginger-info`, `medical`, `medication` or `dose-history` |
| `dose_history_opened` | the Dose history row, a card's History link or "See all" is activated | `source`: `medical`, `card` or `details` |
| `dose_history_filtered` | a filter is changed, including by "Show all time" | `period`: `7d`, `30d`, `1y` or `all`; `medication`: `all`, `current` or `past` |
| `dose_history_more_shown` | "Show more" is activated | `shown`: the number of doses shown after it |

`entry_point` SHALL be:
- `home` for the Today card;
- `pod` for the band on either Ginger tab;
- `medical` for the card on `medical` or `medication`.

The sheets' events SHALL carry the entry point of the card that opened them. The screen id in the automatic context tells `medical` and `medication` apart. The flow SHALL NOT record an impression event for a due-dose card, and SHALL NOT use variant-specific event names. The runtime's lifecycle events SHALL be recorded as for every flow, including `flow_completed` when the dose is confirmed. No event SHALL carry medication content, times or text typed by the participant.

#### Scenario: Same events, different entry points
- **WHEN** one participant confirms from Home in variant C, and another confirms from Medical in variant C
- **THEN** both record `medication_give_started` and `medication_give_confirmed`, with `entry_point` `home` for the first and `medical` for the second

#### Scenario: Promoted surface ignored
- **WHEN** a participant in variant B ignores the band, opens Info → Medical, and confirms there
- **THEN** `medication_give_started` and `medication_give_confirmed` are recorded with `entry_point` `medical` and variant `b` in the context

#### Scenario: Cancellation is recorded
- **WHEN** a participant opens the sheet from the band and cancels
- **THEN** `medication_give_cancelled` with `entry_point` `pod` is recorded, and no `flow_completed`

#### Scenario: Notifications tab is recorded
- **WHEN** a participant activates the Notifications tab on `home`
- **THEN** `app_tab_selected` is recorded with `tab` `notifications`, and no other event

#### Scenario: Search field is recorded
- **WHEN** a participant on `home` activates the search field
- **THEN** `search_selected` is recorded, and no other event
