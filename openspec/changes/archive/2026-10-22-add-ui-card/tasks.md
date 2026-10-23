## 1. Panel

- [x] 1.1 Create the internal `packages/ui/src/PanelParts.tsx` (surface, content wrapper that hides the last row's divider, footer action, surface registry) and `packages/ui/src/Panel.tsx` using them; verify with `Panel` tests for content and no footer, the footer (outline and ghost, icon and label, press, button role and name, always visible), divider hiding for the last row with and without a footer, and content ending in a `Card` or `Panel` not being clipped
- [x] 1.2 Export `Panel` and its prop types from `packages/ui/src/index.ts` (not the internal parts); verify `pnpm check-types` passes and `Panel` is importable from `@mee/ui`
- [x] 1.3 Keep the shadow of a contained `Panel` or `Card` visible whatever wraps it (no clipping view around the content; the last row's divider is overlapped and covered by a footer strip) and add the optional `gap` prop to `Panel`; verify with tests that rows, a card, a panel and a component rendering a card get no clipping view, that the footer carries the cover strip, and that `gap` is applied between children and absent by default

## 2. Card

- [x] 2.1 Rebuild `packages/ui/src/Card.tsx` on the shared parts with the `header` render prop receiving `{ expanded, toggle }`; verify with tests that children render, the header function is called with the state, and a card without a header shows no header row
- [x] 2.2 Controlled (`expanded` / `onExpandedChange`) and uncontrolled (`defaultExpanded`) expansion, expanded by default, `toggle` requesting the opposite state; verify with tests for controlled toggle (stays until the prop changes), uncontrolled toggle (collapses and the callback fires), default expanded, and a header that never calls `toggle`
- [ ] 2.3 Animate the body height with Reanimated (measured content height, `withTiming`, `ReduceMotion.System`, no animation on first render, collapsed body hidden from assistive technology and touches); verify with tests that a collapsed body is hidden and reachable again when expanded, and manually in Storybook that expanding and collapsing animates smoothly
- [x] 2.4 Show the card's footer only while the card is expanded, and keep a surrounding `Panel`'s footer visible when a card inside it collapses; verify with tests for both
- [x] 2.5 Hide the divider of a header with nothing below it (collapsed, or no body and no footer) and the last body row's divider, and keep the header divider above an expanded body; verify with tests for a header-only card, a body with and without a footer, a collapsed card, a header over an expanded body, and a body ending in a card

## 3. Accessibility

- [x] 3.1 Add an optional `accessibilityState` prop to `CellInfo`, applied to its pressable row only; verify with `CellInfo` tests that a pressable row reports the state (and updates on re-render), that a row without it is unchanged, and that a static row does not report it
- [x] 3.2 Verify with a `Card` test using a `CellInfo` header that the expanded accessibility state flips when the card is toggled

## 4. Icons

- [x] 4.1 Add `react-native-svg` as a peer and dev dependency in `packages/ui/package.json` (same version as the apps) and have `pnpm install` run by the user; verify `react-native-svg` resolves from `packages/ui` and `pnpm check-types` passes
- [x] 4.2 Add `packages/ui/src/icons` with `IconProps` and the icons `PencilIcon`, `PlusIcon`, `FolderPlusIcon`, `PaperclipIcon`, `Diagram3Icon`, `PeopleIcon`, `PersonVideoIcon`, `ChevronDownIcon`, `ChevronRightIcon` built from the Figma path data, and export them from `packages/ui/src/index.ts`; verify with tests that each icon renders at its default size and at a custom size and takes a custom colour
- [x] 4.3 Add `CardChevron` (16px, right when collapsed, down when expanded, animated rotation of `ChevronRightIcon`, no animation under reduced motion) and export it; verify with tests that the orientation follows `expanded` and that it renders inside `CellInfo`'s `trailing` slot
- [ ] 4.4 Add `packages/ui/src/icons/icons.stories.tsx` showing every icon; verify it renders in Storybook and each glyph matches its Figma glyph

## 5. Stories

- [x] 5.1 Convert `CellInfo.stories.tsx` to render-only stories (no React elements in `args`); verify lint and type-check pass and Storybook launches
- [ ] 5.2 Add `Panel` and `Card` stories using the real icons: member list in a panel with an outline footer, expandable form card with `CardChevron`, a form card in a panel with a ghost "Create form" footer, the empty-state card in a panel with an "Add form" footer, and the header-only navigation cards (one with a count badge in `trailing`); verify each story renders in Storybook
- [ ] 5.3 Regenerate the story index with `pnpm --filter app-tellipod storybook:generate` and verify every story is listed and renders in `pnpm tellipod:storybook:ios`

## 6. Verification

- [x] 6.1 Run `pnpm lint` and `pnpm check-types` from the repo root and verify there are no errors
- [ ] 6.2 Compare the stories with Figma nodes 38:2735, 820:14161 and 820:18488 side by side and verify surface, spacing, footer styles, dividers, icons and header row match
