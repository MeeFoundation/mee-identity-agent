## Why

app-tellipod's Home now shows the user's pods as a "Recent Pods" section with a loading skeleton, an error state with retry, pod cards, and a "Create your first Pod" empty card. `app-ux-flows` still shows pods with a hand-rolled "Pods" label and a single row (`GingerHomeView`), has no loading or error state, and shows the empty card only inside the "Create Ginger" scenario, in an older look. Reviewers cannot see or discuss the current Home pod list states from the showcases.

## What Changes

- Add a shared `PodsSection` component to the `app-ux-flows` design system that follows app-tellipod's pods section: "Recent Pods" header with a "See all pods" link, pod cards (avatar, category breadcrumb with icon, chevron, unread dot), a pulsing loading skeleton, an error message with retry, and the first-run "Create your first Pod" card.
- Add a new showcase `SC-POD-001` "Pods on Home" with one Home screen and four manually chosen cases, one per pod list state: with pods, loading, first run with no pods, and failed to load. The reviewer starts the state they want from the home page; nothing is assigned automatically.
- Use `PodsSection` in `GingerHomeView`, so EXP-PET-003, EXP-PET-004 and EXP-PET-005 show their Ginger pod as a tellipod pod card under "Recent Pods". **Visible change to three experiments**: the section label "Pods" becomes "Recent Pods" and the row follows the pod card design.
- Leave the `sc-pet-001` Home card unchanged; it belongs to that scenario's tested flow.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-pod-001`: the "Pods on Home" showcase, its screens and states.

### Modified Capabilities
- `app-ux-flows/design-system`: adds the pods section component and its pod card, skeleton and empty card parts.
- `app-ux-flows/experiments/exp-pet-003`: Home shows Ginger in the "Recent Pods" section.
- `app-ux-flows/experiments/exp-pet-004`: Home shows Ginger in the "Recent Pods" section.
- `app-ux-flows/experiments/exp-pet-005`: Home shows Ginger in the "Recent Pods" section, and variant C's Today section sits above it.

## Impact

- `apps/app-ux-flows/src/shared/ui/`: new pods section component, registered in `pod-components.ts`.
- `apps/app-ux-flows/src/slices/flow/flows/sc-pod-001/`: new flow, registered in `registry.ts`.
- `apps/app-ux-flows/src/slices/flow/pods/ginger/components/ginger-home-view.tsx`: adopts the shared component.
- `apps/app-ux-flows/src/app/locales/en.ts`: new strings.
- No change to app-tellipod or `@mee/ui`; the pods feature there is the reference only.
- No new dependencies, no data fetching, no analytics for the showcase.
