## Context

See proposal.md for motivation. The Figma Toast component set (Design System v5.2.4, `529:82882`) has seven types: Primary, Secondary, Tertiary, Dark, Success, Danger and Warning. Its parts toggle on and off (avatar, icon, title, description, close, two actions placed right or bottom). The Tellipod screens use only the title-only form with a close button, full width, near the bottom edge.

`@mee/ui` components are flat files in `packages/ui/src` (`Badge.tsx` with `Badge.stories.tsx` and `Badge.test.tsx`), with per-type hex palettes inline and Public Sans fonts. `Avatar` and `Badge` exist for the avatar slot. Toast's type set is wider than `Badge`'s: it adds `tertiary` and `dark`, and its `secondary` is a white card, so Toast does not reuse Badge's palettes. `app-ux-flows` is a Vite and Tailwind web app that does not consume `@mee/ui`; its `shared/ui/toast.tsx` supports `primary` and `success` only.

## Goals / Non-Goals

**Goals:**
- One `Toast` API in `@mee/ui` that expresses every Figma slot and the Tellipod layouts.
- The web Toast reaches the same types and slots without breaking current flow screens.

**Non-Goals:**
- A host, imperative API, queue, timers or gestures; positioning on screen (the parent decides).
- Sharing code between `@mee/ui` and `app-ux-flows`.

## Decisions

**Presentational component with slot props.** `Toast` takes `type`, `title`, `description`, `icon`, `avatar`, `actions`, `actionsPlacement` (`'right' | 'bottom'`) and `onClose`, plus `closeLabel` for accessibility. Slots are `ReactNode`, matching how `Badge` takes `leadingIcon`. Alternative considered: a compound API (`Toast.Title`, `Toast.Actions`). Rejected because the other `@mee/ui` components use props, and the layout rules (icon-aligned description, action placement) are easier to enforce from one place.

**Actions as data, not nodes.** `actions` is a readonly array of at most two `{ label, onPress }` items, so the component controls type, spacing and button semantics. The array type is `ReadonlyArray`, per the repo conventions. Alternative: arbitrary `ReactNode`; rejected because it would let consumers break the 16px gap and color rules.

**Default icon per type, replaceable.** Figma uses `info-circle` for primary, secondary, tertiary and dark, `check-circle` for success, `exclamation-octagon` for danger and `exclamation-triangle` for warning. Five new icons are added to `icons/` (the four glyphs at 16px, plus the 20px `x`), following the existing pattern with `size` and `color` props. The glyph paths are taken from the Figma icon components, not redrawn. `icon={null}` hides the icon, and any node replaces it.

**Colors inline, per type.** Follow `Badge`: a `Record<ToastType, Palette>` of hex values, no new token system. Every value is read from the Figma component set and listed in the toast spec's type table; icon and close button reuse the title color.

**Layout.** A row with `alignItems: 'stretch'`: avatar, a flex-1 content column, and a trailing column holding right-placed actions and the close button. Bottom-placed actions render in the content column with a left inset equal to the icon width plus gap, so they align with the title text. Close button hit area is padded to 44px using `hitSlop`, keeping the 20px glyph.

**Accessibility.** The root has `accessibilityRole="alert"` with `accessibilityLiveRegion="polite"`; title and description are exposed together. The close button has `accessibilityRole="button"` and the consumer's `closeLabel`. Callers must pass `closeLabel` when `onClose` is set, enforced by a discriminated prop type, so no English string is hardcoded in the package.

**Stories.** `Toast.stories.tsx` follows `Badge.stories.tsx`: `Types`, slot combinations, action placements, long text, no-close, and two Tellipod layout stories using a story-local screen wrapper (pinned bottom, and floating over scrolled `Card` content). Avatar uses the existing `Avatar`.

**Web Toast.** Extend `shared/ui/toast.tsx` in place: widen the variant union to seven types, add optional `icon`, `avatar` and `actions` with `actionsPlacement`, and keep `action` as a one-item shorthand so existing screens are unchanged. Colors come from the theme tokens that match the Figma values; where no token matches a Figma value exactly, check that the tokens exist before choosing the nearest one, and record the mapping in a code comment only if it is not obvious. The default icons come from `react-bootstrap-icons` (`InfoCircle`, `CheckCircle`, `ExclamationOctagon`, `ExclamationTriangle`).

## Risks / Trade-offs

- [Some Figma colors may have no exact theme token on the web side, for example #9AC2C6 or #F6CB53] → Map each to the nearest token and check the result against Figma; add a token only if the gap is visible.
- [Two Toast implementations can drift] → The specs on both sides name the same types and slots, and stories and the web showcase act as a visual cross-check.
- [`accessibilityRole="alert"` can be announced assertively on some platforms] → Use a polite live region and verify on iOS VoiceOver and Android TalkBack during manual review.
- [No host means each screen positions its own toast] → Accepted for this change; a follow-up can add a host once usage patterns are clear.
