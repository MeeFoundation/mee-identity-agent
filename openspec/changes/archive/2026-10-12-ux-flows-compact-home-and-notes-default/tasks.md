## 0. Prerequisite

- [x] 0.1 Confirm `sc-pet-001-cases-and-briefing` is archived. Verify that `openspec/specs/app-ux-flows/showcases/sc-pet-001/spec.md` contains "Cases and goals" and "Quick actions in the Telli chat"; if not, stop and ask the user to archive it.

## 1. Home page

- [x] 1.1 Change `sectionOrder` in `slices/home/group-flows.ts` to showcases first. Update `group-flows.test.ts` to assert the new order. Verify with `pnpm --filter app-ux-flows test group-flows`.
- [x] 1.2 Add counted section heading strings (`home.sections.showcases` / `experiments` with `{{count}}`) in `app/locales/en.ts`. Render them with `t(key, { count })` in `home-page.tsx`. Verify the headings read "Showcases (2)" and "Experiments (4)" in the dev server.
- [x] 1.3 Replace `FlowCard` with a `FlowRow` (`slices/home/flow-row.tsx`), shown as one bordered `divide-y` list per section, as in design §1:
  - a development-only code chip from `catalogue.code`;
  - the title, and a `line-clamp-1` description with `title`;
  - variant and case pills as `Button size="s" variant="outlined"`, with the description in `title` plus an `sr-only` `aria-describedby` span;
  - the single Start action;
  - the collapsed `FlowCatalogue` under the text.

  Remove `flow-card.tsx` and the unused `home.chooseVariant` / `home.chooseCase` keys. Verify in the dev server at 1280 px that all six flows fit on one screen with catalogues collapsed. At 375 px, verify that actions wrap below the title and there is no horizontal scroll.
- [x] 1.4 Check the production build: `pnpm --filter app-ux-flows build`, then preview. Verify there are no code chips, catalogue or assignment text, and that showcases still have their start actions.

## 2. Segmented tabs dot

- [x] 2.1 Add optional `dot?: boolean` to `SegmentedTab` in `shared/ui/segmented-tabs.tsx`. It renders a brand-coloured `aria-hidden` dot and an `sr-only` translated "new" label (new locale key). Verify that tabs without `dot` render unchanged and that a dotted tab's accessible name includes the label.

## 3. Shared notes module

- [x] 3.1 Move `NotesArea` and `noteTextAtom` from `pods/ginger/` to `slices/flow/pods/notes/`, and update imports in exp-demo-001, exp-pet-002, exp-pet-003, exp-pet-004 and chat-add-medication. Verify with `pnpm check-types` and `pnpm --filter app-ux-flows test`.

## 4. Experiments open on Notes

- [x] 4.1 EXP-PET-003: set `DEFAULT_POD_OPENING_TAB = 'notes'` and update `exp-pet-003.test.ts` expectations for the default. Verify that the test passes, and that in the dev server opening Ginger from Home shows `ginger-notes`.
- [x] 4.2 EXP-PET-004: in `screens/home-screen.tsx`, navigate to `ginger-notes` when the Ginger row is opened. Add or update a test or manual check that `pod_opened` is still recorded. Verify that Ginger opens on Notes in every variant.
- [x] 4.3 EXP-DEMO-001: add the `ginger-notes` screen id and screen (using `NotesArea`), and set `initialScreen: 'ginger-notes'`. Add a top bar that switches Notes ↔ Info with Chat inert, and use it on `ginger-notes`, `ginger-info` and `medication-added`. Update `exp-demo-001.test.ts`. Verify that `/flows/exp-demo-001?variant=b` lands on Notes, and that Info shows variant B's card.

## 5. SC-PET-001 Notes-first pod

- [x] 5.1 In `sc-pet-001/model.ts`:
  - add `'pod-notes'` to `ScPet001ScreenId`;
  - add `suggestionReadyAtom` (reset in `createStore`);
  - add the derived `infoHasDotAtom` and `podInfoScreenAtom`, as in design §5.

  Unit-test both derived atoms across generic, suggestion-ready, dismissed, applied, and null-template states.
- [x] 5.2 Add a `useSuggestionTimer` hook that sets `suggestionReadyAtom` 1.5 s after mount while a suggestion should be offered. Use it in `pod-empty-screen.tsx`, replacing the navigation timer. In `pod-empty`, navigate to `pod-template-suggested` when `infoHasDotAtom` becomes true. Verify in the dev server that opening Info early still shows the suggestion after about 1.5 s.
- [x] 5.3 Give `PodView` a `tab: 'notes' | 'info'` prop. Wire `SegmentedTabs` so Notes goes to `pod-notes` and Info goes to `podInfoScreenAtom`, with `dot` on Info from `infoHasDotAtom`. Add `screens/pod-notes-screen.tsx`, which renders the top bar with Notes selected and `NotesArea`, runs `useSuggestionTimer`, and completes silently when the pod has a category. Register it in `flow.ts` (no Figma frame) and reset `noteTextAtom` in `createStore`. Verify:
  - a generic pod shows the dot after about 1.5 s;
  - Info then shows the suggestion;
  - "Not now" and "Use template" both clear the dot.
- [x] 5.4 Route every pod entry to `pod-notes`:
  - "Create Pod" in `new-pod-screen.tsx`;
  - "Create pod" and "Open pod" in `quick-action-card.tsx`.

  Verify that cases A, B and C all land on `pod-notes`, and that case B completes there.
- [x] 5.5 Add the `pod-notes` hint ("Look around the pod — a dot shows where something is waiting.") to `flow.ts` and `en.ts`. Verify that the briefing panel shows it on `pod-notes`.
- [x] 5.6 Update `sc-pet-001.test.ts` to cover:
  - Notes-first entry;
  - the Info routing;
  - completion when created as a pet;
  - the `pod-notes` direct link creating generic Ginger.

  Verify with `pnpm --filter app-ux-flows test sc-pet-001`.

## 6. Remove role

- [x] 6.1 Remove `role` from `CreatePodInput` and `creatorRole` from `PodInstance` in `pods/catalog/create-pod.ts`, and update `create-pod.test.ts`. Verify that the test passes.
- [x] 6.2 Remove `roleAtom`, its reset and its uses in `sc-pet-001/model.ts` and `flow.ts`, the role `TextField` in `new-pod-screen.tsx`, the `flows.scPet001.newPod.role` locale key, and the role assertions in `sc-pet-001.test.ts`. Verify that `grep -rni role apps/app-ux-flows/src/slices/flow` shows no pod-role usage, and that the New Pod sheet has no role field.

## 7. Quality gates

- [x] 7.1 Run `pnpm check-types`, `pnpm lint` and `pnpm --filter app-ux-flows test`, plus `pnpm --filter app-ux-flows exec knip` if configured. All must pass with no new warnings.
- [x] 7.2 Click through every flow from the home page in the dev server. Confirm that each pod opens on Notes, that Notes ↔ Info switching works, and that EXP-PET-002 and chat-add-medication are unchanged.
- [x] 7.3 Run `openspec validate ux-flows-compact-home-and-notes-default --strict` and confirm it reports the change as valid with no archive warnings.
