## 1. Shared Care & Feeding pieces

- [x] 1.1 Add `pods/ginger/feeding.ts`: `Meal`, `careInstructionsAtom`, `mealsAtom`, `feedMealAtom`, `undoMealAtom`, `feedAgainAtom`, the graph 60 instructions constant and `recogniseMealTimes`. Verify with `feeding.test.ts`: "7am" and "6pm" in the instructions give Breakfast 7:00 and Dinner 18:00 with their ranges, "7:30am" and "6 pm" are recognised, "Dry food twice a day" gives none, a `Meal` passes through `toDoseStatus`, undo clears `givenAt`/`givenBy`/`amount` and keeps `scheduledAt`, and feed-again adds `extra` without changing the first feeding.
- [x] 1.2 Add `pods/ginger/telli-answers.ts` with the feeding answer and the not-found answer. Verify with `telli-answers.test.ts`: feeding words answer from the pod, an unrelated question gets not-found, and a statement gets no answer.
- [x] 1.3 Make the Care & Feeding row opt-in in `GingerCategoryRows` (`onOpenCareFeeding`, `careFeedingCount`, rendered after Medical only when the callback is given). Verify that the existing SC-PET-002 and exp-pet tests pass unchanged.
- [x] 1.4 Add `CareFeedingView` (top bar "Care & Feeding" with the trail "Ginger"; an optional Schedule section, Today slot and notice; the Instructions section with empty state, highlighted times, read-only text or an inert row; `canEdit`), plus `MealCard`, `FeedMealSheet` (amount radio, All by default), `UndoMealSheet` and `FeedAgainSheet`, with `pods.ginger.careFeeding.*` strings. Verify with `pnpm check-types` and a render check in the SC-PET-003/004 tests.

## 2. SC-PET-003 Care instructions

- [x] 2.1 Add `flows/sc-pet-003/model.ts`: screen ids, initial state (`role`, `instructions`, `goal`), `isOwnerAtom`, the toast atom, and the chat model with `scheduleReply`. Verify with `pnpm check-types`.
- [x] 2.2 Add the `info`, `care-feeding`, `edit-instructions`, `schedule-sheet` and `chat` screens: tab switching between Info and Chat, Save disabled for blank text, the schedule suggestion for the owner only, sheet guards, and completion per case. Verify by walking all four cases in the browser.
- [x] 2.3 Add `flows/sc-pet-003/flow.ts` with cases A–D, `createStore` from the fixture, hints, screen notes and questions, and no `designFrames`. Register it after `sc-pet-002` and update the registry-order assertions in the `chat-add-medication` and `sc-pet-001` tests. Verify that those tests pass.
- [x] 2.4 Add the `flows.scPet003.*` strings. Verify with the every-key-translated test in 2.5.
- [x] 2.5 Add `sc-pet-003.test.ts`: identity, cases and screens; every declared key translated; the starting state of each case (empty instructions in A, read-only and two members in B/C, no schedule in D); saving instructions; recognising two times and setting up the schedule; and the Telli feeding answer completing case C. Verify that the test passes.

## 3. SC-PET-004 Meals

- [x] 3.1 Add `flows/sc-pet-004/model.ts`: screen ids, initial state (`mealStart`, `goal`), `mealTimes(mealStart, now)` and the toast atom. Verify with unit assertions in 3.4 that the times match the fixture table.
- [x] 3.2 Add the `info`, `care-feeding`, `feed-meal`, `undo-meal` and `feed-again` screens: meal cards wired to the sheets, sheet guards for meals in the wrong status, toasts, and completion per case. Verify by walking all four cases in the browser.
- [x] 3.3 Add `flows/sc-pet-004/flow.ts` with cases A–D, `createStore` from the fixture, hints, screen notes and questions, and no `designFrames`. Register it after `sc-pet-003`, add the `flows.scPet004.*` strings, and update the registry-order assertions. Verify that those tests pass.
- [x] 3.4 Add `sc-pet-004.test.ts`: identity, cases and screens; every declared key translated; each case's starting meals; logging breakfast with All and with About half; undo returning dinner to due; and feed-again adding an extra feeding while "Don't feed" changes nothing. Verify that the test passes.

## 4. Checks

- [x] 4.1 Run `pnpm check-types`, `pnpm lint` and the app-ux-flows tests, and check that SC-PET-002 and EXP-PET-005 still show Info without a Care & Feeding row. Verify that everything is green.

## 5. Sitter feeding and feeding history

- [x] 5.1 Add `FeedingEvent`, `feedingHistoryAtom`, `toFeedingHistory` and `createFeedingHistory` to `pods/ginger/feeding.ts`, and share the toast type. Verify with `feeding.test.ts`: today's fed meals and a second feeding join the history, undone and due meals don't, days older than 7 are dropped, and the fixture has 12 past meals with one missed and one half eaten.
- [x] 5.2 Add `FeedingHistoryView` and `CareFeedingToast`; give `CareFeedingView` a Feeding history row with the last-fed preview, show Today instead of Schedule when there are meals, and make "Feed again" optional on `MealCard`. Verify with `pnpm check-types`.
- [x] 5.3 SC-PET-003: give cases B and C the schedule, today's meals (dinner due) and the history with Alice; add the `feed-meal`, `undo-meal` and `feeding-history` screens; rename case B to "Feed as sitter" with the feeding goal, completing on a recorded meal; replace the sitter-edit question and say in the Care & Feeding explanation that only the owner changes the instructions. Verify with `sc-pet-003.test.ts`: the sitter has no Edit but can feed dinner, which completes B, and the history lists it.
- [x] 5.4 SC-PET-004: add the history fixture with Sam, the Feeding history row and the `feeding-history` screen. Verify with `sc-pet-004.test.ts`: the screen is declared and renders, and Sam's breakfast is in today's history in case B.
- [x] 5.5 Run `pnpm check-types`, `pnpm lint` and the app-ux-flows tests. Verify that everything is green.
- [x] 5.6 SC-PET-003: make "Care & Feeding" in Telli's feeding answer a link that opens `care-feeding`. Verify with `sc-pet-003.test.ts`: the answer's link navigates to `care-feeding`.

## 6. Review fixes

- [x] 6.1 Group the feeding history by each event's own day, with today's meals under the run's day and past days counted back by calendar days. Verify with `feeding.test.ts` (a morning run and a DST change) and fixed-clock tests in both flows.
- [x] 6.2 Match Telli's feeding words as whole words. Verify with `telli-answers.test.ts`: "Great, thanks!" gets no answer.
- [x] 6.3 Ignore `complete` from a run that was restarted, so Telli's late reply can't complete a new run.
- [x] 6.4 Step back after saving the instructions and after setting up the schedule, so back from Care & Feeding goes to Info; clear the toast when following Telli's link; use each recognised meal time once.
- [x] 6.5 Move `gingerPortion` into `pods/ginger/feeding.ts`; allow the feed sheet only for due or overdue meals; use inline meal-name strings instead of lower-casing; use a measuring-cup icon; complete SC-PET-004-B from the Info row. Verify with `pnpm knip`, `pnpm check-types`, `pnpm lint` and the tests.
