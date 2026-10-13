## 1. Flow model and copy

- [x] 1.1 Create `apps/app-ux-flows/src/slices/flow/flows/exp-demo-001/model.ts` with `ExpDemo001ScreenId` (`'ginger-info' | 'medication-added'`), `ExpDemo001Components` (= `GingerPodComponents`), `ExpDemo001InitialState` (`pod?`, `medication?`) and `ExpDemo001Events` (`medication_form_added: { method: 'empty_state' }`). Verify with `pnpm --filter app-ux-flows check-types`
- [x] 1.2 Add `flows.expDemo001.*` keys to `apps/app-ux-flows/src/app/locales/en.ts`: title "A/B demo: empty state call to action", a description that says it is a demo, the variant names "A · Control" / "B · Prominent call to action" with descriptions, and the "Add medication" action label. Verify the keys type-check and that no hard-coded user-facing strings are used in the new files

## 2. Variant B component

- [x] 2.1 Create `flows/exp-demo-001/components/prominent-empty-state-card.tsx`. It takes `ComponentProps<typeof EmptyStateCard>` and renders a highlighted card (existing `brand-50`/`brand-200` tokens), a decorative icon, an emphasised title, the message and, only when `action` is given, a filled, full-width primary `Button` (size `l`) with a `Plus` icon. Verify that it type-checks as a replacement for `EmptyStateCard`

## 3. Screens

- [x] 3.1 Create `flows/exp-demo-001/components/demo-info-view.tsx`. It renders `GingerTopBar` (Info tab, inert `onTabSelect`) inside `PodScreen`, `GingerFormsSection` with `emptyAction` (label from i18n; on action it tracks `medication_form_added { method: 'empty_state' }`, calls `addMedicationFormAtom` and goes to `medication-added`), `Divider` and `GingerCategoryRows`. It accepts a `medicationFormAdded` override prop like `ShowcaseInfoView`. Verify it with type-checking
- [x] 3.2 Create `screens/ginger-info-screen.tsx` (renders `DemoInfoView`) and `screens/medication-added-screen.tsx` (in a `useLayoutEffect`, adds the form and calls `complete({ showCompletionView: false })`, then renders `DemoInfoView medicationFormAdded`). Verify with type-checking

## 4. Flow definition and registration

- [x] 4.1 Create `flows/exp-demo-001/flow.ts` with `defineFlow`: `id: 'exp-demo-001'`, `code: 'EXP-DEMO-001'`, `kind: 'experiment'`, `components: { ...defaultComponents, ...podComponents }`, `createStore` seeding the Ginger atoms, `initialScreen: 'ginger-info'`, `variantSelection: 'explicit'`, `defaultVariant: 'a'`, variant `a` (code only) and variant `b` with `components: { EmptyStateCard: ProminentEmptyStateCard }` only. Verify with type-checking
- [x] 4.2 Register `expDemo001Flow` in `apps/app-ux-flows/src/slices/flow/registry.ts`. Verify that the existing `registry.test.ts` consistency checks (variant id pattern, screens resolve) still pass with `pnpm --filter app-ux-flows test`

## 5. Tests

- [x] 5.1 Add `flows/exp-demo-001/exp-demo-001.test.ts`. It asserts that the variants are explicit with ids `['a', 'b']` and default `a`, and that resolving `b` swaps only `EmptyStateCard` (every other component, screen and the store seed are identical to `a`). It also asserts that resolving `a` uses the shared `EmptyStateCard`, and that the store starts with the medication form not added. Verify with `pnpm --filter app-ux-flows test`

## 6. Verification

- [x] 6.1 Run `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows test` from the repo root, and confirm there are no errors
- [x] 6.2 Manual check with `pnpm --filter app-ux-flows dev`. The home page shows the EXP-DEMO-001 card with A and B buttons. Variant A shows the link-style empty state and B the prominent card, with everything else identical. "Add medication" leads to `medication-added` in both. Editing `?variant=a` ↔ `b` swaps the card. The dev console shows `medication_form_added` with `method: empty_state` and the matching variant id, followed by `flow_completed`
