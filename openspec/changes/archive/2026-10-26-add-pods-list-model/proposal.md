## Why

The Home ("Recent pods") and All pods screens in the Tellipod designs render lists of pods, but app-tellipod has no pod data layer: no pod summary type, no API client, and no list state. There is no backend yet, so the list contract has to be defined on the client side first. It must support cursor pagination and later params (sort, search, filter) without reworking the store.

## What Changes

- Add a `pods` vertical slice to app-tellipod, owning the whole pods capability and exposing a single public `index.ts`.
- Add a `PodSummary` UI model with only the fields the pod rows render: id, name, avatar URL, category and optional subcategory references, unread flag.
- Add a `PodsApi` interface for cursor-paginated pod list requests, plus an in-memory mock implementation (no real API exists yet).
- Add a Jotai store that keeps one list state per distinct fetch params (an atom family compared with deep equality), with first-page load, load-more, refresh and removal of a list. The API is injected through an atom so tests and the future real client can replace it.
- Add a `usePodList` hook that binds fetch params to their list state and actions, as the boundary UI will consume.
- Out of scope: pod row and list UI, `@mee/ui` primitives (`CardCell`, `Avatar`), the category cards and counts, the "New info shared with you" feed, a real backend, search debounce.

## Capabilities

### New Capabilities
- `app-tellipod/pods`: pod summary model, cursor-paginated list API contract, and params-keyed list state (load first, load more, refresh).

### Modified Capabilities

None.

## Impact

- New code under `apps/app-tellipod/src/features/pods/` (`model/`, `api/`, `store/`, hook, tests); no changes to existing screens or to `@mee/ui`.
- Adds i18n keys only if later UI needs them; none in this change.
- New dependencies in `app-tellipod`: `jotai-family` (the maintained home of `atomFamily`, deprecated in `jotai/utils`) and `lodash-es` with `@types/lodash-es` (deep equality of params). `lodash-es` is ESM-only, so the app's Jest `transformIgnorePatterns` gains it.
- Follow-ups, each a separate change: `@mee/ui` generic `CardCell` and `Avatar` primitives, then the pod row, list, All pods screen and Home "Recent pods" in the app.
