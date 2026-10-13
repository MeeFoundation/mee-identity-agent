## Why

`app-ux-flows` runs A/B UX experiments, such as `exp-pet-002` with variants `a` and `b`, but records nothing about what participants do. We cannot compare variants on completion, time to complete, or which path participants take. The runtime already knows the flow, variant, screen and run lifecycle (`app-ux-flows/flow-variants` → "Active variant available to runtime infrastructure"). This change sends that information, plus a few intentional interaction events, to Matomo. Screens do not depend on Matomo, and the Flow Runtime keeps working when analytics fails.

## What Changes

- Add a small analytics layer to `app-ux-flows`: an `AnalyticsAdapter` interface, a `MatomoAdapter` (loads Matomo through the standard `_paq` queue; no npm dependency), a `ConsoleAnalyticsAdapter` for development, and a fan-out that isolates failures. There is no existing analytics or Matomo code in the monorepo, so this is new.
- Add **Flow Analytics** on top of that layer. It owns the analytics *Flow Run* (a `runId` per participant execution of a flow) and adds `flowId`, `variantId`, `screenId`, `runId` and the variant source to every flow event automatically.
- `FlowRunner` emits lifecycle events automatically: `flow_started`, `flow_resumed` (same run after a reload), `screen_viewed`, `flow_completed` (once per run, with duration and visited-screen count) and `flow_restarted`. Screens never emit these. `flow_abandoned` is deliberately **not** emitted, because a browser-only SPA cannot detect it reliably. Abandonment is derived in Matomo as a started run with no completion.
- Add a typed semantic-event API for screens: `useFlowAnalytics<FlowEvents>().track(event, props?)`. Each flow declares its event map. Unknown event names and wrong payloads fail type checking. Payload values are primitives only, and free text is forbidden by spec.
- Map the model to Matomo. Each screen view becomes a SPA page view on a normalized custom URL. Lifecycle and domain events become Matomo events. Flow, variant, run, screen and variant source go into action-scoped custom dimensions, sent with every call. Dimension IDs and the site URL/ID come from Vite env variables, read in one config module.
- Flow runtime: `complete()` gains a silent mode, `complete({ showCompletionView: false })`. It marks the run complete without replacing the current screen, so experiments whose end state is a real screen still produce `flow_completed`.
- Variant selection reports *how* the variant was chosen (`url`, `stored`, `assigned`, `default`, `none`) to the runtime. Analytics can then separate shared preview links from real automatic assignments.
- "Start new test session" on the home page also ends any resumable analytics runs and asks the adapter to start a new Matomo visit.
- Instrument `exp-pet-002`. Both variants emit the same semantic IDs, for example `medication_form_added` with `method: add_form | ai_suggestion`. The `medication-added` screen silently completes the run.

## Capabilities

### New Capabilities
- `app-ux-flows/flow-analytics`: the analytics abstraction (adapters, failure isolation, configuration, dev console output), the analytics Flow Run and `runId` lifecycle, automatic lifecycle events, context enrichment, the typed semantic-event API, naming and privacy rules, and the Matomo mapping (page views, events, custom dimensions).

### Modified Capabilities
- `app-ux-flows/flow-runtime`: "Explicit flow completion" gains silent completion, which marks the run complete without showing the completion view.
- `app-ux-flows/flow-variants`: "Active variant available to runtime infrastructure" also exposes how the active variant was selected.
- `app-ux-flows/experiments/exp-pet-002`: adds the experiment's analytics events and its silent completion on `medication-added`. This spec is introduced by the in-progress change `add-exp-pet-002-medication-entry-point`, which must be archived first.

## Impact

- Code: `apps/app-ux-flows/src/shared/analytics/*` (new), `src/slices/flow/analytics/*` (new), `src/slices/flow/runtime/flow-runner.tsx`, `flow-context.ts`, `src/slices/flow/variants/select-variant.ts`, `src/routes/flow.$screenId.tsx`, `src/routes/home.tsx`, `src/app/app.tsx`, and the `exp-pet-002` screens and components.
- Configuration: new `VITE_ANALYTICS_*` / `VITE_MATOMO_*` env variables, typed in a new `src/vite-env.d.ts` and documented in a new `apps/app-ux-flows/.env.example`. No new npm dependencies.
- External system: a Matomo site with five action-scoped custom dimensions and a "Flow completed" goal, configured by hand in the Matomo UI.
- No backend, no authentication, no migrations.
