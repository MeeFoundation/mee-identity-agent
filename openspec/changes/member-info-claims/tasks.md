## 1. Member info model

- [x] 1.1 In `pods/people/member-info.ts`, add `isShown` (strict field and value match against `shared`) and make `addedByPerson` and `findAdded` return only shown details. Verify with new `member-info.test.ts` cases: a matching detail is hidden, and it is shown again after the shared value changes
- [x] 1.2 Stop `adopt`, `keepBoth` and `replace` from removing the adopted detail from `addedByOthers`. Keep `removeAdded` deleting it. Verify the existing `member-info.test.ts` and `sc-ppl-002.test.ts` case D expectations still pass, and add a "removed stays removed" test
- [x] 1.3 Add `editShared`, `addShared` (run-unique ids) and `pickableOwnFields`. Verify with unit tests: an edit keeps its position, an add goes at the end, and single-value fields Bogdan shares are left out of the picker
- [x] 1.4 Add `setDetailAbout` (outcomes `matches` / `added`, one detail per `addedBy`+field, an update keeps its position, `addedDaysAgo: 0`) and `removeDetailBy`. Verify with unit tests covering create, update, "match deletes" and remove
- [x] 1.5 Add the case E fixtures `geoInfoWithOldEmail` and `andrewAddedAboutGeo`. Verify `pnpm --filter app-ux-flows test` passes

## 2. Flow state

- [x] 2.1 In `flows/sc-ppl-002/model.ts`, add `editMySharedAtom`, `addMySharedAtom`, `saveDetailAboutAtom` (returns the outcome) and `removeMyDetailAboutAtom`, and extend `InfoToast` with `updated`, `addedAbout`, `alreadyShared` and `removedMine`. Verify with model tests in `sc-ppl-002.test.ts`
- [x] 2.2 Add case E (`SC-PPL-002-E`) to `flow.ts`, change the `member-detail` design frame to `38-2883`, and add the case E and flow question keys. Verify a flow test that starts case E and reads Geo's info and Andrew's detail

## 3. Member info view

- [x] 3.1 Generalise `components/my-info-view.tsx` into `components/member-info-view.tsx` (`memberId`, `showToast`), with labels, help text, row controls and the bottom "Remove from pod" button chosen by `isMe`. Verify that `my-info` looks unchanged in case D in the browser
- [x] 3.2 Add an inline editor for shared rows and an "Add" editor with a `SelectField` picker (own fields from `pickableOwnFields`, all five fields for someone else), using `InlineFieldEditor` + `TextField`. Only one editor open at a time, opening one clears the toast, and Save is disabled while the value is empty or unchanged. Verify by editing Bogdan's Address and adding an email in case A
- [x] 3.3 On someone else's screen, give Bogdan's own rows an edit control and a "Remove" control, and leave other people's rows read-only. Call `complete({ showCompletionView: false })` when a detail about someone is saved with outcome `added`. Verify the "Add the right email" and "Take back a detail" scenarios in case E
- [x] 3.4 Point `my-info`, `suggestion-actions` and `adopt-conflict` at `MemberInfoView` with `bogdan.id`, and `member-detail` and `remove-confirm` at the selected member. Delete `member-detail-view.tsx`, and remove `memberJoinedOn` / `formatLongDate` and their tests if nothing else uses them. Verify case C removal and Cancel still work

## 4. Strings and notes

- [x] 4.1 Add the `en.ts` strings: other-member section labels and help text, "hasn't shared any info yet", "+ Add info about <name>", editor Save/Cancel/picker labels, the new toasts, case E name/goal/description/question, the new flow question, and the updated `member-detail` and `my-info` notes. Remove the unused `memberDetail.joined` / `canDo` and `myInfo.questions.whatEditable` strings. Verify that no missing-key warnings appear when going through every screen

## 5. Verification

- [x] 5.1 Run `pnpm --filter app-ux-flows test`, `pnpm check-types` and `pnpm lint` from the repo root, all passing
- [ ] 5.2 Go through cases C, D and E in the browser against the spec scenarios. That includes the scenario where a matching detail is hidden and comes back (case D: Replace, then edit the email back)
