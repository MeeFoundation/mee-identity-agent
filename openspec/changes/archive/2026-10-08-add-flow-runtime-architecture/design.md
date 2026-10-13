## Context

See `proposal.md` - Why. What exists today in `apps/app-ux-flows` (observed, not assumed):

- **Routing**: TanStack Router, code-based (`src/routes/router.ts`), with routes `/`, `/$flowId` (a `beforeLoad` redirect) and `/$flowId/$screenId`. The established convention (previous change, Decision 2) is that only `src/routes/*` imports `@tanstack/react-router`. Slice components get plain props and callbacks such as `navigateToScreen`, and `grep -r "@tanstack/react-router" src/slices` is empty. This design keeps that rule.
- **State**: Jotai is used only through `getDefaultStore()`, with a module-level `Map<flowId, atomWithStorage>` of one untyped `{ status, currentScreenId, data: Record<string,string> }` blob per flow, persisted to `sessionStorage`. `currentScreenId` duplicates the URL. Nothing anywhere in the monorepo uses `createStore()` + `<Provider store>`. `app-concepts` uses plain module-level `atom(...)` definitions read by hooks against the default store. That is the atom-definition convention reused below.
- **Screens**: Declarative `ScreenBlock[]` (`{ component: 'text-input', props }`), resolved through a string-keyed `component-registry.ts`. Every building block takes `FlowComponentRuntimeProps` (`data`, `setValue`, `completeScreen`), so UI components know about the flow.
- **Shared UI**: `@mee/ui` is React Native-only and was rejected for this Vite app in the previous change (Decision 7). Nothing reusable exists for `react-dom`, so default building blocks are created inside the app.
- **Tooling constraints**: Biome with `nursery.recommended` (which includes import-cycle detection), Knip for unused exports, TS strict with no `any` and no `@ts-ignore`, i18next for all user-facing strings, and Vitest in a Node environment (no DOM testing library installed).

## Goals / Non-Goals

**Goals:**
- A small runtime (about 4 source files) that runs flows whose screens are ordinary React components.
- One isolated Jotai store per run, a typed initial-state API, layered component resolution, and typed navigation, with the URL as the only source of the current screen.
- Keep the routes-own-the-router convention: the flow slice stays router-agnostic.

**Non-Goals:**
- A/B variants, analytics and Figma integration. This design shows only where they plug in.
- Run-state persistence across reloads (decided: in-memory runs).
- Multiple concurrent runs of the same flow in one tab, and run ids in the URL.
- A DOM test harness (`@testing-library/react`, `jsdom`). Runtime behavior that needs a DOM is verified in the browser. See Risks.

## Decisions

### D1. `defineFlow`: an identity function with explicit type parameters for screen ids, components and initial state

```ts
// slices/flow/runtime/define-flow.ts
export type ScreenComponent = ComponentType
type ComponentEnvironment = Record<string, ComponentType<never>>

export type FlowDefinition<S extends string, C extends ComponentEnvironment, I> = {
  id: string
  titleKey: string
  initialScreen: NoInfer<S>
  screens: Record<S, ScreenComponent>
  components: C
  createStore(initialState?: I): FlowStore // method syntax: keeps registry assignability (bivariant param)
}

export const defineFlow = <S extends string, C extends ComponentEnvironment, I>(
  flow: FlowDefinition<S, C, I>,
) => flow
```

`FlowStore` is `ReturnType<typeof createStore>` from `jotai`. With `Record<S, ScreenComponent>`, a flow declared as `defineFlow<AddMedicationScreenId, AddMedicationComponents, AddMedicationInitialState>(...)` fails type checking if a screen is missing, if an extra screen key is added (excess-property check on the literal), or if `initialScreen` is not in `S`. When the type parameters are omitted, inference still works, so they are optional for small flows. The example passes them explicitly because the screens use the same `ScreenId` union.

*Alternative*: a builder/factory (`createFlow().screens(...).components(...)`). Rejected: more API for no extra type safety.

### D2. Screens are plain components. Flow data lives in module-level atoms owned by the flow

A flow folder declares its atoms (`petAtom`, `medicationsAtom`, `medicationDraftAtom`) as ordinary `atom(default)` values in `model.ts`, following the `app-concepts` convention. Screens use them with `useAtom`/`useAtomValue`/`useSetAtom` as usual. Because the runner wraps screens in `<Provider store={runStore}>`, the same atom definitions resolve to per-run values. Atoms are keys and values live in the store, which is how isolation works without any extra mechanism.

Screens import only: their flow's `model.ts` (atoms, types), runtime hooks from `slices/flow/runtime`, and i18next. They never import the router or other screens.

### D3. Isolated store per run, created by the flow from a typed initial state

```ts
// flows/add-medication/flow.ts
createStore(initialState) {
  const store = createStore()
  store.set(petAtom, initialState?.pet ?? gingerFixture)
  store.set(medicationsAtom, initialState?.medications ?? [])
  return store
}
```

- **Initial-state API**: `AddMedicationInitialState = { pet?: Pet; medications?: Medication[] }`, a flow-specific typed shape. `FlowRunner` takes `initialState?: I` and passes it through. Callers never see atoms. Only the flow maps initial state to atoms.
- Atom defaults also hold the fixture values, so the `store.set` calls only matter for overrides. Setting every initial-state field explicitly keeps the mapping in one readable place.
- *Alternative*: `useHydrateAtoms` inside the runner with a `[atom, value][]` list. Rejected: it makes the public API atom-shaped and hydrates only once per store, which complicates restart.

### D4. `FlowRunner` owns the run: `{ store, status }` in React state, keyed by flow id

```tsx
type FlowRunnerProps<S extends string, C extends ComponentEnvironment, I> = {
  flow: FlowDefinition<S, C, I>
  screenId: S                       // already validated by the route
  initialState?: I
  componentOverrides?: Partial<C>   // runtime/variant layer (D6)
  onComplete?: () => void           // completion observer (D9)
  navigateToScreen: (screenId: S) => void
  goBack: () => void
  exit: () => void                  // "back to all flows" from completion view
}
```

The runner does five things:
1. Create the run with `useState(() => ({ id: 0, store: flow.createStore(initialState), status: 'in-progress' }))`.
2. Resolve the component environment (D6) with `useMemo`.
3. Build the `FlowNavigation` object (D7) with `useMemo`.
4. Render `<Provider store={run.store}><FlowRuntimeContext.Provider value={{ components, navigation }}>`.
5. Render either `<CompletionView/>` when `status === 'completed'`, or `const Screen = flow.screens[screenId]` keyed by `run.id`.

The route renders `<FlowRunner key={flow.id} ... />`. Changing only `$screenId` re-renders the same instance (same TanStack route match), so the store survives. Switching to another flow remounts it. Leaving the route (for example to `/`) unmounts it, so re-entering starts a fresh run, which is the spec's "Starting a flow again resets its state".

*Alternative*: a module-level `Map<flowId, store>` cache (like today's atom map). Rejected: it lives outside React's lifecycle, needs explicit invalidation for "leave and re-enter", and recreates the global-registry pattern this change removes.

### D5. URL is the only current-screen state. Route validation happens in `beforeLoad`

Routes (code-based, same file style as today):
- `/` → home (unchanged except it navigates to `/flows/$flowId`).
- `/flows/$flowId` (`routes/flow.tsx`): `beforeLoad` runs `findFlow` and throws `notFound()` if the flow is unknown. Otherwise it throws `redirect({ to: '/flows/$flowId/$screenId', params: { screenId: flow.initialScreen }, replace: true })`.
- `/flows/$flowId/$screenId` (`routes/flow.$screenId.tsx`): `beforeLoad` throws `notFound()` for an unknown flow, and `redirect(... initialScreen, replace: true)` when `!hasScreen(flow, screenId)`. The loader returns `{ flow }`. The component calls `<FlowRunner>` and supplies `navigateToScreen` (via `useNavigate`), `goBack` (`router.history.canGoBack() ? router.history.back() : navigate(initialScreen, { replace: true })`) and `exit` (`navigate({ to: '/' })`).

No `currentScreenId` atom exists. The runner renders whatever `screenId` the URL holds.

### D6. Component environment: plain objects merged in layers

```ts
// shared/ui/default-components.ts  (layer 1: app defaults)
export const defaultComponents = { Header, Button, TextField, Checkbox }
export type DefaultComponents = typeof defaultComponents

// flows/add-medication/model.ts  (layer 2: flow additions / overrides)
export type AddMedicationComponents = DefaultComponents & {
  PetCard: ComponentType<PetCardProps>
  QuickAction: ComponentType<QuickActionProps>
}
// flows/add-medication/flow.ts
components: { ...defaultComponents, PetCard, QuickAction }

// FlowRunner (layer 3: runtime / future variant)
const components = useMemo(() => ({ ...flow.components, ...componentOverrides }), [...])
```

- Slots are typed by props (`ComponentType<QuickActionProps>`), not `typeof DefaultQuickAction`, so any component with compatible props can replace a slot. `Partial<C>` overrides are checked against those slot types.
- Building blocks are flow-agnostic: they take ordinary props (`onClick`, `value`, `onChange`, `children`). They don't read atoms or navigation. Screens wire state and navigation into them. This removes today's `FlowComponentRuntimeProps` coupling.
- Future layering is: app defaults → flow `components` → variant overrides → runner `componentOverrides`. The variant layer is just another spread in the route or runner (D12). No DI container, no string lookup and no plugin registry are needed.

### D7. Runtime hooks: one untyped context, generic hooks with an explicit screen-id type argument

```ts
// slices/flow/runtime/flow-context.ts
type FlowNavigation<S extends string> = {
  goToScreen: (screenId: S) => void
  back: () => void
  restart: () => void
  complete: () => void
}
const FlowRuntimeContext = createContext<{ components: ComponentEnvironment; navigation: FlowNavigation<string> } | null>(null)

export const useFlowNavigation = <S extends string = never>(): FlowNavigation<S> => useRuntime().navigation
export const useFlowComponents = <C extends ComponentEnvironment>(): C => useRuntime().components as C
```

Screens call `useFlowNavigation<AddMedicationScreenId>()` and `useFlowComponents<AddMedicationComponents>()`. Both types come from the flow's `model.ts`, the same types `defineFlow` was checked against.

**Type-safety tradeoff (how screen ids stay type-safe).** React context cannot carry a generic from the provider to an arbitrary consumer, so full inference (the screen "knows" its flow without being told) is impossible without a per-flow factory (`const { useFlowNavigation } = createFlowHooks<typeof flow>()`). That factory creates an import cycle (flow → screens → hooks module → flow), which Biome's cycle check flags. It also adds a factory per flow. The chosen approach is the smallest one that still checks the important things:
- `defineFlow<ScreenId, …>` makes the *definition* exhaustive against `ScreenId` (D1).
- `useFlowNavigation<ScreenId>()` makes every `goToScreen('typo')` a compile error.
- The type parameter defaults to `never`, so forgetting it makes `goToScreen(...)` uncallable instead of silently accepting any `string`.
- The residual gap: a screen could pass the *wrong flow's* `ScreenId` union. The screen imports the union from its own flow's `model.ts`, which makes that mistake unlikely and easy to see in review. The cast lives in exactly two lines in `flow-context.ts`.

### D8. Restart: replace the store, bump the run id, navigate to the initial screen

`restart()` runs `setRun(prev => ({ id: prev.id + 1, store: flow.createStore(initialState), status: 'in-progress' }))` and then `navigateToScreen(flow.initialScreen)` (push, so browser back can still return to the pre-restart URL, which then renders with the fresh store). Replacing the store (rather than resetting each atom) is the cleanest reset: it's guaranteed complete, it needs no per-atom reset list, and it reuses the exact same `createStore(initialState)` path as a fresh run, including any supplied overrides. Keying the screen by `run.id` also clears any local `useState` inside screens.

### D9. Completion: run status + generic view + `onComplete` callback

`complete()` sets `status: 'completed'` (a no-op if already completed) and calls `onComplete?.()` once. While the run is completed, the runner renders `CompletionView` regardless of `screenId`, so back/forward cannot re-enter an in-progress screen. `CompletionView` uses the existing `flow.completion.*` locale keys plus `restart` and `exit`. The route does not pass `onComplete` in this change. It is the hook-in point for the analytics change. Completion status sits next to the store in runner state, so restart clears it with the same `setRun`.

*Alternative*: a `/flows/$flowId/complete` URL. Rejected: the static segment would shadow a screen named `complete`, and completion is a property of the run, not a screen.

### D10. Direct links and the store lifecycle

A store exists only while `FlowRunner` for that flow is mounted:

| Event | Result |
|---|---|
| `goToScreen` / browser back-forward within the flow | Same store, new screen |
| Open `/flows/x/y` directly, reload, or re-enter after visiting `/` | New store from `createStore(initialState)` |
| `restart()` | New store, `run.id + 1`, initial screen |
| Switch to another flow | Remount (keyed by flow id), new store |

Screens must render meaningfully from initial state alone. For example, `confirmation` with no saved medication shows an empty state with a link to the form. **Future persistence** fits in one place: `createStore` (or the runner's `useState` initializer) can hydrate from `sessionStorage` and a store subscription can write back. Screens and the route stay untouched.

### D11. Folder structure (vertical slice, existing aliases only)

```
src/
  app/locales/en.ts                  # flow.completion.*, flows.addMedication.*, ui.*
  routes/
    router.ts                        # tree: home, flowRoute, flowScreenRoute
    home.tsx                         # navigate to /flows/$flowId
    flow.tsx                         # /flows/$flowId  → redirect to initial screen
    flow.$screenId.tsx               # /flows/$flowId/$screenId → <FlowRunner>
  shared/ui/
    header.tsx  button.tsx  text-field.tsx  checkbox.tsx
    default-components.ts            # layer 1
  slices/
    home/home-page.tsx               # unchanged
    not-found/not-found-page.tsx     # unchanged
    flow/
      runtime/
        define-flow.ts               # FlowDefinition, defineFlow, ScreenComponent, FlowStore
        flow-context.ts              # context + useFlowNavigation, useFlowComponents
        flow-runner.tsx              # FlowRunner
        completion-view.tsx
      registry.ts                    # findFlow, listFlows, hasScreen over AnyFlow
      flows/add-medication/
        model.ts                     # ScreenId, Components, InitialState, Pet, Medication, atoms, fixture
        flow.ts                      # defineFlow(...)
        components/pet-card.tsx  components/quick-action.tsx
        screens/home-screen.tsx  screens/medication-form-screen.tsx  screens/confirmation-screen.tsx
        add-medication.test.ts       # store isolation/initial state + type-level checks
```

Removed: `slices/flow/{model.ts,runtime.ts,runtime.test.ts,component-registry.ts,flow-page.tsx,components/,flows/example-flow.ts}`.

The registry stores flows as `AnyFlow = FlowDefinition<string, ComponentEnvironment, never>`. `createStore` uses method syntax so concrete flows are assignable. The route therefore calls `FlowRunner` without `initialState`, which is correct for now. A variant/scenario layer that supplies typed initial state will look up a typed flow, not the erased registry entry.

### D12. Path to A/B variants (not implemented)

A future `Variant<C, I, S>` is plain data: `{ components?: Partial<C>; initialState?: I; screens?: Partial<Record<S, ScreenComponent>> }`. Applying it is a route- or runner-level merge:
- Replace QuickAction or Header: `componentOverrides = variant.components` (layer 3 already exists).
- Change copy: copy flows through i18next keys, so a variant overrides keys or passes alternate keys through components or initial state.
- Change initial state: `initialState = { ...base, ...variant.initialState }`.
- Replace a screen: `screens = { ...flow.screens, ...variant.screens }` before rendering.
- Add or remove screens: a variant derives a new `defineFlow({...base, screens: {...}})`. Because the URL validation and runner only consult `flow.screens`, nothing else changes.

Assignment (which variant a participant gets) belongs in the route layer, and screens remain unaware of it.

## Risks / Trade-offs

- [Screen-id typing relies on the screen naming its flow's `ScreenId` union] → The `never` default makes omission a compile error. The mismatched-flow case is visible in review. A type test file asserts `goToScreen('nope')` errors (`@ts-expect-error` in a test, which is not `@ts-ignore`).
- [No DOM test harness, so runner behaviors (restart, back, completion) are not unit-tested] → Store/initial-state logic and type contracts are tested in Vitest (Node). Runner/navigation behavior is verified by an explicit browser checklist task. Adding `@testing-library/react` + `jsdom` would need a `pnpm install` the user must approve, so it is proposed as a follow-up rather than done silently.
- [Reload loses progress (behavior regression from the previous change)] → Accepted by the user. Persistence has a single hook-in point (D10).
- [`StrictMode` double-invokes the `useState` initializer, creating two stores in dev] → Harmless: one is discarded before any screen renders, and `createStore` is pure.
- [Old `/$flowId/...` URLs stop working] → Internal tool with no external links yet. They fall through to not-found.
- [`back()` can leave the app when the previous history entry is outside it (e.g. arrived from home)] → That matches browser back semantics, which the spec requires. `canGoBack()` only guards against having no history entry at all.

## Migration Plan

Code-only change inside `apps/app-ux-flows`. No dependency, config or other workspace changes. To roll back, revert the change's commit.

## Architecture summary

1. **FlowDefinition API**: `defineFlow<ScreenId, Components, InitialState>({ id, titleKey, initialScreen, screens, components, createStore })` (D1).
2. **FlowRunner responsibilities**: own the run (`store`, `status`, `id`), resolve components, build navigation from route callbacks, provide store and context, render the screen or completion view. It knows nothing about URLs (D4).
3. **Jotai store lifecycle**: one `createStore()` per run. It lives while the runner for that flow is mounted, is replaced on restart, and is recreated on direct link, reload or re-entry (D3, D8, D10).
4. **Initial state API**: a typed, flow-specific `InitialState` passed as `FlowRunner initialState`, which only `flow.createStore` maps onto atoms (D3).
5. **Component environment API**: `defaultComponents` → `flow.components` → `componentOverrides`, typed by props, read via `useFlowComponents<C>()` (D6, D7).
6. **Screen pattern**: a plain component that uses `useFlowComponents`, the flow's atoms, `useFlowNavigation` and `t()`, with no props and no router (D2).
7. **FlowNavigation API**: `goToScreen(id)`, `back()`, `restart()`, `complete()` (D7–D9).
8. **Screen-id type safety**: an exhaustive `Record<ScreenId, …>` in `defineFlow`, plus `useFlowNavigation<ScreenId>()` with a `never` default (D7).
9. **TanStack Router integration**: `/flows/$flowId` (redirect) and `/flows/$flowId/$screenId` validated in `beforeLoad`. The route adapts `useNavigate`/history into runner callbacks (D5).
10. **Direct links**: a fresh store from initial state, and the requested screen renders and must handle unvisited predecessors (D10).
11. **Restart**: a new store from the same `initialState`, `run.id + 1`, status reset, push to the initial screen (D8).
12. **A/B readiness**: variants become plain data merged into `componentOverrides`, `initialState` and `screens` at the route/runner layer (D12).
13. **Folder structure**: see D11.
