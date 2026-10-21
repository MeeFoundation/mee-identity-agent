## Why

SC-ONB-001 brought the "Tellipod Intro" prototype's (claude.ai artifact `2f5qjsxozv5Q9rkvrv7BLd`) **v1 · Rooms** version into `app-ux-flows`. The team now wants to compare it with the prototype's second version, **v1.2 · Tap through**. It tells the same story in the same world, but has no Next button: people move through it by tapping the highlighted thing in the scene. Putting both side by side in `app-ux-flows` lets the two intros be demoed and discussed with the same briefing.

## What Changes

- New showcase **SC-ONB-002 "Tellipod intro: Tap through"** (`sc-onb-002`). It has the same four beats, copy, world, camera, story timings, swipe-scrub, reduced-motion path and stand-in screens as SC-ONB-001, with the v1.2 differences:
  - **No Next button.** On beats 1–3, the way forward is a control inside the scene, ringed by a repeating attention ripple while it is available:
    1. `rooms`: a large **Ginger** tag (hint "Opens Ginger's pod").
    2. `ginger-pod`: **Invite Telli**, then **Add all suggested info**, then a new **Invite Paula** button on the pod card (hint "Shares Ginger's pod with Paula"). The demo is the path forward, not an option.
    3. `paula`: a new **Home** tag with a house icon (hint "Back to all your pods").
    4. `welcome`: **Get Started**, also ringed.
  - **Tap layout.** The headline and subline sit under the top bar. The scene fills the rest of the screen, down to the pager, and can be up to 600 px tall. On beat 2 the pod card docks at the bottom of the scene, full width.
  - The one-time pulses on Invite Telli and Add all are replaced by the attention ring.
  - Back, Skip, the pager, swiping and browser back behave as in SC-ONB-001.
- The animation engine, scene, overlays and chrome that SC-ONB-001 keeps in its own folder move to a shared folder, and both showcases use them. A `tap` mode turns on the v1.2 layout, controls and attention loop, ported from the artifact's tap branches. SC-ONB-001's behaviour does not change.
- `SC-ONB` now has two flows, so the home page groups them under the "Onboarding" family title, which already exists.

Decisions confirmed with the requester: a separate showcase `SC-ONB-002` with the flow id `sc-onb-002`, rather than a case of SC-ONB-001 or turning it into an experiment. The intro code is shared, not copied.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-onb-002`: the "Tellipod intro: Tap through" showcase. It covers its identity and screens, the tap layout, the in-scene controls with the attention ring, the required Telli demo with Invite Paula, the Home tag, swiping and reduced motion, the stand-ins and completion, and its explanations and open questions.

### Modified Capabilities

None. SC-ONB-001's behaviour stays the same; only where its code lives changes. The home page already groups any code family with more than one flow, and "Onboarding" is already defined.

## Impact

- New flow folder `apps/app-ux-flows/src/slices/flow/flows/sc-onb-002/` (`flow.ts`, `model.ts`, tests), registered last in `slices/flow/registry.ts`.
- `flows/sc-onb-001/{engine,scene,overlays,chrome,art}` and the shared parts of `screens/` move to `slices/flow/pods/tellipod-intro/`. sc-onb-001 keeps its `flow.ts`, `model.ts` and tests and imports from there.
- Shared intro code gains a `tap` mode: the tap layout, the attention ring, the large Ginger tag, the Invite Paula button, the Home tag, and the clock's attention loop with pulses turned off.
- `apps/app-ux-flows/src/app/locales/en.ts`: `flows.scOnb002.*` for the title, description, goal, hints, notes and questions, plus the new control labels and hints. Copy that is the same in both intros is shared rather than duplicated.
- No new dependencies, no backend and no analytics events.
