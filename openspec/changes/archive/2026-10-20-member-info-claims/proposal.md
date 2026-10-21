## Why

In SC-PPL-002, only Bogdan's own screen shows member info, and its edit controls do nothing. Other members' screens show only a join date and a remove button, so there is no way to show the main idea of the pod: everyone controls their own info, and others can only add what they know about them. Reviewers need to try both sides: editing your own info, and adding info about someone else without changing it.

## What Changes

- Every member except Telli has an info screen built the same way: what they share at the top, and what others added about them at the bottom. The section labels and help text depend on whether Bogdan is looking at himself or at someone else.
- Bogdan can now edit the info he shares and add new details. The edit controls and "+ Add personal info" on `my-info` work instead of doing nothing.
- **BREAKING** (for the showcase): `member-detail` becomes the other member's info screen. The "Joined" card and the "What they can do" card are removed. "Remove from pod" stays at the bottom, and only the pod owner sees it.
- On someone else's screen, editing a detail or adding one never changes their info. Instead it creates or updates Bogdan's own detail about them, one per field. Editing the same field again updates it.
- A detail added by others is shown only while its value differs from every value the person shares for that field. Adding a detail to your own info, keeping both, replacing, or changing your own value to match all hide it without deleting it. If the person's value later changes away from it, the detail shows again.
- Everyone sees every detail added about every member. On someone else's screen, Bogdan can edit or remove his own details about them. Details added by other people are read-only there.
- New case E, "Add info about someone else": Geo shares an out-of-date email, Andrew has added a phone number about Geo, and the goal is for Bogdan to add the right email.
- New flow question: should a detail come back when its person later changes their own value away from it?

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-ux-flows/showcases/sc-ppl-002`: My info becomes editable, `member-detail` becomes the other member's info screen, there is new behaviour for adding details about others, details added by others are hidden while they match, case E is added, and the notes are updated.

## Impact

- `apps/app-ux-flows/src/slices/flow/pods/people/member-info.ts`: visibility rule, adding or updating a detail about someone, editing your own info.
- `apps/app-ux-flows/src/slices/flow/flows/sc-ppl-002/`: model atoms, `my-info-view` generalised into a view for any member, `member-detail` screen, `remove-confirm` background, flow cases, design frames, notes, tests.
- `apps/app-ux-flows/src/app/locales/en.ts`: new strings for the other member's view, editing, toasts and case E.
- No new dependencies. Reuses the existing `InlineFieldEditor`, `TextField` and `SelectField` pod components.
