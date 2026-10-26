## MODIFIED Requirements

### Requirement: Baseline path in every variant
`home` SHALL show, as in EXP-PET-004:
- the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field;
- the "Recent Pods" section with no "See all pods" link and one Ginger pod card;
- the app tab bar with Home active.

Activating the Ginger card SHALL show `ginger-notes`. Ask Telli, Notifications, Navigation and the search field SHALL be recorded and do nothing else.

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

### Requirement: Today section in variant C
In variant C, `home` SHALL show a "Today" section above the "Recent Pods" section. It holds the due-dose card, with Ginger's avatar and the name "Ginger" above the medication line, so that the card names the pet outside its pod. Variants A and B SHALL show no Today section, and the rest of Home SHALL be identical in all variants.

#### Scenario: Today names the pet
- **WHEN** a participant in variant C starts the run
- **THEN** Home shows "Today" with a card naming Ginger, Apoquel, "16 mg · 2 times per day", "Due now" and "Mark as given", above the Ginger pod card

#### Scenario: Home unchanged in A and B
- **WHEN** a participant in variant A or B starts the run
- **THEN** Home shows only the greeting, the "Recent Pods" section and the tab bar
