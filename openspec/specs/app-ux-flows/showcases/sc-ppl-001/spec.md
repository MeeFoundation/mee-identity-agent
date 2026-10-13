# app-ux-flows/showcases/sc-ppl-001 Specification

## Purpose

Defines the showcase SC-PPL-001 "Tidy Sofia's notes" in `app-ux-flows`. A person writes free-form notes about Sofia in her pod. The app recognises lines that are contact details, highlights them and offers "Tidy". Tidying moves the details into Sofia's Contact info and leaves a link to it in the note. There is no recognition API yet, so recognition is a deterministic local mock. The showcase is for demos and discussion: it has no variants, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-ppl-001`, display code `SC-PPL-001`, title "Tidy Sofia's notes" and the description "Write about Sofia in her pod's notes, and let Tidy turn the details it recognises into her Contact info." It SHALL have the three cases defined in "Cases". It SHALL be listed after the existing flows.

The flow SHALL declare these screens:
- `notes`: the pod's Notes tab before anything was tidied in the run, including while a Tidy suggestion is shown;
- `tidy-confirm`: the Tidy confirmation sheet;
- `notes-tidied`: the Notes tab after a Tidy was confirmed in the run, including while a later suggestion is shown;
- `contact-info`: the pod's Info tab with Sofia's Contact info.

`notes` SHALL be the initial screen in every case. Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame | Node |
|---|---|---|
| `notes` | Pod / Notes - 3 - 3 | 975-19788 |
| `tidy-confirm` | Modal | 975-20740 |
| `notes-tidied` | Pod / Notes - 3 - 4 | 975-20502 |

`contact-info` has no Figma frame and SHALL NOT declare one. The typing states "Pod / Notes - 3 - 1" (975-19350) and "Pod / Notes - 3 - 2" (975-20094) are part of `notes`. The prototype SHALL NOT draw the on-screen keyboard shown in the frames.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B of "Tidy Sofia's notes" on the home page
- **THEN** `notes` is shown at `/flows/sc-ppl-001/notes?case=b` with case B's mission card

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Tidy Sofia's notes" is listed with the code `SC-PPL-001`, its cases `SC-PPL-001-A` to `SC-PPL-001-C`, and the screens `notes`, `tidy-confirm`, `notes-tidied` and `contact-info`

### Requirement: Sofia's pod
Every screen SHALL show the pod top bar with:
- a back control;
- the avatar letter "S", the title "About Sofia" and the breadcrumb "People > Immediate Family" with the People icon;
- a menu control;
- the tabs Notes, Chat and Info.

Notes SHALL be selected on `notes`, `notes-tidied` and behind `tidy-confirm`, and Info SHALL be selected on `contact-info`. Activating Info SHALL show `contact-info`. Activating Notes SHALL show `notes-tidied` if a Tidy was confirmed in the run, and `notes` otherwise. The back control, the menu control and the Chat tab SHALL do nothing.

The pod SHALL hold one Contact info record for Sofia, with the optional fields first name, last name, date of birth and email. That record SHALL be the only place these values are kept. The note and the confirmation sheet SHALL show them as projections of it.

#### Scenario: Info tab
- **WHEN** a reviewer on `notes` activates Info
- **THEN** `contact-info` is shown with Info selected

### Requirement: Note
`notes` and `notes-tidied` SHALL show the note and the formatting toolbar from the Notes tab of the other pod flows. The toolbar buttons SHALL do nothing. The note SHALL consist of editable text and, possibly, links to Sofia's Contact info. Hashtags such as "#family" SHALL be shown in the tag colour. Typing SHALL be possible anywhere in the text. A link SHALL NOT be editable, and activating it SHALL show `contact-info`. The note SHALL be kept for the rest of the run.

#### Scenario: Link opens Contact info
- **WHEN** a reviewer activates the "Sofia Walker" link in the note
- **THEN** `contact-info` is shown

### Requirement: Mocked recognition
The note SHALL be analysed 1.5 seconds after the last change to its text. It SHALL NOT be analysed when a screen opens. Any change to the text SHALL immediately remove the current highlights and Tidy action, and start a new 1.5-second wait.

Analysis SHALL look at each line of the note's text on its own. It SHALL recognise:
- a line that is the person's full name, "Sofia Walker" (case and surrounding spaces ignored), which gives first name "Sofia" and last name "Walker";
- a line that is "Born" followed by a date written MM/DD/YYYY, read as a US date, which gives the date of birth;
- a line that contains an email address, which gives the email: the address alone, without the rest of the line.

A recognised line is **known** when every value it gives equals the value already in Sofia's Contact info, and **new** otherwise. Analysis SHALL NOT call any service.

When at least one line is recognised, `notes` and `notes-tidied` SHALL highlight each recognised line, known lines in the warning tone (yellow) and new lines in the brand tone (teal-blue), and SHALL show a "Tidy" action below the last recognised line. When no line is recognised, nothing SHALL be highlighted and no Tidy action SHALL be shown. A suggestion SHALL NOT be dismissible other than by editing the text.

#### Scenario: Suggestion after a pause
- **WHEN** a reviewer in case A types "email sofiawalker18@gmail.com" on a new line and stops typing
- **THEN** after 1.5 seconds "Sofia Walker", "Born 04/08/2018" and the email line are highlighted in the brand tone, and "Tidy" is shown below the email line

#### Scenario: Only the new line is offered
- **WHEN** a reviewer in case B types "Sofia email: sofia@example.com" below "Piano on Tuesdays" and stops typing
- **THEN** only the email line is highlighted, in the brand tone, and "Tidy" is shown below it

#### Scenario: Known line
- **WHEN** a reviewer in case B types "Born 04/08/2018" on a new line and stops typing
- **THEN** that line is highlighted in the warning tone, because Contact info already holds that date of birth

#### Scenario: Typing clears the suggestion
- **WHEN** a suggestion is shown and the reviewer types another character
- **THEN** the highlights and "Tidy" disappear at once, and the note is analysed again 1.5 seconds after typing stops

#### Scenario: Nothing recognised
- **WHEN** a reviewer in case C types "Loves horses" and stops typing
- **THEN** nothing is highlighted and no Tidy action is shown

#### Scenario: US date
- **WHEN** the line "Born 04/08/2018" is recognised
- **THEN** the date of birth is April 8, 2018

### Requirement: Tidy confirmation
Activating "Tidy" SHALL show `tidy-confirm`, a bottom sheet over the note it was opened from. The note SHALL lose focus, as a phone keyboard closes when a sheet opens. The sheet SHALL show:
- when the note has no link to Contact info, the title "Convert the selected notes to Contact info?";
- when the note already has a link, the title "Add to Sofia Walker's Contact info?" and the description "The new details are added to what Sofia Walker's Contact info already holds. You can change any of them first." The name SHALL come from Contact info;
- a "Contact info" card with a row for every field that will have a value after tidying, in the order First name, Last name, Date of birth, Email. Each row SHALL show the value Contact info will hold. Dates SHALL be shown as "April 8, 2018";
- a "NEW" badge on every row whose value comes from a new line;
- an edit control on every row;
- a "Tidy notes" button.

Activating a row's edit control SHALL replace the row with an inline editor holding the row's value, a date input for Date of birth and a text input otherwise, with "Save" and "Cancel". Save SHALL be unavailable while the value is empty or unchanged. Saving SHALL show the edited value in the row, and "Tidy notes" SHALL then write the edited value into Contact info instead. Cancel SHALL leave the row as it was. One row SHALL be edited at a time. Edits SHALL only exist while the sheet is open: dismissing the sheet discards them, and activating "Tidy" again starts without them.

Dismissing the sheet, by tapping outside it or pressing Escape, SHALL go back to the note with the suggestion still shown and nothing changed. When `tidy-confirm` is opened with nothing recognised, for example by a direct link in a new run, `notes` SHALL be shown instead.

#### Scenario: New contact
- **WHEN** a reviewer in case A activates "Tidy" after adding the email
- **THEN** the sheet asks "Convert the selected notes to Contact info?" and shows First name "Sofia", Last name "Walker", Date of birth "April 8, 2018" and Email "sofiawalker18@gmail.com", all with "NEW"

#### Scenario: Update through the link
- **WHEN** a reviewer in case B adds "Sofia email: sofia@example.com" and activates "Tidy"
- **THEN** the sheet asks "Add to Sofia Walker's Contact info?", explains that the new details are added to what she already has, and shows First name "Sofia", Last name "Walker" and Date of birth "April 8, 2018" without "NEW", and Email "sofia@example.com" with "NEW"

#### Scenario: Change a value before tidying
- **WHEN** a reviewer in case B edits Date of birth to May 9, 2018 in the sheet, saves it and activates "Tidy notes"
- **THEN** `contact-info` shows Date of birth "May 9, 2018" and Email "sofia@example.com"

#### Scenario: Edits are discarded with the sheet
- **WHEN** a reviewer edits a value in the sheet, dismisses the sheet and activates "Tidy" again
- **THEN** the sheet shows the values without the edit

#### Scenario: Dismiss
- **WHEN** a reviewer dismisses the sheet
- **THEN** the note is shown with the same highlights and Tidy action, and Contact info is unchanged

### Requirement: Tidying
Activating "Tidy notes" SHALL:
1. write every recognised value into Sofia's Contact info, replacing any value already there;
2. remove the recognised lines from the note, leaving at most one empty line where they were;
3. when the note had no link to Contact info, insert a link labelled with Sofia's full name from Contact info ("Sofia Walker") where the first recognised line was;
4. when the note already had a link, add no new link and highlight the existing link briefly (about one second) to show where the lines went;
5. show `notes-tidied` and complete the run without the completion view, so the briefing shows "Goal reached".

Tidy SHALL NOT be undoable. Tidy MAY be used again later in the run. Each later use SHALL follow the same steps.

#### Scenario: Lines become a link
- **WHEN** a reviewer in case A confirms "Tidy notes"
- **THEN** `notes-tidied` shows "#family #care", then the link "Sofia Walker" in place of the three lines, and the briefing shows "Goal reached"

#### Scenario: Line joins the existing link
- **WHEN** a reviewer in case B confirms "Tidy notes" after adding "Sofia email: sofia@example.com"
- **THEN** the email line is gone, the note still has exactly one "Sofia Walker" link, the link is briefly highlighted, "Piano on Tuesdays" is unchanged, and Contact info's Email is "sofia@example.com"

### Requirement: Contact info
`contact-info` SHALL show a "Contact info" card with read-only rows for every field of Sofia's Contact info that has a value, in the order First name, Last name, Date of birth, Email. When no field has a value, the card SHALL show "No contact info yet." The screen SHALL NOT offer editing.

#### Scenario: After tidying
- **WHEN** a reviewer in case A tidies the note and opens the link
- **THEN** `contact-info` shows Sofia, Walker, April 8, 2018 and the email they typed

### Requirement: Cases
The showcase SHALL declare these cases. They share every screen and differ only in their starting Contact info, starting note, goal and notes (description and questions):

| Case | Code | Name | Contact info at start | Note at start | Goal |
|---|---|---|---|---|---|
| `a` | SC-PPL-001-A | New contact | empty | "#family #care", empty line, "Sofia Walker", "Born 04/08/2018" | Add Sofia's email to her notes, then tidy the notes into her Contact info. |
| `b` | SC-PPL-001-B | Update through the link | Sofia, Walker, April 8, 2018 | "#family #care", empty line, the "Sofia Walker" link, "Piano on Tuesdays" | Add a line "Sofia email: …" to her notes, then tidy it into her Contact info. |
| `c` | SC-PPL-001-C | Nothing to tidy | empty | "#family #care", empty line, "Piano on Tuesdays", "Hates broccoli" | Add something about Sofia's hobbies to her notes. |

Case C SHALL never complete by itself, because nothing in its goal can be tidied.

#### Scenario: Case B starts with a link
- **WHEN** a reviewer starts case B
- **THEN** `notes` shows the "Sofia Walker" link and "Piano on Tuesdays", and nothing is highlighted

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- How do we add new information to a contact that already exists, through notes? Case B shows one answer.
- Should Tidy be reversible? Right now it can't be undone.
- Should notes be analysed while typing, or only once a line is finished?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `notes` | Sofia's notes. After a short pause in typing, lines that look like contact details are highlighted and Tidy is offered. | Can a suggestion be dismissed? Right now it can't. · Is it clear what the yellow and blue highlights mean? · Is a 1.5-second pause right before suggestions appear? |
| `tidy-confirm` | Shows the Contact info that tidying will produce. "NEW" marks values that come from the note, and any value can be changed before tidying. | What should happen when a recognised value conflicts with a saved one, such as another date of birth? Right now the note wins. · Is it clear that the details can be changed here before tidying? · Is "Tidy notes" clear as the confirm action? |
| `notes-tidied` | The recognised lines have moved into Contact info, and the link leads there. | Is it obvious that the link opens Contact info? · Is it clear that the lines were moved, not deleted? |
| `contact-info` | Sofia's Contact info, the single place these details live. The note only links to it. | Should Contact info show where each value came from? |

**Cases.** Explanations are the case descriptions:

| Case | Explanation | Case questions | Screen additions |
|---|---|---|---|
| A | Sofia's Contact info is empty, so every recognised line is new. | none | none |
| B | The note already links to Sofia's Contact info. A new line is added to that contact and disappears from the note. | Does a line need Sofia's name ("Sofia email: …") to be added to her contact? What about "email: …" alone? | `tidy-confirm`: question "Is it clear which details are new and which Sofia already had?" · `notes-tidied`: explanation "The new line was added to the existing link, which lights up briefly." and questions "When the line disappears, is it clear that it went into "Sofia Walker"?" and "Do we need the link to light up?" |
| C | Nothing in the note is recognised, so nothing is highlighted and Tidy is never offered. | Is it fine that nothing at all happens here? | none |

#### Scenario: Case B on notes-tidied
- **WHEN** a reviewer in case B is on `notes-tidied`
- **THEN** "This screen" shows case B's explanation of `notes-tidied` and four questions: the flow's two followed by case B's two
