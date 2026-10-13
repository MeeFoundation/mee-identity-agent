## Purpose

Defines the visual foundation of `app-ux-flows`. It covers the theme tokens taken from the Mee Design System and the shared UI components flows are built from. Every surface of the app looks consistent with the Mee mobile app.

## ADDED Requirements

### Requirement: Theme tokens from the Mee Design System
The app SHALL define one set of theme tokens whose values match the Mee Design System v5.2.2 Figma file:
- **Colour scales:** brand, gray, error, warning, success, orange and purple, each with steps 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 and 950, plus white and black.
- **Font:** Public Sans.
- **Text styles:** sizes with matching line heights XS 12/16, SM 14/20, Base 16/24, LG 18/28, XL 20/30, 2XL 24/32, 3XL 30/40, 4XL 36/44, 5XL 48/60 and 7XL 72/80. Weights regular 400, medium 500, semibold 600 and bold 700. Letter-spacing 0.5% of the font size.
- **Spacing:** a 4px base scale.
- **Radius and focus:** corner radii of 2px (small), 8px (large), 12px (XL) and 16px (2XL), and a 3px focus ring.

App UI SHALL take colours, type, spacing, radii and focus rings from these tokens instead of hard-coded values. The tokens SHALL also expose semantic roles: page background, body text, primary action, destructive action, border, muted surface, and focus ring. Components SHALL use these roles rather than raw scale steps where a role applies.

#### Scenario: Brand colour matches Figma
- **WHEN** a primary filled button is rendered
- **THEN** its background is the design system's brand button gradient, from brand 700 (`#3b5b63`) to brand 500 (`#4f868e`), and its focus ring is 3px wide

#### Scenario: Body text uses the design system font
- **WHEN** any page of the app is rendered
- **THEN** body text is set in Public Sans with the Base text style (16px size, 24px line height) and the body text colour from the design system

#### Scenario: Font is available offline
- **WHEN** the production build is served without access to third-party font services
- **THEN** text still renders in Public Sans, because the font files are part of the app's static assets

### Requirement: Button component
The shared Button SHALL support the design system's sizes:
- S (30px high)
- M (36px high)
- L (44px high)
- XXL (56px high)

It SHALL support the styles filled, outlined and link, and the tones primary, secondary, tertiary and danger. Every combination SHALL have distinct default, hover, keyboard-focus and disabled appearances that follow the Figma Button component. A disabled button SHALL NOT respond to activation. Flows that pass only a label, an action and an optional disabled flag SHALL get the default Button: size M, filled, primary.

#### Scenario: Default button used by an existing flow
- **WHEN** a flow screen renders the shared Button with only a label and an action
- **THEN** a filled primary button of size M is shown and activating it runs the action

#### Scenario: Disabled button
- **WHEN** the shared Button is rendered disabled and the participant clicks it or presses Enter on it
- **THEN** the action does not run and the button shows the disabled appearance

#### Scenario: Keyboard focus is visible
- **WHEN** a participant moves keyboard focus onto a Button
- **THEN** the button shows the design system's 3px focus ring

### Requirement: Text field component
The shared TextField SHALL show a visible label above the input and SHALL associate the label with the input for assistive technology. Its default, hover, focus and disabled appearances SHALL follow the Figma Text Field component. The value the participant types SHALL be reported to the flow on every change, as today.

#### Scenario: Label is associated with the input
- **WHEN** a participant clicks the TextField's label
- **THEN** keyboard focus moves into the input

#### Scenario: Typing updates flow state
- **WHEN** a participant types into a TextField on a flow screen
- **THEN** the flow receives each new value and the input shows the focused appearance from the design system

### Requirement: Checkbox component
The shared Checkbox SHALL show a box and a visible label. Clicking either SHALL toggle it. Its unchecked, checked, hover, keyboard-focus and disabled appearances SHALL follow the Figma Checkbox component. It SHALL be operable with the keyboard and expose its checked state to assistive technology.

#### Scenario: Toggle by clicking the label
- **WHEN** a participant clicks the label of an unchecked Checkbox
- **THEN** it becomes checked, shows the checked appearance, and the flow receives `true`

#### Scenario: Toggle with the keyboard
- **WHEN** a Checkbox has keyboard focus and the participant presses Space
- **THEN** its checked state toggles and the flow receives the new value

### Requirement: Screen header component
The shared Header SHALL follow the design system's mobile app top bar for a regular page:
- a centred title in the top bar's text style
- when the flow provides a back action, a back control at the leading edge with an accessible label taken from the app's translations

The Header SHALL NOT include a device status bar. The status bar belongs to the device frame.

#### Scenario: Header with back action
- **WHEN** a flow screen renders the Header with a title and a back action
- **THEN** the title is shown centred, and activating the leading back control runs the back action

#### Scenario: Header without back action
- **WHEN** a flow screen renders the Header with only a title
- **THEN** the title is shown and no back control is rendered

### Requirement: Existing component contracts preserved
The shared components SHALL keep the props that flows already pass to them: Button, TextField, Checkbox and Header. Existing flow screens and flow-specific components SHALL keep working without code changes to their screens. Flow-specific components, such as the example flow's pet card and quick actions, and the flow completion view SHALL be styled with the theme tokens.

#### Scenario: Example flow runs unchanged
- **WHEN** a participant completes the `add-medication` flow in any of its variants after this change
- **THEN** every screen, navigation step and state update behaves as before, and all screens use the design system's styling

### Requirement: Styled home page
The home page SHALL use the design system:
- a page header with the app title
- one card per registered flow, showing the flow's title and its start or variant-choice actions as design-system Buttons
- the "Start new test session" action as a design-system Button

The home page SHALL NOT be drawn inside the device frame. It SHALL keep the variant visibility rules of the flow runtime: variant choice only for explicit flows, and assigned variants only in development builds.

#### Scenario: Home page shows flow cards
- **WHEN** a participant opens the home page
- **THEN** each registered flow appears as a card with its title and start actions, styled with the design system, and the page is not wrapped in a device frame

#### Scenario: Automatic flow card hides variant information
- **WHEN** a production build shows the home page and a flow uses automatic variant assignment
- **THEN** that flow's card shows a single start action and no variant names or assignment
