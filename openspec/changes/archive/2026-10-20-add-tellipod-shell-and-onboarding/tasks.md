## 1. Dependencies and foundations

- [x] 1.1 Ask the user to run `pnpm --filter app-tellipod add jotai react-native-mmkv i18next react-i18next` (versions aligned with app-concepts) and a native rebuild; verify the four packages appear in `apps/app-tellipod/package.json` and the iOS project links MMKV
- [x] 1.2 Create the FSD folders under `apps/app-tellipod/src` (`shared`, `widgets`, `features`) and add an `@/` path alias; verify `pnpm check-types` still passes
- [x] 1.3 Add i18next setup with the `en` resource (screen names, tab labels, onboarding title, Start) and import it in the root layout; verify a `t()` call resolves in a screen
- [x] 1.4 Add the MMKV-backed synchronous storage adapter for `atomWithStorage`; verify a stored value is readable on first render after an app reload

## 2. Chrome mechanism

- [x] 2.1 Implement `chromeAtom` (header variant, footer visibility, owner id) with defaults `none`/`visible`; verify the default state via a unit test
- [x] 2.2 Implement `useAppChrome` with focus-scoped apply and owner-checked release; verify with a test that navigating A to B leaves B's chrome and never clears it on A's blur
- [x] 2.3 Add `unreadNotificationsAtom` and the pod-title atom; verify they are independent of `chromeAtom`

## 3. Header and footer widgets

- [x] 3.1 Build `AppHeader` rendering variants `none`, `home`, `back-title`, `pod` (placeholder content, back control wired to the router); verify each variant renders in the running app
- [x] 3.2 Build `AppFooter` as the `Tabs` custom `tabBar` with four tabs, active highlight, and the unread indicator on Notifications; verify tab switching and indicator on/off by changing the atom
- [x] 3.3 Respect footer `hidden` in `AppFooter`; verify a tab screen declaring `hidden` shows no footer and regains it after blur

## 4. Screens and routing

- [x] 4.1 Add placeholder screen components (name only, via `t()`) for Home, Ask Telli, Notifications, Navigation, Pod info; verify each shows only its name
- [x] 4.2 Wire route files with `useAppChrome` (`home` on Home/Ask Telli/Notifications, `back-title` on Navigation, `pod` on `pods/[id]`); verify the header variant per screen
- [x] 4.3 Render `AppHeader` in the root layout and use `AppFooter` in `(tabs)/_layout.tsx` with the four tabs; verify Pod info pushes without footer and back restores it

## 5. Onboarding

- [x] 5.1 Add `onboardedAtom` persisted under `onboarding.completed`; verify the value survives an app restart
- [x] 5.2 Add the onboarding screen (localized title, Start button, no header/footer); verify it renders with `header: none`
- [x] 5.3 Gate routes with `Stack.Protected` in the root layout; verify fresh install shows onboarding, Start lands on Home, system back does not return, and a deep link before completion shows onboarding
- [x] 5.4 Verify relaunch after completion shows Home with no onboarding flash, and relaunch without completion shows onboarding again

## 6. Quality gates

- [x] 6.1 Run `pnpm check-types` and verify no errors
- [x] 6.2 Run `pnpm lint` and verify no Biome errors, with no `console.log` or hardcoded user-facing strings left
