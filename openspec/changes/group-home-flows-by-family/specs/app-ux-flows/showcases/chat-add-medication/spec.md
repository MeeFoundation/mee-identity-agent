## MODIFIED Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `chat-add-medication`, title "Add medication from chat" and the description "Tell Telli about a medication in the pod chat and add it as a form in one tap." It SHALL have the display code `SC-PET-005` and no variants. On the home page it SHALL be listed after SC-PET-004, in the SC-PET family.

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

#### Scenario: Display code
- **WHEN** a development build shows the home page
- **THEN** "Add medication from chat" shows the code `SC-PET-005` and is listed after SC-PET-004 in the showcases' "Pet care" group
