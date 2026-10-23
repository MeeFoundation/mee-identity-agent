## Context

`@mee/ui` (`packages/ui/src`) holds single-file components, each with a local `colors` object, a `StyleSheet`, a colocated `.stories.tsx` and `.test.tsx`. Its only runtime peers are `react-native`, `react-native-reanimated` and `react-native-svg`. See proposal.md for why a sheet is needed.

Figma node 820:15558 ("Modal", 402x491) is: a 16px grabber row (a 60x4 bar), a header frame (title row plus a description row, a hidden badge slot next to the title), a `Slot` holding the form, and a "Mobile screen elements" instance (the home indicator, which is device chrome).

`@gorhom/bottom-sheet` (^5.2.14) and `react-native-gesture-handler` (~3.3.0) are declared in `apps/app-tellipod` only, and nothing in the app imports them. The app root (`src/app/_layout.tsx`) and the Storybook decorator (`.rnstorybook/preview.tsx`) provide `SafeAreaProvider` only. `react-native-keyboard-controller` is not installed. `@mee/ui` tests run under app-tellipod's jest (`roots` includes `packages/ui/src`), whose `jest.setup.ts` replaces `react-native-reanimated` with a hand-written mock.

## Goals / Non-Goals

**Goals:**
- One content-agnostic `Sheet` that every dialog in the designs can use.
- Drag, backdrop, Android back and accessible dismissal, with a way for a feature to protect unsaved input.
- A story that can be opened and dragged on a device.

**Non-Goals:**
- The "Edit form info" form, a text field or a select component.
- Snap points, a resizable or full-screen sheet, and a non-modal (inline) sheet.
- Replacing the hand-written reanimated jest mock with the library's own mock.
- Adding `react-native-keyboard-controller`.

## Decisions

**1. Modal sheet on `BottomSheetModal`.**
The dialog is presented over tab bars and headers, which an inline `BottomSheet` mounted inside a screen cannot do (its parent clips it). `BottomSheetModal` renders in a portal above everything. Alternatives: a hand-written sheet over RN `Modal` with a reanimated pan gesture (no new dependency, but gestures, backdrop, scrolling-versus-drag handoff and keyboard handling would all be ours), and the inline `BottomSheet` (rejected above).

**2. Dependencies are peers of `@mee/ui`, hosts are the app's job.**
`@gorhom/bottom-sheet`, `react-native-gesture-handler` and `react-native-safe-area-context` (for the bottom inset, decision 8; `@mee/ui` could not resolve it before) are added to `peerDependencies` (same pattern as `react-native-reanimated` and `react-native-svg`) and to `devDependencies` at the versions app-tellipod uses, so the package type-checks and resolves on its own. `@mee/ui` does not mount `GestureHandlerRootView` or `BottomSheetModalProvider` itself: the providers must wrap the whole app once, and a component cannot provide them for its siblings. app-tellipod mounts both at the root and in the Storybook decorator. No new native module is linked, because app-tellipod already has both libraries. `app-concepts` and `app-production` never import `Sheet`.

**3. Controlled with `visible` and `onDismiss`.**
`visible` drives `present()` and `dismiss()` from an effect, matching `Tabs` (`value` / `onValueChange`) and `Card` (`expanded` / `onExpandedChange`), so a feature keeps open state in its own Jotai atom. The library calls its own dismissed callback for both user-driven and programmatic closes; `Sheet` forwards it as `onDismiss` only for user-driven closes, by ignoring the callback when the close was started by `visible` becoming `false`. Without this guard the consumer would be told to close a sheet it just closed.
`Sheet` also calls the library's `dismiss()` only while the sheet is presented. Found on a device: in `@gorhom/bottom-sheet` 5.2.14, `dismiss()` on a modal that is not mounted (at mount while hidden, or after a user-driven close that already reset it) leaves its status at `DISMISSING`, and every later `present()` is then ignored silently, so the sheet never appears.

**4. Dismissal paths map onto library options.**
Drag down to close is enabled while `dismissible` is `true`. The backdrop is a library backdrop whose press behavior closes while `dismissible` is `true` and does nothing otherwise. Android back calls `onDismiss` whether or not `dismissible` is set. Checked in `@gorhom/bottom-sheet` 5.2.14: the library has no `BackHandler` or hardware-back handling anywhere in its source, so `Sheet` subscribes to `BackHandler` itself while visible and returns `true` to stop the screen behind from navigating. With `dismissible={false}` a pan past the threshold springs back, and the back button hands the decision to the consumer instead of closing.

**5. The grabber is a real button, and only while the sheet is dismissible.**
The grabber bar sits in a tappable row with `accessibilityRole="button"`, `accessibilityLabel` "Dismiss" and the same `onDismiss`. Gesture-only dismissal is unreachable for screen-reader and switch users. The label is a user-facing string, so it goes through i18next like other UI strings; because `@mee/ui` has no i18n, the label is a prop with an English default (`dismissLabel`) that app-tellipod can override.
While `dismissible` is `false` the bar and the button are not rendered, because a grabber promises a drag and the sheet will not follow it (the same as an iOS modal that cannot be dismissed interactively). An empty row of the same 16px height stays in its place so the title does not move between the two states, and the Android back button remains the one dismiss path that reaches the consumer, which can ask for confirmation. Alternative: keep the bar and the accessible action while protected, which keeps an unconditional screen-reader dismiss but shows sighted users a control that misleads them.

**6. Scrolling content uses the library's scroll container.**
Children are rendered inside the library's scrollable view so that dragging the content scrolls it, and a drag from the top of it hands over to the sheet. A plain RN `ScrollView` inside a bottom sheet fights the pan gesture. The header (grabber, title, description) sits outside the scrollable region so it stays in place.

**7. Keyboard: the library's built-in handling, no new package.**
Checked in 5.2.14: the library listens to React Native's own `Keyboard` events (`hooks/useAnimatedKeyboard.ts`) and does not use `react-native-keyboard-controller`, so nothing new is needed. The sheet uses `keyboardBehavior="interactive"` with `keyboardBlurBehavior="restore"` and resizes to the keyboard. For a text field inside the sheet to be tracked, the library's own `BottomSheetTextInput` is the reliable choice; a plain `TextInput` may not move the sheet on every platform. `react-native-keyboard-controller` would smooth this, but it is a native module that needs a rebuild, so it is left out until the built-in behavior proves insufficient on a device.

**8. Height from content, capped by the container.**
The sheet sizes to its content (dynamic sizing) rather than fixed snap points, because the one design is a form of unknown length. The cap is the library's own: the height of the modal container minus `topInset`, which `Sheet` sets to the top safe-area inset plus a 16px gap. Do not cap by window height: the container is the provider's area (in Storybook, the story area, which is shorter than the window), so a window-based cap let a tall sheet extend above the container and push its header off screen (seen on a device). Bottom padding of the content is the bottom safe-area inset, so the home indicator zone is empty space and no home-indicator element is drawn.

**9. Styling follows the existing components.**
A local `colors` object (white surface, the grabber and description greys from the Figma variables), 16px side padding and radius, Public Sans text with the same font families as `PanelParts`. Shared tokens remain a separate change.

**10. Stories use render functions, not args carrying React elements.**
The same rule as `Card` and `CellInfo` stories (Storybook's arg inference throws on elements created at story-load time). The open button holds `visible` in local state, a story-only use of `useState`.

**11. The jest environment may need work for the library.**
`jest.setup.ts` mocks `react-native-reanimated` by hand with a small surface; the library uses more of it. Tests can use the library's published jest mock (`@gorhom/bottom-sheet/mock`) and the gesture-handler jest setup, and the reanimated mock may need extra members. Tests assert on what `Sheet` renders and the callbacks it fires, not on gesture physics, which are covered on a device.

## Risks / Trade-offs

- [Gesture and animation behavior cannot be verified in jest] → Tests cover rendering, props and callbacks; the Storybook story on iOS and Android is the check for drag, backdrop, back button and keyboard, listed as explicit manual tasks.
- [The library's reanimated, gesture-handler or Expo SDK compatibility could fail at runtime even though both are installed] → Verify first, in the story, before building on it; the open button story is the first task after wiring the hosts.
- [Missing `GestureHandlerRootView` or provider makes a sheet silently not appear] → The two hosts are added in one task at the app root and in the decorator, and the spec requires them.
- [Text fields inside the sheet that are not the library's `BottomSheetTextInput` may not lift the sheet] → The story form uses the recommended input and the limitation is documented in the component's story; revisit with `react-native-keyboard-controller` if a real form misbehaves.
- [Forwarding `onDismiss` only for user-driven closes depends on the library's callback ordering] → A test covers consumer-driven close not calling `onDismiss`; confirm on device.
- [Android back handling may be done by the library, by us, or twice] → Check the installed version's behavior before adding a `BackHandler`; one test asserts exactly one call.
- [A new peer dependency pair for `@mee/ui`] → Install needs `pnpm install` run by the user; other apps do not import `Sheet`.

## Open Questions

- Exact dismissal threshold and animation duration: use the library's defaults unless a device check shows a mismatch with the design.
