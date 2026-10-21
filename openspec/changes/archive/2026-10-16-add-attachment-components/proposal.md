## Why

Several pods already show an "Attachments" category row in their Info tab (Sofia in `sc-ppl-002`/`sc-ppl-003`, Ginger in `exp-pet-003`–`005` and `sc-pet-001`), but tapping it leads nowhere because `app-ux-flows` has no building blocks for an attachments screen. The Tellipod v4.0.3 designs define that screen (a file list, an "Add attachment" button, an add sheet and a per-file actions sheet). This change provides those pieces as reusable, flow-independent components so upcoming flows only need to wire screens and state.

## What Changes

- Add shared UI components to the design system, registered as replaceable pod components so variants can override them:
  - **Attachment row**: a square file-type icon tile, the file name, a "size · date" line, and a separate "more actions" button; the row itself is a button only when the flow gives it an open action.
  - **Attachment list**: one white rounded card that holds attachment rows separated by dividers.
  - **Sheet action list**: a vertical list of icon + label actions for use inside a bottom sheet, with a destructive (red) tone.
  - **Floating action button**: an icon + label pill pinned to the bottom-right of the screen above the home indicator.
- Add an attachments pod domain:
  - An attachment record (name, size, when it was added, who added it).
  - Deriving a file kind (video, image, spreadsheet, document) from the file name, which picks the row's icon.
  - Formatting a file size ("10 MB", "1.5 MB", "143 KB") and the row/sheet detail lines.
  - An **Add attachment sheet** offering "Media file" and "Document".
  - An **Attachment actions sheet** titled with the file name and offering "Save to device", "Rename" and "Delete file".
  - Sample attachments for Sofia's pod for future flows and tests.
- Folders are out of scope: there are no folder rows, no "Folder" option when adding, and no "Move to a folder" action.
- No flow, screen or navigation changes; existing "Attachments" category rows keep their current behavior.

## Capabilities

### New Capabilities
- `app-ux-flows/attachments`: the attachment record, file kind and size presentation, and the add and per-file actions sheets that pods use to show attachments.

### Modified Capabilities
- `app-ux-flows/design-system`: adds requirements for the attachment row, attachment list, sheet action list and floating action button components.

## Impact

- `apps/app-ux-flows/src/shared/ui/`: new component files, registered in `pod-components.ts`.
- `apps/app-ux-flows/src/slices/flow/pods/attachments/`: new module (model, helpers, sheets, fixture, tests).
- `apps/app-ux-flows/src/app/locales/en.ts`: new `ui.*` and `pods.attachments.*` strings.
- No new dependencies (icons come from `react-bootstrap-icons`, already used). No flow, analytics or routing changes.
