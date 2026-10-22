# app-tellipod/app-shell Specification

## Purpose

Defines the navigable skeleton of app-tellipod: its primary and detail screens, the footer and header chrome, and how a screen controls that chrome.

## Requirements

### Requirement: Placeholder screens
app-tellipod SHALL provide the screens Home, Ask Telli, Notifications, Navigation and Pod info. Each screen SHALL display only its own localized name as content.

#### Scenario: Each screen shows its name
- **WHEN** a user opens any of the five screens
- **THEN** the body shows that screen's name and no other content

### Requirement: Four-tab footer
The app footer SHALL show four tabs in this order: Home, Telli Guide, Notifications, Navigation. Each tab SHALL present a 24-point icon above its label. The footer SHALL highlight the active tab and SHALL switch screens when a tab is pressed. An inactive tab SHALL show an outline icon with a slate label; the active tab SHALL show the filled variant of its icon (the same glyph where no filled variant exists, as for Telli Guide and Navigation) in the brand color with a brand-colored label.

#### Scenario: Switching tabs
- **WHEN** the user presses the Notifications tab while on Home
- **THEN** the Notifications screen is shown and the Notifications tab is highlighted

#### Scenario: Tab order and labels
- **WHEN** the footer is displayed
- **THEN** the tabs read Home, Telli Guide, Notifications, Navigation from left to right, each with an icon above its label

#### Scenario: Active appearance
- **WHEN** a tab is the active tab
- **THEN** its icon is the filled variant (or the same glyph where none exists) and its icon and label use the brand color, while every other tab uses the outline icon and slate label

#### Scenario: Pressing the active tab
- **WHEN** the user presses the tab that is already active
- **THEN** the screen does not change

### Requirement: Notifications unread indicator
The footer SHALL show an unread indicator on the Notifications tab while unread notifications exist, regardless of which screen is active, and SHALL remove it when none remain. The indicator SHALL be a red dot with a white ring, placed at the top-right of the Notifications icon.

#### Scenario: Indicator on any screen
- **WHEN** there are unread notifications and the user is on the Navigation screen
- **THEN** the Notifications tab shows the unread indicator

#### Scenario: Indicator cleared
- **WHEN** the unread count becomes zero
- **THEN** the Notifications tab shows no indicator

#### Scenario: Indicator stays visible on the active tab
- **WHEN** there are unread notifications and the Notifications tab is active
- **THEN** the unread indicator is still shown at the top-right of the filled icon

### Requirement: Footer surface
The footer SHALL sit on a near-white (80% opaque) surface with a white top and side border, rounded top corners, and a soft upward shadow, with its tabs inset from the screen edges and the device's bottom safe area kept clear beneath the tabs. Tabs SHALL share the footer width equally.

#### Scenario: Footer on a device with a home indicator
- **WHEN** the footer is displayed on a device with a bottom inset
- **THEN** the tab icons and labels sit above that inset and the footer surface extends to the bottom screen edge

#### Scenario: Equal tab widths
- **WHEN** the footer is displayed
- **THEN** the four tabs have equal width regardless of label length

### Requirement: Tab selection color transition
When the active tab changes, the footer SHALL animate the color change of the affected tabs. The tab becoming active SHALL fade in its active color (filled icon and label), and the tab becoming inactive SHALL fade back to its inactive color. Only color SHALL change: the icon and label SHALL NOT scale or move. The transition SHALL complete within 300 milliseconds. When the device's reduce-motion setting is on, the footer SHALL change colors without animation.

#### Scenario: Tab becomes active
- **WHEN** the user presses an inactive tab
- **THEN** that tab's icon and label transition to the active color, while they keep their size and position

#### Scenario: Tab becomes inactive
- **WHEN** another tab becomes active
- **THEN** the previously active tab's icon and label transition back to the inactive color

#### Scenario: Simultaneous transition
- **WHEN** the active tab changes
- **THEN** the outgoing and incoming tabs animate together within the same duration

#### Scenario: Interrupted transition
- **WHEN** the user presses a different tab while a transition is still running
- **THEN** each affected tab reverses from its current progress without a visual jump

#### Scenario: Initial render
- **WHEN** the footer first appears or reappears after being hidden
- **THEN** the active tab is shown in its active color immediately with no animation

#### Scenario: Reduce motion
- **WHEN** the device's reduce-motion setting is on and the active tab changes
- **THEN** the tabs show their new colors immediately with no animation

### Requirement: Pod info is a detail screen
Pod info SHALL open as a pushed screen carrying a pod identifier, with the footer not displayed and a header that offers navigating back.

#### Scenario: Opening pod info
- **WHEN** the user opens Pod info for a pod
- **THEN** the footer is not displayed and the header shows a back control

#### Scenario: Back from pod info
- **WHEN** the user presses the back control on Pod info
- **THEN** the previous screen is shown and the footer is displayed again

### Requirement: Screens control chrome through a single mechanism
A screen SHALL set its header variant and footer visibility by one declaration that applies when the screen gains focus and is released when it loses focus. Chrome from a screen that lost focus SHALL NOT remain visible after another screen has gained focus, and a screen losing focus SHALL NOT clear chrome already set by the screen that gained focus.

#### Scenario: Chrome follows focus
- **WHEN** the user navigates from a screen declaring `home` to one declaring `back-search`
- **THEN** the header shows `back-search` with no intermediate flash of `home` content

#### Scenario: Returning restores chrome
- **WHEN** the user navigates back to a screen
- **THEN** that screen's declared header variant and footer visibility are shown again

#### Scenario: Footer hidden by a screen
- **WHEN** a tab screen declares the footer hidden
- **THEN** the footer is not displayed on that screen and is displayed again once the screen loses focus

#### Scenario: Default chrome
- **WHEN** a screen declares no chrome
- **THEN** the header variant `none` is used and the footer visibility is its default

### Requirement: Header variant set
The app header SHALL support the variants `none` (no header), `home` (welcome header with a privacy note and a search-or-ask field), `back-search` (back control with a search-or-ask field) and `pod` (pod detail header). The `home`, `back-search` and `pod` variants SHALL share the surface defined by the requirement "Header surface". Each screen SHALL declare which variant it uses, and the header SHALL render that variant.

#### Scenario: Tab screens use the home header
- **WHEN** the user is on Home, Ask Telli or Notifications
- **THEN** the header shows the `home` variant

#### Scenario: Navigation uses the back-search header
- **WHEN** the user is on Navigation
- **THEN** the header shows the `back-search` variant

#### Scenario: Pod info uses the pod header
- **WHEN** the user is on Pod info
- **THEN** the header shows the `pod` variant

### Requirement: Header surface
The `home`, `back-search` and `pod` headers SHALL sit on a brand-colored vertical gradient surface that fades to white, with rounded bottom corners, a light bottom border and a soft shadow. Header content SHALL start below the device's top safe area, and no header control or text SHALL be displayed under that inset.

#### Scenario: Below the safe area
- **WHEN** the device has a top inset such as a notch or dynamic island
- **THEN** no header control or text is displayed under that inset, for every variant that shows a header

#### Scenario: Same surface on every variant
- **WHEN** the user moves between screens declaring `home`, `back-search` and `pod`
- **THEN** the header surface looks the same on all of them

### Requirement: Search-or-ask field
Where a header shows the search-or-ask field, it SHALL show a search icon and the localized placeholder "Search, or ask Telli..." in a full-width field. The field SHALL NOT accept text input.

#### Scenario: Field shown
- **WHEN** the `home` or `back-search` header is shown
- **THEN** the header shows the search icon and the placeholder text in a full-width field

#### Scenario: No text entry
- **WHEN** the user presses the search-or-ask field
- **THEN** no keyboard opens and no text can be entered

### Requirement: Home header content
The `home` header SHALL show a circular avatar carrying the first letter of the user's name, a greeting, a privacy note preceded by a shield icon, and the search-or-ask field beneath them. The greeting SHALL read "Welcome, <name>" when the user has a name, and "Welcome" otherwise. Without a name the avatar SHALL show a generic fallback in place of the letter.

#### Scenario: Greeting with a name
- **WHEN** the `home` header is shown for a user named "Bogdan"
- **THEN** the header shows the avatar letter "B", the greeting "Welcome, Bogdan", the privacy note "Device-to-device sharing, pod members only." and the search-or-ask field

#### Scenario: No name available
- **WHEN** the `home` header is shown and the user has no name
- **THEN** the greeting reads "Welcome" and the avatar shows the generic fallback

#### Scenario: Long greeting
- **WHEN** the greeting or the privacy note is longer than the available width
- **THEN** the text is truncated to a single line and the avatar stays fully visible

### Requirement: Back-search header content
The `back-search` header SHALL show a back control and the search-or-ask field in one row. The back control SHALL navigate to the previous screen and SHALL be exposed to assistive technology with a localized label and a touch target of at least 44 by 44 points.

#### Scenario: Content shown
- **WHEN** the `back-search` header is shown
- **THEN** the header shows the back control and the search-or-ask field in one row

#### Scenario: Back control
- **WHEN** the user presses the back control on the `back-search` header
- **THEN** the previous screen is shown

### Requirement: Pod header content
The `pod` header SHALL show, in one row, a back control, a circular avatar, the pod title with a breadcrumb subtitle beneath it, and an overflow action. Beneath that row it SHALL show a tab row with the tabs Notes, Chat and Info, exactly one of which is selected at any time. The breadcrumb SHALL show an ordered list of one or more labeled items separated by a chevron; the first item MAY carry an icon.

#### Scenario: Content shown
- **WHEN** the `pod` header is shown for a pod titled "About Sofia" with the breadcrumb "People > Immediate Family"
- **THEN** the header shows the back control, the avatar, the title "About Sofia", the breadcrumb "People", a chevron and "Immediate Family", the overflow action, and the tabs Notes, Chat and Info

#### Scenario: Avatar unavailable
- **WHEN** the pod has no avatar image
- **THEN** the header shows a circular fallback in the avatar's place and the layout of the row does not change

#### Scenario: Long title
- **WHEN** the pod title is longer than the available width
- **THEN** the title is truncated to a single line and the back control, avatar and overflow action remain fully visible

### Requirement: Pod header tabs
The tab row SHALL highlight the selected tab and SHALL report the pressed tab to the screen that owns the header. Pressing a tab SHALL NOT change the selection unless the screen applies the change. The tab row SHALL be exposed to assistive technology as tabs with their selected state.

#### Scenario: Selecting a tab
- **WHEN** the user presses Chat while Notes is selected and the screen applies the change
- **THEN** Chat is highlighted and Notes is not

#### Scenario: Screen rejects the change
- **WHEN** the user presses a tab and the screen does not apply the change
- **THEN** the previously selected tab stays highlighted

#### Scenario: Pressing the selected tab
- **WHEN** the user presses the tab that is already selected
- **THEN** the selection is unchanged

### Requirement: Pod header actions
The back control SHALL navigate to the previous screen. The overflow action SHALL be exposed to assistive technology with a localized label, and every icon-only control in the header SHALL have a touch target of at least 44 by 44 points.

#### Scenario: Back control
- **WHEN** the user presses the back control on the `pod` header
- **THEN** the previous screen is shown

#### Scenario: Accessible icon controls
- **WHEN** assistive technology inspects the `pod` header
- **THEN** the back control and the overflow action each announce a localized label as buttons

### Requirement: Header transitions between variants
When the header variant changes because the user moved to another screen, the header SHALL transition rather than switch abruptly: the outgoing content SHALL fade out while the incoming content fades in, and the header surface SHALL animate its height to that of the incoming variant. The transition SHALL complete within 300 milliseconds. A change from `none` SHALL grow the header from no height, and a change to `none` SHALL shrink it to no height. When the device's reduce-motion setting is on, the header SHALL change variant without fade or height animation.

#### Scenario: Home to back-search
- **WHEN** the user moves from a screen declaring `home` to one declaring `back-search`
- **THEN** the home content fades out, the back-search content fades in, and the header height animates from one to the other with no instantaneous jump

#### Scenario: Header appears from none
- **WHEN** the user moves from a screen declaring `none` to one declaring `home`
- **THEN** the header grows from no height while its content fades in

#### Scenario: Header disappears
- **WHEN** the user moves from a screen declaring `pod` to one declaring `none`
- **THEN** the header content fades out and the header shrinks to no height

#### Scenario: Surface persists
- **WHEN** the variant changes between `home`, `back-search` and `pod`
- **THEN** the gradient, rounded corners, border and shadow stay in place and are not faded out and back in

#### Scenario: Same variant
- **WHEN** the user moves between two screens that declare the same variant
- **THEN** the header does not animate

#### Scenario: Content updates within a variant
- **WHEN** the content of the current variant changes without the variant changing, such as the selected pod tab or the greeting
- **THEN** the header does not fade or resize

#### Scenario: Under the safe area during transition
- **WHEN** a transition is in progress on a device with a top inset
- **THEN** no header control or text is displayed under that inset

#### Scenario: Outgoing content not interactive
- **WHEN** a transition is in progress
- **THEN** only the incoming content responds to presses

#### Scenario: Reduce motion
- **WHEN** the device's reduce-motion setting is on and the variant changes
- **THEN** the header shows the new variant at its final height with no fade or height animation

### Requirement: Localized strings
All user-facing text introduced for the shell, including screen names, tab labels and header text, SHALL come from the app's translation resources.

#### Scenario: No hardcoded text
- **WHEN** a developer searches the shell screens and chrome for literal user-facing strings
- **THEN** none are found; text is resolved through translation keys
