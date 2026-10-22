## 1. Setup

- [x] 1.1 Check which Public Sans weights app-tellipod loads (`PublicSans_400Regular`, `PublicSans_500Medium`, `PublicSans_700Bold`, plus the existing `PublicSans_600SemiBold`) and verify by listing the font loader; if a weight is missing, add it to the loader and record that in the task notes (all four weights already loaded in `apps/app-tellipod/src/app/_layout.tsx`; no change needed)
- [x] 1.2 Create `packages/ui/src/CellInfo.tsx` with the discriminated `CellInfoProps` union (eight variants, `trailing`, `style`, `onPress`) and export it from `packages/ui/src/index.ts`; verify `import { CellInfo } from '@mee/ui'` type-checks and that an invalid prop combination (e.g. `value` on `add-info-in-chat`) fails type-checking

## 2. Component

- [x] 2.1 Implement the row shell with the per-variant padding, gap, border color and min height constants, flex layout and truncation; verify against the Figma screenshot of node 13:12972 for `member`, `mini-group` and `info`
- [x] 2.2 Implement the internal `Avatar` (48px member, 32px mini-group with icon slot, 32px brand-light for another-user-submitted), `LabelValue` stack and `NewBadge`; verify the badge appears only with `isNew` on `info`
- [x] 2.3 Implement `suggested-info`, `another-user-submitted`, `conflicting-data`, `info-added-in-chat` and `add-info-in-chat` content and typography (Public Sans weights, sizes, letter spacing, colors); verify each against its Figma node (908:18806, 484:24085, 484:24141, 117:5145, 117:9172)
- [x] 2.4 Implement press behavior (`Pressable` with button role and composed accessible label only when `onPress` is set, plain `View` otherwise); verify with the component test in 3.2

## 3. Stories and tests

- [x] 3.1 Add `packages/ui/src/CellInfo.stories.tsx` with a story per variant, `WithNewBadge`, `LongText`, `Pressable` and an `AllVariants` frame mirroring Figma, using placeholder trailing glyphs; verify `pnpm --filter app-tellipod storybook:generate` picks it up and the stories render in `pnpm tellipod:storybook:ios`
- [x] 3.2 Add `packages/ui/src/CellInfo.test.tsx` covering strings per variant, no placeholder copy, optional role omitted, badge shown only when requested, button role only with `onPress`, and the press call; verify the test passes

## 4. Verification

- [x] 4.1 Run `pnpm check-types` and `pnpm lint` from the repo root and verify both pass with no errors (`pnpm lint` reports only the generated, gitignored `storybook.requires.ts` `noRedeclare`, unrelated to this change)
- [x] 4.2 Open the `AllVariants` story on iOS and Android and verify spacing, borders, heights and truncation match the Figma frame (node 13:12972)
