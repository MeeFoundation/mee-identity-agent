## MODIFIED Requirements

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
