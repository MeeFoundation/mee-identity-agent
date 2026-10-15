## Context

Two Home screens draw the same header inline, with identical markup:
- `flows/sc-pet-001/components/home-view.tsx`;
- `pods/ginger/components/ginger-home-view.tsx`, which EXP-PET-003, EXP-PET-004 and EXP-PET-005 use.

The header is `<header className="rounded-3xl … bg-linear-to-b from-brand-100 to-white pt-(--status-bar-h) drop-shadow-topbar">`, holding a 44 px initial circle above an `h1` greeting. Each copy reads its own strings: `flows.scPet001.home.*` and `pods.ginger.home.*`.

Generic UI lives in `src/shared/ui/`. Flows get it through their component sets (`podComponents`, read with `useFlowComponents`), and its strings sit under `ui.<component>.*` (for example `ui.appTabBar.*`). Experiment tests replace components with stubs through `renderScreen(…, { components })` to capture callbacks, as `exp-pet-003.test.ts` does for `AppTabBar`.

The design reference is `home-topbar`, Figma node 905:15156, shown in the proposal. The design-system spec's existing "Pod top bar component" also claims to follow `home-topbar`, but it describes the pod header. This change leaves that requirement alone.

## Goals / Non-Goals

**Goals:**
- One Home header implementation, used by both Home screens.
- The search field's activation is measurable in experiments, and silent in the showcase.

**Non-Goals:**
- Search behavior, or opening Telli from the field.
- The device status bar from the Figma instance ("Mobile screen elements"). `PodScreen` and `--status-bar-h` keep handling it.
- Pod top bars, and any screen other than Home.
- Renaming the user. The Figma frame's "Bogdan" is placeholder data, and the flows keep "Welcome, Alice".
- Fixing the "Pod top bar component" requirement's reference to `home-topbar`.

## Decisions

### 1. `HomeTopBar` in `shared/ui`, registered in `podComponents`

`src/shared/ui/home-top-bar.tsx` exports `HomeTopBar({ greeting, initial, onSearchSelect? })`, which is added to `podComponents`. Both Home views take it from `useFlowComponents`. The flow passes the greeting and the initial, because they belong to the flow's user. The sharing line and the placeholder are product copy, so the component owns them as `ui.homeTopBar.sharing` and `ui.homeTopBar.search`.

Registering it lets tests replace it, as they do for `AppTabBar`. It also follows the AGENTS.md rule that generic UI goes in `shared/ui` and is registered in `podComponents`.

*Alternative:* a component in `pods/ginger/components`. SC-PET-001's Home isn't a Ginger screen, and showcases shouldn't import Ginger pod pieces for a generic header.

### 2. The search field is a `<button>` styled as the design's text field

The search field is an inert stand-in. A real `<input>` would take focus, open a keyboard and accept typed text that goes nowhere. A `<button type="button">` named by the placeholder gives one tab stop and one announced name, and its click is easy to record.

Its look follows the Figma `Text-field`: 44 px high, white, a 1 px gray border, rounded corners, a leading search icon and the placeholder in gray. The exact values come from `get_design_context` during implementation.

*Alternative:* reusing the shared `TextField`. It needs a visible label, and it reports typed values, which conflicts with being inert.

### 3. Layout from `home-topbar`

The header keeps the current surface (radius, gradient, shadow, `pt-(--status-bar-h)`). Inside it:
- a row, with an 8 px gap, of the 48 px avatar (`size-12`, up from `size-11`) and a text column;
- the text column holds the greeting as the existing `h1` (`text-xl font-semibold`), then a line of a 14 px shield-lock icon, a 4 px gap and the sharing text (`text-xs text-gray-600`);
- the search field, 20 px below the row.

Horizontal padding stays 20 px. The shield-lock and search icons are the design's own SVGs (`shared/ui/icons/shield-lock.svg` and `search.svg`), because no icon in the project or `react-bootstrap-icons` matches them exactly. Exact spacing, sizes and colours are taken from `get_design_context` (with the `figma-design-to-code` skill loaded first), mapped to the existing theme tokens, and checked against the Figma screenshot in a browser.

### 4. Search events: `onSearchSelect` on `GingerHomeView`, `search_selected` in each experiment

`GingerHomeView` gains an optional `onSearchSelect` and passes it to `HomeTopBar`. The Home screens of EXP-PET-003, EXP-PET-004 and EXP-PET-005 pass `() => track('search_selected')`, and each flow's `*Events` type gains `search_selected: undefined`. All three experiments use the same event name, following the analytics convention. SC-PET-001 passes nothing, because showcases aren't tracked.

### 5. Strings

The flows' existing greeting and initial keys stay: `flows.scPet001.home.welcome` and `.userInitial`, and `pods.ginger.home.welcome` and `.userInitial`. New keys:
- `ui.homeTopBar.sharing`: "Device-to-device sharing, pod members only."
- `ui.homeTopBar.search`: "Search, or ask Telli…"

## Risks / Trade-offs

- [Live studies change mid-run] → Everyone in an experiment sees the new Home header from the next deployment. The proposal notes the `hidden` flag, or holding the deployment, as options. Nothing in the task flows changes.
- [A button that looks like an input may confuse sighted keyboard users] → It's a prototype stand-in, and the experiments record activations, so confusion shows up as `search_selected` wrong turns.
- [Two `h1` sources] → None: the greeting remains the only heading in the header.
