## 1. Variant types and resolution

- [x] 1.1 In `src/slices/flow/runtime/define-flow.ts`, add `VariantDefinition<S, C, I>` and `VariantSelection`, the optional `variants` / `variantSelection` fields, `screens: Record<S, ScreenComponent | null>`, and the `I extends object` constraint on `FlowDefinition` and `defineFlow`, per design D1. Change `AnyFlow` in `registry.ts` to `FlowDefinition<string, ComponentEnvironment, object>`. Verify that `pnpm --filter app-ux-flows check-types` passes with the unchanged example flow.
- [x] 1.2 Create `src/slices/flow/runtime/resolve-flow.ts` with `ResolvedFlow<S, C, I>` and a memoized `resolveFlow(flow, variantId)` (D2):
  - components and screens are shallow-merged, with `null` screens dropped,
  - `createStore` merges `{ ...variant.initialState, ...runState }`,
  - it throws for an unknown variant id, a `null`/non-null mismatch with the flow's variants, or an unresolved initial screen.

  Verify with `resolve-flow.test.ts`. Use a small fixture flow with a `null` variant-only screen and cover:
  - base resolution,
  - component override keeps the other components,
  - screen override keeps the other screens,
  - variant-only screen present only in its variant,
  - initial-state precedence fixtures < variant < run-start, with lists replaced wholesale,
  - each throw case,
  - identical identity for repeated calls.
- [x] 1.3 Change `hasScreen` in `registry.ts` to take a `ResolvedFlow`, and change `FlowRunner` to take `flow: ResolvedFlow<S, C, I>` instead of `FlowDefinition`. Rendering, navigation and store lifecycle stay as they are. Verify by type check and `pnpm --filter app-ux-flows test`.

## 2. Variant selection and sticky assignment

- [x] 2.1 Create `src/slices/flow/variants/assignment-store.ts` with `createAssignmentStore(getStorage)` and `browserAssignmentStore` (D6). Use key `ux-flows:variant:<flowId>`. `clear()` removes only keys with that prefix. Wrap every storage access in try/catch, with an in-memory `Map` fallback. Verify with `assignment-store.test.ts`:
  - read/write per flow with a fake `Storage`,
  - `clear()` leaves unrelated keys,
  - the fallback works when storage is `undefined` or throws.
- [x] 2.2 Create `src/slices/flow/variants/select-variant.ts` with `isVariantOf`, `pickWeighted`, `selectVariant` and `listVariantChoices` (D3, D8). Verify with `select-variant.test.ts`, using an injected store and a deterministic `random`:
  - no variants → `null`,
  - a valid request wins and does not write storage,
  - automatic reuses a valid stored id,
  - automatic replaces a stale stored id and writes the new one,
  - automatic with no stored id assigns and writes,
  - explicit with no request → `defaultVariant`, or the first variant key when none is declared,
  - `pickWeighted` boundaries (random 0 and just below 1, two equal weights split at 0.5),
  - `listVariantChoices` returns choices only for explicit flows.

## 3. Routes and launcher

- [x] 3.1 Update `routes/flow.$screenId.tsx` per D7:
  - `validateSearch` for an optional `variant` string,
  - in `beforeLoad`: `findFlow`, then a replace-redirect with `search: {}` for an invalid variant, then `selectVariant(…, browserAssignmentStore)` + `resolveFlow`, then a replace-redirect to `resolved.initialScreen` keeping the search for an unavailable screen,
  - loader returns the resolved flow,
  - `navigateToScreen` and the `goBack` fallback retain the current search,
  - `FlowRunner` key is `` `${flowId}:${variantId ?? ''}` ``.

  Verify by type check, and confirm that `grep -r "@tanstack/react-router" apps/app-ux-flows/src/slices` is still empty.
- [x] 3.2 Update `routes/flow.tsx` to validate the same search and pass it through its redirect to the initial screen. Verify by type check.
- [x] 3.3 Update `routes/home.tsx` and `slices/home/home-page.tsx` per D8:
  - the loader provides `variantChoices` and, only when `import.meta.env.DEV`, `assignedVariantId` per flow,
  - `HomePage` renders a single "Start", or a "Choose version" button per variant,
  - a "Start new test session" button calls `browserAssignmentStore.clear()` then `router.invalidate()`,
  - starting navigates to `/flows/$flowId` with `search: { variant }`,
  - all strings use `t()`.

  Verify by type check and lint.

## 4. Example A/B flow

- [x] 4.1 In `flows/add-medication/model.ts`, add `showMedicationHint?: boolean` to `AddMedicationInitialState` and add `showMedicationHintAtom` (default `false`). In `flow.ts`, set the atom in `createStore` from `initialState?.showMedicationHint ?? false`. In `MedicationFormScreen`, render a hint paragraph when the flag is on. Extend `add-medication.test.ts`: the flag is `false` by default and `true` when supplied. Verify with `pnpm --filter app-ux-flows test`.
- [x] 4.2 Add `components/prominent-quick-action.tsx` (`QuickActionProps`, prominent card-style CTA) and `screens/alternative-home-screen.tsx` (CTA first, pet card, medication count; same atoms, environment `QuickAction` and `goToScreen('medication-form')`). Verify by type check and lint.
- [x] 4.3 Declare `variantSelection: 'automatic'` and the variants `control`, `prominent-action` (`QuickAction` override + `showMedicationHint: true`) and `alternative-home` (`home` screen override) in `flow.ts` (D10). Add `flows.addMedication.variants.*` name/description strings, the form hint, the alternative home strings and the launcher strings (`home.chooseVariant`, `home.newSession`, dev assignment label) to `app/locales/en.ts`. Verify by type check and lint.
- [x] 4.4 Add type-level contracts to `add-medication.test.ts`, inside the existing uncalled function, each with `@ts-expect-error`:
  - a variant `components.QuickAction` that requires an extra prop,
  - a variant `screens` key not in `AddMedicationScreenId`,
  - a variant `initialState` with a wrong field type.

  Verify that `pnpm --filter app-ux-flows check-types` passes, and that removing any one `@ts-expect-error` makes it fail.

## 5. Consistency checks

- [x] 5.1 Extend `registry.test.ts` per D9. For every registered flow:
  - if `variants` is present, it is non-empty and its ids match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`,
  - every variant id (or `null` when there are no variants) resolves without throwing,
  - the resolved flow `hasScreen(initialScreen)`,
  - `hasScreen` on resolved flows rejects `'does-not-exist'` and `'constructor'`.

  Verify with `pnpm --filter app-ux-flows test`.

## 6. Integration verification

- [x] 6.1 Run `pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test` and `pnpm --filter app-ux-flows knip` from the repo root. All must pass.
- [x] 6.2 In the browser (`pnpm --filter app-ux-flows dev`), check each of the following:
  - **Launcher:** the home page shows a single "Start" for add-medication, plus a dev-only assignment readout after the first start.
  - **Sticky assignment:** reload, a new tab and starting again keep the same variant. "Start new test session" then start can produce a different variant (repeat a few times to see each one).
  - **URL override:** `?variant=prominent-action` shows the prominent CTA. The form shows the hint. The param survives home → form → confirmation, header back and a direct `/flows/add-medication?variant=prominent-action`.
  - **URL does not reassign:** after opening that link, opening without the param still uses the stored assignment.
  - **Invalid variant:** `?variant=nope` is replaced by the URL without the param.
  - **Screen override:** `?variant=alternative-home` shows the alternative home, and form and confirmation are unchanged.
  - **Restart:** "Start over" and completion-view restart stay in the same variant with fixture data.
  - **Variant change:** editing the `variant` param mid-flow starts a clean run.
  - **Explicit mode:** temporarily set `variantSelection: 'explicit'`, confirm the home page offers one button per variant and a direct URL without the param uses `control`, then revert.
