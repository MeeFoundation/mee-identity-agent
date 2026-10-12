## Why

SC-PET-001 "Create Ginger" can only be run one way (the Add Pod button), and nothing tells a tester what they are supposed to do. The home-page description disappears once the flow starts, and the side panel is hidden entirely on phones. There is also no way back to the start without reloading the page, because showcases complete silently and the restart action lives only in the completion view. The Tellipod design also lets people create a pod through Telli, and the research question is how those paths compare. So each showcase needs told cases, a visible goal, and a way to start over. Figma's Home also has a bottom app bar (Home, Ask Telli, Navigation) that the prototype lacks.

## What Changes

- **Showcase cases.** A showcase may declare cases: the tasks a tester can be told to do. Cases are not variants. A variant is an alternative design compared in a study; a case shares the showcase's screens and differs only in its goal, hints and starting data. The tester always picks the case, through a "Choose a case:" picker on the home card or the `?case=` URL parameter. Showcases stay untracked.
- **Briefing for showcases:**
  - **Goal:** the flow, or its case, declares a goal: what the tester is asked to do.
  - **Mission card:** a run starts with a card over the phone showing the goal and a Start action.
  - **Side panel:** the goal and a hint for the current screen stay visible beside the phone, and on phone widths a "Goal" button opens the same content.
  - **Goal reached:** completing the run shows a "Goal reached" message that links to the other cases.
  - **Start over:** restarts the run from the beginning at any time.
- **Shared app tab bar.** A new design-system component following Figma's `bottom-menu`, with Home, Ask Telli and Navigation. Screens opt into it.
- **Chat action card.** A new chat component following Figma's pod-chat frames, where Telli answers with an embedded card. It shows what Telli understood as labeled rows plus one action.
- **SC-PET-001 gets three cases:**
  - A: with the Add Pod button.
  - B: with Telli, one message.
  - C: with Telli, a conversation in which a quick action appears after each Telli reply, holding what Telli knows so far.
- **New `telli` screen.** The global Telli chat, reached from the Ask Telli tab. The conversation is scripted per case: the tester sends prepared messages and Telli replies after a "thinking" pause. When Telli has enough data, its reply carries a quick action. Activating one that names the pod creates it at once and shows it, with the Pet structure when the category is Pets. One without a name opens the New Pod sheet, pre-filled with the category and captioned as suggested by Telli.
- **Out of scope:**
  - real message parsing or AI;
  - free typing in the Telli chat;
  - a progress checklist and a hint on/off mode;
  - timestamps and the "joined" system message in chat;
  - analytics for showcases;
  - changing `chat-add-medication`'s suggestion chip.

## Capabilities

### New Capabilities
- `app-ux-flows/flow-briefing`: the tester briefing for showcases. It covers the goal, the mission card, the side panel with per-screen hints, the "Goal reached" moment with links to other cases, and "Start over".

### Modified Capabilities
- `app-ux-flows/flow-runtime`: adds "Showcase cases" (definition, `?case=` parameter, first case by default). In "Flow definition", showcases may declare cases (still never variants), experiments may not, and any flow may declare a goal and hints. In "Home page lists available flows", showcases with cases get a "Choose a case:" picker, and the catalogue lists cases.
- `app-ux-flows/design-system`: adds the app tab bar component and the chat action card component.
- `app-ux-flows/showcases/sc-pet-001`: adds cases A, B and C, the Telli screen with its scripted conversation and quick actions, the tab bar on Home and Telli, and the New Pod sheet pre-filled from a quick action.

## Impact

- `apps/app-ux-flows/src/slices/flow/runtime/`:
  - `define-flow.ts` (showcase `cases`, `goalKey`, `hints`);
  - `resolve-flow.ts` (resolving the active case, goal and hints);
  - `flow-runner.tsx` (reports the run's state and restart to the page around it).
- `apps/app-ux-flows/src/routes/`: the `case` search parameter, the briefing side panel, the phone-width Goal button and the mission card.
- `apps/app-ux-flows/src/slices/home/` and `slices/flow/catalogue.ts`: the case picker and the catalogue's cases.
- `apps/app-ux-flows/src/shared/ui/`: new `app-tab-bar.tsx` and `chat-action-card.tsx`.
- `apps/app-ux-flows/src/slices/flow/flows/sc-pet-001/`: cases, the `telli` screen, the conversation script and quick actions, and the pre-filled New Pod sheet.
- `apps/app-ux-flows/src/app/locales/en.ts`: briefing, tab bar, Telli and case strings.
- No new dependencies, no analytics changes. Existing flows without a goal behave as before.
