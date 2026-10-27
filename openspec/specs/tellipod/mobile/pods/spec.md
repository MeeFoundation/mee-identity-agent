# tellipod/mobile/pods Specification

## Purpose

Defines what the Tellipod mobile app does for a pod's basic life: creating it, starting it from a template, and removing it. Roles and invitations are in `mobile/members`; received pods in `mobile/received-pods`.

## Requirements

### Requirement: Create a plain pod
The app SHALL let a person, and SHALL NOT let a service, create a pod with only a name by asking the node, and SHALL show the pod once the node confirms. The new pod SHALL have a blank note, an empty chat, the creator as its only member and owner, and no category and no tool.

#### Scenario: Name only
- **GIVEN** a person using the app
- **WHEN** they create a pod with just a name
- **THEN** the pod appears as a Custom pod with a blank note and no tool

#### Scenario: Node unavailable
- **GIVEN** the node is unavailable
- **WHEN** the person creates a pod
- **THEN** no pod appears and the person is told the node is unavailable

### Requirement: Pod ids are stable
The app SHALL use the pod id the node reports, SHALL NOT alter it and SHALL NOT derive it from the pod's name. It SHALL show only pods the node reports.
#### Scenario: Pod the node has not reported
- **GIVEN** a pod the node has not reported
- **WHEN** the person lists their pods
- **THEN** the pod does not appear

### Requirement: Lazy Instantiation
The app SHALL ask the node to create a pod only when the person chooses to. When the chosen category has a template, the pod SHALL start from it, with whatever tool that template declares. A pod with no category SHALL use the user-defined template, which declares no tool.

#### Scenario: Templated category
- **GIVEN** a category whose template declares a form
- **WHEN** the person creates a pod in it
- **THEN** the pod has that form

#### Scenario: Template declares a Browser
- **GIVEN** a category whose template declares a Browser
- **WHEN** the person creates a pod in it
- **THEN** the pod has that Browser tool

### Requirement: Structure is optional and late
The app SHALL work with a pod that has only a note, and SHALL let a tool be added to any pod later regardless of category. Who may add a tool is open (see open question 49) and SHALL NOT be assumed. What Calendar, Canvas and Map hold is open (see open question 8) and SHALL NOT be assumed.

#### Scenario: Add a form later
- **GIVEN** a plain pod
- **WHEN** the person adds a form
- **THEN** the pod gains the form and keeps its note and members

### Requirement: Add a tool
The app SHALL offer adding a tool to every pod, whether or not it already carries one, and SHALL ask the person which kind of tool to add. For a form, it SHALL also ask which form type to follow, offering every form type the app ships regardless of the pod's category with Contact Info selected by default, and SHALL ask what the form is about. The app SHALL ask for a form type only for a form. It SHALL let a pod carry any number of tools.

#### Scenario: Default form type
- **GIVEN** a pod in any category
- **WHEN** the person chooses to add a form
- **THEN** Contact Info is selected and every other shipped form type can be chosen instead

#### Scenario: Form about someone outside the pod
- **GIVEN** a pod about Sophia, who is not a member
- **WHEN** the person adds a form, keeps Contact Info and says it is about Sophia
- **THEN** the pod gains a Contact Info form about Sophia

#### Scenario: Another kind of tool
- **GIVEN** a person adding a tool
- **WHEN** they choose a kind other than form
- **THEN** no form type is asked for

### Requirement: Leave or delete a pod
The app SHALL let any member, a service included, leave a pod, which withdraws their membership for all members, and SHALL let any member delete a pod locally, which removes it from their own tree only and leaves every other member's copy unchanged. It SHALL offer deletion for all members only to owners. Whether the last owner may leave is open (see open question 40), and whether leaving also deletes locally is open (see open question 61); neither SHALL be assumed.

#### Scenario: Non-owner
- **GIVEN** a non-owner member viewing a pod
- **WHEN** they open the leave and delete options
- **THEN** leaving and deleting locally are offered, and deleting for all members is not

#### Scenario: Delete locally
- **GIVEN** a pod shared by three members
- **WHEN** one member deletes it locally
- **THEN** it disappears from that member's tree and the other members' copies are unchanged

#### Scenario: Leave
- **GIVEN** a pod shared by three members
- **WHEN** one member leaves it
- **THEN** the other members see that member is no longer in the pod

### Requirement: References resolve by pod id
The app SHALL resolve pod references by pod id and never by name.

#### Scenario: Renamed target
- **GIVEN** a link to a pod
- **WHEN** the pod is renamed
- **THEN** the link still opens the same pod
