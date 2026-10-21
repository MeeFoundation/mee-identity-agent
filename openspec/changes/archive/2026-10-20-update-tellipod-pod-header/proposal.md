## Why

The app-tellipod header is a text-only placeholder (`<`, `...`, hardcoded colors). The Figma designs (Mee - Tellipod App v4.0.3) define the real headers on one shared branded gradient surface: the home header (node `13:1146`: avatar, welcome, privacy note, search field), the back + search header (node `13:13435`) and the pod detail header (node `13:14410`: back, avatar, title, breadcrumb, overflow action, segmented tabs). The shell needs them so every screen looks and behaves like the design.

## What Changes

- Give `home`, `back-search` and `pod` one shared surface: brand gradient background, rounded bottom corners (28), bottom border and soft shadow, safe-area top padding in place of the mocked iOS status bar.
- `home`: 48px avatar with the user's initial, "Welcome, <name>" (XL semibold), a privacy note with a shield icon, and a full-width search-or-ask field.
- `back-search` (renamed from `back-title`): 44x44 back button and the search-or-ask field in one row. Navigation uses it. **BREAKING** for the variant id `back-title`, which is removed; only Navigation used it.
- `pod`: back, 48px avatar, title, breadcrumb subtitle (icon, chevron-separated items), overflow action, and a controlled Notes/Chat/Info tab row.
- Replace placeholder glyphs with real icons and hardcoded colors with design tokens; introduce Public Sans and a token set in app-tellipod `shared/`.
- Pod content (title, avatar, breadcrumb, selected tab) flows through chrome state instead of `podTitleAtom`. The user's name comes from a new `userNameAtom`; it is read by the home header and is empty until something sets it.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-tellipod/app-shell`: header variants change (`back-title` becomes `back-search`), and new requirements cover the shared surface, search-or-ask field, home header content, back-search header content and pod header content, tabs and actions. The chrome-focus requirement is updated for the rename.

## Impact

- Code: `apps/app-tellipod/src/widgets/app-header/`, `apps/app-tellipod/src/shared/chrome/`, new `shared/user` atom, `shared/i18n/en.ts`, `src/app/pods/[id].tsx`, `src/app/(tabs)/navigation.tsx`, new `shared/` tokens and icon components, header tests.
- Dependencies: `expo-linear-gradient`, `expo-font`, `@expo-google-fonts/public-sans`, `react-native-svg` (already added and `pod install` run).
- Out of scope: iOS status bar mock (time, island, signal), the footer/bottom-menu redesign visible in the same Figma frames, real pod data, content of the Notes/Chat/Info sub-screens, search behavior.
- Assumptions: node `13:14410` is named "home-topbar" but shows the pod detail header, so it maps to `pod`; node `13:1146` is the real home header. Screens with a header are shown only to logged-in users, so the user name is available from a user atom (decided with the user); with no name set the header degrades to "Welcome".
- The change directory keeps its original name `update-tellipod-pod-header` although it now covers all header variants.
