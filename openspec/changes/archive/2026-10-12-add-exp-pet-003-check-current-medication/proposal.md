## Why

Scenario **SC-PET-003 "Check current medication"** asks whether Alice can quickly find and understand what Ginger is taking and how often. Earlier prototypes only covered *adding* a medication (EXP-PET-002, chat-add-medication). Nothing tests *reading* one back, or how much of the medication should be visible before the participant opens it. Exploration settled the information architecture to test: the medication record belongs to Ginger, and on Ginger's Info tab it is grouped under **Medical**, which is not a pod of its own. What is still open is how Medical presents its content there. We want to compare that with participants before design invests in one option.

## What Changes

- **New experiment flow `exp-pet-003`** ("Check current medication", display code `EXP-PET-003`, scenario SC-PET-003). The variant is chosen explicitly on the home page, so a moderator can pick it for each participant. There are three variants that differ **only on Ginger's Info tab**:
  - `a` (EXP-PET-003-A, "Medical row"): Info shows a Medical row with a count. Activating it opens the Medical screen, which lists Clavamox with dose, frequency and start date. The answer is on the Medical screen.
  - `b` (EXP-PET-003-B, "Medical row with preview"): the same Medical row also shows a preview line "Clavamox · 2 times per day". The answer is on Info, and the row still opens the Medical screen.
  - `c` (EXP-PET-003-C, "Medical inline"): Info shows a "Medical" section listing Clavamox with dose and frequency directly, and there is no Medical row. The answer is on Info.
- **Shared screens**: Home with Ginger in a pod list; Ginger Notes; Ginger Info; Medical (variants A and B); and a **read-only** Clavamox details screen showing the full record, used by all variants.
- **Read-only retrieval**: no screen offers editing or deleting. Wherever medications are listed, a "+ Add medication" action is shown, but it is only recorded. The flow never completes by itself. The moderator records the participant's answer.
- **Standalone fixture**: Ginger (Pets pod) holds one medication record, the existing Clavamox fixture. It does not depend on the EXP-PET-002 run state.
- **Analytics events** for the first action, wrong turns and unnecessary detail opening. Every variant uses the same event names.
- **Design-system additions**:
  - a *record row*: icon, title, secondary line, optional meta line, chevron;
  - an optional *preview line* on the category row;
  - *read-only field rows*: a field row without an edit action shows no edit button.

Out of scope:
- a "Current medication" summary section separate from Medical (Variant B of the exploration);
- a generic "Active / Current care" section (Variant C of the exploration);
- asking Telli (Variant D);
- current vs past medications: the record has no end date or status;
- Medical as a sub-pod;
- Figma frames, which don't exist yet;
- any change to EXP-PET-002 or SC-PET-001.

## Capabilities

### New Capabilities
- `app-ux-flows/experiments/exp-pet-003`: the EXP-PET-003 experiment. Covers the hypothesis, the usability task, the three variants, the screens and navigation, the fixture and how the medication summary and details are shown, and the analytics events.

### Modified Capabilities
- `app-ux-flows/design-system`: the Info list components gain a record row and an optional preview line on the category row. The form card's field rows may be read-only.

## Impact

- Code (all in `apps/app-ux-flows/src`):
  - New: `slices/flow/flows/exp-pet-003/**` (flow, model, screens, flow-specific components, tests).
  - New shared component: `shared/ui/record-row.tsx`, registered in `shared/ui/pod-components.ts`.
  - Changed:
    - `shared/ui/category-row.tsx`: optional preview line;
    - `shared/ui/form-card.tsx`: optional `onEdit`;
    - `slices/flow/pods/ginger/medication-fields.ts`: a summary projection next to the existing field rows;
    - `slices/flow/pods/ginger/components/ginger-top-bar.tsx`: optional `onBack`, defaulting to the current no-op;
    - `slices/flow/registry.ts` and its test;
    - `app/locales/en.ts`.
- Reused unchanged: the Ginger pod fixture, avatar and medication fixture (`pods/ginger/model.ts`), `NotesArea`, `PodScreen`, `PodTopBar`, `SegmentedTabs`, `SectionLabel`, `Divider`, `AppTabBar`.
- Existing callers of `FieldRow` and `CategoryRow` keep their current look and behaviour.
- Browser storage: a new `ux-flows:variant:exp-pet-003` key.
- No new dependencies.
