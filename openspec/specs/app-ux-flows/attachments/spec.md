# app-ux-flows/attachments Specification

## Purpose

Defines how `app-ux-flows` pods present attached files: what an attachment records, how its type, size and date are shown, and the sheets for adding a file and acting on one. Flows build attachments screens from these pieces.

## Requirements

### Requirement: Attachment record
An attachment SHALL record its file name, its size in bytes, when it was added and which pod member added it. Attachments SHALL not belong to folders.

#### Scenario: Sample attachments
- **WHEN** a flow uses the sample attachments for Sofia's pod
- **THEN** it gets "funny-moment.mp4" (10 MB, added Aug 7), "photo-Sofia.jpg" (1.5 MB, Jun 19), "Activities-tracker.xls" (143 KB, May 11) and "About Sophia.databook.mc" (12 KB, Jan 23), each with the member who added it

### Requirement: File kind from the file name
Each attachment SHALL have a file kind derived from the extension of its file name, ignoring letter case: video, image, spreadsheet or document. Common video extensions (such as mp4, mov) SHALL be video, common image extensions (such as jpg, jpeg, png, heic) SHALL be image, common spreadsheet extensions (such as xls, xlsx, csv, numbers) SHALL be spreadsheet, and every other or missing extension SHALL be document. The attachment row SHALL show a different icon for each kind.

#### Scenario: Known kinds
- **WHEN** attachments are named "funny-moment.mp4", "photo-Sofia.JPG" and "Activities-tracker.xls"
- **THEN** their kinds are video, image and spreadsheet

#### Scenario: Unknown extension
- **WHEN** an attachment is named "About Sophia.databook.mc" or has no extension
- **THEN** its kind is document

### Requirement: Attachment detail line
The attachment row SHALL show the file size and the date the file was added, separated by " · ", such as "10 MB · Aug 7". The size SHALL use decimal units (1 KB = 1000 bytes) in the current language: B under 1 KB, then KB, MB and GB, with one decimal below 10 and whole numbers from 10 up, dropping a trailing ".0". The date SHALL show the short month and day in the current language, and SHALL also show the year when it is not the current year.

#### Scenario: Sizes
- **WHEN** attachments are 10,000,000, 1,500,000, 143,000 and 512 bytes
- **THEN** their sizes are shown as "10 MB", "1.5 MB", "143 KB" and "512 B"

#### Scenario: Date this year
- **WHEN** an attachment of 10 MB was added on Aug 7 of the current year
- **THEN** its row shows "10 MB · Aug 7"

#### Scenario: Date in another year
- **WHEN** an attachment of 12 KB was added on Jan 23 of the previous year
- **THEN** its row shows the year as well, such as "12 KB · Jan 23, 2025"

### Requirement: Add attachment sheet
The pod SHALL provide an add attachment sheet: a bottom sheet titled "Add to Files" with the description "Everyone in this pod can see it, add to it, and change it.", offering a "Media file" action with an image icon and a "Document" action with a document icon. It SHALL not offer a folder option. Activating an action SHALL run the flow's handler for it, and dismissing the sheet SHALL run the flow's dismiss action.

#### Scenario: Options offered
- **WHEN** the add attachment sheet is open
- **THEN** it offers exactly "Media file" and "Document", and no "Folder" option

#### Scenario: Choosing an option
- **WHEN** a participant activates "Document" in the add attachment sheet
- **THEN** only the flow's document handler runs

### Requirement: Attachment actions sheet
The pod SHALL provide an attachment actions sheet for one attachment: a bottom sheet titled with the file name and described by the file size, the date it was added and who added it, separated by " · ", such as "10 MB · Aug 7 · added by you". It SHALL read "added by you" when the participant added the file and "added by <name>" otherwise. It SHALL offer "Save to device", "Rename" and, in the danger tone, "Delete file", and SHALL not offer a "Move to a folder" action. Activating an action SHALL run only the flow's handler for it, and dismissing the sheet SHALL run the flow's dismiss action.

#### Scenario: Added by the participant
- **WHEN** the actions sheet is open for "funny-moment.mp4", 10 MB, added on Aug 7 of the current year by the participant
- **THEN** its title is "funny-moment.mp4" and its description is "10 MB · Aug 7 · added by you"

#### Scenario: Added by another member
- **WHEN** the actions sheet is open for an attachment that Anna added
- **THEN** its description ends with "added by Anna"

#### Scenario: Actions offered
- **WHEN** the attachment actions sheet is open
- **THEN** it offers "Save to device", "Rename" and "Delete file" in that order, "Delete file" is red, and there is no "Move to a folder" action

#### Scenario: Deleting runs the flow's handler directly
- **WHEN** a participant activates "Delete file"
- **THEN** the flow's delete handler runs, with no confirmation step added by the sheet
