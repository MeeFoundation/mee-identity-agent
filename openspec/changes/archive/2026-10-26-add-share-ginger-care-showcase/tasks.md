## 1. Model

- [x] 1.1 Add the "Can log doses" role to the member role type with its label function, and verify `sharing.test.ts` covers the label of each role
- [x] 1.2 Make `onGive`, `onAddMedication` and the category rows' Members row optional or overridable so a flow can omit a control, and verify the existing SC-PET-002 and EXP-PET-005 tests still pass
- [x] 1.3 Cover the dose rules (a viewer gets no Give control, a dose someone else gave offers no second give) and verify the tests in `sc-pet-006.test.ts` pass

## 2. Flow

- [x] 2.1 Create `flows/sc-pet-006/` with `model.ts` (initial state with the viewing member's access and goal, pending invites, links) and `flow.ts` (screens, cases), and verify the flow appears in the registry with code `SC-PET-006`
- [x] 2.2 Build `info`, `members`, `invite-name` (with the access choice) and `invite-share`, and verify case A can create and send an invite
- [x] 2.3 Build `medical`, `give-dose` and `dose-history` for the sitter, with the Give control absent for "Can view", and verify cases B and C
- [x] 2.4 Show the giver's name in the dose card and history, and verify "Given {time} · Sam" and "You"

## 3. Strings, briefing and listing

- [x] 3.1 Add English strings, goals, hints, screen explanations and open questions to `app/locales/en.ts` and verify no raw keys appear
- [x] 3.2 List SC-PET-006 after SC-PET-005 in the "Pet care" group and verify the registry order test

## 4. Verification

- [x] 4.1 Write `sc-pet-006.test.ts` covering the spec's scenarios for the three cases and verify it passes
- [x] 4.2 Run `pnpm check-types` and `pnpm lint` and verify both pass with no errors
