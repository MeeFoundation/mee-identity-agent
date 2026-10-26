## Purpose

Defines the pods section of the app-tellipod home screen: a self-contained block that shows the user's most recent pods under a header, or invites a user with no pods to create their first one.

## ADDED Requirements

### Requirement: Section inputs
The pods section SHALL take the fetch params that identify the pods to show, a limit on the number of rows, a handler for pressing a pod, a handler for "Maybe later", and optionally handlers for "See all pods" and for "Add Pod". It SHALL NOT navigate, persist anything or decide by itself what the handlers do.

#### Scenario: Pod pressed
- **WHEN** a user presses a pod row in the section
- **THEN** the pod handler is called with that pod

#### Scenario: Handlers not wired
- **WHEN** the section is shown without any app navigation or storage available
- **THEN** it renders and responds to presses by calling its handlers only

### Requirement: Recent pods header
When the section shows pods, a pending state or an error, it SHALL show a header row above them with the localized label "Recent Pods" at the left and a localized "See all pods" link with a trailing arrow at the right. The label SHALL use Public Sans SemiBold 12 in uppercase in `text/default/subtle` #475569; the link SHALL use Public Sans Regular 14 in `text/brand/solid` #3B5B63 with an 8-point gap before a 16-point arrow. The header row and the rows below it SHALL be separated by 12 points. Pressing the link SHALL call the "See all pods" handler, and the link SHALL be exposed to assistive technology as a button labelled with its text. When no "See all pods" handler is supplied, the link SHALL NOT be shown and the label SHALL remain.

#### Scenario: Header with pods
- **WHEN** the section shows two pods
- **THEN** the header row shows "RECENT PODS" and "See all pods" above the two pod rows

#### Scenario: See all pods pressed
- **WHEN** a user presses "See all pods"
- **THEN** the "See all pods" handler is called

#### Scenario: No See all pods handler
- **WHEN** the section shows pods and no "See all pods" handler was supplied
- **THEN** the header row shows "RECENT PODS" and no link

#### Scenario: Header while loading
- **WHEN** the first page of pods is loading
- **THEN** the header row is shown above the pending placeholder rows

#### Scenario: Header on error
- **WHEN** loading the first page fails
- **THEN** the header row is shown above the error message and retry action

### Requirement: Recent pods rows
The section SHALL show the pods in the order the pod list holds them as pod cards, at most `limit` of them, with 12 points between rows. Its pending, error and refresh behavior SHALL be that of the pod list.

#### Scenario: More pods than the limit
- **WHEN** the list holds five pods and the limit is three
- **THEN** three pod cards are shown

#### Scenario: Pending rows
- **WHEN** the first page is loading
- **THEN** `limit` placeholder rows are shown below the header

### Requirement: First-run empty card
When the list has loaded and holds no pods, the section SHALL show no header and no pod rows and SHALL show a "Create your first Pod" card instead. The card SHALL have a white background, rounded corners of 16 points, the first-level shadow of the design system and 16 points of padding, with 16 points between its parts. It SHALL contain, from top to bottom: a circular icon holder in `surface/brand/soft` #F3F8F8 with a 16-point padding around a 24-point cookie icon; the localized title "Create your first Pod" in Public Sans SemiBold 24 in `text/default/title` #0F172A above the localized explanation in Public Sans Regular 14 in `text/default/body` #1E293B; a full-width primary "Add Pod" button with a leading plus icon; and a full-width text button "Maybe later" in `text/brand/solid` #3B5B63. Both buttons SHALL be 44 points high with corners of 12 points. The primary button SHALL have a brand gradient fill, white text and a light inner top highlight. When no "Add Pod" handler is supplied, the primary button SHALL NOT be shown and the rest of the card SHALL be unchanged.

#### Scenario: Loaded without pods
- **WHEN** the first page of the list loads with no pods
- **THEN** the "Create your first Pod" card is shown and no header, rows, pending state or error are shown

#### Scenario: Add Pod pressed
- **WHEN** a user presses "Add Pod"
- **THEN** the "Add Pod" handler is called

#### Scenario: No Add Pod handler
- **WHEN** the card is shown and no "Add Pod" handler was supplied
- **THEN** the card shows the title, the explanation and "Maybe later" and no "Add Pod" button

#### Scenario: Maybe later pressed
- **WHEN** a user presses "Maybe later"
- **THEN** the "Maybe later" handler is called and the section does not hide itself

#### Scenario: Pods arrive
- **WHEN** the list that showed the card is refreshed and now holds pods
- **THEN** the card is replaced by the header and pod rows

### Requirement: Hiding the first-run card
The pods section SHALL accept a flag from its owner that hides the first-run card. While the flag is set and the list has loaded without pods, the section SHALL render nothing. The flag SHALL NOT affect any other state: pods, the pending state and the error state SHALL be shown as usual.

#### Scenario: Hidden while empty
- **WHEN** the flag is set and the list has loaded without pods
- **THEN** the section renders nothing, with no header and no card

#### Scenario: Flag set with pods
- **WHEN** the flag is set and the list holds pods
- **THEN** the header and pod rows are shown

#### Scenario: Flag set while loading
- **WHEN** the flag is set and the first page is loading
- **THEN** the header and placeholder rows are shown

### Requirement: Localized text and accessibility
Every user-facing string of the section SHALL be localized. The primary and text buttons SHALL be exposed to assistive technology as buttons labelled with their text, and the card icon SHALL be hidden from assistive technology.

#### Scenario: Screen reader on the card
- **WHEN** assistive technology reads the empty card
- **THEN** it reads the title, the explanation and two buttons "Add Pod" and "Maybe later", and does not read the icons

### Requirement: Component stories
The pods section SHALL have stories showing it with pods, with more pods than the limit, while loading, after a failed load, and in the first-run empty state, each with its handlers logged as actions.

#### Scenario: Browsing the stories
- **WHEN** a user opens the pods section stories
- **THEN** each of the five states can be viewed without the pods store or the pods API being called
