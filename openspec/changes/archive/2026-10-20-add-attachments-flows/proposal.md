## Why

The flat attachment building blocks (rows, the "Add to Files" sheet, the file actions sheet, Sofia's sample files) shipped in `83d229d` with no flow that uses them, so nobody can try adding, renaming or deleting a file. The Tellipod v4.0.3 Attachments frames show the screens; this change turns them into a showcase, without the folder variants in those frames (attachments stay flat).

## What Changes

- Add the showcase **SC-ATT-001 "Sofia's files"** to `app-ux-flows`: the Attachments tab of Sofia's pod, where the owner adds, renames, saves and deletes files.
- Three cases sharing the same screens and differing in goal: **A** add a file, **B** rename a file, **C** delete a file.
- Screens: the files list, the add sheet, a file's actions sheet and a rename sheet. The list, add sheet and actions sheet reference their Figma frames in Mee – Tellipod App v4.0.3 (486:24413, 486:27195, 486:27239); the rename sheet has none.
- Prototype behavior the frames do not show, flagged as such in the showcase notes: a mocked file picker for Media file and Document, the rename step, a "saved" toast for Save to device, and an empty list after the last file is deleted.
- List the showcase after SC-PPL-003 in the registry.
- Not changed: the attachments spec and components. They already match the flat design (no folders, no "Move to a folder"), so nothing in them is modified.
- Not included: folders (rows, nested view, "Folder" option, "Move to a folder"), private files, and linking the "Attachments" row on Sofia's Info tab to this showcase.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-att-001`: the SC-ATT-001 showcase: identity, cases, screens, the file list state, add, rename, save and delete behavior, and its notes and questions.

### Modified Capabilities
<!-- None: `app-ux-flows/attachments` already requires flat files and the sheets this flow uses. -->

## Impact

- New flow folder `apps/app-ux-flows/src/slices/flow/flows/sc-att-001/` (flow, model, screens, tests).
- `apps/app-ux-flows/src/slices/flow/registry.ts`: register the flow.
- `apps/app-ux-flows/src/app/locales/en.ts`: strings under `flows.scAtt001`, plus the home group title `home.families.attachments`; `slices/home/flow-families.ts` maps the `SC-ATT` code family to it.
- `shared/ui/text-field.tsx`: a new optional `error` prop, used by the rename sheet; existing uses are unchanged.
- Reuses `pods/attachments` (model, format, `sofiaAttachments`, `AttachmentItem`, both sheets) and the shared UI `AttachmentList`, `FloatingActionButton`, `BottomSheet`, `InlineFieldEditor`, `Toast`, `EmptyStateCard`, `PodScreen`. No new dependencies; no native or backend changes.
- Existing flows behave as before; only the registry-order assertions in the SC-PPL-001, SC-PPL-003 and chat-add-medication tests change.
