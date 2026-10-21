## Purpose

Defines the navigable skeleton of app-tellipod: its primary and detail screens, the footer and header chrome, and how a screen controls that chrome.

## ADDED Requirements

### Requirement: Placeholder screens
app-tellipod SHALL provide the screens Home, Ask Telli, Notifications, Navigation and Pod info. Each screen SHALL display only its own localized name as content.

#### Scenario: Each screen shows its name
- **WHEN** a user opens any of the five screens
- **THEN** the body shows that screen's name and no other content

### Requirement: Four-tab footer
The app footer SHALL show four tabs in this order: Home, Ask Telli, Notifications, Navigation. The footer SHALL highlight the active tab and SHALL switch screens when a tab is pressed.

#### Scenario: Switching tabs
- **WHEN** the user presses the Notifications tab while on Home
- **THEN** the Notifications screen is shown and the Notifications tab is highlighted

### Requirement: Notifications unread indicator
The footer SHALL show an unread indicator on the Notifications tab while unread notifications exist, regardless of which screen is active, and SHALL remove it when none remain.

#### Scenario: Indicator on any screen
- **WHEN** there are unread notifications and the user is on the Navigation screen
- **THEN** the Notifications tab shows the unread indicator

#### Scenario: Indicator cleared
- **WHEN** the unread count becomes zero
- **THEN** the Notifications tab shows no indicator

### Requirement: Pod info is a detail screen
Pod info SHALL open as a pushed screen carrying a pod identifier, with the footer not displayed and a header that offers navigating back.

#### Scenario: Opening pod info
- **WHEN** the user opens Pod info for a pod
- **THEN** the footer is not displayed and the header shows a back control

#### Scenario: Back from pod info
- **WHEN** the user presses the back control on Pod info
- **THEN** the previous screen is shown and the footer is displayed again

### Requirement: Header variants
The app header SHALL support the variants `none` (no header), `home` (welcome header with a search-or-ask field), `back-title` (back control with a title) and `pod` (back control, pod title and overflow action). Each screen SHALL declare which variant it uses, and the header SHALL render that variant.

#### Scenario: Tab screens use the home header
- **WHEN** the user is on Home, Ask Telli or Notifications
- **THEN** the header shows the `home` variant

#### Scenario: Navigation uses the back-title header
- **WHEN** the user is on Navigation
- **THEN** the header shows the `back-title` variant

#### Scenario: Pod info uses the pod header
- **WHEN** the user is on Pod info
- **THEN** the header shows the `pod` variant

### Requirement: Screens control chrome through a single mechanism
A screen SHALL set its header variant and footer visibility by one declaration that applies when the screen gains focus and is released when it loses focus. Chrome from a screen that lost focus SHALL NOT remain visible after another screen has gained focus, and a screen losing focus SHALL NOT clear chrome already set by the screen that gained focus.

#### Scenario: Chrome follows focus
- **WHEN** the user navigates from a screen declaring `home` to one declaring `back-title`
- **THEN** the header shows `back-title` with no intermediate flash of `home` content

#### Scenario: Returning restores chrome
- **WHEN** the user navigates back to a screen
- **THEN** that screen's declared header variant and footer visibility are shown again

#### Scenario: Footer hidden by a screen
- **WHEN** a tab screen declares the footer hidden
- **THEN** the footer is not displayed on that screen and is displayed again once the screen loses focus

#### Scenario: Default chrome
- **WHEN** a screen declares no chrome
- **THEN** the header variant `none` is used and the footer visibility is its default

### Requirement: Localized strings
All user-facing text introduced for the shell, including screen names, tab labels and header text, SHALL come from the app's translation resources.

#### Scenario: No hardcoded text
- **WHEN** a developer searches the shell screens and chrome for literal user-facing strings
- **THEN** none are found; text is resolved through translation keys
