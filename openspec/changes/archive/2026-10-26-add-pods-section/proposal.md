## Why

The Tellipod home screen is still a placeholder, while the design (Figma "Home - 3" and "Home - 1") shows a "Recent Pods" block for users with pods and a "Create your first Pod" card for users without. The pod card and pod list already exist, but nothing assembles them into the home-screen section with its header, "See all pods" link and first-run empty state.

## What Changes

- Add a `PodsSection` component to the pods feature that renders the home-screen pods block as one unit, with a story file next to it.
- When the user has pods (or the list is loading or failed), show a "RECENT PODS" header row with a "See all pods" link, followed by the existing pod list limited to a few rows.
- When the list has loaded and holds no pods, show no header and instead show a "Create your first Pod" card: icon, title, explanatory text, a primary "Add Pod" button and a "Maybe later" text button.
- Make the section presentational about the card's actions: it reports "Add Pod", "Maybe later", "See all pods" and pod presses through callbacks; it does not persist the "Maybe later" dismissal or navigate by itself. The "See all pods" and "Add Pod" callbacks are optional, and the link or button is hidden when its callback is absent, because the app has no destination screens for them yet.
- Show the section on the Home screen in place of the placeholder: pod presses open the existing Pod info route, and "Maybe later" hides the card for the rest of the session.
- Let the pod list's empty state be supplied by the caller so the section can replace the plain "No pods yet" text with the card, without changing the default for other pod list users.
- Add the section header row, the arrow-right, plus and cookie icons the design needs where app-tellipod does not yet have them.
- Add the localized strings for the header, link and card.
- Out of scope: the "New info shared with you" row, the Categories grid, persisting the dismissal across launches, and the add-pod and see-all-pods screens.

## Capabilities

### New Capabilities
- `app-tellipod/pods-section`: the home-screen pods section, covering the header row, the recent pods list, the first-run empty card and its callbacks.

### Modified Capabilities
- `app-tellipod/pod-list`: the empty state may be replaced by caller-provided content; the default localized empty message stays the default.
- `app-tellipod/app-shell`: Home no longer shows only its name; it shows the pods section, with its scrolling, pod navigation and session-long "Maybe later" behavior.

## Impact

- `apps/app-tellipod/src/features/pods/ui/`: new `PodsSection.tsx` and `PodsSection.stories.tsx`, new tests, and a small change to `PodListView` and `PodList` for the empty slot.
- `apps/app-tellipod/src/shared/ui/icons/`: new arrow-right, plus and cookie icons, registered in the icons index and icons story.
- `apps/app-tellipod/src/shared/i18n/en.ts`: new `pod.section` strings.
- `apps/app-tellipod/src/features/pods/index.ts`: exports `PodsSection`.
- `apps/app-tellipod/src/app/(tabs)/index.tsx`: the Home screen renders the section instead of the placeholder and the "Pod info" dev link.
- No new dependencies: `expo-linear-gradient` is already installed in app-tellipod. No changes to `@mee/ui` and no API or data-model changes.
