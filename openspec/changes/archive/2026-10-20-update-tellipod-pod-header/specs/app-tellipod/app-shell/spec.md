## REMOVED Requirements

### Requirement: Header variants
**Reason**: The `back-title` variant is replaced by `back-search`, so the variant set and its scenarios change; the requirement is re-stated under a new name.

**Migration**: See "Header variant set" below. Screens that declared `back-title` declare `back-search`.

## MODIFIED Requirements

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

## ADDED Requirements

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
