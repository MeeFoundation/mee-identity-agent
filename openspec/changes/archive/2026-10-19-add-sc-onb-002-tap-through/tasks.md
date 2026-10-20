## 1. Move the intro to a shared folder (no behaviour change)

- [x] 1.1 Capture SC-ONB-001 parity screenshots before moving anything: rest on each of the four beats, the three beat-2 states, mid move 1→2 and the reduced-motion path. Use a throwaway CDP script against `pnpm --filter app-ux-flows dev` at 393×852, kept outside the repo. Verify all eight images exist
- [x] 1.2 Move `flows/sc-onb-001/{engine,scene,overlays,chrome,art,screens}` to `slices/flow/pods/tellipod-intro/` with `git mv`, keeping file names. Add `pods/tellipod-intro/model.ts` with `IntroScreenId`, `BeatId` and `BEATS`. Make `sc-onb-001/model.ts` re-export `ScOnb001ScreenId` from it, and repoint every import. Verify `pnpm check-types` passes
- [x] 1.3 Move the scene copy `flows.scOnb001.{art,beats,demo,intro,pod,standIns}` to `pods.tellipodIntro.*` in `app/locales/en.ts`, and update every `t()` call and test that uses those keys. Verify with a grep that no `flows.scOnb001.` key outside title, description, goal, hints, questions and screens remains in code, and that `pnpm --filter app-ux-flows test` passes
- [x] 1.4 Add `createIntroScreens({ mode })` in `pods/tellipod-intro/screens/`, returning stable `IntroScreen` and stand-in components bound to the mode. Add `tap` to `IntroSceneContext`. Switch `sc-onb-001/flow.ts` to `createIntroScreens({ mode: 'next' })`. Verify that `sc-onb-001.test.ts` passes and that the four beat routes still share one component identity
- [x] 1.5 Re-capture the screenshots from 1.1 and compare them pair by pair. Verify there is no visual difference, and that Next, Back, Skip, swipe and browser back still work on SC-ONB-001

## 2. Port the tap engine pieces

- [x] 2.1 Add `engine/attention.ts` (1044: `HL_*` constants, `ripple`). Unit-test `ripple` at 0, mid-ripple, past `HL_RIPPLE_MS`, wrap-around, and `-1` under reduced motion
- [x] 2.2 Add `computeTapLayout` to `engine/layout.ts` (1013 `P`, with 1017 `TAP_CARD_*` and `tapBtnH`), including `keyInsets`, `keyShift` and `featherTop` on the stage and the fallback below 180 px. Unit-test at 393×852 against values read from the artifact at `?v=1.2` (stage y and h, text y, card inset), and test the fallback at 390×560
- [x] 2.3 Add the `tapLoop` option to `engine/clock.ts`: no auto pulses, and an `hl` source that repeats over `HL_PERIOD_MS` while the availability mask (enter-pod, invite, add-all, invite-Paula, go-home, rest-on-beat-4) is non-zero, restarts when the mask changes, and freezes at `HL_FROZEN` under reduced motion. Unit-test with the fake-clock ticker: the loop starts at rest on `rooms` after assembly, stops during a move, and pulses never start in tap mode

## 3. Port the tap overlays and chrome

- [x] 3.1 Add `overlays/attention-ring.tsx` (1043: ring and ripple driven by `hl` and a `live` gate, using `useFrameStyle`). Verify in the browser that it ripples every 1.5 s and stays still with reduced motion emulated
- [x] 3.2 Port the large Ginger chip: in `anchors.ts`, `gingerIsL`, `GINGER_TAP_NUDGE`, `TAG_H_L` and `gingerGeo(stage, tap)`; in `tags.tsx`, the Ginger tag in size L with its ring, the tap hint "Opens Ginger's pod", a press that only works at rest, and the Sofia offset. Verify `rooms` against the artifact's v1.2 beat 1 screenshot
- [x] 3.3 Port the note card's tap branch in `note-card.tsx`: full width, `tapBtnH`, the bottom dock, no fold to `H_DONE`, the Invite Paula row (person-plus icon, hint "Shares Ginger's pod with Paula", calls `next()`), and rings on Invite Telli, Add all and Invite Paula. Add the new strings under `pods.tellipodIntro.pod`. Verify the three beat-2 states against the artifact's v1.2 screenshots
- [x] 3.4 Add `HomeTag` (1073: house icon, size L, hint "Back to all your pods", opacity from `v3` faded out by q 2.0–2.2, live on `canGoHome`, calls `next()`), and render it in `overlays.tsx` in tap mode only. Verify on `paula` that it appears after "Ginger's fed!" and moves to `welcome`
- [x] 3.5 Port the small tap branches in `telli-flyer.tsx` (1072), `paula-line.tsx` (1022) and `sync-cards.tsx` (1071). Verify the Telli flight on beat 2 and the `paula` beat against the artifact at `?v=1.2`
- [x] 3.6 In `chrome/next-cta.tsx` and `screens/intro-screen.tsx`: hide Next in tap mode unless the stage is hidden, ring Get Started, and pass `tapLoop` and the layout mode. Verify in the browser that no Next button appears and that Get Started is ringed

## 4. SC-ONB-002 flow

- [x] 4.1 Add `flows/sc-onb-002/model.ts`, which re-exports the screen id as `ScOnb002ScreenId`, and `flows/sc-onb-002/flow.ts` (`kind: 'showcase'`, `SC-ONB-002`, no cases, no design frames, `createIntroScreens({ mode: 'tap' })`, hints, `questionKeys` and `screenNotes`). Register it after `scOnb001Flow` in `registry.ts`. Verify that the home page lists both intros under "Onboarding"
- [x] 4.2 Add `flows.scOnb002.*` to `en.ts` (title, description, goal, a hint per screen, the flow's three questions, and the explanations and questions for each screen). Verify every string quoted in the spec is present verbatim
- [x] 4.3 Add `flows/sc-onb-002/sc-onb-002.test.ts` following `sc-onb-001.test.ts`: registry entry and order, code, seven screens, no design frames, no cases, notes and questions for each screen. Verify with `pnpm --filter app-ux-flows test`

## 5. Verification

- [x] 5.1 Walk SC-ONB-002 in `pnpm --filter app-ux-flows dev`, in the 393×852 frame and at 390 px full-screen: every spec scenario, including the ring moving between controls, Invite Paula only after adding, Home after the sync, Skip, Back, swiping past the demo, browser back, reduced motion, keyboard-only navigation, and the URL and briefing notes following each beat
- [x] 5.2 Compare SC-ONB-002 with the artifact at `?v=1.2&splash=0` through CDP: at rest on every beat, every beat-2 state, mid camera move, and with the ring mid-ripple. Fix any drift
- [x] 5.3 Run `just check` (`pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test`, `pnpm --filter app-ux-flows knip`) and `openspec validate add-sc-onb-002-tap-through --strict`, and verify both pass with no errors
