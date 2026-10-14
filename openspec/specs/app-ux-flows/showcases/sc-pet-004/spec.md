# app-ux-flows/showcases/sc-pet-004 Specification

## Purpose

Defines the showcase SC-PET-004 "Meals" in `app-ux-flows`. It shows how two people looking after Ginger log her scheduled meals: marking a meal as fed, noticing that someone else already fed her, undoing a meal marked by mistake, and recording how much she ate. The showcase is for demos and discussion: it has cases instead of variants, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-004`, display code `SC-PET-004` and title "Meals", listed after `sc-pet-003`. It SHALL have the four cases defined in "Cases". `info` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `info`: Ginger's Info tab with the Care & Feeding row;
- `care-feeding`: Ginger's Care & Feeding screen with today's meals;
- `feed-meal`: the "Record meal" sheet over `care-feeding`;
- `undo-meal`: the undo sheet over `care-feeding`;
- `feed-again`: the warning sheet over `care-feeding` for a meal someone else already fed;
- `feeding-history`: Ginger's feeding history.

The flow SHALL declare no Figma frames.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B on the home page
- **THEN** the flow starts on `info` with the briefing for "Double feed"

### Requirement: Fixture
Every case SHALL start from Ginger's pod shared by the participant and Sam (Members 2), with a feeding schedule of two meals, Breakfast and Dinner, each "Half a cup of dry food, a spoonful of wet food". Meal times SHALL be set relative to the run's start, with Dinner 11 hours after Breakfast:

| Case | Breakfast | Dinner |
|---|---|---|
| A, D | scheduled 10 minutes before the run, not fed | upcoming |
| B | scheduled 30 minutes before the run, fed by Sam 20 minutes before it, all eaten | upcoming |
| C | fed by Sam, all eaten | scheduled 15 minutes before the run, fed by the participant 10 minutes before it, all eaten |

The feeding history SHALL hold breakfast and dinner for each of the 6 days before today, fed by the participant and Sam in turn, with one dinner missed and one breakfast about half eaten.

No screen SHALL fetch data.

#### Scenario: Sam already fed her
- **WHEN** case B starts and the reviewer opens `care-feeding`
- **THEN** the Breakfast card shows "Fed · {time} · Sam" and offers no "Mark as fed"

### Requirement: Info and the pod top bar
`info` SHALL show the Ginger pod top bar with Notes, Chat and Info tabs, where only Info is selected and every tab, back, the breadcrumb and the menu control do nothing. Below it, `info` SHALL show a "Forms" section with the Pet form row, a divider, and the category rows Medical, Care & Feeding 2, Attachments 0, Subpods 0 and Members 2, in this order. Activating Care & Feeding SHALL show `care-feeding`; every other row SHALL do nothing.

#### Scenario: Open Care & Feeding
- **WHEN** a reviewer activates the Care & Feeding row
- **THEN** `care-feeding` is shown

### Requirement: Care & Feeding screen with today's meals
`care-feeding` SHALL show a top bar with back to `info`, the title "Care & Feeding" and the trail "Ginger". Below it, in this order:
- a "Today" section with one meal card for Breakfast and one for Dinner;
- a "Feeding history" row showing "Last fed {day} {time} · {member}", which shows `feeding-history`;
- an "Instructions" row, which does nothing.

A meal's status SHALL follow the same windows as a medication dose: upcoming until 60 minutes before its time, due within 60 minutes of it, overdue later, and fed once recorded. Each meal card SHALL show the meal name, its portion, and a heading:

| Status | Heading |
|---|---|
| upcoming | "Due at {time}" |
| due | "Due now" |
| overdue | "Overdue · due at {time}" |
| fed | "Fed · {time} · {member}", followed by " · ate about half", " · ate a little" or " · ate none" unless all was eaten |

A due or overdue card SHALL offer "Mark as fed", which shows `feed-meal` for that meal. A card fed by the participant SHALL offer "Undo", which shows `undo-meal` for that meal. A card fed by another member SHALL offer "Feed again", which shows `feed-again` for that meal. An upcoming card SHALL offer no action. Only an overdue card SHALL use the warning treatment.

#### Scenario: Due breakfast
- **WHEN** case A reaches `care-feeding`
- **THEN** Breakfast shows "Due now" with "Mark as fed", and Dinner shows "Due at {time}" with no action

### Requirement: Record meal sheet
`feed-meal` SHALL show "Record Ginger's {meal}?", the meal and portion, "Scheduled: now" for a due meal or "Scheduled: {time}" otherwise, the question "How much did she eat?" with the options All, About half, A little and None, with All selected, a primary "Mark as fed" and "Cancel". "Mark as fed" SHALL record the meal as fed by the participant now with the selected amount, return to `care-feeding` and show the toast "{Meal} marked as fed". "Cancel", dismissing and browser back SHALL return to `care-feeding` with nothing changed. When the meal is not due or overdue, `feed-meal` SHALL show `care-feeding` instead of the sheet.

#### Scenario: Log breakfast
- **WHEN** a reviewer in case A activates "Mark as fed" on Breakfast and confirms with All selected
- **THEN** Breakfast shows "Fed · {time} · You" with "Undo", the toast "Breakfast marked as fed" is shown, and the run completes without a completion view

#### Scenario: Partly eaten
- **WHEN** a reviewer in case D selects About half and activates "Mark as fed"
- **THEN** Breakfast shows "Fed · {time} · You · ate about half", and the run completes without a completion view

### Requirement: Undo sheet
`undo-meal` SHALL show "Undo Ginger's {meal}?", the meal and portion, "Fed {day} {time} · You", a destructive "Mark as not fed" and "Keep as fed". "Mark as not fed" SHALL return the meal to due or overdue at its scheduled time, clear its amount, return to `care-feeding` and show the toast "{Meal} marked as not fed". "Keep as fed", dismissing and browser back SHALL return to `care-feeding` with nothing changed. When the meal is not fed by the participant, `undo-meal` SHALL show `care-feeding` instead of the sheet.

#### Scenario: Undo dinner
- **WHEN** a reviewer in case C activates "Undo" on Dinner and confirms "Mark as not fed"
- **THEN** Dinner shows "Due now" with "Mark as fed", the toast "Dinner marked as not fed" is shown, and the run completes without a completion view

#### Scenario: Keep as fed
- **WHEN** a reviewer in case C opens the undo sheet and activates "Keep as fed"
- **THEN** Dinner still shows "Fed · {time} · You", with no toast

### Requirement: Feed again sheet
`feed-again` SHALL show "Ginger already had {meal}", "{member} fed her {minutes} minutes ago." (or "{member} fed her at {time}." after an hour), a primary "Don't feed" and "Feed again". "Don't feed", dismissing and browser back SHALL return to `care-feeding` with nothing changed. "Feed again" SHALL record an extra feeding of that meal by the participant now, return to `care-feeding`, add "Fed again · {time} · You" under the meal's heading, and show the toast "Extra {meal} logged". When the meal is not fed by another member, `feed-again` SHALL show `care-feeding` instead of the sheet.

#### Scenario: Don't feed
- **WHEN** a reviewer in case B activates "Feed again" on Breakfast and then "Don't feed"
- **THEN** Breakfast still shows "Fed · {time} · Sam" with no extra feeding and no toast

#### Scenario: Feed anyway
- **WHEN** a reviewer in case B activates "Feed again" on Breakfast and then "Feed again" on the sheet
- **THEN** Breakfast shows "Fed again · {time} · You" under its heading and the toast "Extra breakfast logged"

### Requirement: Feeding history
`feeding-history` SHALL show a top bar titled "Feeding history" with the trail "Care & Feeding" and back. Below it, the meals of the last 7 days, today included, SHALL be listed newest first, grouped under day labels ("Today", "Yesterday", then e.g. "Mon, Oct 12"). Today's meals SHALL be listed under "Today" and each earlier day SHALL hold that day's meals, at whatever hour the run starts, even when a meal time relative to the run falls on the previous calendar date. Each row SHALL show the meal name and either "Fed {time} · {member}", followed by " · ate about half", " · ate a little" or " · ate none" unless all was eaten, or "Missed · scheduled {time}". Today's meals SHALL be listed only once fed, and a second feeding of a meal SHALL be its own row, "Fed again {time} · {member}".

#### Scenario: Sam's breakfast in the history
- **WHEN** a reviewer in case B opens `feeding-history` from `care-feeding`
- **THEN** "Today" lists Breakfast "Fed {time} · Sam", and earlier days list meals fed by You and Sam, including one missed dinner

### Requirement: Cases
The showcase SHALL have exactly these four cases, in this order. Each case's run SHALL complete once, without a completion view, when its goal is reached:

| Case | Code | Name | Goal | Completes when |
|---|---|---|---|---|
| `a` | SC-PET-004-A | Log a meal | Ginger's breakfast is due. Feed her and record it. | a meal is recorded on `feed-meal` |
| `b` | SC-PET-004-B | Double feed | Ginger is meowing for food. Feed her if she hasn't eaten yet. | Care & Feeding is opened from `info` |
| `c` | SC-PET-004-C | Undo fed | You marked Ginger's dinner as fed by mistake. Undo it. | a meal is undone on `undo-meal` |
| `d` | SC-PET-004-D | Partly eaten | Ginger only ate half her breakfast. Record it. | a meal is recorded on `feed-meal` |

#### Scenario: Double feed
- **WHEN** a reviewer in case B opens Care & Feeding from `info`
- **THEN** Breakfast shows Sam's feeding and the briefing shows "Goal reached"

### Requirement: Briefing
The showcase SHALL provide a description, each case's goal and description, a hint for every screen, an explanation of every screen, and open questions:
- flow: should meals and medication doses share one Today list on Ginger's pod?
- case A: should "Mark as fed" be one tap, without the sheet, when all was eaten?
- case B: is "Fed · {time} · Sam" noticeable enough before someone feeds her again?
- case C: should Sam be told when a meal is undone?
- case D: should "None" record a meal as fed at all?
- `care-feeding`: what should happen to a meal that is never logged?
- `feed-again`: should a second feeding be allowed at all?

#### Scenario: Every key is translated
- **WHEN** any case is briefed
- **THEN** its goal, hints, screen explanations and open questions are all shown as English text, with no raw keys
