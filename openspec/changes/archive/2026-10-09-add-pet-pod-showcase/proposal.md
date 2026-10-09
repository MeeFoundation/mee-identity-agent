## Why

SC-PET-001 "Create Ginger" is the first Pets UX research scenario. Alice wants a pod for her cat Ginger so that she can keep, and later share, information about her. The scenario tests an approach where structure comes as a byproduct, not a prerequisite. The New Pod sheet in Figma already has a Category field, but it is optional, so Alice can create a generic pod by name alone. Once she is inside it, the app suggests a Pet template, and applying the template adds the pet-specific structure.

The Tellipod ontologies (`MeeFoundation/tpod-ontologies`) already describe both halves:
- A pod created with no category uses `ctpl:UserDefinedTemplatePod`.
- A pod of category `podcat:Pets` uses `ctpl:PetProfileTemplatePod`, whose narrower categories are Medical and Care & Feeding.

The earlier version of this change built a category-first flow, "Add a pet pod". That flow asks for a category before the pod exists, which is the opposite of what SC-PET-001 studies, so this change replaces it. Later scenarios (SC-PET-002 "Add medication" to SC-PET-006 "Share Ginger's care") build on the pod this scenario leaves behind.

## What Changes

- **Showcase.** Replace the "Add a pet pod" showcase with SC-PET-001 "Create Ginger": Home, then the New Pod sheet (name required; role and category optional), then the empty Ginger pod, then the Pet template suggestion, then Ginger with the Pet template applied. Choosing Pets in the sheet skips straight to the Pet structure, so research can see who picks a category up front.
- **Display codes.** Allow a showcase to declare a display code, so research scenarios can be identified as `SC-PET-001`. Showcases still have no variants and record no analytics.
- **Pod catalog.**
  - Add the category-less `ctpl:UserDefinedTemplatePod`, and a way to apply a category's template to a pod that already exists.
  - Template suggestions become data: the flow's initial state names which template to suggest. The pod screens contain no Ginger- or Pets-specific conditions.
- **Removed.** These parts of the earlier version are not part of SC-PET-001:
  - the category picker,
  - the pod's Chat welcome,
  - the Pet profile form, its validation, its renderer and its species, breed and unit vocabularies,
  - the `disabled` prop on `SelectField` and the `placeholder`/`inputMode` props on `TextField`, which only that form used.

  The form returns with the scenario that fills in a pet's information.
- **Kept from the earlier version:** the pod catalog of Pets categories and templates, the letter avatar on the pod top bar, and the Ginger fixture's breadcrumb fix ("Pets > Care & Feeding" → "Pets") for the existing flows.
- **Wording.** The scenario's copy says "Pod" and "Subpods", following the Figma Home section and the existing flows, rather than the brief's "cell".
- **Out of scope:** SC-PET-002 to SC-PET-006, real persistence, changing the ontology, sharing, AI inference of templates, production routing for created cells, and browsing the category tree.

## Capabilities

### New Capabilities
- `app-ux-flows/showcases/sc-pet-001`: the SC-PET-001 "Create Ginger" research scenario. It covers its screens, creating a pod with an optional category, the template suggestion, applying the Pet template, state shared between screens, and completion.

### Modified Capabilities
- `app-ux-flows/flow-runtime`: in "Flow definition", a showcase may declare a display code; it still may not declare variants, a variant selection mode or a default variant.
- `app-ux-flows/design-system`: in "Bottom sheet component", the content behind an open sheet is dimmed by a dark backdrop instead of staying undimmed. This also changes the Add form sheet of `exp-pet-002`.
- `app-ux-flows/experiments/exp-pet-002`: in "Pod fixture and server-provided medication record", the Ginger fixture's breadcrumb changes from "Pets > Care & Feeding" to "Pets". `chat-add-medication` reuses this requirement by reference, so its spec text does not change.

## Impact

- `apps/app-ux-flows/src/slices/flow/runtime/define-flow.ts`: the showcase type allows `code`. The catalogue already reads `flow.code` for any flow.
- `apps/app-ux-flows/src/slices/flow/pods/catalog/`:
  - the user-defined template, cell creation without a category, `applyTemplate`, and template suggestions are added;
  - the form shape, renderer, validation and vocabulary modules are removed.
- `apps/app-ux-flows/src/slices/flow/flows/add-pet-pod/` is replaced by `flows/sc-pet-001/`. The registry and the flow-list test assertions are updated.
- `apps/app-ux-flows/src/shared/ui/select-field.tsx` and `text-field.tsx` go back to their earlier props.
- `apps/app-ux-flows/src/app/locales/en.ts`: `flows.addPetPod` and `pods.catalog.shapes` are replaced by `flows.scPet001` strings.
- No new dependencies. No analytics, routing or deployment changes.
