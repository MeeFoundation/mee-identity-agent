## Context

See proposal.md for motivation and scope; the requirements are in `specs/`.

Current state that shapes the approach:

- `features/pods` in app-tellipod holds `model`, `api` and `store` slices. `PodSummary` already carries every field the row shows (`name`, `avatarUrl`, `category`, `subcategory`, `hasUnread`) with categories as ids, not labels. The mock data uses the ids `people`, `health-wellness`, `pets` and the subcategory `immediate-family`.
- `@mee/ui` has `Badge`, `Card`, `CellInfo` and its own icons, but no Avatar or Breadcrumbs. `CellInfo`'s `member` variant draws an inline initials circle; `PodHeader` in app-tellipod draws its own photo-or-initial avatar and an icon-and-labels breadcrumb inline.
- app-tellipod keeps its own icon set (`shared/ui/icons`, including a 10px `ChevronRightIcon` and a `PeopleIcon`) and tokens (`shared/ui/tokens.ts`). `@mee/ui` components hardcode their design-token values and take icons as `ReactNode` props.
- The row's Figma node places the unread dot on the row itself (10px from the top and left), not inside the design system's Avatar, whose Badge Top is a 16px count pill at the top right.
- The row design uses gray initials (`#F1F5F9` / `#64748B`) where the design system's Avatar defaults to the brand tint (`#DFECEE` / `#4F868E`).

## Goals / Non-Goals

**Goals:**
- Build Avatar and Breadcrumbs as general `@mee/ui` components that match the design system, so the pod row and later screens share them.
- Keep `PodCard` a thin composition of those parts plus the row-specific pieces (dot, chevron, surface, category presentation).

**Non-Goals:**
- Migrating `PodHeader` or `CellInfo` to the new components.
- Wiring the card into a screen or list.
- Hover, focus or underline states of Breadcrumbs; they have no meaning on a touch row whose whole surface is pressable.

## Decisions

**Avatar and Breadcrumbs live in `@mee/ui`; `PodCard` lives in `features/pods/ui`.** Avatar and Breadcrumbs know nothing about pods and the design system defines them generically. `PodCard` depends on `PodSummary` and on app-tellipod i18n and icons, so it cannot live in the shared package. Alternative considered: put `PodCard` in `@mee/ui` with a generic props shape (name, avatar, breadcrumb items). Rejected because it would carry app-specific details (the 60/68 height rule, the dot position) into a package other apps consume.

**Avatar API.** A discriminated union on content: image (`source`) or initials (`initials`), plus `size` (XL to XXS, default M), `shape` (circle by default, or rounded square) and `tone` (brand by default, or gray; initials only). Image content uses React Native's `Image`, as `PodHeader` does, so no new dependency is needed. Alternative considered: Avatar derives initials from a name. Rejected: initials rules (first letter, two letters, locale) belong to the caller, and the spec says so.

**`tone` on initials instead of following one colour.** The screen design and the design system disagree. The row design is the target for this work and matches `CellInfo`'s member initials, so the pod row passes `gray`; the component keeps the design-system default `brand`. This is the assumption recorded in place of an explicit answer; if the design system is meant to win, `PodCard` drops the prop and nothing else changes.

**Breadcrumbs API.** `items: { label, icon?, current? }[]`. The icon is a `ReactNode`, matching how `CellInfo` takes icons, so the app passes its own `PeopleIcon` or Hearts icon. The delimiter is `@mee/ui`'s `ChevronRightIcon` at size 10, tinted with the item's colour. Items default to the brand colour; `current` switches an item to the gray colour used by the design system for the active crumb. The pod row marks none as current, because the design shows both crumbs in the brand colour. Alternative considered: always colour the last item gray as the design system does. Rejected because it contradicts the row design.

**Unread dot is a plain absolutely positioned `View` in `PodCard`, not `Badge` and not an Avatar badge.** The design draws a 12px box with a 2px white border inside the box, so the red fill is 8px. `Badge shape="dot"` draws a 12px fill with a 1px border in its own colour, so it cannot match without changing `Badge` and its spec. Adding avatar badge slots would build unused API. Alternative considered: a `ring` prop on `Badge`. Deferred until a second consumer needs it.

**Row height comes from the avatar, not a fixed height.** 10 points of vertical padding around the avatar gives 68 with the 48-point photo and 60 with the 40-point initials, with no height constant to keep in sync. The text block (24-point name over 16-point breadcrumb) fits inside both.

**Surface style is duplicated in `PodCard`, not shared.** The first-level shadow (`0 0 0 1px alphaDark5, 0 1px 20px 1px alphaDark5`, radius 16) already exists in `@mee/ui`'s `PanelSurface`, which is not exported. Exporting it would widen the `@mee/ui` public API and touch the panel spec for one string. `alphaDark5` is already in app-tellipod's tokens.

**Category presentation is a small mapping in the feature.** An id-to-icon map (`people` to `PeopleIcon`, `pets` to the new Hearts icon) and localized labels under a new `pod.categories.<id>` key group in `en.ts`, covering the category and subcategory ids in the mock data. The existing `pod.breadcrumb.*` keys used by `PodHeader` stay untouched. Ids with no label fall back to the raw id through the i18n default value, so a data problem is visible instead of blank. `health-wellness` has no designed icon, so it renders label only, as the spec states.

**Pressed feedback is a gray background tint, not a dimming.** The Figma row has no pressed state, and a row that does nothing visible on touch reads as non-interactive. `@mee/ui`'s `Tabs` already fills a pressed tab with `surface/gray/light` #F1F5F9, which app-tellipod's tokens have, so the card does the same: no new token and a consistent feel across list-like surfaces. Alternative considered: `Button`'s 0.8 opacity. Rejected because it also fades the card's shadow and avatar, which looks like a disabled state on a content row. The state is driven by `Pressable`'s `pressed` flag; the test holds a real press with `userEvent` because `fireEvent` does not reach `Pressable`'s internal state.

**Trailing chevron uses `@mee/ui`'s 16-point `ChevronRightIcon`**, not app-tellipod's 10-point one, which exists for breadcrumbs and headers.

**Hearts icon follows the existing icon convention**: a component in `shared/ui/icons` with the SVG path taken from the Figma asset `icon / outline / hearts`, a `size` and `color` prop, exported from the icons index, and added to the icons story and test.

**Initial for the fallback avatar** is the first character (by code point) of the name, uppercased.

## Risks / Trade-offs

- Only the L image and M initials variants of Avatar were inspected in Figma → implementation reads the remaining size variants (initials font size per size, rounded-square radius) from node `28:1476` before coding, and the tests pin the values read.
- The mock data has no avatar URLs, so the photo path is exercised only by stories and tests → the story uses a remote placeholder image and the test uses a fake source; a real photo appears once the API returns URLs.
- Duplicated surface shadow can drift from `PanelSurface` → accepted for now; revisit if a third consumer appears.
- Gray initials contradict the design-system default → isolated to one prop at one call site (see Decisions).

## Open Questions

- Should `PodHeader` later adopt Avatar and Breadcrumbs, and should `pod.breadcrumb.*` merge into `pod.categories.*`? Both are cleanups that do not change these specs.
- Which icon, if any, should `health-wellness` get? No design exists yet.
