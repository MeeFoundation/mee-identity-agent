# app-ux-flows/showcases/chat-add-medication Specification

## Purpose

Defines the showcase "Add medication from chat" in `app-ux-flows`. It demonstrates adding a pet's medication from the pod chat: the user tells Telli about a medication, Telli offers to add it, and one tap adds the Medication form to the pod's Info tab. It is a clickable demo for stakeholders, not an experiment, so it has no variants and records no analytics.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `chat-add-medication`, title "Add medication from chat" and the description "Tell Telli about a medication in the pod chat and add it as a form in one tap." It SHALL have no display code and no variants.

The flow SHALL declare these screens:
- `ginger-notes`: the pod's Notes tab.
- `chat`: the pod's Chat tab with the conversation with Telli.
- `ginger-info`: the pod's Info tab.
- `medication-added`: the Info tab after the Medication form was added.

`ginger-notes` SHALL be the initial screen. Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame |
|---|---|
| `ginger-notes` | EXP-PET-002-B - Ginger (notes) |
| `chat` | EXP-PET-002-C - Telli suggests adding medication |
| `medication-added` | EXP-PET-002-C - Medication added |

`ginger-info` has no Figma frame of its own and SHALL NOT declare one.

#### Scenario: Start the showcase
- **WHEN** a viewer starts "Add medication from chat" from the home page
- **THEN** the Ginger pod's Notes tab is shown at `/flows/chat-add-medication/ginger-notes`, with no `variant` URL parameter

### Requirement: Showcase pod and medication record
A run SHALL start from the same Ginger pod fixture and the same default medication record as EXP-PET-002 (`app-ux-flows/experiments/exp-pet-002`, "Pod fixture and server-provided medication record"). As in EXP-PET-002, the record SHALL be replaceable through the flow's initial state, and no screen SHALL fetch data. At run start the Medication form SHALL NOT yet be added, and the chat SHALL hold no messages.

#### Scenario: Fresh run
- **WHEN** a viewer opens `/flows/chat-add-medication/chat` in a new run
- **THEN** the conversation is empty and the composer holds the scripted message

### Requirement: Showcase pod tabs
Every screen SHALL show the pod top bar with the Ginger avatar, the title "Ginger", the breadcrumb, back and menu controls, and three tabs: Notes, Chat and Info. Activating Notes SHALL show `ginger-notes`, activating Chat SHALL show `chat`, and activating Info SHALL show `ginger-info`. The back and menu controls SHALL do nothing. The tab for the current screen SHALL be shown as selected. On `medication-added` that is Info.

#### Scenario: Open the chat
- **WHEN** a viewer on `ginger-notes` activates the Chat tab
- **THEN** `chat` is shown with the Chat tab selected

#### Scenario: Chat state survives tab switches
- **WHEN** a viewer sends the message, switches to Notes, then back to Chat
- **THEN** the conversation still shows the sent message and Telli's reply

### Requirement: Showcase notes tab
`ginger-notes` SHALL show the same note area and formatting toolbar as EXP-PET-002's Notes tab ("Notes tab" in `app-ux-flows/experiments/exp-pet-002`). Typing SHALL be possible, the text SHALL be kept for the rest of the run, and the toolbar buttons SHALL do nothing.

#### Scenario: Notes placeholder
- **WHEN** a viewer opens `ginger-notes` in a new run
- **THEN** the note area is empty and shows the same placeholder as EXP-PET-002

### Requirement: Scripted chat exchange
`chat` SHALL show the conversation above a chat composer with the placeholder "Message Telli...". The exchange SHALL be scripted:
1. Before sending, the conversation is empty and the composer holds the message "Ginger needs Clavamox twice a day". The viewer cannot edit this text.
2. When the viewer sends it, the message appears at once as the user's bubble with the status "Sending…" under it, and the composer is emptied and shows its placeholder.
3. About 0.8 seconds later, the status changes to "Sent" and the typing indicator "Telli is typing..." appears below the user's bubble.
4. About 2.5 seconds after that, the typing indicator is replaced by Telli's reply: "Got it — I can add this to Ginger's medications.", with a "+ Add medication?" suggestion chip under it. The "Sent" status stays.

The delays SHALL make the exchange feel like a real round trip to Telli, about 3.3 seconds from sending to the reply. Each step SHALL happen at most once per run. If the viewer leaves `chat` before Telli's reply appears, the exchange SHALL resume from its current step when they return, and the reply SHALL still appear. Sending SHALL NOT be possible after the message was sent. No other message SHALL be sent or received. The message texts are fixed copy from the app's translations.

#### Scenario: Send the scripted message
- **WHEN** a viewer on `chat` activates send
- **THEN** "Ginger needs Clavamox twice a day" is shown as the user's bubble with "Sending…" under it, and the composer shows "Message Telli..."

#### Scenario: Telli is typing
- **WHEN** about 0.8 seconds have passed after sending
- **THEN** the status under the user's bubble reads "Sent", and "Telli is typing..." is shown below it, without Telli's reply or the chip

#### Scenario: Telli suggests adding the medication
- **WHEN** about 3.3 seconds have passed after sending
- **THEN** "Telli is typing..." is gone, and Telli's reply "Got it — I can add this to Ginger's medications." is shown with the "+ Add medication?" chip

#### Scenario: Reply after returning
- **WHEN** a viewer sends the message and switches to Notes before Telli replies, then returns to Chat
- **THEN** Telli's reply with the chip is shown, and the user's message is shown once

### Requirement: Adding the medication from chat
Activating "+ Add medication?" SHALL add the Medication form to the pod and show `medication-added`. Once the form has been added, the chip SHALL no longer be shown in the conversation, and Telli's message stays. Adding SHALL be idempotent: returning to the chat or to `medication-added` SHALL never add a second form.

#### Scenario: One tap adds the form
- **WHEN** a viewer activates "+ Add medication?"
- **THEN** `medication-added` is shown with the Info tab selected and the Medication form card for the run's record

#### Scenario: Chip is gone after adding
- **WHEN** after adding, the viewer activates the Chat tab
- **THEN** the conversation shows both messages and no suggestion chip

### Requirement: Showcase Info tab
`ginger-info` SHALL show, in this order: a "Forms" section label; while the form has not been added, the same empty-state card as EXP-PET-002 but without the "+ Add form" action, and once it has been added, the Medication form card; a divider; and the category rows Medical 0, Attachments 0, Subpods 0 and Members 1. The category rows SHALL do nothing.

`medication-added` SHALL show the Info tab with the Medication form added. The Medication form card, its field order and formats, and its inert controls SHALL match "Medication form display" in `app-ux-flows/experiments/exp-pet-002`. Opening `medication-added` directly by URL SHALL show the added form.

#### Scenario: Info before adding
- **WHEN** a viewer activates the Info tab before adding the medication
- **THEN** the Forms section shows the empty state with no add action, and no AI suggestion is shown

#### Scenario: Direct link to the result
- **WHEN** someone opens `/flows/chat-add-medication/medication-added` in a new run
- **THEN** the Info tab is shown with the Medication form added

### Requirement: Showcase completion
Reaching `medication-added` SHALL complete the run silently: the screen stays visible and no completion view is shown. This SHALL also apply when `medication-added` is opened directly by URL. The viewer can keep switching tabs after completion. The run SHALL be completed at most once.

#### Scenario: Completion keeps the result visible
- **WHEN** a viewer adds the medication from the chat
- **THEN** `medication-added` stays on screen, and switching to Chat or Notes afterwards works normally
