## Purpose

Defines the showcase SC-ATT-001 "Sofia's files" in `app-ux-flows`: the Attachments screen of Sofia's pod, where the owner adds, renames, saves and deletes files. Files are flat, with no folders. There is no file storage or picker, so the files and the picking are local mocks. The showcase is for demos and discussion: it has no variants, records no analytics, and carries its own explanations and open questions.

## ADDED Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-att-001`, display code `SC-ATT-001`, title "Sofia's files" and the description "Add, rename, save and delete the files in Sofia's pod. Files sit in one flat list, with no folders." It SHALL have the three cases defined in "Cases". It SHALL be listed after SC-PPL-003. `files` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `files`: the pod's list of files;
- `add`: the list with the add attachment sheet open;
- `actions`: the list with the attachment actions sheet open for one file;
- `rename`: the list with the rename sheet open for one file.

`files` SHALL reference the Figma frame "Attachments" (486:24413), `add` the frame "Add to Files" (486:27195) and `actions` the frame "File actions" (486:27239), in Mee – Tellipod App v4.0.3. `rename` has no frame of its own and SHALL NOT declare one. The referenced frames also show folders, which this showcase does not have.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B of "Sofia's files" on the home page
- **THEN** `files` is shown at `/flows/sc-att-001/files?case=b` with case B's mission card

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Sofia's files" is listed with the code `SC-ATT-001`, its cases `SC-ATT-001-A`, `SC-ATT-001-B` and `SC-ATT-001-C`, and its four screens

### Requirement: Files list
`files` SHALL show the pod top bar with a back control, the avatar letter "S", the title "About Sofia", the subtitle "Attachments", and a menu control, without tabs. The back control and the menu control SHALL do nothing.

At the start of a run the list SHALL hold Sofia's four sample files (`app-ux-flows/attachments`), newest first: "funny-moment.mp4", "photo-Sofia.jpg", "Activities-tracker.xls" and "About Sophia.databook.mc". Each file SHALL be one attachment row showing its kind icon, its name, and its size and date, with a "more actions" control. The list SHALL show no folder rows. An "Add attachment" button with a plus icon SHALL be pinned to the bottom right of the screen. The files SHALL be kept for the rest of the run.

#### Scenario: Starting list
- **WHEN** a reviewer starts any case
- **THEN** the four sample files are listed, newest first, with no folders, and "Add attachment" is at the bottom right

#### Scenario: Open the file actions
- **WHEN** a reviewer activates "More actions for funny-moment.mp4"
- **THEN** `actions` is shown for "funny-moment.mp4"

#### Scenario: Open the add sheet
- **WHEN** a reviewer activates "Add attachment"
- **THEN** `add` is shown

### Requirement: Adding a file
`add` SHALL show the files list with the add attachment sheet open (`app-ux-flows/attachments`), offering "Media file" and "Document" and no "Folder". Dismissing the sheet SHALL show `files` unchanged.

There is no real picker. Choosing "Media file" SHALL add a file named "photo-jul-15.jpg" of 1.5 MB, and choosing "Document" SHALL add a file named "Invoice-june.pdf" of 320 KB. The new file SHALL be added today by the participant, SHALL be the first row of the list, and `files` SHALL be shown. When a file with that name is already in the list, the new file's name SHALL get a number before the extension, such as "photo-jul-15 2.jpg", then "photo-jul-15 3.jpg".

Adding a file SHALL complete case A's run without the completion view, so the briefing shows "Goal reached".

#### Scenario: Add a media file
- **WHEN** a reviewer on `files` activates "Add attachment" and then "Media file"
- **THEN** `files` is shown with "photo-jul-15.jpg" first, "1.5 MB" and today's date, and five files in all

#### Scenario: Add the same file twice
- **WHEN** a reviewer adds a media file twice
- **THEN** the list holds "photo-jul-15 2.jpg" above "photo-jul-15.jpg"

#### Scenario: Dismiss the sheet
- **WHEN** a reviewer opens `add` and dismisses the sheet
- **THEN** `files` is shown with the same four files

### Requirement: File actions
`actions` SHALL show the files list with the attachment actions sheet open for the chosen file (`app-ux-flows/attachments`): "Save to device", "Rename" and "Delete file", and no "Move to a folder". The sheet's description SHALL read "added by you" for files the participant added, and "added by Geo" or "added by Andrew" for files those members added. Dismissing the sheet SHALL show `files` unchanged.

"Save to device" SHALL show `files` with a success toast "Saved to your device" and the file's name as its description. The toast SHALL close on its close control and SHALL NOT change the list. "Rename" SHALL show `rename` for the same file. "Delete file" SHALL remove the file from the list at once, with no confirmation, and show `files`.

Deleting a file SHALL complete case C's run without the completion view.

#### Scenario: Who added it
- **WHEN** a reviewer opens the actions for "photo-Sofia.jpg"
- **THEN** the sheet's title is "photo-Sofia.jpg" and its description is "1.5 MB · Jun 19 · added by Geo"

#### Scenario: Save to device
- **WHEN** a reviewer activates "Save to device" for "funny-moment.mp4"
- **THEN** `files` is shown with the toast "Saved to your device" and "funny-moment.mp4", and the list is unchanged

#### Scenario: Delete a file
- **WHEN** a reviewer activates "Delete file" for "Activities-tracker.xls"
- **THEN** `files` is shown without "Activities-tracker.xls", with three files left and no confirmation step

#### Scenario: Delete the last file
- **WHEN** a reviewer has deleted every file
- **THEN** `files` shows the empty state "No files yet" with the message "Files you add are shared with everyone in this pod." and "Add attachment" is still shown

### Requirement: Renaming a file
`rename` SHALL show the files list with a bottom sheet titled "Rename file" holding a text field labelled "File name", filled with the file's current name, and the actions "Save" and "Cancel". The field SHALL have focus when the sheet opens. "Cancel" and dismissing the sheet SHALL show `files` unchanged.

"Save" SHALL be unavailable while the name, without surrounding spaces, is empty, and while another file in the list already has that name, ignoring letter case; in that case the field SHALL show the error "A file with that name already exists." Pressing Enter SHALL save. Saving SHALL keep the file's size, date and who added it, show the name without surrounding spaces, and show `files`. The row's icon SHALL follow the new name's extension, so renaming "photo-Sofia.jpg" to "photo-Sofia.pdf" changes the icon from image to document. A name saved unchanged SHALL count as saved but SHALL NOT complete the goal.

Saving a different name SHALL complete case B's run without the completion view.

#### Scenario: Rename a file
- **WHEN** a reviewer opens the actions for "About Sophia.databook.mc", activates "Rename", clears the field, types "About Sofia.pdf" and activates "Save"
- **THEN** `files` is shown with "About Sofia.pdf", still "12 KB · Jan 23", in the same place

#### Scenario: Name already taken
- **WHEN** a reviewer types "PHOTO-SOFIA.JPG" as the new name of "funny-moment.mp4"
- **THEN** the error "A file with that name already exists." is shown and "Save" is unavailable

#### Scenario: Empty name
- **WHEN** a reviewer clears the field
- **THEN** "Save" is unavailable and no error is shown

#### Scenario: Cancel
- **WHEN** a reviewer activates "Cancel"
- **THEN** `files` is shown and the file keeps its name

### Requirement: Cases
The showcase SHALL declare these cases. They share every screen and differ only in their goal and notes:

| Case | Code | Name | Goal |
|---|---|---|---|
| `a` | SC-ATT-001-A | Add a file | Add a photo to Sofia's pod. |
| `b` | SC-ATT-001-B | Rename a file | Rename "About Sophia.databook.mc" so it ends in ".pdf". |
| `c` | SC-ATT-001-C | Delete a file | Delete "Activities-tracker.xls" from the pod. |

Case B SHALL complete only when the renamed file is "About Sophia.databook.mc" and its new name ends in ".pdf", ignoring letter case; renaming any other file SHALL NOT complete it. Case C SHALL complete only when "Activities-tracker.xls" is deleted. Case A SHALL complete when "Media file" is chosen, and SHALL NOT complete when "Document" is chosen.

#### Scenario: Case A starts on the list
- **WHEN** a reviewer starts case A
- **THEN** `files` is shown with the four sample files and the mission card "Add a photo to Sofia's pod."

#### Scenario: Wrong file in case C
- **WHEN** a reviewer in case C deletes "funny-moment.mp4"
- **THEN** the run does not complete

#### Scenario: Wrong goal in case A
- **WHEN** a reviewer in case A adds a document
- **THEN** the run does not complete

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- Should a file be deleted without asking first?
- Everyone in the pod can change every file. Is that clear from the screen?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `files` | Every file in one flat list, newest first. The "Add attachment" button is always in reach. | Should the list be sortable, or searchable? |
| `add` | Two kinds of file. Picking is mocked: each choice adds a sample file. | Is it clear what "Media file" and "Document" each include? |
| `actions` | What you can do with one file. Delete takes effect straight away. | Should Delete ask for confirmation? |
| `rename` | Not in the design. A sheet with the current name, kept unique in the pod. | Should the extension be locked? |

**Cases.** Explanations are the case descriptions:

| Case | Explanation | Case questions |
|---|---|---|
| A | The owner shares a new photo with the pod. | none |
| B | The owner fixes a file's name. | none |
| C | The owner removes a file nobody needs. | none |

#### Scenario: Actions notes
- **WHEN** a reviewer in case C is on `actions`
- **THEN** "This screen" shows the actions explanation and its question
