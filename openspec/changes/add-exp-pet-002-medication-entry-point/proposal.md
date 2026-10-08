## Why

The only flow in `app-ux-flows`, `add-medication`, is a generic placeholder (pet card, name/dosage form, confirmation). It does not resemble the Tellipod app, so it cannot test the real UX question. Design has now delivered experiment **EXP-PET-002 "Medication entry point"** in Figma (Mee – Tellipod App v4.0.3). It compares two ways of adding a medication to a pet's pod:
- **A**: the manual path, through the Info tab's "Add form" sheet or the Medical category.
- **B**: a one-tap AI suggestion.

The data shown is a pet medication record from the Tellipod ontologies (`pets:Medication`) that the server already holds. We also want experiments, variants and screens to be named after their Figma frames (`EXP-PET-002-B - Medication added`), so they can be traced back to design and specified before they are built.

## What Changes

- **New experiment flow `exp-pet-002`** ("Medication entry point"), automatically assigned, with two variants:
  - `a` (EXP-PET-002-A): Ginger pod Notes → Info → "+ Add form" (or Medical → "+ Add medication") → "Add form" bottom sheet with the Medication template → Save → Medication form shown on the Info tab.
  - `b` (EXP-PET-002-B): the Info tab also shows an "AI Suggestion – Add medication" chip. Tapping it adds the Medication form in one step. The manual paths stay available.
- **Server-provided medication fixture**: the run's initial state carries a medication record shaped after `pets:Medication`. Ontology terms keep their IRI and label: active ingredient (ChEBI), dose form (DrOn), dose unit (CCO). The default fixture is Ginger's Amoxicillin / Clavamox / Zoetis record. No screen fetches data.
- **Experiment metadata on flows**: a flow may declare a display code (`EXP-PET-002`) and a description. A variant may declare a display code (`EXP-PET-002-A`). Each variant may reference the Figma frame (name + URL) behind each of its screens. There is no flow-level Figma link.
- **Home page**: production builds show the flow's title, description and a single Start action. Development builds add a catalogue: experiment code, each variant's code, name and description, and each variant's screens with their Figma frame name (linked to Figma) and a deep link that opens that screen in that variant.
- **New pod UI building blocks** in the design system:
  - pod top bar (back, avatar, title, breadcrumb, menu) with Notes/Chat/Info segmented tabs
  - section label
  - empty-state card with action
  - category row with count badge
  - divider
  - bottom sheet that stays inside the device frame
  - labelled select
  - collapsible form card with field rows
  - AI suggestion chip
  - pod screen background
- **New experiment spec** describing the hypothesis and each variant's behaviour as WHEN/THEN scenarios, so later scenarios and screens can be specified before they are built.
- **BREAKING (prototype content)**: the placeholder `add-medication` flow is removed with all its screens, components (`PetCard`, `QuickAction`, `ProminentQuickAction`), variants (`control`, `alternative-home`, `prominent-action`), locale strings and tests. Old `/flows/add-medication/...` links show the not-found state. Stored variant assignments for `add-medication` become unused.

Out of scope: editing a field (the pencil buttons), "Add contact info", "Create form", the Chat tab, the kebab menu, a real rich-text editor, server/API integration, and analytics.

## Capabilities

### New Capabilities
- `app-ux-flows/experiments/exp-pet-002`: the EXP-PET-002 experiment. Covers the hypothesis, the two variants, the pod screens and navigation between them, the medication fixture and how it is displayed, and the end state where the medication form has been added.

### Modified Capabilities
- `app-ux-flows/flow-runtime`: a flow definition may carry an experiment code, a description and per-screen design references. The home page shows the description to everyone and the experiment catalogue only in development builds.
- `app-ux-flows/flow-variants`: a variant may carry a display code and its own per-screen design references. The automatic-flow home-page scenario applies to production builds, since development builds now show variants.
- `app-ux-flows/design-system`: new pod building blocks (top bar with tabs, info list blocks, bottom sheet, select, form card with field rows, AI suggestion). The "existing contracts" and home-page requirements now reference the new experiment instead of the removed example flow.
- `app-ux-flows/device-frame`: overlays such as bottom sheets render inside the frame's screen area. Example URLs move to the new flow.

## Impact

- Code (all in `apps/app-ux-flows/src`):
  - Removed: `slices/flow/flows/add-medication/**`.
  - New: `slices/flow/flows/exp-pet-002/**` (flow, model and fixture, screens, flow-specific components, tests, Ginger avatar asset).
  - New shared components in `shared/ui/` (and `shared/ui/primitives/` for Base UI wrappers: tabs, dialog, select, collapsible).
  - Changed: `slices/flow/runtime/define-flow.ts` and `resolve-flow.ts` (metadata), `slices/flow/registry.ts` and `registry.test.ts`, `slices/home/home-page.tsx`, `routes/home.tsx`, `slices/device-frame/device-frame.tsx` (overlay container), `app/locales/en.ts`.
- New dependency: `react-bootstrap-icons` (Bootstrap Icons as React components, the icon set the Mee Design System uses). `@base-ui/react` is already installed.
- Browser storage: the `ux-flows:variant:add-medication` key is no longer read. A new `ux-flows:variant:exp-pet-002` key is written.
