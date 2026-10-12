## ADDED Requirements

### Requirement: Showcase cases
A showcase MAY declare cases. Each case SHALL have:
- a stable, URL-safe identifier unique within its showcase, never derived from its display text;
- a display code, for example `SC-PET-001-B`, shown verbatim;
- a name, shown through i18next.

A case MAY declare a goal and per-screen hints (see `app-ux-flows/flow-briefing`), and initial-state values that override the showcase's defaults. Every case SHALL share the showcase's screens, components and initial screen. A case SHALL differ only in what the tester is told and in its starting data.

A case is always chosen by the participant; it is never assigned and never stored. The active case SHALL be:
- the case named by the `case` query parameter, when it names one of the showcase's cases;
- otherwise the showcase's first case in declaration order.

When the parameter names no case of the showcase, or the flow has no cases, it SHALL be removed from the URL with a replace navigation, and the case SHALL be chosen as if it had not been present. A run SHALL keep its case through navigation and restart, and the `case` parameter SHALL be kept on every screen URL of the run. Screens SHALL NOT read the parameter.

Showcases stay untracked whatever their case.

#### Scenario: Open a case by URL
- **WHEN** someone opens `/flows/sc-pet-001/telli?case=c`
- **THEN** `telli` is shown in case C, with case C's starting data

#### Scenario: Showcase opened without a case
- **WHEN** someone opens `/flows/sc-pet-001/home` without a `case` parameter
- **THEN** the run uses the first case, `a`

#### Scenario: Unknown case in the URL
- **WHEN** someone opens a showcase URL with `?case=<unknownId>`
- **THEN** the URL is replaced with the same path without the parameter, and the run uses the first case

## MODIFIED Requirements

### Requirement: Flow definition
A Flow SHALL be a self-contained interactive UX scenario consisting of one or more screens, defined in TypeScript. A Flow SHALL declare:
- a unique, URL-safe flow id,
- its kind: `experiment`, a flow that is studied with participants and may compare variants, or `showcase`, a flow that demonstrates one intended UX and is not studied,
- a human-readable title,
- a set of screens keyed by screen ids that are unique within that flow,
- which of those screens is the initial screen,
- the set of reusable building-block components its screens use,
- how to build a fresh run state from optional initial state.

A Flow MAY additionally declare:
- a human-readable description,
- a design reference for any of its screens: the name of the Figma frame the screen implements and that frame's URL,
- a display code that identifies it, for example `EXP-PET-002` for an experiment or `SC-PET-001` for a research scenario shown as a showcase,
- a goal and per-screen hints, as defined by the `app-ux-flows/flow-briefing` capability.

An experiment MAY additionally declare variants and a variant selection mode, as defined by the `app-ux-flows/flow-variants` capability.

A showcase SHALL NOT declare variants, a variant selection mode or a default variant. Declaring any of them on a showcase SHALL fail type checking. A showcase MAY instead declare cases, as defined in "Showcase cases". Cases are not variants: a variant is an alternative design compared in a study, a case is a task the tester is told to carry out. An experiment SHALL NOT declare cases; declaring them SHALL fail type checking.

The title and description SHALL be shown through i18next. Display codes and Figma frame names are design identifiers. They SHALL be shown verbatim and are not translated. A flow SHALL NOT declare a design link for the flow as a whole.

A screen id MAY be declared as unavailable in the base flow so that only variants implement it. Each screen SHALL be an ordinary React component that can contain arbitrary markup and presentation logic. Screens SHALL NOT be described as declarative data (lists of component keys and props). Before a run starts, the flow SHALL be resolved for the run's active variant into one effective set of screens, components, initial state and screen design references, and the run SHALL use only that resolved flow. The resolved flow SHALL expose the flow's kind to the application.

#### Scenario: Flow declares its screens
- **WHEN** a flow definition is authored
- **THEN** it maps each of its screen ids to a React component, or marks it as unavailable in the base flow, and names one of its base screens as the initial screen

#### Scenario: Flow declares its initial data
- **WHEN** a new run of the flow starts
- **THEN** the flow builds that run's state from its initial data, independent of any other run of the same or a different flow

#### Scenario: Screen is ordinary React
- **WHEN** a developer implements a flow screen
- **THEN** they write a normal React component that can render any markup, without registering its contents in a component-key/props schema

#### Scenario: Screen is independent of routing
- **WHEN** a flow screen renders, reads state, or navigates
- **THEN** it does so only through the flow runtime, and contains no URL paths, route params, query parameters or router calls

#### Scenario: Run uses one resolved flow
- **WHEN** a run of a flow with variants starts
- **THEN** all of its screens, components and initial state come from the flow resolved for that run's variant

#### Scenario: Screen design reference
- **WHEN** a flow declares a design reference for one of its screens
- **THEN** the resolved flow exposes that screen's Figma frame name and URL to the application, and screens do not need to know about it

#### Scenario: Flow declares its kind
- **WHEN** a flow definition is authored without a kind
- **THEN** `pnpm check-types` reports an error

#### Scenario: Showcase cannot have variants
- **WHEN** a showcase definition declares variants, a variant selection mode or a default variant
- **THEN** `pnpm check-types` reports an error

#### Scenario: Showcase with a display code
- **WHEN** a showcase definition declares the display code `SC-PET-001`
- **THEN** `pnpm check-types` passes, and the development flow catalogue shows `SC-PET-001` verbatim for that showcase

#### Scenario: Showcase with cases
- **WHEN** a showcase definition declares cases, each with a code, a name and a goal
- **THEN** `pnpm check-types` passes

#### Scenario: Experiment cannot have cases
- **WHEN** an experiment definition declares cases
- **THEN** `pnpm check-types` reports an error

### Requirement: Home page lists available flows
The application's home page SHALL list every flow in the Flow Registry and SHALL let a participant start any listed flow. Flows SHALL be grouped by kind into an "Experiments" section followed by a "Showcases" section, each with a translated heading. A section with no flows SHALL NOT be shown. Within a section, flows keep their registry order. Each flow SHALL show its title and, when it declares one, its description. For a flow with explicit variant selection, the home page SHALL let the participant choose which variant to start, introduced as "Choose version:". For a showcase with cases, it SHALL let the participant choose which case to start, introduced as "Choose a case:", with one start action per case showing the case's code and name. For any other flow, it SHALL offer a single start action. Showcases SHALL be listed in both development and production builds. In production builds the home page SHALL NOT show variant information to the participant. The home page SHALL offer a "Start new test session" action that clears stored automatic variant assignments.

Development builds SHALL additionally show, for each flow, a catalogue:
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
- **THEN** `exp-pet-002` is listed under "Experiments" and `chat-add-medication` under "Showcases", with Experiments shown first

#### Scenario: Empty section is hidden
- **WHEN** the registry holds no showcase
- **THEN** no "Showcases" heading is shown

#### Scenario: Showcases in production
- **WHEN** a production build shows the home page
- **THEN** the "Showcases" section lists every registered showcase with its title, description and a single start action

#### Scenario: Participant starts a flow from the home page
- **WHEN** a participant chooses a flow on the home page
- **THEN** a new run of that flow starts from the flow's initial state for its resolved variant or case, and the participant is taken to its initial screen at `/flows/<flowId>/<initialScreenId>`, with `?variant=<variantId>` only when they chose a variant explicitly, and `?case=<caseId>` when they chose a case

#### Scenario: Development catalogue
- **WHEN** a development build shows the home page for flow `exp-pet-002`
- **THEN** it shows `EXP-PET-002`, both variants with their codes `EXP-PET-002-A` and `EXP-PET-002-B`, and under each variant its screens with Figma frame names linking to Figma

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
- **THEN** its card says "Choose a case:" and offers "SC-PET-001-A", "SC-PET-001-B" and "SC-PET-001-C" with their names, and choosing B opens `/flows/sc-pet-001/home?case=b`
