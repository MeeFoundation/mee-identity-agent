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
- **Chat message**: one message. A message from the user is a rounded bubble aligned to the end, on a dark brand surface with light text. A message from Telli follows the Telli reply in the Figma frame "Pod / Chat - 5" (Mee – Tellipod App v4.0.3, 919-30381). It is aligned to the start, next to Telli's avatar: a 32 px circle on the brand-soft surface, showing the Telli chat icon and aligned with the bottom of the message.
- **Telli bubble**: Telli's text, inside a Telli message. It is a white bubble with a 10 px radius and a hairline border, headed by "@Telli" in small semibold brand text, with the text below at base size. The bubble MAY carry attachments, such as chat action cards. Attachments are placed inside the bubble, below the text, stacked with a small gap. A bubble with attachments SHALL fill the width of the row.
- **Chat message status**: a small muted line under the user's latest message, end-aligned, for its delivery state, for example "Sending…" or "Sent", following the Mee Design System chat item "Me".
- **Chat typing indicator**: a small muted line, start-aligned, that names who is typing, for example "Telli is typing...", following the Mee Design System chat item "Typing message". The ellipsis SHALL animate unless the participant prefers reduced motion.
- **Chat suggestion chip**: a small rounded outlined button shown under Telli's bubble, with a leading plus and the suggested action's label. Activating it SHALL run the flow's action.
- **Chat composer**: a single rounded input row pinned below the conversation, with a placeholder (for example "Message Telli...") and a send button with a translated accessible label. The flow decides its text, whether the text can be edited, and what sending does. Sending SHALL be possible with the send button and with the Enter key, and SHALL do nothing while the text is empty.

The "@Telli" label SHALL come from the app's translations. Telli's avatar SHALL be decorative and hidden from assistive technology.

The conversation SHALL be anchored to the bottom of the content area, so the newest message sits just above the composer, as in the Figma frames. Messages SHALL be announced to assistive technology as a log when they appear.

#### Scenario: User and Telli messages
- **WHEN** a flow screen shows a message from the user followed by a message from Telli
- **THEN** the user's bubble is end-aligned on a dark surface. Below it, Telli's bubble is start-aligned and headed by "@Telli", with Telli's round avatar next to the bottom of the bubble

#### Scenario: Telli reply with cards
- **WHEN** a Telli message carries two chat action cards
- **THEN** both cards are inside Telli's bubble, below its text, one above the other, and the bubble fills the width of the row

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
The design system SHALL provide a chat action card, following the "Card-Cell-Details-Preview" cards Telli embeds in its replies in the Figma frame "Pod / Chat - 5" (919-30381). It is placed inside Telli's bubble, below Telli's text, and fills the bubble's width. It is a white card with a 16 px radius and the card shadow, and shows, from top to bottom:
- a header row with a 32 px gray circle holding an icon or a letter avatar, followed by the title in medium base text;
- zero or more rows, each separated from the row above by a hairline. Each row shows a small muted label above a medium value. A row MAY have an edit control, a pencil at its end, with a translated accessible name that includes the row's label;
- an optional status line, for example once the action has been carried out;
- an optional full-width outlined action button. The button MAY show a count badge after its label.

The flow SHALL decide the title, the icon or letter, the rows, which rows can be edited and what editing does, and the action's label, count and what it does. The flow SHALL be able to show the action as unavailable. A card MAY show a status line and a different action, for example once the action has been carried out.

#### Scenario: Card shows what Telli understood
- **WHEN** a Telli message carries a card with the title "Ginger", the row Category "Pets" and the action "Create pod"
- **THEN** the card is shown inside Telli's bubble with the letter avatar "G" in a gray circle and the title "Ginger". Below a hairline, the label "Category" is shown above "Pets", followed by an outlined "Create pod" button

#### Scenario: Form preview with edit and a counted action
- **WHEN** a Telli message carries a card with an icon, the title "Contact info", the editable row Mobile phone "555-0199", and the action "View suggested contact info" with the count 3
- **THEN** the row shows a pencil at its end, and the button shows "View suggested contact info" followed by a badge "3"

#### Scenario: Edit a row
- **WHEN** a participant activates the pencil of an editable row
- **THEN** the flow's edit action for that row runs

#### Scenario: Card without an action
- **WHEN** a Telli message carries a card with the title "Medical" and the row Blood type "0+", and no action
- **THEN** the card ends after the row and shows no button

#### Scenario: Unavailable action
- **WHEN** the flow marks a card's action as unavailable
- **THEN** the button is shown as unavailable and activating it does nothing

### Requirement: Chat empty state
The design system SHALL provide a chat empty state for a pod chat with no messages, following the Figma frame "Cell - Chat - 2" (Mee – Tellipod App v4.0.3, 117-4435). It SHALL be centred in the content area above the composer, and SHALL show, stacked and centred:
- the Telli chat icon at 40 px;
- the title "Be the first to write a message." in large regular text;
- the message "Everyone in this pod will see your messages." and "Tag @Telli if you need help." on two lines, in small muted text.

The texts SHALL come from the app's translations. The icon SHALL be decorative and hidden from assistive technology. The flow SHALL decide when the chat is empty. The composer SHALL stay available below the empty state.

#### Scenario: Empty pod chat
- **WHEN** a pod chat screen has no messages
- **THEN** the chat icon, "Be the first to write a message." and "Everyone in this pod will see your messages. Tag @Telli if you need help." are shown centred above the composer

#### Scenario: First message replaces the empty state
- **WHEN** a participant sends a message from an empty pod chat
- **THEN** the empty state is no longer shown, and the message is shown in the conversation anchored above the composer

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

### Requirement: Attachment row component
The design system SHALL provide an attachment row that summarises one attached file. It SHALL show a square, rounded icon tile with a light background and the flow's file icon, the file name, a smaller muted detail line, and a trailing "more actions" button with a vertical three-dot icon. A long file name SHALL be truncated on one line rather than wrap or push the "more actions" button out of the row.

The "more actions" button SHALL always be present and SHALL be a separate button from the rest of the row: activating it SHALL run only the flow's menu action. Its accessible name SHALL include the file name.

When the flow gives the row an open action, the rest of the row SHALL be one button whose accessible name includes the file name and the detail line, and activating it SHALL run only the open action. When the flow gives no open action, the rest of the row SHALL not be operable and SHALL not show hover or focus styling.

#### Scenario: More actions is a separate, named button
- **WHEN** a screen reader user reaches the attachment row for "funny-moment.mp4" with the detail line "10 MB · Aug 7"
- **THEN** a button named "More actions for funny-moment.mp4" is announced, and activating it runs only the flow's menu action

#### Scenario: Row with an open action
- **WHEN** the flow gives the attachment row for "photo-Sofia.jpg" an open action and a participant activates the row outside the "more actions" button
- **THEN** only the open action runs, and the row is announced as a button whose name includes "photo-Sofia.jpg" and "1.5 MB · Jun 19"

#### Scenario: Row without an open action
- **WHEN** the flow gives the attachment row no open action
- **THEN** the "more actions" button is the row's only control, and activating the rest of the row does nothing

#### Scenario: Long file name
- **WHEN** an attachment row shows a file name longer than the row is wide
- **THEN** the name is truncated with an ellipsis on one line and the "more actions" button stays fully visible

### Requirement: Attachment list component
The design system SHALL provide an attachment list: one white rounded card that holds the flow's attachment rows in the given order, with a horizontal divider between consecutive rows and none before the first or after the last. It SHALL be announced as a list whose items are the rows.

#### Scenario: Rows share one card
- **WHEN** an attachment list holds four attachment rows
- **THEN** the four rows are shown inside one white rounded card, separated by three dividers

#### Scenario: Announced as a list
- **WHEN** a screen reader user reaches an attachment list with four rows
- **THEN** it is announced as a list of four items

### Requirement: Sheet action list component
The design system SHALL provide a sheet action list for the content of a bottom sheet: a vertical list of actions, each one a full-width button with a leading icon and a label. An action SHALL have either the default tone, with dark gray icon and label, or the danger tone, with red icon and label. Activating an action SHALL run only that action's handler. Each action SHALL be announced as a button named by its label.

#### Scenario: Activating an action
- **WHEN** a sheet action list shows "Save to device", "Rename" and "Delete file" and a participant activates "Rename"
- **THEN** only the "Rename" handler runs

#### Scenario: Danger tone
- **WHEN** an action in a sheet action list has the danger tone
- **THEN** its icon and label are shown in red, and the other actions keep the default tone

### Requirement: Floating action button component
The design system SHALL provide a floating action button: a rounded button with the primary brand gradient, white leading icon and white label, and a drop shadow. It SHALL be pinned to the bottom-right of the flow screen above the home indicator and SHALL stay in place while the content behind it scrolls. It SHALL be announced as a button named by its label, and activating it SHALL run the flow's action.

#### Scenario: Pinned while scrolling
- **WHEN** a screen with a floating action button labelled "Add attachment" scrolls its content
- **THEN** the button stays at the bottom-right of the screen, above the home indicator

#### Scenario: Activating the button
- **WHEN** a participant activates the floating action button labelled "Add attachment"
- **THEN** the flow's action runs, and the button is announced as "Add attachment"

### Requirement: Pods section component
The design system SHALL provide a pods section for Home screens, following the pods section of app-tellipod (`app-tellipod/pods-section`). It SHALL take a state, the pods to show, and optional handlers for pressing a pod, "See all pods", "Add Pod", "Maybe later" and "Retry". It SHALL NOT fetch data or navigate. The state SHALL be one of `loading`, `ready` and `error`. A `ready` state with no pods is the first-run empty state.

With pods, in the `ready` state, the section SHALL show a header row above the pod cards. The header SHALL hold the label "Recent Pods" in uppercase at the left and, when a "See all pods" handler is supplied, a "See all pods" link with a trailing arrow at the right. The header and the cards SHALL be separated by 12 px, and the cards by 12 px. The section SHALL show at most the number of pods its limit allows, defaulting to 2.

Each pod card SHALL be one control on a white, rounded surface with the first-level shadow, showing from left to right:
- the pod's avatar image, or, when it has none, a gray circle with the first letter of the pod's name;
- the pod's name on one line, truncated when too long, with under it the pod's category breadcrumb: the category's icon and name, followed by the subcategory's name when the pod has one;
- a trailing chevron;
- a red unread dot on the card's top left corner, only when the pod has unread activity.

The card SHALL be announced as a button named with the pod's name, its category names and, when unread, "Unread". Pressing it SHALL call the pod handler with the pod.

In the `loading` state the section SHALL show the header and as many placeholder cards as its limit allows, each with a circular avatar block and two text blocks of different widths. The placeholders SHALL pulse, unless the participant's system asks for reduced motion, in which case they SHALL stay still. They SHALL be hidden from assistive technology and announced as a single busy region named "Loading pods".

In the `error` state the section SHALL show the header, the message "Couldn't load your pods." and a "Retry" button. Pressing "Retry" SHALL call the retry handler.

In the `ready` state with no pods the section SHALL show no header and no cards, and a "Create your first Pod" card instead. The card SHALL have a white rounded surface with the first-level shadow, and hold from top to bottom: a circular icon holder with a cookie icon; the title "Create your first Pod" above the explanation "A Pod is a private little room for any info — your kid, a trip, a project."; a full-width primary "Add Pod" button with a leading plus icon; and a full-width text button "Maybe later". When no "Add Pod" handler is supplied, the primary button SHALL NOT be shown. The icons SHALL be hidden from assistive technology.

Every string of the section SHALL come from the app's translations.

#### Scenario: Pods with a header
- **WHEN** a screen renders the section as `ready` with two pods and a "See all pods" handler
- **THEN** the header "RECENT PODS" and "See all pods" is shown above two pod cards

#### Scenario: No See all pods handler
- **WHEN** the section is rendered as `ready` with pods and no "See all pods" handler
- **THEN** the header shows "RECENT PODS" and no link

#### Scenario: Pod card contents
- **WHEN** the section shows the pod "Maya" in Pets, with an avatar image and unread activity
- **THEN** its card shows the avatar image, the name "Maya", the breadcrumb with the Pets icon and "Pets", a chevron and the unread dot

#### Scenario: Pod with a subcategory
- **WHEN** the section shows a pod in People with the subcategory Immediate family
- **THEN** its breadcrumb shows the People icon, "People" and "Immediate family"

#### Scenario: Pod without an avatar image
- **WHEN** the section shows the pod "About Sofia" with no avatar image
- **THEN** its card shows a gray circle with "A"

#### Scenario: Limit
- **WHEN** the section is given five pods and a limit of 2
- **THEN** two pod cards are shown

#### Scenario: Pod pressed
- **WHEN** a participant activates a pod card
- **THEN** the pod handler is called with that pod

#### Scenario: Loading
- **WHEN** the section is rendered as `loading` with a limit of 2
- **THEN** the header and two pulsing placeholder cards are shown, no pod, message or empty card is shown, and a screen reader hears one busy "Loading pods" region and none of the placeholders

#### Scenario: Loading with reduced motion
- **WHEN** the section is rendered as `loading` and the system asks for reduced motion
- **THEN** the placeholder cards are shown and do not pulse

#### Scenario: Error and retry
- **WHEN** the section is rendered as `error` and a participant activates "Retry"
- **THEN** the header, the message "Couldn't load your pods." and the "Retry" button are shown, and the retry handler is called

#### Scenario: First-run empty card
- **WHEN** the section is rendered as `ready` with no pods
- **THEN** no header and no pod card are shown, and the "Create your first Pod" card is shown with "Add Pod" and "Maybe later"

#### Scenario: Empty card without an Add Pod handler
- **WHEN** the empty card is shown and no "Add Pod" handler is supplied
- **THEN** the card shows the title, the explanation and "Maybe later", and no "Add Pod" button
