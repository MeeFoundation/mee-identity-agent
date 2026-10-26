## 1. Tokens, strings and icons

- [x] 1.1 Add `surfaceBrandSoft` (#F3F8F8), `textDefaultBody` (#1E293B) and the `xsSemibold`, `smRegular` and `2xlSemibold` typography entries to `apps/app-tellipod/src/shared/ui/tokens.ts`, and verify `pnpm check-types` passes
- [x] 1.2 Add `ArrowRightIcon`, `PlusIcon` and `CookieIcon` to `apps/app-tellipod/src/shared/ui/icons/` using the SVG paths from the Figma assets, register them in `index.ts` and the icons gallery story, and verify the icons test and gallery render all of them
- [x] 1.3 Add the `pod.section` strings (recent pods label, see all pods, empty title, explanation, add pod, maybe later) to `apps/app-tellipod/src/shared/i18n/en.ts` and verify there are no hard-coded user-facing strings in the new code

## 2. Pod list empty slot

- [x] 2.1 Add an optional `empty` node prop to `PodListView` and `PodList` that replaces the default empty message only in the loaded-and-empty branch, and verify with tests that pending and error still win and the default message is unchanged without the prop
- [x] 2.2 Add `PodListView` stories showing caller-supplied empty content, and verify the story renders it

## 3. Pods section component

- [x] 3.1 Create the section header row (caps label plus "See all pods" link with arrow) as a private component in `features/pods/ui`, and verify with a test that pressing the link calls its handler and the link is exposed as a button
- [x] 3.2 Create the private `EmptyPodsCard` with the cookie holder, title, explanation, gradient "Add Pod" button and "Maybe later" button, and verify with tests that both buttons call their handlers and the icons are hidden from assistive technology
- [x] 3.3 Create `PodsSectionView` (presentational: pods, status, limit and handlers in; header plus `PodListView` with the card as `empty`, header hidden when loaded and empty) and verify with tests for pods, pending, error, over-limit and empty states
- [x] 3.4 Create `PodsSection` wiring `usePodList` into `PodsSectionView`, export it from `features/pods/index.ts`, and verify with a test using the mock pods API that it shows the rows and the empty card

## 4. Stories

- [x] 4.1 Add `PodsSection.stories.tsx` with `Rows`, `OverLimit`, `Loading`, `LoadFailed` and `Empty` stories against `PodsSectionView` with handlers logged as actions, regenerate the index with `pnpm --filter app-tellipod storybook:generate`, and verify all five stories appear in the app-tellipod Storybook

## 5. Home wiring

- [x] 5.1 Make `onSeeAll` and `onAddPod` optional on `PodsSectionHeader`, `EmptyPodsCard`, `PodsSectionView` and `PodsSection` so the link and the Add Pod button render only with a handler, and verify with tests for both absent and present handlers
- [x] 5.2 Add the `hideEmpty` flag to `PodsSectionView` and `PodsSection` so the section renders nothing when set and the list loaded empty, and verify with tests that pods, pending and error are unaffected
- [x] 5.3 Add a session-only Jotai atom for the dismissed first-run card and a `HomePods` widget with a padded `ScrollView` containing `PodsSection` (`last_activity` sort, limit 2, pod press pushing `/pods/[id]`, Maybe later setting the atom, `hideEmpty` bound to it), render it from `app/(tabs)/index.tsx` in place of the placeholder, and verify with a widget test that pods show, pressing a pod navigates with its id, and Maybe later hides the card
- [x] 5.4 Confirm the Home screen shows the section in the running app, and update the `Rows` and `Empty` stories if the optional handlers change how they should look

## 6. Verification

- [x] 6.1 Compare the `Rows` and `Empty` stories with Figma nodes 13:11241 and 13:1146 (spacing, type, colors, button fill) and fix any mismatch in the new component
- [x] 6.2 Run `pnpm lint` and `pnpm check-types` from the repo root and the app-tellipod tests, and verify all pass with no new warnings
