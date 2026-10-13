## Why

Design has a Tellipod concept for adding a pet's medication straight from the pod chat: the user tells Telli "Ginger needs Clavamox twice a day", Telli offers "+ Add medication?", and the Medication form appears on the Info tab (Figma section "EXP-PET-002-C - Medication entry point"). We want stakeholders to click through it, not A/B test it. Today every flow in `app-ux-flows` is shaped as an experiment: it can carry variants, an `EXP-` display code and automatic assignment, and every run is recorded in Matomo. Adding this as variant C of `exp-pet-002` would put real participants into it and skew the experiment's data. Showcases need their own place.

## What Changes

- Add a **flow kind**: every flow declares `kind: 'experiment' | 'showcase'`. A showcase cannot declare variants, a variant selection mode or a display code, and this is enforced by type checking. `exp-pet-002` becomes `kind: 'experiment'`, with no behaviour change.
- **Showcases record no analytics.** A showcase run sends no lifecycle or interaction events to any destination, sends no Matomo page views, and leaves no resumable run behind. Experiments are tracked exactly as before.
- **Home page sections:** flows are grouped into an "Experiments" section and a "Showcases" section. Each section is shown only when it has flows, and showcases are listed in production builds too. In development builds, a showcase shows its screens and Figma frames in the catalogue, without a display code or variants.
- Add the **`chat-add-medication` showcase**, an interactive clickable prototype with these screens:
  - `ginger-notes`, the same notes tab as EXP-PET-002,
  - `chat`, where the viewer sends the pre-filled message "Ginger needs Clavamox twice a day", Telli replies after a short delay, and the reply offers "+ Add medication?",
  - `ginger-info`, the Info tab,
  - `medication-added`, the Info tab with the Medication form added, which completes the run silently.
- Add **chat building blocks** to the design system: chat bubbles for the user and Telli, a suggestion chip, and the chat composer.
- **Extract the Ginger pod** (model, medication record, field formatting, top bar, notes area, medication form card and category rows) out of `exp-pet-002` into a module both flows share. Shared pieces no longer record experiment events themselves: the top bar reports the selected tab, and each flow decides what to track. EXP-PET-002 records the same events as before.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/chat-add-medication`: the chat-driven "add medication" showcase, covering its screens, the scripted chat exchange, the Telli suggestion, the resulting Medication form and silent completion.

### Modified Capabilities
- `app-ux-flows/flow-runtime`: "Flow definition" gains the flow kind and forbids variants and display codes on showcases. "Home page lists available flows" groups flows into Experiments and Showcases sections.
- `app-ux-flows/flow-analytics`: adds a requirement that showcase runs are not tracked.
- `app-ux-flows/design-system`: "Styled home page" shows one section per flow kind, and new chat components are added.

## Impact

- Code in `apps/app-ux-flows/src`:
  - `slices/flow/runtime/define-flow.ts`, `resolve-flow.ts` and `flow-runner.tsx`,
  - `slices/flow/analytics/use-flow-run-analytics.ts`,
  - `slices/flow/catalogue.ts` and `registry.ts`,
  - `routes/home.tsx` and `slices/home/home-page.tsx`,
  - new `slices/flow/pods/ginger/` (moved out of `flows/exp-pet-002/`),
  - new `slices/flow/flows/chat-add-medication/`,
  - new chat components in `shared/ui/`,
  - `app/locales/en.ts` (the Ginger pod keys move from `flows.expPet002.*` to `pods.ginger.*`).
- No new dependencies, no environment variables, and no Matomo configuration changes.
- EXP-PET-002 behaviour, analytics events and URLs are unchanged.
