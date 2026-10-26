## Context

See proposal.md for motivation and scope; the requirements are in `specs/`.

Current state that shapes the approach:

- `usePodList(params, limit)` already returns `{ error, loadMore, pods, refresh, retry, status }`. It loads on mount, keeps state in `podListAtomFamily`, keyed by `params` with `isEqual`, and picks the right action in `retry()` from `failedAction`. `limit` is the API page size and is not part of the key (the `pods` spec says so).
- The hook flattens pages, so a caller cannot tell "never loaded" (`pages` empty, status `idle` before the effect runs) from "loaded and empty" (`pages` is `[[]]`). Rendering the empty message in the first would flash it on every mount.
- `PodCard` is a self-contained row; `@mee/ui` has `Button` with a `secondary` variant but no spinner or skeleton. React Native's `ActivityIndicator` is available.
- The home tab is a placeholder, and a future pods screen will want a `FlatList` with pull-to-refresh and fetch-more.

## Goals / Non-Goals

**Goals:**
- A list that takes fetch params and a limit and renders pending, error, empty and rows with no extra wiring by the screen.
- Presentation testable and storiable without Jotai.

**Non-Goals:**
- A scrolling, paging list. That is a separate `FlatList`-based consumer of the same hook.
- A skeleton component, and any change to list keys in the store.

## Decisions

**Fetch params as props, not an atom.** `podListAtomFamily(params)` is a plain state atom; loading, retry and refresh are separate action atoms that need `params` and `limit`. An atom prop would not let the component fetch. Params already give atom-style sharing: equal params resolve to the same atom, so a parent that wants pull-to-refresh can call `refreshPodsAtom` with the same `{ params, limit }` and the list updates without a ref or callback. Alternative considered: a self-fetching atom (`atomWithQuery`-style). Rejected because it replaces the existing store design for no gain here.

**Container plus presentational view.** `PodList` calls `usePodList` and renders `PodListView`; `PodListView` takes `{ pods, hasLoaded, status, onPodPress, onRetry }` and decides which state to show. Tests of the state logic and Storybook stories use the view alone, as `PodCard` does; a smaller test of the container, with a store holding a fake `PodsApi`, checks the wiring (load on mount, retry, press). Alternative considered: one component with the hook inside. Rejected because every state would then need a store and a controllable API in stories.

**Plain stack, not `FlatList`.** The preview sits inside a screen that scrolls; a `FlatList` there triggers the nested virtualized list warning and fights the parent for scrolling. The component maps up to `limit` pods to `PodCard` rows in a `View` with a gap. The future full list is a different host (`FlatList`, `RefreshControl`, `onEndReached` calling `loadMore`) reusing the hook and, if worthwhile, the same pending, error and empty parts. Pull-to-refresh and fetch-more are therefore not this component's job.

**`limit` is both the page size and the display cap.** The hook is called with `limit`, so one page of `limit` pods is requested; the view also slices to `limit`. The slice matters because lists are shared by params: if a longer list for the same params was loaded elsewhere, the preview must still show only `limit` rows. The opposite case (the preview loaded first with a small limit, then a full list with equal params skips its first load and starts from that short page) is a property of the store keying and is recorded as a risk, not changed here.

**State derivation in the view.** With `pods` the shown list, in order:
- `pods` empty and `status` is `error`: error with retry.
- `pods` empty and (`status` is `loading` or `refreshing`, or the list has not loaded and is not in error): pending.
- `pods` empty, loaded, `status` `idle`: empty message.
- `pods` present: rows; if `status` is `error`, an inline error and retry below the rows. A refresh in progress shows no extra indicator, as the spec requires.

`hasLoaded` is `list.pages.length > 0`, added to the hook's return value. Alternative considered: a three-valued `status`. Rejected because `ListStatus` is shared by the whole list model.

**Retry is the hook's `retry`.** It already dispatches by `failedAction`, so the view only receives `onRetry`. Failure with pods shown can only come from a refresh here, because the preview never loads more.

**Pending is `limit` skeleton rows**, so the list keeps its height when the cards arrive. `PodCardSkeleton` lives in `features/pods/ui`, not in `@mee/ui`: it mirrors `PodCard`'s surface and paddings, which are app-specific, and no second consumer needs a generic primitive yet. Each row has the same surface as `PodCard`, a 40-point gray circle (the initials avatar, so rows are 60 points; photo rows are 68, a jump of 8 points per row accepted) and two gray bars for the name and breadcrumb. Alternative considered: a spinner (`ActivityIndicator`). Rejected because it gives no height and makes the screen jump on arrival.

**Pulse via reanimated, shared by all rows.** One opacity value, driven by `withRepeat(withTiming(...), -1, true)` with `ReduceMotion.System`, is applied to the whole placeholder stack, so rows pulse in sync and each row does not run its own animation. The app's jest mock of `react-native-reanimated` gains `withRepeat`. Alternative considered: a moving shimmer gradient. Rejected as heavier (needs measuring and `expo-linear-gradient` per row) for the same signal.

**Pending accessibility.** The wrapper carries the localized loading label and `busy` state and is the only accessible element; the placeholders are hidden from assistive technology.

**Error and empty are small text blocks.** Message in the app's body typography and a `Button` (`secondary`, `sm`) for retry, labelled with a new `pod.list.retry` string. The designs have no error or empty treatment for this list, so the styling is minimal and uses existing tokens.

**Strings.** New keys under `pod.list`: `loading`, `error`, `retry`, `empty`.

## Risks / Trade-offs

- Lists are keyed by params, not by limit → a preview loaded with a small limit can be reused by a later full list with equal params, which would then start with a short first page. Mitigation if it appears: give the full list a distinguishing param or add the limit to the key under a change to the `pods` spec.
- The skeleton is sized by assumption (40-point avatar) since the design has none for loading; revisit if a design appears
- No designed error or empty treatment → minimal styling, to be replaced when a design exists; isolated in the view.
- `usePodList` gains a field → additive, existing callers and tests are unaffected.

## Open Questions

- Should the future scrolling list share these state views, or define its own for footers and full-screen states?
