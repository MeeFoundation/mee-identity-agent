## 1. Runtime: showcase cases, goals and hints

- [x] 1.1 Add `CaseDefinition` and `cases?` on `ShowcaseDefinition` (with `cases?: never` on experiments, and `variants` still forbidden on showcases), plus `goalKey?` and `hints?` on `FlowBase` and on cases. Verify that `define-flow.test.ts` type-checks a showcase with cases, and reports `@ts-expect-error` for cases on an experiment and for variants on a showcase.
- [x] 1.2 Resolve the active case in `resolveFlow` (case id as an extra cache key; initial state, goal and hints merged over the base) and expose `caseId`, `caseCode`, `caseNameKey`, `goalKey`, `hints` and `cases`. Verify with `resolve-flow.test.ts` covering first-case default, goal replacement, per-screen hint merge, and case initial state over base defaults.
- [x] 1.3 Add the `case` search parameter to `routes/flow-search.ts` and the screen route, drop unknown values with a replace navigation, keep the parameter on every navigation, and key `FlowRunner` by case. Verify in the browser that the "Open a case by URL", "Showcase opened without a case" and "Unknown case in the URL" scenarios work.
- [x] 1.4 Add `onRunChange` to `FlowRunner`, reporting `{ id, completed, restart }` on every run or completion change. Verify with `pnpm check-types` and the briefing browser checks in 6.2.

## 2. Briefing UI

- [x] 2.1 Add `slices/flow/briefing/` with `MissionCard`, `BriefingPanel` and `BriefingButton`, plus the `flow.briefing.*` strings. Verify with `pnpm check-types` and `pnpm lint`.
- [x] 2.2 Render `MissionCard` from `FlowRunner` for showcases whose run starts on the initial screen, once per run id. Verify in the browser:
  - the card blocks the screen until "Start";
  - a direct link to a later screen shows no card;
  - "Start over" shows the card again.
- [x] 2.3 Render `BriefingPanel` in the route's side panel and `BriefingButton` at ≤480 px, showing the case code and name, the goal, the current screen's hint and "Start over". On completion they show "Goal reached" and the "Try case" links. Verify in the browser at desktop and 400 px widths.
- [x] 2.4 Show the home card's "Choose a case:" list (code and name, `?case=` links) for showcases with cases, and list cases in the development catalogue. Verify on the home page that the "Choose a case" scenario works, and that the catalogue shows SC-PET-001's cases with screen links carrying `?case=`.

## 3. Shared components

- [x] 3.1 Add `AppTabBar` (`shared/ui/app-tab-bar.tsx`) to `podComponents`, styled after Figma `bottom-menu`, with navigation and current-page semantics. Verify in the browser on `home` and `telli`.
- [x] 3.2 Add `ChatActionCard` (`shared/ui/chat-action-card.tsx`) to `chatComponents`, styled after "Pod / Chat - 5": title with avatar or icon, label/value rows, an optional status, and an action that can be unavailable. Verify in the browser on `telli`.

## 4. SC-PET-001 Telli and quick actions

- [x] 4.1 Add the conversation types and atoms (`conversationAtom`, `telliProgressAtom`, `usedActionTurnAtom`, `newPodOriginAtom` and `categoryFromTelliAtom`), the write atoms `sendNextMessageAtom` and `applyQuickActionAtom`, and the pure `nextTelliStage`. Verify with unit tests covering:
  - only idle sends;
  - stages advance in order;
  - each card applies its own draft and keeps the role;
  - a card with a name creates the pod directly, one without does not;
  - no quick action is applied after the pod exists.
- [x] 4.2 Add the `telli` screen: Telli top bar, greeting, played turns, cards, prepared composer, and tab bar with Ask Telli active. The timers resume on return. Verify in the browser that the "Telli is thinking", "Nothing to say in case A" and "Conversation in two turns" scenarios work.
- [x] 4.3 Make the cards act on their own drafts (a draft with a name creates the pod directly, one without opens the sheet) and, after creation, show "Pod created" with "Open pod" on the used card and leave the others unavailable. Verify in the browser that the "Act early", "Act on the full card" and "Card after creation" scenarios work.
- [x] 4.4 Make `new-pod` render over its origin (Home or `telli`), pre-fill from a quick action, and show the "Suggested by Telli from your chat" caption until the category changes. Verify in the browser that the "Pre-filled by Telli" and "Dismiss without creating" scenarios work.
- [x] 4.5 Add the tab bar to `home`, with Ask Telli opening `telli`. Verify in the browser that the "Open Telli" scenario works.

## 5. SC-PET-001 cases

- [x] 5.1 Declare `cases` `a`, `b` and `c` on the showcase: codes, names, goals, hint overrides and conversations (as case `initialState`). Also add the base goal and hints, and the `telli` design frame. Move every case string to `flows.scPet001.cases.*`. Verify with `sc-pet-001.test.ts`, updated for the three cases, a goal per case, and the conversation shapes.
- [x] 5.2 Update the existing SC-PET-001 and registry tests for cases (every case resolves, codes are unique, case ids are URL-safe). Verify that `pnpm --filter app-ux-flows test` passes.

## 6. Checks

- [x] 6.1 Run `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows knip`, and verify that all report no errors.
- [x] 6.2 Run the browser scenario for every case:
  - A: mission card, Add Pod path, Goal reached with the "Try case" links;
  - B: Telli one turn, card, pod created directly, Pet structure;
  - C: two turns, act early and act late;
  - Start over;
  - direct links;
  - the phone-width Goal button.

  Verify that there are no page errors.
- [x] 6.3 Run `openspec validate sc-pet-001-cases-and-briefing --strict` and verify that it passes.
