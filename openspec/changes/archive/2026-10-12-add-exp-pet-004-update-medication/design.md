## Context

EXP-PET-003 already builds most of the path this experiment needs: Home, Ginger tabs, a Medical row, a Medical screen with a medication `RecordRow`, and read-only details. But its screens are typed against `ExpPet003Events`, and its Info screen branches on `medicalPresentationAtom`. EXP-PET-002 established the completion pattern this design reuses: a terminal `*-added` screen calls `complete({ showCompletionView: false })` in a layout effect. The app's other forms (Figma "Contact info", nodes 820:18835 and 434:23287) edit each field from its own pencil, and `FieldRow` already renders that pencil through `onEdit`.

The Ginger medication fixture (`gingerMedication`) is Clavamox at 2 per day, so it can't be the starting point of this task. `frequencyPerDay` is a numeric string, and `formatFrequency` only localises whole numbers. The shared kit has no in-place field editor, and `TextField` only renders plain text inputs. `RecordRow` is a single `<button>`, so an action can't be nested inside it.

See `proposal.md` for motivation and `specs/` for the behaviour.

## Goals / Non-Goals

**Goals:**
- The variants differ only by the shortcut slot. Everything else on screen comes from the same components.
- Reuse EXP-PET-003 and EXP-PET-002 code by extracting it or following its pattern, not by importing another flow's typed screens.
- One Frequency control and one end state, whatever the entry point.
- Editing looks like editing anywhere else in the app: in place, one field at a time.

**Non-Goals:**
- Validating edited fields against an ontology. Typed terms are stored by label.
- Generalising the edit flow to other records.
- Making EXP-PET-003 configurable enough to host this experiment as extra variants. The tasks and success states differ.

## Decisions

### 1. The variant chooses the shortcut through initial state, like EXP-PET-003

`ExpPet004InitialState.medicationShortcut: 'none' | 'edit' | 'change-schedule'` is stored in `medicationShortcutAtom`. Each variant sets it in `initialState`. One flow-local `MedicationItem` reads it.
- **Why:** it mirrors `medicalPresentation` in EXP-PET-003, and `createStore` tests can check it. No screen differs between variants, so no `screens` overrides and no `null` screens are needed.
- **Alternative considered:** a per-variant `components` override of `MedicationItem`. It works with the runtime too, but it spreads the variable over three components that have to stay identical apart from the slot.

### 2. Views separate from screens, and no sheet

`MedicalView` and `MedicationDetailsView` render the content. The `medical`, `medication` and `medication-updated` screens wrap them, and `medication-updated` renders `MedicalView` with a `confirmation` prop. All editing happens inside these views, so there is no sheet screen.
- **Why:** the end state has to be the Medical screen. In-place editing needs no overlay, and so no origin to track.
- **Alternative considered (dropped):** an `edit-sheet` screen hosting the editor in `BottomSheet` over the screen it came from. It was replaced by in-place editing, to match how the app's other forms are edited.

### 3. Draft in Jotai, editing and expansion state local

- `editEntryPointAtom`: `'details_edit' | 'list_edit' | 'inline_schedule'`, the path that started the schedule edit.
- `scheduleDraftAtom`: the selected frequency.
- `startEditAtom` (write): resets the draft to the record's current frequency and sets the entry point. Callers record `medication_edit_started`: the Frequency pencil on details, B's shortcut and C's shortcut. Inside B's expanded form, the Frequency pencil only resets the draft, because the edit already started.
- `saveScheduleAtom` (write): replaces `medicationAtom` with `{ ...record, frequencyPerDay: draft }` and sets `scheduleSavedAtom`.
- `saveFieldAtom` (write): applies a draft for any other field through `applyFieldDraft`. It doesn't set `scheduleSavedAtom`, so the run doesn't complete.

Which field is being edited, the draft of a field other than Frequency, and whether B or C's item is expanded are all `useState`. They're local UI state, not shared, and unmounting on navigation gives "leaving discards the expansion" for free.
- **Alternative considered:** Jotai atoms for these. They would survive navigation and need manual resetting, which contradicts the spec.

### 4. `MedicationFormFields`, `ScheduleField` and `MedicationFieldEditor`

- `MedicationFormFields` renders `toMedicationFieldRows` as `FieldRow`s with pencils. It holds which field is open. While a field is open, the other rows get no `onEdit`, so only one edit is open. On close, focus returns to that row's pencil. The details card and B's expanded card both host it, with `entryPoint` `details_edit` or `list_edit`.
- `ScheduleField` is the Frequency field in edit mode: `SelectField` with the options `1`, `2` and `3`, labelled through the existing `pods.ginger.medication.frequency` plural key so the wording matches the summary. It sits in an `InlineFieldEditor` whose Save is disabled while the draft equals the record. It records `medication_schedule_changed`, `medication_edit_cancelled` and `medication_update_saved`. Cancel resets the draft. `MedicationFormFields` hosts it, and so does C's card, so every variant ends in identical controls.
- `MedicationFieldEditor` handles any other field: `TextField` (`text`, `number` for dose, `date` for start date) in an `InlineFieldEditor`. `toFieldDraft`, `isValidFieldDraft` and `applyFieldDraft` (in `model.ts`) convert between the record and the input's text. Save is disabled while the value is unchanged or unusable. A typed ingredient or dose form keeps its IRI only if it names a term the record already had, because the prototype has no ontology lookup.
- **Why a select, not the radio group:** chosen on request, so Frequency reads as one field among the others.

### 5. Shared kit additions

- **`RecordRow` action:** an optional `action?: { label: string; onClick: () => void }`. With an action, the white card moves to a wrapping `div` holding the existing row button plus a text action button below the lines, aligned with the title column and styled as a brand link-tone `Button`. Without an action, the markup is byte-for-byte what it is today, so EXP-PET-003 and variant A render identically.
  - *Alternative considered:* an absolutely positioned trailing button over the row. That's the trailing position we rejected in exploration, and it's fragile for hit areas.
- **`RadioGroupField`:** `primitives/radio.tsx` wraps Base UI `Radio` and `RadioGroup`, styled like `primitives/checkbox.tsx` (brand-700 checked state, the same focus ring). `shared/ui/radio-group-field.tsx` has the same `label / value / options / onChange` API as `SelectField`, and is registered in `podComponents`.
  - Since the switch to a select for Frequency, no flow uses it. It's kept as a design-system component.
- **`FieldRow` editor:** an optional `editor?: ReactNode`. When given, the row renders it in place of label, value and pencil, and keeps the label as a visually hidden `dt`.
- **`InlineFieldEditor`:** a `form` holding the input plus "Save" and "Cancel". It focuses its first control on mount, and submits on Enter only while Save is enabled. It owns no data.
- **`TextField` `type`:** `text` (default), `number` or `date`. The value is still reported as text.

### 6. Extract event-free EXP-PET-003 pieces into the Ginger pod

The following move to `pods/ginger/components/`, and EXP-PET-003 imports them from there with no behaviour change:
- `SubScreenTopBar` (gains optional `onMenu`, default no-op);
- `MedicationRow` (gains optional `action`, passed through to `RecordRow`);
- the Home markup as `GingerHomeView`, with `onOpenPod` and `onAppTabSelect` props.

`GingerTopBar` gains optional `onMenu`. EXP-PET-004 has its own thin screens (`home`, `ginger-notes`, `ginger-info`) that wire these views to `ExpPet004Events`. Its `ginger-info` is the fixed variant-A layout of EXP-PET-003, without the presentation branches.
- **Alternative considered:** import EXP-PET-003's screens directly. They track `ExpPet003Events` and read `medicalPresentationAtom`, which isn't in this flow's store. That only works by accident.
- **Alternative considered:** copy everything. That's about 150 duplicated lines, which would drift.

### 7. Fixture local to the flow

`apoquelMedication` is defined in `flows/exp-pet-004/model.ts` and passed through `createStore` as the default for `medicationAtom`. The shared `gingerMedication` is left untouched, so EXP-PET-002 and EXP-PET-003 are unaffected.

### 8. Completion and direct links

`medication-updated` calls `complete({ showCompletionView: false })` in a layout effect, as in EXP-PET-002. If `scheduleSavedAtom` is false (the screen was opened directly by URL), it first applies the task's target frequency `2`, so the end state can be reviewed in isolation. The confirmation is a flow-local banner with `role="status"`, styled with success tokens, above the Medications section.

### 9. In-place per-field editing in every variant

Every form of the medication follows the app's per-field pattern, and every field is really editable:
- **A:** the details card. Its Frequency pencil starts the edit (`details_edit`).
- **B:** "Edit medication" expands the list item into the same form (`list_edit`), headed with the medication's name and closed with "Close".
- **C:** "Change schedule" expands the item into just `ScheduleField`, headed "Change schedule" with the "{name} · {dose}" context (`inline_schedule`).

Only saving the Frequency shows `medication-updated` and completes the run. Saving another field updates the record in place, and records `medication_field_saved` with the field id but never the value.
- **Why:** the pencil should behave as it does elsewhere in the app. Real editing of other fields makes wrong-field attempts realistic and measurable.
- **Alternative considered:** other pencils recorded only. That's a dead control, which participants would notice.
- **Alternative considered:** the form-as-screen layout of 434:23287. The current details layout was kept on request. Only the editing changes.

## Risks / Trade-offs

- [The labels differ between B ("Edit medication") and C ("Change schedule"), on top of the container] → This is intended, because scope (record vs field) is the comparison. Report it as one factor, and don't claim label effects separately.
- [Fallback to details in B and C mutes completion-rate differences] → Make time to `medication_edit_started` and shortcut uptake (`entry_point ≠ details_edit`) the primary comparisons.
- [With one medication, the list can't show whether the shortcut adds visual noise] → Note the limitation in the study plan. A multi-item fixture can be supplied through initial state later.
- [A participant may pick a new frequency and assume it saved, then leave] → Save is the only commit and the card names the record. `medication_schedule_changed` without `medication_update_saved` measures this directly.
- [The record row's card moves to a wrapper only when an action is present] → A visual check in task 1 confirms that variant A, B and C items line up and that EXP-PET-003 is unchanged.
- [A participant may edit and save the wrong field and believe the task is done] → The run doesn't complete and the confirmation doesn't appear. `medication_field_saved` measures it, and the moderator doesn't intervene.
- [B's expanded form makes the Medical screen long] → It's a single medication. "+ Add medication" stays below it, and "Close" collapses the form.
- [The extraction touches EXP-PET-003] → It's limited to moving event-free components. EXP-PET-003's tests and a browser walkthrough verify there's no change.

## Migration Plan

None. This adds a flow. To roll it back, remove the registry entry. The extracted pod components can stay, because EXP-PET-003 uses them.

## Open Questions

- The exact ChEBI IRI for oclacitinib in the fixture. It's a data lookup that doesn't affect behaviour, and is resolved in task 2.1.
