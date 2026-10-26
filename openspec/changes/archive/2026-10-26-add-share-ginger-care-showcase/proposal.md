## Why

The pet series (SC-PET-001 to SC-PET-005) ends with Ginger's care data in place, and SC-PET-001's proposal named a last step: "Share Ginger's care". Nothing yet studies handing that care to someone else. A pet sitter's main job is giving a dose, but the permission model today is only `owner | viewer`, and SC-PPL-003 shows that a viewer can't change anything. We need to see how the owner chooses what a sitter may do, and what the sitter then sees and can do.

## What Changes

- Add the showcase SC-PET-006 "Share Ginger's care" with three cases, listed after SC-PET-005 in the "Pet care" group:
  - A: the owner invites a sitter, choosing "Can view" or "Can log doses", and sends the link;
  - B: the sitter with "Can view" reads Ginger's Medical, Meals and Care instructions, and no Give dose control is shown;
  - C: the sitter with "Can log doses" gives the due dose, and the owner's dose history shows who gave it.
- Add a third access level, "Can log doses", between owner and viewer. It allows giving and undoing doses and nothing else.
- Dose cards show a dose that someone else already gave, so a second person is not offered the same dose.
- SC-PPL-002 and SC-PPL-003 are not changed. They hold only owners and viewers, and their screens keep working as they are.
- Out of scope: sharing only part of a pod, real invites or accounts, a permission editor for existing members, and aligning the older "Medical sub-pod" wording in SC-PET-001 and EXP-PET-002.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-pet-006`: the showcase's identity, screens, fixture, invite with access choice, sitter views, dose logging with attribution, cases and briefing.

### Modified Capabilities
<!-- None. Existing showcase requirements keep their behavior. -->

## Impact

- New flow `apps/app-ux-flows/src/slices/flow/flows/sc-pet-006/` and its registration, strings in `app/locales/en.ts`, and a test file next to the flow.
- `slices/flow/pods/people/sharing.ts`: the member role type gains a value for "Can log doses"; the label text for it is added with the existing "Owner" and "Can view" labels.
- `slices/flow/pods/ginger/`: reused as is. `DoseEvent` and `MedicationDose` already carry `givenBy`, and `giveDoseAtom` is reused as is. The dose card, the Medical view and the category rows gain optional props so a flow can leave a control out.
- Reused: `invite-link-field`, the invite and share sheets' patterns from SC-PPL-002, and the pod chrome from SC-PPL-003.
