## Context

See proposal.md for the motivation and specs for the behaviour. Relevant current state in `apps/app-ux-flows`:

- `runtime/define-flow.ts` splits flows into experiments and showcases. A showcase already has `descriptionKey`, `goalKey` and `hints`, and its cases (`CaseDefinition`) have `descriptionKey`, `goalKey`, `hints` and `initialState`. `runtime/resolve-flow.ts` merges case hints over flow hints into one `ResolvedFlow`, and `briefing/briefing-content.tsx` renders goal, hint, "Goal reached" and actions for both the side panel and the phone overlay.
- `pods/notes/notes-area.tsx` is one plain `<textarea>` bound to a single `noteTextAtom` string. It is shared by SC-PET-001 and the Ginger flows and can't show highlights or inline links.
- `shared/ui` already has `BottomSheet` (shown as its own screen over another, as in SC-PET-001 `new-pod`), `FormCard`/`FieldRow`, `PodScreen`, `PodTopBar` and `SegmentedTabs`. `pods/catalog/templates.ts` already names `ContactInfoShape`.
- The prototype draws no on-screen keyboard in any flow.

## Goals / Non-Goals

**Goals:**
- Explanations and open questions become a reusable showcase feature, not something written into SC-PPL-001's screens.
- The mocked recognition is a pure, unit-tested function, so the timing, highlights and tidy result are deterministic.
- Existing notes behaviour in the other flows stays exactly as it is.

**Non-Goals:**
- Real text analysis, an API contract, or any network call.
- Rich-text formatting. The toolbar stays inert.
- Explanations and questions for experiments.
- Editing Contact info, or undoing a Tidy.

## Decisions

### 1. Notes shape in the flow definition
Add to `ShowcaseDefinition`:
- `questionKeys?: readonly string[]` for flow questions;
- `screenNotes?: Partial<Record<S, { aboutKey?: string; questionKeys?: readonly string[] }>>`.

Add to `CaseDefinition`: `questionKeys?` and `screenNotes?` with the same shape. On `ExperimentDefinition` these fields are typed `never`, using the same pattern as `cases`, so declaring them fails type checking. The flow's and case's existing `descriptionKey` serve as their explanations, so nothing is written twice.

`resolveFlow` produces `notes: { flow: Note, case: Note | null, screens: Partial<Record<S, Note>> }`, with `Note = { aboutKey: string | null; questionKeys: readonly string[] }`. A case's screen `aboutKey` replaces the flow's, and its `questionKeys` are appended to the flow's. This mirrors how hints already resolve, so the briefing stays a pure renderer.

*Alternatives:* a separate notes file per flow (Markdown) would break the i18next rule and couldn't follow the current screen. A reviewer-mode toggle was dropped, because everyone viewing a showcase should see the notes.

### 2. Briefing rendering
`BriefingFlow` adds `notes`. `BriefingContent` renders up to three groups ("This screen", "This case", "This flow") after the existing actions, using the existing `BriefingSection` styling plus a `<ul>` for questions. The panel and the overlay pick this up automatically. `MissionCard` doesn't use `BriefingContent`, so it is unaffected.

### 3. Suggestion is in-screen state, not a screen
The highlighted state lives inside `notes` and `notes-tidied` rather than having its own screen id. Switching screens remounts the screen component, which would drop the text caret mid-typing and push history entries on every pause. `notes` and `notes-tidied` render the same `TidyNotesView`. Which of the two the Notes tab opens is derived from a `tidiedAtom` flag, the same pattern as SC-PET-001's `podInfoScreenAtom`.

*Alternative:* a `notes-tidy-offered` screen with `replace` navigation. It was rejected because of the focus loss and the screen ping-pong on every edit.

### 4. Note model: blocks
Data model:

```
type NoteBlock =
  | { kind: 'text'; id: string; text: string }
  | { kind: 'contact-link'; id: string }
```

The link label isn't stored. It is projected from the Contact info record (`firstName lastName`), following the "one owner, projections elsewhere" rule in AGENTS.md. Each text block is an auto-growing `<textarea>` with transparent text and a visible caret, laid over a backdrop `<div>` that uses the same font and wrapping. The backdrop paints the text, hashtags in the tag colour, and line highlights (`warning-50`/`warning-300` border for known, `brand-50`/`brand-300` for new). The "Tidy" chip renders after the highlighted line. A link block renders as an underlined button between textareas.

*Alternative:* `contentEditable`. It was rejected because caret and selection management under React re-renders is fragile, and the backdrop approach keeps native editing.

### 5. Recognition and tidy as pure functions
These go in `pods/notes/tidy.ts` (pure, no React or Jotai):
- `recogniseLines(blocks, person, contact) → RecognisedLine[]`. Each entry has the block id, the line index, the kind (`name | birth | email`), the values and the status (`known | new`). The rules are the three in the spec. The date is parsed as US MM/DD/YYYY and stored as ISO `YYYY-MM-DD`.
- `previewTidy(contact, lines) → { record, fields, newFields }` feeds the sheet. The sheet shows every field of `record`. Values edited in the sheet are kept in a `tidyEditsAtom` that is cleared whenever "Tidy" is activated. They are laid over the preview, and over the result of `applyTidy` on confirm, so the record keeps a single owner and nothing is saved until "Tidy notes". Rows are edited with the shared `InlineFieldEditor`, as in EXP-PET-004.
- `applyTidy(blocks, contact, lines) → { blocks, contact, insertedLink: boolean }`. It removes the lines, collapses blank lines, and inserts a link where the first line was unless a link already exists.

The Contact info record and its projection `toContactInfoFieldRows(record)` go in `pods/people/contact-info.ts`. That covers field order, the date as "April 8, 2018" via `Intl.DateTimeFormat('en-US', { dateStyle: 'long' })`, and leaving out empty fields.

### 6. Timing
`useAnalysisTimer` in the flow folder re-arms a 1.5-second `setTimeout` whenever the note text changes and then sets `suggestionAtom` from `recogniseLines`. Note edits go through a `setBlockTextAtom` write atom that also clears `suggestionAtom`, so clearing happens immediately and doesn't depend on React effects. `ANALYSIS_DELAY_MS` is exported, and tests use fake timers.

### 7. Confirmation and completion
`tidy-confirm` renders the origin note view (`notes` or `notes-tidied`, from a `tidyOriginAtom`) with `BottomSheet` over it, as SC-PET-001 renders `new-pod` over Home. Opening the dialog moves focus into it, which blurs the textarea; that is the "keyboard closes" behaviour. Dismiss calls `back()`. With no suggestion, the screen calls `goToScreen('notes')` from a layout effect. The runtime has no replace navigation, and adding one is out of scope. "Tidy notes" sets the atoms from `applyTidy`, sets `tidiedAtom`, sets `linkPulseAtom` when no link was inserted, navigates to `notes-tidied`, and calls `complete({ showCompletionView: false })`.

### 8. Link pulse
`linkPulseAtom` holds a counter. The link block applies a 1-second `brand-100` background transition keyed on it and respects `motion-reduce` by showing a static outline instead.

### 9. Pod top bar
`PodTopBar` takes the fixture title "About Sofia", the avatar letter "S", the breadcrumb `['People', 'Immediate Family']` and the `People` icon from `react-bootstrap-icons`, passed straight in by the flow's own header component. The pod catalog has no People category. Adding one to the taxonomy in `pods/catalog/categories.ts` is a separate concern, and this showcase creates no pods.

### 10. Strings
Flow strings go under `flows.scPpl001.*` (title, description, cases, goals, hints, tidy sheet, contact info labels, notes). Briefing labels "This screen", "This case", "This flow" and "Open questions" go under `flow.briefing.*`.

## Risks / Trade-offs

- [Backdrop and textarea drift apart, for example on wrap or scrollbar] → Both layers share one class list, the textarea auto-grows so it never scrolls, and the width is fixed by the parent.
- [The tester types the email on the same line as "Born …"] → That line holds an email address, so it is recognised as an email line and its "Born" part goes unrecognised. This is acceptable for a mock, and it is covered by the flow question about when analysis runs.
- [Suggestion appears mid-word] → Accepted, and asked as an open question ("analysed while typing, or once a line is finished?").
- [Questions mean longer side panels] → The groups sit after the actions, so "Start over" stays reachable without scrolling.
- [Timers in tests] → The logic is in pure functions, and the hook is tested with fake timers.

## Open Questions

- Is `SC-PPL-001` the right code for the "People" domain? Renaming later only touches the flow id, code and locale keys.
