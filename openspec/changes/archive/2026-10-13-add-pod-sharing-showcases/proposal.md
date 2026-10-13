## Why

Pods are about to be shared with other people. The Tellipod designs (Mee – Tellipod App v4.0.3, frames 908-19475, 908-19728, 908-19751, 914-19982, 914-20076) show how the owner invites someone with a one-time link, but nothing yet covers taking access back, or what the pod looks like to the person who was invited. We need clickable showcases of both sides to demo and discuss with the team before any sharing backend exists.

Rules for invitees, confirmed with product: they can see the pod's notes and info but can't edit them, add forms or invite members. They can read and write in the pod's chat, which is shared by every member, and anyone in the pod can ask Telli about what the pod holds.

## What Changes

- New showcase **SC-PPL-002 "Invite someone to Sofia's pod"** (`sc-ppl-002`), seen by Bogdan, who owns the "About Sofia" pod:
  - **A, invite**: Info tab → Members → "Invite member" → a name sheet ("Who are you inviting?") → an invite-link sheet with a one-time link, copy, and a few share targets → back on Members with the invite listed under "Pending invites" and the toast "Invite link sent to Geo".
  - **B, revoke a pending invite** (no design): tapping the pending invite opens a sheet with its link, dates, "Send link again" and "Revoke invite". Revoking takes effect at once, with no confirmation, and the toast offers Undo.
  - **C, remove a member** (no design): tapping a member opens their detail screen with "Remove from pod". A confirmation sheet says what removal means. The member is then gone and a toast confirms it, with no Undo.
- New showcase **SC-PPL-003 "Sofia's pod, shared with me"** (`sc-ppl-003`), seen by Geo, who was invited to view the pod:
  - Notes look exactly like the owner's but can't be edited, and the formatting toolbar isn't shown. The "Sofia Walker" link still opens Contact info.
  - Info shows the forms and categories without "Create form" or suggestions. Contact info is read-only, and Members has no "Invite member".
  - Chat is a group chat built to the design system (Mee – Design System v5.2.2, 6473-3081), with Bogdan's earlier messages and a "Geo joined" notice. A mocked Telli answers questions about Sofia from what the pod holds.
  - **A, look around**: find out who else is in the pod. **B, ask Telli**: get an answer about Sofia from Telli in the shared chat.
- New shared UI in `app-ux-flows`: a **toast** built to the design system (Mee – Design System v5.2.2, 28-11001), a **member row**, and **group-chat components** (bubble with author and time, own bubble, day and system notices, typing line, composer). The existing two-party chat components and the showcases that use them are unchanged.
- The pod top bar gains an optional subtitle slot (for "Suggest category", "Members" with a count, "Shared by Bogdan") alongside the existing breadcrumb. Existing callers are unchanged.
- The block-based notes area gains a read-only mode.
- Everything is local and deterministic. There is no invite, sharing or chat API, and both showcases carry their own explanations and open questions.

Assumptions to confirm in review: the codes `SC-PPL-002` and `SC-PPL-003`; Telli not counted in Members while pending invites are; links expire 7 days after they are created; a sheet closed without picking a share target still leaves the invite pending.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-ppl-002`: the "Invite someone to Sofia's pod" showcase covering the owner's Info and Members screens, creating and sharing an invite link, revoking a pending invite, removing a member, its cases, and its explanations and open questions.
- `app-ux-flows/showcases/sc-ppl-003`: the "Sofia's pod, shared with me" showcase covering the invitee's read-only Notes and Info, the shared group chat with a mocked Telli, its cases, and its explanations and open questions.

### Modified Capabilities
None. The new shared components and the pod top bar's subtitle slot are only described through the showcases that use them.

## Impact

- New flow folders `apps/app-ux-flows/src/slices/flow/flows/sc-ppl-002/` and `sc-ppl-003/`, registered after the existing flows in `slices/flow/registry.ts`.
- New pod pieces under `apps/app-ux-flows/src/slices/flow/pods/people/`: Sofia's shared pod data (identity, members, invites) and the mocked Telli answers.
- `apps/app-ux-flows/src/slices/flow/pods/notes/tidy-notes-area.tsx`: an optional read-only mode. SC-PPL-001 is unchanged.
- `apps/app-ux-flows/src/shared/ui/`: new `toast.tsx`, `member-row.tsx` and group-chat components; `pod-top-bar.tsx` gets an optional subtitle; `pod-components.ts` and a new group-chat component environment.
- `apps/app-ux-flows/src/app/locales/en.ts`: new strings.
- No new dependencies and no backend.
