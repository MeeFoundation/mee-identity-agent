## 1. Flow metadata in the runtime

- [x] 1.1 In `src/slices/flow/runtime/define-flow.ts`, add `DesignFrame` and the optional `code`, `descriptionKey`, `designFrames` fields to `FlowDefinition`, and `code`, `designFrames` to `VariantDefinition` (design D2). `designFrames` must be typed `Partial<Record<S, DesignFrame>>` so an undeclared screen id fails type checking. Verify with `pnpm --filter app-ux-flows check-types`.
- [x] 1.2 In `resolve-flow.ts`, expose `code`, `variantCode`, `descriptionKey` and the shallow-merged `designFrames` on `ResolvedFlow` (D2). Verify with new cases in `resolve-flow.test.ts`:
  - a variant frame overrides the base frame for one screen and keeps the others,
  - a flow without metadata resolves to `null` / `{}`.
- [x] 1.3 Add a pure `listFlowCatalogue(flow)` beside `registry.ts` (D3). It returns the flow code and, per variant (or the base flow), the id, code, name/description keys, and the available screens with their frame and `{ flowId, screenId, variantId }` link target. Verify with `catalogue.test.ts` on a fixture flow: variant-only screens appear only in their variant, and frames follow variant overrides.

## 2. Home page description and dev catalogue

- [x] 2.1 In `routes/home.tsx`, pass `descriptionKey` for every flow, and pass `catalogue` only when `import.meta.env.DEV` (otherwise `null`). Verify with type check.
- [x] 2.2 In `slices/home/home-page.tsx`:
  - render the description under the title,
  - in DEV, render a collapsible catalogue in each card: flow code, assigned variant, and per variant its code, name, description and screens,
  - each screen shows its id, a Figma frame name link (`target="_blank"`, `rel="noreferrer"`) and a TanStack `Link` to `/flows/$flowId/$screenId` with `search: { variant }`,
  - add the `home.*` catalogue strings to `en.ts`.

  Verify manually in `pnpm --filter app-ux-flows dev`: the catalogue is shown and its deep links open the right screen and variant. Verify that `pnpm --filter app-ux-flows build && pnpm --filter app-ux-flows preview` shows no catalogue.

## 3. Overlay host in the device frame

- [x] 3.1 Add `shared/lib/overlay-container.tsx` (context + `useOverlayContainer`). Render an `absolute inset-0 pointer-events-none` host over the scroll area inside `DeviceFrame`'s clipped screen, and provide it through the context (D6). Verify with type check, and that existing flow screens render and scroll unchanged in the browser.

## 4. Shared pod components (design-system delta)

- [x] 4.1 Before building, call Figma `get_design_context` on frames `1213:28668` (modal), `1213:28891` (medication added), `1203:25879` (B info) and `1213:29157` (notes) in file `cd6NZmMxZHC7qTOk0SXYVW`. Record each component's exact sizes, colours and radii and map them to existing theme tokens. If a design-system component's internals (Tabs, Modal, Text-field, AI Suggestion, cell-info) don't come through, ask the user for the Mee Design System component links. Verify that every component in 4.3–4.8 has its token mapping recorded in design.md §7b, and that the exported assets are downloaded locally with no temporary Figma URLs in code.
- [x] 4.2 Add hand-written Base UI primitives in `shared/ui/primitives/` in the existing style: `tabs.tsx`, `dialog.tsx`, `select.tsx`, `collapsible.tsx`. Verify with type check and `pnpm lint`.
- [x] 4.3 Add `pod-screen.tsx` (gradient background, top-bar slot, scrolling content), `pod-top-bar.tsx` (back, avatar, title, breadcrumb with icon and chevrons, menu, optional tabs slot, translated `ui.podTopBar.*` labels) and `segmented-tabs.tsx` (Base UI Tabs; flow-controlled value; `onSelect`). Verify in the browser: arrow keys move between tabs, the tab role and selected state are exposed, and the back and menu labels are announced (accessibility tree in devtools).
- [x] 4.4 Add `section-label.tsx`, `empty-state-card.tsx`, `category-row.tsx` (icon, label, count badge, chevron; one button whose accessible name includes the count) and `divider.tsx`. Verify in the browser against frame `1203:25805`.
- [x] 4.5 Add `bottom-sheet.tsx`: a Base UI Dialog that is modal and always open, portaled into the overlay host, with a backdrop, a slide-up animation, grabber, title, description, content and `onDismiss`. Verify on desktop and at 390px width:
  - Escape and a backdrop click call `onDismiss`,
  - focus is trapped,
  - content behind it is inert,
  - the backdrop does not cover the page outside the frame.
- [x] 4.6 Add `select-field.tsx`: label + Base UI Select, popup portaled into the overlay host, with unavailable options. Verify that the label focuses the control, keyboard selection works, unavailable options cannot be chosen, and the popup is positioned correctly inside the scaled frame.
- [x] 4.7 Add `form-card.tsx` with `FormCard` (icon, title, Collapsible with `aria-expanded`, footer slot) and `FieldRow` (label, value, edit button labelled `ui.formCard.edit` with the field label). Verify that collapse and expand work by pointer and keyboard and that the edit labels include the field name.
- [x] 4.8 Add `ai-suggestion.tsx` (sparkle icon, caption, label, single button). Verify against frame `1203:25879` in the browser.

## 5. EXP-PET-002 flow

- [x] 5.1 Create `slices/flow/flows/exp-pet-002/model.ts` with:
  - the `Pod`, `OntologyTerm`, `MeasurementUnit` and `MedicationRecord` types and the Ginger pod and medication fixtures, using the IRIs in design D8,
  - the initial-state type and the atoms of D5,
  - the idempotent `addMedicationFormAtom`.

  Download the Ginger avatar from Figma into `exp-pet-002/assets/`. Verify with type check.
- [x] 5.2 Add `medication-fields.ts` with `toMedicationFieldRows` (D8) and the `flows.expPet002.medication.*` strings, including the frequency plural. Verify with `medication-fields.test.ts`:
  - the default record gives the seven rows in order, with "62.5 mg", "2 times per day" and "Oct 6, 2026",
  - "1" gives "Once per day",
  - "as needed" passes through,
  - no unit shows the value only,
  - missing optional fields are left out,
  - a date-only string does not shift a day in a negative-offset time zone (`TZ=America/Sao_Paulo`).
- [x] 5.3 Implement the flow-specific `NotesArea`, `PodInfoView` (Forms section: empty state or form card, B's AI suggestion gated by flag and added-state, divider, category rows) and `MedicalView`, using components from `useFlowComponents()`. Verify with type check.
- [x] 5.4 Implement the screens `ginger-notes`, `ginger-info`, `medical`, `add-form` and `medication-added` per D5 and the experiment spec, and add all `flows.expPet002.*` strings to `en.ts`. Verify each spec scenario manually in the browser for both variants (`?variant=a`, `?variant=b`).
- [x] 5.5 Create `exp-pet-002/flow.ts` with `defineFlow`:
  - id `exp-pet-002`, code `EXP-PET-002`, title and description keys,
  - initial screen `ginger-notes`, `variantSelection: 'automatic'`,
  - components: defaults + pod kit,
  - base `designFrames` = A's five frames (node ids `1213:29157`, `1203:25805`, `1203:25845`, `1213:28668`, `1213:28891`),
  - variant `a` (code `EXP-PET-002-A`),
  - variant `b` (code `EXP-PET-002-B`, `initialState: { showAiSuggestion: true }`, frames `1203:25879` and `1213:29848`).

  Register it in `registry.ts`. Verify that `registry.test.ts` passes for both variants.
- [x] 5.6 Add `exp-pet-002.test.ts` covering the store and state rules with a Jotai store from `createStore`:
  - default and supplied medication record,
  - variant B flag via `resolveFlow(flow, 'b')`,
  - `addMedicationFormAtom` is idempotent,
  - a variant A store has no suggestion flag.

  Verify that `pnpm --filter app-ux-flows test` passes.

## 6. Remove the placeholder flow

- [x] 6.1 Delete `slices/flow/flows/add-medication/**` and its `flows.addMedication.*` strings in `en.ts`, and point `registry.test.ts` at `exp-pet-002`. Verify that `pnpm --filter app-ux-flows knip` reports no unused files or exports, and that `/flows/add-medication` shows the not-found page.

## 7. Final checks

- [x] 7.1 Run `pnpm check-types`, `pnpm lint`, `pnpm --filter app-ux-flows test` and `pnpm --filter app-ux-flows knip` from the repo root. All must pass.
- [x] 7.2 Walk through every scenario in `specs/app-ux-flows/experiments/exp-pet-002/spec.md`:
  - in both variants,
  - on a 1280×900 desktop window and at 390px width,
  - comparing each screen side by side with its Figma frame.

  Verify that the `openspec validate add-exp-pet-002-medication-entry-point --strict` check still passes, and record any visual deviations in the PR description.
