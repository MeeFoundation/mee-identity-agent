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
- a display code that identifies it, for example `EXP-PET-002` for an experiment or `SC-PET-001` for a research scenario shown as a showcase.

An experiment MAY additionally declare variants and a variant selection mode, as defined by the `app-ux-flows/flow-variants` capability.

A showcase SHALL NOT declare variants, a variant selection mode or a default variant. Declaring any of them on a showcase SHALL fail type checking.

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
