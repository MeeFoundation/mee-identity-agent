## Context

`app-ux-flows` builds screens from shared components in `src/shared/ui/`. Flows get them through `useFlowComponents()`, and the default set comes from `defaultComponents` and `podComponents` (`src/shared/ui/pod-components.ts`), so a variant can replace any of them. Pod domains live in `src/slices/flow/pods/<pod>/` (model, pure helpers with Vitest tests, pod-specific components that read from `useFlowComponents`).

Relevant existing pieces:
- `BottomSheet` already provides the grabber, title, optional description, modality and dismissal. The new sheets only supply its content.
- `RecordRow` and `CategoryRow` are single-button rows with a round icon and a chevron, each in its own card. The attachment row's shape differs (square tile, kebab, rows grouped in one card), so it gets its own component.
- `PodTopBar` already accepts a `subtitle`, which covers the "About Sofia / Attachments" header. No change is needed.
- Knip runs per app and reports unused files and exports. Nothing in a flow uses these components yet, so tests have to import them.
- There is no DOM testing library. Component tests use `renderToStaticMarkup` with a `FlowRuntimeContext.Provider` and component overrides that capture props (see `runtime/render-screen.ts` and `sc-pet-003.test.ts`).
- `PodMember` and `PARTICIPANT_ID` live in `pods/ginger/model.ts`. Pods are siblings and do not import each other.

## Goals / Non-Goals

**Goals:**
- Presentational components with plain props and no attachment-specific knowledge in `shared/ui`.
- The attachments domain (record, helpers, the two sheets) in one pod-agnostic module that any pod's flow can use.
- Every new export is covered by a unit test, so Knip and the quality checks pass with no flow using the components.

**Non-Goals:**
- An attachments screen, navigation, state atoms or analytics events.
- Picking files, previewing, renaming, saving or deleting. The sheets only report which action was chosen.
- A delete confirmation, which is left to the flow.
- Changing the existing "Attachments" category rows.

## Decisions

### Layering: generic UI in `shared/ui`, attachment knowledge in `pods/attachments`
`AttachmentRow`, `AttachmentList`, `SheetActionList` and `FloatingActionButton` go in `shared/ui` and are added to `podComponents`. The row takes `icon`, `name`, `detail`, `onMenu` and an optional `onOpen`. It does not take an `Attachment`, because `shared` cannot import from `slices`, and plain props keep the row usable for any file-like list.

`src/slices/flow/pods/attachments/` holds:
- `model.ts`: the `Attachment` type, `toAttachmentKind`, and the kind-to-icon map.
- `format.ts`: `formatFileSize` and `formatAttachmentDate`, plus `toAttachmentDetail` for "size · date".
- `components/`: `AddAttachmentSheet`, `AttachmentActionsSheet`, and a convenience `AttachmentItem` that turns an `Attachment` into an `AttachmentRow`. All of them get their building blocks from `useFlowComponents`.
- `sofia-fixture.ts`: the four sample files.

*Alternative:* put everything in `shared/ui`. That was rejected because the copy ("Add to Files", "added by you") and the file-kind rules are domain behavior, and the existing pods keep that in `slices/flow/pods`.

### Who added the file
`Attachment.addedBy` holds a member id. To keep the module independent of the ginger and people models, `AttachmentActionsSheet` does not resolve members itself. It takes an `addedByName?: string`, and an omitted name means the participant ("added by you"). A flow resolves the name with its own pod's members.

*Alternative:* pass `members` and a participant id. That was rejected because it would duplicate `PodMember` or create a cross-pod import.

### Attachment record shape
```
type Attachment = {
  id: string
  name: string
  sizeBytes: number
  addedAt: string   // ISO calendar date (YYYY-MM-DD), like other fixtures
  addedBy: string   // member id
}
type AttachmentKind = 'video' | 'image' | 'spreadsheet' | 'document'
```
The kind is derived from `name`, not stored, so a rename can never leave it stale.

### Formatting
- Size: decimal units. The number comes from `Intl.NumberFormat(language, { maximumFractionDigits })`, with one fraction digit below 10 and none from 10 up, which drops ".0". The unit comes from i18next strings (`pods.attachments.size.b|kb|mb|gb`). `Intl`'s own unit style is not used because it prints "143 kB" and "512 byte", not the design's "143 KB" and "512 B". A size that would round to 1000 of a unit moves to the next unit, so 999,999 bytes reads "1 MB".
- Date: `Intl.DateTimeFormat(language, { month: 'short', day: 'numeric' })`, adding `year: 'numeric'` when the year differs from `now`, which is passed in so tests are deterministic. This matches `formatRelativeDay` in `pods/ginger/dose-history.ts`.
- The " · " separator joins the parts through i18next strings (`pods.attachments.detail`, `pods.attachments.actionsSheet.description`), so word order can change per language.

### Icons (react-bootstrap-icons, already a dependency)
| Use | Icon |
|---|---|
| video / image / spreadsheet / document tile | `FileEarmarkPlay` / `FileEarmarkImage` / `FileEarmarkSpreadsheet` / `FileEarmarkText` |
| kebab | `ThreeDotsVertical` (as in `PodTopBar`) |
| Media file / Document | `FileEarmarkImage` / `FileEarmark` |
| Save to device / Rename / Delete file | `Floppy` / `Pencil` / `Trash3` |
| Add attachment | `Plus` |

The icons are passed as props, so the flow chooses the floating button's icon and label. The sheets choose their own.

### Component structure and accessibility
- `AttachmentRow` is a flex row with two sibling elements: the content (a `<button>` when `onOpen` is set, otherwise a `<div>`) and a separate kebab `<button>` labelled `ui.attachmentRow.menu` ("More actions for {{name}}"). The buttons are not nested.
- `AttachmentList` renders `<ul>` inside the card, one `<li>` per child, and puts the existing `Divider` between items.
- `SheetActionList` takes `actions: { icon, label, tone?: 'default' | 'danger', onClick }[]` and renders a list of full-width buttons, with `text-gray-700` for the default tone and `text-error-700` for danger.
- `FloatingActionButton` is positioned `absolute` against the flow screen and offset by `var(--home-indicator-h)`, so it stays inside the device frame. It reuses the primary gradient classes from `Button` and adds a shadow.

### Testing without a DOM
- Pure helpers get table-driven Vitest tests, covering the spec scenarios for kinds, sizes and dates.
- The sheets and `AttachmentItem` are rendered with `renderToStaticMarkup` inside `I18nextProvider` and `FlowRuntimeContext.Provider`, with `BottomSheet`, `SheetActionList` and `AttachmentRow` replaced by capturing stubs. The tests then check:
  - the title and description,
  - the action labels, order and tones,
  - that calling each captured handler reaches the right callback,
  - that no folder action is present.
- These tests also import the fixture and every new module, so Knip sees them as used.

## Risks / Trade-offs

- [Components used only by tests could drift from the Figma design until a flow shows them] → The spec scenarios fix the visible contract, and the first attachments flow will be checked against the design.
- [Knip may still flag exports that tests don't import, such as the kind-to-icon map] → Export only what tests or the components use, and keep internal maps unexported.
- [`addedByName` omitted means "you", which could hide a forgotten lookup] → The prop is documented on the component, and the sheet test covers both cases.
- [The floating button can cover the last row on short screens] → Out of scope for the components. The screen that uses it adds bottom padding to its list.
