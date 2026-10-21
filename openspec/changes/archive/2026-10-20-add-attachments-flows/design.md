## Context

See proposal.md for why. SC-ATT-001 is a new showcase in `app-ux-flows` that follows the shape of SC-PPL-003: a flow folder under `slices/flow/flows/`, a Jotai store created per run, one screen component per screen id, English strings under `flows.<camelCode>`, and a registry entry.

The pieces it needs exist from `83d229d`: `pods/attachments` (the `Attachment` record, `toAttachmentKind`, `sofiaAttachments`, `AttachmentItem`, `AddAttachmentSheet`, `AttachmentActionsSheet`) and the shared `AttachmentList`, `FloatingActionButton`, `InlineFieldEditor`, `Toast`, `EmptyStateCard`. The sheets take handlers and run nothing themselves, so the flow owns all state.

Other flows (for example SC-PET-002) model each sheet as its own screen id, so a sheet step has its own URL and Figma frame. `BottomSheet` hands over between consecutive screens without re-animating.

## Goals / Non-Goals

**Goals:**
- One run's files, the open file and the goal live in a per-run store, so cases never leak into each other.
- Every step in the briefing's screen list is a real screen id with a URL, as in the other showcases.
- No change to `pods/attachments` behavior or to the `app-ux-flows/attachments` spec.

**Non-Goals:**
- Folders, private files, real file picking or storage, and linking from Sofia's Info tab (its "Attachments" row stays a no-op).
- Making the shared components know about the flow's state.

## Decisions

**Sheets are screens (`add`, `actions`, `rename`), each rendering the files list underneath.** The list is one component, `FilesView`, used by all four screens so the background never differs. Alternative: one `files` screen with local open/closed sheet state. Rejected: the briefing and Figma frame links would have no step to point at, and the other showcases don't work that way.

**The open file is an atom (`selectedIdAtom`), set before navigating to `actions` and `rename`.** Alternative: a route parameter per file. Rejected: the runtime's URLs carry the screen and the case only, and a file id in the URL would let a reviewer open a sheet for a file that was since deleted. Opening `actions` or `rename` with no selected file, or one that no longer exists, falls back to `files`.

**State: `filesAtom` (the list, newest first), `selectedIdAtom`, `goalAtom` and `toastAtom`, plus write atoms `addFileAtom`, `renameFileAtom` and `deleteFileAtom`.** The write atoms hold the rules (unique names, numbering, trimming) so they are unit-testable without rendering. Each returns what happened (`added` kind, `renamed` from/to, `deleted` id) and the screen decides whether that completes the goal, like `scheduleReply` and `goalAtom` in SC-PPL-003. Goal checks are plain functions of that result so they can be tested directly.

**Goal types: `'add' | 'rename' | 'delete'`, set from the case's `initialState` in `createStore`.** Same pattern as SC-PPL-003's `goal`. Completion is reported with `complete({ showCompletionView: false })`.

**Sample files for the mocked picker are constants in the flow's model**, not in `pods/attachments`: nothing else needs them. New ids come from a counter in the store so they never clash with `sofiaAttachments` ids after deleting and re-adding.

**Rename uses a bottom sheet with a `TextField` inside `InlineFieldEditor`.** The editor already gives Save/Cancel, Enter-to-save and focus on the first input. `TextField` has no error state, so it gets an optional `error` prop (red border, `aria-invalid`, message under the field); fields without it render as before. Alternative: editing the name in the row. Rejected: the row is the shared `AttachmentRow`, and an inline mode would change a shared component for one flow.

**Name uniqueness compares trimmed names ignoring case**, matching how the spec words it; the number suffix goes before the last extension (`photo-jul-15 2.jpg`), or at the end when there is no extension.

**Added-by names come from the members already defined for Sofia's pod** (`geo`, `andrew` in `pods/people/sharing`), with `you` meaning the participant, as `sofiaAttachments` already encodes. The sheet receives `addedByName` only for other members.

**Registry position:** inserted right after `scPpl003Flow` in `flowDefinitions`. Existing tests that count from the end of `listFlows()` (SC-PPL-003 is `at(-4)`) change to match; they test position, not behavior.

**A new home group "Attachments" for the `SC-ATT` code family**: the home page groups flows by code family and a family without a title fails `flow-families.test.ts`, so `familyTitleKeys` gets `'SC-ATT'`.

**Strings** all go under `flows.scAtt001.*`, except new shared strings, which would go under `pods.attachments.*`. The empty-state copy, rename sheet and toast are flow-specific for now, since the frames don't define them.

## Risks / Trade-offs

- [The Figma frames include folders this showcase leaves out, so reviewers comparing against Figma may think something is missing] → The `files`, `add` and `actions` screen notes and the spec say it, and the proposal records the decision.
- [Prototype inventions (rename sheet, toast, empty state, mocked picker) could be taken for approved design] → Each is named in the screen notes as "not in the design", and `rename` declares no Figma frame.
- [Repeated adds make the list grow with identical-looking sample files] → The numbering keeps names unique; a run is short and resets on restart.
- [Delete with no confirmation can look like a bug] → It's what the existing sheet spec requires; it is raised as an open question in the flow notes.
- [Changing positional assertions in other flows' tests] → Limited to the registry-order lines; no behavior asserted there changes.
