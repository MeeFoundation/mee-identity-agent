## Why

The pet scenarios so far cover adding a medication (EXP-PET-002) and checking one (EXP-PET-003). Nothing yet tests the next step: **changing a medication that already exists**. We want to know how participants discover that a stored medication can be edited, and how they get into editing it. We also want to compare a conventional details-first path with two list-level shortcuts before design invests in one of them.

## What Changes

- **New experiment flow `exp-pet-004`** ("Update medication", display code `EXP-PET-004`). The moderator chooses the variant explicitly. The participant is told only: "Update Ginger's Apoquel schedule from once a day to twice a day." Every variant starts on Home.
- **A stable baseline from EXP-PET-003-A:** Home → Ginger Info → Medical row → Medical screen, which lists Apoquel as one medication item. This fixes the information architecture so that EXP-PET-004 does not retest it.
- **In-place field editing, as in the app's other forms** (Figma "Contact info", nodes 820:18835 and 434:23287). Every field row has its own pencil. Tapping it turns the row into the field's input, with "Save" and "Cancel", right where the value was. There is no edit sheet. Every field is editable, but only saving the Frequency completes the task.
- **A details screen with this form in every variant.** Activating the medication item opens Apoquel's details. This is the control path, and nobody hits a dead end.
- **Three variants that differ only in a shortcut slot under the medication item on the Medical screen:**
  - `a` (EXP-PET-004-A, "Details, then edit"): no shortcut.
  - `b` (EXP-PET-004-B, "Edit from the list"): an "Edit medication" action that expands the item in place into the whole form, every field editable as on details.
  - `c` (EXP-PET-004-C, "Change schedule inline"): a "Change schedule" action that expands the item in place into just the Frequency field, already in edit mode.
- **One Frequency control, the same in every variant.** It's a select (Once per day, 2 times per day, 3 times per day), with "Save" (enabled only once the value differs) and "Cancel". Nothing is saved until "Save" is pressed.
- **One end state.** Saving updates the existing Apoquel record rather than adding one. The participant then sees the Medical screen with a "Medication updated" confirmation and Apoquel at its new schedule, and the run completes.
- **Fixture:** Ginger holds one medication, Apoquel (oclacitinib, Zoetis, 16 mg tablet, once per day). It is defined in this flow, so EXP-PET-002 and EXP-PET-003 are unaffected.
- **Analytics events** for reaching the medication, wrong turns (including editing the wrong field), which entry point started the edit, schedule changes, cancellation and saving. All variants use the same event names.
- **Shared additions:**
  - in-place editing for form field rows, a shared inline field editor (input + Save/Cancel), and number and date text fields;
  - a radio group field in the design system;
  - an optional action under the record row's lines;
  - optional menu handlers on the Ginger and sub-screen top bars, so menu taps can be recorded.
- **Behaviour-preserving extraction:** EXP-PET-003's event-free Home view, sub-screen top bar and medication row move into the Ginger pod components so that both experiments share them.

Out of scope:
- deleting a medication;
- editing ontology-backed fields against a real ontology lookup: a typed ingredient or dose form keeps its IRI only if it is unchanged;
- an "As needed" schedule, which the frequency format cannot show yet;
- swipe gestures and overflow menus as edit entry points;
- Figma frames;
- any behaviour change to EXP-PET-002, EXP-PET-003 or SC-PET-001.

## Capabilities

### New Capabilities
- `app-ux-flows/experiments/exp-pet-004`: the EXP-PET-004 experiment. Covers the hypothesis, the usability task, the three variants, the screens and navigation, the Apoquel fixture, in-place field editing, the end state and the analytics events.

### Modified Capabilities
- `app-ux-flows/design-system`: the record row gains an optional action shown under its lines. A form card field row can show an editor in place. The text field can be a number or date input. New inline field editor and radio group field components are added.

## Impact

- Code (all in `apps/app-ux-flows/src`):
  - New: `slices/flow/flows/exp-pet-004/**` (flow, model, screens, flow-specific components, tests).
  - New shared component: `shared/ui/inline-field-editor.tsx`, registered in `shared/ui/pod-components.ts`.
  - New shared component: `shared/ui/radio-group-field.tsx`, plus the `shared/ui/primitives/radio.tsx` wrapper around Base UI's radio and radio group. Registered in `shared/ui/pod-components.ts`.
  - Changed:
    - `shared/ui/record-row.tsx`: optional action;
    - `shared/ui/form-card.tsx`: `FieldRow` gains an optional in-place `editor`;
    - `shared/ui/text-field.tsx`: optional `type` (`text`, `number`, `date`);
    - `slices/flow/pods/ginger/model.ts`: `OntologyTerm` is exported, and its IRI is optional for typed terms;
    - `slices/flow/pods/ginger/components/ginger-top-bar.tsx`: optional `onMenu`;
    - `slices/flow/registry.ts` and its test;
    - `app/locales/en.ts`.
  - Moved from `flows/exp-pet-003/components/` to `pods/ginger/components/`, with EXP-PET-003's behaviour unchanged:
    - `sub-screen-top-bar.tsx` (gains an optional `onMenu`);
    - `medication-row.tsx` (gains an optional action);
    - the Home view markup.
- Reused unchanged: `PodScreen`, `PodTopBar`, `SegmentedTabs`, `CategoryRow`, `SectionLabel`, `Divider`, `AppTabBar`, `SelectField`, `Button`, `NotesArea`, `toMedicationSummary` and `toMedicationFieldRows`.
- Browser storage: a new `ux-flows:variant:exp-pet-004` key.
- No new dependencies. `@base-ui/react` already provides radio and radio group.
