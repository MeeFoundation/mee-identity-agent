## MODIFIED Requirements

### Requirement: Home page lists available flows
The application's home page SHALL list every flow in the Flow Registry and SHALL let a participant start any listed flow. Flows SHALL be grouped by kind into a "Showcases" section followed by an "Experiments" section. Each section SHALL have a translated heading that shows how many flows it holds. A section with no flows SHALL NOT be shown. Within a section, flows keep their registry order. Each flow SHALL show its title and, when it declares one, its description.

For a flow with explicit variant selection, the home page SHALL let the participant choose which variant to start, with one start action per variant showing the variant's name. For a showcase with cases, it SHALL let the participant choose which case to start, with one start action per case showing the case's code and name. A variant's or case's description SHALL be available on demand from its start action, for example on hover or focus, rather than always shown. For any other flow, it SHALL offer a single start action.

Showcases SHALL be listed in both development and production builds. In production builds the home page SHALL NOT show variant information to the participant. The home page SHALL offer a "Start new test session" action that clears stored automatic variant assignments.

Development builds SHALL additionally show, for each flow, a catalogue, collapsed until opened:
- the flow's display code, if any,
- the stored automatic assignment, if any,
- for each variant or case (or for the base flow when it has neither), its display code, name and description,
- each screen available in that variant or case, with its screen id, its Figma frame name linked to the frame's URL when declared, and a link that opens that screen in that variant or case.

Production builds SHALL NOT show the catalogue, display codes or Figma references.

#### Scenario: Participant views the home page
- **WHEN** a participant opens the application's root URL
- **THEN** they see every registered flow's title, its description when declared, and a way to start it

#### Scenario: Flows are grouped by kind
- **WHEN** the registry holds the experiment `exp-pet-002` and the showcase `chat-add-medication`
- **THEN** `chat-add-medication` is listed under "Showcases" and `exp-pet-002` under "Experiments", with Showcases shown first

#### Scenario: Section heading shows its count
- **WHEN** the registry holds two showcases and four experiments
- **THEN** the headings read "Showcases (2)" and "Experiments (4)"

#### Scenario: Empty section is hidden
- **WHEN** the registry holds no showcase
- **THEN** no "Showcases" heading is shown

#### Scenario: Showcases in production
- **WHEN** a production build shows the home page
- **THEN** the "Showcases" section lists every registered showcase with its title, description and its start actions

#### Scenario: Variant description on demand
- **WHEN** a participant hovers over or focuses the start action of variant `b` of `exp-demo-001`
- **THEN** the variant's description is shown, and it is not shown otherwise

#### Scenario: Participant starts a flow from the home page
- **WHEN** a participant chooses a flow on the home page
- **THEN** a new run of that flow starts from the flow's initial state for its resolved variant or case, and the participant is taken to its initial screen at `/flows/<flowId>/<initialScreenId>`, with `?variant=<variantId>` only when they chose a variant explicitly, and `?case=<caseId>` when they chose a case

#### Scenario: Development catalogue
- **WHEN** a development build shows the home page for flow `exp-pet-002` and the developer opens its catalogue
- **THEN** it shows `EXP-PET-002`, both variants with their codes `EXP-PET-002-A` and `EXP-PET-002-B`, and under each variant its screens with Figma frame names linking to Figma

#### Scenario: Catalogue starts collapsed
- **WHEN** a development build shows the home page
- **THEN** every flow's catalogue is collapsed, and opening one does not open the others

#### Scenario: Showcase catalogue
- **WHEN** a development build shows the home page for showcase `chat-add-medication`
- **THEN** its catalogue shows no display code and no variants, and lists the base flow's screens with their Figma frame names and links that open each screen

#### Scenario: Catalogue deep link
- **WHEN** someone in a development build activates the catalogue link for screen `medical` of variant `a`
- **THEN** `/flows/exp-pet-002/medical?variant=a` opens in a new run

#### Scenario: Production hides the catalogue
- **WHEN** a production build shows the home page
- **THEN** no display code, variant, screen list or Figma reference is shown

#### Scenario: Choose a case
- **WHEN** a participant views the home page and showcase `sc-pet-001` has cases
- **THEN** its row offers "SC-PET-001-A", "SC-PET-001-B" and "SC-PET-001-C" with their names, and choosing B opens `/flows/sc-pet-001/home?case=b`
