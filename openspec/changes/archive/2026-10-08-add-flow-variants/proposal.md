## Why

`app-ux-flows` exists to test UX ideas with participants, but a flow can currently have only one shape. To compare two ideas we would have to copy the whole flow: its store, fixtures, screens and navigation. A/B variants let one flow carry several UX versions. Each variant overrides only what differs: components, whole screens, or initial store values such as feature flags. Everything else is shared. The runtime always knows which variant is active, so the upcoming Matomo change can report `flowId` + `variantId` + `screenId` without touching screens.

## What Changes

- A `FlowDefinition` can optionally declare `variants`, keyed by stable, URL-safe variant ids, plus a `variantSelection` mode (`'explicit'` or `'automatic'`). A variant has an i18n name (and optional description) and any combination of:
  - `components`: a typed partial replacement of the flow's component environment,
  - `screens`: a typed partial replacement of the flow's screens,
  - `initialState`: values in the flow's existing public initial-state shape (for example `showMedicationHint: true`), shallow-merged over the base defaults.
- A flow can declare a screen id that only some variants implement. The base maps it to `null` and a variant supplies the component. Navigation stays typed against one screen-id union.
- A new resolution step (`resolveFlow`) turns base flow + chosen variant into a `ResolvedFlow` (effective screens, components, store factory, `flowId`, `variantId`). `FlowRunner` runs the `ResolvedFlow`. Screens keep using `useFlowComponents()` / `useFlowNavigation()` and never see the variant id.
- Variant choice follows a fixed priority. First a valid `?variant=<id>` in the URL. Then, for automatic flows, a sticky assignment stored in `localStorage` per flow, or a new equal-weight random assignment. Then, for explicit flows, the declared `defaultVariant` (or the first variant key). An invalid `?variant=` is removed by a replace-redirect, never partially applied.
- In-flow navigation, back with no history, restart and the `/flows/<flowId>` redirect keep the `variant` search param. Restart keeps the same variant.
- The home page lets the participant pick a variant for explicit flows, and shows only "Start" for automatic flows. A "Start new test session" control clears sticky assignments. Assigned variants are shown only in dev builds.
- The `add-medication` example flow becomes an automatic A/B/C experiment. `control` is unchanged. `prominent-action` swaps `QuickAction` for `ProminentQuickAction` and turns on a medication-hint flag through initial state. `alternative-home` replaces the `home` screen. All variants share the store, fixtures, form, confirmation and navigation.
- **BREAKING (internal)**: `FlowRunner` takes a `ResolvedFlow` instead of a `FlowDefinition`. `hasScreen` checks a resolved flow. The registry's erased flow type changes its initial-state parameter from `never` to `unknown`. No external consumers exist.

Out of scope: analytics/Matomo calls, weights in configuration (the assignment function already accepts weights), server-side assignment, remote config, experiment dashboards or statistics, Figma runtime dependencies.

## Capabilities

### New Capabilities
- `app-ux-flows/flow-variants`: declaring variants on a flow, resolving them into an effective flow, explicit vs automatic selection, sticky assignment and reset, the `variant` URL parameter, and keeping the variant during navigation and restart.

### Modified Capabilities
- `app-ux-flows/flow-runtime`: the runtime runs a resolved flow. Component environment, initial state, screens, the invalid-screen redirect, navigation, restart and the home page become variant-aware.

## Impact

- Code (all in `apps/app-ux-flows/src`):
  - `slices/flow/runtime/define-flow.ts`: variant types, `variants` / `variantSelection` fields, nullable base screens.
  - New `slices/flow/runtime/resolve-flow.ts` and `slices/flow/variants/` (selection + assignment storage).
  - `flow-runner.tsx`, `registry.ts`, `routes/flow*.tsx`, `routes/home.tsx`, `slices/home/home-page.tsx`.
  - Example flow: new `ProminentQuickAction`, `AlternativeHomeScreen`, a hint flag atom, and locale strings.
- Browser storage: one new `localStorage` key per automatic flow (`ux-flows:variant:<flowId>`).
- No new dependencies.
