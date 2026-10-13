## Context

See `proposal.md` - Why. Requirements are in `specs/app-ux-flows/flow-variants/spec.md` and the `flow-runtime` delta. What exists today in `apps/app-ux-flows/src` (observed):

- `slices/flow/runtime/define-flow.ts`: `FlowDefinition<S, C, I>` has `id`, `titleKey`, `initialScreen: NoInfer<S>`, `screens: Record<S, ScreenComponent>`, `components: C` and a method-syntax `createStore(initialState?: I)`. `defineFlow` is an identity function. The example flow passes `<S, C, I>` explicitly.
- `slices/flow/runtime/flow-runner.tsx`: holds the run (`{ id, store, status }`) in `useState`. It merges `{ ...flow.components, ...componentOverrides }` and builds `FlowNavigation` from route callbacks (`navigateToScreen`, `goBack`, `exit`). `restart` creates `flow.createStore(initialState)` and navigates to `initialScreen`. It renders `<Provider store>` + `FlowRuntimeContext` (`{ components, navigation }`).
- `slices/flow/registry.ts`: `AnyFlow = FlowDefinition<string, ComponentEnvironment, never>`, plus `listFlows`, `findFlow` and `hasScreen(flow, screenId)`.
- `routes/flow.$screenId.tsx`: `beforeLoad` resolves the flow (`notFound`) and replace-redirects unknown screens to the initial screen. The component passes `navigate`-based callbacks to `<FlowRunner key={flow.id}>`. `routes/flow.tsx` redirects `/flows/$flowId` to the initial screen. Neither route uses search params yet.
- Convention (previous changes): only `src/routes/*` imports `@tanstack/react-router`, and slices are router-agnostic. Tooling: Biome, Knip, strict TS, Vitest in a Node environment with no DOM and no `localStorage`.
- Example flow `add-medication`: atoms `petAtom`, `medicationsAtom` and `medicationDraftAtom`. `AddMedicationInitialState = { pet?, medications? }`, which `createStore` reads with `??` fallbacks. Its components are `defaultComponents + PetCard + QuickAction`.

## Goals / Non-Goals

**Goals:**
- Variants are plain TypeScript objects on `FlowDefinition`. One pure resolution function produces the effective flow, and `FlowRunner` keeps working unchanged on the result.
- The variant id is decided in the route layer (URL + storage) and travels in the URL when explicit. Screens never see it.
- The existing runtime shape is kept: the same context, hooks, store lifecycle and route callbacks.

**Non-Goals:**
- A `useVariant()` hook for screens, weights in configuration, analytics calls, a debug UI beyond a dev-only assignment readout, and pinning a variant for the lifetime of a tab.

## Decisions

### D1. Variant definition: a typed partial overlay of the base flow

```ts
// runtime/define-flow.ts
export type VariantDefinition<S extends string, C extends ComponentEnvironment, I extends object> = {
  nameKey: string
  descriptionKey?: string
  components?: Partial<C>
  screens?: Partial<Record<S, ScreenComponent>>
  initialState?: I
}

export type VariantSelection = 'explicit' | 'automatic'

export type FlowDefinition<S extends string, C extends ComponentEnvironment, I extends object> = {
  id: string
  titleKey: string
  initialScreen: NoInfer<S>
  screens: Record<S, ScreenComponent | null> // null = only some variants implement it (D5)
  components: C
  variants?: Readonly<Record<string, VariantDefinition<NoInfer<S>, NoInfer<C>, NoInfer<I>>>>
  variantSelection?: VariantSelection // default 'explicit'
  defaultVariant?: string // explicit-mode fallback; first variant key when omitted
  createStore(initialState?: I): FlowStore
}
```

- The record key is the variant id: stable, kebab-case, starting with a letter, and sent to analytics.
- `defaultVariant` names the explicit-mode fallback. It was added during implementation: the repo's Biome assist `useSortedKeys` reorders object keys alphabetically, so "first declared" would silently change on save. Without it, the fallback is the first key in (sorted) key order.
- Display text goes through `nameKey` / `descriptionKey`. The brief sketched `name: 'Control'`, but the app rule says every user-facing string uses i18next, so this follows the existing `titleKey` pattern.
- Variant ids are typed as `string` rather than a literal union. URLs and storage deliver runtime strings anyway, so a literal union would add a fourth type parameter to `defineFlow`. Today the flow passes `<S, C, I>` explicitly and TS has no partial inference, so that parameter would make the example flow spell out its variant ids twice. Ids are validated by the registry test instead (D9).
- `I extends object` replaces the unconstrained `I`, because initial state must be spreadable (D4). The registry's erased type becomes `FlowDefinition<string, ComponentEnvironment, object>`, since `never` would reject a variant's `initialState?: AddMedicationInitialState`. `createStore` keeps method syntax, so concrete flows stay assignable.

*Alternatives*: (a) a `variants: [{ id, ... }]` array. Rejected: the record form needs no duplicate-id check and reads like the brief. (b) `createVariant(base, overrides)` producing whole `FlowDefinition`s. Rejected: it duplicates registration and invites drift.

### D2. Resolution: `resolveFlow(flow, variantId) → ResolvedFlow`, pure and memoized

```ts
// runtime/resolve-flow.ts
export type ResolvedFlow<S extends string, C extends ComponentEnvironment, I extends object> = {
  flowId: string
  variantId: string | null
  titleKey: string
  initialScreen: S
  screens: Partial<Record<S, ScreenComponent>>
  components: C
  createStore(initialState?: I): FlowStore
}
```

- `components = { ...flow.components, ...variant.components }`. This is a shallow replace by key.
- `screens = { ...flow.screens, ...variant.screens }` with `null` entries dropped.
- `createStore(runState) = flow.createStore({ ...variant.initialState, ...runState })`.
- It **throws** (programmer error, caught by the registry test) on three conditions: `variantId` is not a key of `flow.variants`; `variantId === null` while the flow has variants, or non-null when it has none; or `initialScreen` has no component after resolution. A partially resolved flow can never reach the runner.
- Results are cached in a `WeakMap<flow, Map<variantId, ResolvedFlow>>`. `beforeLoad` runs on every navigation, and a stable identity keeps `FlowRunner`'s `useMemo` deps and the context value stable, as the registry object did before.
- `FlowRunner` takes `flow: ResolvedFlow<S, C, I>` instead of `FlowDefinition`. Its body changes only in types. Its `componentOverrides` / `initialState` props stay as the top layer. `key` becomes `` `${flow.flowId}:${flow.variantId ?? ''}` ``, so a variant change remounts the runner and starts a fresh run (spec: "Variant change starts a new run").
- `hasScreen` takes a `ResolvedFlow` and checks `Object.hasOwn(screens, id)`.

*Alternative*: resolving inside `FlowRunner` from `(flow, variantId)`. Rejected: route `beforeLoad` must know the resolved screen set to redirect invalid or variant-only screens before render, so resolution belongs before the runner.

### D3. Variant selection: a pure function in the route's `beforeLoad`, with storage injected

```ts
// variants/select-variant.ts
isVariantOf(flow, id): boolean
selectVariant(flow, requested: string | undefined, assignments: AssignmentStore, random = Math.random): string | null
pickWeighted(entries: readonly { id: string; weight: number }[], random: () => number): string
```

`selectVariant` returns:
1. `null` if the flow has no variants.
2. `requested` if `isVariantOf`. It does **not** write storage.
3. If `automatic`: a stored id that is still valid. Otherwise `pickWeighted(all ids with weight 1)`, written to storage.
4. If `explicit`: `flow.defaultVariant ?? Object.keys(flow.variants)[0]`.

An invalid `requested` is handled *before* `selectVariant` in the route. It becomes a replace-redirect to the same path with `search: {}`, after which the rules run without it. This is the same pattern as the existing invalid-screen redirect, and it keeps the URL honest. `pickWeighted` takes weights now, so adding `weight?: number` to `VariantDefinition` later is a one-line change. Explicit-mode selection from the home page is not a separate rule: the launcher puts `?variant=<id>` in the URL, so it is rule 2.

### D4. Initial state merge: shallow, field-level, with the flow owning interpretation

Precedence: flow fixtures < variant `initialState` < run-start `initialState`. This is a top-level spread, so a supplied field (including lists and objects) replaces the lower one wholesale. Deep merge was rejected: merging `medications` arrays or partial `pet` objects would be surprising. A flow that needs special combination logic already owns it inside `createStore`, which receives the merged public state and maps it to atoms. No separate resolver hook is needed. Atoms are never exposed to variants. Flags are ordinary optional initial-state fields (`showMedicationHint?: boolean`) that `createStore` writes to an atom. This is the recommended way to toggle small behavior, and screens read the flag from flow state, not from a variant id.

### D5. Variant-specific screens: the base declares the id as `null`

```ts
screens: { home: HomeScreen, explanation: null, form: FormScreen, ... },
variants: { guided: { screens: { explanation: ExplanationScreen } } }
```

- `S` stays the single union of all screen ids, so `useFlowNavigation<S>().goToScreen('explanation')` type-checks everywhere and `Record<S, …>` still forces every id to be mentioned in the base.
- At runtime a `null` screen is absent from the resolved flow. Navigating to it in a variant without it goes through the route, where `hasScreen(resolved, id)` fails and the existing invalid-screen redirect sends the participant to the initial screen with the variant kept.
- **Limitation (accepted):** the compiler cannot prove that a screen shared by all variants never navigates to a variant-only screen. In practice only the variant's own screens (or overrides) link to its extra screens, and the runtime fallback is safe. A per-variant screen-id type parameter was rejected because it multiplies generics on `defineFlow`, `FlowNavigation` and screens for a rarely used feature.
- `initialScreen` must resolve in every variant. TS cannot exclude `null`-mapped keys without another type parameter, so `resolveFlow` throws and the registry test (D9) catches it.

The example flow does not use this feature, which keeps it small. A test fixture flow in `resolve-flow.test.ts` covers it.

### D6. Sticky assignment: `localStorage`, per flow, injectable

```ts
// variants/assignment-store.ts
type AssignmentStore = { read(flowId): string | null; write(flowId, variantId): void; clear(): void }
createAssignmentStore(getStorage: () => Storage | undefined): AssignmentStore
export const browserAssignmentStore = createAssignmentStore(() => globalThis.localStorage)
```

- The key is `ux-flows:variant:<flowId>`. `clear()` removes every key with the `ux-flows:variant:` prefix.
- **`localStorage` over `sessionStorage`.** With `sessionStorage`, opening a shared flow link in a new tab, or the participant reopening the browser, would silently move them to another variant. For unmoderated tests, one browser should be one participant. Moderated sessions on a shared device use the home page's "Start new test session" (`clear()`) between participants, and designers use `?variant=`.
- Every storage access is in `try/catch`. If storage is missing or throws (private mode, Vitest's Node environment), an in-memory `Map` backs the store, so the assignment is consistent for the page session.
- Assignment is scoped by flow only. There is no participant identity because there is no auth; "participant" = browser profile until reset.
- A stale stored id (variant removed) fails `isVariantOf` and is overwritten by a fresh assignment.

### D7. Routes: a `variant` search param, retained by every in-flow navigation

- `flowRoute` and `flowScreenRoute` get `validateSearch: (s) => ({ variant: typeof s.variant === 'string' ? s.variant : undefined })`.
- `flowScreenRoute.beforeLoad`:
  1. `findFlow`, or `notFound()`.
  2. Invalid `variant` → replace-redirect with `search: {}`.
  3. `selectVariant(flow, search.variant, browserAssignmentStore)` → `resolveFlow`.
  4. `!hasScreen(resolved, screenId)` → replace-redirect to `resolved.initialScreen`, keeping `search`.
  5. Return `{ flow: resolved }`.
- `flowRoute` redirects to the initial screen and passes `search` through.
- `navigateToScreen` and the no-history branch of `goBack` navigate with the current search retained. Restart already goes through `navigateToScreen`, so it keeps the variant. Browser back/forward restores URLs that already carry the param.
- In automatic mode with no param, the URL never gains one: the participant's variant comes from storage on each `beforeLoad`, and the address bar does not reveal it.

### D8. Home page: launcher choices computed in the flow slice, rendered by a presentational page

- `slices/flow/variants/select-variant.ts` also exports `listVariantChoices(flow)`. It returns `[{ id, nameKey, descriptionKey }]` for explicit flows, and `null` for flows without variants or with automatic selection.
- `routes/home.tsx` loader maps flows to `{ id, titleKey, variantChoices, assignedVariantId }`. `assignedVariantId` is read from `browserAssignmentStore` only when `import.meta.env.DEV`, and is `undefined` otherwise.
- `HomePage` renders one "Start" button per flow, or one button per variant choice under a "Choose version" label. It also renders a "Start new test session" button that calls `onStartNewSession`; the route calls `browserAssignmentStore.clear()` then `router.invalidate()`. Starting navigates to `/flows/$flowId` with `search: { variant }` (`undefined` for non-explicit).
- `HomePage` stays router-agnostic and store-agnostic: plain props and callbacks.

### D9. Consistency checks in the registry test

For every registered flow, the registry test checks the following. If `variants` is present, it is non-empty and every id matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`. `resolveFlow(flow, id)` does not throw for each variant id, or for `null` when there are no variants. Every resolved flow `hasScreen(initialScreen)`. This is how runtime-only invariants (D1 ids, D5 initial screen) fail CI instead of failing a participant.

### D10. Example flow: `add-medication` becomes an automatic three-way test

- `control`: no overrides.
- `prominent-action`: `components: { QuickAction: ProminentQuickAction }` and `initialState: { showMedicationHint: true }`. The new `ProminentQuickAction` takes `QuickActionProps` and renders as a large card-style CTA. `MedicationFormScreen` shows a short hint paragraph when `showMedicationHintAtom` is true. This demonstrates a component override and a flag.
- `alternative-home`: `screens: { home: AlternativeHomeScreen }`. This is an "action first" layout with the add-medication CTA above the pet card and a medication count instead of the list. It uses the same atoms, `QuickAction` from the environment and `goToScreen('medication-form')`, so it also inherits the `prominent-action` component if both were ever combined.
- Shared: store, fixtures, form, confirmation, navigation. `variantSelection: 'automatic'`.

Explicit mode has no permanent example. It is covered by unit tests and a manual check in which `variantSelection` is temporarily switched to `'explicit'`.

### D11. Analytics hook points (no implementation)

`ResolvedFlow` carries `flowId` and `variantId`. The route component that renders `FlowRunner` has the resolved flow and `screenId`, and `FlowRunner` owns `run.id` and already calls `onComplete` once per run. The Matomo change can add `onRunStart` / `onScreenView` callback props to `FlowRunner`, fired from effects keyed on `run.id` / `screenId`, and wire them in the route. No screen changes. `FlowRuntimeContext` deliberately does not gain `variantId`.

## Risks / Trade-offs

- [Assignment reset in another tab switches the variant mid-run on the next navigation] → The remount starts a clean run (no mixed state), and reset is a deliberate moderator action. Pinning per tab was considered and is a non-goal.
- [`localStorage` assignments outlive a session on shared lab machines] → "Start new test session" button on the home page, and the key prefix is documented in D6.
- [Variant-only screens are not proven unreachable by the compiler] → Runtime redirect fallback (D5), and the feature is optional.
- [`null` screens and initial-screen validity are runtime-checked] → The registry test (D9) runs in CI. `resolveFlow` throws loudly rather than rendering a partial flow.
- [The participant could notice `?variant=` in a designer-shared link] → Expected for explicit links. Automatic mode never writes the param.
- [Changing the erased registry type `never` → `object` lets route code pass loosely typed initial state] → Routes pass none today. Typed initial state is still enforced at `defineFlow` and `FlowRunner<S, C, I>` call sites with concrete flows.

## Answers to the brief

1. **VariantDefinition API**: `{ nameKey, descriptionKey?, components?: Partial<C>, screens?: Partial<Record<S, ScreenComponent>>, initialState?: I }` (D1).
2. **Attachment**: optional `variants: Record<variantId, VariantDefinition>` + `variantSelection?: 'explicit' | 'automatic'` on `FlowDefinition`, with the same `defineFlow` call (D1).
3. **Resolution algorithm**: route `beforeLoad` strips an invalid `?variant`, runs `selectVariant` (URL → sticky/new automatic assignment → `defaultVariant` or first variant key for explicit) and `resolveFlow` (memoized, throws on inconsistency), checks the screen against the resolved flow, and hands `ResolvedFlow` to `FlowRunner` (D2, D3, D7).
4. **Component overrides**: shallow key replacement. Layers are shared defaults < flow < variant < run-start overrides. Each replacement is typed by `Partial<C>`, so it must accept the base component's props (D2).
5. **Screen overrides**: shallow key replacement over base screens. Ids are restricted to `S` by the excess-property check (D2).
6. **Variant-specific screens**: supported. The base maps the id to `null`, a variant supplies it, navigation stays typed on one union, and a missing screen falls back via the invalid-screen redirect (D5).
7. **Initial-state overrides**: the flow's public `I` shape, shallow field-level merge fixtures < variant < run-start, with no deep merge and no atom access (D4).
8. **Automatic assignment**: `pickWeighted` over all variants with weight 1, so equal probability. Weights are ready to be exposed later (D3).
9. **Sticky assignment**: `localStorage` key `ux-flows:variant:<flowId>`, kept until "Start new test session". Stale ids are reassigned, and there is an in-memory fallback (D6).
10. **Explicit URL**: `?variant=<id>` on any flow URL wins over storage and never writes it. An invalid id is removed by a replace-redirect (D3, D7).
11. **Navigation preservation**: route callbacks retain the current search on `goToScreen`, `back` fallback, the invalid-screen redirect and the `/flows/$flowId` redirect. Browser history carries it naturally (D7).
12. **Restart / new session**: restart = new store from the same `ResolvedFlow`, same variant. Starting again from home = same sticky variant. "Start new test session" clears assignments, and the next start assigns again. A variant change remounts the runner (D2, D6).
13. **Type safety**: guaranteed are component prop compatibility, override screen ids within `S`, variant `initialState` typed as `I`, navigation ids within `S`, and base `screens` exhaustive over `S`. Not guaranteed at compile time are variant id literals and format, initial screen non-null, and variant-only screen reachability. These are covered by the registry test and runtime redirects (D1, D5, D9).
14. **Analytics**: `ResolvedFlow.flowId` / `.variantId` + route `screenId` + `FlowRunner` run lifecycle (`run.id`, `onComplete`). A later change adds `onRunStart` / `onScreenView` props, with no screen changes (D11).
15. **Module/folder changes**: see the table below.

| Path (under `apps/app-ux-flows/src`) | Change |
|---|---|
| `slices/flow/runtime/define-flow.ts` | `VariantDefinition`, `VariantSelection`, `variants`, `variantSelection`, nullable `screens`, `I extends object` |
| `slices/flow/runtime/resolve-flow.ts` (+ test) | new: `ResolvedFlow`, `resolveFlow` |
| `slices/flow/runtime/flow-runner.tsx` | takes `ResolvedFlow` |
| `slices/flow/variants/select-variant.ts` (+ test) | new: `isVariantOf`, `selectVariant`, `pickWeighted`, `listVariantChoices` |
| `slices/flow/variants/assignment-store.ts` (+ test) | new: `createAssignmentStore`, `browserAssignmentStore` |
| `slices/flow/registry.ts` (+ test) | `AnyFlow` uses `object`; `hasScreen` on `ResolvedFlow`; variant consistency tests |
| `routes/flow.tsx`, `routes/flow.$screenId.tsx` | `validateSearch`, variant selection/resolution, search retention, runner key |
| `routes/home.tsx`, `slices/home/home-page.tsx` | variant choices, new-session reset, dev-only assignment readout |
| `slices/flow/flows/add-medication/*` | `variants`, `ProminentQuickAction`, `AlternativeHomeScreen`, `showMedicationHint` flag + atom |
| `app/locales/en.ts` | variant names/descriptions, hint, launcher strings |
