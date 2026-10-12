# app-ux-flows/design-system Specification

## Purpose

Defines the visual foundation of `app-ux-flows`. It covers the theme tokens taken from the Mee Design System and the shared UI components flows are built from. Every surface of the app looks consistent with the Mee mobile app.

## Requirements

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
The shared components SHALL keep the props that flows already pass to them: Button, TextField, Checkbox and Header. Existing flow screens and flow-specific components SHALL keep working without code changes to their screens. Flow-specific components and the flow completion view SHALL be styled with the theme tokens.

#### Scenario: Example flow runs unchanged
- **WHEN** a participant goes through the `exp-pet-002` flow in either variant
- **THEN** every screen uses the design system's tokens and components, and the shared Button keeps the props and defaults described above

### Requirement: Styled home page
The home page SHALL use the design system:
- a page header with the app title
- one section per flow kind that has flows, "Experiments" first and "Showcases" second, each with a section heading
- one card per registered flow inside its section, showing the flow's title, its description when declared, and its start or variant-choice actions as design-system Buttons
- in development builds, the flow's catalogue inside its card
- the "Start new test session" action as a design-system Button

The home page SHALL NOT be drawn inside the device frame. It SHALL keep the variant visibility rules of the flow runtime: variant choice only for explicit flows, and variant information and the catalogue only in development builds.

#### Scenario: Home page shows flow cards
- **WHEN** a participant opens the home page
- **THEN** each registered flow appears as a card in its kind's section, with its title, description and start actions, styled with the design system, and the page is not wrapped in a device frame

#### Scenario: Automatic flow card hides variant information
- **WHEN** a production build shows the home page and a flow uses automatic variant assignment
- **THEN** that flow's card shows a single start action and no variant names, assignment or catalogue

### Requirement: Pod top bar component
The shared pod top bar SHALL follow the Tellipod app's `home-topbar` design:
- a leading back control,
- the pod's avatar,
- the pod's title,
- a breadcrumb line of one or more segments separated by chevrons, with an optional leading icon,
- a trailing menu control.

It MAY contain a tab bar below this row. Each control SHALL be a button with an accessible label from the app's translations, and SHALL run the action the flow provides. The top bar SHALL NOT include a device status bar.

#### Scenario: Top bar with tabs
- **WHEN** a flow screen renders the pod top bar with a title, a breadcrumb and tabs
- **THEN** the back control, avatar, title, breadcrumb and menu control are shown in one row, and the tabs are shown below it

#### Scenario: Controls are labelled
- **WHEN** a screen reader user moves through the pod top bar
- **THEN** the back and menu controls are announced with their translated labels

### Requirement: Segmented tabs component
The shared segmented tabs SHALL show two or more equal-width tabs in a rounded track, with the selected tab raised on a white surface. Exactly one tab SHALL be selected, as decided by the flow. Activating a tab SHALL report that tab to the flow. The tabs SHALL be operable with the keyboard, and SHALL expose the tab role and selected state to assistive technology.

#### Scenario: Activating a tab
- **WHEN** a participant activates a tab that is not selected
- **THEN** the flow is told which tab was activated

#### Scenario: Keyboard navigation
- **WHEN** a tab has keyboard focus and the participant presses the right arrow key
- **THEN** focus moves to the next tab

### Requirement: Info list components
The design system SHALL provide the Info list building blocks of the Tellipod app:
- **Section label**: small uppercase muted text that names a section.
- **Empty-state card**: a white rounded card with a centred title and message, and an optional full-width "+ action" button below them.
- **Category row**: a white rounded row with an icon in a circle, a label, a count badge and a trailing chevron. It may also show an optional preview line in smaller muted text below the label. The whole row is a button whose accessible name includes the label, the count and, when shown, the preview line.
- **Record row**: a white rounded row that summarises one record. It has an icon in a circle, a title, an optional secondary line, an optional meta line in smaller muted text, and a trailing chevron. The whole row is a button whose accessible name includes the title and, when shown, the secondary and meta lines.
- **Divider**: a horizontal rule.

#### Scenario: Empty-state card action
- **WHEN** a participant activates the action of an empty-state card
- **THEN** the flow's action runs

#### Scenario: Category row is one button
- **WHEN** a screen reader user reaches a category row labelled Members with count 1
- **THEN** it is announced as one button whose name includes "Members" and "1"

#### Scenario: Category row preview
- **WHEN** a category row labelled Medical with count 1 has the preview line "Clavamox · 2 times per day"
- **THEN** the preview is shown below "Medical", and the row is announced as one button whose name includes "Medical", "1" and "Clavamox · 2 times per day"

#### Scenario: Category row without preview
- **WHEN** a category row is given no preview line
- **THEN** it looks and is announced as before, with no empty line below the label

#### Scenario: Record row is one button
- **WHEN** a screen reader user reaches a record row titled Clavamox with the secondary line "62.5 mg · 2 times per day" and the meta line "Started Oct 6, 2026"
- **THEN** it is announced as one button whose name includes all three, and activating it runs the flow's action

### Requirement: Bottom sheet component
The shared bottom sheet SHALL slide up from the bottom of the flow screen over the current content when it opens, including when its screen is opened directly, and SHALL slide back down when it is dismissed, before the flow's dismiss action runs. While it is open, the content behind it SHALL be dimmed by a dark, semi-transparent backdrop that fades in as the sheet opens and fades out as it closes. It SHALL contain a grabber, a title, an optional description and the flow's content. It SHALL be modal:
- focus moves into it when it opens and stays inside it while it is open,
- the content behind it cannot be operated,
- it is announced as a dialog with its title.

Pressing Escape or activating the backdrop, that is, tapping outside the sheet, SHALL run the flow's dismiss action.

#### Scenario: Dismiss with Escape
- **WHEN** a bottom sheet is open and the participant presses Escape
- **THEN** the flow's dismiss action runs

#### Scenario: Background is not operable
- **WHEN** a bottom sheet is open
- **THEN** buttons behind the sheet cannot be activated by pointer or keyboard

#### Scenario: Background is dimmed
- **WHEN** a bottom sheet is open
- **THEN** the content behind it is shown under a dark, semi-transparent backdrop, and the sheet itself is not dimmed

#### Scenario: Sheet slides in and out
- **WHEN** a bottom sheet's screen is shown
- **THEN** the sheet starts below the bottom edge of the screen and slides up into place
- **WHEN** the participant then dismisses it
- **THEN** the sheet slides down out of view, and only then does the flow's dismiss action run

### Requirement: Select field component
The shared select field SHALL show a visible label above a closed control that displays the selected option and a chevron, styled after the Figma Text Field component. The label SHALL be associated with the control. Opening it SHALL list the options, and an option SHALL be selectable with pointer or keyboard. An option MAY be marked unavailable: it is shown but cannot be selected.

#### Scenario: Choose an option
- **WHEN** a participant opens the select and chooses an available option
- **THEN** the control shows that option and the flow receives its value

#### Scenario: Unavailable option
- **WHEN** a participant tries to choose an option marked unavailable
- **THEN** the selection does not change

### Requirement: Form card component
The shared form card SHALL show a header row containing an icon in a circle, the form's title and a chevron control that collapses and expands the card. The header row SHALL expose its expanded state to assistive technology. When expanded, the card SHALL show its field rows and optional footer actions. Each field row SHALL show a small label above its value. A field row given an edit action SHALL show a trailing edit button, whose accessible label SHALL include the field label. A field row given no edit action is read-only and SHALL show no edit button.

#### Scenario: Collapse and expand
- **WHEN** a participant activates the header of an expanded form card
- **THEN** the field rows are hidden and the header reports the collapsed state, and activating it again shows them

#### Scenario: Edit button label
- **WHEN** a screen reader user reaches the edit button of the Brand name row
- **THEN** it is announced with a translated label that includes "Brand name"

#### Scenario: Read-only field row
- **WHEN** a field row labelled Dose is given no edit action
- **THEN** it shows "Dose" and its value, and no edit button is shown or reachable by keyboard

### Requirement: AI suggestion component
The shared AI suggestion SHALL be a single button on a brand-tinted surface. It shows a sparkle icon, a small caption (for example "AI Suggestion") and the suggested action's label. Activating it SHALL run the flow's action.

#### Scenario: Accept a suggestion
- **WHEN** a participant activates an AI suggestion
- **THEN** the flow's action runs

### Requirement: Chat components
The design system SHALL provide the chat building blocks of the Tellipod pod chat:
- **Chat message**: a rounded bubble for one message. A message from the user is aligned to the end on a dark brand surface with light text. A message from Telli is aligned to the start on a light surface, next to Telli's round avatar.
- **Chat message status**: a small muted line under the user's latest message, end-aligned, for its delivery state, for example "Sending…" or "Sent", following the Mee Design System chat item "Me".
- **Chat typing indicator**: a small muted line, start-aligned, that names who is typing, for example "Telli is typing...", following the Mee Design System chat item "Typing message". The ellipsis SHALL animate unless the participant prefers reduced motion.
- **Chat suggestion chip**: a small rounded outlined button shown under a Telli message, with a leading plus and the suggested action's label. Activating it SHALL run the flow's action.
- **Chat composer**: a single rounded input row pinned below the conversation, with a placeholder (for example "Message Telli...") and a send button with a translated accessible label. The flow decides its text, whether the text can be edited, and what sending does. Sending SHALL be possible with the send button and with the Enter key, and SHALL do nothing while the text is empty.

The conversation SHALL be anchored to the bottom of the content area, so the newest message sits just above the composer, as in the Figma frames. Messages SHALL be announced to assistive technology as a log when they appear.

#### Scenario: User and Telli messages
- **WHEN** a flow screen shows a message from the user followed by a message from Telli
- **THEN** the user's bubble is end-aligned on a dark surface, and Telli's bubble is start-aligned with Telli's avatar, below it

#### Scenario: Waiting for a reply
- **WHEN** a flow shows the user's message with the status "Sent" and the typing indicator for Telli
- **THEN** "Sent" is shown under the user's bubble, and "Telli is typing..." below it, in small muted text

#### Scenario: Activate a suggestion chip
- **WHEN** a participant activates a chat suggestion chip
- **THEN** the flow's action runs

#### Scenario: Send from the composer
- **WHEN** the composer holds text and the participant presses Enter or activates the send button
- **THEN** the flow's send action runs once

#### Scenario: Empty composer does not send
- **WHEN** the composer is empty and the participant activates the send button
- **THEN** the flow's send action does not run
