## 1. Figma check and icons

- [x] 1.1 Inspect the Figma Toast component set and record the seven types' colors and default icons (done: values are in the toast spec's type table)
- [x] 1.2 Add `InfoCircleIcon`, `CheckCircleIcon`, `ExclamationOctagonIcon`, `ExclamationTriangleIcon` (16px) and `XIcon` (20px) in `packages/ui/src/icons/` using the Figma glyph paths, export them from `icons/index.ts`, and verify `icons.test.tsx` covers default size, custom size and custom color for each
- [x] 1.3 Extend `icons.stories.tsx` with the five new icons and verify they appear in the icon story

## 2. @mee/ui Toast

- [x] 2.1 Implement `packages/ui/src/Toast.tsx` with the seven types, card appearance, title, description, icon, avatar slots and per-type default icons, and verify with tests for each type's colors and default icon and for the title-only and long-text cases
- [x] 2.2 Add actions (right and bottom placement, two at most) and the close button with `closeLabel`, and verify tests for placement, alignment inset, press handlers and the absent close button
- [x] 2.3 Add accessibility semantics (live region, button roles, 44px hit area) and verify with queries by role in `Toast.test.tsx`
- [x] 2.4 Export `Toast` and its prop types from `packages/ui/src/index.ts` and verify `pnpm check-types` passes in `packages/ui`

## 3. Stories

- [x] 3.1 Write `Toast.stories.tsx` with Types, slot combinations, action placements, long text and no-close stories, and verify each renders in Storybook
- [x] 3.2 Add the two Tellipod layout stories (pinned to the bottom, floating over scrolled content) and verify they match the Figma frames `908:18907` and `914:20076` visually

## 4. app-ux-flows web Toast

- [x] 4.1 Extend `apps/app-ux-flows/src/shared/ui/toast.tsx` with the seven types, icon, avatar and actions with placement, keeping the existing props, and verify existing flow tests such as `sc-pet-002` and `sc-pet-004` still pass
- [x] 4.2 Add translation keys for any new accessible labels, and add a unit test for the new types and the two action placements
- [x] 4.3 Check the rendered Toast against the Figma Toast in the app, both for the existing flow usages and for the new types, and verify visually

## 5. Checks

- [x] 5.1 Run `pnpm lint` and `pnpm check-types` from the repo root and verify both finish with no errors
- [x] 5.2 Run `pnpm --filter app-ux-flows test` and the `@mee/ui` tests and verify they pass
