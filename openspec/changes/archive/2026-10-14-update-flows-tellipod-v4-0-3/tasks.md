## 1. App tab bar: Notifications

- [x] 1.1 In `shared/ui/app-tab-bar.tsx`, add the `notifications` tab (`Bell` icon, always-on red badge dot, accessible label "Notifications, new") between Ask Telli and Navigation, and switch to `grid-cols-4`. Add the `ui.appTabBar.notifications*` strings. Verify with `pnpm check-types` and by opening SC-PET-001 `home` in the browser: four tabs, dot shown.
- [x] 1.2 Add `'notifications'` to `app_tab_selected.tab` in `flows/exp-pet-003/model.ts`, `exp-pet-004/model.ts` and `exp-pet-005/model.ts`. Verify that `pnpm check-types` passes and that `GingerHomeView` forwards the new tab without changes.
- [x] 1.3 Extend the EXP-PET-003/004/005 tests: activating Notifications on `home` records `app_tab_selected` with `tab: 'notifications'` and stays on `home`. Verify that `pnpm --filter app-ux-flows test` passes.
- [x] 1.4 Make the Notifications tab inert on SC-PET-001 `home` and `telli`, and check `home-view.tsx` and `telli-view.tsx` still type-check against the wider tab union. Verify in the browser that tapping it changes nothing.

## 2. People model: member info and suggestions

- [x] 2.1 Add `pods/people/member-info.ts` with `InfoField`, `SharedDetail`, `AddedDetail`, `MemberInfo` and the pure functions `isMultiValue`, `sharedRole`, `addedByPerson`, `adopt`, `keepBoth`, `replace` and `removeAdded` (design §2). Verify with `member-info.test.ts`, covering adopt with no conflict, conflict detection, keep both inserted after the last same-field detail, replace in place of the first value, remove, and grouping order.
- [x] 2.2 Add the fixtures `bogdanInfo` (First name, Role "Dad", Email, Address), `geoInfo` (Role "Mum"), `andrew` and `andrewInfo` (viewer, joined 3 days ago, Role "Uncle"), and Geo's two details about Bogdan (Email, Phone, 1 day ago). Verify the fixture assertions in `member-info.test.ts`.
- [x] 2.3 Move `InviteLinkField` and `copyToClipboard` from `flows/sc-ppl-002/components/` to `pods/people/components/`, add the `text` copy-label variant, and move their strings to `pods.people.sharing.*`. Verify that SC-PPL-002's `invite-share` and `invite-detail` still copy, that the tests pass, and that `pnpm steiger:concepts` and `pnpm lint` are clean.

## 3. SC-PPL-002: member list and case D

- [x] 3.1 In `flows/sc-ppl-002/model.ts`, add `memberInfoAtom` (seeded from `ScPpl002InitialState.memberInfo`, with Bogdan's info in every case), `selectedDetailIdAtom`, `infoToastAtom` and the action atoms `copyDetailAtom`, `adoptDetailAtom`, `keepBothAtom`, `replaceDetailAtom`, `removeDetailAtom`, with toasts without Undo (design §3). Add the screen ids `my-info`, `suggestion-actions` and `adopt-conflict`. Verify with the store-level tests in `sc-ppl-002.test.ts`.
- [x] 3.2 Update `MembersView`: each row's line is `sharedRole(...)`, falling back to "Can view", and Bogdan's row opens `my-info`. Remove the unused `infoShared` strings. Verify in the browser that case D lists Dad, Mum, Uncle and Telli with badge 3, and that case C still shows Geo with "Can view".
- [x] 3.3 Add the `my-info` screen (top bar, the "<N> INFO SHARED IN THIS POD" card with inert edit controls and an inert "+ Add personal info", the "ADDED BY OTHERS" cards with "More actions", and the toast without an action). Verify against Figma 38-2883 in the browser for cases A and D.
- [x] 3.4 Add the `suggestion-actions` sheet (title with the value in bold, the "Shared by … yesterday" line, Copy value, Add to info I share, and the destructive remove). Verify against Figma 119-9506, and that each action lands on `my-info` with the toast from the spec.
- [x] 3.5 Add the `adopt-conflict` sheet (Yours vs Added by, Keep both only for multi-value fields, Replace, Cancel). Verify the email conflict's Keep both and Replace in the browser for case D.
- [x] 3.6 In `flow.ts`, add case `d` (code, name, goal, initial state with Andrew and the member info), the new screens, `designFrames` for `my-info` (38-2883) and `suggestion-actions` (119-9506), hints, the new screen notes and questions, the flow question about telling Bogdan, and the case D notes. Call `complete({ showCompletionView: false })` on add, keep both, replace and remove, but not on copy. Add every new string to `app/locales/en.ts`. Verify that `sc-ppl-002.test.ts` covers the case list, screens, frames, every key being translated, and completion on adopt and remove but not on copy.

## 4. SC-PET-001: profile image and pod-created

- [x] 4.1 Add `podImageAtom` (an object URL, the previous one revoked on replace) and an optional `avatarSrc` on `PodInstance`, set by `createPodAtom`. Make `PodHeader` pass `{ src }` or `{ letter }`. Verify with `create-pod.test.ts` and `sc-pet-001.test.ts`: a pod created with an image carries it, and one without keeps the letter.
- [x] 4.2 Add the "Profile image (Optional)" field to `new-pod` (thumbnail, "Add a profile image", a "select image"/"change image" link driving a hidden `accept="image/*"` input). Verify against Figma 905-15244, and that "Create Pod" availability ignores the image.
- [x] 4.3 Add the `pod-created` screen: `PodView` under a `BottomSheet`, `ensurePodAtom` for direct links, the title with the name in bold, the message, `InviteLinkField` with the text copy control and `FIRST_INVITE_LINK`, and "Go to <name>". Both "Go to" and dismiss go to `pod-notes`. Verify against Figma 1435-44400 and that no suggestion timer or completion runs while the sheet is shown.
- [x] 4.4 Route both creation paths to `pod-created`: `NewPodScreen.create`, and "Create pod" on a named quick-action card. Keep "Open pod" going to `pod-notes`. Update `designFrames` (`new-pod` → 905-15244, `pod-created` → 1435-44400), the screen list and strings. Verify that `sc-pet-001.test.ts` covers both paths reaching `pod-created`, completion only after leaving it with Pets, and the direct link to `pod-created` creating generic Ginger.

## 5. Docs and checks

- [x] 5.1 Update `apps/app-ux-flows/AGENTS.md`: the people model now has member info, `Member.role` is a permission and the Role field is a family role, and the invite link field lives in `pods/people/`. Verify by reading the diff.
- [x] 5.2 Run `pnpm check-types`, `pnpm lint`, `pnpm --filter app-ux-flows test` and `pnpm steiger:concepts`. All must pass.
- [x] 5.3 Walk through in the browser: SC-PET-001 A (image, then pod-created, then Ginger) and B (quick action, then pod-created); SC-PPL-002 A to D (case D: copy, add phone, keep both or replace email, remove); and EXP-PET-003/004/005 `home` with Notifications.
