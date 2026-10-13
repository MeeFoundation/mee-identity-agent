## Context

`app-ux-flows` (Vite + React 19 + TanStack Router + Jotai + Tailwind 4 + Base UI) already has a flow runtime with:
- typed screens,
- a layered component environment,
- variants (component, screen and initial-state overrides; automatic sticky assignment; `?variant=`),
- a device frame (393×852 screen area, with a full-screen fallback at 480px and below).

The only flow, `add-medication`, is a placeholder that will be deleted (see proposal.md). The Figma source is file `cd6NZmMxZHC7qTOk0SXYVW` (Mee – Tellipod App v4.0.3), sections `1203:25804` (EXP-PET-002-A) and `1203:25878` (EXP-PET-002-B). Figma frames are 402×874; the device frame's screen area is 393×852, so layouts must be fluid in width rather than pixel-copied.

The medication data follows the Tellipod Pets ontology (MeeFoundation/tpod-ontologies, `other/pets.ttl`, README "Medication-Related Classes and Properties").

Behaviour is specified in `specs/app-ux-flows/experiments/exp-pet-002/spec.md`. Metadata and home-page behaviour are in the `flow-runtime` and `flow-variants` deltas. Components are in the `design-system` delta. Overlays are in the `device-frame` delta. This document covers only how to build them.

## Goals / Non-Goals

**Goals:**
- Screens that look like the Figma frames, built from reusable pod components, with each screen traceable to its frame.
- A variant B that differs from A by as little code as possible.
- Experiment metadata stored next to the flow definition, so code, home-page catalogue and Figma cannot drift apart.

**Non-Goals:**
- A real Markdown/rich-text editor or simulated iOS keyboard. The Notes frame shows a keyboard; we show only the focused note area and toolbar.
- Pixel-perfect sizing to the 402px frame width.
- Ontology/RDF processing. IRIs are carried as plain strings.
- Promoting pod components into `defaultComponents` (see Decision 6).

## Decisions

### 1. One experiment = one flow; variant ids `a` / `b`
Flow id `exp-pet-002`, variants `a` and `b`, `variantSelection: 'automatic'`. Variant ids must match the existing URL-safe pattern (`^[a-z][a-z0-9]*(-[a-z0-9]+)*$`), so the Figma-style names live in separate display codes: `code: 'EXP-PET-002'` on the flow and `code: 'EXP-PET-002-A'` / `'EXP-PET-002-B'` on the variants.
- *Alternative*: derive a variant code as `${flow.code}-${id.toUpperCase()}`. Rejected: it ties URL ids to display codes and breaks for ids like `prominent-action`.

### 2. Metadata shape on `FlowDefinition` / `VariantDefinition`
```ts
type DesignFrame = { name: string; url: string }   // e.g. { name: 'EXP-PET-002-A - Medical (empty)', url: 'https://www.figma.com/design/cd6N…?node-id=1203-25845' }

FlowDefinition  += { code?: string; descriptionKey?: string; designFrames?: Partial<Record<S, DesignFrame>> }
VariantDefinition += { code?: string; designFrames?: Partial<Record<S, DesignFrame>> }
ResolvedFlow    += { code: string | null; variantCode: string | null; descriptionKey: string | null;
                     designFrames: Partial<Record<S, DesignFrame>> }   // base frames shallow-merged with the variant's
```
- `resolveFlow` merges `designFrames` the same way it merges `screens`.
- The full frame URL is stored per screen. There is no flow-level file key or link, as the user asked.
- Frame names are design identifiers, so they are not passed through i18next. They appear only in the dev catalogue.
- For EXP-PET-002 the base flow declares A's five frames. Variant A declares none and inherits them. Variant B overrides only `ginger-info` and `medication-added`, so its shared screens keep A's references, as the spec requires.
- *Alternatives*: a Markdown catalogue beside the flow (drifts from code), or reading frames from Figma at runtime (network dependency, out of scope).

### 3. Dev-only catalogue built in the home route loader
`routes/home.tsx` already computes `assignedVariantId` only when `import.meta.env.DEV`. It will also build `catalogue` only in DEV, using a pure helper `listFlowCatalogue(flow)` next to `registry.ts`. The helper resolves every variant (or the base flow) with `resolveFlow` and returns:
- the flow's code,
- per variant: id, code, nameKey, descriptionKey,
- per variant screen: screenId, frame, and a link target `{ flowId, screenId, variantId }`.

`HomePage` renders the catalogue as a collapsible section in the flow card. The deep link opens the screen through TanStack `Link` with `search: { variant }`. Production builds get `catalogue: null`, so nothing renders and the code is tree-shaken by `import.meta.env.DEV`.

### 4. Variant B is an initial-state flag, not a screen override
Initial state is `{ pod?: Pod; medication?: MedicationRecord; showAiSuggestion?: boolean }`. Variant B sets `initialState: { showAiSuggestion: true }`. The shared Info view renders the AI suggestion when `showAiSuggestion && !medicationFormAdded`. B also overrides `designFrames` for `ginger-info` and `medication-added`.
- *Alternative*: override the `ginger-info` screen in B. Rejected: it would duplicate the whole Info screen to add one block. The runtime's initial-state precedence (flag only, no deep merge) already gives exactly this.

### 5. Screens and run state
Atoms in `flows/exp-pet-002/model.ts`:

| Atom | Type | Initial |
|---|---|---|
| `podAtom` | `Pod` (name, avatar URL, breadcrumb segments, member count) | Ginger fixture |
| `medicationAtom` | `MedicationRecord` | initial state ?? Ginger medication fixture |
| `medicationFormAddedAtom` | `boolean` | `false` |
| `showAiSuggestionAtom` | `boolean` | initial state ?? `false` |
| `sheetOriginAtom` | `'ginger-info' \| 'medical'` | `'ginger-info'` |
| `noteTextAtom` | `string` | `''` |

`addMedicationFormAtom` is a write-only atom that sets `medicationFormAddedAtom` to `true`. It is idempotent, which is what makes "Saving twice does not duplicate" hold.

| Screen id | Component | Notes |
|---|---|---|
| `ginger-notes` | `GingerNotesScreen` | `PodScreen` + `PodTopBar` (tab Notes) + `NotesArea` (flow-specific) |
| `ginger-info` | `GingerInfoScreen` | renders `PodInfoView` |
| `medical` | `MedicalScreen` | top bar without tabs; empty state, or the form card once added |
| `add-form` | `AddFormScreen` | renders the origin view (`PodInfoView` or `MedicalView`) underneath, plus `BottomSheet` open |
| `medication-added` | `MedicationAddedScreen` | renders `PodInfoView` with `medicationFormAdded` forced on, and marks the atom in a layout effect so later screens agree |

- `ginger-info` and `medication-added` are the same view under two screen ids. That keeps a one-to-one mapping to the Figma frames and gives analytics a distinct "success" screen, without duplicating UI.
- The "+ Add form" and "+ Add medication" actions set `sheetOriginAtom` and then `goToScreen('add-form')`.
- Save calls `addMedicationForm()` and then `goToScreen('medication-added')`.
- Dismiss calls `back()`.
- The flow never calls `complete()`. The experiment's end state is `medication-added`; a completion view would hide it.

### 6. Sheet as a screen, rendered inside the device frame
`add-form` is a URL-addressable screen, so it maps to its Figma frame, can be deep-linked, and is visible to analytics. Browser back closes it.
- `BottomSheet` wraps the Base UI `Dialog` (`modal`, always `open` while the screen is shown). `onOpenChange(false)` calls `onDismiss`.
- `DeviceFrame` gets an overlay host: an `absolute inset-0` element over the scroll area, inside the clipped screen. It is exposed through a small `OverlayContainerContext` (`shared/lib/overlay-container.tsx`, so shared components can read it without depending on a slice). `BottomSheet` and `SelectField` pass it as the Base UI `Portal` `container`.
- On the phone fallback the screen area is the viewport, so the same host covers the viewport, which satisfies the device-frame delta.
- *Alternative*: local `useState` overlay on the Info screen. Rejected: no URL, no frame mapping, and the sheet could not be opened from `medical` without duplicating it.

### 7. Component placement and environment
New generic Tellipod pod components go in `shared/ui/`, with Base UI wrappers in `shared/ui/primitives/` (`tabs.tsx`, `dialog.tsx`, `select.tsx`, `collapsible.tsx`), written by hand in the same style as the existing primitives. The files:

| Component | File |
|---|---|
| `PodScreen` (gradient background + top bar slot + scroll content) | `pod-screen.tsx` |
| `PodTopBar` | `pod-top-bar.tsx` |
| `SegmentedTabs` | `segmented-tabs.tsx` |
| `SectionLabel` | `section-label.tsx` |
| `EmptyStateCard` | `empty-state-card.tsx` |
| `CategoryRow` (with count badge) | `category-row.tsx` |
| `Divider` | `divider.tsx` |
| `BottomSheet` | `bottom-sheet.tsx` |
| `SelectField` | `select-field.tsx` |
| `FormCard` + `FieldRow` | `form-card.tsx` |
| `AiSuggestion` | `ai-suggestion.tsx` |

- The exp-pet-002 flow registers them in its own component environment (`{ ...defaultComponents, ...podComponents }`). Screens get them via `useFlowComponents()`, and a later variant can swap any of them.
- They are not added to `defaultComponents` yet. Only one flow uses them; promote them when a second flow does.
- `NotesArea` (textarea + inert toolbar) and `PodInfoView` / `MedicalView` stay inside the flow folder, because they compose state rather than being reusable blocks.
- *Alternative*: `shadcn add` for the primitives. Rejected for now: it runs a CLI that changes project files and dependencies, and the existing primitives were hand-adapted anyway.

Icons come from `react-bootstrap-icons`, React components for the official Bootstrap Icons set that the Mee Design System uses. The Figma frames name them directly: `chevron-left`, `three-dots-vertical`, `hearts`, `paperclip`, `diagram-3`, `people`, `capsule`, `pencil`, `plus`, `folder-plus`, `stars`, `chevron-down`, `chevron-right`, plus the 16 rich-text toolbar icons. The glyphs were checked by rendering them side by side with the Figma exports, and they are identical.
- Icons use `currentColor`, so colour comes from theme tokens: `text-gray-700` for UI icons, `text-brand-500` for category and form icons, and `text-brand-700` for the breadcrumb. Icons inside buttons inherit the button's text colour, so one `Plus` serves both the brand and gray actions.
- Shared components take icons as component props (`icon: Icon`), not image URLs.
- Only non-icon artwork stays as Figma-exported files in `shared/ui/icons/`: the pod background and the divider line.
- *Alternative*: keep the Figma SVG exports. Rejected: their colours are baked in, which needs one file per colour, and it duplicates a published icon set. Another option was the official `bootstrap-icons` package with `vite-plugin-svgr`. It was rejected because it needs two dependencies and a Vite config change.
- The avatar is cropped to Figma's 48px window at 3×, re-encoded as PNG, and stripped of all metadata. The source photo carried camera EXIF and GPS data.

### 7a. Pod top bar extends behind the status bar
In Figma the top bar's gradient starts at the very top of the phone, behind the status bar. `DeviceFrame` therefore overlays the status bar (`absolute`, transparent) on the screen area, and pads the scroll area by `--status-bar-h`: 64px in the frame and 0px in the phone fallback. Non-pod content (the completion view) still starts below the status bar. `PodScreen` pulls its top bar up by `--status-bar-h` and re-adds it as padding, so the gradient runs behind the status bar exactly as in Figma.

### 7b. Figma variables → theme tokens
| Figma variable | Theme token |
|---|---|
| surface/default/main | `white` |
| surface/brand/light (#dfecee) | `brand-100` |
| surface/brand/soft (#f3f8f8) | `brand-50` |
| stroke/brand/light (#c3dcde) | `brand-200` |
| stroke/brand/accent (#9ac2c6) | `brand-300` |
| stroke/brand/main (#4f868e) | `brand-500` |
| text/brand/solid, surface/brand/solid (#3b5b63) | `brand-700` |
| text/default/title, surface/gray/intense (#0f172a) | `gray-900` |
| text/default/body (#1e293b) | `gray-800` |
| text/gray/solid (#334155) | `gray-700` |
| text/default/subtle (#475569) | `gray-600` |
| text/default/placeholder (#64748b) | `gray-500` |
| stroke/gray/accent (#cbd5e1) | `gray-300` |
| stroke/gray/light, surface/gray/accent (#e2e8f0) | `gray-200` |
| surface/gray/light (#f1f5f9) | `gray-100` |
| primary/gray/50 (#f8fafc) | `gray-50` |
| alpha/dark/5, /10 | `gray-950/5`, `gray-950/10` |
| rounded/xl 12, 2xl 16 | `rounded-xl`, `rounded-2xl` |
| rounded/2lg 10, 3xl 28 | new `rounded-2lg`, `rounded-3xl` |
| Box shadow/1st Level | new `shadow-card` |
| shadow-2 (selected tab) | new `shadow-tab` |
| Modal shadow | new `shadow-sheet` |
| home-topbar drop shadow | new `drop-shadow-topbar` |
| Gradient/Button/Brand | existing primary filled `Button` |
| type styles (XS/SM/Base/LG/XL, Regular/Medium/SemiBold) | `text-*` + `font-normal/medium/semibold` |

### 8. Medication view model, close to the ontology
```ts
type OntologyTerm = { iri: string; label: string }
type MeasurementUnit = OntologyTerm & { symbol: string }
type MedicationRecord = {
  activeIngredients: readonly [OntologyTerm, ...OntologyTerm[]]        // pets:hasActiveIngredient (ChEBI)
  brandName?: string                                                    // pets:medicationBrandName
  manufacturer?: string                                                 // pets:medicationManufacturer
  dosage: { value: number; unit?: MeasurementUnit }                     // pets:hasDosageAmount (CCO value + unit)
  doseForm?: OntologyTerm                                               // pets:hasDoseForm (DrOn)
  frequencyPerDay: string                                               // pets:medicationFrequencyPerDay
  startDate?: string                                                    // ISO date, cco:ent00000017 on the administration interval
}
```
- Default fixture, matching the Figma frame:
  - active ingredient `http://purl.obolibrary.org/obo/CHEBI_2676` "Amoxicillin",
  - brand name Clavamox,
  - manufacturer Zoetis,
  - dosage 62.5 with unit `https://www.commoncoreontologies.org/ont00001413` "Milligram Measurement Unit" / `mg`,
  - dose form `http://purl.obolibrary.org/obo/DRON_00000022` "Tablet",
  - frequency `"2"`,
  - start date `2026-10-06`.

  The ontology's own example uses two ingredients, one tablet per dose and a start date of 2026-08-10. We follow Figma, since the experiment is about the UI.
- A pure function `toMedicationFieldRows(record, t, language)` returns the ordered `{ id, label, value }[]` and leaves out missing fields. Unit tests cover it.
- Frequency uses i18next plurals: `count === 1` gives "Once per day", otherwise "{{count}} times per day". Strings that are not whole numbers pass through unchanged.
- The start date is parsed as a local calendar date (`new Date(y, m - 1, d)`) and formatted with `Intl.DateTimeFormat(language, { dateStyle: 'medium' })`. That avoids the UTC shift that would show Oct 5 in the Americas.

### 9. Strings
All visible text comes from `en.ts` under `flows.expPet002.*`: titles, labels, empty states, sheet copy, template names, field labels, the frequency plural and tab names. The shared components' accessible labels go under `ui.*`. Fixture data (Ginger, Clavamox, …) is data, not UI copy, so it is not translated.

## Risks / Trade-offs

- [Browser back after Save returns to the open sheet] → Save is idempotent and goes to `medication-added`, so nothing breaks. This is acceptable for a prototype.
- [`medication-added` marks state from an effect] → It renders with the form forced on, so there is no flash. The effect only syncs the atom for later screens.
- [Base UI `Portal` container inside a CSS-`transform`ed frame] → The frame scales with `transform`, which becomes the containing block for `position: fixed`. Overlays use `absolute` positioning inside the host, not `fixed`. Verify the select popup's positioning inside the scaled frame.
- [Figma inconsistencies: the modal frame's "Add medication" label and missing Medical row; B's Info list without Medical] → Treated as design bugs (user-confirmed for A). Both variants show the same rows. Recorded in the spec.
- [Old `ux-flows:variant:add-medication` keys stay in testers' localStorage] → They are harmless and cleared by "Start new test session".
- [Spec examples in `flow-variants` still name `prominent-action` / `add-medication`] → They are illustrative ids in scenarios unrelated to this change. They are left as they are rather than rewriting six requirements.

## Migration Plan

This is a prototype app, not deployed to users. Delete the old flow and register the new one in the same change. Rollback means reverting the change. Old `/flows/add-medication/...` links show the not-found state.

## Open Questions

- What does Medical's "+ Add medication" lead to after Save? There is no frame for it, so we land on `medication-added` (Ginger / Info). Design may later want Save to return to `medical`. That would only change one navigation call and one spec scenario.
