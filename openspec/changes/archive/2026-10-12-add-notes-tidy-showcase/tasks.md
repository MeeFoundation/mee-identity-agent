## 1. Showcase explanations and questions (runtime)

- [x] 1.1 Add `questionKeys` and `screenNotes` to `ShowcaseDefinition` and `CaseDefinition` in `runtime/define-flow.ts`, typed `never` on `ExperimentDefinition`; extend `define-flow.test.ts` (type-level `@ts-expect-error` cases) so an experiment declaring them fails `pnpm check-types`
- [x] 1.2 Resolve `notes` (flow / case / per-screen, case `aboutKey` replaces, case questions appended) in `runtime/resolve-flow.ts`; add `resolve-flow.test.ts` cases for replace, append, declaration order, and a flow without notes
- [x] 1.3 Add `flow.briefing.thisScreen`, `thisCase`, `thisFlow`, `openQuestions` to `app/locales/en.ts`, and render the three groups after the actions in `briefing/briefing-content.tsx` (empty groups and empty "Open questions" label omitted); verify in the browser on a showcase at desktop and at 480 px width, and that the mission card is unchanged

## 2. Contact info and recognition (pure logic)

- [x] 2.1 Create `pods/people/contact-info.ts` with `ContactInfoRecord` (first name, last name, ISO date of birth, email) and `toContactInfoFieldRows` (fixed order, empty fields left out, date as "April 8, 2018"); unit test the order, omission and date format
- [x] 2.2 Create `pods/notes/tidy.ts` with the `NoteBlock` type, `recogniseLines` (full name, "Born MM/DD/YYYY" as US date, email-in-line; known vs new against the record), `previewTidy` and `applyTidy` (remove lines, collapse blank lines, insert a link at the first line unless one exists); unit test every scenario in the "Mocked recognition", "Tidy confirmation" and "Tidying" requirements, including "Born 04/08/2018" → April 8, 2018 and case C keeping exactly one link

## 3. Notes view

- [x] 3.1 Build `pods/notes/tidy-notes-area.tsx`: text blocks as auto-growing transparent-text textareas over a backdrop that paints hashtags and known/new line highlights, link blocks as buttons labelled from the record, the "Tidy" chip below the last recognised line, and the existing inert toolbar; verify in the browser that the caret and wrapping line up with the painted text
- [x] 3.2 Add the link pulse (about 1 s `brand-100` background, static outline under `motion-reduce`) and verify it in the browser

## 4. SC-PPL-001 flow

- [x] 4.1 Create `flows/sc-ppl-001/model.ts` with the screen ids, initial-state type (contact record, note blocks), atoms (`noteBlocksAtom`, `contactInfoAtom`, `suggestionAtom`, `tidiedAtom`, `tidyOriginAtom`, `linkPulseAtom`), and write atoms `setBlockTextAtom` (clears the suggestion), `analyseAtom`, `confirmTidyAtom`; unit test that editing clears the suggestion and that confirming updates the record and blocks
- [x] 4.2 Add `useAnalysisTimer` (1.5 s debounce, exported `ANALYSIS_DELAY_MS`); test with fake timers that the suggestion appears only after the pause and never on screen open
- [x] 4.3 Add the flow header (`PodTopBar` with "About Sofia", "S", People > Immediate Family, `People` icon, Notes/Chat/Info tabs with inert back, menu and Chat) and the screens `notes`, `notes-tidied`, `tidy-confirm` (`BottomSheet` over the origin note, both titles, "NEW" badges, "Tidy notes", dismiss → `back()`, nothing recognised → `notes`), `contact-info` (read-only `FormCard`, "No contact info yet."); verify each screen in the browser against its Figma frame
- [x] 4.4 Write `flows/sc-ppl-001/flow.ts`: `kind: 'showcase'`, code, design frames (975-19788, 975-20740, 975-20502), cases A–D with initial state, goals and descriptions, and every flow, screen and case explanation and question from the "Showcase notes" requirement; register it last in `slices/flow/registry.ts`
- [x] 4.5 Add all `flows.scPpl001.*` strings to `app/locales/en.ts` (title, description, case names, goals, descriptions, hints, sheet titles, field labels, "NEW", "Tidy", "Tidy notes", "No contact info yet.", explanations and questions); verify no hardcoded user-facing string remains in the flow folder

## 5. Flow tests and checks

- [x] 5.1 Add `flows/sc-ppl-001/sc-ppl-001.test.ts` following `sc-pet-001.test.ts`: registry entry, codes, screens, design frames, every case resolving with its starting note and record, case C's `notes-tidied` notes resolving to its explanation plus four questions, and completion after "Tidy notes"
- [x] 5.2 Walk through cases A, B, C and D end to end in `pnpm --filter app-ux-flows dev` and confirm they match the spec scenarios, including "Goal reached", "Try case …" and the notes groups following the screen
- [x] 5.3 Run `just check` (`pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test`, `pnpm --filter app-ux-flows knip`) and verify it passes with no errors

## 6. Review rework: three cases, update sheet shows only added fields

- [x] 6.1 Update the spec, briefing spec, proposal and design: drop "Partly known contact", make the update scenario case B and "Nothing to tidy" case C, and have the update sheet show only the fields the recognised lines give; verify with `openspec validate add-notes-tidy-showcase --strict`
- [x] 6.2 Add `fields` to `previewTidy`, filter the sheet rows to it when the note has a link, and rework the cases, strings and questions in `flow.ts`/`en.ts`; update `tidy.test.ts` and `sc-ppl-001.test.ts`, and verify they pass
- [x] 6.3 Walk through cases A, B and C in the browser, and run `just check` with no errors

## 7. Review rework: editable sheet that names Sofia

- [x] 7.1 Update the spec, proposal and design: the sheet shows every field, every row can be edited before tidying, the update title and description name Sofia, and the case B and `tidy-confirm` questions are revised; verify with `openspec validate add-notes-tidy-showcase --strict`
- [x] 7.2 Add `tidyEditsAtom` (cleared on Tidy, laid over the preview and the confirm), inline row editing in `tidy-confirm`, the new title, description and questions, and remove the `fields` filter; cover the edits in `sc-ppl-001.test.ts` and verify the tests pass
- [x] 7.3 Walk through cases A and B in the browser, including editing a value, and run `just check` with no errors
