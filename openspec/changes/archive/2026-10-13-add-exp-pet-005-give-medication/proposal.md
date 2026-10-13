## Why

EXP-PET-002 to EXP-PET-004 tested how participants configure a medication: adding one, checking it and changing its schedule. None of them tests the action a pet owner does most often: **recording that a scheduled dose was given**. That task is time-sensitive and recurring, so it raises a different information-architecture question: should a due dose stay inside the pet's medical information, or be surfaced at the pet level or on Home as a current task? We want evidence before design commits to one of these.

## What Changes

- **New experiment flow `exp-pet-005`** ("Give medication", display code `EXP-PET-005`). The moderator chooses the variant explicitly. The participant is told only: "Give Ginger her Apoquel and record that she has taken this dose." Every variant starts on Home, and Ginger opens on Notes as in EXP-PET-004.
- **The same baseline in every variant.** Home → Ginger → Info → Medical → Apoquel details. Both the Medical screen and the medication details show Apoquel's due dose with "Mark as given". Nobody hits a dead end, and the baseline is never an experimental surface.
- **Three variants that differ only in whether a promoted surface comes earlier, and where it sits:**
  - `a` (EXP-PET-005-A, "From Medical"): no promoted surface. This is the control.
  - `b` (EXP-PET-005-B, "On Ginger's pod"): a pod-level "Due now" band under Ginger's top bar, shown on both the Notes and Info tabs.
  - `c` (EXP-PET-005-C, "On Home"): a "Today" section above "Pods" on Home, naming Ginger.
- **One due-dose card used on every surface.** It shows pill, name, dose and schedule, "Due now" and "Mark as given". Its states are upcoming, due, overdue and given, and the visuals for each are defined. The fixture only uses due and given. Due is styled as a calm prompt, not as a warning.
- **One shared confirmation.** A bottom sheet titled "Record Ginger's dose?" shows Apoquel 16 mg tablet and "Scheduled: now", with "Mark as given" and "Cancel". It is the same whichever surface opened it.
- **One end state.** Every dose surface changes in place to "Given · {time}", and a toast reads "Apoquel marked as given". The medication record and its schedule stay unchanged, and the run completes silently.
- **A dose is separate from the medication.** A dose record has a scheduled time, a status (`due` or `given`) and an optional time given. It belongs to Ginger's pod next to the medication. Marking a dose as given never edits the medication.
- **Fixture:** Ginger holds one medication, Apoquel (oclacitinib, Zoetis, 16 mg tablet, 2 times per day), with one dose due now. The fixture is defined in this flow, so other flows are unaffected.
- **Dose history.** Ginger's pod has a second member, Sam. Sam gave the previous Apoquel dose, which the due card shows as "Last given …". A `dose-history` screen lists every past dose, newest first and grouped by day, with filters for period (Week, Month, Year, All) and medication. The medications are the current Apoquel and three finished courses, so the list is long; it shows 50 doses at a time with "Show more". The history opens from Medical, from the dose card and from the medication details.
- **Analytics:** every variant records `medication_give_started`, `medication_give_confirmed` and `medication_give_cancelled`, each with `entry_point` set to `medical`, `pod` or `home`. Wrong turns are recorded with the navigation events EXP-PET-004 already uses. There is no impression event and there are no variant-specific event names.

- **Undo a dose given by mistake** (added after review). The given card shows "Undo" when the participant gave the dose; a confirmation sheet ("Undo Ginger's dose?", "Mark as not given" / "Keep as given") returns the dose to due and shows "Apoquel marked as not given". Recorded as `medication_undo_*` with the same `entry_point`.
- **Figma frames** (added after review): its own page "EXP-PET-005 - Give medication" in Mee – Tellipod App v4.0.3, with the due-dose card component in all four states, and every screen linked from the app through `designFrames`.
- The Medical screen, dose history, dose row, give and undo sheets, and the Apoquel fixture move to `pods/ginger/` so that SC-PET-002 (`add-sc-pet-002-dose-states`) shares them.

Out of scope:
- a medication scheduling system, reminders, or recording or editing past doses;
- listing past courses on Medical (they appear only in the history filter);
- one-tap marking with undo instead of a confirmation;
- several pets or several due tasks on Home;
- any change to EXP-PET-002, EXP-PET-003 or EXP-PET-004.

## Capabilities

### New Capabilities
- `app-ux-flows/experiments/exp-pet-005`: the EXP-PET-005 experiment. Covers the hypothesis, the task, the three variants, the screens and navigation, the Apoquel and dose fixture, the due-dose card and its states, the shared confirmation, the end state and the analytics events.

### Modified Capabilities
None. The due-dose card and the dose record are pod pieces (`pods/ginger/`), not design-system components. `BottomSheet`, `Toast`, `RecordRow` and `FormCard` are reused unchanged. Ginger's Home view only gains an optional slot.

## Impact

- Code (all in `apps/app-ux-flows/src`):
  - New: `slices/flow/flows/exp-pet-005/**` (flow, model, screens, flow-specific views, tests).
  - New pod pieces in `slices/flow/pods/ginger/`:
    - the medication dose record type;
    - a `toDoseStatus` projection with tests;
    - a `DueDoseCard` component;
    - past courses (`endDate` on medication records), past dose events, pod members, and a `toDoseHistory` projection.
  - Changed:
    - `slices/flow/pods/ginger/components/ginger-home-view.tsx`: an optional section shown above "Pods", with no change when it's absent;
    - `slices/flow/registry.ts` and its test;
    - `app/locales/en.ts`;
    - `apps/app-ux-flows/AGENTS.md`: the pod data limits note.
- Reused unchanged:
  - shared UI: `GingerTopBar`, `SubScreenTopBar`, `MedicationRow`, `NotesArea`, `toMedicationSummary`, `toMedicationFieldRows`, `PodScreen`, `CategoryRow`, `RecordRow`, `FormCard`, `FieldRow`, `BottomSheet` and `Toast`;
  - the sheet-as-screen pattern of EXP-PET-002's `add-form` and SC-PPL-001's `tidy-confirm`.
- Browser storage: a new `ux-flows:variant:exp-pet-005` key.
- No new dependencies.
