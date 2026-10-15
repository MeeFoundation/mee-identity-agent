## Context

All flows are TypeScript definitions in `src/slices/flow/flows/*`, collected by `src/slices/flow/registry.ts` into a map. Everything else reads that registry through `listFlows()` and `findFlow()`:

- the home loader (`routes/home.tsx`) builds rows, variant choices (`listVariantChoices`), case choices (`listCases`) and the dev catalogue;
- `routes/flow.tsx` and `routes/flow.$screenId.tsx` resolve the flow. They show not-found for an unknown id, drop an unknown `?variant=` or `?case=` with a replace redirect, and pick the variant with `selectVariant`. `selectVariant` already discards a stored assignment that is no longer a variant of the flow;
- `resolveFlow` takes the first case when none is requested, and puts every case in `ResolvedFlow.cases`. The briefing builds its "Try case" actions from that list.

The app already separates dev and production with `import.meta.env.DEV`, for the catalogue, the assigned-variant note and the variant label in the flow chrome. Vitest runs with `DEV` true.

## Goals / Non-Goals

**Goals:**
- One place decides what production leaves out, so routes, variant selection, case resolution and the briefing need no changes.
- Production behavior can be unit-tested without a production build.

**Non-Goals:**
- Showing hidden items on a deployed environment (staging) through runtime config. The user chose dev-server-only.
- Hiding individual screens.
- Marking any existing flow, variant or case hidden. Authors do that per item when they need it.
- Access control. Hidden items still ship in the production JavaScript bundle; hiding is not a secret.

## Decisions

### 1. A `hidden?: true` field on the definitions

`FlowBase`, `VariantDefinition` and `CaseDefinition` in `runtime/define-flow.ts` gain an optional `hidden?: true` with a one-line comment: "Shown only in development builds." A literal `true`, not `boolean`, so a definition never carries a meaningless `hidden: false`.

*Alternatives:* a central list of hidden ids in the registry or a config file. It is easier to forget when renaming, and it separates the flag from the thing it hides. A runtime environment variable was ruled out by the user's choice of dev-server-only.

### 2. The registry filters once, at module load, in production

A pure `withoutHidden(flow: AnyFlow): AnyFlow | undefined` goes in a new `src/slices/flow/hidden.ts`:
- it returns `undefined` when the flow is hidden, or when it declares variants (or cases) and all of them are hidden;
- otherwise it returns the flow unchanged when nothing in it is hidden, or a shallow copy without the hidden variants or cases;
- `defaultVariant` is dropped from the copy when it names a hidden variant. `selectVariant` then falls back to the first remaining key, which is the spec's "first visible variant in key order".

`registry.ts` builds its map from `import.meta.env.DEV ? allFlows : allFlows.flatMap(...withoutHidden...)`, once at module load.

Filtering at the source means every consumer sees a flow without the hidden items, and existing code handles the rest:

| Spec behavior | Existing code that does it |
|---|---|
| Hidden flow URL shows not-found | `findFlow` returns `undefined`, so `notFound()` |
| Hidden `?variant=` / `?case=` dropped | `isVariantOf` / `isCaseOf` fail, so the existing replace redirect runs |
| Hidden variant never assigned, stored one replaced | `selectVariant` only sees visible variant ids |
| First visible case is the default | `effectiveCaseId` takes the first remaining key |
| "Try case" omits hidden cases | `listCases` on the filtered flow |
| Section counts | `groupFlowsByKind` counts the filtered list |

Filtering once matters because `resolveFlow` caches by flow object in a `WeakMap`. A copy made on every `findFlow` call would defeat the cache and give each lookup a new identity.

*Alternative:* checking `hidden` in each consumer (home loader, both routes, `selectVariant`, `resolveFlow`, briefing). That means six places to keep in sync, and missing one leaks a hidden item through a URL.

### 3. Dev-only "Hidden in production" label from the unfiltered definitions

In development the registry returns the definitions unchanged, so `hidden` is still on them. The home loader passes it through:
- `FlowLauncher.hidden: boolean` for the row;
- `hidden: boolean` on `VariantChoice` (from `listVariantChoices`) and `CaseChoice` (from `listCases`) for the start actions;
- `CatalogueEntry.hidden: boolean` for the catalogue.

`FlowRow` shows a small muted badge next to the code. Each `ChoiceButton` for a hidden variant or case gets the same badge. The catalogue entry heading shows it too. The text is the i18next key `home.hiddenInProduction` ("Hidden in production"). In production every value is `false`, because hidden items are already gone, so the label needs no `DEV` check of its own.

`CaseChoice` is also used by the briefing. The briefing ignores the new field.

### 4. Testing production without a production build

- `hidden.test.ts` covers `withoutHidden` directly: a hidden flow; hidden variants and cases; a hidden default variant; all variants hidden; all cases hidden; an untouched flow returned as the same object.
- `registry.ts` exposes `createRegistry(flows, showHidden)`, and the module-level registry is `createRegistry(allFlows, import.meta.env.DEV)`. `registry.test.ts` calls `createRegistry(fixtureFlows, false)` directly, so no real flow has to be marked hidden. It checks that `listFlows` and `findFlow` leave hidden items out and return the same object on every call.
- Route-level behavior follows from the registry and is already covered by the variant and case tests. A one-off browser check of a production preview, with a flow temporarily marked hidden, confirms it end to end. That edit is reverted afterwards.

## Risks / Trade-offs

- [Hidden code still ships in the bundle] → It is stated as a non-goal. Hiding is for not showing unfinished work, not for secrecy. Tree-shaking hidden flows would need build-time codegen, which isn't worth it here.
- [An author hides the only variant a shared link uses] → The link degrades gracefully: the variant is dropped and the default runs, which is the existing unknown-variant behavior.
- [Analytics for an experiment change when a variant is hidden mid-study] → Participants with a stored assignment to it are reassigned. This is what the spec requires; authors should avoid hiding a variant during a live study.
- [The one line that passes `import.meta.env.DEV` isn't unit-tested] → The browser check of a production preview covers it.
