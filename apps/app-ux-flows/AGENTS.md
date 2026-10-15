# app-ux-flows: agent notes

Vite + React prototype app for UX scenarios (`SC-*` showcases) and experiments (`EXP-*`). Flows live in `src/slices/flow/flows/<flow-id>/`. Behaviour is specified in `openspec/specs/app-ux-flows/**`. Read the flow's spec before changing it.

## Pod information model

Keep these layers separate. Don't derive one from another unless the code explicitly does so.

| Layer | Where | What it is |
|---|---|---|
| Category taxonomy | `pods/catalog/categories.ts` | `podcat:*` concepts (Pets > Medical > Veterinarians / Devices, Pets > Care & Feeding). These are classification only. |
| Templates and forms | `pods/catalog/templates.ts` | What a category's template adds to a pod (its declared form shapes). |
| Pod (cell) | `PodInstance`, `pods/ginger/model.ts` | A shareable unit with members, Notes / Chat / Info tabs and its own forms. |
| Records | for example `MedicationRecord` | Data held by a pod, shaped after the Tellipod ontology (`MeeFoundation/tpod-ontologies`, not vendored here). |
| UI projections | for example `pods/ginger/medication-fields.ts` | Functions that turn a record into what a screen shows. |

**The taxonomy is not the cell hierarchy.** A narrower category such as `PetsMedical` does not mean a sub-pod. Only create sub-pods where a flow's spec says so.

### Medical belongs to the pet pod

- A pet pod's medication records belong to that pod. On the pod's **Info** tab they are grouped under **Medical**: Ginger → Info → Medical → medication.
- Medical is **not** a sub-pod. It has no members and no sharing of its own.
- Older specs say otherwise. EXP-PET-002 calls its Medical screen "the Medical sub-pod", and SC-PET-001 suggests Medical and Care & Feeding as sub-pods. Don't copy that wording into new work. Aligning those specs is a separate change.

### Canonical location vs presentation

- Each record has **one owner**: one atom or fixture in the pod's model. Never copy record data into a screen's or flow's own state.
- Every surface reads the record through a **projection** next to the record's model:
  - `toMedicationFieldRows`: the full record, one row per field;
  - `toMedicationSummary`: name, dose, frequency, start date for list rows.

  Formatting rules (frequency wording, dates, units) live only in those functions.
- A summary shown outside its canonical place (a preview line, an inline section, a Telli answer card) is a **projection, not a second home**:
  - it links to the record's details;
  - details show the canonical breadcrumb (for example "Ginger > Medical");
  - summaries never open their own edit flow.
- Data limits: a pod's **current** medication is one record (`medicationAtom`). Finished courses live in `medicationCoursesAtom` and carry an `endDate`. Only flows that set courses (EXP-PET-005) can present "current" vs "past". Elsewhere, don't present them as if the data supported it.
- Doses: the current scheduled dose (`medicationDoseAtom`) and past dose events (`doseHistoryAtom`) are separate from the medication. Giving a dose never edits the medication record. Read history through `pods/ginger/dose-history.ts`. Giving and undoing go through `giveDoseAtom` and `undoDoseAtom`; the Apoquel fixture, Medical, dose history and the give and undo sheets live in `pods/ginger/` and are shared by EXP-PET-005 and SC-PET-002.

### People and member info

- `pods/people/sharing.ts` holds who is in a pod (`Member`) and pending invites. `Member.role` is a **permission** (`owner` or `viewer`), not a family role.
- `pods/people/member-info.ts` holds what each member shares (`MemberInfo.shared`) and the details other members added about them (`addedByOthers`). Its `role` field is the **family role** a member shares, such as "Dad". Show it with `sharedRole`, and fall back to the permission ("Can view") when it is `null`.
- Adding, keeping both, replacing and removing go through the pure functions in `member-info.ts`. Flows keep the result in their own atoms, as SC-PPL-002 does in `memberInfoAtom`.
- The invite link field and `copyToClipboard` live in `pods/people/components/invite-link-field.tsx`, shared by SC-PPL-002 and SC-PET-001.

### Which row component

| Component | Use for |
|---|---|
| `CategoryRow` | A group with a count (Medical, Attachments, Members). An optional `preview` line summarises the group's content. |
| `RecordRow` | One record in a list: title, optional secondary and meta lines. |
| `FormCard` + `FieldRow` | The full record. A `FieldRow` without `onEdit` is read-only. Use read-only rows in retrieval scenarios. |
| `CategoryCell` (SC-PET-001) | An inert structure row. It can't record taps. |

## Flow conventions

- **Variants that differ in one block** use an initial-state flag that the shared view reads, not a screen override per variant. A screen only some variants have is `null` in the base flow and implemented by those variants.
- **Hidden flows, variants and cases:** mark unfinished work `hidden: true`. It shows only in dev mode (the dev server, or a deployed app opened with `?mode=dev`), with a "Hidden in production" label; production builds treat it as undeclared, so its URLs fall back like unknown ones. A flow whose variants or cases are all hidden is hidden as a whole. Don't hide a variant during a live study: participants assigned to it are reassigned.
- **Experiments** show no briefing. If the outcome is observed by a moderator, they don't call `complete()`. Task wording lives in the spec, never in the app.
- **Analytics:** declare events in the flow's `*Events` type. Use the same event name for the same intent in every variant, and tell paths apart with a property such as `entry_point`. Record taps on inert controls so wrong turns are measurable. Never send record content.
- **Shared code:** flow-specific views stay in the flow folder, and flows don't import from each other. Reusable pod pieces go in `src/slices/flow/pods/`, and generic UI goes in `src/shared/ui/` (registered in `podComponents`).
