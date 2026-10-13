## 1. Sharing and Telli logic (pure)

- [x] 1.1 Create `pods/people/sharing.ts` with `Member`, `PendingInvite`, `memberCount`, `pendingLabel` ("Sent today" / "Pending for 1 day" / "N days"), `expiryDate` (+7 days), `nextInviteLink` (first `x7f2-4k9a`, then unique) and the day-offset fixtures for Bogdan, Geo and Telli; add `sharing.test.ts` covering Telli not counted, pending counted, the three pending labels, expiry, and link uniqueness across 5 invites
- [x] 1.2 Create `pods/people/telli-answers.ts` with `answerFor(message)` implementing the ordered rules (piano, born/birthday/how old, last name/surname/full name, other "?" → not found, else `null`) and `fromPod`; add `telli-answers.test.ts` with a case per rule, case-insensitivity, rule order and "Thanks!" → `null`

## 2. Shared UI

- [x] 2.1 Extract `CountBadge` from `shared/ui/category-row.tsx` and add an optional `badge` slot to `CategoryRow`; verify in the browser that the SC-PET-001 and Ginger Info screens look unchanged
- [x] 2.2 Add an optional `subtitle` slot to `PodTopBar` (and make `breadcrumb` optional); verify existing pod screens are unchanged and `pnpm check-types` passes
- [x] 2.3 Build `shared/ui/toast.tsx` (`success` and `primary` variants, title, optional description, optional single action, close control) per DS 28-11001, and add it to `podComponents`; verify in the browser against the frame
- [x] 2.4 Build `shared/ui/member-row.tsx` (letter or image avatar, online dot, name, detail with warning tone, chevron and button only when `onClick` is given); verify both interactive and static rows in the browser
- [x] 2.5 Build the group-chat environment `shared/ui/group-chat-components.ts`: `GroupChatMessage` (others: avatar, name, time; own: right and dark), `ChatNotice` (day and system pills), `ChatTypingIndicator` (reused), `GroupChatComposer` ("+" inert, send disabled while blank, Enter sends), reusing `ChatThread` and `shouldSend`; verify in the browser against DS 6473-3081 and that the existing chat showcases are unchanged
- [x] 2.6 Add `ReadOnlyNotesArea` to `pods/notes/tidy-notes-area.tsx` (painted text only, no textarea, no toolbar, no Tidy chip, links still open); verify in the browser that SC-PPL-001 is unchanged and that a read-only note shows no caret and ignores typing
- [x] 2.7 Add the `ui.toast.*`, `ui.groupChat.*` and `pods.people.sharing.*` / `pods.people.telli.*` strings to `app/locales/en.ts`; verify no hardcoded user-facing string in the new components

## 3. SC-PPL-002 flow

- [x] 3.1 Create `flows/sc-ppl-002/model.ts`: screen ids, initial state (members, invites as day offsets), `todayAtom`, `membersAtom`, `invitesAtom`, `selectedInviteIdAtom`, `selectedMemberIdAtom`, `toastAtom`, and the write atoms `createInviteAtom`, `markSentAtom`, `revokeInviteAtom`, `undoRevokeAtom`, `removeMemberAtom`; unit test that creating and revoking update the count, Undo restores the same link and dates, and removal drops the member
- [x] 3.2 Add a `SofiaPodTopBar` in `flows/sc-ppl-002/components/` (Info tabs with "Suggest category", or a subtitle with no tabs), and the `info` and `members` screens (Forms card, category rows with "2 suggestions", member and pending rows, toast at the bottom that clears on leaving); verify against frames 908-19475, 908-19728 and 914-20076
- [x] 3.3 Add the `invite-name` and `invite-share` sheets (focused name field, disabled button while blank, Enter submits, link field with copy and check, Messages/Mail/Copy targets, dismiss keeps the invite pending, guard → `members`); verify against frames 908-19751 and 914-19982
- [x] 3.4 Add the `invite-detail` sheet (dates, link with copy, explanation, "Send link again" → `invite-share` with the same link, "Revoke invite" → toast with Undo, guard → `members`); verify in the browser
- [x] 3.5 Add the `member-detail` screen and the `remove-confirm` sheet (joined date, "What they can do", destructive remove, Cancel → back, guards → `members`); verify in the browser
- [x] 3.6 Write `flows/sc-ppl-002/flow.ts` (`kind: 'showcase'`, code, design frames, cases A–C with their initial state (all start on `info`), completion on first send, revoke or remove, every explanation and question from "Showcase notes"), register it after `scPpl001Flow`, and add `flows.scPpl002.*` strings
- [x] 3.7 Add `flows/sc-ppl-002/sc-ppl-002.test.ts` following `sc-ppl-001.test.ts`: registry, codes, screens, design frames, `info` as every case's initial screen, each case's members and count, and the case B `invite-detail` notes

## 4. SC-PPL-003 flow

- [x] 4.1 Create `flows/sc-ppl-003/model.ts`: screen ids, the read-only note blocks and Contact info, `messagesAtom` with the four starting entries, `pendingReplyAtom`, `sendMessageAtom`, and a store-level reply scheduler using `answerFor`; test with fake timers that the typing line shows for about 1 s, the answer arrives after leaving `chat`, and "Thanks!" gets no answer
- [x] 4.2 Add the top bar ("Shared by Bogdan", working Notes/Chat/Info tabs) and the `notes` (`ReadOnlyNotesArea`, link → `contact-info`), `info` (no "Create form", no suggestions), `contact-info` (back to origin) and `members` (static rows, no Invite, completes case A) screens; verify in the browser
- [x] 4.3 Add the `chat` screen with the group-chat environment (starting thread, own messages with current time, "Telli is typing…", answers, completion on the first answer from the pod); verify in the browser
- [x] 4.4 Write `flows/sc-ppl-003/flow.ts` (`kind: 'showcase'`, code, design references, cases A and B (both start on `notes`), every explanation and question from "Showcase notes"), register it after `scPpl002Flow`, and add `flows.scPpl003.*` strings
- [x] 4.5 Add `flows/sc-ppl-003/sc-ppl-003.test.ts`: registry, codes, screens, `notes` as the initial screen, and the `chat` notes for case B

## 5. Checks

- [x] 5.1 Walk through SC-PPL-002 cases A–C and SC-PPL-003 cases A–B end to end in `pnpm --filter app-ux-flows dev` at desktop and 480 px width, and confirm they match every spec scenario, including "Goal reached" and the notes groups following the screen
- [x] 5.2 Walk through SC-PPL-001 and one chat showcase to confirm they are unchanged
- [x] 5.3 Run `pnpm lint`, `pnpm check-types` and `pnpm --filter app-ux-flows test`, and verify they pass with no errors
