## 1. Attachments domain

- [x] 1.1 Add `src/slices/flow/pods/attachments/model.ts` with the `Attachment` and `AttachmentKind` types, `toAttachmentKind(name)` and the kind-to-icon lookup. Verify with `model.test.ts`: mp4/mov → video; jpg/JPG/png/heic → image; xls/xlsx/csv/numbers → spreadsheet; `.databook.mc` and no extension → document.
- [x] 1.2 Add `format.ts` with `formatFileSize(bytes, language)`, `formatAttachmentDate(iso, now, language)` and `toAttachmentDetail(attachment, now, t, language)`. Verify with `format.test.ts`:
  - 10,000,000 → "10 MB", 1,500,000 → "1.5 MB", 143,000 → "143 KB", 512 → "512 B",
  - a date this year → "Aug 7", a date last year → "Jan 23, 2025",
  - the detail line → "10 MB · Aug 7".
- [x] 1.3 Add `sofia-fixture.ts` with the four sample attachments from the spec. Verify that a test reads it and that each detail line matches the Figma values.
- [x] 1.4 Add `pods.attachments.*` strings to `src/app/locales/en.ts`: detail, add sheet title/description/actions, actions sheet description ("added by you" / "added by {{name}}") and actions. Verify with `pnpm check-types`.

## 2. Shared UI components

- [x] 2.1 Add `src/shared/ui/sheet-action-list.tsx`, with icon + label buttons in default and danger tones. Verify it matches the "Sheet action list component" spec when rendered by the sheet tests in 3.3.
- [x] 2.2 Add `src/shared/ui/attachment-row.tsx`:
  - a square icon tile, a truncated name and the detail line,
  - a separate kebab button labelled with the `ui.attachmentRow.menu` string,
  - the content is a `<button>` only when `onOpen` is given.

  Verify with the row test in 3.2.
- [x] 2.3 Add `src/shared/ui/attachment-list.tsx`: a white rounded card with a `<ul>` and a `Divider` only between items. Verify with a static-render test that four rows give four `<li>` and three dividers.
- [x] 2.4 Add `src/shared/ui/floating-action-button.tsx`: an absolutely positioned gradient pill above `--home-indicator-h`, with an icon, a label and `onClick`. Verify with a static-render test that it renders a button named by its label.
- [x] 2.5 Register `AttachmentList`, `AttachmentRow`, `FloatingActionButton` and `SheetActionList` in `src/shared/ui/pod-components.ts`, and add the `ui.attachmentRow.*` strings. Verify with `pnpm check-types` that `PodComponents` includes them.

## 3. Attachment sheets and row binding

- [x] 3.1 Add `pods/attachments/components/attachment-item.tsx`, which maps an `Attachment` to `AttachmentRow` with the icon for its kind and its detail line, using `useFlowComponents`.
- [x] 3.2 Add `attachment-item.test.ts` that renders with a capturing `AttachmentRow`. Verify that:
  - the icon and detail are passed through,
  - `onOpen` is omitted when not given,
  - the kebab's accessible name in real markup includes the file name.
- [x] 3.3 Add `components/add-attachment-sheet.tsx` and `components/attachment-actions-sheet.tsx`, both built on `BottomSheet` + `SheetActionList` from `useFlowComponents`. Verify with `sheets.test.ts`, rendering with capturing stubs:
  - add sheet: the title and description; exactly "Media file" and "Document"; each handler fires.
  - actions sheet: title = file name; description "10 MB · Aug 7 · added by you", and "added by Anna" when `addedByName` is given; "Save to device", "Rename", "Delete file" in that order, with Delete in the danger tone; no folder action; each handler fires; `onDismiss` is passed to `BottomSheet`.

## 4. Quality checks

- [x] 4.1 Run `pnpm --filter app-ux-flows test` and verify all tests pass.
- [x] 4.2 Run `pnpm --filter app-ux-flows knip` and verify that no new file or export is reported unused.
- [x] 4.3 Run `pnpm check-types` and `pnpm lint` from the repo root and verify both pass with no errors.
