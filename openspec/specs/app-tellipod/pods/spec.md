# app-tellipod/pods Specification

## Purpose

Defines the pod summary model and the cursor-paginated pod list behavior of app-tellipod, as the data layer for screens that render lists of pods.

## Requirements

### Requirement: Pod summary model
The pods capability SHALL expose a pod summary containing exactly the data a pod row renders: a unique id, a name, an optional avatar image URL, a category reference, an optional subcategory reference, and an unread flag. References SHALL carry category identifiers, not display labels.

#### Scenario: Pod without a photo
- **WHEN** a pod has no avatar image
- **THEN** its summary has no avatar URL, so the consumer can fall back to the pod's initial

#### Scenario: Pod without a subcategory
- **WHEN** a pod belongs to a category and has no subcategory
- **THEN** its summary has a category reference and no subcategory reference

### Requirement: Cursor-paginated pod list requests
The pods capability SHALL fetch pods in pages through a request that takes an optional opaque cursor, a page size and the fetch params, and returns the page's pods and a next cursor. A next cursor of null SHALL mean the end of the list. Consumers SHALL NOT interpret cursor contents.

#### Scenario: First page
- **WHEN** a list is requested without a cursor
- **THEN** the response contains up to the requested number of pods and the cursor of the next page, or null if there are no more pods

#### Scenario: Last page
- **WHEN** a request returns the final pods of the list
- **THEN** the next cursor is null

#### Scenario: Empty result
- **WHEN** no pods match the fetch params
- **THEN** the response contains no pods and a null next cursor

### Requirement: Fetch params
A pod list SHALL be identified by its fetch params: a required sort order (last activity or name ascending), and optional search text and category filter. There SHALL be no default sort; every request names one. The set of params SHALL be extensible without changing how lists are loaded, paginated or stored. The cursor and the page size SHALL NOT be part of the params. Params with the same values SHALL identify the same list regardless of key order. An optional param SHALL be omitted when absent, because an explicit undefined value identifies a different list than an omitted one.

#### Scenario: Equivalent params
- **WHEN** two lists are requested with the same params given in a different key order
- **THEN** both requests use the same list and its loaded pods

#### Scenario: Different params
- **WHEN** a list is requested with a different sort, search or category
- **THEN** it is a separate list that starts from the first page and does not alter any other list

### Requirement: Independent list state
For each distinct fetch params the pods capability SHALL keep its own loaded pages, next cursor, status (idle, loading, loading more, refreshing, error) and error. Switching between params SHALL NOT discard another list's state, and a response SHALL only ever be applied to the list that was requested.

#### Scenario: Switching back
- **WHEN** a user switches from one set of params to another and back
- **THEN** the first list is shown from its already loaded pages without a new request

#### Scenario: Late response
- **WHEN** a response arrives after the user has switched to different params
- **THEN** it is applied to the list it was requested for and the currently shown list is unchanged

### Requirement: Loading the first page
Loading a list SHALL request its first page and set the status to loading. If the list already has pages, loading SHALL NOT issue a request. If a request for the list is already in progress, loading SHALL NOT issue another.

#### Scenario: Initial load
- **WHEN** a list with no loaded pages is loaded
- **THEN** the first page is requested and, on success, the list holds that page and the status is idle

#### Scenario: Already loaded
- **WHEN** a list that already has pages is loaded again
- **THEN** no request is made

#### Scenario: First load fails
- **WHEN** the first page request fails
- **THEN** the status is error, the list has no pods, and loading again retries the first page

### Requirement: Loading more pods
Loading more SHALL request the page after the list's current cursor and append its pods. It SHALL do nothing if the list has no pages, its next cursor is null, or a request for the list is in progress. The flattened pods of a list SHALL contain no duplicate ids; when the same pod appears twice, its first occurrence SHALL be kept.

#### Scenario: Next page
- **WHEN** more pods are requested for a list with a non-null next cursor
- **THEN** the status is loading more, and on success the new pods are appended after the existing ones

#### Scenario: Repeated trigger
- **WHEN** more pods are requested several times while a page request is in progress
- **THEN** only one request is made

#### Scenario: End of list
- **WHEN** more pods are requested for a list whose next cursor is null
- **THEN** no request is made

#### Scenario: Load more fails
- **WHEN** a page request fails
- **THEN** the already loaded pods and the cursor are kept, the status is error, and requesting more again asks for the same page

#### Scenario: Pod repeated across pages
- **WHEN** a pod id appears in two consecutive pages
- **THEN** the flattened list contains it once

### Requirement: Refreshing a list
Refreshing SHALL request the first page of the list and, on success, replace all loaded pages and the cursor with that page. While refreshing, the previously loaded pods SHALL remain available. If refreshing fails, the previously loaded pods SHALL be kept and the status SHALL be error.

#### Scenario: Refresh success
- **WHEN** a list with several loaded pages is refreshed
- **THEN** only the new first page remains and its next cursor replaces the old one

#### Scenario: Refresh failure
- **WHEN** a refresh request fails
- **THEN** the previously loaded pods are still available and the status is error

### Requirement: Removing a list
The pods capability SHALL allow discarding the state of one list by its params, after which loading it behaves as for a list that was never loaded. Other lists SHALL be unaffected.

#### Scenario: Remove
- **WHEN** a list is removed and then loaded again
- **THEN** the first page is requested again

### Requirement: Replaceable pod source
The source of pod pages SHALL be replaceable without changing consumers of the pods capability. Until a real backend exists, the default source SHALL be an in-memory mock that honors cursor, page size, sort order (last activity and name ascending) and returns the null cursor at the end of its data.

#### Scenario: Swapping the source
- **WHEN** a different source is provided
- **THEN** lists load from it with no change to how consumers load, paginate or refresh

#### Scenario: Mock ordering
- **WHEN** the mock is asked for name ascending
- **THEN** pods are returned in ascending name order across all pages
