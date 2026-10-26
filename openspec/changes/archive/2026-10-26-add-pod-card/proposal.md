## Why

The Pods list screen in the Tellipod design (Figma `Nav / Type 1 - 1`, node `13:13435`) is built from a pod row ("Card-Cell"): avatar, name, category breadcrumb and a trailing chevron. The pods data layer already produces everything the row shows (`PodSummary`), but app-tellipod has no component that renders it, and the two building blocks the design system defines for it, Avatar and Breadcrumbs, do not exist in `@mee/ui` (`PodHeader` inlines its own avatar and breadcrumb).

## What Changes

- Add an **Avatar** component to `@mee/ui` per the Mee Design System (`28:1476`): image or initials content, sizes XL/L/M/S/XS/XXS, circle or rounded-square shape, and a brand or gray tone for initials.
- Add a **Breadcrumbs** component to `@mee/ui` per the Mee Design System (`5:1063`): Simple style, size S, items of label plus optional leading icon, 10px chevron delimiter, no chevron after the last item.
- Add a **PodCard** row to app-tellipod's pods feature, rendering a `PodSummary`: avatar (photo 48px, or initial 40px when there is no photo), name, category and subcategory breadcrumb, an unread dot at the avatar's top-left, and a trailing chevron. The whole row is pressable.
- Add a Hearts icon to app-tellipod's icons (Pets category) and localized category labels.
- Add Storybook stories and tests for the three new components, following the existing `@mee/ui` and app-tellipod conventions.

Out of scope: the rest of the Pods list screen (filter bar, sort, Add Pod, bottom menu, list wiring), Avatar Icon content and badges, Breadcrumbs Outlined style and sizes M/L, and replacing the inlined avatar and breadcrumb in `PodHeader`.

## Capabilities

### New Capabilities
- `packages/ui/avatar`: Avatar component with image and initials content, six sizes, shape and tone options.
- `packages/ui/breadcrumbs`: Breadcrumbs component, Simple style, size S.
- `app-tellipod/pod-card`: the pod row that renders a `PodSummary`, including category presentation and unread indication.

### Modified Capabilities
<!-- None: the pods data layer already exposes every field the row needs. -->

## Impact

- `packages/ui/src`: new `Avatar.tsx`, `Breadcrumbs.tsx` with stories and tests; exports added to `index.ts`.
- `apps/app-tellipod/src/features/pods`: new `ui/` slice with `PodCard`, exported from the feature's `index.ts`.
- `apps/app-tellipod/src/shared/ui/icons`: new Hearts icon.
- `apps/app-tellipod/src/shared/i18n/en.ts`: category labels and the unread accessibility label.
- No new dependencies, no API or model changes, no changes to `Badge`.
