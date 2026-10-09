## 1. Flow kind

- [x] 1.1 Split `FlowDefinition` in `slices/flow/runtime/define-flow.ts` into `ExperimentDefinition | ShowcaseDefinition`, discriminated by a required `kind`. On showcases, `code`, `variants`, `variantSelection` and `defaultVariant` are `?: never` (design D1). Add `kind: 'experiment'` to `exp-pet-002/flow.ts`. Verify that `pnpm check-types` passes.
- [x] 1.2 Add type-level tests (`define-flow.test-d.ts`, or `// @ts-expect-error` cases in an existing vitest file) showing that a flow without `kind` fails, and that a showcase with `variants` or `code` fails. Verify that `pnpm check-types` passes and every `@ts-expect-error` is used.
- [x] 1.3 Add `kind` to `ResolvedFlow` in `resolve-flow.ts`. Extend `resolve-flow.test.ts` with a showcase that resolves with `variantId: null` and `kind: 'showcase'`. Verify that `pnpm --filter app-ux-flows test` passes.

## 2. Analytics opt-out for showcases

- [x] 2.1 Add an `enabled` input to `useFlowRunAnalytics`. When it's false, return a constant `disabledFlowRunTracker` whose `sync`, `restart`, `track` and `end` do nothing, and never create a `FlowRunTracker` (design D2). Pass `enabled: flow.kind === 'experiment'` from `FlowRunner`. Verify that check-types passes.
- [x] 2.2 Add a test (for example `use-flow-run-analytics.test.tsx` with `@testing-library/react` if it's already available, otherwise a unit test of an extracted `selectFlowRunTracker(enabled, create)`) proving that a disabled tracker makes no sink calls and doesn't touch run storage, and that an enabled one still records `flow_started`. Verify that the tests pass.

## 3. Shared Ginger pod module

- [x] 3.1 Create `slices/flow/pods/ginger/model.ts` with `Pod`, `MedicationRecord`, `gingerPod`, `gingerMedication`, `PodTab`, the `GingerPodComponents` type and the shared atoms `podAtom`, `medicationAtom`, `medicationFormAddedAtom`, `noteTextAtom` and `addMedicationFormAtom`. Move `assets/ginger-avatar.png`, `medication-fields.ts` and `medication-fields.test.ts` there. Keep `showAiSuggestionAtom`, `sheetOriginAtom`, `ExpPet002Events` and the screen ids in `exp-pet-002/model.ts`, importing from the pod module. Verify that check-types and the tests pass.
- [x] 3.2 Move the i18n keys the shared pieces use from `flows.expPet002.*` to `pods.ginger.*` in `app/locales/en.ts` (tabs, notes, medication, the forms title, empty title and message, add contact info, create form, and categories), per design D3. Update every `t()` call that uses them. Verify by grepping that no remaining `flows.expPet002.` key in `src/` is missing from `en.ts`.
- [x] 3.3 Move `GingerTopBar` to `pods/ginger/components/` with props `{ tab, onTabSelect }`, and no `useFlowAnalytics` or `useFlowNavigation`. Add `exp-pet-002/components/exp-pet-002-top-bar.tsx`, which tracks `pod_tab_selected`, maps Notes and Info to screens and keeps Chat inert. Replace its uses in the exp-pet-002 screens and `PodInfoView`. Verify that check-types passes.
- [x] 3.4 Move `NotesArea` and `MedicationFormCard` to `pods/ginger/components/`. Extract the Medical, Attachments, Subpods and Members rows into `pods/ginger/components/ginger-category-rows.tsx` with an optional `onOpenMedical`. Rebuild exp-pet-002's `PodInfoView` from them, keeping its AI suggestion, add-form action and tracking. Verify that `exp-pet-002.test.ts` and `pnpm --filter app-ux-flows test` pass.
- [x] 3.5 Regression-check EXP-PET-002 in `pnpm ux-flows:dev` with the console adapter on. In variants `a` and `b`, the screens look the same, Chat is still inert, and the same events are logged (`pod_tab_selected`, `medical_opened`, `add_form_clicked`, `add_form_dismissed`, `medication_form_added`, then silent completion). Also run `pnpm --filter app-ux-flows knip` and check that it reports no unused files or exports.

## 4. Chat building blocks

- [x] 4.1 Add `shared/ui/chat-message.tsx` (`author: 'user' | 'agent'`, with a dark-circle agent avatar), `chat-suggestion-chip.tsx` (plus icon and label button) and `chat-thread.tsx` (`role="log"`, anchored to the bottom), all styled to the Figma frames 1203:26045 and 1203:26028 using theme tokens (design D4). Verify by viewing them in the showcase (task 5.3).
- [x] 4.2 Add `shared/ui/chat-composer.tsx` with `{ value, placeholder, readOnly?, sendLabel, onSend }`. It sends on Enter and on the send button, and ignores empty values. Add `chat-composer.test.tsx` covering a send via button, a send via Enter, and no send when empty. If there's no DOM test setup, extract `shouldSend(value)` and unit-test that instead. Verify that the tests pass.
- [x] 4.3 Export `chatComponents` and a `ChatComponents` type from `shared/ui/chat-components.ts`, following `pod-components.ts`. Verify that check-types passes.

## 5. Chat medication showcase

- [x] 5.1 Create `flows/chat-add-medication/model.ts` with the screen ids (`ginger-notes`, `chat`, `ginger-info`, `medication-added`), a `ChatAddMedicationComponents` type (default, pod and chat components), an initial-state type (`pod?`, `medication?`), `chatStageAtom` (`'draft' | 'sent' | 'replied'`) and `TELLI_REPLY_DELAY_MS = 1000`. Verify that check-types passes.
- [x] 5.2 Add the screens:
  - `GingerNotesScreen` (`NotesArea`),
  - `ChatScreen` (thread, user bubble once the stage isn't `draft`, Telli reply and chip when `replied` and not yet added, a read-only composer pre-filled while in `draft`, and a delay effect from `sent` to `replied` with cleanup),
  - `GingerInfoScreen` (Forms label, the empty state without an action or the medication card, divider, inert category rows),
  - `MedicationAddedScreen` (adds the form and calls `complete({ showCompletionView: false })` in `useLayoutEffect`, then renders the Info view with the card).

  All four use a showcase top bar wrapper that maps all three tabs to screens. Verify that check-types passes.
- [x] 5.3 Add `flows/chat-add-medication/flow.ts` (`kind: 'showcase'`, `initialScreen: 'ginger-notes'`, design frames `1212-28435`, `1203-26045` and `1203-26069` for `ginger-notes`, `chat` and `medication-added`, and `createStore` seeding the pod and medication atoms, with `chatStageAtom` set to `'draft'`). Register it after `expPet002Flow` in `registry.ts`. Add en strings under `flows.chatAddMedication.*` (title, description, the user message, the Telli reply, the chip label, the composer placeholder and send label). Verify in `pnpm ux-flows:dev` that the whole path from Notes to Chat, send, reply, chip and `medication-added` matches the Figma section, that tab switching works, and that the reply appears after returning mid-delay.
- [x] 5.4 Add `chat-add-medication.test.ts`. The flow has `kind: 'showcase'` and no variants, the registry lists it, `createStore()` starts at `draft` with the form not added, and setting `addMedicationFormAtom` twice leaves a single added form. Verify that the tests pass.
- [x] 5.5 Add chat loading states (design D5, Mee Design System chat items "Me" and "Typing message"). Add `ChatMessageStatus` and `ChatTypingIndicator` to the chat components, with the ellipsis animated except under `prefers-reduced-motion`. Extend `chatStageAtom` to `draft | sending | typing | replied`, with `nextStage` timings `SEND_DELAY_MS = 800` and `TELLI_TYPING_MS = 2500`. Render "Sending…", then "Sent" with "Telli is typing...", then the reply. Extend `chat-add-medication.test.ts` to cover stage order and timings. Verify that the tests and check-types pass.

## 6. Home page sections

- [x] 6.1 Add `kind` to the home loader's `FlowLauncher` in `routes/home.tsx`. Extract the existing card markup in `slices/home/home-page.tsx` into `FlowCard`, with the title as `<h3>`. Render "Experiments" and then "Showcases" sections with `<h2>` headings (`home.sections.experiments`, `home.sections.showcases`), skipping empty groups and keeping registry order (design D6). Extract the grouping as a pure `groupFlowsByKind(flows)` with a unit test covering order and empty groups. Verify that the tests pass.
- [x] 6.2 Verify in dev that the showcase card shows its catalogue with no code and no variants, with the base flow's screens and Figma links. Verify with `pnpm --filter app-ux-flows build` and `pnpm --filter app-ux-flows preview` that production lists the Showcases section with a single start action and no catalogue.

## 7. Analytics verification and final checks

- [x] 7.1 With Matomo running (`just matomo-start`) and `.env.local` configured, run the showcase start to finish and reload it. In the browser network tab, check that no `matomo.php` request is made for showcase screens, that the console shows no `[Flow Analytics]` entries, and that `sessionStorage` has no run entry for `chat-add-medication`. Then start `exp-pet-002` and check that `flow_started` and its page view are sent.
- [x] 7.2 Run `pnpm check-types`, `pnpm lint`, `pnpm --filter app-ux-flows test` and `pnpm --filter app-ux-flows knip` from the repo root, and check that all pass with no errors.
- [x] 7.3 Run `openspec validate add-chat-medication-showcase --strict` and check that it reports the change as valid.
