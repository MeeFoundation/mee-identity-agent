## Context

`app-ux-flows` already has three Onboarding showcases (`sc-onb-001`–`003`) that share `pods/tellipod-intro/` (isometric rooms, tap-through, living-pod modes). Home groups any `SC-ONB` code family. Flows live in `src/slices/flow/flows/<id>/`, register in `registry.ts`, and take copy from `app/locales/en.ts`. See proposal.md for motivation and `specs/app-ux-flows/showcases/sc-onb-004/spec.md` for the screen contract. The source is [Onboarding v2](https://cellula-test.vercel.app/onboarding-v2), a separate prototype from the living-pod "v2".

## Goals / Non-Goals

**Goals:**
- A standalone showcase that ports the prototype's steps, copy and CSS motion into the flow runtime.
- Isolation: no imports from `sc-onb-001`–`003` or `pods/tellipod-intro/`.

**Non-Goals:**
- Changing SC-ONB-001–003 behaviour or shared intro engine.
- Native Tellipod (`app-tellipod`) onboarding.
- OS Contacts, real pairing, analytics, cases, Figma frames.
- Persisting profile outside the run.

## Decisions

**1. New flow folder, not a fourth intro mode.** SC-ONB-004 is `flows/sc-onb-004/` with its own screens and scenes. Alternative: add a mode to `tellipod-intro`. Rejected because the prototype is a different story (landing + three beats + setup, not four isometric beats), and a shared engine would risk regressing 001–003.

**2. Real flow screens, in-run overlays for dialogs.** Each spec screen is a route (`/flows/sc-onb-004/<id>`), so the briefing follows it. Contact permission/picker stay dialogs on `profile-choose`. Pairing and `next` are sheets that still have screen ids so notes exist. Alternative: one screen plus an internal machine. Rejected because the briefing and URL would not follow the beat.

**3. Own motion, copied from the prototype CSS.** Port keyframes (`step-in`, `tour-squash`/`pop`/`bob`, `phone-in`, share timeline, beat-3 line delays) with `prefers-reduced-motion` rest states from the spec. Scene components live under the flow folder. Alternative: reuse intro-engine clock. Rejected as coupled to 001–003.

**4. Register after `scOnb003Flow` only.** Append in `flowDefinitions`. Tests that snapshot every flow id (for example `chat-add-medication.test.ts`) add `sc-onb-004`. Do not edit `sc-onb-001`–`003` flow files. The home family map already has `SC-ONB`.

**5. Completion on `next`.** I'll do this later navigates to `next` and calls `complete()`, same pattern as SC-ONB-001's `telli-handoff`. Pairing does not complete. Replay uses a new run on `landing`. Profile state lives in the flow store and is discarded on replay.

**6. Tests.** Follow `sc-onb-003.test.ts` for registry, order, screens, missing frames, notes and i18n. Add interaction tests for skip, first-name validation, completion, and reduced-motion rest states. Visual timing is checked in the device frame against the prototype.

## Risks / Trade-offs

- [Registry-order tests in unrelated files fail when a flow is appended] → update only the id lists; leave those flows' screens alone.
- [Motion drift from the web prototype] → one timeline table per scene; re-check in the browser.
- [Shared UI buttons/sheets look slightly different from the prototype] → use existing `Button` and dialog primitives; do not restyle the whole design system.
- [Keyboard on `profile-form` covering Continue] → scroll / avoid; verify in the 393×852 frame.

## Migration Plan

Additive. Rollback is removing the flow folder, its locale block, and the registry line.
