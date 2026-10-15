## 1. Home top bar component

- [x] 1.1 Load the `figma-design-to-code` skill and run `get_design_context` on node 905:15156 (file `cd6NZmMxZHC7qTOk0SXYVW`) to get exact spacing, type sizes, colours and the search field's border and radius. Map them to existing theme tokens. Verify by noting the mapped values in the component, as class names only.
- [x] 1.2 Add `src/shared/ui/home-top-bar.tsx`: `HomeTopBar({ greeting, initial, onSearchSelect? })` with the layout in design §3, a sharing line with the design's shield-lock SVG, and a `<button type="button">` search field with the design's search SVG, named by `ui.homeTopBar.search`. The avatar is `aria-hidden`, and the greeting is the `h1`. Register it in `shared/ui/pod-components.ts`, and add `ui.homeTopBar.sharing` and `ui.homeTopBar.search` to `app/locales/en.ts`. Verify that `pnpm check-types` and `pnpm lint` pass.

## 2. Use it on both Home screens

- [x] 2.1 Replace the inline header in `flows/sc-pet-001/components/home-view.tsx` with `HomeTopBar`, using the flow's greeting and initial and no search action. Verify that the existing SC-PET-001 tests pass, and add a test that the Home screen renders "Device-to-device sharing, pod members only." and a "Search, or ask Telli…" button, and that activating it causes no navigation.
- [x] 2.2 Replace the inline header in `pods/ginger/components/ginger-home-view.tsx` with `HomeTopBar`, and add an optional `onSearchSelect` prop passed to it. Verify that `pnpm check-types` passes.

## 3. Record search in the experiments

- [x] 3.1 Add `search_selected: undefined` to `ExpPet003Events`, `ExpPet004Events` and `ExpPet005Events`, and pass `onSearchSelect={() => track('search_selected')}` from each flow's Home screen. Verify with a test in each of `exp-pet-003.test.ts`, `exp-pet-004.test.ts` and `exp-pet-005.test.ts`. In every variant, a stubbed `HomeTopBar` captures `onSearchSelect`; calling it records exactly `search_selected` and causes no navigation.

## 4. Verification

- [x] 4.1 Browser check on the dev server: open SC-PET-001 `home` and EXP-PET-003, EXP-PET-004 and EXP-PET-005 `home`, screenshot the header, and compare it with the Figma screenshot of 905:15156. Check:
  - the avatar sits beside the greeting;
  - the sharing line and icon are under the greeting;
  - the search field is full width;
  - the tab bar and the rest of Home are unchanged;
  - clicking the search field leaves `home` shown.

  Verify by reviewing the screenshots side by side.
- [x] 4.2 Run `pnpm check-types`, `pnpm lint`, `pnpm --filter app-ux-flows knip` and `pnpm --filter app-ux-flows test`. Verify that all pass.
