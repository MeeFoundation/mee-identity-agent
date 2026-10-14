## MODIFIED Requirements

### Requirement: App tab bar component
The design system SHALL provide the Tellipod app tab bar, following the Figma component `bottom-menu` as shown in Mee – Tellipod App v4.0.3 (Home, 905-15153). It is a rounded bar pinned to the bottom of the screen, above the home indicator, with four tabs in this order: Home, Ask Telli, Notifications and Navigation. Each tab has an icon and a label, and the active tab is highlighted. The Notifications tab SHALL show a red badge dot on its icon, and the dot SHALL be part of the tab's accessible name ("Notifications, new"). The flow SHALL decide which tab is active and what activating each tab does. Screens SHALL opt into the bar; it SHALL NOT be shown on screens that do not render it. The bar SHALL be announced as navigation, and the active tab as the current page.

#### Scenario: Active tab
- **WHEN** a screen renders the tab bar with Ask Telli active
- **THEN** Ask Telli is highlighted and announced as the current page, and Home, Notifications and Navigation are not

#### Scenario: Tab activation runs the flow's action
- **WHEN** a participant activates the Home tab
- **THEN** the flow's Home action runs

#### Scenario: Four tabs with a Notifications badge
- **WHEN** any screen renders the tab bar
- **THEN** it shows Home, Ask Telli, Notifications and Navigation in that order, and Notifications shows a red badge dot

#### Scenario: Notifications runs the flow's action
- **WHEN** a participant activates the Notifications tab
- **THEN** the flow's Notifications action runs, and nothing else happens unless the flow defines it
