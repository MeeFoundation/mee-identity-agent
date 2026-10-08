# app-ux-flows/flow-runtime Specification

## Purpose

Defines the Flow domain model, registry, and runtime that let a participant discover, start, navigate, and complete a self-contained interactive UX flow in `app-ux-flows`, with flow-scoped data that stays consistent across the flow's screens.

## Requirements

### Requirement: Flow definition
A Flow SHALL be a self-contained interactive UX scenario consisting of one or more screens, defined in TypeScript. A Flow SHALL declare a unique, URL-safe flow id, a human-readable title, a set of screens keyed by screen ids that are unique within that flow, which of those screens is the initial screen, the set of reusable building-block components its screens use, and how to build a fresh run state from optional initial state. Each screen SHALL be an ordinary React component that can contain arbitrary markup and presentation logic. Screens SHALL NOT be described as declarative data (lists of component keys and props).

#### Scenario: Flow declares its screens
- **WHEN** a flow definition is authored
- **THEN** it maps each of its screen ids to a React component and names one of those ids as the initial screen

#### Scenario: Flow declares its initial data
- **WHEN** a new run of the flow starts
- **THEN** the flow builds that run's state from its initial data, independent of any other run of the same or a different flow

#### Scenario: Screen is ordinary React
- **WHEN** a developer implements a flow screen
- **THEN** they write a normal React component that can render any markup, without registering its contents in a component-key/props schema

#### Scenario: Screen is independent of routing
- **WHEN** a flow screen renders, reads state, or navigates
- **THEN** it does so only through the flow runtime, and contains no URL paths, route params or router calls

### Requirement: Flow Registry
The application SHALL maintain a registry of all available flows, mapping each flow id to its flow definition. The registry SHALL be the single source of truth for which flows exist, used both to list flows on the home page and to resolve a flow by id from a URL.

#### Scenario: Registry lists all flows
- **WHEN** the home page requests the list of available flows
- **THEN** it receives every flow registered in the Flow Registry, including each flow's id and title

#### Scenario: Registry resolves an unknown flow id
- **WHEN** a URL under `/flows/` references a flow id that is not in the Flow Registry
- **THEN** the application shows a not-found state instead of starting a flow

### Requirement: Home page lists available flows
The application's home page SHALL list every flow in the Flow Registry and SHALL let a participant start any listed flow.

#### Scenario: Participant views the home page
- **WHEN** a participant opens the application's root URL
- **THEN** they see every registered flow's title and a way to start it

#### Scenario: Participant starts a flow from the home page
- **WHEN** a participant chooses a flow on the home page
- **THEN** a new run of that flow starts from the flow's initial state and the participant is taken to its initial screen at `/flows/<flowId>/<initialScreenId>`

### Requirement: Direct flow URL
Each flow SHALL be reachable at `/flows/<flowId>`, and each of its screens at `/flows/<flowId>/<screenId>`, so a participant can open a flow or a specific screen directly. The screen id in the URL SHALL be the only source of truth for which screen is shown. Opening any flow URL when no run of that flow is active in the current page session SHALL start a new run from the flow's initial state. A screen SHALL render correctly with that initial state even if the participant never visited earlier screens.

#### Scenario: Open a flow directly by URL
- **WHEN** a participant navigates directly to `/flows/<flowId>`
- **THEN** a new run of that flow starts and the URL is replaced with the flow's initial screen URL

#### Scenario: Open a specific screen directly by URL
- **WHEN** a participant navigates directly to `/flows/<flowId>/<screenId>` for a screen that exists in that flow
- **THEN** a new run starts from the flow's initial state and that screen is shown, without first showing or requiring earlier screens

#### Scenario: Reloading the page starts a fresh run
- **WHEN** a participant reloads the page on any screen of a flow
- **THEN** the same screen is shown with a fresh run built from the flow's initial state, and data entered before the reload is not retained

### Requirement: Flow-scoped runtime state
Each run of a flow SHALL have its own isolated state, built from the flow's initial state when the run starts, that persists while the participant navigates between that flow's screens. State for one run SHALL NOT be visible to or modified by another run, whether of the same or a different flow. Screens SHALL read and update this shared run state rather than keeping cross-screen data inside individual screens.

#### Scenario: Data persists across screens in the same flow
- **WHEN** a participant enters data on one screen and navigates to another screen of the same run, by flow navigation or browser back/forward
- **THEN** the data entered on the earlier screen is still available on every screen of that run

#### Scenario: Starting a flow again resets its state
- **WHEN** a participant leaves a flow, for example by returning to the home page, and then starts or opens that flow again
- **THEN** the new run begins from the flow's initial state, unaffected by the previous run

#### Scenario: Flow instances do not share state
- **WHEN** two runs exist, of the same flow or different flows
- **THEN** changes to one run's state do not appear in the other run's state

### Requirement: Screen composition
Each screen SHALL be able to read and update its run's state, use the flow's component environment, and use flow navigation, all through the flow runtime. A screen SHALL NOT need to be given data through route parameters or props from the runtime.

#### Scenario: Screen reads flow data
- **WHEN** a screen renders
- **THEN** it can read the current state of the run it belongs to

#### Scenario: Screen writes flow data
- **WHEN** a participant interacts with a screen in a way that updates data
- **THEN** the run's state reflects that update on every screen rendered afterwards in the same run

### Requirement: Initial flow state
Each flow SHALL define default initial (fixture) state for its runs. The code that starts a run SHALL be able to supply initial state in a flow-specific, typed shape that overrides those defaults. Callers SHALL NOT need to know how the flow stores its state internally. The flow itself SHALL turn the supplied initial state into its run state.

#### Scenario: Run starts from default fixture state
- **WHEN** a run starts without supplied initial state
- **THEN** every screen sees the flow's default fixture state (for example, a predefined pet and an empty medication list)

#### Scenario: Run starts from supplied initial state
- **WHEN** a run starts with supplied initial state for some of the flow's initial-state fields
- **THEN** screens see the supplied values for those fields and the flow's defaults for all other fields

### Requirement: Replaceable screen building blocks
Each flow SHALL provide its screens with a typed set of reusable building-block components (its component environment), so a screen can render a building block without importing a specific implementation. The environment SHALL be resolved in layers, each able to replace individual components of the layer below: shared default components, then the flow's own components and overrides, then an optional override supplied when the run starts. A replacement component SHALL accept the same props as the one it replaces.

#### Scenario: Screen uses an environment component
- **WHEN** a screen renders a building block it obtains from the component environment
- **THEN** the implementation resolved for the current run is rendered

#### Scenario: Override replaces a building block without changing screens
- **WHEN** a run is started with an override that replaces one building block with a different implementation of the same props
- **THEN** every screen that uses that building block renders the replacement, while no screen code changes and all other building blocks keep their previous implementations

### Requirement: Typed screen identifiers
The screen ids a screen can navigate to SHALL be checked at compile time against the screen ids declared by the screen's flow. A flow definition SHALL fail type checking if its initial screen is not one of its declared screens, or if its screen ids do not match the flow's declared screen-id set.

#### Scenario: Navigating to a declared screen compiles
- **WHEN** a screen requests a transition to a screen id declared by its flow
- **THEN** the app passes type checking

#### Scenario: Navigating to an undeclared screen fails type checking
- **WHEN** a screen requests a transition to a screen id that its flow does not declare
- **THEN** `pnpm check-types` reports an error

### Requirement: Browser history navigation
Browser back and forward SHALL move between the flow screens the participant has visited in the current run, keeping the run's state. Screens SHALL also be able to request a browser-style back navigation, which behaves like the browser's back button. When there is no earlier in-app history entry to return to, a back request SHALL take the participant to the flow's initial screen, or do nothing if they are already on it.

#### Scenario: Browser back returns to the previous screen with state intact
- **WHEN** a participant moves from screen A to screen B and presses the browser back button
- **THEN** screen A is shown, the URL is screen A's URL, and data entered on either screen is retained

#### Scenario: Browser forward re-enters the next screen
- **WHEN** after going back, the participant presses the browser forward button
- **THEN** screen B is shown again with the run's current state

#### Scenario: Screen-requested back with no prior history
- **WHEN** a participant opened a non-initial screen directly by URL and a screen requests back navigation
- **THEN** the participant is taken to the flow's initial screen

### Requirement: Flow restart
A screen, or the completion view, SHALL be able to restart the current run. Restarting SHALL discard the run's state and any completed status, start a new run from the same initial state the current run started with (including any supplied overrides), and take the participant to the flow's initial screen.

#### Scenario: Restart mid-flow
- **WHEN** a participant has entered data and a restart is requested from a screen
- **THEN** the initial screen is shown and all screens see the run's initial state, not the previously entered data

#### Scenario: Restart after completion
- **WHEN** a participant restarts from the completion view
- **THEN** the run is no longer completed, the initial screen is shown, and state is back to the run's initial state

### Requirement: Invalid screen URL
A URL that names a registered flow but a screen id that flow does not declare SHALL NOT show an error page. It SHALL redirect, replacing the invalid history entry, to that flow's initial screen.

#### Scenario: Unknown screen id redirects to the initial screen
- **WHEN** a participant opens `/flows/<flowId>/<unknownScreenId>` for a registered flow
- **THEN** the URL is replaced with `/flows/<flowId>/<initialScreenId>` and the initial screen is shown

### Requirement: Explicit screen navigation
A screen SHALL be able to move the participant to any screen of its own flow by screen id. Every such transition SHALL update the URL to that screen's URL and add a browser history entry.

#### Scenario: Go to a screen by id
- **WHEN** a screen requests a transition to another screen id of the same flow
- **THEN** the participant sees that screen, the URL becomes `/flows/<flowId>/<screenId>`, and the run's state is unchanged by the transition itself

#### Scenario: Screen navigation does not depend on screen order
- **WHEN** a screen requests a transition to any declared screen of its flow, including an earlier one
- **THEN** that transition is performed, because flows define transitions explicitly rather than by screen order

### Requirement: Explicit flow completion
A screen SHALL be able to explicitly mark its run as complete. A completed run SHALL show the participant a completion view with options to restart the flow or return to the list of flows. Completion SHALL be observable by the application outside the flow's screens, so that a later change can record it.

#### Scenario: Completing a run
- **WHEN** a screen marks the run as complete
- **THEN** the participant is shown the completion view and the application is notified once that this run completed

#### Scenario: Completed run is not re-entered as in-progress
- **WHEN** a participant uses browser back/forward, or opens another screen URL of the same flow, while the run is completed
- **THEN** the completion view keeps being shown instead of an in-progress screen, until the run is restarted or a new run starts
