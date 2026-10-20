## 1. Art and copy from the artifact

- [x] 1.1 Capture the four beat illustrations from the "Tellipod Intro" artifact. Use a throwaway CDP script against a local copy of the artifact at `?v=1` and a 393 px phone width, outside the repo. Save them as `apps/app-ux-flows/src/slices/flow/flows/sc-onb-001/art/{rooms,ginger-pod,paula,welcome}.svg`, with react-native-svg attributes stripped and `viewBox` kept. Verify each file opens in the browser and matches its beat's screenshot (house with three rooms; Ginger's room close-up; two phones with a dotted line; house with the outgoing line)
- [x] 1.2 Find or add the Tellipod logo mark (check `apps/app-tellipod` first, otherwise `sc-onb-001/art/logo.svg`), and verify it renders at 24 px
- [x] 1.3 Add `flows.scOnb001.*` to `app/locales/en.ts` (title, description, goal, beat headlines split at the accent, sublines, art text alternatives including the three demo states, labels, hints, pod card text, stand-in titles and bodies, "Prototype stand-in", "Replay intro", explanations and questions), plus `home.families.onboarding: 'Onboarding'`. Verify every string quoted in the spec is present verbatim

## 2. Model and navigation

- [x] 2.1 Create `sc-onb-001/model.ts` with `ScOnb001ScreenId` (seven ids), `demoAtom`, the derived phase (`before | suggested | added`), the write atoms `inviteTelliAtom`, `addRowAtom(row)`, `addAllAtom` and `resetDemoAtom`, and `lastMoveAtom`. Unit-test the transitions: invite → suggested; add one → still suggested; add the other or add all → added; reset → before
- [x] 2.2 Add the intro navigation helper (`next`, `back`, `skip` set `lastMoveAtom`, then call `goToScreen` or `back()`), and unit-test which screen each beat's Next and Skip go to

## 3. Layout and overlays

- [x] 3.1 Build `components/intro-layout.tsx`: a top bar (Back from beat 2, logo, Skip until beat 3), a fixed-aspect art box with `role="img"` and its label, a percentage-positioned overlay slot, the headline with accent spans and `whitespace-pre-line`, the subline, actions, and the pager with "Step N of 4". Verify at 393×852 in the frame and at 390 px full-screen that nothing overflows or scrolls
- [x] 3.2 Add the entry animation (fade plus a direction-dependent zoom of about 450 ms, keyed on `lastMoveAtom`, with a 150 ms fade under `motion-reduce`). Verify forward, back and skip in the browser, and with reduced motion emulated in DevTools
- [x] 3.3 Build `components/room-tag.tsx`, `member-stack.tsx`, `ginger-pod-card.tsx` (inert `SegmentedTabs`, Notes / suggested Info / saved Info bodies, per-row add control, "Add all suggested info") and `synced-pod-card.tsx` (sent and received message). Verify each against the matching artifact screenshot, and that the inert tabs don't take focus or change selection

## 4. Screens and flow

- [x] 4.1 Build `screens/rooms-screen.tsx` with the Kyoto trip, Ginger and Sofia tags over the art, where the Ginger tag is a button "Enter Ginger's pod" with the hint "Same as Next". Verify in the browser that the tag and Next both open `ginger-pod`
- [x] 4.2 Build `screens/ginger-pod-screen.tsx`, which resets the demo on mount and has the Telli badge by the door, the member stack, the card and per-state text alternatives. Verify all three states, adding a single row, skipping the demo, and that Back from `paula` returns to **Before**
- [x] 4.3 Build `screens/paula-screen.tsx` and `screens/welcome-screen.tsx` (two synced cards with "Your phone" and "Paula's phone"; Ginger tag with you, Telli and Paula and the red dot; Get Started and the two links). Verify each against its screenshot
- [x] 4.4 Build `screens/stand-in-screen.tsx`, used for `telli-handoff` (completes on mount without the completion view), `existing-device` and `restore`, with "Replay intro" calling `restart()`. Verify "Goal reached" appears only for `telli-handoff`
- [x] 4.5 Write `sc-onb-001/flow.ts` (`kind: 'showcase'`, `SC-ONB-001`, no cases, goal, hints, `questionKeys` and `screenNotes` from the spec, no design frames), register it last in `slices/flow/registry.ts`, and add `'SC-ONB'` to `slices/home/flow-families.ts`. Verify the flow appears on the home page with a single start action

## 5. Tests and checks

- [x] 5.1 Add `sc-onb-001/sc-onb-001.test.ts` following `sc-ppl-001.test.ts`: registry entry, code, seven screens, no design frames, no cases, the notes for each screen and the flow's three questions, and the store starting in **Before**. Verify with `pnpm --filter app-ux-flows test`
- [x] 5.2 Walk the whole intro in `pnpm --filter app-ux-flows dev`: every spec scenario, at the desktop frame and at 390 px, with keyboard-only navigation, and the briefing notes following each beat
- [x] 5.3 Run `just check` (`pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test`, `pnpm --filter app-ux-flows knip`) and `openspec validate add-sc-onb-001-rooms-intro --strict`, and verify both pass with no errors

## 6. Rework: port the artifact's animation engine

- [x] 6.1 Add `useFlowScreen()` to `runtime/flow-context.ts` (current screen id from the runner's context), and verify with a `renderScreen`-based test that a screen reads its id
- [x] 6.2 Port the pure engine to `sc-onb-001/engine/`: `math.ts` (1007), `timeline.ts` (1018 + 1080), `camera.ts` (1006), `drivers.ts` (1028), `clock-plan.ts` (1079) and `values.ts` (1027 derived values and gates). Unit-test the camera at each key, `qOf`, `V2of` and `V3of` at their breakpoints, `planMove` for forward, back and over-story moves, `warpAt`, `rubber` and `panTarget`
- [x] 6.3 Build `engine/runtime.ts` (shared values, timing, delay, sequence, repeat, spring, cancel with finish callbacks, rAF ticker, reactions, `useFrameStyle`, `useFrameAttrs`, `useFrameState`), and unit-test the callback semantics with a fake clock: finish, cancel, overwrite, sequence and delay
- [x] 6.4 Port the controller `useIntroClock` (1078, v1 only, no haptics) to `engine/clock.ts`, including next, back, skip, goTo, invite, add-all, settle, pulses, the reduced-motion fades and drag begin/move/end/cancel. Verify in the browser that Next, Back and Skip land on each beat with the right story state
- [x] 6.5 Port world geometry, palette and the static scene (1014, 1015 colours, 1016, 1019, 1020, 1021) to `sc-onb-001/scene/`, plus the animated parts (1022 line, 1024 door, 1025 Paula's phone) and `world-svg.tsx` (1010) with the camera matrix and feather masks. Verify against artifact screenshots at rest on all four beats
- [x] 6.6 Port the overlays (1031 key chip, 1032 tag pill, 1043/1044 attention ring, 1047 anchors, 1068 side tags / Ginger tag / Ginger stack / Paula tag, 1069, 1070, 1071 sync cards, 1072 Telli flyer) and the note card (1048, 1058, 1062–1065) to `sc-onb-001/overlays/`, using app strings and tokens. Verify each beat and the beat-2 story states against the artifact
- [x] 6.7 Port the layout (1013, non-tap branch) and chrome (1084–1091: top bar, copy, actions, pager) to `sc-onb-001/chrome/`, with copy and actions following the target beat. Verify at 393×852 in the frame and at 390 px full-screen
- [x] 6.8 Add the pointer pan (12 px activation, 16 px vertical fail, velocity over the last 100 ms) to the stage and copy, wired to the controller's drag handlers. Verify scrubbing, fling, rubber band and that taps on Invite Telli and the Ginger tag still work
- [x] 6.9 Build `IntroScreen`, used by the four beat routes, which syncs the route and the controller both ways (moves push the beat's screen id, and browser back drives `goTo`), with text alternatives per beat and demo state. Remove the first version's art snapshots, entry animation, `entryScale`, keyframes, demo atoms, per-row add and their strings and tests. Verify in the browser that the URL and briefing notes follow every move
- [x] 6.10 Compare with the artifact frame by frame through CDP (at rest on every beat, mid camera move, during the beat-2 story, and the reduced-motion path), and fix any drift
- [x] 6.11 Update `sc-onb-001.test.ts` and `model.test.ts` for the new model, run `just check` and `openspec validate add-sc-onb-001-rooms-intro --strict`, and verify both pass
