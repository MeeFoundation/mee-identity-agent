## 1. Model

- [x] 1.1 Add `features/pods/model` with `PodSummary` (id, name, avatar URL or null, category ref, optional subcategory ref, unread flag) and verify `pnpm check-types` passes
- [x] 1.2 Add list params type in the store (required sort `last_activity` | `name_asc` with no default, optional search text and category id) and API params type beside `fetchPods`, with the store mapping list params to API params; verify `pnpm check-types` passes; params equality is covered by the store tests in 3.6

## 2. API

- [x] 2.1 Add `PodsApi` interface with request (optional cursor, limit, params) and response (`items`, `nextCursor` with null as end) and verify `pnpm check-types` passes
- [x] 2.2 Add in-memory mock implementation with a fixture dataset, simulated latency, opaque cursor, `last_activity` and `name_asc` ordering, and null cursor at the end; verify a unit test pages through the whole dataset in both orders without gaps or repeats, and returns an empty page with null cursor for a filter with no matches

## 3. Store

- [x] 3.1 Add the injectable API atom defaulting to the mock and the per-params list state as an atom family from `jotai-family` (pages, cursor, status, error), adding `jotai-family`, `lodash-es` and `@types/lodash-es` and letting Jest transform `lodash-es`; verify a test that a fake API set on a Jotai store is the one called
- [x] 3.2 Add load-first action with already-loaded and in-progress guards; verify tests for initial load, no request when already loaded, one request on repeated calls, and error then retry
- [x] 3.3 Add load-more action with end-of-list, empty-list and in-progress guards, and the flattened de-duplicated pods derived value; verify tests for appending, repeated trigger making one request, no request at null cursor, failure keeping pages and cursor and retrying the same page, and a pod repeated across pages appearing once
- [x] 3.4 Add refresh action replacing all pages with the first page while keeping old pods readable, and keeping them on failure; verify tests for both outcomes
- [x] 3.5 Add remove-list action; verify a test that a removed list requests its first page again and other lists are unchanged
- [x] 3.6 Verify with a test that two sets of params hold independent state, params that differ only in key order share one list, switching back needs no request, and a response delayed past a params switch lands only in its own list

## 4. Hook and public surface

- [x] 4.1 Add `usePodList(params, limit)` returning pods, status, loadMore, refresh and retry; verify with a hook test against a fake API that it reflects state and triggers the store actions for its params
- [x] 4.2 Export the public surface (types, params helpers, hook, API atom for replacement) from `features/pods/index.ts` only and verify nothing else is imported from outside the slice

## 5. Quality gates

- [x] 5.1 Run `pnpm check-types`, `pnpm lint` and `pnpm --filter app-tellipod test` and verify all pass with no `any`, `console.log` or TODO code in the slice
