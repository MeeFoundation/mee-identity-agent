## MODIFIED Requirements

### Requirement: Demo experiment identity and variants
The application SHALL register an experiment flow with flow id `exp-demo-001`, display code `EXP-DEMO-001` and title "A/B demo: empty state call to action". It SHALL use explicit variant selection with exactly two variants, in this order:
- `a`, display code `EXP-DEMO-001-A`, named "A · Control": the standard empty state card.
- `b`, display code `EXP-DEMO-001-B`, named "B · Prominent call to action": the prominent empty state card.

Each variant SHALL have a description that states what the variant shows. The default variant SHALL be `a`. The flow SHALL declare these screens:
- `ginger-notes`: the Ginger pod's Notes tab.
- `ginger-info`: the Ginger pod's Info tab, before the Medication form is added.
- `medication-added`: the Info tab after the Medication form was added.

`ginger-notes` SHALL be the initial screen in both variants, so the pod opens on its Notes tab. The flow SHALL NOT declare Figma design frames.

#### Scenario: Presenter chooses a variant on the home page
- **WHEN** the home page is shown
- **THEN** the EXP-DEMO-001 row offers one start action per variant, "A · Control" and "B · Prominent call to action", each with its description available on demand, instead of a single Start action

#### Scenario: Starting variant B
- **WHEN** the presenter starts variant B from the home page
- **THEN** the Ginger pod's Notes tab is shown at `/flows/exp-demo-001/ginger-notes?variant=b`

#### Scenario: Opened without a variant
- **WHEN** someone opens `/flows/exp-demo-001` without a `variant` parameter
- **THEN** variant `a` is used, and no automatic assignment is stored

#### Scenario: Switching variant by URL
- **WHEN** the presenter edits the URL of an open run from `?variant=a` to `?variant=b`
- **THEN** the same screen is shown in variant B, and a new run starts in variant `b`

### Requirement: Info tab before the medication is added
`ginger-info` SHALL show the Ginger pod top bar with the Info tab selected. It SHALL show the Forms section with the Ginger pod's empty state title ("You have no forms yet"), the empty state message, and an "Add medication" action. Below it there SHALL be a divider and the pod's category rows. Activating the Notes tab SHALL show `ginger-notes`. The Chat tab and the category rows SHALL be inert. Using the "Add medication" action SHALL add the Medication form and show `medication-added`.

#### Scenario: Add from the empty state
- **WHEN** the presenter uses "Add medication" on `ginger-info` in either variant
- **THEN** the Medication form is added and `medication-added` is shown

#### Scenario: Back to Notes
- **WHEN** the presenter on `ginger-info` selects the Notes tab
- **THEN** `ginger-notes` is shown with the Notes tab selected

#### Scenario: Inert tabs
- **WHEN** the presenter selects the Chat tab
- **THEN** the screen does not change

## ADDED Requirements

### Requirement: Notes tab
`ginger-notes` SHALL show the Ginger pod top bar with the Notes tab selected, and the pod's note area and formatting toolbar as in EXP-PET-002's "Notes tab". Typing SHALL be possible. The text SHALL be kept for the rest of the run and has no other effect. The toolbar buttons SHALL do nothing. Activating the Info tab SHALL show `ginger-info`. The Chat tab SHALL be inert. `ginger-notes` SHALL look the same in both variants, because it does not show the empty state card.

#### Scenario: Pod opens on Notes
- **WHEN** the presenter starts either variant
- **THEN** `ginger-notes` is shown with the empty note area and its placeholder

#### Scenario: Reach the empty state
- **WHEN** the presenter on `ginger-notes` selects the Info tab
- **THEN** `ginger-info` is shown with the variant's empty state card

#### Scenario: Notes are kept
- **WHEN** the presenter types a note, switches to Info and back to Notes
- **THEN** the typed note is still shown
