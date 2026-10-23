## Why

The Tellipod designs show edit dialogs as bottom sheets, for example "Edit form info" (Figma node 820:15558): a grabber, a title with a description, and a slot holding a form and a Save button. `@mee/ui` has no sheet, so every dialog would re-implement the surface, the grabber, the title block and the dismissal rules (drag down, backdrop tap, Android back). `@gorhom/bottom-sheet` and `react-native-gesture-handler` are already installed in app-tellipod, but nothing uses them yet and Storybook has no gesture or sheet host, so a sheet story cannot run.

## What Changes

- Add a `Sheet` component to `@mee/ui`: a modal bottom sheet built on `BottomSheetModal`, with a grabber, a title, an optional description and a content slot for `children`. The content is not part of the component: the form fields and Save button of "Edit form info" stay in the feature that uses it.
- `Sheet` is controlled through `visible` and `onDismiss`. It is dismissed by dragging down, tapping the backdrop, the Android back button, and an accessible grabber action.
- `Sheet` takes a `dismissible` prop (default `true`). When `false`, drag and backdrop dismissal are disabled so a feature can protect unsaved input, and the grabber is hidden because it would promise a drag that does nothing; the Android back button still calls `onDismiss`, which the feature controls.
- The sheet lifts above the keyboard while a field inside it is focused.
- `@gorhom/bottom-sheet`, `react-native-gesture-handler` and `react-native-safe-area-context` become peer and dev dependencies of `@mee/ui`.
- app-tellipod mounts `GestureHandlerRootView` and `BottomSheetModalProvider` at the app root and in the Storybook decorator, so a sheet can be presented in the app and in stories.
- Add `Sheet` stories (open button, long scrolling content) and tests.

## Capabilities

### New Capabilities
- `packages/ui/sheet`: the shared `Sheet` component: surface and layout, content slot, controlled visibility, the dismissal paths, `dismissible`, keyboard behavior and accessibility.

### Modified Capabilities
- `app-tellipod/app-shell`: the app root provides the hosts a sheet needs.
- `app-tellipod/storybook`: stories render inside the same hosts so a sheet can be opened and dragged.

## Impact

- New files in `packages/ui/src`: `Sheet.tsx`, `Sheet.stories.tsx`, `Sheet.test.tsx`; export from `packages/ui/src/index.ts`.
- `packages/ui/package.json`: peer and dev dependencies on `@gorhom/bottom-sheet`, `react-native-gesture-handler` and `react-native-safe-area-context`. The user must run `pnpm install`.
- `apps/app-tellipod/src/app/_layout.tsx` and `apps/app-tellipod/.rnstorybook/preview.tsx`: wrap in the two hosts.
- `apps/app-tellipod/jest.setup.ts`: the hand-written `react-native-reanimated` mock may need additions, and gesture-handler needs its jest setup, for `Sheet` tests to run.
- No native module is added (both libraries are already linked in app-tellipod), so no `pod install` or prebuild is expected. `app-concepts` and `app-production` do not import `Sheet` and are unaffected.
- Not in scope: the "Edit form info" form itself, text field and select components, and `react-native-keyboard-controller`.
