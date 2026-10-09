## MODIFIED Requirements

### Requirement: Active variant available to runtime infrastructure
For every run, the runtime SHALL know the flow id, the active variant id (or that there is none), and how the active variant was selected:
- `url`: a valid `variant` URL parameter,
- `stored`: an existing automatic assignment,
- `assigned`: a new automatic assignment made for this run,
- `default`: the explicit flow's default variant,
- `none`: the flow has no variants.

Together with the current screen id and the run lifecycle (run started, screen shown, run completed, run restarted), this SHALL be available where the flow is run, outside the screens, so analytics can record it without changes to any screen. Screens SHALL NOT be given an API to read the active variant or how it was selected.

#### Scenario: Infrastructure observes the variant
- **WHEN** a run of variant `prominent-action` of flow `add-medication` shows screen `medication-form`
- **THEN** the code that runs the flow has `add-medication`, `prominent-action` and `medication-form` available without asking any screen

#### Scenario: Infrastructure observes the selection source
- **WHEN** a participant with no stored assignment opens an automatic flow, and later reopens it, and a reviewer opens it with `?variant=b`
- **THEN** the runtime reports the sources `assigned`, `stored` and `url` respectively

#### Scenario: Screens cannot branch on the variant id
- **WHEN** a developer looks for a runtime hook that returns the active variant id for use inside a screen
- **THEN** none exists, and variant differences are expressed through component overrides, screen overrides or initial state
