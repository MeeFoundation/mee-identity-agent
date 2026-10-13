## Why

Notes are where people drop information first, and the Tellipod designs (Mee – Tellipod App v4.0.3, frames 975-19350, 975-20094, 975-19788, 975-20740, 975-20502) show how "Tidy" turns recognised note text into a proper form and leaves a link behind. We need a clickable showcase of it to demo and discuss with the team before any recognition API exists. The team also needs every showcase to explain itself and to carry its open design questions next to the screens they concern. Today a showcase can only show a goal and a per-screen hint for the tester.

## What Changes

- New showcase **SC-PPL-001 "Tidy Sofia's notes"** (`sc-ppl-001`). The tester writes in the Notes tab of the "About Sofia" pod (People > Immediate Family). After a short typing pause, a mocked analyser highlights the lines it recognises as contact information and offers "Tidy". Tidy opens a confirmation sheet showing the resulting Contact info. Confirming moves the data into Sofia's Contact info and replaces the lines with a "Sofia Walker" link to it.
- Three cases share the screens and differ only in their starting data and goal:
  - **A**: create. Contact info is empty, and the recognised lines become a "Sofia Walker" link;
  - **B**: update. The note already holds the tidied link, and a new "Sofia email: …" line is offered on its own. The sheet names Sofia, shows all her details with the email marked new, and lets any value be changed before tidying. The line then disappears into the existing link;
  - **C**: not recognised, so nothing is highlighted and no Tidy is offered.
- Recognition is deterministic and local, with no API: a line holding the person's full name, a "Born MM/DD/YYYY" line (US date), or a line containing an email address.
- **Showcase explanations and open questions** (framework). A showcase can declare an explanation and a list of open questions for the flow, for each screen, and for each case (including case-specific screen questions). They are shown to everyone in the briefing side panel and in the phone-width Goal overlay. Experiments are unchanged and still show nothing.
- SC-PPL-001 ships with its explanations and open questions, including the ones already raised: dismissing a suggestion, undoing Tidy, how to add information to an existing contact through notes, and what the two highlight colours mean.
- Revised after review: the "partly known contact" case was dropped, the update scenario became case B, and the Tidy sheet shows every field, can be edited, and names Sofia when updating.

Assumption to confirm in review: the display code `SC-PPL-001` and the flow id `sc-ppl-001`.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-ppl-001`: the "Tidy Sofia's notes" showcase covering its screens, cases, mocked recognition, the Tidy confirmation, the Contact info result, and its explanations and open questions.

### Modified Capabilities
- `app-ux-flows/flow-briefing`: showcases (flow, screens and cases) may declare explanations and open questions, and the side panel and Goal overlay show them for the current screen and case.

## Impact

- `apps/app-ux-flows/src/slices/flow/runtime/` (`define-flow.ts`, `resolve-flow.ts`): new optional showcase fields, resolved per case.
- `apps/app-ux-flows/src/slices/flow/briefing/`: a new notes section in `BriefingContent`, which is used by both the panel and the overlay.
- New flow folder `apps/app-ux-flows/src/slices/flow/flows/sc-ppl-001/`, registered in `slices/flow/registry.ts`.
- New reusable pod pieces under `apps/app-ux-flows/src/slices/flow/pods/`: a contact-info record and its projection, the note-recognition logic, and a block-based notes area with highlights and inline form links. The existing `NotesArea` and `noteTextAtom` used by the other flows stay unchanged.
- `apps/app-ux-flows/src/app/locales/en.ts`: new strings.
- No new dependencies and no backend.
