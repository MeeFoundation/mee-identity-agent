## Purpose

Lets one flow in `app-ux-flows` carry several UX variants for A/B testing. A variant describes only what it changes compared with the base flow. It is chosen explicitly or assigned automatically and stickily. It stays active while the participant uses the flow, and it is known to the runtime so it can be reported later.

## ADDED Requirements

### Requirement: Flow variants
A flow MAY declare a set of variants. Each variant SHALL have a stable identifier that is unique within its flow, is URL-safe (lowercase letters, digits and hyphens), and is never derived from its display text. Each variant SHALL have a human-readable name, and MAY have a description, both shown through i18next. A variant SHALL describe only how it differs from the base flow. That can be any combination of replacement building-block components, replacement screens, and initial-state values. Anything a variant does not override SHALL be taken from the base flow. A flow without variants SHALL behave exactly as before.

#### Scenario: Flow without variants
- **WHEN** a flow declares no variants
- **THEN** it is listed, started, navigated and completed exactly as a flow without variant support, and its active variant is reported as none

#### Scenario: Variant inherits everything it does not override
- **WHEN** a variant overrides only one building-block component
- **THEN** a run of that variant uses the base flow's screens, initial state, store, navigation and every other component unchanged

#### Scenario: Every declared variant is consistent
- **WHEN** the application's automated checks run
- **THEN** they verify that every registered flow's variants have valid identifiers, that a declared default variant exists, and that each variant resolves to a flow whose initial screen exists

### Requirement: Variant component overrides
A variant SHALL be able to replace individual building-block components of its flow's component environment. A replacement SHALL be type-checked against the public props of the component it replaces, so a component that requires props the base component does not receive fails type checking. Screens SHALL obtain the replacement through the component environment without knowing which variant is active.

#### Scenario: Replacement is rendered by unchanged screens
- **WHEN** a run of a variant that replaces the `QuickAction` component renders the home screen
- **THEN** the variant's `QuickAction` implementation is rendered, the home screen code is the same as in the base flow, and all other components are the base flow's

#### Scenario: Incompatible replacement fails type checking
- **WHEN** a variant replaces a component with one whose required props are not provided by the base component's props
- **THEN** `pnpm check-types` reports an error

### Requirement: Variant screen overrides
A variant SHALL be able to replace any of its flow's screens by screen id. Screens the variant does not replace SHALL be the base flow's screens. A variant SHALL NOT be able to override a screen id its flow does not declare (checked at compile time).

#### Scenario: Screen override
- **WHEN** a variant replaces the `home` screen and a participant in that variant opens `home`
- **THEN** the variant's home screen is shown, and the other screens of the flow are the base flow's screens

#### Scenario: Override of an undeclared screen fails type checking
- **WHEN** a variant's screen overrides contain a screen id its flow does not declare
- **THEN** `pnpm check-types` reports an error

### Requirement: Variant-specific screens
A flow SHALL be able to declare a screen id that is unavailable in the base flow and implemented only by some variants. Such a screen SHALL exist only in the variants that implement it. Opening it in a variant that does not implement it SHALL behave like opening an undeclared screen of the flow. Navigation between screens SHALL remain type-checked against the flow's single set of declared screen ids.

#### Scenario: Variant-only screen in the implementing variant
- **WHEN** a participant in a variant that implements screen `explanation` navigates to `explanation`
- **THEN** that screen is shown with the run's state

#### Scenario: Variant-only screen in another variant
- **WHEN** a participant in a variant that does not implement `explanation` opens that screen's URL
- **THEN** the URL is replaced with the flow's initial screen URL for the same variant and the initial screen is shown

### Requirement: Variant initial state
A variant SHALL be able to supply initial-state values using the flow's existing typed initial-state shape, without access to the flow's internal state storage. A run's initial state SHALL be resolved field by field, from lowest to highest precedence: the flow's default fixtures, then the variant's initial-state values, then initial state supplied by the code that starts the run. A supplied field SHALL replace the lower-precedence value for that field as a whole. Nested objects and lists SHALL NOT be deep-merged.

#### Scenario: Variant turns on a flag
- **WHEN** a variant supplies `showMedicationHint: true` and a run of it starts
- **THEN** screens see the hint flag on, while every other field has the flow's default fixture value

#### Scenario: Variant state does not leak to other variants
- **WHEN** a run of the control variant starts after a run of a variant that supplied initial-state values
- **THEN** the control run sees only the flow's default fixture state

#### Scenario: Supplied field replaces a list as a whole
- **WHEN** a variant supplies a `medications` list and the run-start code supplies a different `medications` list
- **THEN** the run's medications are exactly the run-start list, not a combination of both

### Requirement: Variant selection mode
A flow with variants SHALL declare how participants get a variant: explicit selection (the participant chooses the variant) or automatic assignment (the application assigns one and does not show the participant which one). A flow with variants that does not declare a mode SHALL use explicit selection.

#### Scenario: Explicit flow on the home page
- **WHEN** a participant views the home page and a flow uses explicit selection
- **THEN** they can choose any of the flow's variants by name and start the flow in the chosen variant

#### Scenario: Automatic flow on the home page
- **WHEN** a participant views the home page and a flow uses automatic assignment
- **THEN** they see only a single start action for that flow, and no variant name or identifier is shown to them

### Requirement: Automatic variant assignment
For a flow that uses automatic assignment, when a participant has no assignment for that flow, the application SHALL assign one of the flow's variants at random with equal probability. The assignment logic SHALL support relative weights, so weighted assignment can be added without changing the selection rules.

#### Scenario: First visit assigns a variant
- **WHEN** a participant with no assignment opens an automatic flow
- **THEN** exactly one of the flow's variants is assigned and used for the run

#### Scenario: Equal distribution
- **WHEN** many independent assignments are made for a flow with two variants
- **THEN** each variant is chosen with probability one half

### Requirement: Sticky variant assignment
An automatic assignment SHALL be stored per flow in the participant's browser. It SHALL persist across reloads, new tabs and browser restarts until it is reset. Reopening the flow, restarting it, or starting it again from the home page SHALL use the same variant. The home page SHALL offer an action that starts a new test session by clearing all stored assignments, so the next start of an automatic flow assigns a variant again. If browser storage is unavailable, an assignment SHALL still be used consistently for the rest of the page session. A stored assignment that is no longer a variant of its flow SHALL be discarded and replaced by a new assignment.

#### Scenario: Reload keeps the variant
- **WHEN** a participant assigned variant `prominent-action` reloads any screen of the flow
- **THEN** the flow is still shown in variant `prominent-action`

#### Scenario: Starting again keeps the variant
- **WHEN** a participant assigned a variant returns to the home page and starts the same flow again
- **THEN** the new run uses the same variant

#### Scenario: New test session
- **WHEN** someone chooses "Start new test session" on the home page and then starts an automatic flow
- **THEN** a variant is assigned again at random, independent of the previous assignment

#### Scenario: Stale stored assignment
- **WHEN** the stored assignment for a flow names a variant the flow no longer declares
- **THEN** it is discarded, a new variant is assigned and stored, and the flow runs without error

#### Scenario: Assignments are per flow
- **WHEN** a participant has an assignment for one flow and opens a different automatic flow
- **THEN** the other flow gets its own assignment, independent of the first

### Requirement: Variant URL parameter
Any flow URL SHALL accept an optional `variant` query parameter, for example `/flows/add-medication/home?variant=prominent-action`. When it names a variant of the flow, that variant SHALL be used for any selection mode, ahead of any stored assignment, and SHALL NOT change the stored assignment. When it names no variant of the flow, or the flow has no variants, the parameter SHALL be removed from the URL with a replace navigation, and the variant SHALL be chosen as if the parameter had not been present. A flow SHALL never run with a partially applied or unknown variant. Screens SHALL NOT read the parameter.

#### Scenario: Shared link opens a specific variant
- **WHEN** someone opens `/flows/<flowId>/<screenId>?variant=<validVariantId>`
- **THEN** that screen is shown in that variant, even if the flow uses automatic assignment and the browser has a different stored assignment

#### Scenario: Shared link does not reassign the participant
- **WHEN** a browser with stored assignment `control` opens a link with `?variant=prominent-action` and later opens the same flow without the parameter
- **THEN** the later run uses `control`

#### Scenario: Unknown variant in the URL
- **WHEN** someone opens a flow URL with `?variant=<unknownId>`
- **THEN** the URL is replaced with the same path without the parameter, and the flow runs in the variant chosen by the remaining rules

### Requirement: Variant resolution order
The active variant of a flow run SHALL be chosen by these rules, in order:
1. If the flow has no variants, the run has no variant.
2. A valid `variant` URL parameter.
3. For automatic flows, the stored assignment for the flow if it is still valid. Otherwise a new assignment, which is then stored.
4. For explicit flows, the flow's declared default variant, or its first variant id in key order when it declares none.

The result SHALL be deterministic for the same URL and stored assignment.

#### Scenario: Explicit flow opened without a parameter
- **WHEN** a direct link to an explicit flow has no `variant` parameter
- **THEN** the flow runs in its default variant

#### Scenario: Explicit choice from the home page
- **WHEN** a participant chooses a variant for an explicit flow on the home page
- **THEN** they are taken to the flow's URL with that variant in the `variant` parameter

### Requirement: Variant preserved during a run
Once a run is in a variant, every navigation within the flow SHALL keep that variant without any screen passing it along. This covers moving to another screen, back navigation (including back with no in-app history), browser back and forward, invalid-screen redirects, and opening `/flows/<flowId>`. Restarting a run SHALL start a new run in the same variant. If the active variant changes while the flow is open, for example because the URL parameter is edited, the application SHALL start a new run in the new variant instead of mixing state or components from two variants.

#### Scenario: Navigation keeps an explicit variant
- **WHEN** a participant on `/flows/add-medication/home?variant=prominent-action` moves to `medication-form` and then to `confirmation`
- **THEN** each URL keeps `?variant=prominent-action` and each screen uses that variant's components

#### Scenario: Restart keeps the variant
- **WHEN** a participant in a variant restarts the flow from a screen or from the completion view
- **THEN** the new run starts at the initial screen in the same variant, with that variant's initial state

#### Scenario: Automatic variant stays hidden while navigating
- **WHEN** a participant navigates within an automatic flow that they opened without a `variant` parameter
- **THEN** the URLs contain no `variant` parameter and every screen uses the assigned variant

#### Scenario: Variant change starts a new run
- **WHEN** the active variant changes while the flow is open
- **THEN** a new run with the new variant's initial state is shown, and no data from the previous variant's run remains

### Requirement: Active variant available to runtime infrastructure
For every run, the runtime SHALL know the flow id and the active variant id (or that there is none). Together with the current screen id and the run lifecycle (run started, screen shown, run completed), this SHALL be available where the flow is run, outside the screens, so an analytics integration can record it without changes to any screen. Screens SHALL NOT be given an API to read the active variant.

#### Scenario: Infrastructure observes the variant
- **WHEN** a run of variant `prominent-action` of flow `add-medication` shows screen `medication-form`
- **THEN** the code that runs the flow has `add-medication`, `prominent-action` and `medication-form` available without asking any screen

#### Scenario: Screens cannot branch on the variant id
- **WHEN** a developer looks for a runtime hook that returns the active variant id for use inside a screen
- **THEN** none exists, and variant differences are expressed through component overrides, screen overrides or initial state
