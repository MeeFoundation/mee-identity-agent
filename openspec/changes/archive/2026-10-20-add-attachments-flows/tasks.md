## 1. Model

- [x] 1.1 Create `flows/sc-att-001/model.ts` with the screen ids, goal type, sample picker files, and the `filesAtom`, `selectedIdAtom`, `goalAtom` and `toastAtom`; verify `pnpm check-types` passes
- [x] 1.2 Add the `addFileAtom` (sample file, today's date, added by the participant, first in the list, numbered on name clash) and its unit tests; verify the tests cover media, document and repeated adds ("photo-jul-15 2.jpg", "photo-jul-15 3.jpg")
- [x] 1.3 Add the `renameFileAtom` (trim, case-insensitive uniqueness, same position, size/date/author kept) and unit tests; verify the tests cover a taken name, an empty name, a name saved unchanged and the icon kind changing with the extension
- [x] 1.4 Add the `deleteFileAtom` and the three goal checks (media added, "About Sophia.databook.mc" renamed to end in ".pdf", "Activities-tracker.xls" deleted); verify the tests cover the wrong-file and wrong-kind cases that must not complete

## 2. Screens

- [x] 2.1 Build the `FilesView` (pod top bar with letter avatar "S", title "About Sofia", subtitle "Attachments", list of `AttachmentItem`, floating "Add attachment" button, empty state "No files yet", toast slot) and the `files` screen; verify in the browser that the four sample files show newest first, with no folders
- [x] 2.2 Build the `add` screen with `AddAttachmentSheet`, wiring Media file and Document to `addFileAtom` and case A's completion; verify in the browser that case A completes on Media file and not on Document
- [x] 2.3 Build the `actions` screen with `AttachmentActionsSheet` ("added by you" / "added by Geo"), wiring Save to device (toast), Rename (to `rename`) and Delete file (removes the row and completes case C for "Activities-tracker.xls" only); verify in the browser
- [x] 2.4 Build the `rename` screen (bottom sheet "Rename file", "File name" field with focus and the current name, Save/Cancel, taken-name error) and case B's completion; verify in the browser that Enter saves, Cancel changes nothing and a taken name disables Save
- [x] 2.5 Make `actions` and `rename` fall back to `files` when no file is selected or it no longer exists; verify with a test that opening either screen on a fresh store lands on `files`

## 3. Flow definition and strings

- [x] 3.1 Add the English strings under `flows.scAtt001` (title, description, three cases, hints, flow, screen and case notes and questions, rename sheet, toast, empty state, taken-name error); verify no user-facing string is hard-coded in the screens
- [x] 3.2 Create `flow.ts` with `defineFlow` (code `SC-ATT-001`, kind `showcase`, three cases with `initialState.goal`, `initialScreen: 'files'`, `createStore`, design frames 486-24413 / 486-27195 / 486-27239 for `files` / `add` / `actions` and none for `rename`, hints and screen notes); verify `pnpm check-types` passes
- [x] 3.3 Register `scAtt001Flow` in `registry.ts` right after `scPpl003Flow`, update the existing registry-order assertions in the other flows' tests, and add the `SC-ATT` family title (`home.families.attachments`) that the home page needs for a new code family; verify the existing flow and home tests pass
- [x] 3.4 Write `sc-att-001.test.ts` in the style of `sc-ppl-003.test.ts` (registration and order, screens and Figma frames, cases and goals, the translated strings exist); verify the test passes

## 4. Verification

- [x] 4.1 Run `pnpm check-types` and `pnpm lint` from the repo root; verify both pass with no errors
- [x] 4.2 Run `pnpm --filter app-ux-flows test` and verify the whole suite passes
- [x] 4.3 Run through cases A, B and C in the browser, including the empty list after deleting every file, and verify each shows "Goal reached" only for its own goal
- [x] 4.4 Run `openspec validate add-attachments-flows --strict` and verify it passes
