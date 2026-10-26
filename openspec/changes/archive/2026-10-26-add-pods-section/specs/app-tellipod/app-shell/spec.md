## MODIFIED Requirements

### Requirement: Placeholder screens
app-tellipod SHALL provide the screens Home, Ask Telli, Notifications, Navigation and Pod info. Ask Telli, Notifications, Navigation and Pod info SHALL display only their own localized name as content. Home SHALL display the pods section described by the requirement "Home pods section".

#### Scenario: Each screen shows its name
- **WHEN** a user opens Ask Telli, Notifications, Navigation or Pod info
- **THEN** the body shows that screen's name and no other content

#### Scenario: Home shows the pods section
- **WHEN** a user opens Home
- **THEN** the body shows the pods section and not a screen name

## ADDED Requirements

### Requirement: Home pods section
The Home screen SHALL show the pods section with the user's pods ordered by last activity and limited to two rows, inside a vertically scrollable body with 20 points of padding. Pressing a pod row SHALL open the Pod info screen for that pod. While the app has no screen for listing all pods or for adding a pod, Home SHALL NOT offer "See all pods" or "Add Pod". Pressing "Maybe later" on the first-run card SHALL hide the card until the app is restarted; after a restart the card SHALL show again if the user still has no pods.

#### Scenario: User with pods
- **WHEN** a user with three pods opens Home
- **THEN** the two most recently active pods are shown under "RECENT PODS" with no "See all pods" link

#### Scenario: Opening a pod
- **WHEN** a user presses a pod row on Home
- **THEN** the Pod info screen opens for that pod

#### Scenario: User without pods
- **WHEN** a user with no pods opens Home
- **THEN** the "Create your first Pod" card is shown with "Maybe later" and no "Add Pod" button

#### Scenario: Maybe later
- **WHEN** a user without pods presses "Maybe later"
- **THEN** the card disappears and stays hidden until the app is restarted

#### Scenario: Scrolling
- **WHEN** the section is taller than the space between the header and the footer
- **THEN** the body scrolls vertically
