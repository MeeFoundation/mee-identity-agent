## ADDED Requirements

### Requirement: App tab bar component
The design system SHALL provide the Tellipod app tab bar, following the Figma component `bottom-menu`. It is a rounded bar pinned to the bottom of the screen, above the home indicator, with three tabs: Home, Ask Telli and Navigation. Each tab has an icon and a label, and the active tab is highlighted. The flow SHALL decide which tab is active and what activating each tab does. Screens SHALL opt into the bar; it SHALL NOT be shown on screens that do not render it. The bar SHALL be announced as navigation, and the active tab as the current page.

#### Scenario: Active tab
- **WHEN** a screen renders the tab bar with Ask Telli active
- **THEN** Ask Telli is highlighted and announced as the current page, and Home and Navigation are not

#### Scenario: Tab activation runs the flow's action
- **WHEN** a participant activates the Home tab
- **THEN** the flow's Home action runs

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
