## 1. Ginger pod: dose record, projection and card

- [x] 1.1 Add the `MedicationDose` type and `medicationDoseAtom` to `pods/ginger/model.ts`. The default is a due dose. Verify with `pnpm check-types`, and check that existing flows' tests still pass with `pnpm --filter app-ux-flows test`.
- [x] 1.2 Add `pods/ginger/dose-status.ts` with `toDoseStatus(dose, now, { dueWindowMinutes })` and `formatDoseTime(iso, language)`. Add `dose-status.test.ts` covering:
  - upcoming, due at both window edges, overdue, and given winning over time;
  - "10:32 AM" in `en`.

  Verify that the test passes.
- [x] 1.3 Add `pods/ginger/components/due-dose-card.tsx`. Verify with `pnpm check-types`, and in the browser through task 4.3 (all four treatments render, and due shows no warning colour or icon). The card:
  - has `onGive` and `showPet` props;
  - renders the four treatments of design decision 3;
  - is a labelled `section`, with a separate "Mark as given" button and no action in the upcoming and given states.

  Before choosing the overdue colours, confirm the warning tokens exist in the theme.
- [x] 1.4 Add an optional `beforePods?: ReactNode` to `pods/ginger/components/ginger-home-view.tsx`, rendered above the "Pods" section. Verify with `pnpm check-types`, and in the browser that EXP-PET-003 and EXP-PET-004 Home look unchanged.

## 2. EXP-PET-005 model and flow definition

- [x] 2.1 Add `flows/exp-pet-005/model.ts`. Verify with `pnpm check-types`. It contains:
  - screen ids `home`, `ginger-notes`, `ginger-info`, `medical`, `medication` and `give-dose`;
  - `ExpPet005Components`;
  - `ExpPet005Events` with exactly the spec's events and properties;
  - `DoseSurface`, `DoseOrigin` and `DoseEntryPoint`;
  - `ExpPet005InitialState`: `pod`, `medication`, `doseSurface`, `doseGiven`;
  - `apoquelMedication`: as EXP-PET-004's, with frequency `2`;
  - the atoms `doseSurfaceAtom`, `doseOriginAtom` and `toastAtom`;
  - `toEntryPoint(origin)`;
  - the write atom `giveDoseAtom`, which updates only `medicationDoseAtom`.
- [x] 2.2 Add `flows/exp-pet-005/flow.ts`. Verify with `pnpm check-types` and `registry.test.ts`. The flow is:
  - experiment `exp-pet-005`, code `EXP-PET-005`, explicit selection, initial screen `home`;
  - variants `a`, `b` and `c` with codes and name and description keys, and `doseSurface` set to `medical`, `pod` and `home`;
  - a `createStore` that sets the pod, the medication and a dose scheduled at store creation (or already given when `doseGiven`), with origin `medical`, no toast and an empty note.

  Register the flow in `registry.ts` and add it to the registry test.
- [x] 2.3 Add the `flows.expPet005.*` strings to `app/locales/en.ts`. Verify in the browser that no raw key shows on any screen in any variant. The strings are:
  - title, description, variant names and descriptions;
  - "Today", "Due now", "Mark as given", "Given · {{time}}";
  - "Record Ginger's dose?", "Scheduled: now", "Cancel";
  - "Apoquel marked as given";
  - the Info and Medical labels copied from EXP-PET-004.

## 3. EXP-PET-005 baseline screens

- [x] 3.1 Add `ExpPet005TopBar`, the `home` screen (with `beforePods` showing `DueDoseCard showPet` only when `doseSurface === 'home'`), and the `ginger-notes` screen (with the band above `NotesArea` only when `doseSurface === 'pod'`). Verify in the browser:
  - Home opens Notes;
  - Ask Telli, Navigation, Chat and the menu are recorded and inert;
  - the band and the Today section appear only in their own variant.
- [x] 3.2 Add the `ginger-info` screen with EXP-PET-004's Info layout and the variant B band above it. Verify in the browser that the band persists across the Notes and Info switch in B and is absent in A and C.
- [x] 3.3 Add `MedicalView` (the card, "Medications", `MedicationRow` with no action, and an inert "+ Add medication") and `MedicationDetailsView` (the card above read-only `FieldRow`s from `toMedicationFieldRows`), plus the `medical` and `medication` screens. Verify in the browser that both screens show the card in every variant and that the details have no pencils.
- [x] 3.4 Wire each host screen's `onGive`: record `medication_give_started` with `toEntryPoint(screenId)`, set `doseOriginAtom`, then `goToScreen('give-dose')`. Verify in the dev console that the entry point is `home`, `pod` or `medical` according to the surface.

## 4. Confirmation, given state and completion

- [x] 4.1 Add `GiveDoseScreen`. Verify in the browser that the sheet is identical from Home (C), Notes and Info (B), Medical and details (all variants). The screen:
  - renders the origin's view, then a `BottomSheet` with "Record Ginger's dose?", "Apoquel · 16 mg tablet", "Scheduled: now", "Mark as given" and "Cancel";
  - on confirm, records `medication_give_confirmed`, calls `giveDoseAtom`, sets `toastAtom`, calls `complete({ showCompletionView: false })` and then `back()`;
  - on cancel or dismiss, records `medication_give_cancelled` and calls `back()`;
  - when the dose is already given, shows the origin screen in place of the sheet and records nothing.
- [x] 4.2 Render the success `Toast` on every origin view when `toastAtom` is set, and clear it when that screen unmounts. Verify in the browser that the toast shows once after confirming and is gone after navigating away and back.
- [x] 4.3 Verify the end state in the browser for each variant. After confirming, every surface the run has (Today card, band, Medical, details) shows "Given · {time}" and no action. The Apoquel item still reads "16 mg · 2 times per day", and the dev console shows exactly one `flow_completed`. Browser back and forward re-open no sheet.

## 5. Tests and quality checks

- [x] 5.1 Add `flows/exp-pet-005/exp-pet-005.test.ts`, following `exp-pet-004.test.ts`. Verify that `pnpm --filter app-ux-flows test` passes. It covers:
  - experiment kind, explicit selection, variant ids and codes;
  - each variant's `doseSurface`;
  - every screen implemented in every variant;
  - the default fixture (Apoquel, frequency `2`, dose due);
  - `doseGiven` initial state;
  - `giveDoseAtom` sets status and `givenAt` and leaves `medicationAtom` referentially unchanged;
  - `toEntryPoint` for all five origins.
- [x] 5.2 Run `pnpm check-types` and `pnpm lint` from the repo root and fix any errors. Done when both pass with no errors.
- [x] 5.3 Walk through each variant in the browser against the spec scenarios. This includes the wrong-path walk in A, "promoted surface ignored" in B, cancel, and a direct `/flows/exp-pet-005/give-dose` link opening over `medical`. Done when every scenario holds and the dev console events match the spec's table, with no medication content in any payload.

## 6. Dose history (added after review)

- [x] 6.1 Extend the pod model and verify with `pnpm check-types` that the earlier flows still type-check:
  - `endDate?` on `MedicationRecord`;
  - `MedicationCourse`, `medicationCoursesAtom` and `CURRENT_MEDICATION_ID`;
  - `DoseEvent` and `doseHistoryAtom`;
  - `givenBy?` on `MedicationDose`;
  - `podMembersAtom` and `PARTICIPANT_ID`.

  Update the `AGENTS.md` data-limits note.
- [x] 6.2 Add `pods/ginger/dose-history.ts`. Verify with `dose-history.test.ts`. It contains:
  - `toDoseHistory(current, past, { period, medicationId }, now)`: newest first, the given current dose included, a due current dose excluded;
  - `groupByDay`;
  - `lastGivenDose(past, medicationId)`.

  The test covers each period, each medication filter, the current dose given and due, and day grouping.
- [x] 6.3 In the flow model, add the members (You, Sam), the past courses, `createDoseHistory(now)`, `doseHistoryFilterAtom`, the `dose_history_*` events and the `dose-history` screen id. `createStore` sets all of them, and `giveDoseAtom` records `givenBy`. Verify with flow tests:
  - Sam gave the previous slot;
  - the history has several hundred events;
  - the history is identical across variants for the same `now`;
  - giving the dose sets `givenBy` to the participant.
- [x] 6.4 Update `DueDoseCard`: the "Last given … · {member}" line when due or overdue, "Given · {time} · {member}" when given, and a "History" link (`onHistory`). Wire it in `FlowDoseCard`. Verify in the browser on every surface of every variant.
- [x] 6.5 Add the Dose history row to `MedicalView`, "Recent doses" with "See all" to `MedicationDetailsView`, and set Members to 2 on Info. Verify in the browser that each entry opens the history with the right medication selected and records `dose_history_opened`.
- [x] 6.6 Add the `dose-history` screen: period tabs, medication select, day-grouped rows, 50-row pages with "Show more", the empty state with "Show all time", and analytics. Verify in the browser against the "Dose history" scenarios.
- [x] 6.7 Run `pnpm check-types`, `pnpm lint` and the app's tests, then repeat the browser walkthrough for all variants, including the history. Done when everything passes.

## 7. Undo, Figma frames and shared dose pieces (added after review)

- [x] 7.1 Build the Figma page "EXP-PET-005 - Give medication": documentation, variant rows A (10 frames), B (5) and C (3), and the `Due dose card` (State × Pet) and `Dose row` components. The Given variants carry the "Undo" link.
- [x] 7.2 Move the shared dose pieces to `pods/ginger/`: `apoquel-fixture.ts` (Apoquel, past courses, members, `createDoseHistory(currentScheduledAt)`, `createScheduledDose`), `giveDoseAtom`, `undoDoseAtom` and `doseHistoryFilterAtom` in `model.ts`, and the components `DoseRow`, `MedicalDoseView`, `DoseHistoryView`, `GiveDoseSheet`, `UndoDoseSheet` and `useDoseSheet`. Shared strings move to `pods.ginger.*`. Verify that EXP-PET-005 looks and records events as before.
- [x] 7.3 Add `onUndo` to `DueDoseCard` (shown only for a dose the participant gave), the `undo-dose` screen, the `medication_undo_*` events and the `undone` toast. Verify with flow tests that undo returns the dose to due without touching the medication, and in the browser that give → undo → give works on Medical.
- [x] 7.4 Declare `designFrames` for every screen of every variant. Verify with the flow test that every screen links to a Figma frame.
- [x] 7.5 Run `pnpm check-types`, `pnpm lint`, the app's tests and `pnpm steiger:concepts`. Done when all pass.
