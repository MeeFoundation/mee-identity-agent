## 1. Flow shell

- [x] 1.1 Add `apps/app-ux-flows/src/slices/flow/flows/sc-onb-004/model.ts` (screen ids from the spec) and `flow.ts` (`kind: 'showcase'`, `SC-ONB-004`, no cases, no design frames, `landing` initial, hints and `screenNotes`); register `scOnb004Flow` immediately after `scOnb003Flow` in `registry.ts`; verify the home page lists it under Onboarding after Living pod
- [x] 1.2 Add `flows.scOnb004.*` to `en.ts` (title, description, goal, a hint per screen, the flow's three questions, and each screen's explanation and questions from the spec); verify every string quoted in the spec is present verbatim
- [x] 1.3 Add `sc-onb-004.test.ts` for registry entry, order after SC-ONB-003, ten screens, no Figma frames, no cases, and translated notes; update only id-list assertions in other tests (for example `chat-add-medication.test.ts`); verify `pnpm --filter app-ux-flows test` still passes for SC-ONB-001–003

## 2. Landing and tour

- [x] 2.1 Build `landing` (wordmark, headline, decorative cluster, Show me around, skip to setup) with prototype motion and reduced-motion rest; verify Show me around opens `pod-anything` and skip opens `setup`
- [x] 2.2 Build tour chrome (Back, wordmark, Skip except last beat, pager "Step N of 3", Next / Got it let's set up); verify Back, Next, Skip and last-beat action against the spec, including setup Back to `yours-to-keep` or `landing`
- [x] 2.3 Build `pod-anything` (five examples, 5600 ms auto-advance, swipe, tab stops auto-advance); verify Reno shows Kitchen reno and fake timers advance the tabs
- [x] 2.4 Build `share-once` with the share-story timeline (555-0142 → 555-0199); verify the synced number after timers
- [x] 2.5 Build `yours-to-keep` (staggered "No …" lines, then dim + closing line); verify the closing line after the prototype delays
- [x] 2.6 Honor reduced motion on landing and all three beats; verify beat 1 does not auto-advance and beat 2 starts synced

## 3. Setup

- [x] 3.1 Build `setup` (copy, phone illustration, Set up on this phone, Pair with my other device); verify the two actions open `profile-choose` and `pairing`
- [x] 3.2 Build `profile-choose` plus simulated contacts dialogs (Don't Allow → empty form, pick fixture → filled form) without OS Contacts; verify both paths
- [x] 3.3 Build `profile-form` (required first name, optional fields, privacy copy); verify empty first name stays, a name opens `devices` labelled "{name}'s Tellipod", and nothing is stored outside the run
- [x] 3.4 Build `devices`, `pairing` and `next`; verify pairing Close does not complete, I'll do this later shows `next` with Goal reached, and Replay intro starts a new run on `landing`

## 4. Isolation and quality

- [x] 4.1 Confirm `sc-onb-001`, `sc-onb-002`, `sc-onb-003` and `pods/tellipod-intro/` have no source edits, and that `app-tellipod` is untouched; verify git diff is limited to the new flow, `en.ts`, `registry.ts`, and id-list tests
- [x] 4.2 Walk SC-ONB-004 in `pnpm --filter app-ux-flows dev` (393×852): landing, tour, skip, setup, profile, devices, pairing, replay, reduced motion; verify briefing notes follow each screen
- [x] 4.3 Run `pnpm lint`, `pnpm check-types` and `pnpm --filter app-ux-flows test`, and verify all pass
