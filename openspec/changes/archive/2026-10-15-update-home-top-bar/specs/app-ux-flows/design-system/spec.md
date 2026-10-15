## ADDED Requirements

### Requirement: Home top bar component
The design system SHALL provide the Tellipod Home top bar, following the Figma component `home-topbar` in Mee – Tellipod App v4.0.3 (Home, 905-15156). It SHALL show, below the status bar area:
- a row with the user's avatar, a 48 px circle showing the user's initial, to the left of the greeting;
- under the greeting, in the same column, a shield-lock icon followed by the line "Device-to-device sharing, pod members only.";
- below the row, a full-width search field with a search icon and the placeholder "Search, or ask Telli…".

The top bar SHALL keep the existing Home header surface: rounded bottom corners, a gradient from the brand tint to white, and the top bar shadow. The flow SHALL provide the greeting and the initial. The sharing line and the placeholder SHALL come from the app's translations. The top bar SHALL NOT include a device status bar.

The search field SHALL look like the design's text field but SHALL NOT accept text. It SHALL be a single control, announced with the name "Search, or ask Telli…". Activating it SHALL run the action the flow provides, if any, and SHALL do nothing else. The avatar SHALL be decorative and hidden from assistive technology. The greeting SHALL be the screen's heading.

#### Scenario: Top bar layout
- **WHEN** a screen renders the Home top bar with the greeting "Welcome, Alice" and the initial "A"
- **THEN** the avatar "A" is shown to the left of "Welcome, Alice", the shield-lock icon and "Device-to-device sharing, pod members only." are shown under the greeting, and the search field is shown below them

#### Scenario: Search field runs the flow's action
- **WHEN** a participant activates the search field
- **THEN** the flow's search action runs, no text can be typed, and the screen stays as it is

#### Scenario: Search field without an action
- **WHEN** a flow renders the Home top bar without a search action and a participant activates the search field
- **THEN** nothing happens

#### Scenario: Accessible structure
- **WHEN** a screen reader user moves through the Home top bar
- **THEN** the greeting is announced as a heading, the avatar is skipped, and the search field is announced as a button named "Search, or ask Telli…"
