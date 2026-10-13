## MODIFIED Requirements

### Requirement: Flow definition
A Flow SHALL be a self-contained interactive UX scenario consisting of one or more screens, defined in TypeScript. A Flow SHALL declare:
- a unique, URL-safe flow id,
- a human-readable title,
- a set of screens keyed by screen ids that are unique within that flow,
- which of those screens is the initial screen,
- the set of reusable building-block components its screens use,
- how to build a fresh run state from optional initial state.

A Flow MAY additionally declare variants and a variant selection mode, as defined by the `app-ux-flows/flow-variants` capability. A screen id MAY be declared as unavailable in the base flow so that only variants implement it. Each screen SHALL be an ordinary React component that can contain arbitrary markup and presentation logic. Screens SHALL NOT be described as declarative data (lists of component keys and props). Before a run starts, the flow SHALL be resolved for the run's active variant into one effective set of screens, components and initial state, and the run SHALL use only that resolved flow.

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

### Requirement: Home page lists available flows
The application's home page SHALL list every flow in the Flow Registry and SHALL let a participant start any listed flow. For a flow with explicit variant selection, the home page SHALL let the participant choose which variant to start. For a flow without variants or with automatic assignment, it SHALL offer a single start action and SHALL NOT show variant information to the participant. Development builds MAY additionally show the stored automatic assignments. The home page SHALL offer a "Start new test session" action that clears stored automatic variant assignments.

#### Scenario: Participant views the home page
- **WHEN** a participant opens the application's root URL
- **THEN** they see every registered flow's title and a way to start it

#### Scenario: Participant starts a flow from the home page
- **WHEN** a participant chooses a flow on the home page
- **THEN** a new run of that flow starts from the flow's initial state for its resolved variant, and the participant is taken to its initial screen at `/flows/<flowId>/<initialScreenId>`, with `?variant=<variantId>` only when they chose a variant explicitly

### Requirement: Initial flow state
Each flow SHALL define default initial (fixture) state for its runs. The code that starts a run SHALL be able to supply initial state in a flow-specific, typed shape that overrides those defaults. A flow variant SHALL be able to supply initial state in the same shape. Callers and variants SHALL NOT need to know how the flow stores its state internally. The flow itself SHALL turn the resolved initial state into its run state. The resolved initial state uses, for each field, the value from the highest-precedence source: run-start values, then variant values, then flow defaults.

#### Scenario: Run starts from default fixture state
- **WHEN** a run starts without supplied initial state, in a variant that supplies none
- **THEN** every screen sees the flow's default fixture state (for example, a predefined pet and an empty medication list)

#### Scenario: Run starts from supplied initial state
- **WHEN** a run starts with supplied initial state for some of the flow's initial-state fields
- **THEN** screens see the supplied values for those fields and the variant's or flow's values for all other fields

### Requirement: Replaceable screen building blocks
Each flow SHALL provide its screens with a typed set of reusable building-block components (its component environment), so a screen can render a building block without importing a specific implementation. The environment SHALL be resolved in layers, each able to replace individual components of the layer below:
1. shared default components,
2. the flow's own components and overrides,
3. the active variant's component overrides,
4. an optional override supplied when the run starts.

A replacement component SHALL accept the same props as the one it replaces.

#### Scenario: Screen uses an environment component
- **WHEN** a screen renders a building block it obtains from the component environment
- **THEN** the implementation resolved for the current run and variant is rendered

#### Scenario: Override replaces a building block without changing screens
- **WHEN** a run is started with an override, from its variant or from the run-start code, that replaces one building block with a different implementation of the same props
- **THEN** every screen that uses that building block renders the replacement, while no screen code changes and all other building blocks keep their previous implementations

### Requirement: Flow restart
A screen, or the completion view, SHALL be able to restart the current run. Restarting SHALL discard the run's state and any completed status. It SHALL start a new run in the same variant, from the same initial state the current run started with (including variant and run-start overrides), and take the participant to the flow's initial screen. The URL's `variant` parameter SHALL be kept if it was present.

#### Scenario: Restart mid-flow
- **WHEN** a participant has entered data and a restart is requested from a screen
- **THEN** the initial screen is shown in the same variant and all screens see the run's initial state, not the previously entered data

#### Scenario: Restart after completion
- **WHEN** a participant restarts from the completion view
- **THEN** the run is no longer completed, the initial screen is shown in the same variant, and state is back to the run's initial state

### Requirement: Invalid screen URL
A URL that names a registered flow but a screen id that is not available in the run's resolved variant SHALL NOT show an error page. It SHALL redirect, replacing the invalid history entry, to that flow's initial screen, and keep a valid `variant` parameter.

#### Scenario: Unknown screen id redirects to the initial screen
- **WHEN** a participant opens `/flows/<flowId>/<unknownScreenId>` for a registered flow
- **THEN** the URL is replaced with `/flows/<flowId>/<initialScreenId>` and the initial screen is shown

#### Scenario: Unknown screen id keeps the variant
- **WHEN** a participant opens `/flows/<flowId>/<unknownScreenId>?variant=<validVariantId>`
- **THEN** the URL is replaced with `/flows/<flowId>/<initialScreenId>?variant=<validVariantId>`

### Requirement: Explicit screen navigation
A screen SHALL be able to move the participant to any screen of its own flow by screen id. Every such transition SHALL update the URL to that screen's URL, keep the run's `variant` parameter if present, and add a browser history entry.

#### Scenario: Go to a screen by id
- **WHEN** a screen requests a transition to another screen id of the same flow
- **THEN** the participant sees that screen, the URL becomes `/flows/<flowId>/<screenId>` with the same `variant` parameter as before, and the run's state is unchanged by the transition itself

#### Scenario: Screen navigation does not depend on screen order
- **WHEN** a screen requests a transition to any declared screen of its flow, including an earlier one
- **THEN** that transition is performed, because flows define transitions explicitly rather than by screen order
