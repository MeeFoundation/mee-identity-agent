# app-ux-flows/showcases/sc-ppl-003 Specification

## Purpose

Defines the showcase SC-PPL-003 "Sofia's pod, shared with me" in `app-ux-flows`. Geo was invited to Bogdan's "About Sofia" pod. They can see its notes and info but can't change them, and can talk in the pod's shared chat, where anyone can ask Telli about the pod. There is no sharing or chat API, so the pod, the chat and Telli's answers are local mocks. The showcase is for demos and discussion: it has no variants, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-ppl-003`, display code `SC-PPL-003`, title "Sofia's pod, shared with me" and the description "Look around a pod someone shared with you: you can read everything and use the chat, but you can't change anything." It SHALL have the two cases defined in "Cases". It SHALL be listed after SC-PPL-002. `notes` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `notes`: the pod's Notes tab;
- `chat`: the pod's Chat tab;
- `info`: the pod's Info tab;
- `contact-info`: Sofia's Contact info;
- `members`: the pod's members.

`info` SHALL reference the Figma frame "Pod - 6" (908-19475) and `members` the frame "Pod - 7" (908-19728), in Mee – Tellipod App v4.0.3, as the owner's screens it is derived from. `chat` SHALL reference the chat components in Mee – Design System v5.2.2 (6473-3081). `notes` and `contact-info` have no frame of their own and SHALL NOT declare one.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B of "Sofia's pod, shared with me" on the home page
- **THEN** `notes` is shown at `/flows/sc-ppl-003/notes?case=b` with case B's mission card

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Sofia's pod, shared with me" is listed with the code `SC-PPL-003`, its cases `SC-PPL-003-A` and `SC-PPL-003-B`, and its five screens

### Requirement: A pod shared with me
The person using the app SHALL be Geo, a member of Bogdan's "About Sofia" pod who can view it. The pod SHALL hold:
- the members Bogdan (owner) and Geo, and Telli, the pod's assistant;
- the note "#family #care", an empty line, a link "Sofia Walker" to her Contact info, and "Piano on Tuesdays";
- Sofia's Contact info: first name Sofia, last name Walker, date of birth April 8, 2018.

No screen SHALL offer a way to change the note, Contact info, forms or members. Controls that would change them SHALL NOT be shown, rather than shown and disabled.

`notes`, `chat` and `info` SHALL show the pod top bar with a back control, the avatar letter "S", the title "About Sofia", the subtitle "Shared by Bogdan" with the People icon, a menu control, and the tabs Notes, Chat and Info with the current tab selected. Activating a tab SHALL show its screen. The back control, the menu control and the subtitle SHALL do nothing.

#### Scenario: Switch tabs
- **WHEN** a reviewer on `notes` activates Chat
- **THEN** `chat` is shown with Chat selected

### Requirement: Read-only notes
`notes` SHALL show the note as the owner's Notes tab shows it (`app-ux-flows/showcases/sc-ppl-001`), with hashtags in the tag colour and the link underlined. The note SHALL NOT be editable: it SHALL show no caret, typing SHALL change nothing, and nothing SHALL be analysed or highlighted. The formatting toolbar SHALL NOT be shown. Activating the "Sofia Walker" link SHALL show `contact-info`.

#### Scenario: Typing does nothing
- **WHEN** a reviewer clicks into the note and types "Loves horses"
- **THEN** the note is unchanged and no caret is shown

#### Scenario: Link opens Contact info
- **WHEN** a reviewer activates the "Sofia Walker" link
- **THEN** `contact-info` is shown

### Requirement: Read-only info
`info` SHALL show the section label "FORMS" and a card with the rows "Contact info" and "Medical", without "Create form". It SHALL then show a divider and the rows "Attachments" with the count 0, "Subpods" with the count 0 and no suggestions, and "Members" with the count 2.

Activating "Contact info" SHALL show `contact-info` and activating "Members" SHALL show `members`. The other rows SHALL do nothing.

`contact-info` SHALL show a top bar with a back control, the avatar, the title "About Sofia" and the subtitle "Contact info", without tabs, and a "Contact info" card with read-only rows First name "Sofia", Last name "Walker" and Date of birth "April 8, 2018". It SHALL NOT offer editing. The back control SHALL go back to the screen it was opened from.

#### Scenario: No way to add forms
- **WHEN** a reviewer opens `info`
- **THEN** there is no "Create form" action and no suggestions badge

### Requirement: Members without invites
`members` SHALL show a top bar with a back control to `info`, the avatar, the title "About Sofia" and the subtitle "Members" followed by the count 2 in a badge, without tabs. It SHALL list, in this order:
1. "Bogdan", with the letter avatar "B" and the line "Owner";
2. "Geo (You)", with the letter avatar "G", an online dot and the line "Can view";
3. "Telli", with Telli's avatar and the line "Assistant".

The rows SHALL NOT be interactive and SHALL NOT show a chevron. There SHALL be no "Invite member" button and no pending invites.

Showing `members` SHALL complete case A's run without the completion view, so the briefing shows "Goal reached".

#### Scenario: Who else is here
- **WHEN** a reviewer in case A opens `members` from `info`
- **THEN** Bogdan, Geo (You) and Telli are listed, there is no "Invite member", and the briefing shows "Goal reached"

### Requirement: Shared chat
`chat` SHALL show the pod's chat, which every member shares, built from the design system's chat components (Mee – Design System v5.2.2, 6473-3081). At the start of a run it SHALL show, from top to bottom:
1. the day notice "Yesterday";
2. a message from Bogdan at 6:40 PM: "I set up this pod for Sofia. Everything we know is in the notes.";
3. the notice "Geo joined";
4. a message from Bogdan at 6:42 PM: "Welcome, Geo! Ask Telli if you can't find something.".

Messages from others SHALL show the author's avatar, their name and the time. Geo's own messages SHALL be on the right, without a name. Telli's messages SHALL show Telli's avatar and the name "Telli". The newest message SHALL be just above the composer.

The composer SHALL have the placeholder "Ask Telli…", a "+" control that does nothing, and a send control that is unavailable while the text, without surrounding spaces, is empty. Pressing Enter SHALL send. Sending SHALL add Geo's message with the current time and clear the composer. The chat SHALL be kept for the rest of the run.

#### Scenario: Send a message
- **WHEN** a reviewer types "Thanks!" and sends it
- **THEN** "Thanks!" is shown as Geo's message with the current time, and the composer is empty

### Requirement: Mocked Telli
After Geo sends a message, Telli SHALL answer it when the message, ignoring case:
- mentions "piano": "Sofia has piano on Tuesdays. That's from her notes.";
- mentions "born", "birthday" or "how old": "Sofia was born on April 8, 2018. That's from her Contact info.";
- mentions "last name", "surname" or "full name": "Her full name is Sofia Walker. That's from her Contact info.";
- matches none of these and ends with "?": "I couldn't find that in Sofia's pod. Bogdan might know.".

The first matching rule SHALL apply. Telli SHALL NOT answer other messages. Before answering, the line "Telli is typing…" SHALL be shown for about 1 second. Telli SHALL NOT call any service. An answer SHALL arrive even if the reviewer leaves `chat` while Telli is typing.

The first answer taken from the pod (not the "couldn't find" answer) SHALL complete case B's run without the completion view.

#### Scenario: Ask Telli
- **WHEN** a reviewer in case B sends "When does Sofia have piano?"
- **THEN** "Telli is typing…" is shown, then Telli answers "Sofia has piano on Tuesdays. That's from her notes.", and the briefing shows "Goal reached"

#### Scenario: Telli doesn't know
- **WHEN** a reviewer sends "What's her favourite food?"
- **THEN** Telli answers "I couldn't find that in Sofia's pod. Bogdan might know." and the run does not complete

#### Scenario: Talking to people
- **WHEN** a reviewer sends "Thanks!"
- **THEN** Telli does not answer

### Requirement: Cases
The showcase SHALL declare these cases. They share every screen and differ only in their goal and notes:

| Case | Code | Name | Goal |
|---|---|---|---|
| `a` | SC-PPL-003-A | Look around | Bogdan shared Sofia's pod with you. Find out who else is in it. |
| `b` | SC-PPL-003-B | Ask Telli | Ask Telli when Sofia has piano. |

#### Scenario: Case A starts on the notes
- **WHEN** a reviewer starts case A
- **THEN** `notes` is shown with Notes selected and the note can't be edited

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- Is it clear that you can't change anything here? Nothing says so.
- What should happen when someone tries to edit the notes?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `notes` | The owner's notes, read-only. No toolbar, no caret, no Tidy. | Should the notes say they are read-only, or who can edit them? |
| `chat` | One chat for everyone in the pod. Anyone can ask Telli about what the pod holds. | Should Telli say where an answer came from? |
| `info` | Forms and categories without "Create form" or suggestions. | Should members see Subpods and Attachments at all? |
| `contact-info` | Sofia's details, read-only. | none |
| `members` | Who else is in the pod. Only the owner can invite. | Should members see pending invites? Right now they don't. |

**Cases.** Explanations are the case descriptions:

| Case | Explanation | Case questions |
|---|---|---|
| A | Geo opens the pod for the first time. | none |
| B | Geo asks Telli instead of reading the notes. | none |

#### Scenario: Chat notes
- **WHEN** a reviewer in case B is on `chat`
- **THEN** "This screen" shows the chat's explanation and its two questions
