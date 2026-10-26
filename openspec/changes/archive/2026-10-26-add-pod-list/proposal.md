## Why

The pods data layer (`usePodList`, cursor pages, per-params list state) and the `PodCard` row both exist in app-tellipod, but nothing renders a list of pods: the home tab is still a placeholder. A preview of the user's pods (for example the first three, with no scrolling and no fetch-more) needs a component that takes the fetch params, loads the list, and shows pending, error and empty states instead of leaving every screen to rebuild them.

## What Changes

- Add a **PodList** component to app-tellipod's pods feature. It receives the fetch params, a `limit` and a press handler, loads the matching list through the existing store, and renders up to `limit` `PodCard` rows in a plain vertical stack.
- Show a pending state of `limit` pulsing skeleton rows while the first page loads, an error state with a retry action when the first load fails, and an empty state when the list loaded with no pods. When pods are already shown and a refresh fails, keep the cards and show an inline retry.
- Split the component into a container that reads the store and a presentational view that takes plain props, so tests and stories need no Jotai store.
- Expose whether a list has loaded at least once from `usePodList`, so the view can tell "not loaded yet" from "loaded and empty".
- Add a `PodCardSkeleton` placeholder row for the pending state.
- Add the list strings (pending label, error message, retry, empty message) to the i18n resources.
- Add stories and tests for the component.

Out of scope: a scrolling list screen (`FlatList` with pull-to-refresh and fetch-more on reaching the end), wiring `PodList` into the home tab, a generic skeleton component in `@mee/ui`, and changing how lists are keyed in the store.

## Capabilities

### New Capabilities
- `app-tellipod/pod-list`: the pod list component: fetch params and limit in, up to `limit` pod rows out, with pending, error, empty and retry behavior.

### Modified Capabilities
<!-- None: the pods data layer already provides loading, refresh and retry; the hook gains a read-only flag, which is not a spec-level change. -->

## Impact

- `apps/app-tellipod/src/features/pods/ui`: new `PodList` container and `PodListView` with stories and tests; `PodList` exported from the feature's `index.ts`.
- `apps/app-tellipod/src/features/pods/store/use-pod-list.ts`: returns an additional `hasLoaded` flag.
- `apps/app-tellipod/src/shared/i18n/en.ts`: new `pod.list` keys.
- No new dependencies, no API or model changes, no `@mee/ui` changes.
