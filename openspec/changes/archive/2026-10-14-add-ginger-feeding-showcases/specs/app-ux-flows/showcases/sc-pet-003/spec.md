## Purpose

Defines the showcase SC-PET-003 "Care instructions" in `app-ux-flows`. It shows how Ginger's free-text care and feeding instructions are written by her owner, read and followed by someone looking after her, answered by Telli, and turned into a feeding schedule. The showcase is for demos and discussion: it has cases instead of variants, records no analytics, and carries its own explanations and open questions.

## ADDED Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-003`, display code `SC-PET-003` and title "Care instructions", listed after `sc-pet-002`. It SHALL have the four cases defined in "Cases". `info` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `info`: Ginger's Info tab with the Care & Feeding row;
- `care-feeding`: Ginger's Care & Feeding screen;
- `edit-instructions`: the instructions editor;
- `schedule-sheet`: the "Set up a feeding schedule" sheet over `care-feeding`;
- `feed-meal`: the "Record meal" sheet over `care-feeding`;
- `undo-meal`: the undo sheet over `care-feeding`;
- `feeding-history`: Ginger's feeding history;
- `chat`: Ginger's pod chat.

The flow SHALL declare no Figma frames.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case C on the home page
- **THEN** the flow starts on `info` with the briefing for "Ask Telli"

### Requirement: Fixture
Every case SHALL start from Ginger's pod. In cases A and D the participant is Ginger's owner and the only member. In cases B and C the pod is owned by Alice and shared with the participant, so it has two members, Alice and the participant ("You").

Wherever the instructions are filled in, they SHALL read exactly: "Fed twice daily, 7am and 6pm: half a cup of dry food (Purina Pro Plan) plus a spoonful of wet food. Fresh water bowl refilled daily. Sleeps in a cat bed in Alice's bedroom. Litter box is in the laundry room and is scooped daily."

| Case | Instructions | Feeding schedule | Today's meals and history |
|---|---|---|---|
| A | empty | none | none |
| B, C | filled in | Breakfast 7:00 AM, Dinner 6:00 PM | yes |
| D | filled in | none | none |

In cases B and C, times SHALL be set relative to the run's start: Dinner is scheduled 10 minutes before the run and not fed; Breakfast is 11 hours earlier, fed by the participant 5 minutes after its time, all eaten. Each meal's portion is "Half a cup of dry food, a spoonful of wet food". The feeding history SHALL hold breakfast and dinner for each of the 6 days before today: the participant fed them for the last 3 days and Alice before that, with one dinner missed and one breakfast about half eaten.

No screen SHALL fetch data.

#### Scenario: Sitter's pod
- **WHEN** case B starts
- **THEN** `info` shows Members 2 and Care & Feeding 2, and `care-feeding` shows today's meals and the instructions with no "Edit" action

### Requirement: Info and the pod top bar
`info` and `chat` SHALL show the Ginger pod top bar with Notes, Chat and Info tabs. Info and Chat SHALL switch between `info` and `chat`; Notes, back, the breadcrumb and the menu control SHALL do nothing.

`info` SHALL show a "Forms" section with the Pet form row, a divider, and the category rows Medical, Care & Feeding, Attachments 0, Subpods 0 and Members, in this order. Care & Feeding SHALL show the number of scheduled meals as its count. Activating Care & Feeding SHALL show `care-feeding`; every other row SHALL do nothing.

#### Scenario: Open Care & Feeding
- **WHEN** a reviewer in case A activates the Care & Feeding row
- **THEN** `care-feeding` is shown, with a top bar titled "Care & Feeding" and the trail "Ginger"

### Requirement: Care & Feeding screen
`care-feeding` SHALL show a top bar with back to `info`, the title "Care & Feeding" and the trail "Ginger". Below it, in this order:
- when today's meals exist, a "Today" section with one meal card per meal, followed by a "Feeding history" row;
- otherwise, when a feeding schedule exists, a "Schedule" section listing each meal by name and time ("Breakfast · 7:00 AM", "Dinner · 6:00 PM");
- an "Instructions" section with the instructions text, or, when they are empty, the empty state "No care instructions yet" with a "Write instructions" action.

Meal cards SHALL behave as in SC-PET-004: a heading from the meal's status ("Due at {time}", "Due now", "Overdue · due at {time}", "Fed · {time} · {member}", with the amount eaten unless all was eaten), "Mark as fed" on a due or overdue meal, which shows `feed-meal`, and "Undo" on a meal the participant fed, which shows `undo-meal`. Every member, owner or not, SHALL be able to mark meals as fed and undo their own.

The "Feeding history" row SHALL show "Last fed {day} {time} · {member}" and SHALL show `feeding-history`.

#### Scenario: Empty instructions
- **WHEN** case A reaches `care-feeding`
- **THEN** the empty state "No care instructions yet" with "Write instructions" is shown, and there is no Today or Schedule section

### Requirement: Only the owner changes the instructions
For the owner, the Instructions section SHALL offer "Edit", which shows `edit-instructions`, and an empty Instructions section SHALL offer "Write instructions". For a member who is not the owner, the instructions SHALL be read-only: no "Edit", no "Write instructions" and no schedule suggestion.

#### Scenario: Sitter can't edit
- **WHEN** a reviewer in case B opens `care-feeding`
- **THEN** the instructions are shown with no "Edit" action, while Dinner still offers "Mark as fed"

### Requirement: Writing instructions
`edit-instructions` SHALL show a top bar titled "Instructions" with "Cancel" and "Save", and a multi-line text field holding the current instructions with the placeholder "How to feed and look after Ginger". "Save" SHALL be disabled while the text is empty or only whitespace. "Save" SHALL store the text, return to `care-feeding` and show the toast "Care instructions saved". "Cancel" and browser back SHALL return to `care-feeding` with nothing changed. For a member who is not the owner, `edit-instructions` SHALL show `care-feeding` instead of the editor.

#### Scenario: Write the instructions
- **WHEN** a reviewer in case A activates "Write instructions", types "Dry food twice a day", and activates "Save"
- **THEN** `care-feeding` shows "Dry food twice a day" under Instructions with the toast "Care instructions saved", and the run completes without a completion view

#### Scenario: Cancel editing
- **WHEN** a reviewer types in `edit-instructions` and activates "Cancel"
- **THEN** `care-feeding` shows the instructions as they were, with no toast

### Requirement: Meal times recognised in the instructions
For the owner, while no feeding schedule exists, `care-feeding` SHALL recognise clock times written as an hour with "am" or "pm", optionally with minutes ("7am", "6 pm", "7:30am"). Each recognised time SHALL be highlighted in the instructions text. A time before noon SHALL be named "Breakfast", a time from noon until 4 pm "Lunch", and a later time "Dinner". When at least one time is recognised, a Telli suggestion SHALL be shown above the Instructions section: "Found {count} meal times. Set up a feeding schedule?" with "Set up schedule", which shows `schedule-sheet`. When no time is recognised, neither highlights nor the suggestion SHALL be shown.

#### Scenario: Two meal times
- **WHEN** case D starts and the reviewer opens `care-feeding`
- **THEN** "7am" and "6pm" are highlighted, and the suggestion reads "Found 2 meal times. Set up a feeding schedule?"

#### Scenario: No times
- **WHEN** a reviewer in case A saves "Dry food twice a day"
- **THEN** no text is highlighted and no schedule suggestion is shown

### Requirement: Schedule sheet
`schedule-sheet` SHALL show "Set up Ginger's feeding schedule?", one row per recognised meal ("Breakfast · 7:00 AM", "Dinner · 6:00 PM"), a primary "Set up schedule" and "Not now". "Set up schedule" SHALL create the schedule, return to `care-feeding` with the Schedule section shown, the highlights and suggestion gone, and the toast "Feeding schedule set up". "Not now", dismissing and browser back SHALL return to `care-feeding` with nothing changed. When there is nothing to schedule, `schedule-sheet` SHALL show `care-feeding` instead of the sheet.

#### Scenario: Set up the schedule
- **WHEN** a reviewer in case D activates "Set up schedule" on the suggestion and then on the sheet
- **THEN** `care-feeding` lists "Breakfast · 7:00 AM" and "Dinner · 6:00 PM" under Schedule with the toast "Feeding schedule set up", `info` shows Care & Feeding with count 2, and the run completes without a completion view

#### Scenario: Not now
- **WHEN** a reviewer in case D opens the sheet and activates "Not now"
- **THEN** `care-feeding` still shows the highlights and the suggestion, with no Schedule section

### Requirement: Meal sheets
`feed-meal` SHALL show "Record Ginger's {meal}?", the meal and portion, "Scheduled: now" for a due meal or "Scheduled: {time}" otherwise, "How much did she eat?" with All, About half, A little and None, with All selected, a primary "Mark as fed" and "Cancel". "Mark as fed" SHALL record the meal as fed by the participant now with the selected amount, return to `care-feeding` and show the toast "{Meal} marked as fed".

`undo-meal` SHALL show "Undo Ginger's {meal}?", the meal and portion, "Fed {day} {time} · You", a destructive "Mark as not fed" and "Keep as fed". "Mark as not fed" SHALL return the meal to due or overdue, clear its amount, return to `care-feeding` and show the toast "{Meal} marked as not fed".

"Cancel", "Keep as fed", dismissing and browser back SHALL return to `care-feeding` with nothing changed. A sheet that no longer applies to its meal SHALL show `care-feeding` instead.

#### Scenario: Sitter feeds dinner
- **WHEN** a reviewer in case B activates "Mark as fed" on Dinner and confirms with All selected
- **THEN** Dinner shows "Fed · {time} · You" with "Undo", the toast "Dinner marked as fed" is shown, and the run completes without a completion view

### Requirement: Feeding history
`feeding-history` SHALL show a top bar titled "Feeding history" with the trail "Care & Feeding" and back. Below it, the meals of the last 7 days, today included, SHALL be listed newest first, grouped under day labels ("Today", "Yesterday", then e.g. "Mon, Oct 12"). Today's meals SHALL be listed under "Today" and each earlier day SHALL hold that day's meals, at whatever hour the run starts, even when a meal time relative to the run falls on the previous calendar date. Each row SHALL show the meal name and either "Fed {time} · {member}", followed by " · ate about half", " · ate a little" or " · ate none" unless all was eaten, or "Missed · scheduled {time}". Today's meals SHALL be listed only once fed, and a second feeding of a meal SHALL be its own row, "Fed again {time} · {member}".

#### Scenario: History after feeding dinner
- **WHEN** a reviewer in case B feeds Dinner and opens `feeding-history`
- **THEN** "Today" lists Dinner fed by You and Breakfast fed by You, and earlier days list Alice's and the participant's meals, including one missed dinner

### Requirement: Pod chat with Telli
`chat` SHALL show Ginger's pod chat. In cases B and C it SHALL start with Alice's message "Thanks for looking after Ginger this week!"; in cases A and D it SHALL start empty. A message the participant sends SHALL be shown as theirs with the current time, and the composer SHALL be cleared.

After a short typing indicator, Telli SHALL answer:
- a message about feeding (mentioning feed, food, eat, meal, breakfast, dinner or "how much" as whole words, so "great" or "weather" don't count) with "Ginger eats twice a day, at 7am and 6pm: half a cup of dry food (Purina Pro Plan) plus a spoonful of wet food. It's in Care & Feeding.", where "Care & Feeding" is a link that opens `care-feeding`;
- any other message ending with "?" with "I couldn't find that in Ginger's pod.";
- nothing otherwise.

#### Scenario: Ask Telli
- **WHEN** a reviewer in case C sends "How much does Ginger eat at dinner?"
- **THEN** Telli answers with the feeding answer, and the run completes without a completion view

#### Scenario: Open Care & Feeding from Telli's answer
- **WHEN** a reviewer taps "Care & Feeding" in Telli's feeding answer
- **THEN** `care-feeding` is shown, and back returns to `chat`

#### Scenario: Unrelated question
- **WHEN** a reviewer in case C sends "Does Ginger like toys?"
- **THEN** Telli answers "I couldn't find that in Ginger's pod." and the run is not completed

### Requirement: Cases
The showcase SHALL have exactly these four cases, in this order. Each case's run SHALL complete once, without a completion view, when its goal is reached:

| Case | Code | Name | Goal | Completes when |
|---|---|---|---|---|
| `a` | SC-PET-003-A | Write | Write down how Ginger should be fed, so whoever looks after her knows. | the instructions are saved |
| `b` | SC-PET-003-B | Feed as sitter | You're looking after Ginger while Alice is away. Check how much she eats, then feed her dinner and record it. | a meal is recorded on `feed-meal` |
| `c` | SC-PET-003-C | Ask Telli | You're looking after Ginger. Ask Telli how much she eats. | Telli gives the feeding answer |
| `d` | SC-PET-003-D | Tidy into schedule | Turn Ginger's feeding instructions into a feeding schedule. | the schedule is set up |

#### Scenario: Feed as sitter
- **WHEN** a reviewer in case B opens Care & Feeding from `info`, reads the instructions and records Dinner
- **THEN** the briefing shows "Goal reached"

### Requirement: Briefing
The showcase SHALL provide a description, each case's goal and description, a hint for every screen, an explanation of every screen, and open questions:
- flow: should the instructions stay free text, or become a form with fields?
- case A: what should the empty state suggest writing?
- case B: should the feeding history show meals from before the sitter joined?
- case C: should Telli quote the instructions or link to them?
- case D: what should happen to the instructions text once the schedule exists?
- `care-feeding`: should the schedule and the instructions be one section or two?
- `schedule-sheet`: should meal names and times be editable before setting up?

The explanation of `care-feeding` SHALL say that only the owner can change the instructions, while every member can record meals.

#### Scenario: Every key is translated
- **WHEN** any case is briefed
- **THEN** its goal, hints, screen explanations and open questions are all shown as English text, with no raw keys
