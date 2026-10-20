## Why

SC-ONB-001 and SC-ONB-002 brought the "Tellipod Intro" prototype's (claude.ai artifact `2f5qjsxozv5Q9rkvrv7BLd`) **v1 · Rooms** and **v1.2 · Tap through** versions into `app-ux-flows`. The prototype has a third version, **v2 · Living pod**, which the earlier change explicitly left out. It tells the same four-beat story, but drops the isometric home: the pod itself is the scene, as a flat card that grows from a deck of pods into Ginger's open pod, then onto two phones, then back into the pod list. Adding it lets all three intros be demoed and compared with the same briefing.

## What Changes

- New showcase **SC-ONB-003 "Tellipod intro: Living pod"** (`sc-onb-003`). It has the same four beats, headlines, sublines, Next/Back/Skip, pager, swipe-scrub, reduced-motion path and stand-in screens as SC-ONB-001, with the v2 differences (including a new headline and subline on `rooms`):
  - **A flat scene instead of the isometric world.** There is no home, door, cat illustration or camera. The scene is a pod card that changes shape from beat to beat.
  - **`rooms`:** four pod cards (Home, Kyoto trip, Sofia, Ginger), each showing a note, a file and a message, fall into a deck one after another over about 2.4 s, and the Ginger card ends on top.
  - **`ginger-pod`:** the Ginger card opens into the pod, with Telli waiting beside it. The Telli demo (Invite Telli, Add all suggested info) is optional, as in SC-ONB-001.
  - **`paula`:** the pod appears on Paula's phone and yours, and Paula's "Ginger's fed!" arrives.
  - **`welcome`:** the pod shrinks into a list of four pod rows, with Ginger first, showing you, Telli and Paula and "Paula: Ginger's fed!".
  - **Top layout.** The copy sits directly under the top bar, the scene fills the space from the copy down to the Next button, and the Next button stays. If the scene would be too short, the layout falls back to SC-ONB-001's.
- The shared intro code in `pods/tellipod-intro/` gains a third mode, `living`, next to `next` and `tap`. It swaps the stage content for the flat scene, uses the `living` layout and the longer opening timing, and leaves the other two modes unchanged.
- `SC-ONB` now has three flows, which the home page already groups under "Onboarding".

Assumptions, to confirm in review:
- A separate showcase `SC-ONB-003` with flow id `sc-onb-003`, like SC-ONB-002, not a case or an experiment.
- The Telli demo stays optional, as in v1, because v2 keeps the Next button.
- The prototype's launch splash, haptics, wheel and trackpad paging and debug harnesses stay out of scope, as before.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-onb-003`: the "Tellipod intro: Living pod" showcase. It covers its identity and screens, the top layout, the flat living-pod scene on each beat, the optional Telli demo, swiping and reduced motion, the stand-ins and completion, and its explanations and open questions.

### Modified Capabilities

None. SC-ONB-001 and SC-ONB-002 keep their behaviour. The home page already groups any code family with more than one flow.

## Impact

- New flow folder `apps/app-ux-flows/src/slices/flow/flows/sc-onb-003/` (`flow.ts`, `model.ts`, tests), registered last in `slices/flow/registry.ts`.
- `pods/tellipod-intro/`: `IntroMode` gains `'living'`; `engine/layout.ts` gains the `living` layout; `engine/` gains the deck timing and geometry; a new `living/` folder holds the flat scene; `screens/intro-screen.tsx` picks the stage content by mode.
- `apps/app-ux-flows/src/app/locales/en.ts`: `flows.scOnb003.*` for the title, description, goal, hints, notes and questions, and any scene copy that v2 adds (text alternatives for the flat scene, "Pet sitter" and similar labels).
- No new dependencies, no backend and no analytics events.
