## MODIFIED Requirements

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

## ADDED Requirements

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
