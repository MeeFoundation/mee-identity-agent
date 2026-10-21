## Why

The [Onboarding v2 prototype](https://cellula-test.vercel.app/onboarding-v2) is a different first-run from the three intros already in `app-ux-flows` (rooms, tap-through, living pod). We need it as its own showcase so it can be demoed and compared with those, with the same briefing, without changing them or the native Tellipod app.

## What Changes

- New showcase **SC-ONB-004 "Tellipod intro: Onboarding v2"** (`sc-onb-004`): a clickable port of the prototype.
- Landing ("Get to know Tellipod in a minute") with **Show me around** and **I know Tellipod, skip to setup**.
- A three-beat animated tour: a pod for anything, share once, yours to keep. Then setup chooser, local profile (simulated contact card or manual form), and the devices step.
- Pairing and "what comes next" stay prototype stand-ins. **I'll do this later** reaches the goal.
- Listed under the existing Onboarding family, after SC-ONB-003. No cases, no analytics, no Figma frames.
- Own flow folder. SC-ONB-001, SC-ONB-002, SC-ONB-003, `pods/tellipod-intro/`, and `app-tellipod` stay unchanged.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-onb-004`: identity, screens, tour, setup, stand-ins, motion, reduced motion, briefing notes and open questions.

### Modified Capabilities

None. Other flows keep their behaviour. Home already groups any `SC-ONB` code family under "Onboarding".

## Impact

- New folder `apps/app-ux-flows/src/slices/flow/flows/sc-onb-004/` (flow, screens, scenes, tests), registered last among the onboarding showcases in `slices/flow/registry.ts`.
- `apps/app-ux-flows/src/app/locales/en.ts`: `flows.scOnb004.*`.
- Registry-order tests that list every flow id gain `sc-onb-004`. That is catalogue bookkeeping, not a behaviour change in those flows.
- No new dependencies, no backend, no analytics events. No edits to `app-tellipod` or to SC-ONB-001–003 source.
