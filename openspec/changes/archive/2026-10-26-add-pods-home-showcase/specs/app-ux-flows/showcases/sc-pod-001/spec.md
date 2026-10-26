## Purpose

Defines the showcase SC-POD-001 "Pods on Home" in `app-ux-flows`: the Tellipod Home screen with its pod list in each state it can be in — loading, with pods, empty on first run, and failed to load. The states are mocked, so reviewers can see and discuss each of them without a backend. The showcase has no variants or cases, records no analytics, and no screen fetches data.

## ADDED Requirements

### Requirement: Showcase identity and cases
The application SHALL register a showcase flow with flow id `sc-pod-001`, display code `SC-POD-001`, title "Pods on Home" and the description "See how Home shows the list of pods while it loads, with pods, on first run with none, and when it fails to load." It SHALL be listed after the existing showcases. It SHALL have no variants and no automatic assignment: the state of the pod list is chosen by the reviewer, who starts the case they want from the home page. It SHALL declare one screen, `home`, the initial screen in every case.

It SHALL have four cases, each with a display code, a name and a description, in this order:

| Case | Code | Name | Pod list state |
|---|---|---|---|
| `a` | `SC-POD-001-A` | With pods | the pods are shown |
| `b` | `SC-POD-001-B` | Loading | the pods are loading |
| `c` | `SC-POD-001-C` | First run, no pods | the user has no pods yet |
| `d` | `SC-POD-001-D` | Failed to load | loading the pods failed |

`home` SHALL NOT declare a Figma frame. Cases are available in production builds and none is hidden.

#### Scenario: Choose a state on the home page
- **WHEN** a reviewer opens the application's home page
- **THEN** "Pods on Home" offers four start actions, "With pods", "Loading", "First run, no pods" and "Failed to load", and nothing is started or chosen automatically

#### Scenario: Start a case
- **WHEN** a reviewer chooses "Loading"
- **THEN** `home` is shown at `/flows/sc-pod-001/home?case=b` with the pod list loading

#### Scenario: Open a case by URL
- **WHEN** someone opens `/flows/sc-pod-001/home?case=d`
- **THEN** Home is shown with the failed state

#### Scenario: No case in the URL
- **WHEN** someone opens `/flows/sc-pod-001/home` without a `case` parameter
- **THEN** the first case, "With pods", is used

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Pods on Home" is listed with the code `SC-POD-001`, inside a group titled "Pods" for the family `SC-POD`, with its four cases and the screen `home`

### Requirement: Home frame
`home` SHALL show the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field; below it the pods section; and the app tab bar with Home active. The top bar, the tab bar and the search field SHALL do nothing when activated. The pods section SHALL show at most two pods.

#### Scenario: Same frame in every case
- **WHEN** a reviewer starts each of the four cases
- **THEN** each shows the same top bar and tab bar around the pods section

### Requirement: Pod list state
The case SHALL decide the state of the pods section when the run starts.

- "With pods" SHALL show two pods and the header with "See all pods": "About Sofia", in People › Immediate family, with no avatar image and no unread activity; and "Maya", in Pets, with an avatar image and unread activity.
- "Loading" SHALL show the section as loading, with two placeholder cards.
- "First run, no pods" SHALL show the section as loaded with no pods: the "Create your first Pod" card, with its "Add Pod" button.
- "Failed to load" SHALL show the section as failed, with its message and "Retry" button.

Activating a pod card, "See all pods", "Add Pod" or "Maybe later" SHALL do nothing. Activating "Retry" SHALL show the section as loading. The loading state SHALL stay as it is until the reviewer leaves it or restarts the run: it SHALL NOT turn into another state by itself. Restarting the run SHALL return the section to the state of the case.

#### Scenario: With pods
- **WHEN** a reviewer starts "With pods"
- **THEN** the header "RECENT PODS" with "See all pods" is shown above the cards "About Sofia" and "Maya"

#### Scenario: Loading
- **WHEN** a reviewer starts "Loading"
- **THEN** the header is shown above two pulsing placeholder cards, and the state does not change

#### Scenario: First run
- **WHEN** a reviewer starts "First run, no pods"
- **THEN** no header is shown, and the "Create your first Pod" card is shown with "Add Pod" and "Maybe later"

#### Scenario: Failed
- **WHEN** a reviewer starts "Failed to load"
- **THEN** the header, the message "Couldn't load your pods." and "Retry" are shown

#### Scenario: Retry
- **WHEN** a reviewer in "Failed to load" activates "Retry"
- **THEN** the section shows as loading

#### Scenario: Restart after Retry
- **WHEN** a reviewer restarts the run after activating "Retry"
- **THEN** the section shows as failed again

#### Scenario: Inert controls
- **WHEN** a reviewer activates "About Sofia", "See all pods", "Add Pod" or "Maybe later"
- **THEN** `home` stays shown and nothing changes

### Requirement: No fetching and no tracking
No screen of the showcase SHALL fetch data, use storage beyond the run, or record analytics. The pods SHALL be fixed sample data.

#### Scenario: Offline
- **WHEN** a reviewer opens any screen of the showcase without a network connection
- **THEN** the screen is shown as usual
