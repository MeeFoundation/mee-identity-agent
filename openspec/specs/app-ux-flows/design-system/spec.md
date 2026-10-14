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
The shared TextField SHALL show a visible label above the input and SHALL associate the label with the input for assistive technology. Its default, hover, focus and disabled appearances SHALL follow the Figma Text Field component. The value the participant types SHALL be reported to the flow on every change, as today. A flow MAY ask for a number or a date input instead of plain text. The value is still reported as text, and a date as `YYYY-MM-DD`.

#### Scenario: Label is associated with the input
- **WHEN** a participant clicks the TextField's label
- **THEN** keyboard focus moves into the input

#### Scenario: Typing updates flow state
- **WHEN** a participant types into a TextField on a flow screen
- **THEN** the flow receives each new value and the input shows the focused appearance from the design system

#### Scenario: Number input
- **WHEN** a flow asks for a number TextField labelled "Dose (mg)"
- **THEN** it is announced as a spin button named "Dose (mg)" and offers a numeric keyboard on touch devices

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
- one section per flow kind that has flows, "Showcases" first and "Experiments" second, each with a section heading that shows its flow count
- inside each section, one dense list row per registered flow, separated by dividers within one bordered surface rather than drawn as separate cards
- in each row: the flow's display code in development builds, its title, its description when declared, shortened to a single line, and its start, variant-choice or case-choice actions as small design-system Buttons laid out side by side
- in development builds, the flow's catalogue inside its row, collapsed until opened
- the "Start new test session" action as a design-system Button

At widths where the actions do not fit beside the title, they SHALL wrap below it inside the same row, without horizontal scrolling. The full description SHALL be available on demand when it is shortened.

The home page SHALL NOT be drawn inside the device frame. It SHALL keep the variant visibility rules of the flow runtime: variant choice only for explicit flows, and variant information and the catalogue only in development builds.

#### Scenario: Home page shows flow cards
- **WHEN** a participant opens the home page
- **THEN** each registered flow appears as a row in its kind's section, with its title, a one-line description and its start actions, styled with the design system, and the page is not wrapped in a device frame

#### Scenario: Rows stay compact
- **WHEN** a development build shows a flow with three variants and a catalogue
- **THEN** its row, with the catalogue collapsed, is no taller than two lines of text plus the actions, and the variant descriptions are not shown until requested

#### Scenario: Narrow screens
- **WHEN** the home page is shown 375 pixels wide
- **THEN** each row's actions wrap below its title and the page does not scroll horizontally

#### Scenario: Automatic flow card hides variant information
- **WHEN** a production build shows the home page and a flow uses automatic variant assignment
- **THEN** that flow's row shows a single start action and no variant names, assignment or catalogue

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

The flow SHALL be able to mark any tab with a dot, meaning something is waiting on that tab. The dot SHALL be drawn beside the tab's label in the primary action colour and SHALL be announced to assistive technology as part of the tab's name. A tab without a mark SHALL look as it does today.

#### Scenario: Activating a tab
- **WHEN** a participant activates a tab that is not selected
- **THEN** the flow is told which tab was activated

#### Scenario: Keyboard navigation
- **WHEN** a tab has keyboard focus and the participant presses the right arrow key
- **THEN** focus moves to the next tab

#### Scenario: Marked tab
- **WHEN** the flow marks the Info tab
- **THEN** a dot is shown beside "Info", assistive technology announces that something new is waiting there, and the other tabs are unchanged

### Requirement: Info list components
The design system SHALL provide the Info list building blocks of the Tellipod app:
- **Section label**: small uppercase muted text that names a section.
- **Empty-state card**: a white rounded card with a centred title and message, and an optional full-width "+ action" button below them.
- **Category row**: a white rounded row with an icon in a circle, a label, a count badge and a trailing chevron. It may also show an optional preview line in smaller muted text below the label. The whole row is a button whose accessible name includes the label, the count and, when shown, the preview line.
- **Record row**: a white rounded row that summarises one record. It has an icon in a circle, a title, an optional secondary line, an optional meta line in smaller muted text, and a trailing chevron. The whole row is a button whose accessible name includes the title and, when shown, the secondary and meta lines. A record row may also have an optional action. The action is a text control shown below the row's lines, inside the same white rounded card. It is a separate button from the row: activating it runs only the action. Activating the row runs only the row's action.
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

#### Scenario: Record row action
- **WHEN** a record row titled Apoquel has the action "Edit medication" and a participant activates that action
- **THEN** only the action's handler runs, the row's own action does not, and the action is announced as a separate button named "Edit medication"

#### Scenario: Record row without action
- **WHEN** a record row is given no action
- **THEN** it looks and is announced as before, with no empty space below its lines

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
The shared form card SHALL show a header row containing an icon in a circle, the form's title and a chevron control that collapses and expands the card. The header row SHALL expose its expanded state to assistive technology. When expanded, the card SHALL show its field rows and optional footer actions. Each field row SHALL show a small label above its value. A field row given an edit action SHALL show a trailing edit button, whose accessible label SHALL include the field label. A field row given no edit action is read-only and SHALL show no edit button. A field row MAY be given an editor while its field is being edited. It then shows the editor in place of its label, value and edit button, and keeps the field label available to assistive technology.

#### Scenario: Collapse and expand
- **WHEN** a participant activates the header of an expanded form card
- **THEN** the field rows are hidden and the header reports the collapsed state, and activating it again shows them

#### Scenario: Edit button label
- **WHEN** a screen reader user reaches the edit button of the Brand name row
- **THEN** it is announced with a translated label that includes "Brand name"

#### Scenario: Read-only field row
- **WHEN** a field row labelled Dose is given no edit action
- **THEN** it shows "Dose" and its value, and no edit button is shown or reachable by keyboard

#### Scenario: Field row in edit mode
- **WHEN** a field row labelled Dose is given an editor
- **THEN** the editor is shown where the value and edit button were, inside the same card

### Requirement: Radio group field component
The shared radio group field SHALL show a visible label above a vertical list of options. Each option has a radio indicator and a label, and exactly one option is selected. It SHALL be announced as a radio group named by its label. An option SHALL be selectable by pointer, by activating its label, or by keyboard: arrow keys move the selection within the group, and Tab enters and leaves the group as one stop. A selected option SHALL use the brand colour, and focus SHALL show the design system's focus ring. Selecting an option SHALL give the flow its value.

#### Scenario: Choose an option
- **WHEN** a participant activates the label "2 times per day" in a radio group labelled Schedule
- **THEN** that option becomes selected, the previously selected one is cleared, and the flow receives its value

#### Scenario: Keyboard selection
- **WHEN** a keyboard user tabs into the group and presses the down arrow
- **THEN** the next option becomes selected and focused, and a further Tab leaves the group

#### Scenario: Announced as a group
- **WHEN** a screen reader user reaches the group
- **THEN** it is announced as a radio group named "Schedule", with the selected option and the number of options

### Requirement: Inline field editor component
The shared inline field editor SHALL hold one field's input in place, followed by a "Save" and a "Cancel" action in one row. On opening, focus SHALL move to its first control. "Save" MAY be made unavailable by the flow, for example while the value is unchanged or invalid. Pressing Enter in a text, number or date input SHALL save when "Save" is available. The editor itself SHALL NOT change any data: Save and Cancel only report to the flow.

#### Scenario: Focus on open
- **WHEN** an inline field editor holding a TextField is shown
- **THEN** keyboard focus is in the TextField

#### Scenario: Enter saves
- **WHEN** a participant presses Enter in its TextField while "Save" is available
- **THEN** the flow's save action runs

#### Scenario: Save unavailable
- **WHEN** the flow marks "Save" unavailable and a participant presses Enter
- **THEN** nothing is saved and "Save" cannot be activated

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

### Requirement: Chat action card component
The design system SHALL provide a chat action card, following the cards Telli embeds in its replies in the Figma pod chat ("Pod / Chat - 5"). It is placed inside a Telli message, below Telli's text, and shows:
- an icon or a letter avatar with a title;
- zero or more rows, each with a small muted label and a value;
- one full-width action button.

The flow SHALL decide the title, the rows, the action's label and what it does, and SHALL be able to show the action as unavailable. A card MAY instead show a status line and a different action, for example once the action has been carried out.

#### Scenario: Card shows what Telli understood
- **WHEN** a Telli message carries a card with the title "Ginger", the rows Category "Pets" and the action "Create pod"
- **THEN** the card is shown inside Telli's message with the letter avatar "G", the title "Ginger", the label "Category" above "Pets", and a "Create pod" button

#### Scenario: Unavailable action
- **WHEN** the flow marks a card's action as unavailable
- **THEN** the button is shown as unavailable and activating it does nothing
