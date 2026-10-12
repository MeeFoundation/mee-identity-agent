## Context

See proposal.md for motivation. This design covers how the change is built in `apps/app-ux-flows/src`. Relevant current state:

- **Home page.** `slices/home/home-page.tsx` renders `groupFlowsByKind(flows)` as a `sm:grid-cols-2 lg:grid-cols-3` grid of `FlowCard`s.
  - `FlowCard` stacks the title and description, then a full-width outlined `Button` per variant (with its description underneath) or per case, then the `FlowCatalogue` `<details>`.
  - `group-flows.ts` hardcodes `sectionOrder = ['experiment', 'showcase']`.
- **Where pods open.**
  - EXP-PET-002 and chat-add-medication already start on `ginger-notes`.
  - EXP-PET-003 opens Ginger via `podOpensOnAtom` (default `'info'`); no variant sets it.
  - EXP-PET-004's home screen calls `goToScreen('ginger-info')`.
  - EXP-DEMO-001 has no Notes screen. `demo-info-view.tsx` passes a no-op `onTabSelect`.
  - SC-PET-001's `PodView` hardcodes `value="info"` with a no-op `onSelect`. The 1.5 s suggestion timer lives in `pod-empty-screen.tsx`.
- **Notes UI.** `NotesArea` (`pods/ginger/components/notes-area.tsx`) reads `noteTextAtom` from `pods/ginger/model.ts`. Each flow resets that atom in `createStore`.
- **Role.** `roleAtom` (SC-PET-001 model) feeds `createPodFromTemplate({ role })`, which sets `PodInstance.creatorRole`. Nothing renders `creatorRole`.
- **Baseline.** `sc-pet-001-cases-and-briefing` is complete but unarchived. Its versions of the home-page and SC-PET-001 requirements are the baseline.

## Goals / Non-Goals

**Goals:**
- A flow takes about one line plus actions on the home page, so all current flows fit on one desktop screen.
- One consistent rule, "a pod opens on Notes", implemented per flow without touching the flow runtime.
- SC-PET-001's suggestion still feels proactive even though it is no longer on the first tab shown.

**Non-Goals:**
- No search or filtering on the home page.
- No new tooltip/popover primitive library. The native `title` attribute plus a visually hidden description is enough for a research tool.
- No Chat tab content in EXP-DEMO-001 or SC-PET-001. Chat stays inert where it was.
- No change to the flow runtime, URL scheme, analytics events or briefing mechanics.

## Decisions

### 1. Home page: one bordered list per section, row = `FlowRow`

Replace `FlowCard` with a `FlowRow` `<li>` inside a single `divide-y` bordered `<ul>` per section:

```
+------------------------------------------------------------------------+
| [SC-PET-001] Create Ginger                     [A ...] [B ...] [C ...] |
|              Create a pod for your cat by name, then add pet st...     |
|              > Screens                                                 |
|------------------------------------------------------------------------|
| Add medication from chat                                      [Start]  |
|              Tell Telli about a medication in the pod chat and...      |
+------------------------------------------------------------------------+
```

- **Layout.** `flex flex-wrap` with the text block `min-w-0 flex-1` and the actions `flex flex-wrap gap-2`. At narrow widths the actions wrap below the text with no breakpoint logic.
- **Description.** Clamped with `line-clamp-1`. The full text goes in the element's `title` attribute.
- **Variant pills.** `Button` with `size="s"` and `variant="outlined"`, labelled with the variant's name. The description goes in `title` and in `aria-describedby` on a `sr-only` span, so keyboard and screen-reader users still get it.
- **Case pills.** Same treatment, labelled `code · name`, as today.
- **"Choose version:" / "Choose a case:" labels are dropped.** The pills are self-explanatory and the labels cost a line per flow. The baseline spec mentioned the labels; the modified requirement no longer does.
- **Display code chip.** Development-only. It comes from `flow.catalogue?.code`, which already exists only in development, so no new prop is needed.
- **Catalogue.** `FlowCatalogue` keeps its `<details>` element and stays collapsed by default. It renders as the last line of the row with a smaller summary ("Screens"), full width under the text.

**Alternatives considered:**
- Compact cards. Uneven row heights remain.
- Master–detail. Adds a click before starting a flow.

### 2. Section order and counts

- Change `sectionOrder` to `['showcase', 'experiment']`. `groupFlowsByKind` keeps returning sections. The heading renders `t(key, { count })`, with locale strings like `'Showcases ({{count}})'`.
- Update `group-flows.test.ts` to assert the new order.

### 3. Shared notes module

- Move `NotesArea` and `noteTextAtom` to `slices/flow/pods/notes/` (`notes-area.tsx`, `model.ts`).
- Update the imports in the five Ginger flows. Keep the `pods.ginger.notes.*` locale keys as they are, to avoid churn.
- SC-PET-001 resets the same atom in its `createStore`. Each flow has its own Jotai store, so sharing the atom definition does not share state.

**Alternative considered:** a second notes component for SC-PET-001. Rejected as duplication. The placeholder text is already generic.

### 4. EXP-PET-003 / EXP-PET-004 / EXP-DEMO-001 wiring

- **EXP-PET-003.** Set `DEFAULT_POD_OPENING_TAB = 'notes'`. Nothing else changes: the setting already exists and Notes is already wired.
- **EXP-PET-004.** In `home-screen.tsx`, change `goToScreen('ginger-info')` to `goToScreen('ginger-notes')`.
- **EXP-DEMO-001.**
  - Add `ginger-notes` to the screen id union and to `screens`, and set `initialScreen: 'ginger-notes'`.
  - Add a small `DemoTopBar` (like `ExpPet002TopBar`) that maps Notes→`ginger-notes` and Info→`ginger-info`, with Chat as a no-op. Use it on all three screens. On `medication-added` the Notes tab now works too, which is harmless and consistent.
  - The `ginger-notes` screen is the same in both variants: it renders no empty-state card, so the "single component difference" holds.

### 5. SC-PET-001: `pod-notes` screen, Info dot, and suggestion readiness

**State.** Add `suggestionReadyAtom` (boolean, reset in `createStore`) and a derived `infoHasDotAtom`:

```
infoHasDotAtom = suggestionReady && shouldOfferSuggestion   (pod exists, no category, template given, not dismissed)
```

**Timer.** A `useSuggestionTimer()` hook, used by both `pod-notes` and `pod-empty`. It starts a 1.5 s timeout when `shouldOfferSuggestion && !suggestionReady` and sets `suggestionReady = true`. This replaces the navigation timer in `pod-empty-screen.tsx`. `pod-empty` now has an effect: when `infoHasDot` becomes true, `goToScreen('pod-template-suggested')`. That keeps today's "replaced in place" behaviour.

**Tabs.** Generalise `PodView` into a `PodTopBar` with `tab: 'notes' | 'info'`.
- Notes → `pod-notes`.
- Info → `podInfoScreenAtom`, a derived atom returning `'pod-template-applied' | 'pod-template-suggested' | 'pod-empty'` from category and readiness.
- On `pod-notes` the Info item gets `dot: infoHasDot`.

**Segmented tabs.** `SegmentedTab` gains an optional `dot?: boolean`. It renders an `aria-hidden` brand-coloured `size-2 rounded-full` span next to the label, plus a `sr-only` text: the translated "new" label.

**Entry points.** Every way into the pod goes to `pod-notes`:
- `new-pod` create, for both categories.
- "Create pod" on a full quick-action card, in `quick-action-card.tsx`.
- "Open pod" on the same card.

The old category-based branching (`category ? 'pod-template-applied' : 'pod-empty'`) is removed from these callers. Only `podInfoScreenAtom` decides now.

**Completion.** Today the `pod-template-applied` screen calls `complete()` on mount. Add the same to `pod-notes` when the pod has a category. The runtime already guards against completing twice.

**Direct link.** `pod-notes` uses `usePod()` (which calls `ensurePodAtom`) like the other pod screens.

**Alternatives considered:**
- Starting the timer only on `pod-notes`. Rejected: opening Info early would then never get the suggestion.
- A global timer started at creation. Rejected: direct links wouldn't start it, and it would fire while still on `telli`.

### 6. Role removal

Delete:
- `roleAtom`, its reset, and its use in `createPodAtom`, `createPodFromQuickActionAtom` and `ensurePodAtom`.
- The `role` field in `CreatePodInput`.
- `creatorRole` in `PodInstance`.
- The role `TextField`.
- The `flows.scPet001.newPod.role` locale key.

Update `create-pod.test.ts` and `sc-pet-001.test.ts` assertions that mention role.

## Risks / Trade-offs

- [EXP-PET-003/004 results shift: every run gains a Notes→Info tap] → Record it in the study log. EXP-PET-003 can still set `podOpensOn: 'info'` via initial state if a study needs the old behaviour.
- [SC-PET-001 testers may never notice the dot] → The `pod-notes` hint points to it. This is accepted as part of what the showcase now observes.
- [`title`-attribute tooltips are slow and absent on touch] → The descriptions are secondary on the home page, and the catalogue still shows them in development. Revisit with a popover if moderators complain.
- [Moving `NotesArea` touches five flows] → Only import paths change. Type-check and tests catch misses.
- [Baseline change not archived] → Archive `sc-pet-001-cases-and-briefing` before applying or archiving this change, otherwise the "Cases and goals" and "Quick actions" deltas have no target.

## Migration Plan

Static SPA with no persisted data affected. Stored run state (`run-storage`) holds no role or tab, so old sessions keep working. Rollback is a plain revert.
