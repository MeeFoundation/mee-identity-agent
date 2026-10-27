## ADDED Requirements

### Requirement: Toast component
The shared Toast SHALL follow the Figma Toast component of the Mee Design System. It SHALL support the types `primary`, `secondary`, `tertiary`, `dark`, `success`, `danger` and `warning`, with `primary` as the default, each styled with the fill, border, icon, title, description and action colors of the Figma component, taken from the theme tokens, and with the Figma default icon of its type (info-circle, check-circle, exclamation-octagon or exclamation-triangle). It SHALL show a title and MAY show a description, an icon, an avatar, and up to two actions placed on the right or at the bottom. It SHALL show a close button that runs the flow's close action. The close button and each action SHALL be buttons with an accessible name, the close button's from the app's translations. The Toast SHALL be announced as a status message when it appears. Its parent SHALL decide its position and width.

Flows that pass only the existing props, `variant` of `primary` or `success`, `title`, `description`, one `action` and `onClose`, SHALL keep working without code changes and get a toast of the matching type, with its icon, title, optional description and action, and a close button.

#### Scenario: Existing flow toast unchanged
- **WHEN** a flow screen renders the Toast with `variant="success"`, a title and `onClose`
- **THEN** a success toast with the check-circle icon, the title and a close button is shown, and activating the close button runs `onClose`

#### Scenario: All types
- **WHEN** a Toast is rendered with each of the seven types
- **THEN** each shows its own fill, border, text, icon and action colors

#### Scenario: Actions
- **WHEN** a Toast is rendered with two actions placed at the bottom and a participant activates the first
- **THEN** only the first action's handler runs

#### Scenario: Close button is labelled
- **WHEN** a screen reader user moves to the Toast's close button
- **THEN** it is announced with its translated label
