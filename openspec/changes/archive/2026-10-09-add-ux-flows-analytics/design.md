## Context

See proposal.md for motivation, and `specs/app-ux-flows/flow-analytics/spec.md` for the required behavior. The current state that shapes the design:

- **No analytics in the monorepo.** There is no Matomo, analytics package or tracking abstraction in any app or package. `app-ux-flows` reads `import.meta.env` only for `DEV` checks, and has no `.env` files or env typing. Nothing exists to adapt, so this is greenfield. It stays inside `apps/app-ux-flows` because specs and code must remain separable per app.
- **Routing** (`src/routes/flow.$screenId.tsx`). `beforeLoad` resolves the flow and variant on every navigation through `selectVariant(definition, search.variant, browserAssignmentStore)`. It renders `<FlowRunner key={flowId:variantId} screenId=… />`. The screen id comes from the URL, so browser back/forward, direct links and `goToScreen()` all end up as a new `screenId` prop on the same `FlowRunner`. The `key` remounts the runner when the variant changes.
- **FlowRunner** (`src/slices/flow/runtime/flow-runner.tsx`) owns the run: `{ id: number, store, status }`. `restart()` makes a new run and navigates to the initial screen. `complete()` is guarded once per run by `completedRunId`, sets `status: 'completed'`, and renders `CompletionView` instead of the screen.
- **FlowRuntimeContext** (`flow-context.ts`) exposes `components` and `navigation` to screens through `useFlowComponents<C>()` / `useFlowNavigation<S>()`. Screens can't see the variant id, and the spec requires it to stay that way.
- **Variant selection** returns only `string | null`. The source (URL, stored, newly assigned, default) is decided inside `selectVariant` and then discarded.
- **Reloads.** The runtime spec says a reload starts a fresh *run state*. `FlowRunner` keeps nothing across reloads.
- **`exp-pet-002`** has automatic variants `a`/`b`, starts at `ginger-notes`, and ends at `medication-added`. It never calls `complete()`, by design (see `add-exp-pet-002-medication-entry-point/design.md`). The user chose silent completion so it still produces `flow_completed`.
- **Dev mode** runs under `<StrictMode>`, which double-invokes state initializers and mount effects.
- **Biome** `noConsole` allows only `info`, `warn`, `error` and `assert`.

## Goals / Non-Goals

**Goals:**
- One small seam between the app and Matomo. Swapping Matomo means writing one adapter and changing app wiring, with no screen changes.
- Lifecycle events come only from `FlowRunner`, derived from committed runtime state: run, screen, status.
- Interaction tracking is type-checked per flow, and as cheap to use as `useFlowNavigation`.
- No new npm dependencies. No `pnpm install`.

**Non-Goals:**
- A generic analytics SDK. There are no queues, batching, retries, plugins, user identification or consent management.
- Tracking non-flow pages (home, not-found), outbound links or downloads.
- Measuring abandonment, time per screen in our own code, dashboards, statistics, or a backend.
- A participant id or cross-device identity.

## Decisions

### D1. Three layers: adapters (shared), Flow Analytics (flow slice), wiring (app)

```
src/shared/analytics/            # generic, knows nothing about flows' internals
  analytics-event.ts             # AnalyticsEvent, AnalyticsDimensions, AnalyticsProps, AnalyticsAdapter
  fan-out.ts                     # createAnalytics(adapters): try/catch per adapter → Analytics
  console-adapter.ts             # ConsoleAnalyticsAdapter (console.info)
  matomo-adapter.ts              # MatomoAdapter: _paq loader + mapping
  analytics-provider.tsx         # AnalyticsContext, AnalyticsProvider, useAnalytics() (noop default)
  random-id.ts                   # crypto.randomUUID with getRandomValues fallback
src/app/analytics.ts             # reads import.meta.env → analyticsConfig + adapters → `analytics`
src/app/app.tsx                  # <AnalyticsProvider analytics={analytics}><RouterProvider/></…>
src/vite-env.d.ts                # ImportMetaEnv typing for VITE_ANALYTICS_* / VITE_MATOMO_*
.env.example                     # documented variables, no real values
src/slices/flow/analytics/
  flow-events.ts                 # FlowEventMap, TrackArgs, reserved-name guard (types)
  flow-run-tracker.ts            # pure run lifecycle → AnalyticsEvent[], injectable clock/id/storage
  run-storage.ts                 # sessionStorage record per flow (try/catch, like assignment-store)
  use-flow-run-analytics.ts      # FlowRunner-side hook: drives the tracker from runner state
src/slices/flow/runtime/flow-context.ts   # + analytics in FlowRuntime; + useFlowAnalytics<E>()
```

The adapter interface is deliberately tiny:

```ts
type AnalyticsAdapter = {
  record(event: AnalyticsEvent): void
  startNewSession(): void
}
type AnalyticsEvent = {
  kind: 'screen_view' | 'lifecycle' | 'interaction'
  name: string                       // snake_case id
  props: AnalyticsProps              // Readonly<Record<string, string | number | boolean>>
  dimensions: AnalyticsDimensions    // { flowId, variantId, screenId, runId, variantSource }
  page?: { path: string; title: string; referrerPath: string | null }  // screen_view only
  value?: number                     // flow_completed duration
}
```

`AnalyticsDimensions` names the flow context. That is a little flow-specific for `shared`, but every event this app records is a flow event. A generic key/value bag would only move the mapping knowledge into each adapter. **Alternative rejected:** Matomo calls inside `FlowRunner`. That couples the runtime to Matomo and makes the console adapter a special case.

`FlowRunner` gets the sink from React context (`useAnalytics()`, default noop), not from a route prop. The app layer composes it once, and the runtime, tests and catalogue work without any provider.

### D2. Failure isolation in the fan-out, not in each caller

`createAnalytics(adapters)` wraps each `adapter.record` / `startNewSession` in its own `try/catch`. In dev, it reports a failure once with `console.warn`. Tracker and runtime code never wrap calls themselves. Matomo is loaded by appending an `async` `<script>` whose `onerror` is ignored. Until it loads, or forever if it is blocked, `_paq` is a plain array, so pushes are no-ops. The runtime never awaits analytics.

### D3. Analytics Flow Run identity: `sessionStorage` record, resumed only on reload or history traversal

`run-storage.ts` keeps one record per flow, under the key `ux-flows:analytics-run:<flowId>`:
`{ runId, variantId, variantSource, startedAt (epoch ms), status: 'in-progress' | 'completed', visitedScreenIds: string[] }`.

When `FlowRunner` mounts, the tracker **resumes** the stored run only if all of these hold:
1. A record exists for this flow with the same `variantId`.
2. This is the first `FlowRunner` mount in the document. A module-level flag is consumed on first mount.
3. The document's navigation type is `reload` or `back_forward` (`performance.getEntriesByType('navigation')[0].type`).
4. The document's entry path (captured at module load) is under `/flows/<flowId>`.

Otherwise it **starts** a new run and overwrites the record. When `FlowRunner` unmounts (in-app exit, a variant change through the `key`, or going home), it deletes the record. A reload doesn't unmount, so the record survives exactly when it should. Conditions 2–4 stop a stale record from being resumed when, for example, someone reloads the home page and then enters the flow. `sessionStorage` scopes it to the tab, so a new tab always starts a new run.

Writes go through the same `withStorage` try/catch pattern as `assignment-store.ts`. If storage is unavailable, a reload simply starts a new run.

**Alternatives rejected:**
- *A new run on every reload.* It matches the runtime's fresh state, but it splits one participant attempt into an "abandoned" run plus a run that starts mid-flow. Completion rates get worse for no real reason. After silent completion on `medication-added`, it would also complete a second, zero-length run.
- *`localStorage`.* It would resume across tabs and days, which is wrong for "one execution".
- *A runId in the URL.* It leaks into shared links and screenshots, and screens must not see analytics state.

Analytics run identity is therefore separate from runtime run *state*. A resumed run's state is still fresh fixtures, as the runtime spec requires. `flow_resumed` records that a reload happened.

### D4. Lifecycle events are derived from committed runner state, in one ordered effect

`useFlowRunAnalytics({ flow, variantSource, screenId, run })` runs a single `useEffect` keyed on `[run.id, screenId, run.status]`. In order, it:
1. On first effect for a run id: emits `flow_started` (new) or `flow_resumed` (resumed). The tracker holds per-run flags in a ref, so StrictMode's second effect pass and re-renders never re-emit.
2. If `screenId` differs from the last screen recorded for this run, and the completion *view* is not showing: emits `screen_viewed`, adds to `visitedScreenIds`, persists. Redirects that land on the same screen and re-renders don't change `screenId`, so no duplicate.
3. If `run.status` is `completed` and the stored record is not yet completed: emits `flow_completed` with `duration_seconds = round((now - startedAt)/1000)` and `visited_screen_count`, and persists `status: 'completed'`. Because this is persisted, it can't repeat across reloads.

`restart()` calls `tracker.restart(screenId)` synchronously before it resets runner state. That emits `flow_restarted` with the old run id and prepares the next start with `trigger: 'restart'` and `previous_run_id`. The following effect pass then emits `flow_started` and `screen_viewed` for the initial screen.

Deriving these from state, not emitting inside `complete()`, fixes the order. `MedicationAddedScreen` completes in a child `useLayoutEffect`, which runs before the runner's effects. Emitting there would record `flow_completed` before `screen_viewed`, with the previous screen in its context. The effect gets `screen_viewed medication-added` → `flow_completed`, both with the right screen.

**Alternative rejected:** a `useScreenView()` call in each screen. The spec forbids it, and it's easy to forget.

### D5. Silent completion: `complete({ showCompletionView: false })`

`FlowNavigation.complete(options?: { showCompletionView?: boolean })`. The runner's `FlowRun` gains `completionView: boolean`. It renders `CompletionView` only when `status === 'completed' && completionView`, and otherwise keeps rendering the screen. The existing `completedRunId` guard already makes any later `complete()` a no-op, whichever mode it uses. `onComplete` still fires once.

`MedicationAddedScreen` adds `complete({ showCompletionView: false })` to its existing `useLayoutEffect`. That covers both save paths and direct links in one place.

**Alternative rejected:** a declarative `completionScreen` on `FlowDefinition`. It's implicit, and it adds a second completion mechanism next to the explicit `complete()` the spec already defines.

### D6. Interaction API: `useFlowAnalytics<E>()` bound per render

```ts
type FlowEventMap = Record<string, AnalyticsProps | undefined>
type ReservedName = `flow_${string}` | `screen_${string}`
type TrackArgs<P> = P extends undefined ? [] : [props: P]

type FlowAnalytics<E extends FlowEventMap> = {
  track<K extends Exclude<keyof E & string, ReservedName>>(event: K, ...args: TrackArgs<E[K]>): void
}

export const useFlowAnalytics = <E extends FlowEventMap = never>(): FlowAnalytics<E>
```

It mirrors `useFlowNavigation<S>()` and `useFlowComponents<C>()`. Each flow exports its event map next to its screen ids in `model.ts`. The default `never` means an untyped call can't track anything. `FlowRuntime` gains `analytics: FlowAnalytics<FlowEventMap>`. It's built in `FlowRunner` with `useMemo` over `[tracker, screenId]`, so a handler always records the screen that was rendered when it was created. The tracker also drops reserved names at runtime (a defensive `console.warn` in dev) and passes `props` through unchanged. It never reads the Jotai store.

This is the only analytics surface screens see, and it exposes no variant id, so the "screens can't branch on variant" rule still holds.

**Alternatives rejected:**
- *A runtime event registry* (`defineFlowEvents({...})`). It adds runtime surface for no extra safety.
- *Flow-level generic on `FlowDefinition`.* It would thread a fourth type parameter through `defineFlow`, `ResolvedFlow`, `AnyFlow` and the registry for little gain.

### D7. Variant source from `selectVariant`

`selectVariant` returns `{ variantId: string | null; source: VariantSource }`. It is still pure, and the existing tests are updated. The route passes `variantSource` to `FlowRunner` as a new prop next to `flow`. `beforeLoad` runs on every navigation, so after the first screen the source would read `stored` instead of `assigned`. The tracker therefore captures the source only when a run starts, and keeps it in the run record.

### D8. Matomo mapping

| Internal | Matomo |
|---|---|
| `screen_viewed` | page view. `setReferrerUrl(prev)` → `setCustomUrl(origin + /flows/<flowId>/<screenId>)` → `setDocumentTitle(<flowId>/<screenId>)` → `trackPageView(title, dims)` |
| lifecycle events (`flow_started`, `flow_resumed`, `flow_completed`, `flow_restarted`) | `trackEvent('flow_lifecycle', name, encodedProps?, value?, dims)` |
| interaction events | `trackEvent('flow_interaction', name, encodedProps?, undefined, dims)` |
| props | event *name* `k=v;k=v`, sorted keys, omitted when empty |
| `flow_completed` duration | event *value*, in seconds |
| flow / variant / run / screen / variant source | action-scope custom dimensions, passed per call as `{ dimension<N>: value }` custom data |
| completion goal | Matomo Goal "Flow completed" = event action `flow_completed` (configured in Matomo UI) |
| abandonment | Matomo funnel or segment on `flow_started` without `flow_completed` per Run ID dimension |
| time per screen | Matomo time-on-page, plus `enableHeartBeatTimer` so the last page gets a duration |
| new test session | `deleteCookies` + one-shot `appendToTrackingUrl('new_visit=1')`, cleared after the next request |

Dimensions are **action-scoped** because one Matomo visit can contain several flows and runs. Visit scope would keep only one value. They are passed **per call**, not through `setCustomDimension`, because that persists on the tracker and would leak a previous run's or screen's values. The URL drops `?variant=` so per-screen reports aggregate, and the variant is a dimension. The adapter never calls the automatic initial `trackPageView`, so routes are never double-counted. Link tracking is not enabled.

Dimension IDs come only from `analyticsConfig.matomo.dimensions` (`{ flowId?: number, variantId?: number, … }`). The adapter builds the custom-data object from that map and skips unset entries.

### D9. Configuration via Vite env

| Variable | Meaning | Default |
|---|---|---|
| `VITE_ANALYTICS_ENABLED` | master switch | `true` |
| `VITE_ANALYTICS_DEBUG` | console adapter outside dev | `false` (always on in `DEV`) |
| `VITE_MATOMO_URL` | Matomo base URL (trailing `/` normalized) | unset → no Matomo |
| `VITE_MATOMO_SITE_ID` | site id | unset → no Matomo |
| `VITE_MATOMO_DIMENSION_FLOW_ID` / `_VARIANT_ID` / `_RUN_ID` / `_SCREEN_ID` / `_VARIANT_SOURCE` | custom dimension ids | unset → dimension omitted |

`src/app/analytics.ts` is the only file that reads these. It parses them into a typed `analyticsConfig` and ignores invalid integers, with a dev warning.

### D10. Console adapter

`console.info('[Flow Analytics]', name, { kind, flow, variant, screen, run, source, props })`. This is one line per event, and it is allowed by the Biome `noConsole` config. It is enabled in `DEV` or with `VITE_ANALYTICS_DEBUG=true`.

### D11. exp-pet-002 instrumentation points

| Event | Where |
|---|---|
| `pod_tab_selected` | `GingerTopBar.selectTab`, including `chat`, which navigates nowhere |
| `medical_opened` | `PodInfoView` Medical `CategoryRow` |
| `add_form_clicked` | `PodInfoView.openAddForm` (`forms_section`) and `MedicalView.openAddForm` (`medical_section`) |
| `add_form_dismissed` | `AddFormScreen` `onDismiss` |
| `medication_form_added` | `AddFormScreen.save` (`add_form`) and `PodInfoView.acceptSuggestion` (`ai_suggestion`) |
| completion | `MedicationAddedScreen` `useLayoutEffect` → `complete({ showCompletionView: false })` |

`NotesArea` is not instrumented.

## Risks / Trade-offs

- [The analytics run survives a reload but the runtime state resets] → This is intended and documented in the spec. `flow_resumed` marks the point, so analysts can exclude or inspect those runs.
- [A duplicated tab copies `sessionStorage`, so both tabs could share a run id] → Condition 3 (navigation type) mostly prevents it, because duplicate tabs load as `navigate` in Chromium. Any leftover overlap is an accepted edge case for a facilitated test.
- [`crypto.randomUUID` needs a secure context. Dev over a LAN IP over http has none] → `random-id.ts` falls back to `crypto.getRandomValues`.
- [`performance` navigation entries are missing in some environments] → Treat a missing entry as `navigate`, which starts a new run. That's safe.
- [Closing the sheet with browser back doesn't record `add_form_dismissed`] → Accepted. The sheet's own dismiss is the intentional action, and back navigation shows up in `screen_viewed`.
- [Ad blockers drop Matomo for some participants] → Accepted. Analytics is observational, and moderated sessions can whitelist the domain.
- [The `new_visit=1` / `deleteCookies` behavior depends on the Matomo version] → Verify against the target instance during apply (task 8.3). If it doesn't hold, the run and variant data stay correct and only visit splitting is affected.

## Migration Plan

1. Archive `add-exp-pet-002-medication-entry-point` first. This change adds requirements to its `experiments/exp-pet-002` spec.
2. Ship with analytics enabled and Matomo unset. Only the dev console is active.
3. In Matomo: create the site, five action-scope custom dimensions and the "Flow completed" goal. Then set the `VITE_MATOMO_*` variables for the deployed build.
4. Rollback: set `VITE_ANALYTICS_ENABLED=false`, or unset `VITE_MATOMO_URL`, and rebuild. No data migration is involved.

## Open Questions

- Whether the research consent setup requires cookieless Matomo (`disableCookies`). It would be one more config flag on the adapter and doesn't change this design.
- The final Matomo dimension ids and site id. These are environment values supplied when the Matomo site is created.

## Summary for review

1. **FlowAnalytics API**: `const { track } = useFlowAnalytics<ExpPet002Events>()`, then `track('medication_form_added', { method: 'ai_suggestion' })`. Lifecycle comes from `FlowRunner` through `useFlowRunAnalytics` and the `FlowRunTracker`, and reaches adapters through `AnalyticsProvider`/`useAnalytics()`.
2. **Typed domain events**: each flow exports an event map (`name → props | undefined`). `track` is checked for name, required or forbidden props, and prop types. `flow_*`/`screen_*` names are rejected at the type level.
3. **Lifecycle events**: `flow_started`, `flow_resumed`, `screen_viewed`, `flow_completed` and `flow_restarted`, all from `FlowRunner` (D4). There is no `flow_abandoned`; Matomo derives it.
4. **Flow Run / runId**: a random id per execution, stored per flow in `sessionStorage`, resumed only on reload or history traversal in the same tab (D3).
5. **Context enrichment**: the tracker adds flow, variant, screen, run and variant source to every event. Screens supply only name and props.
6. **Matomo mapping**: screen views are page views, everything else is events with `flow_lifecycle` / `flow_interaction` categories, props go in the event name, and duration is the event value (D8).
7. **Custom dimensions**: five action-scope dimensions, sent per call, with ids only in `analyticsConfig.matomo.dimensions` from env (D8, D9).
8. **SPA page views**: one page view per `screen_viewed` on `/flows/<flowId>/<screenId>` without a query string, no automatic page views, and a referrer chain within the run.
9. **Timing**: `startedAt` is persisted, `flow_completed` carries `duration_seconds`, and time per screen comes from Matomo time-on-page with a heartbeat.
10. **Refresh / direct link**: a reload continues the run (`flow_resumed`, no new start, no repeat completion). A direct link or new tab starts a run whose entry screen is the URL's screen.
11. **Restart**: `flow_restarted` with the old run, then `flow_started` with a new run, `trigger: restart` and `previous_run_id`. The variant is unchanged.
12. **Privacy**: only declared primitive props, no free text, state or user id, and a random run id.
13. **Debug adapter**: `ConsoleAnalyticsAdapter` via `console.info`, on in `DEV` or with `VITE_ANALYTICS_DEBUG`.
14. **Module changes**: see D1, plus the edits to `flow-runner.tsx`, `flow-context.ts`, `select-variant.ts`, `flow.$screenId.tsx`, `home.tsx`, `app.tsx` and the exp-pet-002 files listed in D11.
