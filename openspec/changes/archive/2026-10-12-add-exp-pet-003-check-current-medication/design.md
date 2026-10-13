## Context

See proposal.md for motivation and `specs/app-ux-flows/experiments/exp-pet-003/spec.md` for behaviour. Current state the approach builds on:

- **Ginger pod data.** `slices/flow/pods/ginger/` already holds:
  - the Ginger pod fixture, avatar and `MedicationRecord` type and fixture, with `podAtom` and `medicationAtom`;
  - `toMedicationFieldRows()`, the full-record projection used by the EXP-PET-002 form card;
  - `GingerTopBar` and `NotesArea`.

  `GingerTopBar` hard-codes `onBack` to a no-op.
- **Variants.** EXP-PET-002 drives its variant B with an initial-state flag rather than a screen override. The runtime merges initial state as `variant → case → run`, flag by flag, and lets a variant implement a screen that the base flow marks `null`.
- **Shared components.** `CategoryRow` has no secondary text. `FieldRow` always renders an edit button. `CategoryCell` (SC-PET-001) is an inert `div`, so it can't record a tap. No shared component shows one record as a summary row.
- **Home.** No flow has a Home with an existing pod. SC-PET-001's Home is the "add your first pod" state, and its view lives inside that flow's folder.
- **Information model.** The exploration settled that Medical is a grouping inside Ginger, not a sub-pod. The EXP-PET-002 spec calls its `medical` screen "the Medical sub-pod". This change doesn't touch that spec. It only uses the grouping model for EXP-PET-003.

## Goals / Non-Goals

**Goals:**
- The three variants share every screen and component. They differ in exactly one decision: how Medical presents the record on `ginger-info`.
- Every list surface reads the record through one summary projection. Only that projection decides what "name · dose · frequency" looks like.
- The analytics events let the moderator's notes be reconstructed from the data: first action, wrong turns, unnecessary detail opening.

**Non-Goals:**
- A data-driven rule that maps form shapes to groups (`PetMedicationRecordShape → Medical`). The Medical grouping is hard-coded in this flow, as in EXP-PET-002.
- Multiple medications, or current vs past medications. The model holds one record and has no end date. The rows are written as lists so a second record would render, but nothing tests that.
- Figma frames (`designFrames`). They can be added later without changing behaviour.
- Promoting the new pod components into `defaultComponents`.

## Decisions

### 0. Explicit variant selection
Variants are chosen on the home page (`variantSelection: 'explicit'`), not assigned automatically. The moderator picks the variant for each participant, so the between-subjects balance is managed in the session plan rather than by the app. A direct link without `?variant=` falls back to variant A.
- *Alternative:* automatic sticky assignment, as in EXP-PET-002. Rejected: moderated sessions need to choose and repeat a variant on purpose.

### 1. One presentation flag, plus `medical` implemented only by A and B
Initial state is `{ pod?: Pod; medication?: MedicationRecord; medicalPresentation?: 'row' | 'row-with-preview' | 'inline'; podOpensOn?: 'info' | 'notes' }`.
- **Variants:** `a` sets `row`, `b` sets `row-with-preview`, and `c` sets `inline`.
- **Screens:** the base flow declares `medical: null`, and variants `a` and `b` implement it with the same `MedicalScreen`. Variant `c` then gets the "undeclared screen" behaviour from the runtime without any extra code.
- **Info:** `GingerInfoView` reads `medicalPresentationAtom` and renders either the Medical category row (with or without a preview) or the inline Medical section.
- *Alternative:* override `ginger-info` per variant. Rejected because it would duplicate the whole Info screen three times to change one block, the same reason EXP-PET-002 used a flag.
- *Alternative:* swap a flow-specific component through the component environment. Rejected because the environment holds design-system building blocks, not state-composing views.
- *Risk:* a flag and screen availability that disagree, such as `inline` combined with a `medical` screen. A test asserts that every variant's flag matches whether it implements `medical`.

### 2. Summary projection next to the field rows
Add `toMedicationSummary(record, t, language)` to `pods/ginger/medication-fields.ts`. It returns `{ name, dose, frequency, startDate? }`:
- `name` is the brand name, or the ingredient labels when there is none.
- `dose`, `frequency` and `startDate` use the existing private formatters. Dose formatting moves into a small shared helper so both projections use one formatter.

The flow composes the strings "62.5 mg · 2 times per day", "Clavamox · 2 times per day" and "Started Oct 6, 2026" through its own i18n keys. That keeps punctuation and word order translatable.
- *Alternative:* format inside each screen. Rejected because the Medical row, the inline section and the details title must agree, and they would drift.

### 3. Shared components: one new, two optional props
- **`RecordRow`** (`shared/ui/record-row.tsx`, registered in `podComponents`). Its props are `icon`, `title`, optional `description`, optional `meta` and `onClick`. It follows `CategoryRow`'s visual language (white rounded row, icon in a gray circle, chevron), and its accessible name is built from the visible lines. It is used for the medication rows and for the Pet form row. The Pet row is a `RecordRow` without a description, so it can record the tap that SC-PET-001's inert `CategoryCell` cannot.
- **`CategoryRow`** gets an optional `preview`, shown under the label. Without it, markup and accessible name stay exactly as they are now, so EXP-PET-002 and the chat showcase don't change.
- **`FieldRow`** gets an optional `onEdit`. Without it, no button is rendered. Existing callers all pass `onEdit`, so nothing they show changes.
- *Alternative:* give `CategoryRow` a description and use it for medications. Rejected because a category row is about a group with a count, while a record row is about one item. Mixing them would blur the distinction the experiment is testing.

### 4. Flow-local views and top bars
Everything that composes run state stays in `flows/exp-pet-003/`:
- `HomeView`: greeting, "Pods" section, a Ginger pod row and `AppTabBar`.
- `GingerInfoView` and `MedicalView`.
- `MedicationDetailsView`: a `FormCard` with read-only `FieldRow`s from `toMedicationFieldRows`.
- `ExpPet003TopBar`: wraps `GingerTopBar`, tracks tab selection and routes back to `home`.

The Ginger pod row on Home is flow-local, because it shows an avatar image and `RecordRow` takes an icon. If a second flow needs it, it becomes a shared pod-list row.

`GingerTopBar` gains an optional `onBack` that defaults to the current no-op, so EXP-PET-002 and the chat showcase keep their inert back control.
- *Alternative:* import SC-PET-001's `HomeView`. Rejected because flows don't import from each other, and that view is the empty "add a pod" state.

### 5. Navigation targets
- Home → Ginger uses `podOpensOn`, with the default `info`.
- Ginger's back goes to `home` with `goToScreen`, not history, so a direct link to `ginger-info` still has somewhere to go back to.
- `medical` and `medication` use `back()`, so `medication` returns to whichever screen opened it (`medical` in A and B, `ginger-info` in C).
- The breadcrumb `Ginger > Medical` on `medication` is static text in every variant. It tells participants in C where the record belongs, even though they never visit a Medical screen.

### 6. No completion, no briefing
The flow is `kind: 'experiment'`, so the briefing capability shows nothing. It never calls `complete()`. Like EXP-PET-002, the end state is observational: the moderator stops the session once the participant answers. A completion view would hide the screen the participant answered from.

### 7. Analytics
Events are declared in `ExpPet003Events` in `model.ts`, following the naming rules in `app-ux-flows/flow-analytics`.
- **Shared intent, shared event:** `medication_opened` carries `entry_point`, so A/B and C stay comparable.
- **Wrong turns:** inert rows and tabs record `info_row_selected`, `pod_tab_selected` (`chat`) and `app_tab_selected` (`telli`, `navigation`). These are the "wrong turn" and "tried to ask Telli" signals from the exploration, and they need no new screens.
- **Time to answer** is not an event. It needs the moderator's mark of the verbal answer. `screen_viewed` timestamps give the time the answer first became visible: `ginger-info` in B and C, `medical` in A.

### 8. "+ Add medication" is shown but inert
Wherever medications are listed (the Medical screen in A/B, the inline Medical section in C), a flow-local `AddMedicationAction` renders the same outlined tertiary `+` button as EXP-PET-002's "Create form". It records `add_medication_selected { entry_point }` and does nothing else. It belongs next to the canonical list, so every variant has it in the same place relative to the medication, and A/B don't get an extra entry point on the Medical row.
- *Alternative:* reuse EXP-PET-002's Add form sheet so a second medication can be added. Rejected for now: the pod model holds one record, and the scenario is retrieval. A tap is a useful signal on its own: it may mean the participant thinks the medication is missing.

## Risks / Trade-offs

- **[Inert Chat tab, Ask Telli and Navigation look broken]** → They are tracked, so the moderator can probe ("what did you expect there?"). Building a Chat screen would turn this into the Telli variant the exploration ruled out of the head-to-head comparison.
- **[A single record with a "Medical (1)" count makes A easy]** → This is a known limit. The task is about finding the medication, not choosing between records. Multi-record fixtures can come later through `initialState.medication` once the model allows more than one record.
- **[B's preview drops the dose]** → This is deliberate. It tests how little has to be visible on Info. Note whether B participants open details only to find the dose.
- **[Grouping model differs from EXP-PET-002's "Medical sub-pod" wording]** → The two flows don't share screens. The difference is recorded here so a later change can align the EXP-PET-002 spec and SC-PET-001's suggested sub-pods with the grouping model.
- **[`podOpensOn: 'notes'` exists only through code]** → No URL or case mechanism exists for experiments to pass initial state. Moderated sessions that need Notes-first must use a build or variant that sets it. The default (Info) is what the spec requires.

## Migration Plan

This adds one flow and only additive props to shared components, so no migration is needed. Rollback means removing the flow from the registry. New browser storage key: `ux-flows:variant:exp-pet-003`.

## Open Questions

- Should Figma frames for EXP-PET-003 be drawn after the implementation exists, or before? Either way they're added as `designFrames` later, with no behaviour change.
