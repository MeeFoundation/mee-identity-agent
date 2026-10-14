## 1. Shared pieces

- [x] 1.1 Depends on `add-exp-pet-005-give-medication` task 7.2: the Apoquel fixture, the give and undo atoms, `MedicalDoseView`, `DoseHistoryView`, the dose sheets and `useDoseSheet` live in `pods/ginger/`.

## 2. Flow

- [x] 2.1 Add `flows/sc-pet-002/model.ts`: screen ids, `ScPet002InitialState` (`doseStart`), `doseTimes(doseStart, now)` and `toastAtom`.
- [x] 2.2 Add `flows/sc-pet-002/flow.ts`: showcase, cases `a` and `b`, `createStore` from the shared fixture, hints, screen notes, questions and `designFrames`. Register it after `sc-pet-001` and update the registry-order assertions.
- [x] 2.3 Add the `medical` view (shared Medical with the due-dose card wired to the sheets and the history, and the toast), and the `give-dose`, `undo-dose` and `dose-history` screens.
- [x] 2.4 Add the `flows.scPet002.*` strings.

## 3. Figma

- [x] 3.1 Add the section "SC-PET-002 - Medication doses" with the scenario documentation, case A (Medical overdue, give sheet, given) and case B (Medical given by mistake, undo sheet, undone, dose history).

## 4. Tests and checks

- [x] 4.1 Add `sc-pet-002.test.ts`: identity and cases, screens and Figma frames, every declared key translated, both starting states, the history anchored to the scheduled dose, give in A, and undo in B removing the dose from the history.
- [x] 4.2 Run `pnpm check-types`, `pnpm lint`, the app's tests and `pnpm steiger:concepts`, and walk both cases in the browser.
