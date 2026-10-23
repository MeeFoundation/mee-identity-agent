## 1. Dependencies and hosts

- [x] 1.1 Add `@gorhom/bottom-sheet`, `react-native-gesture-handler` and `react-native-safe-area-context` as peer and dev dependencies in `packages/ui/package.json` (same versions as app-tellipod) and have the user run `pnpm install`; verify both resolve from `packages/ui` and `pnpm check-types` passes
- [x] 1.2 Wrap the app root in `apps/app-tellipod/src/app/_layout.tsx` with `GestureHandlerRootView` and `BottomSheetModalProvider`, and add the same two hosts to the decorator in `apps/app-tellipod/.rnstorybook/preview.tsx`; verify `pnpm check-types` and `pnpm lint` pass and the app and Storybook still launch
- [x] 1.3 Check the installed `@gorhom/bottom-sheet` version's handling of the Android back button and keyboard (read its source or docs in `node_modules`) and note in `design.md` decisions 4 and 7 whether a `BackHandler` is needed; verify the notes match what the installed code does

## 2. Sheet component

- [x] 2.1 Create `packages/ui/src/Sheet.tsx` with the surface, grabber row, title, optional description and content slot, with `visible`, `onDismiss`, `title`, `description`, `children`, `dismissible` and `dismissLabel` props, sized to content with a cap and the bottom safe-area padding; verify with `Sheet` tests for title, description, no description, children rendered unchanged, and no reserved space without a description
- [x] 2.2 Drive presentation from `visible` and forward `onDismiss` only for user-driven closes; verify with tests that showing and hiding follow `visible`, that a consumer-driven close does not call `onDismiss`, and that a user-driven close calls it exactly once
- [x] 2.3 Wire the dismissal paths (drag down, backdrop tap, Android back) and `dismissible`; verify with tests that `dismissible={false}` disables drag and backdrop dismissal, that back calls `onDismiss` in both modes and only once, and on iOS and Android in the story that drag past the threshold dismisses and a short drag springs back
- [x] 2.4 Make the grabber a button named by `dismissLabel` (default "Dismiss") that calls `onDismiss` while dismissible (no bar and no button while `dismissible` is `false`, header height unchanged), and hide the content behind the sheet from assistive technology; verify with tests for the role, the name, the call, a custom label, and the absence of the bar and the button while protected
- [x] 2.5 Render children in the library's scroll container with the header outside it, and use the library's keyboard behavior; verify with a test that tall content renders inside the scrollable region while the header does not, and on a device that a focused field is lifted above the keyboard (marked done by the user; keyboard lift was not verified on a physical device)
- [x] 2.6 Export `Sheet` and its prop types from `packages/ui/src/index.ts`; verify `Sheet` is importable from `@mee/ui` and `pnpm check-types` passes

## 3. Test environment

- [x] 3.1 Make `Sheet` tests run under app-tellipod's jest (use the library's jest mock and the gesture-handler setup, and extend the `react-native-reanimated` mock in `apps/app-tellipod/jest.setup.ts` only as far as needed); verify the existing `@mee/ui` and app-tellipod tests still pass and `Sheet.test.tsx` passes

## 4. Stories

- [x] 4.1 Add `packages/ui/src/Sheet.stories.tsx` with render-only stories: an open button for the "Edit form info" layout (title, description, a text input, a button), a protected sheet (`dismissible={false}`), and long scrolling content; verify each renders in Storybook and `pnpm --filter app-tellipod storybook:generate` lists them under the `@mee/ui` group
- [x] 4.2 Compare the "Edit form info" story with Figma node 820:15558 (grabber, title and description spacing, 16px padding, radius) and adjust the local `colors` and spacing; verify visually against the design on a device

## 5. Final checks

- [x] 5.1 Run `pnpm lint` and `pnpm check-types` from the repo root and confirm no errors; verify both exit successfully
