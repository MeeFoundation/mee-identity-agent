## Context

`app-ux-flows` flows are `defineFlow()` definitions under `slices/flow/flows/<id>/`. Each flow has:
- a screens map,
- a component environment (`defaultComponents`, `podComponents`, `chatComponents`),
- a per-run Jotai store.

Screens navigate only through `useFlowNavigation().goToScreen/back/complete`. This change's first version, already implemented and not yet archived, built the category-first showcase `add-pet-pod` on top of a pod catalog in `slices/flow/pods/catalog/`:
- Pets categories and templates with ontology IRIs, and `createPodFromTemplate`/`fillPodForm`;
- `PetShape` field descriptors, `ShapeForm`, validation, and species/breed/unit vocabularies.

SC-PET-001 replaces that flow (see proposal.md, Why) and keeps the catalog's categories and templates. In the ontology (`app-behavior.md`, "Lazy Instantiation"), a pod without a category is created from `ctpl:UserDefinedTemplatePod`. That template carries only `pod:memberShape pshapes:ContactInfoShape` and declares no tool. This is the generic pod of SC-PET-001.

Showcases currently cannot declare `code`: `ShowcaseDefinition` sets `code?: never` in `runtime/define-flow.ts`. `catalogue.ts` already reads `flow.code` for any flow.

## Goals / Non-Goals

**Goals:**
- SC-PET-001 is the first consumer of a reusable pattern for pet scenarios. Pod screens and the suggestion card are generic; the scenario supplies the name, the template to suggest, and state.
- One pod record per run is the only source of the pod's name, category and forms.

**Non-Goals:**
- Filling in the Pet profile form, medication, sharing, persistence, or production routing for created pods.
- A general toast system. None exists, so the optional "Pet template added" confirmation is not built.
- A generic "scenario framework" separate from flows. The flow runtime is that framework, so this change extends it rather than adding a parallel one.

## Decisions

### 1. A research scenario is a showcase with a display code
`ShowcaseDefinition` allows `code?: string`. It still forbids variants, a variant selection mode and a default variant.
- SC-PET-001 is the showcase `sc-pet-001` with code `SC-PET-001`. Its id follows the same pattern as `exp-pet-002`/`EXP-PET-002`.
- Showcases stay untracked: the runner enables analytics only for experiments.

*Alternatives considered:*
- Make it an experiment with no variants. That turns on Matomo tracking, which the scenario doesn't need.
- Add a third flow kind. That adds a new concept and home-page section for one flow.

### 2. Catalog: generic pods, templates applied later, template suggestions as data
In `pods/catalog/`:
- **`templates.ts`** gains `ctpl:UserDefinedTemplatePod` (no category, contact info, no forms). The template lookup accepts "no category" and returns it.
- **`create-pod.ts`**:
  - `createPodFromTemplate({ category?, name, role })` creates a category-less pod from the user-defined template when `category` is omitted. Its breadcrumb is empty.
  - New `applyTemplate(pod, category)` sets the category and breadcrumb and adds the template's forms that the pod lacks. Applying the same template again changes nothing.
  - `PodInstance.creatorRole` stays; SC-PET-001 sets it to "Owner" without asking.
- **`suggestions.ts`** (new): `TemplateSuggestion { category, titleKey, messageKey }` keyed by category IRI, with the Pets entry. Titles take `{{name}}`, so the pod screens render any suggestion without knowing it is about pets.
- **Display names** for forms in a template's structure come from the catalog. The Pet profile shape IRI maps to the label "Pet information", replacing the removed `PetShape.titleKey`.

The flow's initial state carries `suggestedTemplate` (a category IRI, default Pets). This is the "configuration" hook the brief asks for: SC-PET-005 can start a run with a different suggestion, or none, without screen changes.

### 3. Run state: one pod atom; the brief's typed state is derived from it
`flows/sc-pet-001/model.ts` holds six writable atoms:
- `podNameAtom` (string)
- `roleAtom` (string)
- `chosenCategoryAtom` (category IRI | null), the optional category from the New Pod sheet
- `createdPodAtom` (`PodInstance | null`)
- `suggestionDismissedAtom` (boolean)
- `suggestedTemplateAtom` (category IRI | null)

The brief's state is a derived, typed atom:
```ts
type ScenarioState = { podName: string; podCreated: boolean; petTemplateApplied: boolean }
// podName from the pod once created, otherwise from the draft name
// podCreated   = pod !== null
// petTemplateApplied = pod?.category === podcat:Pets
```
Write atoms:
- `createPodAtom`: idempotent, does nothing for a blank name; with a chosen category it creates the generic pod and applies that category's template at once.
- `ensurePodAtom`: creates the default "Ginger" pod for direct links.
- `applySuggestedTemplateAtom` and `dismissSuggestionAtom`.

Storing both a `petTemplateApplied` flag and the pod's category could let them disagree. Deriving the flag from the category avoids that. Unit tests check the derived state against the brief's three fields.

### 4. Screens: one generic pod view, five screens
- `components/pod-view.tsx` renders a `PodInstance` with the existing components:
  - `PodScreen`, `PodTopBar` (letter avatar), `SegmentedTabs`;
  - `SectionLabel`, `EmptyStateCard`, `CategoryRow`, `Divider`;
  - the `CategoryCell` rows already added by this change.

  It takes an optional `suggestion` slot. The structure section is computed from the pod: no forms and no category gives the empty "Forms" state; otherwise a section labelled with the template's form name, holding a row for each form and for each narrower category. None of this checks for Ginger or Pets.
- `components/template-suggestion-card.tsx`: title, message, "Not now" and "Use template", built from the existing `Button` and the card styles used by `EmptyStateCard`/`CardWithAction`.
- **Screens:**
  - `home`: the existing pods screen, reworked to follow Figma "Home - 1".
  - `new-pod`: Home plus a `BottomSheet` with two `TextField`s, a `SelectField` for the optional category, and `Button`.
  - `pod-empty` and `pod-template-applied`: `PodView` for the run's pod.
  - `pod-template-suggested`: `PodView` with the suggestion slot.
- **Suggestion timing:** `pod-empty` starts a 1.5 s timer in an effect and calls `goToScreen('pod-template-suggested')` when the timer fires, if all three hold: a suggestion is configured, it was not dismissed, and the template is not applied. Leaving the screen clears the timer.
- **"Not now"** dismisses the suggestion and calls `goToScreen('pod-empty')` rather than `back()`, so it works when the screen was opened by direct link.

*Alternative considered:* show the suggestion as an overlay inside `pod-empty` without its own screen. Rejected because the brief lists it as screen 05, and as its own screen it gets a URL, a catalogue entry and a place for a later Figma frame. Both screens render the same `PodView`, so nothing is duplicated.

### 5. What is removed, and what is kept
- **Removed:**
  - screens `pods`, `new-pod`, `select-category`, `pet-chat`, `pet-info`, `pet-profile` and `profile-saved`;
  - `shape-form.tsx`, `shape-values.ts`, `form-shape.ts`, `shapes/pet-shape.ts` and `vocab/*`, with their tests;
  - the `flows.addPetPod` and `pods.catalog.shapes` strings;
  - the `disabled` prop on `SelectField` and the `placeholder`/`inputMode` props on `TextField`.

  `knip` would otherwise flag the modules as unused. The real IRIs and descriptor design stay recorded in this change's history for the scenario that fills in a pet's information.
  `ontology-term.ts` and `ScreenTopBar` are removed too: with the vocabularies gone nothing uses the term type, and Home has its own header.
- **Kept:**
  - `categories.ts`, `templates.ts` and `create-pod.ts` (extended);
  - the `PodTopBar` letter avatar;
  - `CategoryCell`, simplified to an inert row since every row in SC-PET-001 is information only;
  - the Ginger breadcrumb fix.

### 6. Taxonomy breadcrumb
A pod's breadcrumb is its category's path in the tree (`categoryPath`), top first, and the header shows the top-level category's icon in front of it, as in the Figma pod header ("People > Immediate Family"). Icons live in `pods/category-icons.ts`, not in the catalog, which describes the ontology only.

### 7. Copy and the optional category
Scenario copy follows the Figma Home section: "Pod", "Add Pod", "New Pod", "Create Pod" and "Subpods". The New Pod sheet reuses Figma's own fields, including "Your role in this Pod" and the optional "Category" select ("Choose category").
- The select lists only categories whose template adds structure, which is Pets here; it is built from the catalog, not from scenario code.
- Leaving it unset is the scripted research path: generic pod, then the suggestion.
- Choosing Pets creates the pod with the Pets template already applied, through the same `applyTemplate`, and goes straight to `pod-template-applied`. Both paths end in the same pod structure, so research can compare them.
- The run state gains `roleAtom` (string, empty at start) and `chosenCategoryAtom` (category IRI or `null`).
## Risks / Trade-offs

- **[Risk] The timed suggestion runs before the tester reads screen 04.** → 1.5 s is long enough to register the generic pod. The delay is one constant, and `pod-empty` can be opened directly to study it without the suggestion.
- **[Risk] Ginger's name would look hardcoded.** → The default "Ginger" lives only in `ensurePodAtom`, for direct links. A test runs the scenario with "Luna" and checks that every screen and the suggestion title use the entered name.
- **[Trade-off] Removing the profile form and vocabularies throws away implemented, tested code.** → It was agreed to defer them. They are recoverable from this change's history when a scenario needs them.
- **[Risk] Uncommitted files under `pods/`.** The repo's `.gitignore` rule `**/Pods/` matches `slices/flow/pods/` on case-insensitive file systems, so `pods/ginger/` and `pods/catalog/` are untracked. → This must be fixed outside this change before committing, or the catalog will be left out.

## Migration Plan

This affects the demo app only, with no data migration. `/flows/add-pet-pod/...` links stop working, because the flow is replaced by `/flows/sc-pet-001/...`. To roll back, revert the change.
