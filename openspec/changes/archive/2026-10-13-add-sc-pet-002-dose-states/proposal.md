## Why

EXP-PET-005 defines four due-dose card states, but its fixture only reaches due and given: the overdue treatment exists in code and in Figma with no flow that shows it. Pet owners also mark a dose by mistake, and nothing showed how to take that back. We want both states in front of reviewers without changing the EXP-PET-005 experiment design.

## What Changes

- **New showcase `sc-pet-002`** ("Medication doses", display code `SC-PET-002`), starting on Ginger's Medical screen, with two cases:
  - `a` (SC-PET-002-A, "Overdue dose"): Apoquel was scheduled three hours before the run and not given. The card shows the overdue treatment; the give sheet says "Scheduled: {time}" instead of "now".
  - `b` (SC-PET-002-B, "Undo a dose"): the participant marked Apoquel as given ten minutes before the run. The card's "Undo" link opens "Undo Ginger's dose?"; confirming returns the dose to due, shows "Apoquel marked as not given", and removes the dose from the history.
- Screens: `medical`, `give-dose`, `undo-dose`, `dose-history`, each linked to its Figma frame on the "SC-PET-002 - Medication doses" page.
- It reuses the Ginger pod pieces that EXP-PET-005 moved to `pods/ginger/` (see `add-exp-pet-005-give-medication`, task 7.2). No code is imported from another flow.

Out of scope:
- skipping an overdue dose, reminders, or a time limit on undo (listed as open questions);
- Home, Ginger's tabs and the medication details, which EXP-PET-005 covers;
- analytics: showcases are not tracked.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-pet-002`: the SC-PET-002 showcase.

### Modified Capabilities
None.

## Impact

- New: `apps/app-ux-flows/src/slices/flow/flows/sc-pet-002/**`.
- Changed: `registry.ts` and the registry-order assertions in the `chat-add-medication` and `sc-pet-001` tests; `app/locales/en.ts` (`flows.scPet002.*`).
- Figma: its own page "SC-PET-002 - Medication doses" in Mee – Tellipod App v4.0.3.
