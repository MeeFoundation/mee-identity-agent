## Context

app-tellipod currently has `app`, `features`, `shared` and `widgets` folders, plain Jotai state (`userNameAtom`, an MMKV-backed `onboardedAtom`), no data-fetching library and no API client. Pod screens are placeholders. The Figma flows (Home "Recent pods", All pods list) render the same pod rows in two lists with different ordering and size. There is no backend, so the request contract is defined here. See proposal.md for motivation and scope.

Layout convention for this change: a vertical slice under `features/pods` that owns its model, API and store behind one public `index.ts`. `@mee/ui` stays domain-agnostic and is untouched.

```
features/pods/
  model/   pod-summary.ts, pod-list.ts (PodListState = ListState<PodSummary>)
  api/     pods-api.ts (interface, request/response, API params), mock-pods-api.ts
  store/   pods-store.ts (atoms, list params), use-pod-list.ts (hook)
  index.ts
```

## Goals / Non-Goals

**Goals:**
- A list state per fetch params, so Home's preview and the All pods list never share or overwrite each other, and so new params (sort, search, filter, others) need no store changes.
- Pagination logic that is testable without UI or a real API.
- A request contract a real backend can implement as is.

**Non-Goals:**
- Row, list and screen UI; `@mee/ui` primitives; categories cards and counts; the "New info shared with you" feed.
- Persisting lists across app restarts.
- Server-driven invalidation (push of new activity).

## Decisions

**Lists are an atom family over params, not per screen.** Each distinct set of fetch params has its own list atom, created by `atomFamily` from `jotai-family` with `isEqual` from `lodash-es` passed directly as the comparator. `sort` is a required param with no default, so the params a caller passes are exactly what is compared and what reaches the API. `isEqual` treats `{ a: undefined }` and `{}` as different, so callers omit absent optional params instead of passing `undefined`. Cursor and page size are not part of the params. Alternatives: one global query atom that all screens write (rejected: Home's two-item preview would overwrite the All pods list, and a late response could land in the wrong query); a record keyed by a hand-made serialization of the params (works with no dependencies, but re-implements what the family already does). `atomFamily` in `jotai/utils` is deprecated and slated for removal in v3, hence `jotai-family`.

**Two param types, each next to the code it describes.** `PodsApiParams` lives in `api/pods-api.ts` beside `fetchPods` and describes what the backend accepts; `PodListParams` lives in `store/pods-store.ts` beside the atom family and describes what identifies a list. The shape of the real API is not known, so the store converts list params to API params in one function (`toApiParams`, which also omits absent optional fields), and a backend change touches only that function and the API type. Today the two have the same fields.

**List state is generic and lives in `shared/list`.** `ListState<T>` (pages, cursor, status, error, failed action), the status and action types, the busy check and the de-duplicating flatten (items need a string `id`) are not pod-specific, because other list responses will follow. The pods slice aliases `PodListState = ListState<PodSummary>`. The load, load-more and refresh atoms stay in the pods store for now; they can be generalized when a second list needs them.

**State shape per list:** pages as an array of arrays, next cursor (never fetched / more / end), status, error. Flattening and de-duplication by id are derived, not stored. Alternative: a single flat array. Rejected: the page boundary is needed to replace pages on refresh and to keep the cursor consistent with the pages.

**Responses are written to the list atom captured at request start.** An action takes the list atom from the family when the request starts and writes the result to that atom, so a late response cannot touch another list. Removing a list drops its atom from the family but the in-flight request keeps writing to the detached one, so the removed list is not revived and a list reloaded after removal is a new atom that the old response never reaches. Concurrent requests for one list are prevented by the status guard (loading, loading more and refreshing ignore further loads).

**Opaque cursor with a null end marker.** Chosen over offset/page because the list reorders as activity happens, and offsets skip or repeat rows. The mock encodes an offset inside the cursor but nothing outside it reads it. Alternative: offset plus total. Kept as a documented fallback only if the real backend cannot return cursors.

**Refresh replaces, and keeps old data visible.** Refresh fetches page one and swaps all pages at once, so stale deeper pages are not kept; the old pods stay readable while it runs and after a failure.

**Failed requests do not advance the cursor.** Retrying load more asks for the same page. A failed first load or refresh retains whatever pages existed.

**API is injected through an atom.** The default value is the mock; tests set a fake through a Jotai store, and the real client replaces the default later. Alternative: module-level singleton or module mocking. Rejected: tests would need module mocks and the swap would touch the store code.

**Hook as the UI boundary.** `usePodList(params, limit)` returns pods, status, loadMore, refresh and retry. Screens spread it into presentational components; presentational components do not receive atoms. Alternative: passing atoms as props. Rejected: it couples components to Jotai and complicates stories and tests, with no benefit since params already select the list.

**Category data as identifiers.** The model carries category ids; labels and icons are resolved in the UI layer through i18n, because user-facing strings must go through `t()`.

**List page size is a call argument.** Home preview and the All pods list can share a cache entry for the same params. If a product need arises for different page sizes to be separate, `limit` can be added to the params without changing the store API.

## Risks / Trade-offs

- [Cached lists stay in memory until removed] → provide `removeList`, and let screens remove short-lived lists (for example search) on unmount; cache everything else.
- [Cached lists go stale after new activity] → refresh action exists; initial approach on server-pushed changes (later) is to invalidate all cached lists and refetch on next view.
- [The mock's cursor or ordering may differ from the real backend] → the contract is only `{ items, nextCursor }` with an opaque cursor; the store never reads cursor contents.
- [A real backend may reject an expired cursor] → not modeled; treat as a refresh when it appears.
- [Unbounded growth of families with free-text search, and a linear equality scan per lookup] → remove search lists on unmount; revisit with an eviction limit if needed.

## Open Questions

- Default sort of the All pods screen (the Figma footer says "Sort: A-Z" but the sample rows are not alphabetical).
- Debounce of search input (belongs to the future screen change).
