## 1. Kept from the first version (already done)

- [x] 1.1 Change `breadcrumb` in `apps/app-ux-flows/src/slices/flow/pods/ginger/model.ts` to `['Pets']`. Verified in the browser that `exp-pet-002`, `chat-add-medication` and `exp-demo-001` show "Pets", and that `exp-pet-002`'s Medical screen still shows "Ginger".
- [x] 1.2 Change `PodTopBar` to take `avatar: { src } | { letter }`, with the Ginger top bars passing `{ src }`. Verified by `pnpm check-types` and in the browser.

## 2. Runtime: display codes on showcases

- [x] 2.1 Allow `code?: string` on `ShowcaseDefinition` in `runtime/define-flow.ts`, keeping variants, variant selection and default variant forbidden. Update `define-flow.test.ts` so that a showcase with a code type-checks, and a showcase with variants still fails. Verify with `pnpm --filter app-ux-flows test` and `pnpm check-types`.

## 3. Catalog

- [x] 3.1 Add `ctpl:UserDefinedTemplatePod` to `templates.ts`, and let the template lookup return it for a cell without a category. Verify with a unit test that it has `ContactInfoShape` and no forms.
- [x] 3.2 Let `createPodFromTemplate` omit `category`, which creates a cell with no category, no breadcrumb and no forms. Add `applyTemplate(pod, category)`. Verify with unit tests covering:
  - a generic cell;
  - applying Pets sets the category, the breadcrumb `['Pets']` and the Pet profile form;
  - name, avatar and members unchanged;
  - applying twice is a no-op.
- [x] 3.3 Add `suggestions.ts` with the Pets `TemplateSuggestion`, and form display names (Pet profile shape → "Pet information"). Verify with a unit test that the suggestion title interpolates the cell name.
- [x] 3.4 Remove `shape-form.tsx`, `shape-values.ts`, `form-shape.ts`, `shapes/pet-shape.ts`, `vocab/*` and their tests. Revert the `SelectField` `disabled` prop and the `TextField` `placeholder`/`inputMode` props. Verify that `pnpm --filter app-ux-flows knip` reports nothing unused.

## 4. Scenario `sc-pet-001`

- [x] 4.1 Add `flows/sc-pet-001/model.ts`:
  - screen IDs, components type, and initial state `{ suggestedTemplate? }`;
  - the atoms `cellNameAtom`, `cellAtom`, `suggestionDismissedAtom` and `suggestedTemplateAtom`;
  - the derived `scenarioStateAtom` (`cellName`, `cellCreated`, `petTemplateApplied`);
  - the write atoms `createCellAtom`, `ensureCellAtom`, `applySuggestedTemplateAtom` and `dismissSuggestionAtom`.

  Verify with unit tests covering:
  - the fresh-run state is `{ '', false, false }`;
  - a blank name creates nothing;
  - creating twice yields one cell;
  - a run with "Luna" shows "Luna" in the state and in the suggestion title;
  - applying sets `petTemplateApplied`;
  - `ensureCellAtom` creates "Ginger" only when no cell exists.
- [x] 4.2 Rework the Home view into `home`: "Welcome, Alice", and the "Create your first cell" card with "+ Create cell" leading to `create-cell`. Verify in the browser that the "Open Create cell" scenario works.
- [x] 4.3 Add the `create-cell` screen: Home behind a bottom sheet with "Cell name" and "Create cell"; no category or template controls; the "Cell created" caption after creation; dismissing as a back navigation. Verify in the browser that the "Empty sheet", "Filled sheet", "Create Ginger" and "Dismiss without creating" scenarios work.
- [x] 4.4 Add the generic `CellView` and the `cell-empty` screen: top bar, inert tabs, empty Forms card, and Attachments 0, Subcells 0 and Members 1. The view must have no conditions on the cell's name or on Pets. Verify in the browser that the "Ginger is still generic" scenario works.
- [x] 4.5 Add `TemplateSuggestionCard`, the `cell-template-suggested` screen, and the 1.5 s timer on `cell-empty`, with "Not now" and "Use template". Verify in the browser that the "Suggestion appears", "Not now" and "Use template" scenarios work.
- [x] 4.6 Add the `cell-template-applied` screen, which applies the template and completes the run silently once, including when opened by direct link. Verify in the browser that the "Pet structure", "Direct link to the result" and "Completion keeps Ginger visible" scenarios work.
- [x] 4.7 Add `flow.ts`:
  - `kind: 'showcase'` and `code: 'SC-PET-001'`;
  - screens;
  - Figma `designFrames` (node IDs `13-1146`, `380-11782`, `380-14769`);
  - initial state defaulting `suggestedTemplate` to Pets.

  Register it in place of `addPetPodFlow`. Verify that the home page lists "Create Ginger" after the existing flows, and that the dev catalogue shows `SC-PET-001`.
- [x] 4.8 Remove `flows/add-pet-pod/` and its strings. Add the `flows.scPet001` strings to `app/locales/en.ts`, covering every UI string the spec quotes. Verify that the strings shown match the spec's copy.

## 5. Tests and checks

- [x] 5.1 Add `sc-pet-001.test.ts` (registered showcase with code and no variants, listed last, default suggestion is Pets, direct-link defaults). Update the flow-list assertion in `chat-add-medication.test.ts`. Verify that `pnpm --filter app-ux-flows test` passes.
- [x] 5.2 Run `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows knip`, and verify that all report no errors.
- [x] 5.3 Run the full tester path in the browser: Home → Create cell → "Ginger" → Create → Ginger → Use template → Pet structure. Also run the direct-link scenarios. Verify that there are no page errors.
- [x] 5.4 Run `openspec validate add-pet-pod-showcase --strict` and verify that it passes.

## 6. Align SC-PET-001 with the Figma Home section

- [x] 6.1 Rename the scenario to Pod terms: screen IDs `new-pod`, `pod-empty`, `pod-template-suggested` and `pod-template-applied`; state `podName` and `podCreated`; components and atoms. Verify with `pnpm check-types` and the updated `sc-pet-001.test.ts`.
- [x] 6.2 Change the copy to the Figma wording: "Create your first Pod", "+ Add Pod", "Maybe later", "New Pod", "Pod name", "Create Pod", "Pod created" and "Subpods". Verify in the browser against the spec's copy.
- [x] 6.3 Add "Your role in this Pod" and the optional "Category" select ("Choose category", listing the catalog categories whose template adds structure) to the New Pod sheet. Choosing Pets creates the pod with the template applied and goes to `pod-template-applied`. Verify with unit tests (a chosen category applies the template; no category leaves the pod generic) and in the browser with the "Create Ginger as a pet up front" scenario.
- [x] 6.4 Point the `new-pod` design frame at Figma's Home-section New Pod modal (`868-14331`). Verify in the dev catalogue.
- [x] 6.5 Rerun `pnpm check-types`, `pnpm lint`, `knip`, the tests, the browser scenario and `openspec validate add-pet-pod-showcase --strict`, and verify that all pass.

## 7. Taxonomy breadcrumb in the pod header

- [x] 7.1 Show the pod's taxonomy breadcrumb as in the Figma pod header: the category icon plus the category's path in the tree (`categoryPath` in the catalog, icons in `pods/category-icons.ts` keyed by top-level category). Verified by unit tests (Pets → "Pets"; Veterinarians → "Pets > Medical > Veterinarians"; sub-categories share the top-level icon) and in the browser.

## 8. Dimmed backdrop behind bottom sheets

- [x] 8.1 Give the shared `BottomSheet` backdrop a dark, semi-transparent fill that fades with the sheet. Verify in the browser that the New Pod sheet and `exp-pet-002`'s Add form sheet dim the content behind them, and that tapping the backdrop still dismisses.

## 9. Sheet animation and back navigation

- [x] 9.1 Make the shared `BottomSheet` slide up on open, also when its screen is opened directly, and slide down on dismiss before the flow's dismiss action runs. Verify in the browser by sampling the sheet's position while it opens and closes, for both the New Pod and the Add form sheets.
- [x] 9.2 Make the back control on SC-PET-001's pod screens show `home`. Verify in the browser from `pod-empty` and `pod-template-applied`.
