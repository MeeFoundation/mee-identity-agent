## Context

See proposal.md for the why. Current state that shapes the approach:

- `AppTabBar` (`shared/ui/app-tab-bar.tsx`) hard-codes three tabs. `GingerHomeView` takes its tab type from the component's `onSelect` (`Parameters<ComponentProps<...>['onSelect']>[0]`), so a new tab id reaches EXP-PET-003/004/005 through the types. Each experiment declares `app_tab_selected: { tab: 'telli' | 'navigation' }` in its `*Events` type.
- SC-PPL-002 keeps members as `Member { id, name, role: 'owner' | 'viewer', joinedDaysAgo }` in `pods/people/sharing.ts`. Here `role` is a permission, not a family role. The owner's row line is a hard-coded `infoShared` with count 2.
- `InviteLinkField` and `copyToClipboard` live in `flows/sc-ppl-002/components/`. Flows can't import from each other (AGENTS.md).
- SC-PET-001 creates the pod in `createPodAtom` from `podNameAtom` and `chosenCategoryAtom`. `PodInstance` has `avatarLetter` only. `PodTopBar` already accepts `{ src } | { letter }`.
- The SC-PPL-002 spec lists Figma frames that the code no longer uses. The code points at the per-case documentation frames (1348-*). The delta aligns the spec with the code.

## Goals / Non-Goals

**Goals:**
- One shared people model for member info and suggestions, so SC-PPL-002 views read projections instead of holding copies.
- Add / replace / keep both / remove as pure functions, each confirmed by a toast without Undo.
- No new dependencies.

**Non-Goals:**
- Persisting the profile image beyond the run, or resizing or cropping it.
- Editing Bogdan's own info. The pencils render as inert `FieldRow` edit buttons.
- Changing SC-PPL-003, even though it shows the same members.

## Decisions

### 1. The tab bar gets a fixed fourth tab, not a per-flow tab set
The user decided that Notifications appears wherever the bar does. A configurable tab list would add an API no flow needs. `AppTab` becomes `'home' | 'telli' | 'notifications' | 'navigation'`, the grid becomes `grid-cols-4`, the icon is `Bell` from `react-bootstrap-icons`, and the badge is a small `bg-error-700` dot positioned on the icon. The dot is always shown: there is no notification data, so a prop for it would only ever be `true`. The accessible label uses a translated string ("Notifications, new") instead of a bare dot.

*Alternative:* a `tabs` prop with a three-tab default. Rejected after the scoping discussion.

### 2. Member info is its own model, separate from `Member`
`pods/people/member-info.ts` holds:

```ts
type InfoField = 'firstName' | 'role' | 'email' | 'phone' | 'address'
type SharedDetail = { id: string; field: InfoField; value: string }
type AddedDetail = SharedDetail & { addedBy: string; addedDaysAgo: number }  // addedBy: member id
type MemberInfo = { shared: readonly SharedDetail[]; addedByOthers: readonly AddedDetail[] }
```

Pure functions do the work, with no atoms, so they can be unit tested and reused:
- `isMultiValue(field)`: `email` and `phone`;
- `sharedRole(info)`: the Role line for the member list, or `null` so the caller falls back to "Can view";
- `addedByPerson(info)`: groups suggestions into cards, ordered by each person's first detail;
- `adopt(info, detailId)`: returns `{ kind: 'added' | 'conflict', ... }`;
- `keepBoth(info, detailId)`: inserts after the last detail with the same field;
- `replace(info, detailId)`: swaps the first value in place;
- `removeAdded(info, detailId)`.

Fixtures (`bogdanInfo`, `geoInfo` with Role "Mum", `andrew` and `andrewInfo` with Role "Uncle", and `geoAddedAboutBogdan`) sit next to the existing `bogdan` and `geo` fixtures.

`Member.role` stays the permission. Renaming it to avoid confusion with the Role field is out of scope.

*Alternative:* a `sharedInfo` field on `Member`. Rejected because it mixes "who is in the pod" with "what they share", and SC-PPL-003's members don't need it.

### 3. SC-PPL-002 state: a map keyed by member id, and toasts without Undo
`memberInfoAtom: Record<string, MemberInfo>` is seeded from `ScPpl002InitialState.memberInfo`, with Bogdan's info in every case. One write atom per action (`copyDetailAtom`, `adoptDetailAtom`, `keepBothAtom`, `replaceDetailAtom`, `removeDetailAtom`) applies the pure function and sets a toast:

```ts
type InfoToast =
  | { kind: 'copied' | 'added' | 'replaced'; field: InfoField }
  | { kind: 'removed'; field: InfoField; addedBy: string }
```

The toasts confirm the action only. They have no Undo, so the actions can't be reversed in the run.

The existing `toastAtom` (members) and the new `infoToastAtom` (my-info) stay separate, because each screen shows only its own. `selectedDetailIdAtom` drives `suggestion-actions` and `adopt-conflict`, following the `selectedInviteIdAtom` pattern.

### 4. Completion through the existing `complete({ showCompletionView: false })`
Adopt, keep both, replace and remove call it. Copy doesn't. The runtime already completes a run only once.

### 5. Member list: Bogdan's row becomes clickable in every case
`MembersView` reads `sharedRole(memberInfo[member.id])` for every member, Bogdan included. Only `member-detail`'s subtitle keeps "Can view", since that is a permission. The `pods.people.sharing.infoShared` strings become unused and are removed. Andrew is a new `Member` fixture (viewer, joined 3 days ago).

### 6. Shared link field moves to `pods/people/`
`InviteLinkField` and `copyToClipboard` move to `pods/people/components/` so that SC-PPL-002 and SC-PET-001 both import them. Their translation keys move from `flows.scPpl002.share.*` to `pods.people.sharing.*`. `pod-created` uses a text control ("copy invite link") where `invite-share` uses an icon. So the field takes a `copyLabel?: 'icon' | 'text'` variant instead of SC-PET-001 getting a second copy of it.

### 7. Pod image as an object URL in run state
`podImageAtom: string | null` holds `URL.createObjectURL(file)` from a hidden `<input type="file" accept="image/*">`, which the "select image" link triggers. `PodInstance` gains an optional `avatarSrc`. `createPodAtom` copies it in, and `PodHeader` passes `{ src }` or `{ letter }` to `PodTopBar`. The previous URL is revoked when the image is replaced. The file never leaves the browser. The Telli quick-action card keeps its letter avatar, since it shows a draft and not the pod.

*Alternative:* a data URL. Rejected because large photos would sit in atom state as strings for no benefit.

### 8. `pod-created` is a screen over the pod, and both creation paths go through it
`NewPodScreen.create` and the "Create pod" action in `quick-action-card.tsx` navigate to `pod-created` instead of `pod-notes`. The card's later "Open pod" still goes to `pod-notes`. The screen renders the pod's notes view (`PodView`) under a `BottomSheet`, like `new-pod` renders Home under it. `useSuggestionTimer` and the completion check live in `PodNotesScreen`, not in the view, so neither starts under the sheet. Both start once the real `pod-notes` is shown, which matches "the run SHALL complete once the tester leaves it for the pod". `pod-created` calls `ensurePodAtom` for direct links, like the other pod screens. Dismiss and "Go to" both use `goToScreen('pod-notes')`, not `back()`, so they never return to `new-pod`.

## Risks / Trade-offs

- [Experiment data before and after the fourth tab isn't comparable] → The proposal marks it BREAKING. The `notifications` value makes new wrong turns visible. Analysis should split runs at the deploy date of this change.
- [Object URLs leak if not revoked] → Revoke the previous URL when the image is replaced. At most one live image per run makes the remaining URL harmless until the page unloads.
- [`Member.role` (permission) vs the Role field (family role) confusion] → Name the helper `sharedRole` and keep the field id `role` only inside `InfoField`. AGENTS.md gets a line on this.
- [Figma's member list omits Telli] → The spec keeps Telli and raises the omission as a screen question, so the existing Telli requirement isn't silently contradicted.
