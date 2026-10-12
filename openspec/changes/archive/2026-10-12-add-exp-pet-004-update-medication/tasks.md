## 1. Shared components

- [x] 1.1 Add `shared/ui/primitives/radio.tsx`, wrapping Base UI `Radio` and `RadioGroup` in the styling of `primitives/checkbox.tsx`. Add `shared/ui/radio-group-field.tsx` with `label`, `value`, `options` and `onChange`, mirroring `SelectField`'s API, and register it in `podComponents`. Verify with `pnpm check-types`, and in the browser that pointer, label click, arrow keys and Tab behave as in the "Radio group field component" scenarios, and that a screen reader announces "Schedule" radio group.
- [x] 1.2 Add an optional `action: { label, onClick }` to `RecordRow`. With it, the card moves to a wrapping element that holds the row button and a separate text action button below the lines. Without it, the markup is unchanged. Verify with `pnpm check-types`, that EXP-PET-003's Medical screen looks unchanged in the browser, and that the action and the row run only their own handlers.
- [x] 1.3 Add an optional `onMenu` to `GingerTopBar`, defaulting to a no-op. Verify that EXP-PET-002, EXP-PET-003 and chat-add-medication type-check and that their menu controls stay inert.

## 2. Ginger pod extraction and fixture

- [x] 2.1 Look up the ChEBI IRI for oclacitinib. Add `apoquelMedication` to `flows/exp-pet-004/model.ts`: Oclacitinib, Apoquel, Zoetis, 16 mg, Tablet (reusing the existing DRON tablet IRI), frequency `1`, start 2026-09-14. Verify with a `toMedicationFieldRows` assertion in the flow test (task 5.1) showing "Once per day" and "Sep 14, 2026".
- [x] 2.2 Move `SubScreenTopBar` (adding optional `onMenu`) and `MedicationRow` (adding optional `action`, passed through to `RecordRow`) from `flows/exp-pet-003/components/` to `pods/ginger/components/`. Extract the Home header and pod row markup into `pods/ginger/components/ginger-home-view.tsx` with `onOpenPod` and `onAppTabSelect` props. Point EXP-PET-003 at them. Verify that `pnpm --filter app-ux-flows test` passes and that a browser walkthrough of EXP-PET-003 variants A, B and C shows the same screens and console events as before.

## 3. EXP-PET-004 model and flow definition

- [x] 3.1 Complete `flows/exp-pet-004/model.ts`. Verify with `pnpm check-types`. It contains:
  - screen ids `home`, `ginger-notes`, `ginger-info`, `medical`, `medication`, `edit-sheet` and `medication-updated`;
  - `ExpPet004Components`;
  - `ExpPet004Events`, with every event and property from the spec;
  - `ExpPet004InitialState`: `pod`, `medication`, `medicationShortcut`;
  - the atoms `medicationShortcutAtom`, `editSessionAtom`, `scheduleDraftAtom` and `scheduleSavedAtom`;
  - the write atoms `startEditAtom` and `saveScheduleAtom`.
- [x] 3.2 Add `flows/exp-pet-004/flow.ts`. Register it in `registry.ts` and add it to the registry test. Verify with `pnpm check-types` and `registry.test.ts`. The flow is:
  - experiment `exp-pet-004`, code `EXP-PET-004`, explicit variant selection, initial screen `home`;
  - variants `a`, `b` and `c` with codes, name and description keys, and `medicationShortcut` set to `none`, `edit` and `change-schedule`;
  - a `createStore` that resets every atom, with defaults `gingerPod`, `apoquelMedication`, `none`, origin `medical`, and not saved.
- [x] 3.3 Add the `flows.expPet004.*` strings to `app/locales/en.ts`:
  - title, description, variant names and descriptions;
  - Home greeting and "Pods";
  - "Forms", "Medical", "Medications", "+ Add medication";
  - "Edit medication", "Change schedule", "Schedule", "Save changes", "Cancel", "Medication updated";
  - the summary and context templates.

  Verify in the browser that no raw key shows on any screen in any variant.

## 4. EXP-PET-004 screens

- [x] 4.1 Add `ExpPet004TopBar` (Ginger tabs, back to `home`, `pod_tab_selected`, `pod_menu_selected`), plus the `home` screen on `GingerHomeView` and the `ginger-notes` screen on `NotesArea`. Verify in the browser that Home opens `ginger-info`, Ask Telli and Navigation stay and are recorded, Chat stays, and menu taps record `pod_menu_selected`.
- [x] 4.2 Add the `ginger-info` screen with the fixed variant-A layout: the Pet row, a divider, then Medical (count 1, no preview), Attachments, Subpods and Members, with `medical_opened` and `info_row_selected`. Verify in the browser that the "Same path in every variant" scenario holds for `?variant=a|b|c`.
- [x] 4.3 Add `ScheduleEditor`: *(Superseded by section 6: in-place editing replaces the sheet and the radio group.)*
  - the context line;
  - `RadioGroupField` with options `1`, `2` and `3` through the frequency plural key;
  - "Save changes", disabled while the draft equals the record;
  - "Cancel";
  - the events `medication_schedule_changed`, `medication_edit_cancelled` and `medication_update_saved`.

  Verify with a unit test of `saveScheduleAtom` (updates the frequency, keeps one record, sets saved), and in the browser that the "Selecting does not save" and "Save unavailable until changed" scenarios hold.
- [x] 4.4 Add a flow-local `MedicationItem` on `MedicationRow`. Per `medicationShortcutAtom` it shows no action, "Edit medication" (calls `startEditAtom` with `list_edit` and shows `edit-sheet`), or "Change schedule" (calls `startEditAtom` with `inline_schedule` and expands in place into a card hosting `ScheduleEditor`, focus moved inside, Cancel collapses). Activating the row records `medication_viewed` and shows `medication`. Verify in the browser that the "No shortcut in variant A", "Edit from the list in variant B", "Item opens details in every variant", "Change inline" and "Cancel inline" scenarios hold.
- [x] 4.5 Add `MedicalView` (sub-screen top bar "Medical", the "Medications" label, `MedicationItem`, a recorded-only "+ Add medication", and an optional `confirmation` banner with `role="status"`) and the `medical` screen. Verify in the browser that back returns to `ginger-info`, and that "+ Add medication" records `add_medication_selected` and changes nothing.
- [x] 4.6 Add `MedicationDetailsView` (top bar titled with the name, breadcrumb "Ginger > Medical", an expanded `FormCard`) and the `medication` screen.
- [x] 4.6a Switch `MedicationDetailsView` to per-field editing: remove the footer "Edit medication", give every `FieldRow` an `onEdit`. Frequency calls `startEditAtom` with `details_edit`, origin `medication`, and shows `edit-sheet`. Other fields record `medication_field_edit_selected` with `field`. Add the event to `ExpPet004Events`. Verify in the browser that the "Details offer per-field edit in every variant", "Edit the frequency from details" and "Other field edits are recorded only" scenarios hold, and that each pencil is keyboard-reachable with the name "Edit {field}". *(Superseded by section 6: in-place editing replaces the sheet and the radio group.)*
- [x] 4.7 Add the `edit-sheet` screen: `BottomSheet` titled "Edit medication" over `MedicalView` or `MedicationDetailsView` per `editSessionAtom.origin`, hosting `ScheduleEditor`. Cancel, Escape and the backdrop cancel the edit and go back. Save shows `medication-updated`. Verify in the browser that the "Cancel returns to where it was opened" scenario holds, and that a direct open of `/flows/exp-pet-004/edit-sheet` shows over Medical. *(Superseded by section 6: in-place editing replaces the sheet and the radio group.)*
- [x] 4.8 Add the `medication-updated` screen: `MedicalView` with the "Medication updated" confirmation. In a layout effect, it applies frequency `2` if nothing was saved, then calls `complete({ showCompletionView: false })`. Verify in the browser that the "Same end state from every entry point" and "A different schedule is still saved" scenarios hold, and that a direct URL open shows "2 times per day".

## 5. Tests and checks

- [x] 5.1 Add `exp-pet-004.test.ts`. Verify that `pnpm --filter app-ux-flows test` passes with it covering:
  - three variants with unique codes, and `medicationShortcut` set to `none`, `edit` and `change-schedule`;
  - every declared screen implemented in every variant;
  - `createStore` defaults (Apoquel, frequency `1`) and initial-state overrides;
  - `startEditAtom` resets the draft and session;
  - the flow is an experiment with no goal or hints.
- [x] 5.2a Re-run the analytics check for the details entry point through the Frequency pencil, and check that `medication_field_edit_selected` carries only the field id.
- [x] 5.2 Check the analytics in the development console for each variant and each entry point (details, list, inline). Verify the event order is `medication_edit_started` → `medication_schedule_changed` → `medication_update_saved` → `flow_completed`, with the right `entry_point`, `from` and `to`, that cancelling records `changed`, and that no event carries medication names.
- [x] 5.3 Run `pnpm check-types` and `pnpm lint` from the repo root, and verify both pass with no errors.

## 6. In-place editing (replaces the edit sheet)

- [x] 6.1 Shared kit: add an optional `editor` to `FieldRow`, a `type` (`text`, `number`, `date`) to `TextField`, and a new `InlineFieldEditor` (input plus Save and Cancel, focus on open, Enter saves). Register it in `podComponents` and add the `ui.inlineFieldEditor.*` strings. Revert the function-children change to `BottomSheet`, which nothing uses any more. Verify with `pnpm check-types`.
- [x] 6.2 Model: drop the `edit-sheet` screen and the edit origin. Replace `editSessionAtom` with `editEntryPointAtom`, so `startEditAtom` takes an entry point. Add `toFieldDraft`, `isValidFieldDraft`, `applyFieldDraft` and `saveFieldAtom`, plus the `medication_field_saved` and `medication_field_edit_cancelled` events, and add `entry_point` to `medication_field_edit_selected`. Export `OntologyTerm` and make its IRI optional for typed terms. Verify with unit tests for drafts, validation, IRI retention, and a field save that doesn't complete the run.
- [x] 6.3 Components: `ScheduleField` (`SelectField` in `InlineFieldEditor`), `MedicationFieldEditor` (`TextField` in `InlineFieldEditor`), and `MedicationFormFields` (one field open at a time, focus back on the pencil). Use them in `MedicationDetailsView`, in B's expanded form card with "Close", and in C's "Change schedule" card. Remove `edit-sheet-screen.tsx` and `schedule-editor.tsx`. Verify in the browser that the "In-place field editing", "List form in variant B" and "Inline schedule change in variant C" scenarios hold for every variant.
- [x] 6.4 Re-check the analytics for each entry point: the order is `medication_edit_started` → `medication_schedule_changed` → `medication_update_saved` → `flow_completed`, with the right `entry_point`, `from` and `to`. Field events carry only `entry_point` and `field`. Run `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows test`.
