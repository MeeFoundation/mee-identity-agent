## 1. Shared components

- [x] 1.1 Make `FieldRow`'s `onEdit` optional in `shared/ui/form-card.tsx`. Without it, no edit button is rendered. Verify with `pnpm check-types`, and in the browser that EXP-PET-002's `medication-added` still shows the pencils.
- [x] 1.2 Add an optional `preview` to `CategoryRow`, shown under the label in smaller muted text and included in the accessible name. Without it, markup and `ui.categoryRow.label` stay unchanged. Verify that EXP-PET-002's `ginger-info` looks unchanged, and that a row with a preview is announced with label, count and preview.
- [x] 1.3 Add `RecordRow` (`shared/ui/record-row.tsx`) with `icon`, `title`, optional `description`, optional `meta` and `onClick`, and register it in `podComponents`. Verify with `pnpm check-types`, and in the browser that it is one button whose accessible name includes every visible line.
- [x] 1.4 Add an optional `onBack` to `GingerTopBar`, defaulting to the current no-op. Verify that EXP-PET-002 and chat-add-medication still type-check and that their back controls remain inert.

## 2. Medication summary projection

- [x] 2.1 Add `toMedicationSummary(record, t, language)` to `pods/ginger/medication-fields.ts`, returning `{ name, dose, frequency, startDate? }` and sharing the dose, frequency and start-date formatters with `toMedicationFieldRows`. Verify with new cases in `medication-fields.test.ts`:
  - the brand name is used when present, otherwise the ingredients;
  - the dose has a unit symbol, or no unit;
  - frequency `1`, `2` and free text;
  - no start date.

  Verify also that the existing field-row tests still pass.

## 3. EXP-PET-003 flow model and definition

- [x] 3.1 Add `flows/exp-pet-003/model.ts`:
  - screen ids `home`, `ginger-notes`, `ginger-info`, `medical`, `medication`;
  - `ExpPet003Components` (Ginger pod components);
  - `ExpPet003Events`, with the six events and properties from the spec;
  - `ExpPet003InitialState`: `pod`, `medication`, `medicalPresentation`, `podOpensOn`;
  - `medicalPresentationAtom` and `podOpensOnAtom`.

  Verify with `pnpm check-types`.
- [x] 3.2 Add `flows/exp-pet-003/flow.ts`:
  - experiment `exp-pet-003`, code `EXP-PET-003`, `variantSelection: 'explicit'`, initial screen `home`;
  - base `medical: null`;
  - variants `a`, `b` and `c` with codes, name and description keys, and `medicalPresentation` set to `row`, `row-with-preview` and `inline`;
  - `a` and `b` implement `medical`;
  - `createStore` resets every atom from initial state, with defaults `gingerPod`, `gingerMedication`, `row` and `info`.

  Register it in `registry.ts`. Verify with `pnpm check-types` and `registry.test.ts`.
- [x] 3.3 Add the `flows.expPet003.*` strings to `app/locales/en.ts`:
  - title, description, variant names and descriptions;
  - Home greeting and "Pods";
  - "Forms", "Pet", "Medical", "Medications";
  - the summary templates "{{dose}} · {{frequency}}", "{{name}} · {{frequency}}" and "Started {{date}}".

  Verify with `pnpm check-types`, and in the browser that no raw key shows on any screen.

## 4. EXP-PET-003 screens

- [x] 4.1 Add `ExpPet003TopBar`, wrapping `GingerTopBar`: Notes and Info navigate, Chat is tracked and stays, back goes to `home`, and every tab records `pod_tab_selected`. Add the `ginger-notes` screen with `NotesArea`. Verify in the browser that the "Back to Home" and "Chat is inert" scenarios work.
- [x] 4.2 Add the `home` screen:
  - greeting, "Pods" label and a flow-local Ginger pod row (avatar, "Ginger", "Pets") that records `pod_opened` and opens `podOpensOn`;
  - `AppTabBar` with Home active; Ask Telli and Navigation record `app_tab_selected` and stay.

  Verify in the browser that the "Open Ginger" and "Ask Telli is inert" scenarios work. Cover "Opening on Notes" with the `podOpensOn: 'notes'` store test in 5.1.
- [x] 4.3 Add `GingerInfoView` and the `ginger-info` screen:
  - the Forms section with the Pet `RecordRow`, which records `info_row_selected`;
  - per `medicalPresentationAtom`, either the Medical `CategoryRow` (count = 1, `preview` in `row-with-preview`, records `medical_opened` and shows `medical`), or, in `inline`, a "Medical" section of medication `RecordRow`s that record `medication_opened { entry_point: 'ginger_info' }`;
  - the divider, then Attachments, Subpods and Members, which record `info_row_selected`.

  Verify in the browser with `?variant=a|b|c` that the "Variant A hides the medication", "Variant B previews the medication", "Medication listed inline" and "Wrong turn is visible" scenarios work.
- [x] 4.4 Add the `medical` screen: top bar without tabs (Ginger avatar, "Medical", breadcrumb "Ginger >", back = `back()`), and a "Medications" section of medication `RecordRow`s that record `medication_opened { entry_point: 'medical_screen' }`. Verify in the browser that the "Medication listed on Medical" and "Back from Medical" scenarios work, and that `/flows/exp-pet-003/medical?variant=c` behaves as an undeclared screen.
- [x] 4.5 Add the `medication` screen: top bar with the Ginger avatar, the medication's name, breadcrumb "Ginger > Medical", and back = `back()`; a `FormCard` with read-only `FieldRow`s from `toMedicationFieldRows`, and no footer or Create form. Verify in the browser that the "Full record" and "Back to where it was opened" scenarios work, and that no edit control is reachable by keyboard.

## 5. Tests and checks

- [x] 5.1 Add `exp-pet-003.test.ts`. Verify that `pnpm --filter app-ux-flows test` passes with it covering:
  - three variants with unique codes;
  - `medicalPresentation` matches whether a variant implements `medical`: `inline` ⇔ no `medical`;
  - `createStore` defaults and initial-state overrides (medication, `podOpensOn`);
  - the flow is an experiment with no goal or hints.
- [x] 5.2 Check the analytics in the development console in each variant. Walk Home → Ginger → (Medical) → Clavamox and back. Verify that the console shows exactly the declared events, with their properties and no medication content.
- [x] 5.3 Run `pnpm check-types` and `pnpm lint` from the repo root, and verify both pass with no errors.

## 6. Add medication action

- [x] 6.1 Add `add_medication_selected { entry_point }` to `ExpPet003Events`, and a flow-local `AddMedicationAction` (outlined tertiary "+ Add medication" button) that only records it. Show it under the medication rows on `medical` (A/B) and in the inline Medical section on `ginger-info` (C). Verify in the browser that it is present in every variant, that activating it records the event with the right `entry_point` and keeps the screen, and that `pnpm check-types`, `pnpm lint` and the tests pass.
