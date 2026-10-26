## Context

See proposal.md for motivation. The reference is app-tellipod's pods feature (`PodsSectionView`, `PodListView`, `PodCard`, `PodCardSkeletonList`, `EmptyPodsCard`). `app-ux-flows` is a Vite web SPA styled with Tailwind, so nothing from the React Native app can be imported; the section is rebuilt on the web with the same states and measurements.

Today `GingerHomeView` (`slices/flow/pods/ginger/components/`) renders the Home pods block for EXP-PET-003/004/005 by hand. Shared presentational components live in `shared/ui` and reach flows through the component registry (`pod-components.ts`, read with `useFlowComponents`). Flows are deterministic prototypes: no screen fetches data, and timed behavior has precedent (`use-suggestion-timer`, `use-analysis-timer`).

## Goals / Non-Goals

**Goals:**
- One presentational pods section in `shared/ui` that renders `loading`, `ready` (with pods), `ready` with none, and `error` like app-tellipod.
- A showcase where each state is started by hand from the home page and is also reachable by URL.
- `GingerHomeView` uses the shared section, so there is a single Home pod list in the app.

**Non-Goals:**
- No fetching, pagination, "See all" screen or real navigation to a pod.
- No change to the `sc-pet-001` Home card or its flow.
- No change to app-tellipod or `@mee/ui`.
- No error or loading states in the experiments; they only use the `ready` state with one pod.

## Decisions

**States are manually chosen cases on one screen.** Each state is a case (`a` with pods, `b` loading, `c` first run, `d` failed) that sets the starting state of the pod list, and the flow has a single `home` screen. The home page offers one start action per case (`flow-runtime`), so a reviewer picks the state by hand, in production too, and nothing is random or assigned. Cases differ only in starting data, which is what they are for. Alternative: one screen per state. Rejected: only the first screen is reachable from the production home page, and the other states would need a URL or the dev-only catalogue.

**Loading is static.** The loading case stays in loading until the reviewer leaves; it does not resolve into `home` on a timer. The state is held in the run's store, so Retry can show loading and a restart restores the case. A timer would make the state impossible to inspect or screenshot and would race the reviewer. The pulse itself is a CSS animation disabled under `prefers-reduced-motion`. Alternative: timed loading to pods. Rejected for the reasons above; it can be added later as its own case if a reviewer wants to see the transition.

**The section is a controlled, presentational component.** `PodsSection` takes `status`, `pods`, `limit` and handlers, in line with app-tellipod's `PodsSectionView`, which is likewise separated from the store-bound `PodsSection`. It is registered in `podComponents` so flows can swap it, like other building blocks. Its parts (pod card, skeleton, empty card) stay private files next to it unless a second consumer appears.

**Pod data shape mirrors app-tellipod's `PodSummary`.** `{ id, name, avatarUrl | null, category, subcategory | null, hasUnread }`. A category is given as a label and an optional icon, because the catalog in `pods/catalog/categories.ts` mirrors only the Pets branch of the ontology and People or Health categories are not invented for a presentational component; the Ginger mapping takes the Pets icon from `pods/category-icons.ts`. The showcase's sample pods carry their own labels and icons. Ginger's current `Pod` record (`avatarSrc`, `breadcrumb`) is mapped to this shape in `GingerHomeView`, so the experiments' state model is untouched.

**Experiments pass no "See all pods" handler.** The section then shows no link, so the experiments gain no new control that would need recording or an inert behavior and their analytics stay as they are. The pod card replaces the old row as the `pod_opened` trigger.

**The showcase joins a "Pods" family group on the home page.** The home page groups every flow that has a code family, as it already does for the single `SC-ATT-001`, so `SC-POD` gets the group title "Pods" (`flow-families.ts`). The `flow-runtime` spec's wording that a lone flow stays a plain row is out of date with the code and is left alone here.

## Risks / Trade-offs

- [EXP-PET-003/004/005 change appearance mid-research: "Pods" becomes "Recent Pods", row becomes a card] → The change is spec'd per experiment; Ginger's name, avatar, breadcrumb and behavior are the same, and no experiment records the label. If an experiment has live sessions, hold the `GingerHomeView` task until it ends. This is the one part of the change that can be dropped without affecting the showcase.
- [Web re-implementation drifts from app-tellipod] → The spec records measurements and states; the showcase is the place to compare against the app when tellipod changes.
- [Category icon is optional] → A category without an icon shows its label alone rather than failing.

## Open Questions

- Does the unread dot need to appear in the experiments' Ginger card? Ginger has no unread state today, so it is simply never shown there.
