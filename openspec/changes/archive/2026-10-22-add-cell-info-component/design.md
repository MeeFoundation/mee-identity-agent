## Context

- Figma node 13:12972 is a frame listing the "Cell info" component set: types `Member`, `mini-group`, `info` (with `New` boolean and `icon` slot), `Suggested info`, `Another user submitted`, `Conflicting data`, `info - added in chat`, `Add info in chat`. All rows are 362px wide in the design; the width is a frame artifact and rows should fill their parent.
- `@mee/ui` is consumed from source and has `Button` and `Tabs`. Both keep Figma token values as local constants in the component file; app-tellipod's `tokens.ts` cannot be imported from the package. `Tabs` takes icons as `ReactNode` slots so the package does not need `react-native-svg`.
- Public Sans is loaded by the consuming app. `Tabs` uses `PublicSans_600SemiBold`; this change also needs the Regular, Medium and Bold weights (`PublicSans_400Regular`, `PublicSans_500Medium`, `PublicSans_700Bold`). They need to be confirmed as loaded by app-tellipod.
- Storybook stories for `@mee/ui` run inside app-tellipod, which has icons for chevron-right and others under `src/shared/ui/icons`; `@mee/ui` stories cannot import from the app.

## Goals / Non-Goals

**Goals:**
- One `CellInfo` component covering all eight Figma variants with design-accurate spacing, borders and typography.
- A prop API that is hard to misuse: each variant accepts only the content it renders.

**Non-Goals:**
- Bundling icons or an `Avatar`/`Badge` component; `Avatar` and the NEW badge are internal to the row for now.
- Editing behavior (what pencil or plus do), claim or conflict resolution logic, or data fetching.
- Hover and focus states: the Figma set defines none for this component.
- Moving tokens into `@mee/ui` or refactoring `Button`/`Tabs`.

## Decisions

1. **One component with a discriminated `variant` prop, not eight components.** Variants share the row shell (border, padding, press handling) and the label/value text stack. `CellInfoProps` is a union keyed on `variant`, so TypeScript rejects, for example, a `value` on `add-info-in-chat` or an `isNew` on `member`. Alternative: flat optional props on one type; rejected because it lets invalid combinations compile. Alternative: separate exported components; rejected because consumers would switch on type at the call site and lose the shared shell. Variant ids are kebab-case versions of the Figma type names.

2. **Props by role, not by Figma layer name.** `member`: `name`, `roleLabel?`, `initial`. `mini-group`: `name`, `icon`. Info family: `label`, `value`; `info` adds `isNew?` and `newLabel` (the badge text, so the string is not hardcoded); `suggested-info` adds `suggestedLabel`; `info-added-in-chat` and `add-info-in-chat` take `section` and `label` (plus `value` for the former). `another-user-submitted` takes `initial`. Every variant takes `trailing?: ReactNode`; `style` is accepted on the row. Alternative: a single `children` composition API; rejected as heavier than the fixed Figma layouts need.

3. **Icons are slots; defaults from the design are not bundled.** Figma shows a pencil, chevron-right, plus, plus-lg in a filled brand circle and exclamation-circle as the trailing icons. The consumer passes them as `trailing` (and `icon` for `mini-group`). Reason: same as `Tabs` (no `react-native-svg` dependency, no app icon set in the package). Trade-off: every call site passes the icon, which makes the common case verbose; a follow-up can move shared icons into the package. For `member` and `mini-group` the chevron is likewise a `trailing` slot. The design's 16px and 24px icon sizes are documented in the story, not enforced.

4. **Row shell, not per-variant styles files.** A `variantStyles` map holds, per variant, `paddingLeft`, `paddingRight`, `paddingVertical`, `gap`, `borderColor` and `minHeight`, taken from the design values listed in the spec. Content is rendered by small internal components (`Avatar`, `LabelValue`, `NewBadge`) in the same file. Alternative: one file per variant; rejected as too much for roughly 200 lines.

5. **Layout is flex, not the fixed 362px.** The row is `flexDirection: 'row'`, `alignItems: 'center'`, `alignSelf: 'stretch'`; the text block is `flex: 1, minWidth: 0` so `numberOfLines={1}` truncates and trailing slots keep their size (`flexShrink: 0`). Figma's `mb-[-2px]` offsets inside the label stack are an auto-layout artifact (line heights vs. text frames) and are not reproduced; the title block uses the stated line heights.

6. **Pressable only with `onPress`.** When `onPress` is set the row renders as a `Pressable` with `accessibilityRole="button"` and an `accessibilityLabel` composed from the visible strings (e.g. `${label}, ${value}`); otherwise a plain `View`. No pressed or hover fill is drawn because the design defines none; press feedback is a follow-up if design adds it.

7. **Tokens as local named constants** (colors `stroke/gray/light #E2E8F0`, `stroke/gray/soft #F1F5F9`, `text/default/title #0F172A`, `text/default/body #1E293B`, `text/default/subtle #475569`, `text/default/placeholder #64748B`, `text/error/solid #B91C1C`, `surface/gray/light #F1F5F9`, `surface/brand/light #DFECEE`, `surface/brand/main #4F868E`, `surface/error/solid #B91C1C`), like `Tabs.tsx`. Letter spacing from the design (0.08px at 16px, 0.07px at 14px, 0.06px at 12px, 0.05px at 10px) is applied as in `Tabs`.

8. **Stories and tests.** `CellInfo.stories.tsx` follows `Tabs.stories.tsx`: a `meta` with a variant control, one story per variant, plus `WithNewBadge`, `LongText`, `Pressable` and an `AllVariants` list that reproduces the Figma frame so it can be compared side by side. Placeholder trailing glyphs are drawn with `View`/`Text` in the story file, like the `Tabs` icons. `CellInfo.test.tsx` follows `Tabs.test.tsx` and covers rendered strings per variant, no placeholder copy, the badge, button role only with `onPress`, and the press call.

## Risks / Trade-offs

- [Public Sans Regular/Medium/Bold may not be loaded by app-tellipod, falling back to the system font] → Check the app's font loading in the first task and, if a weight is missing, add it in the app's font loader as part of this change or flag it before implementing.
- [Slot-only icons make call sites repetitive] → Accepted; revisit when a shared icon set exists in the package.
- [Union props make wrappers that forward props more awkward] → Acceptable; consumers normally render one variant per call site.
- [Figma `mb-[-2px]` offsets dropped, so heights may differ by up to 2px from the design] → Verify row heights against the screenshot in the story and adjust with explicit `minHeight` if needed.
- [`member` 72px height conflicts with content growth for long text] → Use `minHeight` and truncate to one line so height stays 72px in practice.

## Open Questions

- Whether the trailing pencil in `info` should become a default once icons live in `@mee/ui`; does not affect the current API because `trailing` stays optional.
