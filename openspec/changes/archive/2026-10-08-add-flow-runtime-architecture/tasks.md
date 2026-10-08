## 1. Runtime core

- [x] 1.1 Create `src/slices/flow/runtime/define-flow.ts` with `ScreenComponent`, `ComponentEnvironment`, `FlowStore`, `FlowDefinition<S, C, I>` (method-syntax `createStore`, `initialScreen: NoInfer<S>`) and the identity `defineFlow`, per design D1. Verify with `pnpm --filter app-ux-flows check-types`.
- [x] 1.2 Create `src/slices/flow/runtime/flow-context.ts` with the single `FlowRuntimeContext` and the generic hooks `useFlowNavigation<S extends string = never>()` and `useFlowComponents<C>()`. Both throw a clear error when used outside a runner (D7). Verify by type check.
- [x] 1.3 Create `src/slices/flow/runtime/completion-view.tsx`, a router-agnostic view that takes `titleKey`, `onRestart` and `onExit` props and uses the existing `flow.completion.*` keys. Replace its `<a href="/">` with a button that calls `onExit`. Verify by type check and lint.
- [x] 1.4 Create `src/slices/flow/runtime/flow-runner.tsx` per D4/D8/D9. It holds the run (`{ id, store, status }`) in `useState` from `flow.createStore(initialState)`, merges components as `{ ...flow.components, ...componentOverrides }`, and builds memoized navigation (`goToScreen` → `navigateToScreen`, `back` → `goBack`, `restart` → new store + `id + 1` + navigate to `initialScreen`, `complete` → status `completed` + `onComplete` once). It renders `<Provider store>` + context + `CompletionView` or `flow.screens[screenId]` keyed by run id. Verify that `grep -r "@tanstack/react-router" apps/app-ux-flows/src/slices` returns nothing.

## 2. Default building blocks

- [x] 2.1 Create flow-agnostic `react-dom` components in `src/shared/ui/`: `header.tsx` (title + optional back action), `button.tsx`, `text-field.tsx` (label, value, onChange), `checkbox.tsx` (label, checked, onChange). Each takes plain props only, with no atoms and no navigation imports. Verify by type check and lint.
- [x] 2.2 Create `src/shared/ui/default-components.ts` exporting `defaultComponents` and `DefaultComponents` (layer 1 of D6). Verify by type check.

## 3. Example flow: add-medication

- [x] 3.1 Create `flows/add-medication/model.ts` with the `AddMedicationScreenId` union (`'home' | 'medication-form' | 'confirmation'`), the `Pet`/`Medication` types, the `gingerFixture` pet, `AddMedicationInitialState`, `AddMedicationComponents` (`DefaultComponents & { PetCard; QuickAction }` typed by props), and atoms `petAtom`, `medicationsAtom` and `medicationDraftAtom` (name, dosage, withFood). Verify by type check.
- [x] 3.2 Create the `components/pet-card.tsx` and `components/quick-action.tsx` building blocks with plain props. Verify by type check.
- [x] 3.3 Implement `screens/home-screen.tsx`: a pet overview with the medication list from `medicationsAtom` and a `QuickAction` that goes to `medication-form`. Implement `screens/medication-form-screen.tsx`: `TextField`s and a `Checkbox` bound to `medicationDraftAtom`, a Save button that appends to `medicationsAtom`, resets the draft and goes to `confirmation`, and a `Header` back button calling `back()`. Implement `screens/confirmation-screen.tsx`: it shows the pet and the last added medication, shows an empty state linking to `medication-form` when there are none, and has "Back to pet" (`goToScreen('home')`), "Start over" (`restart()`) and "Finish" (`complete()`) actions. All screens use `useFlowComponents<AddMedicationComponents>()`, `useFlowNavigation<AddMedicationScreenId>()` and `t()`. Verify by type check and lint.
- [x] 3.4 Create `flows/add-medication/flow.ts` with `defineFlow<AddMedicationScreenId, AddMedicationComponents, AddMedicationInitialState>`, with `components: { ...defaultComponents, PetCard, QuickAction }` and a `createStore` that sets every atom from `initialState ?? fixture` (D3). Verify by type check.
- [x] 3.5 Add the `flows.addMedication.*` strings (and any `ui.*` strings the shared components need) to `src/app/locales/en.ts`, and remove the `flows.example.*` strings. Verify that no screen or component contains a hard-coded user-facing string, using lint plus a manual review of the new files.

## 4. Registry and routes

- [x] 4.1 Rewrite `slices/flow/registry.ts` over `AnyFlow` with `listFlows`, `findFlow` and `hasScreen` (checks `screenId` against `flow.screens` via `Object.hasOwn`), registering `addMedicationFlow`. Update `registry.test.ts` to use the new flow and cover `hasScreen` (known id, unknown id, `'constructor'`). Verify with `pnpm --filter app-ux-flows test`.
- [x] 4.2 Move `routes/flow.tsx` to path `flows/$flowId`: `beforeLoad` throws `notFound()` for an unknown flow and otherwise `redirect` with `replace: true` to `/flows/$flowId/$screenId` with `flow.initialScreen`. Verify by type check.
- [x] 4.3 Move `routes/flow.$screenId.tsx` to path `flows/$flowId/$screenId`: `beforeLoad` throws `notFound()` for an unknown flow and a replace-redirect to the initial screen for an unknown screen. The loader returns `{ flow }`. The component renders `<FlowRunner key={flow.id}>` with `navigateToScreen` (`useNavigate`), `goBack` (`router.history.canGoBack()` ? `history.back()` : replace-navigate to the initial screen) and `exit` (navigate to `/`) (D5). Verify by type check.
- [x] 4.4 Update `routes/home.tsx` to navigate to `/flows/$flowId`, and update `router.ts` if route exports were renamed. Verify by type check.

## 5. Remove the declarative model

- [x] 5.1 Delete `slices/flow/model.ts`, `runtime.ts`, `runtime.test.ts`, `component-registry.ts`, `flow-page.tsx`, `components/` and `flows/example-flow.ts`. Verify that `pnpm --filter app-ux-flows knip` reports no unused files, exports or dependencies, and that `grep -rn "sessionStorage\|getDefaultStore\|currentScreenId" apps/app-ux-flows/src` returns nothing.

## 6. Tests

- [x] 6.1 Add `flows/add-medication/add-medication.test.ts` covering four cases. (a) `createStore()` yields fixture values. (b) `createStore({ pet })` overrides only `pet`. (c) Two stores from the same flow are isolated: a write to one is not visible in the other. (d) A fresh `createStore(initialState)` after writes returns the initial values again, which is the restart semantics. Verify with `pnpm --filter app-ux-flows test`.
- [x] 6.2 Add a type-level test in the same file (checked by `tsc`, not run). Use `@ts-expect-error` on `goToScreen('does-not-exist')` from `useFlowNavigation<AddMedicationScreenId>()`, on `goToScreen('home')` from `useFlowNavigation()` without a type argument, on a `defineFlow` whose `initialScreen` is not declared, and on a `defineFlow` missing a screen. Use these only as type expressions inside an uncalled function so no hook runs at test time. Verify that `pnpm --filter app-ux-flows check-types` passes, and that removing any one `@ts-expect-error` makes it fail.

## 7. Integration verification

- [x] 7.1 Run `pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test` and `pnpm --filter app-ux-flows knip` from the repo root. All must pass.
- [x] 7.2 In the browser (`pnpm --filter app-ux-flows dev`), check the following. Home → Start goes to `/flows/add-medication/home`. Add a medication on the form, and confirmation shows the pet and the medication. "Back to pet" lists it. Browser back/forward moves between screens with data intact. Header back from a directly opened `/flows/add-medication/medication-form` goes to `home`. A direct `/flows/add-medication/confirmation` shows the empty state. `/flows/add-medication/nope` replace-redirects to `home`. `/flows/nope/home` shows not-found. "Start over" resets data to the fixture. "Finish" shows the completion view, and back/forward keeps showing it. Restart from completion resumes at `home` with fixture data. Reload mid-flow resets data. Then temporarily pass `componentOverrides={{ QuickAction: <alt> }}` from the route, confirm the home screen renders the alternative with no screen edits, and revert.
