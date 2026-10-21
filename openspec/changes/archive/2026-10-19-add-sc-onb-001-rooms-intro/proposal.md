## Why

The team is weighing first-run intros for Tellipod. The "Tellipod Intro" prototype (claude.ai artifact `2f5qjsxozv5Q9rkvrv7BLd`, an Expo web build) offers three versions. We want the first one, **v1 · Rooms**, in `app-ux-flows` next to the pod showcases, so it can be demoed and discussed with the same briefing, cases and open questions as everything else. The other two versions, v1.2 "Tap through" and v2 "Living pod", stay out of scope.

## What Changes

- New showcase **SC-ONB-001 "Tellipod intro: Rooms"** (`sc-onb-001`), the four-beat v1 · Rooms intro:
  1. **"Pods are small private rooms."** A phone drawn as a small home. Its rooms are the pods Kyoto trip, Ginger and Sofia, and a "Ginger" tag that can be tapped.
  2. **"Telli tidies. You decide."** Inside Ginger's pod there is a pod card with the note "#ginger / feeds 7am & 6pm, ½ cup dry". An optional **Invite Telli** turns the card to Info, with the suggested rows Meals and Portion. An optional **Add all suggested info** saves them. Nothing is saved for real.
  3. **"Invite Paula. Same pod, her phone."** Your phone and Paula's phone are joined by a line. Each shows the same synced Ginger card with "Ginger's fed! 7:05".
  4. **"Welcome to Tellipod. Host your world."** The home again. Ginger now has you, Telli and Paula, plus a new-message dot. It offers **Get Started**, "Already have Tellipod on another device?" and "Restoring from backup?".
- Every beat has a top bar with the Tellipod logo, Back (beats 2–4), Skip (beats 1–3, jumps to beat 4) and a four-step pager.
- **Get Started** and the two links each open a "Prototype stand-in" screen, as the artifact does. Each stand-in has "Replay intro". Get Started completes the run without the completion view, so the briefing shows "Goal reached".
- The scene is the artifact's **animated isometric world**, ported to the web: one world seen through a camera that pans and zooms continuously between beats, with the beat stories (home assembling, pod card docking, door opening and Telli walking in, rows arriving, key travelling to Paula's phone, line drawing, sync) on the artifact's timings. Tags and cards are real UI that move with the camera.
- **Swipe-scrub**: dragging horizontally scrubs the camera and story between beats and settles on release, as in the artifact. Reduced motion swaps camera moves for cross-fades.
- No cases: the artifact tells one story, so the showcase has a single flow-level goal. It ships with explanations and open questions for the flow and each screen.
- The new code family `SC-ONB` gets the home-page family title "Onboarding".

Decisions confirmed with the requester: the artifact's full animation including swipe-scrub (revised after a first static-art version); the code `SC-ONB-001` and flow id `sc-onb-001`; and stand-in screens that end the run with "Goal reached".

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-onb-001`: the "Tellipod intro: Rooms" showcase. It covers the four beats with their copy and illustrations, the top bar and pager, the Telli demo on beat 2, the stand-in screens, completion, and its explanations and open questions.

### Modified Capabilities

None. Home-page grouping already handles any code family. Adding the "Onboarding" title is data for an existing requirement, not a change to it.

## Impact

- New flow folder `apps/app-ux-flows/src/slices/flow/flows/sc-onb-001/` (flow, a ported animation engine, scene, overlays, screens, tests), registered last in `slices/flow/registry.ts`.
- `apps/app-ux-flows/src/slices/flow/runtime/flow-context.ts`: screens can read the current screen id (`useFlowScreen`), so one mounted scene can follow the route.
- `apps/app-ux-flows/src/slices/home/flow-families.ts`: `SC-ONB` → `home.families.onboarding`.
- `apps/app-ux-flows/src/app/locales/en.ts`: `flows.scOnb001.*` and `home.families.onboarding`.
- No new dependencies, no backend and no analytics events. Existing shared UI (`SegmentedTabs`, `Button`, `RecordRow`-style rows) is reused unchanged.
