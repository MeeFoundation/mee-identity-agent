## 1. Design tokens and copy

- [x] 1.1 Add `textBrandMain`, `textGraySolid`, `surfaceErrorSolid`, `alphaWhite80` colors, `spacing[4]`, an `xxsMedium` typography entry and `motion.footerDuration` to `apps/app-tellipod/src/shared/ui/tokens.ts`; verify `pnpm check-types` passes and values match Figma node 13:1056 (`#4f868e`, `#334155`, `#b91c1c`, 10/14 Medium, 0.05 tracking)
- [x] 1.2 Change the `footer['ask-telli']` string in `src/shared/i18n/en.ts` to "Telli Guide"; verify no other string or screen title changed (`grep` for "Ask Telli" shows only the screen title usage)

## 2. Icons

- [x] 2.1 Download the outline icons for house, Telli Guide (chat AI lock), bell and list-nested from Figma node 13:1056 and the filled house/bell from the design library using `curl -L` into the scratchpad, and verify each file is non-empty with 24×24 root dimensions
- [x] 2.2 Add the four outline icon components and the filled variants (house, bell; reuse outline glyph for Telli Guide and Navigation if no filled variant exists in Figma) to `src/shared/ui/icons/` following the existing `IconProps` pattern, export them from `icons/index.ts` and `shared/ui/index.ts`; verify via `icons.test.tsx` that each renders at 24 and tints with `color`, and update `icons.stories.tsx`

## 3. Footer surface and tab layout

- [x] 3.1 Create a `FooterTab` component in `src/widgets/app-footer/` rendering the icon above the label with the design's paddings, gap and typography, taking `focused`, `label`, `icon`, `showBadge`; verify with a rendering test for inactive and active colors/icons
- [x] 3.2 Restyle `AppFooter` with the 80%-white surface, white top/side border, 28pt top radius, upward shadow (+ Android `elevation`), 8pt horizontal padding, equal-width tabs and bottom padding from the safe-area inset (min 8pt); verify visually in Storybook on a device with and without a bottom inset
- [x] 3.3 Restyle the unread badge to the 8pt red dot with 2pt white ring at the bell's top-right, kept visible for active and inactive states; verify the existing unread-indicator test still passes unchanged

## 4. Color transition animation

- [x] 4.1 Implement the layered inactive/active content with the active layer's opacity driven by a per-tab progress shared value (Decision 1), `withTiming` ~250 ms, `ReduceMotion.System`, initial value taken from `focused` with no mount animation; verify in Storybook that the color transitions in place and icon/label never move or scale
- [x] 4.2 Ensure interrupted presses reverse from current progress and decorative layers are hidden from accessibility; verify with a test that switching tabs twice quickly ends with exactly one `selected` tab and one announced label per tab
- [x] 4.3 Add a test asserting the active layer's opacity is 0 when the tab is inactive and 1 when focused, and a reduce-motion test asserting immediate final colors

## 5. Tests, stories, quality

- [x] 5.1 Update `app-footer.test.tsx` for the "Telli Guide" label, icon-over-label rendering and active/inactive styling; verify `pnpm --filter app-tellipod test` passes for the footer suite
- [x] 5.2 Update `app-footer.stories.tsx` so each tab can be active and the badge toggled, and add a story that switches the active tab to exercise the animation; verify the story index regenerates with `pnpm --filter app-tellipod storybook:generate`
- [x] 5.3 Run `pnpm check-types` and `pnpm lint` from the repo root; verify both report no errors
- [x] 5.4 Compare the running footer in Storybook against Figma node 13:1056 and the active variant 13:1065 on iOS and Android; verify surface, spacing, icon, typography and badge match, and that tab switching shows the color transition
