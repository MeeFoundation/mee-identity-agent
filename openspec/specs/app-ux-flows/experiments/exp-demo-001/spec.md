# app-ux-flows/experiments/exp-demo-001 Specification

## Purpose

Defines the demonstration experiment EXP-DEMO-001 "A/B demo: empty state call to action" in `app-ux-flows`. It shows how an A/B test works when the two variants differ by exactly one building-block component: the Forms section's empty state card. It is for demonstration only, not for a participant study.

## Requirements

### Requirement: Demo experiment identity and variants
The application SHALL register an experiment flow with flow id `exp-demo-001`, display code `EXP-DEMO-001` and title "A/B demo: empty state call to action". It SHALL use explicit variant selection with exactly two variants, in this order:
- `a`, display code `EXP-DEMO-001-A`, named "A · Control": the standard empty state card.
- `b`, display code `EXP-DEMO-001-B`, named "B · Prominent call to action": the prominent empty state card.

Each variant SHALL have a description that states what the variant shows. The default variant SHALL be `a`. The flow SHALL declare these screens:
- `ginger-info`: the Ginger pod's Info tab, before the Medication form is added.
- `medication-added`: the Info tab after the Medication form was added.

`ginger-info` SHALL be the initial screen in both variants. The flow SHALL NOT declare Figma design frames.

#### Scenario: Presenter chooses a variant on the home page
- **WHEN** the home page is shown
- **THEN** the EXP-DEMO-001 card offers one start button per variant, "A · Control" and "B · Prominent call to action", each with its description, instead of a single Start button

#### Scenario: Starting variant B
- **WHEN** the presenter starts variant B from the home page
- **THEN** the Ginger pod's Info tab is shown at `/flows/exp-demo-001/ginger-info?variant=b`

#### Scenario: Opened without a variant
- **WHEN** someone opens `/flows/exp-demo-001` without a `variant` parameter
- **THEN** variant `a` is used, and no automatic assignment is stored

#### Scenario: Switching variant by URL
- **WHEN** the presenter edits the URL of an open run from `?variant=a` to `?variant=b`
- **THEN** the same screen is shown with variant B's empty state card, and a new run starts in variant `b`

### Requirement: Single component difference
Variant `b` SHALL differ from variant `a` only in the empty state card building-block component. Both variants SHALL use the same screens, initial state, navigation, texts outside the empty state card, and every other component. Variant `a` SHALL NOT override anything.

#### Scenario: Only the empty state card changes
- **WHEN** the presenter compares `ginger-info` in variant `a` and variant `b`
- **THEN** the top bar, Forms section label, divider and category rows look the same, and only the Forms section's empty state card is different

#### Scenario: After adding, variants look the same
- **WHEN** the Medication form has been added in either variant
- **THEN** `medication-added` looks the same in both variants, because the empty state card is no longer shown

### Requirement: Info tab before the medication is added
`ginger-info` SHALL show the Ginger pod top bar with the Info tab selected. It SHALL show the Forms section with the Ginger pod's empty state title ("You have no forms yet"), the empty state message, and an "Add medication" action. Below it there SHALL be a divider and the pod's category rows. The Notes and Chat tabs and the category rows SHALL be inert. Using the "Add medication" action SHALL add the Medication form and show `medication-added`.

#### Scenario: Add from the empty state
- **WHEN** the presenter uses "Add medication" on `ginger-info` in either variant
- **THEN** the Medication form is added and `medication-added` is shown

#### Scenario: Inert tabs
- **WHEN** the presenter selects the Notes or Chat tab
- **THEN** the screen does not change

### Requirement: Control empty state card (variant A)
In variant `a`, the empty state SHALL use the standard Tellipod empty state card: a white card with the centred title and message, and a full-width, link-style "Add medication" action with a plus icon underneath.

#### Scenario: Control card
- **WHEN** `ginger-info` is shown in variant `a`
- **THEN** the empty state card matches the one in the other Ginger pod flows, with a link-style "Add medication" action

### Requirement: Prominent empty state card (variant B)
In variant `b`, the empty state SHALL use a prominent card. It SHALL take the same title, message and action as the control card, and SHALL show:
- a highlighted card background or border that sets it apart from the surrounding cards,
- a decorative icon above the title,
- the title with stronger emphasis than in the control card,
- the message,
- the action as a filled, full-width primary button with a plus icon and the same "Add medication" label.

The prominent card SHALL accept exactly the inputs of the control card, so screens render it without knowing which variant is active. Without an action, it SHALL show no button.

#### Scenario: Prominent card
- **WHEN** `ginger-info` is shown in variant `b`
- **THEN** the empty state shows an icon, the emphasised "You have no forms yet" title, the message, and a filled primary "Add medication" button

#### Scenario: Same action in both variants
- **WHEN** the presenter uses the filled "Add medication" button in variant `b`
- **THEN** the same thing happens as with the link-style action in variant `a`: the Medication form is added and `medication-added` is shown

### Requirement: Medication added screen
`medication-added` SHALL show the Info tab with the Medication form added to the Forms section, displayed as in the other Ginger pod flows. Showing it SHALL complete the run without a completion overlay. Opening `/flows/exp-demo-001/medication-added` directly SHALL also count as the form having been added.

#### Scenario: Run completes
- **WHEN** `medication-added` is shown
- **THEN** the run is completed and the Info tab with the added Medication form stays visible

#### Scenario: Direct link
- **WHEN** someone opens `/flows/exp-demo-001/medication-added?variant=b`
- **THEN** the Info tab with the added Medication form is shown

### Requirement: Demo analytics event
Using the "Add medication" action SHALL record the interaction event `medication_form_added` with property `method: empty_state`, in both variants, on screen `ginger-info`. The variant SHALL be identified only by the automatic run context, never by the event name or properties. The flow's lifecycle events SHALL be recorded as for any experiment flow.

#### Scenario: Comparing the variants in the console
- **WHEN** the presenter, in a development build, completes one run in variant `a` and one in variant `b`
- **THEN** the console shows `medication_form_added` with `method: empty_state` for both runs, told apart only by variant `a` and `b` in the automatic context, followed by each run's `flow_completed`
