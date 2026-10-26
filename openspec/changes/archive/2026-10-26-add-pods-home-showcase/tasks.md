## 1. Pods section component

- [x] 1.1 Add the pod summary type (category and subcategory as label with optional icon) and the sample pods (About Sofia, Maya) for the showcase, and verify with a unit test that the samples match the showcase spec (names, breadcrumbs, avatar and unread flags)
- [x] 1.2 Build the pod card in `apps/app-ux-flows/src/shared/ui/` (avatar or initial, name, breadcrumb with icon, chevron, unread dot, accessible name) and verify with a component test for each of the three listed scenarios (full card, no avatar image, press calls the handler)
- [x] 1.3 Build the pulsing skeleton list (busy "Loading pods" region, placeholders hidden from assistive technology, still under reduced motion) and verify with a test for the label and the number of placeholders
- [x] 1.4 Build the first-run empty card (cookie icon, title, explanation, "Add Pod" only when a handler is given, "Maybe later") and verify with tests for both with and without the "Add Pod" handler
- [x] 1.5 Build the `PodsSection` for `loading`, `ready` and `error` with the header, limit and handlers, register it in `pod-components.ts`, and verify with a test per state: header with and without "See all pods", limit, loading, error with retry, empty without header
- [x] 1.6 Add all new strings to `apps/app-ux-flows/src/app/locales/en.ts` and verify no user-facing string in the new files is hardcoded

## 2. SC-POD-001 showcase

- [x] 2.1 Rework the `sc-pod-001` flow to one `home` screen and four cases (`SC-POD-001-A` to `-D`: With pods, Loading, First run, no pods, Failed to load) that set the starting pod list state in the run's store, with Retry showing loading, and verify with a flow test that each case renders its state, Retry changes it, a restart restores it, and no other control navigates
- [x] 2.2 Register the flow after the existing showcases in `registry.ts`, add its title and description strings, and verify `registry.test.ts` and the catalogue test list `SC-POD-001` with its four cases and the screen `home`
- [ ] 2.3 Confirm in the browser (`pnpm --filter app-ux-flows dev`) that the home page offers the four cases and each `?case=` URL under `/flows/sc-pod-001/home` shows its state next to app-tellipod's storybook stories, and that the loading state stays in place

## 3. Experiments adopt the shared section

- [x] 3.1 Replace the hand-rolled pods block in `GingerHomeView` with `PodsSection`, mapping Ginger's pod to the pod summary and passing no "See all pods" handler, and verify with the existing EXP-PET-003/004/005 tests, adjusted for the "Recent Pods" label and the pod card
- [ ] 3.2 Verify in the browser that EXP-PET-005 variant C still shows the Today section above "Recent Pods" and that opening Ginger still records `pod_opened`

## 4. Quality checks

- [x] 4.1 Run `pnpm lint`, `pnpm check-types` and the `app-ux-flows` tests, and verify all pass with no new warnings
- [x] 4.2 Run `openspec validate add-pods-home-showcase --strict` and verify it reports the change valid
