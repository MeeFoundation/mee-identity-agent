## Context

SC-PPL-002 keeps every member's info in `memberInfoAtom: Record<memberId, MemberInfo>`, where `MemberInfo = { shared, addedByOthers }` and each `AddedDetail` has an `addedBy`. Only Bogdan's record is shown, by `MyInfoView`. "Add to info I share", "Keep both" and "Replace" in `pods/people/member-info.ts` remove the detail from `addedByOthers` themselves. `member-detail` renders `MemberDetailView`, which has no info, and `selectedMemberAtom` only resolves invited members (`role === 'viewer'`), so Bogdan and Telli can't be opened there.

## Goals / Non-Goals

**Goals:**
- One view serves both `my-info` and `member-detail`. Only text and controls depend on whose screen it is.
- Whether a detail added by others is shown is computed from the data, so no action has to delete matches itself.
- Keep the existing case D behaviour and tests passing unchanged.

**Non-Goals:**
- Playing as anyone other than Bogdan.
- Normalising values (case, spaces, phone formatting) before comparing them.
- Stopping sharing one of your own details, notifying anyone, or undoing edits.

## Decisions

### Details about a member are stored with that member
Bogdan's detail about Geo is an `AddedDetail` with `addedBy: 'bogdan'` in `memberInfo[geo].addedByOthers`. This is the same place case D already stores Geo's details about Bogdan.

- Alternative: a separate `claims` list keyed by who added each one. Rejected: every view would then have to merge two sources, and the "one per (addedBy, field)" lookup would leave the subject's record.
- The detail's id is built from `addedBy`, subject and field (for example `bogdan-geo-email`), so an update keeps the same id and position.

### A detail's visibility is computed, not stored
A pure helper `isShown(info, detail)` returns true when no `info.shared` entry has the same `field` and `value` (strict `===`). `addedByPerson` and `findAdded` work only on shown details, so a hidden detail can't be opened in `suggestion-actions` or `adopt-conflict`.

- `adopt`, `keepBoth` and `replace` stop calling `withoutAdded`. They only change `shared`, and the detail is hidden because it matches. Their return shape doesn't change.
- `removeAdded` still deletes. This is the only way a detail added by others leaves the record. That gives the "removed stays removed" behaviour.
- Alternative: delete a detail as soon as it matches. Rejected: the user chose that a detail should come back when its person changes their value away from it, and deleting would lose it.

### Pure helpers in `member-info.ts`
New functions next to the existing ones, tested in `member-info.test.ts`:
- `editShared(info, detailId, value)`: changes a value, keeping its position;
- `addShared(info, field, value)`: adds at the end, with a new id;
- `pickableOwnFields(info)`: all fields, minus single-value fields already shared;
- `setDetailAbout(info, addedBy, field, value)`: returns `{ info, outcome: 'matches' | 'added' }`. When the value equals a shared value for that field, it deletes any existing detail from that person for that field. Otherwise it updates that detail in place, or appends a new one, with `addedDaysAgo: 0`;
- `removeDetailBy(info, addedBy, field)`.

Ids for shared details added by Bogdan come from a run counter, like `nextInviteLink`, so they never clash after a delete.

### One view, two screens
`MyInfoView` becomes `MemberInfoView({ memberId, showToast })` in `components/member-info-view.tsx`. A view flag `isMe = memberId === bogdan.id` chooses the i18n keys, which controls are on each row, and whether "Remove from pod" is shown (`!isMe && viewer owns the pod`). Bogdan is always the owner in this showcase, so in practice it is shown on every screen except his own.

- `my-info`, `suggestion-actions` and `adopt-conflict` render it with `bogdan.id`. `member-detail` and `remove-confirm` render it with the selected member.
- `MemberDetailView` and its "Joined" and "What they can do" cards are deleted. `memberJoinedOn` and `formatLongDate` stay only if something else still uses them; otherwise they are removed with their tests.
- The `member-detail` design frame changes to `38-2883`.

### Inline editing state
The inline editor UI (which row is being edited, the draft, the chosen field) is local to the view, because it is transient and nothing else reads it. Saving goes through write atoms in `model.ts`:
- `editMySharedAtom`, `addMySharedAtom`;
- `saveDetailAboutAtom(memberId, field, value)`, which calls `complete` from the screen when the outcome is `added`;
- `removeMyDetailAboutAtom`.

All of these set `infoToastAtom`. `InfoToast` gains the kinds `updated`, `addedAbout`, `alreadyShared` and `removedMine`, with `name` where needed. Opening an editor clears the toast, like opening a sheet.

The editor reuses the shared `InlineFieldEditor` + `TextField`, and `SelectField` for the field picker, the way `sc-ppl-001`'s `ContactFieldEditor` does.

### Case E fixtures
`geoInfoWithOldEmail` (Role "Mum", Email "geo.old@gmail.com") and `andrewAddedAboutGeo` (Phone "+447700900123", 2 days ago) live in `member-info.ts` next to the case D fixtures.

## Risks / Trade-offs

- [Hidden details pile up in the record, which is invisible to reviewers] → Acceptable for a demo; there are only five fields per person.
- [Strict comparison means "Bogdan@Gmail.com" doesn't match "bogdan@gmail.com"] → The user asked for this; it's listed under Non-Goals.
- [`suggestion-actions` copy says "moves the detail out of Geo's list", which is now technically "hides"] → It looks the same to reviewers, so the question stays as is.
- [Turning `member-detail` into a different screen breaks its old Figma reference and tests] → Both are updated in the tasks. The case C goal still works through the same button label.
