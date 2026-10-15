## MODIFIED Requirements

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

## ADDED Requirements

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
