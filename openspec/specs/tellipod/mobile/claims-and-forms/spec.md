# tellipod/mobile/claims-and-forms Specification

## Purpose

Defines how the Tellipod mobile app builds forms and member contact info from shapes and records claims: who is shown as responsible for a claim, how a person fills in their own claims, including claims about another member. The app offers only the edits the person may make (`mobile/members`, Own claims only).

## Requirements

### Requirement: Forms are derived from shapes
The app SHALL build a form from the shape the node reports for the graph being filled in, taking its fields and the kind of input for each from the shape, and SHALL NOT use a hand-coded form per template. The app SHALL NOT require that it already knows a shape in order to show a graph.

#### Scenario: New category with a form
- **GIVEN** a category whose template declares a form with its own shape
- **WHEN** the person opens that form
- **THEN** its fields and inputs come from the shape the node reports, with no form written specifically for the category

#### Scenario: Shape new to this app version
- **GIVEN** a graph filled in against a shape that an earlier version of the app did not ship
- **WHEN** the node reports the graph with its shape
- **THEN** the form is built from the reported shape

### Requirement: Closed lists
For a field whose shape allows only a fixed list of values, the app SHALL offer exactly those values as a choice and SHALL NOT accept any other value.

#### Scenario: Fixed values
- **GIVEN** a field that allows only "male" and "female"
- **WHEN** the person fills it in
- **THEN** they choose between exactly those two values and cannot type another

### Requirement: Fields that refer to known things
For a field that refers to a kind of thing and has no fixed list in the shape, the app SHALL offer the known individuals of that kind from the ontology as choices. When another field depends on it, the app SHALL narrow that field's choices to match.

#### Scenario: Vehicle make and model
- **GIVEN** a vehicle form with make and model fields
- **WHEN** the person chooses the make Toyota
- **THEN** the model choices are limited to Toyota's models

### Requirement: Shape is recorded when a graph is filled in
When a graph is filled in, the app SHALL record on it the shape it was filled in against. For a member graph, the shape SHALL be the Contact Info shape the node reports from the pod's category template, for every category without exception, and from the user-defined template for a Custom pod. For a form a template declares, the shape SHALL be the one the node reports from that template. For a form the person added, the shape SHALL be the one the person picked, whatever the pod's category.

#### Scenario: Member contact info filled in
- **GIVEN** a pod in the Pets category
- **WHEN** the person fills in a member's contact information
- **THEN** the member graph records the Contact Info shape

#### Scenario: Form filled in
- **GIVEN** a pod in the Pets category
- **WHEN** the person fills in its form
- **THEN** the graph records the shape taken from the Pets template

#### Scenario: Form added by hand
- **GIVEN** a Custom pod to which the person added a form and picked the Passport shape
- **WHEN** the person fills it in
- **THEN** the graph records the Passport shape

### Requirement: Member contact info is shape-driven
Every pod SHALL have member contact information, including a pod with no form. The app SHALL build it from the Contact Info shape the node reports, taking its fields and the kind of input for each from that shape, the same way it builds a form.

#### Scenario: Plain pod
- **GIVEN** a Custom pod with no tool
- **WHEN** the person opens a member's contact information
- **THEN** its fields and inputs come from the Contact Info shape the node reports

### Requirement: Claims about another member
The app SHALL let a person fill in contact information about another member of the pod as that person's own claims. Those claims SHALL be kept in a member graph whose claimant is the person and whose subject is the other member. The app SHALL show them as the person's, distinct from the other member's own claims about themselves.

#### Scenario: Alice claims Bob's phone number
- **GIVEN** a pod whose members include Alice and Bob
- **WHEN** Alice fills in a phone number for Bob
- **THEN** the number is shown as Alice's claim about Bob, and Bob cannot edit it

### Requirement: One graph per claiming member
Each member's claims in a form SHALL be kept in their own graph, one per claiming member. The app SHALL let a person fill in only their own graph and SHALL show every member's graph, each attributed to its claimant.

#### Scenario: Two members fill the same form
- **GIVEN** a form in a pod with Alice and Dave
- **WHEN** each fills in the form
- **THEN** two graphs exist, one attributed to Alice and one to Dave, and each person can edit only theirs

### Requirement: Claimant is shown
The app SHALL show, for every claim, the party responsible for it, a person, an organization or a service, and SHALL distinguish it from the member the claim describes.

#### Scenario: Agent writes a claim
- **GIVEN** an agent invited by Alice wrote a claim
- **WHEN** the claim is shown
- **THEN** it is attributed to the agent, not to Alice

#### Scenario: Organization claims through its service
- **GIVEN** a claim about a bank's service provider member, made by the bank
- **WHEN** the claim is shown
- **THEN** it is attributed to the bank, not to the service member it describes

### Requirement: Editing is an ordinary edit
The app SHALL present changing or removing a claim as an ordinary edit and SHALL NOT expose how the node records it.

#### Scenario: Phone number changed
- **GIVEN** a claim with a phone number
- **WHEN** the author changes it
- **THEN** the form shows the new number as an edit of the same field
