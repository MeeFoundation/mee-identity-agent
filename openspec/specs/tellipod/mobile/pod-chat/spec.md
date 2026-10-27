# tellipod/mobile/pod-chat Specification

## Purpose

Defines how the Tellipod mobile app lets a person write in a pod's chat, direct a message at a member, work with their own agent privately, and act on what an agent reports. Messages reach other members through the node; the app sends them and shows what the node reports. Inviting an agent is in `mobile/members`. What happens to chat while a device or another member is offline is open (see open question 14) and is not specified here. Whether an agent offers a list the person must choose from before anything is added is open (see open question 57) and is not specified here.

## Requirements

### Requirement: One shared stream
The app SHALL show a pod's chat as one stream of messages shared with every member, and SHALL post a new message to it by default. A message SHALL be shown with its time and its state, and SHALL appear in the stream as sent only once the node confirms it.

#### Scenario: Message sent
- **GIVEN** a pod with three members
- **WHEN** the person sends a message and the node confirms it
- **THEN** the message appears in the stream marked as sent, and the other members see it

#### Scenario: Message from another member
- **GIVEN** a pod open on the device
- **WHEN** the node reports a message from another member
- **THEN** it appears in the stream without the person asking

#### Scenario: Node unavailable
- **GIVEN** the node is unavailable
- **WHEN** the person sends a message
- **THEN** the message is not shown as sent and the person is told the node is unavailable

### Requirement: Directed messages
The app SHALL let a person direct a message at a named member, a person or a service, by naming that member in the message. A directed message SHALL stay in the shared stream and SHALL be shown to every member, together with any reply.

#### Scenario: Message directed at an agent
- **GIVEN** a pod whose members include Alice and her agent
- **WHEN** Alice directs a message at her agent
- **THEN** every member sees the message and the agent's reply in the shared stream

#### Scenario: Naming a member
- **GIVEN** a person typing a message
- **WHEN** they name a member of the pod
- **THEN** the app offers the pod's members to choose from and shows the chosen member as the one the message is directed at

### Requirement: Private thread with own agent
The app SHALL let a person talk with their own agent in a private thread. The thread SHALL be shown only to that person, SHALL NOT be part of the pod's chat, and SHALL NOT be shown to any other member. A change the agent commits to the pod from the thread SHALL be shown to the other members as an ordinary change to the pod, without the thread.

#### Scenario: Private request
- **GIVEN** Alice in a private thread with her agent
- **WHEN** she asks it to add a file to the pod and it does
- **THEN** the other members see the new attachment and do not see the thread

### Requirement: Agent replies report what changed
When an agent changes a pod in reply to a message, the app SHALL show in the reply each change it made, naming the field and its new value, and SHALL offer to open the pod's full information. The reply SHALL be attributed to the agent as the claimant of the claims it made (`mobile/claims-and-forms`, Claimant is shown).

#### Scenario: Agent adds information
- **GIVEN** a person who asked their agent to add an allergy, a phone number and a blood type to a pod
- **WHEN** the agent replies
- **THEN** the reply lists the three fields with their values, attributed to the agent, and offers to open the pod's full information

#### Scenario: Edit offered only where allowed
- **GIVEN** an agent's reply listing fields it added
- **WHEN** the person views a field they may not edit under `mobile/members` (Own claims only)
- **THEN** the app does not offer to edit it

### Requirement: Agents act within the principal's access
The app SHALL show a refusal the node reports when an agent's action in a pod is not allowed, and SHALL NOT show the change as made. An agent's access SHALL be treated as equal to its principal's (`mobile/members`).

#### Scenario: Action refused
- **GIVEN** an agent asked to change something its principal may not change
- **WHEN** the node refuses the change
- **THEN** the agent's reply says it was not allowed and no change is shown
