# tellipod/mobile/received-pods Specification

## Purpose

Defines how the Tellipod mobile app shows changes the node reports for shared pods, what it treats as personal to the person, and how it names and files a pod that arrives. How changes arrive when another member is offline is not specified.

## Requirements

### Requirement: Show changes reported by the node
The app SHALL show every change the node reports for a pod, including note, chat, attachments, claims, members and a shared name, without the person asking.

#### Scenario: Note edited elsewhere
- **GIVEN** a pod open on the device
- **WHEN** the node reports another member's note edit
- **THEN** the note shown reflects it

### Requirement: Personal state stays personal
The app SHALL present a pod's parent in the person's tree, the person's private files and service tags as the person's own, and a change to them SHALL NOT alter what other members see.

#### Scenario: Filing a shared pod
- **GIVEN** a shared pod
- **WHEN** the person moves it under another parent
- **THEN** other members' placement of it is unchanged

### Requirement: Shared names
In a pod with one member, three or more members, or two members and a tool, the app SHALL treat the name as shared: a rename SHALL be requested for all members, and a name the node reports SHALL replace the one shown. The app SHALL NOT offer a service renaming for all members. Who among people may rename for all members is open (see open question 1) and SHALL NOT be assumed.

#### Scenario: Rename reported
- **GIVEN** a pod with three members
- **WHEN** the node reports another member's rename
- **THEN** the name shown changes to it

### Requirement: Bare two-member pods
For a pod with exactly two members and no tool, the app SHALL keep the name local to the person. Which name applies when such a pod gains a tool or a third member is open (see open question 58) and SHALL NOT be assumed. On first receipt it SHALL generate a name from the sender's member graphs, normally the sender's own name, and later local renames SHALL NOT be requested for other members.

#### Scenario: First receipt
- **GIVEN** Alice shares a bare two-member pod with Paula
- **WHEN** the pod first appears for Paula
- **THEN** it is named from Alice's own member graph

### Requirement: Unique sibling names
The app SHALL keep a pod's name unique among its siblings by silently appending the next integer suffix (1, 2, ...) on renames, new pods and received pods.

#### Scenario: Collision
- **GIVEN** a sibling named "Ginger"
- **WHEN** another pod named "Ginger" is received and filed beside it
- **THEN** it is named "Ginger1"

### Requirement: Auto-filing on receipt
On a pod arriving through an invitation, the app SHOULD create a best-guess chain of empty ancestor pods from the pod's category, the sender's name and what the pod is about, and file the pod under it, and SHALL let the person reorganize afterward. This SHALL apply equally when the person had no existing pods, including a person who first opened the app from the invitation. How a pod is filed for a person who already uses the app is open (see open question 59) and SHALL NOT be assumed.
#### Scenario: Received pet pod
- **GIVEN** a received medical pod about Alice's cat Ginger
- **WHEN** it arrives
- **THEN** it is filed under a guessed chain People > Others > Alice > Pets > Ginger and can be moved

#### Scenario: First pod received
- **GIVEN** a person with no pods who opens an invitation to a shared pod
- **WHEN** the pod arrives
- **THEN** it is filed under a guessed chain of empty pods, as for any received pod

### Requirement: Unresolved links fail closed
The app SHALL show a pod link or block link to something the person cannot access as unresolved, and SHALL NOT create a pod or reveal the target.

#### Scenario: Inaccessible target
- **GIVEN** a link with an id to a pod the person is not a member of
- **WHEN** the person views it
- **THEN** it is shown as unresolved and no pod is created
