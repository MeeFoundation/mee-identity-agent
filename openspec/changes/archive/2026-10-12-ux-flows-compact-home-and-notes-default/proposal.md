## Why

The `app-ux-flows` home page shows every flow as a tall card: each variant is a full-width button with its description stacked under it. With six flows the page already needs several screens of scrolling, and every new experiment makes it worse. Separately, pods open on different tabs depending on the flow (Notes in some, Info in others), so testers meet an inconsistent app; and the New Pod sheet asks for a "role" that nothing uses.

## What Changes

- **Home page**: replace the card grid with dense list rows, one per flow. A row shows the display code (development only), the title, a one-line description, and the start actions as compact pills. Variant and case descriptions move into a tooltip. The development catalogue stays collapsed inside the row.
- **Home page order**: show "Showcases" before "Experiments", and show the number of flows in each section heading. **BREAKING** for the spec'd "Experiments first" order.
- **Pods open on Notes everywhere**: every time a pod is opened, it opens on its Notes tab.
  - EXP-PET-003: the default pod opening tab becomes Notes.
  - EXP-PET-004: opening Ginger from Home shows `ginger-notes` instead of `ginger-info`.
  - EXP-DEMO-001: new `ginger-notes` screen, now the initial screen. The Notes and Info tabs switch between screens.
  - SC-PET-001: new `pod-notes` screen, shown whenever the pod is opened (after "Create Pod", from a Telli quick action, from "Open pod"). The Notes and Info tabs switch between screens. When the template suggestion is ready, the Info tab shows a dot. The suggestion itself stays on the Info tab.
  - EXP-PET-002 and chat-add-medication already open on Notes; no change.
- **Segmented tabs**: a tab can show a dot that marks something waiting on it.
- **Remove role**: the "Your role in this Pod" field is removed from the New Pod sheet. Pods no longer have a creator role. **BREAKING** for the `createPodFromTemplate` input and `PodInstance` shape (internal to the app).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-ux-flows/flow-runtime`: "Home page lists available flows". Showcases come first, sections show counts, and variant and case choices are compact with their descriptions on demand.
- `app-ux-flows/design-system`: "Styled home page" moves from cards to dense rows. "Segmented tabs component" gains an optional dot on a tab.
- `app-ux-flows/experiments/exp-demo-001`: the identity/screens requirement adds `ginger-notes` as the initial screen. The Info tab tabs are no longer inert. Adds a Notes tab requirement.
- `app-ux-flows/experiments/exp-pet-003`: "Pod opening tab" defaults to Notes. The "Home" scenario follows.
- `app-ux-flows/experiments/exp-pet-004`: "Apoquel fixture" and "Home, Ginger tabs and Ginger Info". Ginger opens on Notes from Home.
- `app-ux-flows/showcases/sc-pet-001`: identity/screens gains `pod-notes`. "New Pod with an optional category", "Generic pod", "Template suggestion", "Pet template applied", "Quick actions in the Telli chat", "Cases and goals", and "Direct links" change for Notes-first opening, the Info-tab dot, and the removed role.

## Impact

- **Dependency**: this change builds on `sc-pet-001-cases-and-briefing`, which is complete but not archived. Its versions of "Home page lists available flows" and the SC-PET-001 requirements are the baseline here, so archive it before this change.
- **Code** (`apps/app-ux-flows/src`):
  - `slices/home/*` (row layout, section order and counts)
  - `group-flows.ts` and its test
  - `shared/ui/segmented-tabs.tsx` (dot)
  - `slices/flow/pods/ginger/components/notes-area.tsx` and `noteTextAtom`, which move to a shared `pods/notes` module
  - `flows/exp-demo-001`, `flows/exp-pet-003`, `flows/exp-pet-004`, `flows/sc-pet-001` (new screens, tab wiring, model)
  - `pods/catalog/create-pod.ts` and tests (role removal)
  - `app/locales/en.ts`
- **Research impact**: EXP-PET-003 and EXP-PET-004 runs now need one tab switch to reach Info. Results from before and after this change are not directly comparable on time-to-Info.
- No new dependencies. No analytics event changes: existing `pod_opened` / `pod_tab_selected` already cover the Notes tab.
