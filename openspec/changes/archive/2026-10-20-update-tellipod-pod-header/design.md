## Context

`widgets/app-header/app-header.tsx` renders all four variants from `chromeAtom` (`header: 'none' | 'home' | 'back-title' | 'pod'`) and reads the pod title from `podTitleAtom`. Styling is inline `StyleSheet` with hardcoded hex values. app-tellipod has none of: fonts, tokens, icons, gradient, SVG support or image handling; app-concepts already uses `expo-linear-gradient`, `expo-font`, `expo-image`, `react-native-svg` and `expo-blur`. See proposal.md for scope and the node-to-variant assumption.

All three headers share one surface (nodes `13:1146`, `13:13435`, `13:14410`), 402 wide: gradient `#dfecee` to `#ffffff` top to bottom, 1px white bottom border, 28 bottom radius, shadow `0 1 15 rgba(2,6,23,0.15)`; content padding 20, top row gap 8 (44 icon buttons, 48 avatar, gap 12 between avatar and text), tab row with 4 padding, 1 gap, 12 radius, 36-high tabs with 10 radius, blur 15 and a 5% dark fill with 10% dark border.

## Goals / Non-Goals

**Goals:**
- Home, back-search and pod headers match their Figma nodes at common phone widths using flex layout (no absolute positioning), on one shared surface component.
- Values come from a small token module, not scattered literals.
- The header stays a pure render of chrome state; screens drive content.

**Non-Goals:**
- iOS status bar mock (time, island, signal, battery): the real status bar is system-drawn.
- Footer / bottom-menu redesign shown in the same Figma frames.
- Search behavior: the field stays non-editable.
- Content of Notes, Chat and Info screens and routing between them.
- Pod data fetching.

## Decisions

**1. Content flows through chrome state.** Extend `ChromeConfig` with an optional `pod` payload `{ title, avatarUri?, breadcrumb: { label, icon? }[], tab, onTabChange }` that `useAppChrome` applies on focus and releases on blur, replacing `podTitleAtom`. This keeps the existing single-mechanism rule (focus-owned chrome) and one source of truth. Alternative: keep separate atoms per field (`podTitleAtom`, `podAvatarAtom`, ...). Rejected: multiplies atoms and loses the owner-based release logic. Callbacks in an atom are not serializable; acceptable because chrome state is in-memory only. `podTitleAtom` is removed and the pod screen migrated.

**2. Tabs are controlled.** The header renders `tab` and calls `onTabChange`; it holds no selection state. Matches the spec scenario "Screen rejects the change". Alternative: uncontrolled with local state. Rejected: selection must match the body the screen shows.

**3. Tokens in `shared/ui/tokens.ts`.** Colors (`surface.brand.light`, `surface.default.main`, `text.default.title`, `text.brand.solid`, `alpha.dark.5/10/15`), spacing, radii, and type styles (`base.medium`, `base.semibold`, `xs.regular`) named after the Figma variables so a later full token pass maps 1:1. Alternative: add a global theme/provider now. Rejected: out of scope for one widget.

**4. New dependencies via `expo install` (done):** `expo-linear-gradient` (gradient), `expo-font` plus `@expo-google-fonts/public-sans` (Public Sans 400/500/600), `react-native-svg` (icons). Native modules, so `pod install` / prebuild is needed; per repo rules these need user confirmation and the user runs push/migration-type steps. Alternatives: PNG icons exported from Figma (no dep, blurry on scale, no tinting); system font (deviates from design). Gradient has no dependency-free equivalent.

**5. Icons as typed SVG components** in `shared/ui/icons/` (chevron-left, chevron-right, people, three-dots-vertical, search, shield-lock), exported from the Figma icon assets, tinted with a `color` prop. Asset URLs from Figma are temporary and must be downloaded, never referenced at runtime.

**6. Tab blur is approximated.** Use the 5% fill and 10% border without a backdrop blur. The surface behind it is a near-flat gradient, so blur is visually negligible; avoids `expo-blur` (native cost, Android inconsistency). Revisit if design shows content scrolling under the tabs.

**7. Pod avatar.** `expo-image` is not added; use RN `Image` with `avatarUri`. When absent, render a circle in `surface.brand.light` with the title's first letter. Alternative: bundle a default image. Rejected: invents an asset not in the design.

**8. Safe area.** Top padding is `insets.top` plus the design's 10 spacing, replacing the mocked 14px-padded status bar block. It lives in the shared surface.

**9. Shared `HeaderSurface`.** One component owns gradient, rounded bottom corners, border, shadow and safe-area padding; `home`, `back-search` and `pod` render their content inside it. Alternative: each variant styles itself. Rejected: the three Figma nodes use the identical surface, so drift is the main risk.

**10. Shared `SearchField`.** Search icon (20) plus a non-editable `TextInput` with the localized placeholder, white field, `#cbd5e1` border, 12 radius, 44 high. Used by `home` and `back-search`. It keeps `TextInput` (not a plain `Text`) so the existing "placeholder is findable" behavior and accessibility semantics carry over, with `editable={false}`.

**11. Rename `back-title` to `back-search`.** The node `13:13435` has no title, and only Navigation used `back-title`, so the id is renamed rather than kept alongside. Alternative: keep both variants. Rejected: leaves an unstyled, unused variant.

**12. User name through `userNameAtom`.** A plain Jotai atom in `shared/user` holding the user's name, empty by default. Headers are only shown to logged-in users, so a later change makes the atom derive from the real user atom without touching the header. The home header shows "Welcome, <name>" and the initial; when empty it shows "Welcome" and a generic avatar glyph (the people icon in the avatar holder) so no name is invented. The localized greeting uses an interpolated key with two variants.

## Risks / Trade-offs

- [New native deps need a rebuild and may conflict with Podfile/monorepo autolinking quirks] → Install with `pnpm --filter app-tellipod exec expo install`, confirm before running, then rebuild iOS and verify launch.
- [Callback inside the chrome atom can go stale across renders] → `useAppChrome` writes on focus and owner-checks on release; tests cover tab change after re-render.
- [Font not loaded on first render causes flash/fallback] → Load via `useFonts` at the root and keep the splash screen up until ready (splash already installed).
- [Removing `podTitleAtom` breaks existing tests] → Update `app-header.test.tsx`, chrome tests and the pod screen in the same change.
- [Blur omission differs slightly from design] → Accepted, noted above.
