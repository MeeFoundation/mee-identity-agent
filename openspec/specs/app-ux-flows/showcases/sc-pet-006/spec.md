# app-ux-flows/showcases/sc-pet-006 Specification

## Purpose

Defines the showcase SC-PET-006 "Share Ginger's care" in `app-ux-flows`. The owner of Ginger's pod invites a pet sitter and chooses what the sitter may do: only look, or also log doses. The sitter then uses the pod with that access. There is no sharing API, so the invite, the members and the sitter's session are local mocks. The showcase is for demos and discussion: it has cases instead of variants, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-006`, display code `SC-PET-006`, title "Share Ginger's care" and the description "Invite a sitter to Ginger's pod and choose whether they can only look or also log doses." It SHALL have the three cases defined in "Cases" and no variants. It SHALL be listed after SC-PET-005 in the "Pet care" group. `info` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `info`: Ginger's Info tab, with the rows that lead to `medical` and `members`; the other rows do nothing;
- `members`: Ginger's members, as the owner sees them;
- `invite-name`: the sheet over `members` that asks who is being invited and what they can do;
- `invite-share`: the sheet over `members` that shows the link and the share targets;
- `medical`: Ginger's Medical screen, with the due-dose card, Medications and the Dose history row, and without "+ Add medication";
- `give-dose`: the give sheet over `medical`;
- `dose-history`: Ginger's dose history.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case C on the home page
- **THEN** the flow starts on `info` with the briefing for "Sitter gives the dose"

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Share Ginger's care" is listed with the code `SC-PET-006`, its cases `SC-PET-006-A` to `SC-PET-006-C`, and its seven screens

### Requirement: Fixture
Every case SHALL start from Ginger's pod with the members Sam (owner) and, once the invite is accepted, the sitter Geo; Telli is the pod's assistant and not a member. The pod SHALL hold Apoquel 16 mg tablet twice a day, with the dose history and past courses of SC-PET-002. No screen SHALL fetch data. In case A the person using the app is Sam. In cases B and C it is Geo. Ginger's Info tab shows the number of members and pending invites on its Members row.

#### Scenario: Whose phone
- **WHEN** case A starts
- **THEN** `members` shows Sam as "Owner" with "(You)", and no other member
- **WHEN** case B or C starts
- **THEN** `members` lists Sam as "Owner" and Geo as "Geo (You)" with Geo's access

### Requirement: Three access levels
A member's access SHALL be one of "Owner", "Can log doses" and "Can view". "Can view" SHALL behave as in SC-PPL-003: nothing that would change the pod is shown, rather than shown and disabled. "Can log doses" SHALL add only giving a dose and undoing a dose that the same member gave. It SHALL NOT allow editing or adding medication, forms, notes, members or invites. Only the owner SHALL see "Add a member" on `members`.

#### Scenario: Viewer sees no dose control
- **WHEN** a member with "Can view" opens `medical` while the dose is due
- **THEN** the due-dose card shows the dose without "Mark as given", and there is no Undo

#### Scenario: Dose logger gives but cannot edit
- **WHEN** a member with "Can log doses" opens `medical`
- **THEN** the due-dose card shows "Mark as given", and there is no "+ Add medication" and no way to edit Apoquel

### Requirement: Invite with an access choice
`invite-name` SHALL be a bottom sheet over `members` with the title "Add a member to Ginger" (pod name in bold), a text field labelled "Who are you inviting?", and a choice between "Can log doses" and "Can view" with a one-line description under each: "Can see everything and mark doses as given" and "Can see everything, and can't change anything". "Can log doses" SHALL be selected when the sheet opens. "Create invite link" SHALL be unavailable while the name, without surrounding spaces, is empty. The field SHALL take focus when the sheet opens.

Activating "Create invite link" SHALL create a pending invite with that name and access, sent today, with a new link of the form `pod.app/i/xxxx-xxxx`, and show `invite-share` for it. `invite-share` SHALL work as in SC-PPL-002 ("Share an invite link"), with the pod name "Ginger", and SHALL also show the invite's access under the title.

#### Scenario: Default access
- **WHEN** the owner opens `invite-name`
- **THEN** "Can log doses" is selected

#### Scenario: Send the link
- **WHEN** the owner in case A types "Geo", leaves "Can log doses" selected and activates "Messages" on `invite-share`
- **THEN** `members` lists Geo under "PENDING INVITES" with "Can log doses" and "Sent today", the toast reads "Invite link sent to Geo", and the briefing shows "Goal reached"

#### Scenario: Name required
- **WHEN** the owner has typed only spaces on `invite-name`
- **THEN** "Create invite link" is unavailable

### Requirement: Sitter with Can view
In case B, `medical` and `dose-history` SHALL show Ginger's data as the owner sees it, except for the controls that "Can view" removes. `dose-history` SHALL list the doses with who gave each. `members` SHALL show Geo as "(You)" with "Can view" and no "Add a member".

#### Scenario: Read the doses
- **WHEN** the reviewer in case B opens `dose-history`
- **THEN** the doses are listed with the member who gave each, and nothing in it can be changed

### Requirement: Sitter logs a dose
In case C, `medical` SHALL show the due dose with "Mark as given". Activating it SHALL show `give-dose`, the give sheet of SC-PET-002, whose confirmation gives the dose as Geo. Then `medical` SHALL show the given card with "Given {time} · You" and the toast "Apoquel marked as given". This showcase offers no way to undo a dose.

`dose-history` SHALL list the dose as given by Geo. When the owner views `dose-history` or `medical` after the sitter gave a dose, they SHALL see it as given by "Geo".

#### Scenario: Give the due dose
- **WHEN** the reviewer in case C confirms the give sheet
- **THEN** `medical` shows the given card and the toast "Apoquel marked as given", and the run completes without a completion view

#### Scenario: Owner sees who gave it
- **WHEN** the dose was given by Geo and the card or history is shown as the owner would see it
- **THEN** it reads "Given {time} · Geo"

### Requirement: A dose someone else gave
When the dose on `medical` was already given by another member, the card SHALL show it as given with "Given {time} · {name}" and SHALL NOT offer "Mark as given" or Undo. `give-dose` SHALL show `medical` instead of the sheet when the dose is already given.

#### Scenario: Already given by the owner
- **WHEN** the dose was given by Sam and Geo, with "Can log doses", opens `medical`
- **THEN** the card reads "Given {time} · Sam" with no "Mark as given" and no Undo

#### Scenario: A viewer cannot open the give sheet
- **WHEN** a member with "Can view" opens `give-dose` directly
- **THEN** `medical` is shown instead of the sheet

### Requirement: Cases
The showcase SHALL have exactly these three cases, in this order, sharing every screen:
- `a`, display code `SC-PET-006-A`, "Invite a sitter": Sam, who finds `members` from `info`. Goal: "You're going away for the weekend. Invite Geo to look after Ginger and let them log her doses."
- `b`, display code `SC-PET-006-B`, "Sitter can look": Geo with "Can view", who finds `medical` from `info`. Goal: "Sam shared Ginger with you. Find out when her last Apoquel was given."
- `c`, display code `SC-PET-006-C`, "Sitter gives the dose": Geo with "Can log doses", who finds `medical` from `info`, with Ginger's evening dose due. Goal: "Sam asked you to give Ginger her evening Apoquel. Give it and record it."

Case A SHALL complete when an invite has been sent. Case B SHALL complete when the reviewer opens `dose-history`. Case C SHALL complete when the dose is given. None SHALL show a completion view.

#### Scenario: Case B goal
- **WHEN** the reviewer in case B opens `dose-history`
- **THEN** the briefing shows "Goal reached"

### Requirement: Briefing
The showcase SHALL provide a description, each case's goal and description, a hint for every screen, an explanation of every screen, and open questions: whether a sitter's access should end by itself after a date (members), whether the owner should be told when the sitter gives a dose (dose card), whether a sitter should be able to add a note about a dose (give sheet), and whether the owner should be able to change a member's access later (members).

#### Scenario: Every key is translated
- **WHEN** any case is briefed
- **THEN** its goal, hints, screen explanations and open questions are all shown as English text, with no raw keys
