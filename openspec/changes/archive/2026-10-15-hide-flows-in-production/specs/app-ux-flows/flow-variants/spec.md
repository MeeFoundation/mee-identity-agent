## ADDED Requirements

### Requirement: Hidden variants
A variant MAY be declared hidden. A variant that does not declare it SHALL be visible. Development builds SHALL treat a hidden variant exactly like a visible one, apart from the "Hidden in production" label defined by `app-ux-flows/flow-runtime`.

In production builds a hidden variant SHALL be treated as if it were not declared, for every rule of variant selection:
- it SHALL NOT be offered as a start action on the home page;
- a `variant` URL parameter naming it SHALL be handled as an unknown variant;
- it SHALL NOT be automatically assigned. A stored assignment to it SHALL be handled as an assignment that is no longer valid;
- when it is the flow's declared default variant, the default SHALL be the first visible variant in key order.

When every variant of a flow is hidden, the flow SHALL be hidden as defined by `app-ux-flows/flow-runtime`.

#### Scenario: Hidden variant offered on the dev server
- **WHEN** variant `b` of `exp-demo-001` is hidden and the dev server shows the home page
- **THEN** variant `b` is offered with the label "Hidden in production", and `?variant=b` opens it

#### Scenario: Hidden variant not offered in production
- **WHEN** variant `b` of `exp-demo-001` is hidden and a production build shows the home page
- **THEN** the row of `exp-demo-001` offers no start action for variant `b`

#### Scenario: Hidden variant URL in production
- **WHEN** variant `b` of `exp-demo-001` is hidden and someone opens a URL of the flow with `?variant=b` in a production build
- **THEN** the URL is replaced with the same path without the parameter, and the flow runs in the variant chosen by the remaining rules

#### Scenario: Hidden variant is never assigned
- **WHEN** a flow with automatic selection has variants `control` and `prominent-action`, `prominent-action` is hidden, and a participant opens it in a production build
- **THEN** the participant is assigned `control`

#### Scenario: Stored assignment to a hidden variant
- **WHEN** a browser has the stored assignment `prominent-action` for that flow, `prominent-action` has since been hidden, and the flow is opened in a production build
- **THEN** the assignment is discarded, a visible variant is assigned and stored, and the flow runs without error

#### Scenario: Hidden default variant
- **WHEN** an explicit flow declares default variant `b`, `b` is hidden, and the flow is opened without a `variant` parameter in a production build
- **THEN** the flow runs in its first visible variant in key order
