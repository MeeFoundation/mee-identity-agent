# app-tellipod/pod-list Specification

## Purpose

Defines the pod list of app-tellipod: a component that loads the pods for a set of fetch params and shows up to a given number of pod rows, with pending, error and empty states. It is the building block for previews of the user's pods on screens that do not scroll or page through the list.

## Requirements

### Requirement: List inputs
The pod list SHALL take the fetch params that identify the list, a limit, and a handler called with the pod when a row is pressed. It SHALL load the list for those params when shown and SHALL request the first page with the limit as the page size. Lists with equal params SHALL share their loaded pods with every other pod list or consumer using those params.

#### Scenario: Loading on first show
- **WHEN** a pod list is shown for params that have no loaded pods
- **THEN** it requests the first page for those params with the given limit

#### Scenario: Already loaded params
- **WHEN** a pod list is shown for params whose pods are already loaded
- **THEN** it shows those pods without issuing a new request

#### Scenario: Press
- **WHEN** a user presses a pod row
- **THEN** the press handler is called with that pod

### Requirement: Limit on shown pods
The pod list SHALL show at most `limit` pods, in the order the list holds them, even when the shared list holds more. It SHALL NOT request further pages and SHALL NOT scroll by itself; its height follows the rows it shows.

#### Scenario: More pods than the limit
- **WHEN** the list for the params holds five pods and the limit is three
- **THEN** the first three pods are shown as rows and no request for another page is made

#### Scenario: Fewer pods than the limit
- **WHEN** the list holds two pods and the limit is three
- **THEN** two rows are shown

### Requirement: Pending state
While the first page of a list is loading, and before the first load has started, the pod list SHALL show a pending state instead of rows, an empty message or an error. The pending state SHALL be `limit` placeholder rows that match a pod row's surface, with a circular avatar block and two text blocks, so the list keeps its height when the pods arrive. The placeholders SHALL pulse, SHALL be hidden from assistive technology, and SHALL be announced as a single localized loading label marked as busy. When pods are already shown, a refresh in progress SHALL NOT replace them with the pending state.

#### Scenario: First load in progress
- **WHEN** the first page of the list is being requested and the limit is three
- **THEN** three placeholder rows are shown and no empty message or error is shown

#### Scenario: Pending announcement
- **WHEN** the pending state is shown
- **THEN** assistive technology reads one loading label, marked as busy, and none of the placeholder rows

#### Scenario: Before the load starts
- **WHEN** the pod list is rendered for params that have never been loaded
- **THEN** the pending state is shown, not the empty message

#### Scenario: Refresh with pods shown
- **WHEN** a refresh of a list that already shows pods is in progress
- **THEN** the pods stay shown and the pending state is not shown

### Requirement: Error state
When loading the first page fails, the pod list SHALL show a localized error message and a retry action instead of rows. Pressing retry SHALL repeat the failed request, and the pending state SHALL be shown while it runs. When a failure happens while pods are already shown, the pod list SHALL keep the pods and show the error message and retry action below them.

#### Scenario: First load fails
- **WHEN** the first page request of a list with no pods fails
- **THEN** the error message and a retry action are shown and no rows are shown

#### Scenario: Retry
- **WHEN** a user presses retry after a failed first load
- **THEN** the request is repeated and the pending state is shown until it settles

#### Scenario: Failure with pods shown
- **WHEN** a refresh of a list that already shows pods fails
- **THEN** the pods stay shown with the error message and retry action below them

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
