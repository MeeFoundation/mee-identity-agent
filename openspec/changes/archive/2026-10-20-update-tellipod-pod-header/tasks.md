## 1. Dependencies and assets

- [x] 1.1 With user confirmation, add `expo-linear-gradient`, `expo-font`, `@expo-google-fonts/public-sans` and `react-native-svg` to app-tellipod via `pnpm` and `expo install`; verify they appear in `apps/app-tellipod/package.json` and `pnpm check-types` still passes
- [x] 1.2 With user confirmation, run `pod install` for app-tellipod; verify the iOS project builds and launches
- [x] 1.3 Download the four Figma icons (chevron-left, people, chevron-right, three-dots-vertical) and add them as typed SVG components in `src/shared/ui/icons/`; verify each renders at its design size (24, 14, 10, 24) with a tint color in a test

## 2. Tokens and fonts

- [x] 2.1 Add `src/shared/ui/tokens.ts` with the colors, spacing, radii and type styles listed in design.md; verify values match the Figma variable list and the module is exported from `shared/ui`
- [x] 2.2 Load Public Sans 400/500/600 at the app root and hold the splash screen until loaded; verify the header text renders in Public Sans on the iOS simulator

## 3. Chrome state

- [x] 3.1 Extend `ChromeConfig` with the optional `pod` payload and update `useAppChrome` to apply and release it with the existing owner logic; verify `chrome.test.tsx` covers apply on focus, release on blur and no clearing of a newer owner's payload
- [x] 3.2 Remove `podTitleAtom` and migrate `src/app/pods/[id].tsx` to declare the pod payload through `useAppChrome`, with localized strings from `en.ts`; verify the Pod info screen still renders its name and `pnpm check-types` passes

## 4. Pod header

- [x] 4.1 Build the pod header container: gradient surface, 28 bottom radius, bottom border, shadow, safe-area top padding; verify via a render test and a visual comparison with Figma node `13:14410` on the iOS simulator
- [x] 4.2 Build the top row: 44x44 back and overflow icon buttons with localized accessibility labels, 48 avatar with initial fallback, single-line truncating title, breadcrumb with icon and chevron; verify tests for content, fallback avatar and long-title truncation
- [x] 4.3 Build the controlled Notes/Chat/Info tab row with selected highlight and `tab` accessibility roles and states; verify tests for selecting, rejected change and pressing the selected tab
- [x] 4.4 Add the new strings (tab labels, breadcrumb, menu and back labels) to `src/shared/i18n/en.ts` and use `t()` everywhere; verify no literal user-facing text remains in the header files

## 5. Shared surface, search field and other headers

- [x] 5.1 Add search (20) and shield-lock (14) icon components from the Figma assets `13:1146`,; verify the icon test covers their sizes and tint
- [x] 5.2 Extract `HeaderSurface` (gradient, corners, border, shadow, safe-area padding) from the pod header and use it in `PodHeader`; verify the pod header tests still pass
- [x] 5.3 Add `SearchField` (search icon, non-editable input, localized placeholder) and verify a test that the placeholder is shown and the input is not editable
- [x] 5.4 Add `userNameAtom` in `src/shared/user` (empty by default) and export it; verify a test for the default and for a set value
- [x] 5.5 Build the `home` header: avatar with initial or generic glyph, "Welcome, <name>" or "Welcome", privacy note with shield icon, `SearchField`; add its strings to `en.ts`; verify tests for the named, nameless and truncation cases
- [x] 5.6 Rename the `back-title` variant to `back-search` in chrome types, `AppHeader` and the Navigation screen, and build its content (back button + `SearchField`); verify tests for content and back navigation, and that no `back-title` reference remains
- [x] 5.7 Update `app-header.test.tsx` and `chrome.test.tsx` for `home` and `back-search`; verify `pnpm --filter app-tellipod test` passes

## 6. Verification

- [x] 6.1 Update `app-header.test.tsx` for the new pod content and keep the `none`, `home` and `back-title` tests passing; verify `pnpm --filter app-tellipod test` passes
- [x] 6.2 Run `pnpm lint` and `pnpm check-types` from the repo root; verify both report no errors
- [x] 6.3 Compare the running home, back-search and pod headers against their Figma screenshots on iPhone-size and a narrow-width simulator; verify layout, colors and typography match and nothing sits under the top inset
