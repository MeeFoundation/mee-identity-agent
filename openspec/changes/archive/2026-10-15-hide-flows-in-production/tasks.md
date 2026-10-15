## 1. Hidden flag and filtering

- [x] 1.1 Add an optional `hidden?: true` field ("Shown only in development builds.") to `FlowBase`, `VariantDefinition` and `CaseDefinition` in `runtime/define-flow.ts`. Verify that `pnpm check-types` passes, and that `hidden: false` is a type error.
- [x] 1.2 Add a pure `withoutHidden(flow)` in `src/slices/flow/hidden.ts`. It returns `undefined` for a hidden flow, or for one whose variants or cases are all hidden. Otherwise it returns the same object when nothing is hidden, or a shallow copy without hidden variants or cases, dropping a `defaultVariant` that names a hidden variant. Verify with `hidden.test.ts`, covering each of those cases, including that the same object comes back when nothing is hidden.
- [x] 1.3 Add `createRegistry(flows, showHidden)` to `registry.ts`. It filters once with `withoutHidden` when `showHidden` is false. Build the module-level `listFlows` and `findFlow` from `createRegistry(allFlows, import.meta.env.DEV)`. Verify with new `registry.test.ts` cases on fixture flows: with `showHidden: false`, hidden flows are missing from `listFlows` and `findFlow` returns `undefined`; a flow with a hidden case lists only the visible cases; `findFlow` returns the same object on repeated calls. The existing registry tests still pass.
- [x] 1.4 Add tests on a filtered fixture flow for selection and resolution. `selectVariant` never assigns a stripped variant, replaces a stored assignment to it, and falls back to the first visible variant when the default was hidden. `isVariantOf` and `isCaseOf` reject stripped ids. `resolveFlow` uses the first visible case and lists only visible cases. Verify that these tests pass with `pnpm --filter app-ux-flows test`.

## 2. Dev-only "Hidden in production" label

- [x] 2.1 Carry `hidden: boolean` on `VariantChoice` (`listVariantChoices`), `CaseChoice` (`listCases`), `CatalogueEntry` (`listFlowCatalogue`) and `FlowLauncher` (the home loader in `routes/home.tsx`). Verify with the existing `select-variant`, `resolve-flow` and `catalogue` tests, extended to assert `hidden` for a fixture with hidden items.
- [x] 2.2 Add `home.hiddenInProduction: 'Hidden in production'` to `app/locales/en.ts`. Show it as a small muted badge on the hidden flow's row in `FlowRow`, on hidden variant and case start actions in `ChoiceButton`, and on hidden entries in `FlowCatalogue`. Verify that `pnpm check-types` and `pnpm lint` pass.

## 3. Docs and verification

- [x] 3.1 Add a "Hidden flows, variants and cases" bullet to "Flow conventions" in `apps/app-ux-flows/AGENTS.md`. It covers `hidden: true`, that hidden items show only on the dev server, that a flow is hidden when all its variants or cases are, and not to hide a variant during a live study. Verify that the bullet is present.
- [x] 3.2 Browser check. Temporarily mark `sc-pet-004` hidden, case `d` of `sc-pet-003` hidden, and variant `b` of `exp-demo-001` hidden.
  - On the dev server (`pnpm --filter app-ux-flows dev`), all three are offered with the "Hidden in production" label and run.
  - On `pnpm --filter app-ux-flows build` and `preview`:
    - `sc-pet-004` is not listed, the Showcases count drops by one, and `/flows/sc-pet-004/info` shows not-found;
    - `sc-pet-003` offers only cases A to C, `?case=d` is dropped and runs case A, and completing case A offers no "Try case SC-PET-003-D";
    - `exp-demo-001` offers no variant `b`, and `?variant=b` is dropped.

  Revert the temporary edits, and verify with `git diff` that no flow is left hidden.
- [x] 3.3 Run `pnpm check-types`, `pnpm lint`, `pnpm --filter app-ux-flows knip` and `pnpm --filter app-ux-flows test`. Verify that all pass.
