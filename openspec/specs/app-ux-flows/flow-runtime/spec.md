# app-ux-flows/flow-runtime Specification

## Purpose

Defines the Flow domain model, registry, and runtime that let a participant discover, start, navigate, and complete a self-contained interactive UX flow in `app-ux-flows`, with flow-scoped data that stays consistent across the flow's screens.

## Requirements

### Requirement: Flow definition
A Flow SHALL be a self-contained interactive UX scenario consisting of one or more ordered screens, defined in TypeScript and composed from reusable React components. A Flow SHALL declare a unique, URL-safe flow id, a human-readable title, its ordered list of screens, and a factory that produces the flow's initial data.

#### Scenario: Flow declares its screens
- **WHEN** a flow definition is authored
- **THEN** it lists one or more screens in the order a participant navigates them, each screen identified by a unique id within that flow

#### Scenario: Flow declares its initial data
- **WHEN** a new flow instance is started
- **THEN** the flow's initial-data factory runs and produces the starting data for that instance, independent of any other instance of the same or a different flow

### Requirement: Flow Registry
The application SHALL maintain a registry of all available flows, mapping each flow id to its flow definition. The registry SHALL be the single source of truth for which flows exist, used both to list flows on the home page and to resolve a flow by id from a URL.

#### Scenario: Registry lists all flows
- **WHEN** the home page requests the list of available flows
- **THEN** it receives every flow registered in the Flow Registry, including each flow's id and title

#### Scenario: Registry resolves an unknown flow id
- **WHEN** a URL references a flow id that is not in the Flow Registry
- **THEN** the application shows a not-found state instead of starting a flow

### Requirement: Home page lists available flows
The application's home page SHALL list every flow in the Flow Registry and SHALL let a participant start any listed flow.

#### Scenario: Participant views the home page
- **WHEN** a participant opens the application's root URL
- **THEN** they see every registered flow's title and a way to start it

#### Scenario: Participant starts a flow from the home page
- **WHEN** a participant chooses a flow on the home page
- **THEN** a new instance of that flow starts and the participant is taken to its first screen

### Requirement: Direct flow URL
Each flow, and each screen within a started flow instance, SHALL be reachable by its own URL, so a participant can access a flow directly without going through the home page.

#### Scenario: Open a flow directly by URL
- **WHEN** a participant navigates directly to a flow's URL without having visited the home page
- **THEN** a new instance of that flow starts and the participant is taken to its first screen

#### Scenario: Open a specific screen directly by URL
- **WHEN** a participant navigates directly to the URL of a specific screen within a flow
- **THEN** the application starts or resumes that flow instance and shows that screen, provided the flow's data up to that screen can be produced from the flow's initial data

### Requirement: Flow-scoped runtime state
Each started flow instance SHALL have its own runtime state, seeded from the flow's initial data, that persists as the participant navigates between that flow's screens. Runtime state for one flow instance SHALL NOT be visible to or modified by another flow instance.

#### Scenario: Data persists across screens in the same flow
- **WHEN** a participant enters data on one screen of a flow instance and navigates to the next screen of the same instance
- **THEN** the data entered on the earlier screen remains available for the rest of that flow instance

#### Scenario: Starting a flow again resets its state
- **WHEN** a participant starts a new instance of a flow they have already completed or abandoned
- **THEN** the new instance begins from the flow's initial data, unaffected by the previous instance's runtime state

#### Scenario: Flow instances do not share state
- **WHEN** two flow instances are active at the same time, whether of the same flow or different flows
- **THEN** changes to one instance's runtime state SHALL NOT appear in the other instance's runtime state

### Requirement: Screen composition
Each screen in a flow SHALL be composed from reusable React components and SHALL have read and write access to its flow instance's runtime state in order to display data and record participant input.

#### Scenario: Screen reads flow data
- **WHEN** a screen renders
- **THEN** it can read the current runtime state of the flow instance it belongs to

#### Scenario: Screen writes flow data
- **WHEN** a participant interacts with a screen in a way the flow defines as updating data
- **THEN** the flow instance's runtime state reflects that update for subsequently rendered screens in the same instance

### Requirement: Flow navigation
A participant SHALL be able to move forward through a flow instance's screens in the order the flow defines.

#### Scenario: Advance to the next screen
- **WHEN** a participant completes the current screen's required interaction
- **THEN** they are taken to the next screen in that flow instance, and the URL reflects the new screen

### Requirement: Flow completion
Completing a flow's last screen SHALL mark that flow instance as complete and SHALL show the participant a completion screen.

#### Scenario: Completing the final screen
- **WHEN** a participant completes the required interaction on a flow's last screen
- **THEN** the flow instance is marked complete and the participant is shown a completion screen

#### Scenario: Completed instance is not re-entered as in-progress
- **WHEN** a participant returns to a URL belonging to an already-completed flow instance
- **THEN** the application shows the completion screen rather than resuming an earlier, in-progress screen
