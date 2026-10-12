## Context

**Flows and variants today**
- Flows are `defineFlow()` definitions. Variants exist only for experiments (`ShowcaseDefinition` forbids them).
- A variant can override components, screens, initial state and design frames, but not the initial screen. SC-PET-001's cases all start on `home`, so no initial-screen override is needed.
- `resolveFlow()` merges a variant over its base and caches the result per flow and variant.
- The home card (`flow-card.tsx`) already renders a per-variant start button for explicitly selected flows.

**The flow page**
- `routes/flow.$screenId.tsx` renders:
  - the side panel ("Back to all flows" and the title; hidden at ≤480 px);
  - `DeviceFrame`;
  - `FlowRunner`, keyed by flow and variant.
- `FlowRunner` owns the run: its store, its completed status and `restart()`. That's why "Start over" in the side panel needs a way to reach it.

**Chat building blocks**
- `chatComponents`: `ChatThread`, `ChatMessage`, `ChatAgentBubble`, `ChatComposer` (read-only when no `onChange`), `ChatMessageStatus` and `ChatTypingIndicator`, plus `ChatSuggestionChip`, which Figma doesn't use.
- `chat-add-medication` scripts a single exchange with a staged atom (`draft → sending → typing → replied`) and timers that resume on return. This design generalises that to several turns.

**Figma**
- `bottom-menu` is the tab bar on Home - 1/2/3.
- "Pod / Chat - 4" (`919:29813`) shows sending and "@Telli is thinking...".
- "Pod / Chat - 5" (`919:30381`) shows Telli replying with embedded cards.
- There is no frame for the global Telli chat or for a create-pod card.

See proposal.md for why the change is needed.

## Goals / Non-Goals

**Goals:**
- Cases, goals and hints are flow data; the briefing UI and the Telli screen are generic.
- SC-PET-002 "assign Ginger's medications with chat" can reuse the Telli screen with a different conversation and a different quick-action kind, without screen changes.

**Non-Goals:**
- A progress checklist, hints that appear after a delay, a demo/test mode switch: deferred.
- Real message parsing or free typing in Telli.
- Message timestamps, the "joined" system message.
- Restyling `chat-add-medication` to the Figma card pattern.

## Decisions

### 1. Cases are their own concept, with their own URL parameter
`ShowcaseDefinition` gains `cases?: Readonly<Record<string, CaseDefinition>>`. `ExperimentDefinition` gets `cases?: never`. Showcases keep `variants?: never`.

```ts
type CaseDefinition<S, I> = {
  code: string
  nameKey: string
  descriptionKey?: string
  goalKey?: string
  hints?: Partial<Record<S, string>>
  initialState?: I
}
```

A case shares every screen, component and the initial screen. Only the briefing and the starting data differ, so there is nothing to merge but `initialState`, the goal and the hints.

Resolution:
- `resolveFlow(flow, variantId, caseId)` takes the case as a third key.
- The route reads a `case` search parameter next to `variant` (`routes/flow-search.ts`).
- An unknown `case` value is dropped with a replace navigation.
- When there is no `case` parameter, the first declared case is used.
- Nothing is stored: there is no assignment store and no analytics, because the runner tracks experiments only.

Home and catalogue:
- The home card renders a "Choose a case:" list with code and name, linking with `?case=<id>`.
- The catalogue lists cases where it lists variants for experiments.

*Alternative considered:* reuse variants with explicit selection only. Rejected after review: a case is a task the tester is told, not an alternative design, and sharing the word would blur that in specs, URLs and the catalogue. The shared bit, merging initial state, is a few lines.

### 2. Goal and hints are part of the flow definition
`FlowBase` gains `goalKey?` and `hints?: Partial<Record<S, string>>`. A case may declare the same two fields:
- the case's `goalKey` replaces the base goal;
- the case's `hints` are merged per screen over the base hints.

`ResolvedFlow` exposes `caseId`, `caseCode`, `caseNameKey`, `goalKey: string | null`, `hints` and `cases`. `cases` is the list of `{ id, code, nameKey }`, used for the "Try case" links. Experiments may type-check with a goal and hints, but the briefing ignores them (flow-briefing "Goals and hints").

### 3. The runner reports its run to the page; the mission card lives inside the runner
- **New prop on `FlowRunner`:** `onRunChange?: (run: { id, completed, restart }) => void`. It is called whenever the run id or completed status changes.
- **The page side:** the route keeps the latest value in state and renders `BriefingPanel` (desktop side panel) and `BriefingButton` (phone-width overlay) from `slices/flow/briefing/`.
- **The mission card** must sit inside the phone and block it, and is per run. So `FlowRunner` renders `MissionCard` into the device's overlay container. It does so for showcases when a run starts on the initial screen, tracking "shown for run id" in runner state. Restart creates a new run id, so the card shows again.
- **"Try case":** navigates to the flow's initial screen with `?case=<id>`. The runner's key gains the case id, so it remounts with a fresh run and its mission card.

*Alternative considered:* lift the run state up into the route. Rejected because it would move the store's lifecycle out of the runner and touch every flow. A callback is additive.

### 4. Shared UI additions
- **`shared/ui/app-tab-bar.tsx` (`AppTabBar`):** props `{ active: 'home' | 'telli' | 'navigation', onSelect }`, styled after `bottom-menu` (react-bootstrap-icons `House`, `ChatSquareHeart`, `List`). It goes into `podComponents`, so pod-UI flows can replace it, and screens render it where they want it.
- **`shared/ui/chat-action-card.tsx` (`ChatActionCard`):** props `{ title, avatarLetter?, icon?, rows, status?, action: { label, onAction, disabled? } }`, styled after the "Pod / Chat - 5" cards. It goes into `chatComponents`.
- **Placement:** the Telli screen pins the tab bar below the composer, as in Figma, where the bottom menu floats above the home indicator.

### 5. Telli conversation as case data
In `flows/sc-pet-001/`:

```ts
type PodDraft = { name?: string; category?: string }
type QuickAction = { kind: 'create-pod'; draft: PodDraft }
type TelliTurn = { userKey: string; replyKey: string; replyValues?: Record<string, string>; action?: QuickAction }
// ScPet001InitialState gains `conversation?: readonly TelliTurn[]`; each case sets it in its own initialState.
```

Atoms:
- `conversationAtom`: from the initial state, which each case sets.
- `telliProgressAtom`: `{ turn: number; stage: 'idle' | 'sending' | 'thinking' }`. `turn` counts finished turns. The transitions are a pure `nextTelliStage()` with the 0.8 s and 2.5 s delays, as `chat-add-medication` does.
- `usedActionTurnAtom`: `number | null`, which card the pod came from.
- `newPodOriginAtom`: `'home' | 'telli'`.
- `categoryFromTelliAtom`: `boolean`, for the "Suggested by Telli from your chat" caption.

Write atoms:
- `sendNextMessageAtom`: starts the next turn only when idle.
- `applyQuickActionAtom(turn)`: replaces the name and category from that card's draft, sets the origin and caption flags, and records the turn. It does nothing once the pod exists.
- `createPodFromQuickActionAtom(turn)`: for a draft with a name, applies it and creates the pod at once. A card that names the pod skips the sheet: Telli's reply already asked, so the tap is the confirmation.

The screen renders:
1. the greeting;
2. each finished turn (user bubble, then the Telli bubble plus its card);
3. the in-flight turn with "Sending…" / "Sent" and "@Telli is thinking...".

This is a generic `ChatThread`; nothing on it is specific to Ginger, Pets or a case.

The New Pod sheet keeps one draft. Every "Create pod" overwrites name and category from its own card's draft, which gives each card "what you saw is what you get". Role is never touched. Only a card without a name opens the sheet, because a pod cannot be created without one.

### 6. Cases of SC-PET-001

| Case | `goalKey` | `hints` overrides | `initialState.conversation` |
|---|---|---|---|
| `a` | a | `home`, `new-pod` | `[]` |
| `b` | b | `home`, `new-pod` | 1 turn, `{ Ginger, Pets }` |
| `c` | c | `home`, `new-pod` | 2 turns, `{ Pets }` then `{ Ginger, Pets }` |

- **Base:** the showcase's `hints` cover `telli`, `pod-empty` and `pod-template-suggested`, and its base goal is the generic "Create a pod for your cat Ginger."
- **Strings:** case names, goals and messages live under `flows.scPet001.cases.*`.
- **Existing test:** `sc-pet-001.test.ts` keeps asserting no variants, and adds assertions for the three cases.

### 7. Briefing UI and copy
`slices/flow/briefing/` contains:
- `MissionCard`: centered card over a dimmed phone screen;
- `BriefingPanel`: side panel sections;
- `BriefingButton`: a "Goal" pill pinned to the top of the device at ≤480 px, opening a `Dialog` with the panel content.

Strings live under `flow.briefing.*`: "Your goal", "On this screen", "Start", "Start over", "Goal reached", "You reached the goal of this case.", "You reached the goal of this flow.", "Try case {{code}}", "Goal" and "Close".

## Risks / Trade-offs

- **[Risk] The mission card blocks a direct link meant for review.** → It shows only when the run starts on the initial screen (flow-briefing "Mission card").
- **[Trade-off] Cards keep their own snapshot.** Acting early on case C's first card opens the sheet with no name (while a card with a name creates the pod directly), even though Ginger's name is already in the chat. This is deliberate: it is the "how early do people trust Telli" signal (decided in exploration). It is spelled out in the spec scenario "Act early".
- **[Risk] Timed transitions in a scripted chat make browser checks slow and timing-sensitive.** → The stage logic is a pure function with unit tests, and the browser checks wait on conditions rather than fixed sleeps, as for the template suggestion.
- **[Gap] There's no Figma frame for the global Telli chat or a create-pod card.** → The screen follows the pod chat frames and is flagged in the spec's frame table. Design review is needed.

## Migration Plan

This affects the demo app only, with no data migration.
- `/flows/sc-pet-001/...` links without `?case` resolve to the first case (`a`), which behaves like today's flow plus the tab bar and briefing.
- Existing flows without goals or cases look the same, apart from showcases gaining "Start over" in the side panel.
- To roll back, revert the change.
