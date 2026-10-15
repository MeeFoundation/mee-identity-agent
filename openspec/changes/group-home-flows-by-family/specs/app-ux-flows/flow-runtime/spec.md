## MODIFIED Requirements

### Requirement: Home page lists available flows
The application's home page SHALL list every flow in the Flow Registry and SHALL let a participant start any listed flow. Flows SHALL be grouped by kind into a "Showcases" section followed by an "Experiments" section. Each section SHALL have a translated heading that shows how many flows it holds. A section with no flows SHALL NOT be shown. Within a section, flows keep their registry order. Each flow SHALL show its title and, when it declares one, its description.

Within a section, flows SHALL be grouped by code family. A flow's code family is its display code without the final hyphen-separated segment, so `SC-PET-003` belongs to `SC-PET` and `EXP-DEMO-001` to `EXP-DEMO`. Families SHALL NOT be shared across sections. A family with two or more listed flows in a section SHALL be shown as one expandable group. A flow without a display code, or the only listed flow of its family, SHALL be shown as a plain row, not inside a group. Groups and plain rows SHALL keep registry order: a group takes the place of its first flow, and the flows inside it keep their registry order. Grouping SHALL apply in development and production builds, and SHALL count only the flows the build lists.

Each group SHALL show a translated title for its family, for example "Pet care" for `SC-PET` and `EXP-PET`, and "People" for `SC-PPL`, followed by how many flows it holds. In development builds the group SHALL also show its family code verbatim, for example `SC-PET`. Production builds SHALL NOT show the family code. In development builds, a group whose flows are all hidden SHALL be marked "Hidden in production".

A group SHALL start collapsed, showing only its title, count and, in development builds, its family code. Activating the group's header SHALL expand it to show its flows' rows, and activating it again SHALL collapse it. Expanding one group SHALL NOT expand any other. The application SHALL remember which groups are expanded for the browser tab, so that returning to the home page, for example after running a flow or reloading, shows the same groups expanded. When the browser keeps no per-tab storage, every group SHALL start collapsed. The header SHALL expose whether the group is expanded to assistive technology. A section's count SHALL include the flows inside its groups.

For a flow with explicit variant selection, the home page SHALL let the participant choose which variant to start, with one start action per variant showing the variant's name. For a showcase with cases, it SHALL let the participant choose which case to start, with one start action per case showing the case's code and name. A variant's or case's description SHALL be available on demand from its start action, for example on hover or focus, rather than always shown. For any other flow, it SHALL offer a single start action.

Showcases SHALL be listed in both development and production builds. Production builds SHALL NOT list hidden flows, and SHALL NOT offer start actions for hidden variants or cases. A section's count SHALL include only the flows it lists. Development builds SHALL list hidden flows, variants and cases with their start actions. Each hidden one SHALL be marked "Hidden in production": on the flow's row, on the variant's or case's start action, and on its catalogue entry. In production builds the home page SHALL NOT show variant information to the participant. The home page SHALL offer a "Start new test session" action that clears stored automatic variant assignments.

Development builds SHALL additionally show, for each flow, a catalogue, collapsed until opened:
- the flow's display code, if any,
- the stored automatic assignment, if any,
- for each variant or case (or for the base flow when it has neither), its display code, name and description,
- each screen available in that variant or case, with its screen id, its Figma frame name linked to the frame's URL when declared, and a link that opens that screen in that variant or case.

Production builds SHALL NOT show the catalogue, display codes or Figma references.

#### Scenario: Participant views the home page
- **WHEN** a participant opens the application's root URL
- **THEN** they see every registered flow's title, its description when declared, and a way to start it, with flows inside a group shown once the group is expanded

#### Scenario: Flows are grouped by kind
- **WHEN** the registry holds the experiment `exp-pet-002` and the showcase `chat-add-medication`
- **THEN** `chat-add-medication` is listed under "Showcases" and `exp-pet-002` under "Experiments", with Showcases shown first

#### Scenario: Section heading shows its count
- **WHEN** the registry holds two showcases and four experiments
- **THEN** the headings read "Showcases (2)" and "Experiments (4)"

#### Scenario: Empty section is hidden
- **WHEN** the registry holds no showcase
- **THEN** no "Showcases" heading is shown

#### Scenario: Flows grouped by code family
- **WHEN** the registry holds `sc-pet-001`, `sc-pet-002`, `sc-pet-003`, `sc-pet-004`, `chat-add-medication` (`SC-PET-005`), `sc-ppl-001`, `sc-ppl-002` and `sc-ppl-003` as showcases, and none is hidden
- **THEN** the "Showcases (8)" section shows a group "Pet care (5)" holding SC-PET-001 to SC-PET-005 in that order, followed by a group "People (3)" holding SC-PPL-001 to SC-PPL-003

#### Scenario: Same family name in two sections
- **WHEN** the registry holds the SC-PET showcases and the experiments `exp-pet-002` to `exp-pet-005`
- **THEN** "Showcases" has its own "Pet care" group with the SC-PET flows, and "Experiments" has a separate "Pet care (4)" group with EXP-PET-002 to EXP-PET-005

#### Scenario: Single-flow family stays a plain row
- **WHEN** `exp-demo-001` is the only listed flow of family `EXP-DEMO`
- **THEN** it is shown as a plain row in "Experiments", not inside a group, at its registry position relative to the "Pet care" group

#### Scenario: Flow without a display code
- **WHEN** a listed flow declares no display code
- **THEN** it is shown as a plain row and is not part of any group

#### Scenario: Groups start collapsed
- **WHEN** someone opens the home page in a new browser tab
- **THEN** every group shows only its title and count, and none of its flows' rows or start actions

#### Scenario: Expand and collapse a group
- **WHEN** someone activates the header of the showcases' "Pet care" group, then activates it again
- **THEN** the group first shows its flows' rows with their start actions while the other groups stay collapsed, then collapses again

#### Scenario: Expanded groups are remembered
- **WHEN** someone expands the experiments' "Pet care" group, starts EXP-PET-003 and then returns to the home page in the same tab
- **THEN** the experiments' "Pet care" group is still expanded and every other group is collapsed

#### Scenario: Family code in development
- **WHEN** a development build shows the home page
- **THEN** the showcases' "Pet care" group shows the code `SC-PET` and the experiments' "Pet care" group shows `EXP-PET`

#### Scenario: Family code hidden in production
- **WHEN** a production build shows the home page
- **THEN** each group shows its title and count, and no family code

#### Scenario: Hiding shrinks a family to one flow
- **WHEN** a family has two flows, one of them is hidden, and a production build shows the home page
- **THEN** the remaining flow is shown as a plain row, not inside a group

#### Scenario: Showcases in production
- **WHEN** a production build shows the home page
- **THEN** the "Showcases" section lists every registered showcase that is not hidden, with its title, description and the start actions of its cases that are not hidden

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
- **THEN** its row and catalogue show the display code `SC-PET-005` and no variants, and the catalogue lists the base flow's screens with their Figma frame names and links that open each screen

#### Scenario: Catalogue deep link
- **WHEN** someone in a development build activates the catalogue link for screen `medical` of variant `a`
- **THEN** `/flows/exp-pet-002/medical?variant=a` opens in a new run

#### Scenario: Production hides the catalogue
- **WHEN** a production build shows the home page
- **THEN** no display code, family code, variant, screen list or Figma reference is shown

#### Scenario: Choose a case
- **WHEN** a participant views the home page and showcase `sc-pet-001` has cases
- **THEN** its row offers "SC-PET-001-A", "SC-PET-001-B" and "SC-PET-001-C" with their names, and choosing B opens `/flows/sc-pet-001/home?case=b`

#### Scenario: Hidden items labelled in development
- **WHEN** a development build shows the home page and case `c` of `sc-pet-001` is hidden
- **THEN** "SC-PET-001-C" is offered with the label "Hidden in production", and cases A and B have no label

#### Scenario: Hidden group labelled in development
- **WHEN** a development build shows the home page and every flow of a group is hidden
- **THEN** the group's header is marked "Hidden in production"
