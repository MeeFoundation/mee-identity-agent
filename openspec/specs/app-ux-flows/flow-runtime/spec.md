# app-ux-flows/flow-runtime Specification

## Purpose

Defines the Flow domain model, registry, and runtime that let a participant discover, start, navigate, and complete a self-contained interactive UX flow in `app-ux-flows`, with flow-scoped data that stays consistent across the flow's screens.

## Requirements

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

### Requirement: Flow Registry
The application SHALL maintain a registry of all available flows, mapping each flow id to its flow definition. The registry SHALL be the single source of truth for which flows exist, used both to list flows on the home page and to resolve a flow by id from a URL. In production builds the registry SHALL leave out hidden flows, variants and cases, as defined in "Hidden flows and cases".

#### Scenario: Registry lists all flows
- **WHEN** the home page requests the list of available flows
- **THEN** it receives every flow registered in the Flow Registry, including each flow's id and title, except hidden flows in production builds

#### Scenario: Registry resolves an unknown flow id
- **WHEN** a URL under `/flows/` references a flow id that is not in the Flow Registry
- **THEN** the application shows a not-found state instead of starting a flow

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

### Requirement: Explicit flow completion
A screen SHALL be able to explicitly mark its run as complete. By default, a completed run SHALL show the participant a completion view with options to restart the flow or return to the list of flows. A screen MAY instead complete the run silently: the run is marked complete, but the current and later screens keep rendering normally and no completion view is shown. This is for flows whose end state is a real screen. A run SHALL be completed at most once. Later completion requests in the same run SHALL be ignored, whichever mode they use. Completion SHALL be observable by the application outside the flow's screens, so that it can be recorded.

#### Scenario: Completing a run
- **WHEN** a screen marks the run as complete
- **THEN** the participant is shown the completion view and the application is notified once that this run completed

#### Scenario: Completing a run silently
- **WHEN** a screen marks the run as complete without the completion view
- **THEN** the participant keeps seeing that screen and can keep navigating the flow, and the application is notified once that this run completed

#### Scenario: Repeated completion is ignored
- **WHEN** a run was already completed, silently or not, and a screen requests completion again
- **THEN** the application is not notified again and the visible screen does not change

#### Scenario: Completed run is not re-entered as in-progress
- **WHEN** a participant uses browser back/forward, or opens another screen URL of the same flow, while the run is completed with the completion view
- **THEN** the completion view keeps being shown instead of an in-progress screen, until the run is restarted or a new run starts

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

### Requirement: Hidden flows and cases
A flow MAY be declared hidden, and so MAY each case of a showcase. Variants of an experiment MAY be hidden as defined by `app-ux-flows/flow-variants`. A flow or case that does not declare it SHALL be visible. Hiding SHALL be decided at build time and SHALL NOT depend on runtime configuration.

Development builds (the local dev server) SHALL treat hidden flows, variants and cases exactly like visible ones, except for the "Hidden in production" label on the home page.

Production builds SHALL treat anything hidden as if it were not declared:
- a hidden flow SHALL NOT be listed, and any of its URLs, `/flows/<flowId>` or `/flows/<flowId>/<screenId>`, SHALL show the not-found state;
- a hidden case SHALL NOT be offered on the home page or as a "Try case" action in the briefing. A `case` parameter naming it SHALL be handled as an unknown case;
- when the first declared case is hidden, the first visible case SHALL be used when no case is requested;
- a flow whose variants are all hidden, or whose cases are all hidden, SHALL be hidden as a whole.

Hiding SHALL NOT change a visible flow's, variant's or case's identifiers, codes, screens or behavior.

#### Scenario: Hidden flow on the dev server
- **WHEN** showcase `sc-pet-004` is hidden and someone opens the home page and `/flows/sc-pet-004/info` on the dev server
- **THEN** `sc-pet-004` is listed with the label "Hidden in production", and the flow runs as usual

#### Scenario: Hidden flow is not listed in production
- **WHEN** showcase `sc-pet-004` is hidden and a production build shows the home page
- **THEN** `sc-pet-004` is not listed, and the "Showcases" heading counts one flow fewer

#### Scenario: Hidden flow URL in production
- **WHEN** showcase `sc-pet-004` is hidden and someone opens `/flows/sc-pet-004/info` in a production build
- **THEN** the not-found state is shown instead of starting a flow

#### Scenario: Hidden case in production
- **WHEN** case `d` of `sc-pet-003` is hidden and a production build shows the home page
- **THEN** the row of `sc-pet-003` offers cases A, B and C only

#### Scenario: Hidden case URL in production
- **WHEN** case `d` of `sc-pet-003` is hidden and someone opens `/flows/sc-pet-003/info?case=d` in a production build
- **THEN** the URL is replaced with `/flows/sc-pet-003/info`, and the run uses case A

#### Scenario: Hidden first case in production
- **WHEN** case `a` of `sc-pet-003` is hidden and someone opens `/flows/sc-pet-003/info` without a `case` parameter in a production build
- **THEN** the run uses case B

#### Scenario: Hidden case left out of the briefing
- **WHEN** case `d` of `sc-pet-003` is hidden and a tester completes case A in a production build
- **THEN** the briefing offers "Try case SC-PET-003-B" and "Try case SC-PET-003-C", and no action for case D

#### Scenario: All cases hidden
- **WHEN** every case of a showcase is hidden and a production build shows the home page
- **THEN** the showcase is not listed, and its URLs show the not-found state

### Requirement: Dev mode
The application SHALL have a dev mode, decided once when the page loads:
- A development build (the local dev server) SHALL always be in dev mode.
- A production build SHALL be in dev mode when the page is opened with the URL parameter `mode=dev`. It SHALL then stay in dev mode for that browser tab, across in-app navigation and page reloads, until the tab is closed or the page is opened with `mode=off`.
- Opening a production build with `mode=off` SHALL end dev mode for that tab.
- Any other `mode` value SHALL be ignored. On a development build, `mode=off` SHALL have no effect.
- When the browser keeps no per-tab storage, dev mode SHALL last only for the page opened with `mode=dev`.

A production build in dev mode SHALL behave as a development build for every `app-ux-flows` requirement that tells development and production builds apart. That includes:
- the home page catalogue, display codes, Figma references, stored assignments and variant information;
- the variant label while a flow runs;
- hidden flows, variants and cases, which SHALL be listed, labelled "Hidden in production" and runnable.

The exception is analytics, as defined by `app-ux-flows/flow-analytics`. A production build not in dev mode SHALL behave as a production build.

When dev mode was turned on through the URL, the home page SHALL show a note, "Dev mode", with a "Turn off" action. The action SHALL reload the app at the home page with `mode=off`. A development build SHALL NOT show the note.

Dev mode SHALL NOT be access control. It changes what is shown, not what the bundle contains.

#### Scenario: Turning dev mode on in production
- **WHEN** someone opens a production build at `/?mode=dev`
- **THEN** the home page shows the catalogue, display codes, hidden flows with the label "Hidden in production", and the "Dev mode" note with "Turn off"

#### Scenario: Dev mode lasts for the tab
- **WHEN** someone opened a production build with `?mode=dev`, then starts a flow from the home page and reloads the page
- **THEN** the flow screen still shows the variant label, and the home page still shows the catalogue

#### Scenario: Hidden flow in dev mode
- **WHEN** showcase `sc-pet-004` is hidden and someone opens `/flows/sc-pet-004/info?mode=dev` in a production build
- **THEN** the flow runs instead of showing the not-found state

#### Scenario: Turning dev mode off
- **WHEN** someone in dev mode on a production build activates "Turn off" on the home page
- **THEN** the app reloads at `/?mode=off`, and hidden flows, the catalogue and the note are no longer shown in that tab

#### Scenario: Another tab is not in dev mode
- **WHEN** someone opened a production build with `?mode=dev` in one tab and opens the app's root URL in a new tab
- **THEN** the new tab is not in dev mode

#### Scenario: Unknown mode value
- **WHEN** someone opens a production build with `?mode=preview`
- **THEN** the app behaves as a production build

#### Scenario: Development build ignores mode=off
- **WHEN** a developer opens the local dev server with `?mode=off`
- **THEN** the app stays in dev mode, and the "Dev mode" note is not shown
