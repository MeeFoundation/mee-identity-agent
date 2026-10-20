## 1. Read v2 and capture the reference

- [x] 1.1 Run the artifact at `?v=2&splash=0` through a throwaway CDP script kept outside the repo, at 393×852. Capture: the deck mid-assembly and at rest, `ginger-pod` in Before, Suggested and Added, mid card morph 1→2, `paula`, mid morph 3→4, `welcome`, and the reduced-motion path. Record each card's frame, the visible copy and anything on `welcome` that the spec does not mention. Verify all captures exist and update the spec and design for anything that differs
- [x] 1.2 Split the `SceneV2` module [1082] into readable parts (deck, pod card, Telli key and chip, rows, Paula's phone, pods list) in the scratchpad, and list the shared values and geometry each part reads. Verify every `DECK_*`, `KEY_*`, `ROW*` and `P1`–`P4` constant used is accounted for

## 2. Engine pieces

- [x] 2.1 Add `'living'` to `IntroMode` in `pods/tellipod-intro/model.ts`, and `living: boolean` to the scene context. Verify `pnpm check-types` passes with SC-ONB-001 and SC-ONB-002 unchanged
- [x] 2.2 Add the deck to `engine/`: `DECK_N`, `DECK_STEP`, `DECK_IN`, `DECK_RISE`, `T1_V2`, `deckIn`, `deckDepth`, `deckPose` and `deckFace`. Unit-test card 0 and the last card at the start, mid-step and the end of `T1_V2`, and that the last card ends at full opacity and scale
- [x] 2.3 Add the `living` branch to `computeLayout` in `engine/layout.ts`, with the fallback to the `next` layout. Unit-test at 393×852 against the values read in 1.1 (stage y and h, text y, key box), and the fallback at 390×560
- [x] 2.4 Give the clock an `assemblyMs` option and use `T1_V2` for it in `living` mode. Unit-test with the fake-clock ticker that the opening runs for `T1_V2`, and that `next` and `tap` modes still use `T1`

## 3. Living scene

- [x] 3.1 Add `pods/tellipod-intro/living/` with the pod cards and the deck (pod tile, name, category, member avatars, static people stack), driven by `deckPose` and `deckFace`. Verify `rooms` against the captured deck at rest and mid-assembly
- [x] 3.2 Add the open Ginger card and the Telli demo to `living/`: the card morph from the deck, the Telli key, "Invite Telli" and "Add all suggested info" calling the existing `inviteTelli` and `addAll` actions, the suggested rows and the added state. Verify the three states against the captures from 1.1
- [x] 3.3 Add `paula` to `living/`: Paula's phone and your phone with the shared pod, the synced values and "Ginger's fed!". Verify against the capture and the values in the spec
- [x] 3.4 Add `welcome` to `living/`: the card shrinking into the pods list, with Ginger showing you, Telli and Paula. Verify against the capture, and that `rooms` → `welcome` and the reverse morph with Skip and Back
- [x] 3.5 Render `LivingScene` in `screens/intro-screen.tsx` in place of `WorldSvg` and `Overlays` when the mode is `living`, and pass the layout mode and `assemblyMs`. Add the text alternatives for each beat under `pods.tellipodIntro.living.*`. Verify that SC-ONB-001 and SC-ONB-002 still render the isometric world, and that screen-reader labels change with the beat in SC-ONB-003
- [x] 3.6 Add the reduced-motion path: the deck appears assembled, and moving between beats fades instead of morphing. Verify in the browser with reduced motion emulated

## 4. SC-ONB-003 flow

- [x] 4.1 Add `flows/sc-onb-003/model.ts`, which re-exports the screen id as `ScOnb003ScreenId`, and `flows/sc-onb-003/flow.ts` (`kind: 'showcase'`, `SC-ONB-003`, no cases, no design frames, `createIntroScreens({ mode: 'living' })`, hints, `questionKeys` and `screenNotes`). Register it after `scOnb002Flow` in `registry.ts`. Verify the home page lists all three intros under "Onboarding"
- [x] 4.2 Add `flows.scOnb003.*` to `en.ts` (title, description, goal, a hint per screen, the flow's three questions, and the explanations and questions for each screen). Verify every string quoted in the spec is present verbatim
- [x] 4.3 Add `flows/sc-onb-003/sc-onb-003.test.ts` following `sc-onb-002.test.ts`: registry entry and order, code, seven screens, no design frames, no cases, notes and questions for each screen. Update the registry-order assertions in the other flow tests if they list every flow. Verify with `pnpm --filter app-ux-flows test`

## 5. Verification

- [x] 5.1 Walk SC-ONB-003 in `pnpm --filter app-ux-flows dev`, in the 393×852 frame and at 390 px full-screen: every spec scenario, including Next, Back, Skip, swiping with and without the demo, browser back, reduced motion, keyboard-only navigation, a short viewport, and the URL and briefing notes following each beat
- [x] 5.2 Compare SC-ONB-003 with the artifact at `?v=2&splash=0` through CDP: at rest on every beat, mid-deck, mid card morph, and each beat-2 state. Fix any drift. Re-capture SC-ONB-001 and SC-ONB-002 and verify they are unchanged
- [x] 5.3 Run `pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test` and `pnpm --filter app-ux-flows knip`, and `openspec validate add-sc-onb-003-living-pod --strict`, and verify all pass with no errors
