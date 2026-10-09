## MODIFIED Requirements

### Requirement: Flow variants
A flow MAY declare a set of variants. Each variant SHALL have a stable identifier that is unique within its flow, is URL-safe (lowercase letters, digits and hyphens), and is never derived from its display text. Each variant SHALL have a human-readable name, and MAY have a description, both shown through i18next. A variant MAY have a display code, for example `EXP-PET-002-A`, shown verbatim and not translated. A variant SHALL describe only how it differs from the base flow. That can be any combination of replacement building-block components, replacement screens, initial-state values, and screen design references. Anything a variant does not override SHALL be taken from the base flow. A flow without variants SHALL behave exactly as before.

#### Scenario: Flow without variants
- **WHEN** a flow declares no variants
- **THEN** it is listed, started, navigated and completed exactly as a flow without variant support, and its active variant is reported as none

#### Scenario: Variant inherits everything it does not override
- **WHEN** a variant overrides only one building-block component
- **THEN** a run of that variant uses the base flow's screens, initial state, store, navigation, screen design references and every other component unchanged

#### Scenario: Variant overrides a screen design reference
- **WHEN** a variant declares its own Figma frame for a screen whose base flow declares a different frame
- **THEN** the flow resolved for that variant references the variant's frame for that screen, and the base frame for every other screen

#### Scenario: Every declared variant is consistent
- **WHEN** the application's automated checks run
- **THEN** they verify that every registered flow's variants have valid identifiers, that a declared default variant exists, and that each variant resolves to a flow whose initial screen exists

### Requirement: Variant selection mode
A flow with variants SHALL declare how participants get a variant: explicit selection (the participant chooses the variant) or automatic assignment (the application assigns one and does not show the participant which one). A flow with variants that does not declare a mode SHALL use explicit selection. Development builds MAY show variant information for automatic flows, as defined by the home page requirement of `app-ux-flows/flow-runtime`.

#### Scenario: Explicit flow on the home page
- **WHEN** a participant views the home page and a flow uses explicit selection
- **THEN** they can choose any of the flow's variants by name and start the flow in the chosen variant

#### Scenario: Automatic flow on the home page
- **WHEN** a participant views the home page of a production build and a flow uses automatic assignment
- **THEN** they see only a single start action for that flow, and no variant name or identifier is shown to them
