## Context

Ginger's shared pieces live in `pods/ginger/`: the pod model and atoms (`model.ts`), `toDoseStatus` (`dose-status.ts`), and components such as `GingerCategoryRows`, `DueDoseCard`, the dose sheets and `MedicalDoseView`. Flows can't import each other, so anything both showcases use goes in `pods/ginger/`.

The dose components read the medication atoms directly (`medicationDoseAtom`, `medicationAtom`) and medication strings (`pods.ginger.dose.*`). `GingerCategoryRows` renders Medical, Attachments, Subpods and Members for every Ginger flow. Showcase cases share one `initialScreen` (`define-flow.ts`), and only `initialState` differs per case.

The pod chat and Telli's scripted answers for Sofia's pod live in `flows/sc-ppl-003/model.ts` and `pods/people/telli-answers.ts`. Tidy recognition for Sofia's notes is in `pods/notes/tidy.ts` and is specific to Contact info.

The ontology gives feeding no structure: `PetsCareAndFeedingShape` only repeats the pet's identity fields, and the example's graph 60 is one free-text comment. Meal slots are a prototype addition.

## Goals / Non-Goals

**Goals:**
- One Care & Feeding screen family in `pods/ginger/` that both showcases configure through their fixtures.
- Meals that look and behave like doses, without changing any medication component or string.
- No visible change to SC-PET-002, the exp-pet flows or chat-add-medication.

**Non-Goals:**
- A generic "scheduled item" abstraction shared by doses and meals.
- Moving SC-PPL-003's chat model into a shared slice.
- A server-shaped feeding model with ontology IRIs.

## Decisions

### 1. Two showcases, one Care & Feeding screen
SC-PET-003 tests free text (write, read, ask, tidy) and SC-PET-004 tests meal slots (log, double feed, undo, amount). Each briefing stays about one job. Both render a `CareFeedingView` from `pods/ginger/components/`, which shows a Schedule or Today section and the Instructions section according to the atoms. SC-PET-004 passes its meal cards as a slot, the same way SC-PET-002 passes `doseCard` to `MedicalDoseView`.

Alternative: one showcase with eight cases. Rejected because the cases need different screens (editor and chat against meal sheets), and one briefing would mix two questions.

### 2. Care & Feeding row is opt-in
`GingerCategoryRows` gains an optional `onOpenCareFeeding` and a `careFeedingCount`. The row renders only when the callback is given, after Medical. Existing callers pass nothing and render as before, so their specs and tests stay valid.

Alternative: always show the row, inert where unused. Rejected because it changes the Info layout that EXP-PET-003/004/005 specify.

### 3. Meals reuse dose status, not the dose components
`pods/ginger/feeding.ts` defines:
- `Meal`: `id`, `name` (`breakfast` | `lunch` | `dinner`), `portion`, `scheduledAt`, `status` (`due` | `given`), `givenAt`, `givenBy`, `amount` (`all` | `half` | `little` | `none`) and an optional `extra` feeding (`givenAt`, `givenBy`).
- Atoms `careInstructionsAtom` (string), `mealsAtom` (`readonly Meal[]`), and write atoms `feedMealAtom`, `undoMealAtom` and `feedAgainAtom`, each taking a meal id.

`Meal` is structurally assignable to `MedicationDose`, so `toDoseStatus` and `formatDoseTime` are reused unchanged and meals get the same 60-minute windows. `undoMealAtom` keeps `scheduledAt` and drops `givenAt`, `givenBy` and `amount`, as `undoDoseAtom` does.

`MealCard` and the three meal sheets are new components that copy the dose card's treatments and layout, and use `pods.ginger.careFeeding.*` strings and a measuring-cup icon instead of the capsule (the icon set has no bowl).

Alternative: parametrise `DueDoseCard` and `DoseSheet` over doses and meals. Rejected for this change: it touches every flow that shows a dose. If the two cards stay alike after review, extracting a shared card is a follow-up.

### 4. Meal times relative to the run
`mealTimes(mealStart, now)` in `flows/sc-pet-004/model.ts` returns each case's scheduled and given times, like `doseTimes` in SC-PET-002. Every case then reads the same at any hour. On a morning run a relative meal time can fall on the previous calendar date, so each feeding event carries the day it belongs to: today's meals belong to the run's day, and the past days are counted back from it by calendar days, which also keeps a DST change from shifting them. The cost is that the card times don't match "7am and 6pm" in the instructions. SC-PET-004 shows Instructions as an inert row rather than the text, so the mismatch isn't visible on screen.

### 5. Meal-time recognition is a pure function
`recogniseMealTimes(text)` in `pods/ginger/feeding.ts` finds `h[:mm] am|pm` matches and returns their ranges in the text (for highlighting), the 24-hour time and the meal name (before 12:00 Breakfast, 12:00–15:59 Lunch, later Dinner). It sits next to `pods/notes/tidy.ts` in spirit but not in code, because tidy maps lines to Contact info fields. The SC-PET-003 schedule then holds fixed times (7:00 and 18:00) with no status, since that showcase never logs meals.

### 6. Owner and sitter come from the fixture
SC-PET-003's initial state carries `role: 'owner' | 'sitter'`. The flow sets `podMembersAtom` (none, or Alice) and an `isOwnerAtom` in the flow model. `CareFeedingView` takes `canEdit` as a prop, so the shared view knows nothing about roles. `canEdit` covers the instructions and the schedule suggestion only: recording meals is open to every member, so the meal cards are not gated by it.

The sitter's pod (cases B and C) starts with the schedule, today's meals and the history, built by the same helpers as SC-PET-004 with Alice instead of Sam. When today's meals exist, `CareFeedingView` shows them in place of the Schedule section, since both list the same meals. SC-PET-003 adds its own `feed-meal` and `undo-meal` screens, which repeat SC-PET-004's ten-line wiring because flows can't import each other. It has no `feed-again` screen: its fixture never has a meal fed by someone else today, and `MealCard` hides "Feed again" when no handler is given.

### 7. Feeding history is derived, like the dose history
`pods/ginger/feeding.ts` adds `FeedingEvent` (meal name, scheduled time, fed or missed, who, when, amount) and `feedingHistoryAtom` for the days before today. `toFeedingHistory(meals, past, now)` adds today's fed meals and any second feeding as events, keeps the last 7 days and sorts them newest first, so undoing a meal removes it from the history with no bookkeeping. `createFeedingHistory(breakfastAt, fedBy)` builds the fixture's 6 past days from the case's breakfast time, so the history lines up with the meal cards. `FeedingHistoryView` reuses `formatDayLabel` from the dose history; it has no period filter or paging, since 7 days of two meals fit on one screen.

The toast type is shared too (`CareFeedingToastValue`, rendered by `CareFeedingToast`), because both showcases now show meal toasts.

### 8. SC-PET-003 has its own chat model
`flows/sc-pet-003/model.ts` holds the chat entries, the typing flag and a `scheduleReply` that follows SC-PPL-003's: a short delay, then Telli's answer, with a callback that completes case C. The Telli rules for feeding go in `pods/ginger/telli-answers.ts` with the same `answerFor` shape as `pods/people/telli-answers.ts`. The chat UI reuses the existing group-chat components.

Alternative: move SC-PPL-003's chat model to a shared slice. Rejected as out of scope. A third chat flow would justify it.

### 9. Completion
Each case completes through `complete({ showCompletionView: false })` where its goal is reached. In SC-PET-003: save in A, recording a meal in B, Telli's pod answer in C, and the schedule confirmation in D. In SC-PET-004: the meal sheet confirmations in A, C and D, and opening Care & Feeding from `info` in B, its only way in; completing in the Info row's handler rather than on render keeps it testable without a DOM. A completion from a restarted run, such as Telli's late reply after Start over, is ignored by the runner. A run completes only once, so later actions don't complete it again. The goal that applies is read from a per-case `goal` field in the initial state, as `goalAtom` does in SC-PPL-003.

## Risks / Trade-offs

- [The meal card copies the dose card, so the two can drift apart] → Both keep the same treatments table shape, and the briefing asks whether meals and doses should share one Today list. That answer decides whether to merge them.
- [SC-PET-004-B completes as soon as Care & Feeding opens, before the participant decides] → Matches SC-PPL-003-A. The decision is the discussion point, and `feed-again` captures the "feed anyway" path.
- [The recogniser misses "7 in the morning" or "18:00"] → Only the example's format needs to work. Case A's free typing may show no suggestion, which is specified.
- [Instructions mention "Alice's bedroom" when the participant is the owner in cases A and D] → The text is the ontology example verbatim. Alice is the owner's name in cases B and C, so the participant plays Alice.

## Open Questions

- Should the meal portion come from the recognised instructions instead of the fixture? This only matters if a later change connects the two showcases.
