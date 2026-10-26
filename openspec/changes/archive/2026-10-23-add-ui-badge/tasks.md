## 1. Component

- [x] 1.1 Create `packages/ui/src/Badge.tsx` with the props `type`, `variant`, `size`, `shape`, `children`, `dot`, `leadingIcon`, `trailingIcon`, `accessibilityLabel`, `style` and `testID`, and the color and size lookup tables from the design; verify `pnpm check-types` passes
- [x] 1.2 Implement the rounded, pill, circle and dot shapes, the slot order, single-line truncation and the dot accessibility behavior; verify the values match the spec tables for solid, light and outlined at sizes xxs to m by comparing against the Figma Badge nodes 562:86257, 2564:49574, 2564:49844, 2564:58933 and 2730:24888
- [x] 1.3 Export `Badge` and its prop types from `packages/ui/src/index.ts` in alphabetical position; verify `import { Badge } from '@mee/ui'` resolves in a type check

## 2. Tests

- [x] 2.1 Add `packages/ui/src/Badge.test.tsx` covering defaults, the color tokens per type and style, the size heights, the circle min width, the dot size and the absence of text, and verify `pnpm --filter app-tellipod test Badge` passes (the app's Jest config runs the `packages/ui/src` tests)
- [x] 2.2 Cover slot order and no reserved space for missing slots, label truncation props, the labeled and unlabeled dot accessibility, and that the badge is not exposed as a button; verify the tests pass

## 3. Stories

- [x] 3.1 Add `packages/ui/src/Badge.stories.tsx` showing every type, style, size and shape, a badge with leading dot and both icons, a count badge, a dot badge and a long label; verify the stories type-check
- [x] 3.2 Run `pnpm --filter app-tellipod storybook:generate` and verify the Badge stories appear in the generated story index

## 4. Verification

- [x] 4.1 Run `pnpm check-types` and `pnpm lint` from the repo root and verify both pass with no errors
- [ ] 4.2 Open the Badge stories in `pnpm tellipod:storybook:ios` and compare the primary, danger, circle and dot badges against the Figma screenshot of node 4:8701
