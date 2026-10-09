## MODIFIED Requirements

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

## ADDED Requirements

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
