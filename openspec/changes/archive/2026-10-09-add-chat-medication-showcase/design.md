## Context

See proposal.md (Why) for motivation, and the specs for the behaviour itself. This section covers only the current state that shapes the approach.

- `FlowDefinition` (`slices/flow/runtime/define-flow.ts`) is a single object type. Being an "experiment" is implied by the optional `code`, `variants` and `variantSelection` fields. `resolveFlow` turns it into a `ResolvedFlow`, and `FlowRunner` runs that.
- Analytics is wired in exactly one place. `FlowRunner` always calls `useFlowRunAnalytics(...)`, which creates a `FlowRunTracker` (`sync`, `restart`, `track`, `end`). That tracker writes run storage and emits lifecycle events to the app-wide `AnalyticsSink`. Screens get a `FlowEventSink` through `useFlowAnalytics<E>()`.
- All Ginger pod UI and data lives inside `flows/exp-pet-002/`:
  - `model.ts`: `Pod`, `MedicationRecord`, fixtures, atoms and the `ExpPet002Events` map,
  - `medication-fields.ts` and its tests,
  - `components/`: `GingerTopBar`, `NotesArea`, `MedicationFormCard` and `PodInfoView`.

  `GingerTopBar` and `PodInfoView` call `track(...)` with `ExpPet002Events` directly, and every i18n key is under `flows.expPet002.*`.
- The home loader (`routes/home.tsx`) maps `listFlows()` into a flat `FlowLauncher[]`, which `HomePage` renders as one grid. The dev catalogue (`slices/flow/catalogue.ts`) already handles a flow without variants (`variantId: null`, "Base flow").
- Jotai atoms are module-level definitions, while each run has its own store (`createStore` per run). So two flows can share atom definitions without sharing state.
- `knip` checks for unused code across `src/**`, so moved modules must not leave dead exports behind.

## Goals / Non-Goals

**Goals:**
- Make "showcase" a first-class flow kind that the type system enforces, at minimal runtime cost.
- Keep EXP-PET-002 byte-for-byte the same in behaviour, URLs and analytics events.
- Reuse the Ginger pod UI between both flows without one flow importing from another flow's folder.

**Non-Goals:**
- No autoplay or timeline engine. The showcase is a clickable prototype driven by the viewer.
- No free-text chat, typing indicator or message input editing.
- No new routes or URL shape. Showcases use `/flows/<flowId>/<screenId>` like experiments.
- No visual change to existing EXP-PET-002 screens.

## Decisions

### 1. Flow kind as a discriminated union on `FlowDefinition`

```ts
type FlowBase<S, C, I> = { id; titleKey; descriptionKey?; initialScreen; screens; components; designFrames?; createStore }
type ExperimentDefinition<S, C, I> = FlowBase<S, C, I> & {
  kind: 'experiment'; code?; variants?; variantSelection?; defaultVariant?
}
type ShowcaseDefinition<S, C, I> = FlowBase<S, C, I> & {
  kind: 'showcase'; code?: never; variants?: never; variantSelection?: never; defaultVariant?: never
}
export type FlowDefinition<S, C, I> = ExperimentDefinition<S, C, I> | ShowcaseDefinition<S, C, I>
```

`kind` is required on both, so `exp-pet-002` gets `kind: 'experiment'`. The `?: never` members make the type checker report a showcase that declares variants or a code. They also keep `flow.variants` and `flow.code` readable on the union, so `resolveFlow`, `selectVariant`, `listVariantChoices` and the catalogue need no narrowing. For a showcase these fields are simply `undefined`. `ResolvedFlow` gains `kind`.

- *Alternative: infer the kind (no variants and no code means showcase).* This was rejected because the meaning would live in a convention nobody can see. It also could not tell a variant-less experiment from a showcase, and the analytics opt-out would hinge on that.
- *Alternative: a separate registry or runtime for showcases.* This was rejected because it duplicates routing, the runner and the catalogue for no behavioural gain.

### 2. Analytics opt-out inside `useFlowRunAnalytics`

`FlowRunner` keeps calling the hook unconditionally, which the Rules of Hooks require, and passes `enabled: flow.kind === 'experiment'`. When it is disabled, the hook returns a constant `disabledFlowRunTracker` whose methods do nothing. No `createFlowRunTracker` is created, so nothing reads or writes `browserRunStorage`, no run id is generated, and the `sync` and `end` effects become no-ops. `FlowRunner` itself is unchanged apart from passing the flag. Its `analytics` sink calls `tracker.track`, so `track()` calls from shared components silently do nothing in a showcase.

`enabled` is fixed for the lifetime of a runner, because the runner is keyed by flow and variant in `flow.$screenId.tsx`. So choosing the tracker once in `useState` is safe.

- *Alternative: a no-op `AnalyticsSink` passed into the real tracker.* This was rejected because the tracker would still create run ids and write resumable runs to session storage. That breaks "no run id or resumable run" in the flow-analytics delta, and could leave a showcase entry for `browserRunStorage` to resume.
- *Alternative: branch in the route and render two runners.* This was rejected because it duplicates `FlowRunner` wiring.

### 3. Shared Ginger pod module at `slices/flow/pods/ginger/`

The module holds:
- `model.ts`: `Pod`, `MedicationRecord`, `gingerPod`, `gingerMedication`, `PodTab`, the `GingerPodComponents` type, and the shared atoms `podAtom`, `medicationAtom`, `medicationFormAddedAtom`, `noteTextAtom` and the idempotent `addMedicationFormAtom`,
- `medication-fields.ts` and its tests,
- `assets/ginger-avatar.png`,
- `components/ginger-top-bar.tsx`, `notes-area.tsx`, `medication-form-card.tsx` and `ginger-category-rows.tsx`.

Experiment-only state (`showAiSuggestionAtom`, `sheetOriginAtom`) and `ExpPet002Events` stay in `flows/exp-pet-002/model.ts`. `PodInfoView` stays in exp-pet-002, because it carries the AI suggestion, the add-form entry point and its tracking. It is rebuilt from the shared `MedicationFormCard` and `GingerCategoryRows`.

Shared components never call `useFlowAnalytics`, which fits the existing rule that shared building blocks don't record flow-specific events:
- `GingerTopBar` takes `tab` and `onTabSelect(tab)`. A thin `ExpPet002TopBar` wrapper in exp-pet-002 tracks `pod_tab_selected` and maps tabs to screens, with Chat still inert. The showcase wraps it to map all three tabs.
- `GingerCategoryRows` takes an optional `onOpenMedical`. Without it, the Medical row does nothing.

Moved i18n keys go from `flows.expPet002.{tabs,notes,medication,forms.addContactInfo,forms.createForm,forms.title,forms.emptyTitle,forms.emptyMessage,categories}` to `pods.ginger.*`. Keys only exp-pet-002 uses stay where they are, for example `aiSuggestion`, `forms.addForm` and the add sheet.

- *Alternative: the showcase imports from `flows/exp-pet-002/`.* This was rejected because it couples a showcase to an experiment's folder. Changing the experiment would silently change the demo, and deleting the experiment later would break the showcase.
- *Alternative: move everything into `shared/ui`.* This was rejected because these pieces depend on the flow runtime (`useFlowComponents`) and on Ginger fixtures, which is domain content rather than design-system building blocks.
- *Location:* `slices/flow/pods/` sits next to `flows/`. It isn't a flow, so it should not live inside `flows/`, where the registry imports flows by folder.

### 4. Chat components in the design system

`shared/ui/chat-message.tsx`, `chat-suggestion-chip.tsx` and `chat-composer.tsx`, exported as `chatComponents` with a `ChatComponents` type, following the `podComponents` pattern. They are presentational and take props only.
- `ChatMessage` takes `{ author: 'user' | 'agent'; children }`. The agent avatar is a plain dark circle, as in Figma (there is no image asset).
- `ChatSuggestionChip` takes `{ label; onClick }`.
- `ChatComposer` takes `{ value; placeholder; readOnly?; onSend; sendLabel }`. It submits on Enter and on the send button, and ignores empty values.
- A `ChatThread` wrapper is `role="log"`, anchored to the bottom (`flex-col justify-end`), and scrolls inside the device frame's content area.

The showcase's `components` are `{ ...defaultComponents, ...podComponents, ...chatComponents }`, so the chat pieces are swappable like the other building blocks.

### 5. Showcase chat state as a run-state machine

A `chatStageAtom: 'draft' | 'sending' | 'typing' | 'replied'` lives in `flows/chat-add-medication/model.ts`, starting at `'draft'`. Each stage maps to what the viewer sees:

| Stage | User bubble | Status | Telli |
|---|---|---|---|
| `draft` | none (the text is in the composer) | none | none |
| `sending` | shown | "Sending…" | none |
| `typing` | shown | "Sent" | "Telli is typing..." |
| `replied` | shown | "Sent" | reply bubble and chip |

- Send moves `draft` to `sending`.
- One effect in `ChatScreen` advances the timed stages: `sending` to `typing` after `SEND_DELAY_MS = 800`, and `typing` to `replied` after `TELLI_TYPING_MS = 2500`. Cleanup runs on unmount. If the viewer leaves during a delay, the stage stays where it was, and the effect starts that step's timer again on return. That satisfies "the reply still appears" without a global timer.
- The delays add up to about 3.3 seconds, which reads as a real round trip to an assistant without making a demo audience wait. A step table (`nextStage`) keeps the timings in one place and makes the order testable without timers.
- The chip is rendered when `stage === 'replied' && !medicationFormAdded`.
- Loading pieces follow the Mee Design System chat items "Me" (the delivery status line) and "Typing message". The bubble styling stays as in the Tellipod frames.

`chat` is one screen, not one screen per stage. A timed screen change would push a history entry on its own, so browser back would land on a half-finished conversation.

- *Trade-off:* the Figma frame "EXP-PET-002-C - Ginger Chat (message sent)" is not referenced as a screen's design frame, because `chat` maps to the "Telli suggests" frame. The catalogue can't deep-link to the "replied" stage. This is acceptable for a showcase. The flow's `initialState` could later accept `chatStage` if deep links are wanted.

### 6. Home grouping in the loader

The home loader adds `kind` to each `FlowLauncher`. `HomePage` splits flows into `experiments` and `showcases`, keeping registry order, and renders a section with an `<h2>` heading (`home.sections.experiments` / `home.sections.showcases`) for each non-empty group. The existing card markup moves into a `FlowCard` component, unchanged, so both sections render identical cards. Flow card titles move from `<h2>` to `<h3>` under the section heading.

### 7. Registry order

`registry.ts` lists `[expPet002Flow, chatAddMedicationFlow]`. Grouping by kind happens on the home page only. `listFlows()` keeps returning every flow, so URLs resolve the same way for both kinds.

## Risks / Trade-offs

- [Moving the Ginger pod could subtly change EXP-PET-002, through i18n key typos or a lost `track` call] → Existing `exp-pet-002.test.ts` and `medication-fields.test.ts` move or keep passing. Add a test that `ExpPet002TopBar` tracks `pod_tab_selected`, and grep that every `flows.expPet002.*` key still used resolves in `en.ts` (i18next falls back to the key string, so a typo would not throw).
- [Analytics opt-out regresses for experiments] → A unit test of the hook-level selection, and an existing tracker test, cover experiments. Add a test that a showcase runner produces no sink calls and no run storage writes.
- [The `?: never` members are bypassed with a cast] → This is accepted. It is the same strength as the rest of the typed flow API, and `pnpm check-types` catches normal authoring.
- [The chat copy is fixed while the medication record is replaceable] → If someone supplies a different record through initial state, the chat still says "Clavamox". This is accepted for a showcase and documented in the spec ("fixed copy").
- [The home heading level change affects tests or snapshot selectors] → No snapshot tests exist for the home page. Tests that query by role and name keep working.

## Migration Plan

This is frontend-only, with no data or URL migration. Run `pnpm --filter app-ux-flows test`, `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows knip`. To roll back, revert the change. Stored variant assignments and resumable analytics runs are unaffected, because showcases never write them.
