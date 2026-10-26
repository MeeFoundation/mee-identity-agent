## 1. Hook and strings

- [x] 1.1 Return `hasLoaded` (`list.pages.length > 0`) from `usePodList` in `features/pods/store/use-pod-list.ts`; verify `use-pod-list.test.tsx` has a case that it is false before the first response and true after a response with no pods
- [x] 1.2 Add the `pod.list` keys (`loading`, `error`, `retry`, `empty`) to `apps/app-tellipod/src/shared/i18n/en.ts`; verify `pnpm check-types` passes

## 2. PodCardSkeleton

- [x] 2.1 Add `withRepeat` to the `react-native-reanimated` mock in `apps/app-tellipod/jest.setup.ts`; verify existing tests still pass
- [x] 2.2 Add `features/pods/ui/PodCardSkeleton.tsx`: a row with the `PodCard` surface, a 40-point gray circle and two gray bars, hidden from assistive technology, exported for use by the list view; verify `pnpm check-types` passes
- [x] 2.3 Add `features/pods/ui/PodCardSkeletonList.tsx`: `count` skeleton rows in a stack under one pulsing opacity (`withRepeat`, `ReduceMotion.System`), with the localized loading label and busy state on the wrapper and the rows hidden; verify `pnpm check-types` passes
- [x] 2.4 Add `features/pods/ui/PodCardSkeletonList.test.tsx` covering the count of rows, the single accessible loading label with the busy state, and the hidden rows; verify the tests pass

## 3. PodListView

- [x] 3.1 Add `features/pods/ui/PodListView.tsx` taking `pods`, `hasLoaded`, `status`, `limit`, `onPodPress`, `onRetry` and `testID`, rendering up to `limit` `PodCard` rows in a stack, the pending state (`limit` `PodCardSkeleton` rows under a wrapper with the loading label), the error state with a retry `Button`, the empty message, and the inline error below rows; verify `pnpm check-types` passes
- [x] 3.2 Add `features/pods/ui/PodListView.test.tsx` covering the scenarios of the `pod-list` spec for limit (more and fewer pods than the limit), pending (limit placeholder rows while loading, before load, refresh with pods shown), error (first load, failure with pods shown, retry press) and empty; verify the tests pass
- [x] 3.3 Add `features/pods/ui/PodListView.stories.tsx` with pending, rows, rows over the limit, error, inline error and empty; verify the story index is regenerated with `pnpm --filter app-tellipod storybook:generate` and the stories render

## 4. PodList container

- [x] 4.1 Add `features/pods/ui/PodList.tsx` taking `params`, `limit`, `onPodPress` and `testID`, calling `usePodList(params, limit)` and rendering `PodListView`; export it from `features/pods/index.ts`; verify it is importable from `@/features/pods`
- [x] 4.2 Add `features/pods/ui/PodList.test.tsx` with a store holding a fake `PodsApi`, covering load on first show with the given limit, no request for already loaded params, no second-page request with more pods than the limit, retry after a failed first load, and the press handler receiving the pod; verify the tests pass

## 5. Final checks

- [x] 5.1 Run `pnpm check-types` and `pnpm lint` from the repo root and the `app-tellipod` test suite; verify all pass with no `any`, `console.log` or TODO in the new code
