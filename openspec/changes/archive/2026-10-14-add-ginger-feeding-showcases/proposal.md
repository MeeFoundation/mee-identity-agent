## Why

Ginger's pod covers medication from creation to dosing, but nothing shows how she is fed, though the Tellipod example gives her a Care & Feeding pod shared with a second caregiver. The ontology records feeding as free-text instructions (graph 60), while caregivers who share a pet also need to know whether a meal has been given. We want both in front of reviewers: writing and reading the instructions, and logging meals without feeding Ginger twice.

## What Changes

- **New Care & Feeding row on Ginger's Info**, opening a Care & Feeding screen next to Medical. The row is opt-in: Ginger flows that don't ask for it are unchanged.
- **New showcase `sc-pet-003`** ("Care instructions", display code `SC-PET-003`), starting on Ginger's Info, with four cases:
  - `a` (SC-PET-003-A, "Write"): Care & Feeding is empty; the participant, Ginger's owner, writes how she is fed.
  - `b` (SC-PET-003-B, "Feed as sitter"): the participant looks after Ginger in a pod Alice shared, checks how much she eats, then feeds her dinner and records it. Only the owner can change the instructions; the sitter can mark meals as fed and see the feeding history.
  - `c` (SC-PET-003-C, "Ask Telli"): the same sitter pod; the participant asks Telli in the pod chat instead of reading.
  - `d` (SC-PET-003-D, "Tidy into schedule"): Telli finds the two meal times in the instructions and offers to set up a feeding schedule.
- **New showcase `sc-pet-004`** ("Meals", display code `SC-PET-004`), starting on Ginger's Info shared with Sam, with today's breakfast and dinner, and four cases:
  - `a` (SC-PET-004-A, "Log a meal"): breakfast is due; mark it as fed.
  - `b` (SC-PET-004-B, "Double feed"): Sam fed Ginger 20 minutes ago; find out before feeding her again.
  - `c` (SC-PET-004-C, "Undo fed"): dinner was marked as fed by mistake; undo it.
  - `d` (SC-PET-004-D, "Partly eaten"): Ginger ate only half her breakfast; record how much.
- Meals reuse the dose patterns of SC-PET-002 (card treatments, confirmation sheet, undo sheet, toast) and add an amount eaten and a warning before feeding a meal someone else already gave.
- **Feeding history** in both showcases: a row on Care & Feeding opens the last 7 days of meals, by day, with who fed each one, how much Ginger ate, and missed meals.
- The instruction text is the one in the Tellipod example's graph 60.
- No Figma frames yet: screens are built from the existing pod components and declare no `designFrames`.

Out of scope:
- Care & Feeding as a nested pod with its own members, and sharing it on its own;
- changing the food after a vet visit, reminders, and filtering or paging the feeding history (listed as open questions where relevant);
- analytics: showcases are not tracked.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-pet-003`: the SC-PET-003 "Care instructions" showcase.
- `app-ux-flows/showcases/sc-pet-004`: the SC-PET-004 "Meals" showcase.

### Modified Capabilities
None. The Care & Feeding row is opt-in, so no existing flow's behaviour changes.

## Impact

- New: `apps/app-ux-flows/src/slices/flow/flows/sc-pet-003/**`, `flows/sc-pet-004/**`, and Care & Feeding pieces in `pods/ginger/` (feeding model, meal-time recognition, feeding history, meal card and sheets, Care & Feeding and feeding history views, Telli feeding answers).
- Changed: `pods/ginger/components/ginger-category-rows.tsx` (optional Care & Feeding row); `registry.ts` and the registry-order assertions in the `chat-add-medication` and `sc-pet-001` tests; `app/locales/en.ts` (`pods.ginger.careFeeding.*`, `flows.scPet003.*`, `flows.scPet004.*`).
- Figma: none in this change.
