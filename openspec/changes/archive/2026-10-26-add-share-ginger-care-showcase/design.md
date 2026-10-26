## Context

See proposal.md for why. The pod model keeps layers separate (`AGENTS.md`): `Member.role` in `pods/people/sharing.ts` is a **permission** (`owner | viewer`), and what each member shares lives in `member-info.ts`. Ginger's data and dose events are in `pods/ginger/`. `DoseEvent.givenBy` and `MedicationDose.givenBy` already exist, and `giveDoseAtom` and `undoDoseAtom` write them, but `giveDoseAtom` always writes `PARTICIPANT_ID`. SC-PET-002 shows the give and undo sheets for the participant; SC-PPL-002 shows invite and share sheets for Sofia's pod; SC-PPL-003 shows viewer chrome.

## Goals / Non-Goals

**Goals:**
- One showcase that shows both sides of sharing care: the owner's choice and the sitter's experience.
- Reuse the dose, invite and viewer parts; add only the third access level and the access choice.

**Non-Goals:**
- No change to SC-PPL-002 or SC-PPL-003; they hold only owners and viewers.
- No editing of existing members' access, expiry, or partial-pod sharing.

## Decisions

**Access is a permission value, named by what it allows.** Add `'logger'` to `MemberRole` and label it "Can log doses". Alternative: a separate capability flag on `Member`. Rejected for the showcase: role is already the permission field, a flag would allow combinations the UI never shows, and `logger` implies viewer's read access. Existing code treats any non-`owner` role as read-only, so owners and viewers behave the same as before; only the Give/Undo controls and invite UI read the new value.

**One shared view, B and C differ by an initial-state flag.** Following the `AGENTS.md` rule for variants that differ in one block, cases B and C share `medical` and read `access` from the flow's initial state. The Give control is `null` for `viewer`. No per-case screens.

**The giving member is the participant, so `giveDoseAtom` stays as it is.** The model already treats `PARTICIPANT_ID` as whoever uses the app and lists the other members by name. In case C the participant is Geo and Sam is the other member, so the dose reads "You" for Geo and the previous dose reads "Sam". Alternative: pass a member id into `giveDoseAtom`. Rejected: nothing in the showcase needs it, and it would touch SC-PET-002 and EXP-PET-005. The owner's view of a sitter's dose ("Given by Geo") follows from the same helper, `memberName`, with Geo in the member list; it is tested on the model, not shown in a case.

**The double-dose guard is derived, not stored.** The card reads the current dose's `status` and `givenBy`. If it is already given by someone else, it shows the given treatment with that person's name and no control. This showcase passes no undo handler, so the card never offers Undo.

**Names in the owner's view.** Sitter-given doses read "Given {time} · Geo", using the existing `memberName` helper in `dose-history.ts`, which shows "You" for the viewing member. The pod's member list for the flow holds Sam, Geo and the viewing member's id.

**One initial screen, so the cases start on Info.** A flow has a single initial screen and the briefing shows on it, so all cases start on Ginger's Info tab, where the Medical and Members rows live, and the reviewer finds their screen from there. `GingerCategoryRows` gains optional `onOpenMembers` and `memberCount`; `DueDoseCard.onGive` and `MedicalDoseView.onAddMedication` become optional, and the control is not rendered without them.

**Cast.** The owner is Sam and the sitter is Geo, in every case. Existing Ginger fixtures name the owner "You" and a second member Sam; here the viewing member maps to Sam in case A and to Geo in B and C. `PodMember` ids are chosen so `memberName` shows "You" for the right person in each case.

**Invite sheets are re-composed, not forked.** `invite-name` gains an access choice; `invite-share` and link generation reuse the SC-PPL-002 behaviour. Shared pieces move only if a copy would otherwise be needed, and then to `pods/people/components/`, next to `invite-link-field`.

## Risks / Trade-offs

- [Third role leaks into SC-PPL screens that map roles to labels] → Role labels go through one function; unit test every role, and keep the SC-PPL-002/003 tests passing.
- [Making `onGive` and `onAddMedication` optional changes SC-PET-002 and EXP-PET-005] → They keep passing the handlers, so nothing changes for them; their tests still pass.
- [Owner/sitter casting confuses reviewers] → Each case's briefing names who the reviewer is.

## Open Questions

- Whether a sitter's access should expire, and whether the owner is notified when a dose is given by a sitter. Both are listed as open questions in the briefing and don't change the build.
