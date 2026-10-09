## 0. Precondition

- [x] 0.1 Confirm `add-exp-pet-002-medication-entry-point` is archived, so `openspec/specs/app-ux-flows/experiments/exp-pet-002/spec.md` exists. Verify with `openspec validate add-ux-flows-analytics`.

## 1. Analytics core (`src/shared/analytics`)

- [x] 1.1 Add `analytics-event.ts` with `AnalyticsValue`, `AnalyticsProps`, `AnalyticsDimensions`, `VariantSource`, `AnalyticsEvent` and `AnalyticsAdapter` (design D1). Verify with `pnpm --filter app-ux-flows check-types`.
- [x] 1.2 Add `fan-out.ts` (`createAnalytics(adapters)`) with a try/catch per adapter for `record` and `startNewSession`, and a dev-only `console.warn` on the first failure (D2). Add `fan-out.test.ts`: a throwing adapter does not stop the other adapters and does not throw to the caller.
- [x] 1.3 Add `random-id.ts` (`crypto.randomUUID`, falling back to `crypto.getRandomValues`). Add `random-id.test.ts` checking that the format is a UUID and that the fallback path is used when `randomUUID` is missing.
- [x] 1.4 Add `console-adapter.ts` that logs one `console.info('[Flow Analytics]', …)` line per event, with kind, flow, variant, screen, run, source and props (D10). Verify with `pnpm lint`, which must pass `noConsole`.
- [x] 1.5 Add `analytics-provider.tsx` with `AnalyticsProvider` and `useAnalytics()`, defaulting to a noop analytics when there is no provider. Verify with check-types.

## 2. Matomo adapter

- [x] 2.1 Add `matomo-adapter.ts`. `createMatomoAdapter(config, env = window)` initializes `_paq` (`setTrackerUrl`, `setSiteId`, `enableHeartBeatTimer`) and appends the async `matomo.js` script with an ignored `onerror`. It never calls `trackPageView` on init and never enables link tracking (D2, D8).
- [x] 2.2 Map `screen_view` events to `setReferrerUrl` / `setCustomUrl` / `setDocumentTitle` / `trackPageView(title, dims)`, and other events to `trackEvent(category, action, encodedProps?, value?, dims)`. Props are encoded as sorted `k=v;k=v`, and dimensions are passed per call from the configured id map, skipping unset ids (D8). Cover this in `matomo-adapter.test.ts` using a fake `_paq` array: page view call sequence, URL without query, event category, action, name and value, omitted name when there are no props, and an omitted unconfigured dimension.
- [x] 2.3 Implement `startNewSession` (`deleteCookies` plus a one-shot `appendToTrackingUrl('new_visit=1')`, cleared after the next tracking call). Cover it in `matomo-adapter.test.ts`.

## 3. Configuration and wiring

- [x] 3.1 Add `src/vite-env.d.ts` typing `VITE_ANALYTICS_ENABLED`, `VITE_ANALYTICS_DEBUG`, `VITE_MATOMO_URL`, `VITE_MATOMO_SITE_ID` and `VITE_MATOMO_DIMENSION_{FLOW_ID,VARIANT_ID,RUN_ID,SCREEN_ID,VARIANT_SOURCE}`. Add `apps/app-ux-flows/.env.example` documenting each variable with empty values. Verify with check-types.
- [x] 3.2 Add `src/app/analytics.ts`. It parses env into `analyticsConfig`, ignoring invalid integers, and builds the adapter list: Matomo only when enabled with a URL and site id, console when `DEV` or debug is on, and none when disabled (D9). Extract the parsing as a pure `parseAnalyticsConfig(env)` and cover it in `analytics.test.ts`.
- [x] 3.3 Wrap `RouterProvider` in `AnalyticsProvider` in `src/app/app.tsx`. Verify `pnpm ux-flows:dev` starts with no `VITE_*` set and the home page renders.

## 4. Variant source

- [x] 4.1 Change `selectVariant` to return `{ variantId, source }` with `source` set to `url`, `stored`, `assigned`, `default` or `none`. Update `select-variant.test.ts` so each existing case asserts its source.
- [x] 4.2 Update `flow.$screenId.tsx` `beforeLoad` and the loader to carry `variantSource`, and pass it to `FlowRunner`. Verify check-types and that the existing route behavior is unchanged when the flow is opened manually in dev.

## 5. Flow runtime: silent completion and analytics context

- [x] 5.1 Extend `FlowNavigation.complete(options?: { showCompletionView?: boolean })`. In `FlowRunner`, store `completionView` on the run, render `CompletionView` only when it is true, and keep the once-per-run guard for both modes (D5). Verify check-types, and that the completion view still appears for a default `complete()` call (manual dev check).
- [x] 5.2 Add `src/slices/flow/analytics/flow-events.ts` with `FlowEventMap`, `TrackArgs`, `FlowAnalytics<E>` and the `flow_*`/`screen_*` reserved-name exclusion (D6). Add a type-level test (`flow-events.test-d.ts`, or `@ts-expect-error` lines in a `.test.ts`) asserting that an unknown name, a missing prop, a wrong prop value and a reserved name all fail to compile.
- [x] 5.3 Add `analytics` to `FlowRuntime` in `flow-context.ts` and export `useFlowAnalytics<E extends FlowEventMap = never>()`. Verify check-types, and that no hook exposes the variant id.

## 6. Flow Run tracking

- [x] 6.1 Add `run-storage.ts`, a `sessionStorage` record per flow (`ux-flows:analytics-run:<flowId>`) with read, write and remove wrapped in try/catch like `assignment-store.ts` (D3). Cover it in `run-storage.test.ts` with a fake `Storage`, including a throwing storage.
- [x] 6.2 Add `flow-run-tracker.ts`, a pure tracker with an injected sink, clock, id generator, storage, navigation type, entry path and first-mount flag. It implements start versus resume (D3), `flow_started`/`flow_resumed` once per run, `screen_viewed` dedupe and visited set, `flow_completed` once using the persisted status with `duration_seconds` and `visited_screen_count`, `restart()` emitting `flow_restarted` and the next start's `trigger`/`previous_run_id`, interaction `track` with context enrichment and reserved-name dropping, and `end()` removing the record (D4).
- [x] 6.3 Add `flow-run-tracker.test.ts` covering the spec scenarios: stable run id across screens, reload resumes in progress and completed runs without a new start or completion, a fresh `navigate` load starts a new run, the entry screen is recorded for direct links, completion happens once (including a repeated call and resume after completion), the restart sequence and ids, a variant mismatch starts a new run, interaction events carry all five context fields, a reserved name is dropped, and a repeated screen id is not re-emitted.
- [x] 6.4 Add `use-flow-run-analytics.ts`. It creates the tracker once per `FlowRunner` mount (state or ref, safe under StrictMode), runs the ordered lifecycle effect on `[run.id, screenId, run.status]`, skips `screen_viewed` while the completion view shows, and calls `end()` on unmount. Wire it into `FlowRunner`: `restart()` calls `tracker.restart(screenId)` first, and `analytics` in the runtime memo is bound to `screenId`. Verify by hand in dev that the console shows exactly one `flow_started` and one `screen_viewed` per screen change under StrictMode.

## 7. New test session

- [x] 7.1 In `src/routes/home.tsx` `startNewSession`, also clear all analytics run records and call `analytics.startNewSession()`. Add a `clearAll` helper to `run-storage.ts` and cover it in `run-storage.test.ts`.

## 8. exp-pet-002 instrumentation

- [x] 8.1 Add `ExpPet002Events` to `flows/exp-pet-002/model.ts` (spec "Experiment analytics events"), and record the events at the points listed in design D11 using `useFlowAnalytics<ExpPet002Events>()`. Verify check-types, and that `NotesArea` has no analytics call.
- [x] 8.2 In `MedicationAddedScreen`'s `useLayoutEffect`, call `complete({ showCompletionView: false })`. In dev, check that saving the sheet in variant `a` and accepting the suggestion in `?variant=b` each show `medication-added` (no completion view), that the console shows `screen_viewed medication-added` followed by one `flow_completed`, and that browser back/forward and reload do not record a second completion.
- [x] 8.3 End-to-end check against a Matomo test site, using `.env.local` with real values that are not committed. Confirm one page view per screen with the variant/run dimensions, `flow_interaction` and `flow_lifecycle` events, the `flow_completed` value, no extra page view on load, and that "Start new test session" produces a new visit. Then block `matomo.js` in devtools and confirm the flow still completes with no errors.

## 9. Quality gates

- [x] 9.1 Run `pnpm --filter app-ux-flows test`, `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows knip`. All must pass with no new findings.
- [x] 9.2 Run `openspec validate add-ux-flows-analytics --strict` and confirm it passes.
