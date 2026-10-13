## Context

See proposal.md for why. The specs for `sc-ppl-002` and `sc-ppl-003` define the behaviour.

What exists today in `apps/app-ux-flows`:
- A flow is `defineFlow({ screens, cases, createStore, ... })`. Each run gets its own Jotai store, built from the case's `initialState`. Bottom sheets are screens of their own that render `BottomSheet` and call `onDismiss` → `back()` (see `sc-ppl-001/screens/tidy-confirm-screen.tsx`). A showcase completes with `complete({ showCompletionView: false })`.
- `PodTopBar` takes a `breadcrumb: string[]` with an icon. It has no slot for "Suggest category", for "Members" with a badge, or for "Shared by Bogdan".
- `CategoryRow`, `FormCard`, `SectionLabel`, `Divider` and `BottomSheet` already cover the Info screen and the sheets. `TextField` exists for the name input.
- `TidyNotesArea` (`pods/notes/`) draws the block note with a transparent textarea over a painted layer, plus `NotesToolbar`. It is always editable.
- The chat components (`shared/ui/chat-*`) are two-party: `ChatMessage author: 'user' | 'agent'`, own bubbles in brand-700, no names and no times. `chat-add-medication` and others depend on how they look.
- Sofia's pod lives inside `flows/sc-ppl-001/` (`SofiaTopBar`, `knownSofiaContact`). `pods/people/contact-info.ts` already holds the Contact info record and its rows.
- No toast and no member row exist.

## Goals / Non-Goals

**Goals:**
- Both showcases share one model of the pod's members and invites, so the owner's and invitee's views of Sofia's pod can't drift apart.
- The member, invite and Telli logic is pure functions with unit tests, as `tidy.ts` and `contact-info.ts` are.
- New UI follows the design system frames, while existing showcases look and behave exactly as before.

**Non-Goals:**
- Changing SC-PPL-001 or moving its code. Its `SofiaTopBar` and locale keys stay as they are.
- Restyling the existing two-party chat components.
- Toast variants beyond what is used (success, plus `primary` because it costs nothing). Avatars in toasts, two-action toasts and auto-dismiss.
- The rest of the design-system chat (replies, attachments, read receipts, failed sends).
- A system share sheet (`navigator.share`): it can't be told apart from "sent" and behaves differently on every browser.

## Decisions

### 1. Sofia's shared pod lives in `pods/people/sharing.ts`
It holds pure types and functions: `Member`, `PendingInvite`, `memberCount(members, invites)`, `pendingLabel(invite, today)` → `{ key, count }`, `expiryDate(invite)`, `nextInviteLink(usedLinks)` (a fixed list starting with `x7f2-4k9a`, then derived codes), and the case fixtures for Geo and Bogdan. Each flow keeps its own atoms in its `model.ts`, as other flows do, and calls these functions.

*Alternative:* one shared atom module for both flows. Rejected because a run's store belongs to one flow, and the sc-ppl-001 pattern is per-flow atoms over shared pure logic.

### 2. "Today" is captured once per run
`createStore` sets `todayAtom` to `new Date()` at the start of the run. Every date (sent, expires, joined, "Pending for N days", message times) is computed from it. Tests use fake timers to pin the date. Fixtures store offsets in days ("sent 2 days ago"), not absolute dates, so the cases stay true on any day.

### 3. The toast is run state, and `members` draws it
`toastAtom: { kind: 'sent' | 'revoked' | 'removed', name, inviteId? } | null`. Actions on the sheets set it and then navigate to `members`. `members` renders `Toast` at the bottom of `PodScreen` and clears it on unmount, which implements "until the reviewer leaves `members`". "Undo" restores a copy of the revoked invite kept in the toast state.

*Alternative:* a global toast host in the runtime. Rejected because only one screen in one flow needs it, and putting it in the runtime would widen the runtime contract for nothing.

`shared/ui/toast.tsx` is presentational: `variant`, `title`, `description?`, `action?: { label, onClick }`, `onClose`, positioned by its parent. It is added to `podComponents`, which only grows that environment.

### 4. Sheets carry their subject through run state, not the URL
`selectedInviteIdAtom` and `selectedMemberIdAtom` are set before navigating. When a sheet or `member-detail` finds nothing selected (for example after a direct link in a new run), it calls `goToScreen('members')` in an effect, the same guard `tidy-confirm` uses.

### 5. `PodTopBar` gets an optional `subtitle` slot
`subtitle?: ReactNode` is drawn in place of the breadcrumb when given, and `breadcrumb` becomes optional. Existing callers are unchanged. The flows pass, for example, `<>Members <CountBadge n={2} /></>`. The count badge style is taken out of `CategoryRow` into a small `CountBadge` in `shared/ui`, which `CategoryRow` then uses. The output is the same.

*Alternative:* a `SubScreenTopBar` per flow, like Ginger's. That is still done per flow (`SofiaPodTopBar` in each flow's `components/`), but each one needs the slot underneath it.

### 6. `CategoryRow` gets an optional `badge`
`badge?: ReactNode` is drawn before the count, for "2 suggestions". It is the only change to an existing pod row.

### 7. New `MemberRow` in `shared/ui`
Props: avatar (letter, or image for Telli), `online?`, `name`, `detail`, `detailTone?: 'default' | 'warning'`, `onClick?`. Without `onClick` it renders a non-interactive `div` with no chevron, which is what SC-PPL-003's members screen needs.

### 8. A read-only note next to `TidyNotesArea`
`ReadOnlyNotesArea` sits in the same module and reuses its hashtag painting and contact link. Text blocks are plain paragraphs (no textarea, so no caret and no focus). There is no toolbar and no Tidy action, and links still call `onOpenContactLink`. A `readOnly` flag on `TidyNotesArea` was rejected because every editing handler would become optional just for this one caller. A read-only `textarea` was rejected because it still takes focus and shows a caret in Safari.

### 9. Group chat as a separate component environment
`shared/ui/group-chat-components.ts` exports `GroupChatMessage` (author `{ name, avatar }` or `'me'`, time; own bubbles dark per the design system), `ChatNotice` (day and system pills), and `GroupChatComposer` (a card with the input on top, "+" and a round send button below). It reuses `ChatThread`, `ChatTypingIndicator` (already after the design system's "Typing message") and `shouldSend` from the existing chat. SC-PPL-003's environment is `defaultComponents + podComponents + groupChatComponents`.

*Alternative:* add an author and time to `ChatMessage`. Rejected because its own-bubble colour would have to change to match the design system, which changes every existing chat showcase.

### 10. Mocked Telli is a pure function
`pods/people/telli-answers.ts` exports `answerFor(message): { key, fromPod: boolean } | null`, implementing the ordered rules from the spec. The chat keeps `messagesAtom` and `pendingReplyAtom`. The reply timer is started from the send action through a store-level helper (as `scheduleAnalysis` is in sc-ppl-001), not from a screen effect as in `chat-add-medication`. That way the answer arrives even after the reviewer leaves `chat`.

### 11. Share targets are drawn icons
`invite-share` shows three targets: Messages, Mail and Copy. They use `react-bootstrap-icons` (`ChatFill`, `EnvelopeFill`, `Copy`) in coloured rounded squares that suggest the iOS look without copying Apple artwork or showing fake contacts. Copy uses `navigator.clipboard.writeText`. A failure is ignored, and the "sent" path continues anyway.

### 12. Codes and registration
`sc-ppl-002` and `sc-ppl-003` are added to `registry.ts` after `scPpl001Flow`. Locale keys go under `flows.scPpl002.*`, `flows.scPpl003.*`, `pods.people.sharing.*` (shared member and invite strings), `pods.people.telli.*` and `ui.toast.*` / `ui.groupChat.*`.

## Risks / Trade-offs

- [The fixed first link `x7f2-4k9a` looks the same on every run] → It matches the design and is fine for demos, and later links in a run are different.
- [Two near-identical top bars for Sofia (sc-ppl-001's and the new one)] → Accepted so that SC-PPL-001 is not touched. They can be merged in a later cleanup.
- [Two chat component sets] → Accepted. The group set follows the design system and the old set follows older showcase frames. The design notes this so the next chat showcase picks the group set.
- [Keyword-based Telli may surprise reviewers ("piano?" works, "music?" doesn't)] → The goal tells reviewers what to ask, and the flow notes say Telli is mocked.
- [Clipboard is blocked in some embedded contexts] → Copying is best effort and never blocks the flow.

