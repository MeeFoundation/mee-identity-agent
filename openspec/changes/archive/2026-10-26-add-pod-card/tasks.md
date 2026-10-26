## 1. Avatar in @mee/ui

- [x] 1.1 Read the remaining Avatar variants from Figma node `28:1476` (initials text size and line height for XL, L, S, XS, XXS; rounded-square radius per size) and note the values in the test file's table; verify every size in the `avatar` spec has a recorded value
- [x] 1.2 Add `packages/ui/src/Avatar.tsx` with image and initials content, six sizes, circle and rounded-square shapes, and brand and gray tones, and export it from `packages/ui/src/index.ts`; verify `pnpm --filter @mee/ui check-types` passes
- [x] 1.3 Add `packages/ui/src/Avatar.test.tsx` covering the scenarios of the `avatar` spec (image fill, initials, size L = 48, default M = 40, circle vs rounded square, brand and gray colours, hidden without label, labelled with label); verify the tests pass
- [x] 1.4 Add `packages/ui/src/Avatar.stories.tsx` showing sizes, shapes, tones and image content; verify the story renders in Storybook after the story index is regenerated

## 2. Breadcrumbs in @mee/ui

- [x] 2.1 Add `packages/ui/src/Breadcrumbs.tsx` (items with label, optional icon node and `current`; 10-point chevron delimiter tinted with the item colour; none after the last item; single-line truncation; chevrons hidden from assistive technology) and export it from `packages/ui/src/index.ts`; verify `pnpm --filter @mee/ui check-types` passes
- [x] 2.2 Add `packages/ui/src/Breadcrumbs.test.tsx` covering the scenarios of the `breadcrumbs` spec (two items, single item, no items, default and current colours, leading icon slot, reading order); verify the tests pass
- [x] 2.3 Add `packages/ui/src/Breadcrumbs.stories.tsx` showing one, two and many items, with and without icons, and a narrow container; verify the story renders in Storybook

## 3. App-tellipod building blocks

- [x] 3.1 Download the `icon / outline / hearts` SVG from the Figma asset of node `48:8418` (instance `I48:8418;520:48043;5:49008;2761:50068`) into the scratchpad, and add `HeartsIcon` in `apps/app-tellipod/src/shared/ui/icons/hearts.tsx` following the pattern of `people.tsx`; verify the path matches the downloaded SVG and the icon is exported from `icons/index.ts`
- [x] 3.2 Add `HeartsIcon` to `icons.test.tsx` (default size and colour) and `icons.stories.tsx`; verify `pnpm --filter app-tellipod test` for the icons file passes
- [x] 3.3 Add the `pod.categories` keys (`people`, `health-wellness`, `pets`, `immediate-family`) and a `pod.card.unread` label to `apps/app-tellipod/src/shared/i18n/en.ts`, leaving `pod.breadcrumb.*` as is; verify type checking passes

## 4. PodCard

- [x] 4.1 Add the category presentation module in `features/pods/ui` (id to icon map: `people` to `PeopleIcon`, `pets` to `HeartsIcon`; label lookup under `pod.categories.<id>` with the raw id as the default) and verify its unit test covers a mapped category, a category with no icon, and an id with no label
- [x] 4.2 Add `features/pods/ui/PodCard.tsx` composing `Avatar` (48-point photo, or 40-point gray initial of the name's first character uppercased), the name, `Breadcrumbs` with all items in the brand colour, the 16-point trailing `ChevronRightIcon`, the row surface (white, radius 16, first-level shadow, paddings 10/10/10/16, gap 10) and the unread dot (12 points, `#B91C1C`, 2-point white border, 10 points from top and left); verify `pnpm check-types` passes
- [x] 4.3 Add `features/pods/ui/PodCard.test.tsx` covering the scenarios of the `pod-card` spec (subcategory and category-only pods, long name truncation, photo vs initials with 68 and 60 point heights, unread dot shown and hidden, press reports the pod, accessibility label with and without unread); verify the tests pass
- [x] 4.4 Add `features/pods/ui/PodCard.stories.tsx` with the three rows of the Figma design (About Sofia unread with photo, Mom & Dad with photo, Maya with initials) and a long-name case; verify the story index is regenerated and the stories render
- [x] 4.5 Export `PodCard` from `features/pods/index.ts`; verify it is importable from `@/features/pods`

- [x] 4.6 Add pressed feedback to `PodCard` (background `#F1F5F9` while held, white otherwise) as added to the `pod-card` spec; verify the `pod-card` test that holds a press passes

## 5. Final checks

- [x] 5.1 Compare the three story rows against the Figma screenshot of node `13:13435` (heights 68/68/60, dot position, breadcrumb colours, chevron) and fix any in-scope difference; verify by side-by-side inspection in Storybook
- [x] 5.2 Run `pnpm check-types` and `pnpm lint` from the repo root and the package test suites for `@mee/ui` and `app-tellipod`; verify all pass with no `any`, `console.log` or TODO left in the new code
