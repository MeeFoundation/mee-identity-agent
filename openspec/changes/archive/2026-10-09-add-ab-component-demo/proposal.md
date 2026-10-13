## Why

`app-ux-flows` already supports A/B variants (`app-ux-flows/flow-variants`), but the only experiment, EXP-PET-002, changes state, screens and design frames at once, so it doesn't make the mechanism easy to see. We need a small demonstration experiment where **exactly one building-block component** differs between variant A and variant B. That way stakeholders can watch how a variant overrides a component, how they pick a variant, and how analytics tells the variants apart.

This experiment is for demonstration only. It is not a real participant study.

## What Changes

- Add a new experiment flow `exp-demo-001` (display code `EXP-DEMO-001`, title "A/B demo: empty state call to action") to the `app-ux-flows` registry.
- The flow reuses the Ginger pod. The Info tab shows the Forms section with an empty state, and its "+ Add medication" action adds the Medication form. That leads to a "medication added" screen, which completes the run.
- Variant selection is **explicit**. The home page shows one button per variant (A and B), so the presenter chooses which one to run. `?variant=a|b` in the URL also works, as for any explicit flow.
- Variant `a` (Control, `EXP-DEMO-001-A`) uses the standard `EmptyStateCard`.
- Variant `b` (Prominent CTA, `EXP-DEMO-001-B`) overrides **only** the `EmptyStateCard` building-block component with a prominent version. It has an icon, an emphasised title and a filled, full-width primary button instead of a link-style action. Screens, state, navigation and every other component are inherited unchanged.
- Chosen component: `EmptyStateCard`. It is the single call to action that decides whether the participant converts (adds the form). A visual change to it is easy to see side by side, and success maps directly to one interaction event, so it suits a one-component A/B demo better than a header, divider or top bar would.
- Both variants record the same interaction event `medication_form_added` when the action is used. Variants are told apart only by the automatic variant context, which shows the analytics comparison in the dev console or Matomo.
- Add i18n strings for the flow, its variants and the prominent card.

## Capabilities

### New Capabilities
- `app-ux-flows/experiments/exp-demo-001`: The EXP-DEMO-001 demonstration experiment. Covers its identity, explicit A/B variants, screens, the single `EmptyStateCard` component override in variant B, and its analytics event.

### Modified Capabilities
<!-- None: the change uses the existing flow-variants, flow-runtime and flow-analytics behavior as specified. -->

## Impact

- New code in `apps/app-ux-flows/src/slices/flow/flows/exp-demo-001/` (flow definition, model, screens, top bar, info view and the variant B `ProminentEmptyStateCard`).
- `apps/app-ux-flows/src/slices/flow/registry.ts`: register the new flow.
- `apps/app-ux-flows/src/app/locales/en.ts`: new `flows.expDemo001.*` keys.
- No changes to the runtime, the variant infrastructure, shared UI components or the other flows. No new dependencies.
