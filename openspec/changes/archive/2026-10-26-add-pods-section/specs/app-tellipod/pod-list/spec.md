## MODIFIED Requirements

### Requirement: Empty state
When a list has loaded and holds no pods, the pod list SHALL show a localized empty message and no rows. A caller MAY supply its own content for this state; when it does, the pod list SHALL show that content in place of the empty message and SHALL NOT show the empty message. Supplied content SHALL NOT replace the pending state or the error state.

#### Scenario: Loaded without pods
- **WHEN** the first page of a list loads with no pods
- **THEN** the empty message is shown and no rows, pending state or error are shown

#### Scenario: Caller-supplied empty content
- **WHEN** the first page of a list loads with no pods and the caller supplied empty content
- **THEN** that content is shown and neither the empty message, rows, pending state nor error are shown

#### Scenario: Supplied content while pending or failed
- **WHEN** the first page is loading or has failed and the caller supplied empty content
- **THEN** the pending state or the error is shown, not the supplied content
