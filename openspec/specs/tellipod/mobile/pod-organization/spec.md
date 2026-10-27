# tellipod/mobile/pod-organization Specification

## Purpose

Defines how a person arranges their own pods in a tree and how the Tellipod mobile app helps: suggesting a category and place for an uncategorized pod (Auto File) and splitting a note into separate pods (Divide and Conquer). Filing a pod that arrives is in `mobile/received-pods`; categories are in `mobile/pod-categories`. The tree is personal and is never sent to other members. Where a pod created by Divide and Conquer sits in the tree, and who its members are, is open (see open question 31) and is not specified here.

## Requirements

### Requirement: Pods nest in a personal tree
The app SHALL let a person arrange their pods in a tree in which any pod can contain other pods. Each person's tree SHALL be their own.

#### Scenario: Nested pod
- **GIVEN** a pod "Ginger"
- **WHEN** the person places a pod "Medical" inside it
- **THEN** "Medical" appears as a child of "Ginger" in the person's tree only

### Requirement: Move pods freely
The app SHALL let a person move any pod under any other pod, or to the top level, regardless of either pod's category. The app SHALL NOT allow moving a pod under itself or one of its own descendants. A move SHALL NOT change the pod's category, name or members.

#### Scenario: Move within the tree
- **GIVEN** Paula has received Alice's pod, of category type Person, and filed it under People
- **WHEN** Paula creates an Immediate Family pod under People and moves Alice's pod under it
- **THEN** Alice's pod appears under Immediate Family and its category type is still Person

#### Scenario: Move into own descendant
- **GIVEN** a pod with a child pod
- **WHEN** the person tries to move the parent under that child
- **THEN** the app does not offer the move and the tree is unchanged

#### Scenario: Node refuses a move
- **GIVEN** the app asked the node to move a pod and the node refuses it
- **WHEN** the refusal arrives
- **THEN** the tree is unchanged and the person is told the move was not allowed, distinct from a failure

### Requirement: Auto File suggestion
For a pod without a category, the app SHOULD suggest a category and, only when the person approves, file the pod under that category's place in their tree. If the person declines, the pod SHALL stay where it is. Whether approval also records the category on the pod is open (see open question 29) and SHALL NOT be assumed.

#### Scenario: Approved
- **GIVEN** a Custom pod named "Hilton"
- **WHEN** the app suggests a travel provider category and the person approves
- **THEN** the pod is filed under that category's place in the person's tree

#### Scenario: Declined
- **GIVEN** a suggested category for a Custom pod
- **WHEN** the person declines
- **THEN** the pod stays where it is and no filing happens

### Requirement: Divide and Conquer into pods
The app SHALL be able to move a chunk of a pod's note into a new pod with a category and SHALL leave in its place a pod link to the new pod, resolved by pod id. The chunk's content SHALL appear in the new pod's note and SHALL NOT be lost. The app SHALL mark the chunk it proposes to move and, before anything moves, show what the new pod would hold, and SHALL move the chunk only when the person confirms.

#### Scenario: Contact details proposed
- **GIVEN** a note that includes a paragraph of contact details
- **WHEN** the app marks the paragraph and the person asks to tidy it
- **THEN** a preview shows the new pod and its category, and nothing has moved yet

#### Scenario: Contact details moved
- **GIVEN** the preview of the new pod
- **WHEN** the person confirms
- **THEN** the note shows a pod link where the paragraph was, and the new pod's note holds the paragraph

#### Scenario: Shared note
- **GIVEN** a note in a pod shared with another member
- **WHEN** a chunk is moved into a new pod that the other member is not in
- **THEN** the other member sees the pod link as unresolved and does not see the chunk's new pod

### Requirement: Divide and Conquer into a form
For a chunk of structured information, the app SHALL be able to create a new form in the same pod instead of a new pod, and SHALL leave a block link to that form in the note's place. The app SHALL mark the chunk it proposes to convert and offer to tidy it. Before anything moves, the app SHALL show the form that would result, with the values it read from the chunk and a marker on each field that is new, and SHALL convert the chunk only when the person confirms.

#### Scenario: Structured chunk
- **GIVEN** a note with lines giving a name, a date of birth and an email address
- **WHEN** the app marks them and the person asks to tidy them
- **THEN** a preview shows a contact info form with first name, last name, date of birth and email, the email marked as new, and nothing has moved yet

#### Scenario: Confirmed
- **GIVEN** the preview of the contact info form
- **WHEN** the person confirms
- **THEN** the pod gains a form holding the details, and the note holds a block link to it where the lines were
