# tellipod/mobile/pod-attachments Specification

## Purpose

Defines how the Tellipod mobile app handles the files of a pod: attachments, which every member receives, and private files, which stay with one member. Who may delete an attachment is in `mobile/members` (Own attachments). How files travel between members is the node's work; the app adds a file and shows what the node reports.

## Requirements

### Requirement: Attachments are shared, private files are not
The app SHALL show a pod's attachments to every member, as a flat set with no folders. The app SHALL show a member's private files only to that member, on that member's own devices, and SHALL NOT present them to any other member. The app SHALL preserve the member's organization of private files and SHALL NOT flatten them into the pod's attachments.

#### Scenario: Attachment added
- **GIVEN** a pod with three members
- **WHEN** one member adds an attachment and the node confirms it
- **THEN** all three members see it in the pod's attachments

#### Scenario: Private file
- **GIVEN** a member who adds a file without attaching it
- **WHEN** another member views the pod
- **THEN** the other member does not see the file

#### Scenario: Organized private files
- **GIVEN** a member's private file is in a private folder
- **WHEN** the member views the pod on another of their devices
- **THEN** the file remains in that private folder and is not among the flat attachments

### Requirement: Attach a private file
The app SHALL let a member add a file to a pod as a private file, and SHALL let them attach one of their own private files, which then reaches every member as an attachment added by them.

#### Scenario: Attaching a private file
- **GIVEN** a private file of Alice in a pod shared with Bob
- **WHEN** Alice attaches it
- **THEN** Bob sees it among the pod's attachments, added by Alice

### Requirement: Add an attachment as oneself
The app SHALL let any member, a service included, add an attachment by asking the node, and SHALL show it as added by that member. The app SHALL NOT offer adding an attachment as another member.

#### Scenario: Attribution
- **GIVEN** an attachment added by Alice's agent
- **WHEN** the attachment is shown
- **THEN** it is shown as added by the agent, not by Alice

### Requirement: Attachments are immutable
The app SHALL NOT offer editing an attachment's content. To correct one, the app SHALL offer deleting it and adding the corrected file, and the replacement SHALL be shown with its own date and as added by whoever added it.

#### Scenario: Correcting a file
- **GIVEN** an attachment the person added
- **WHEN** they delete it and add a corrected file
- **THEN** the corrected file appears as a new attachment dated now and attributed to the person

### Requirement: Make own attachment private
The app SHALL let a member turn an attachment they added into a private file, and SHALL NOT offer this for an attachment another member added, owner or not. Other members SHALL see it as the attachment being removed.

#### Scenario: Own attachment made private
- **GIVEN** an attachment Alice added to a pod shared with Bob
- **WHEN** Alice makes it private
- **THEN** it is among Alice's private files, and Bob sees it removed from the pod's attachments

#### Scenario: Another member's attachment
- **GIVEN** an owner viewing an attachment another member added
- **WHEN** they open its actions
- **THEN** deleting is offered and making it private is not

### Requirement: Open a file
The app SHALL let a member open any attachment in the pod, and any of their own private files. Which files the app can show in itself is not specified, and the app SHALL tell the person when it cannot open a file.

#### Scenario: Another member's attachment
- **GIVEN** an attachment added by another member
- **WHEN** a member chooses it
- **THEN** it opens

#### Scenario: File that cannot be opened
- **GIVEN** an attachment of a kind the app cannot show
- **WHEN** the person chooses it
- **THEN** the person is told it cannot be opened here
