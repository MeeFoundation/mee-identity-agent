## Why

The first `app-ux-flows` change shipped a working skeleton, but the way it authors screens is wrong for what comes next. Screens are declarative block lists (`{ component: 'text-input', props }`) rendered from a string-keyed registry, and flow state is one untyped `Record<string, string>` blob. Screens also can't be arbitrary React, so Figma-derived screens (a later change) would have to be squeezed into a JSON-like DSL. On top of that, the current screen lives both in the URL and in a `currentScreenId` field in state, which must be kept in sync by hand. Before real flows, Figma MCP output, and A/B variants are built on it, the runtime needs to settle on a small, typed, React-native architecture: screens are plain components, state is an isolated Jotai store per run, and the URL alone decides the current screen.

## What Changes

- **BREAKING** Replace the declarative screen-block model (`ScreenBlock`, `component-registry.ts`, `FlowComponentRuntimeProps`, `components/continue-button|text-block|text-input-field`) with screens that are ordinary React components.
- Add a typed `defineFlow` API. A flow declares an id, a title, an initial screen, a `screens` map (screen id → React component), a typed component environment, and a `createStore(initialState?)` function that builds an isolated Jotai store from a flow-specific initial-state type.
- Add `FlowRunner`, which takes a flow definition and the current screen id from the URL. It creates and owns the run's isolated store, provides it through a Jotai `Provider`, provides the component environment and flow navigation through React context, and renders the current screen or a generic completion view.
- Add the screen-facing runtime hooks `useFlowComponents()` and `useFlowNavigation()`, which exposes `goToScreen`, `back`, `restart` and `complete`. Screen ids are type-checked against the flow's declared screens. Screens never touch the router, URLs or route params.
- Add layered component resolution: shared default components, then flow overrides, then an optional runner-level override layer. These are plain object spreads, so A/B variants can add a layer later without changing screens.
- **BREAKING** Move flow URLs from `/$flowId/$screenId` to `/flows/$flowId/$screenId`. `/flows/$flowId` redirects to the flow's initial screen. An unknown screen id redirects to the initial screen. An unknown flow id shows not-found.
- **BREAKING** The URL is the only source of the current screen. Remove the `currentScreenId` state and the `sessionStorage`-persisted per-flow instance atom. Run state is in memory: a refresh, a direct link, or re-entering a flow starts a fresh run from the flow's initial fixture state.
- Replace the order-based "advance to next screen" model with explicit `goToScreen(id)` transitions and browser-history `back()`.
- Define restart (a fresh store from the same initial state, back to the initial screen) and completion (an explicit run status that shows a generic completion view and notifies an `onComplete` callback, so analytics can observe it later).
- Replace `example-flow` with a small `add-medication` example flow (pet overview → medication form → confirmation). It exercises typed navigation, shared state across screens, component-environment slots, direct links, back/forward, restart and completion.
- Out of scope: A/B variants, analytics (Matomo), Figma integration, and state persistence.

## Capabilities

### New Capabilities
<!-- None: flow runtime behavior already has a capability; this change rewrites its requirements. -->

### Modified Capabilities
- `app-ux-flows/flow-runtime`: Flows become sets of screens addressed by id rather than ordered lists. Each run gets isolated in-memory state built from typed, overridable initial state. Screens get replaceable building blocks from a component environment. Navigation becomes explicit screen transitions plus browser back/forward. Flow and screen URLs move under `/flows/`, and invalid screen ids redirect. Restart and completion get defined semantics. Refreshing or direct-linking starts from initial state instead of resuming persisted progress.

## Impact

- Code: `apps/app-ux-flows/src/slices/flow/*` is mostly rewritten (removes `model.ts`, `runtime.ts`, `component-registry.ts`, `components/`, `flows/example-flow.ts`, `runtime.test.ts`; adds the flow definition, runner, runtime hooks and the `add-medication` flow). `src/routes/flow.tsx` and `src/routes/flow.$screenId.tsx` move to `/flows/...` paths. `src/routes/home.tsx` navigates to the new path. A new `src/shared/ui/` holds the default reusable building blocks. Locale strings in `src/app/locales/en.ts` change accordingly.
- Dependencies: none added. Uses the existing `jotai`, `@tanstack/react-router`, `react-i18next` and `vitest`.
- Other workspaces: unaffected. `@mee/ui` is still not reused because it is React Native-only (see the previous change's design).
- Behavior: old `/$flowId/...` URLs stop resolving, and a refresh mid-flow no longer keeps progress. Both are acceptable for this internal testing tool, which has no external users yet.
