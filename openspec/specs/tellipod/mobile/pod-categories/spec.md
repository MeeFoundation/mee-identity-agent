# tellipod/mobile/pod-categories Specification

## Purpose

Defines how the Tellipod mobile app offers, shows and respects pod categories: the taxonomy that says what kind of information a pod holds. A category is chosen once, at creation. How a new pod is started from a category's template is in `mobile/pods` (Lazy Instantiation); how a received pod is filed from its category is in `mobile/received-pods`; suggesting a category for an uncategorized pod is planned in `mobile/pod-organization`.

## Requirements

### Requirement: Shipped taxonomy
The app SHALL ship a taxonomy of categories with two roots, Person and Organization, covering a personal-life taxonomy and a work-life taxonomy, arranged in a hierarchy at least four levels deep. A category SHALL NOT imply that a pod about it is a kind of person or organization; it classifies the information about one. A pod's category type SHALL be Person-rooted, Organization-rooted, or Custom, according to which root its category sits under, if any.

#### Scenario: Browsing
- **GIVEN** a person creating a pod
- **WHEN** they open the category choices
- **THEN** they can reach categories from both the personal and the work taxonomy and descend through the hierarchy

### Requirement: Category is optional
The app SHALL let a person create a pod with a category or without one. A pod created without a category SHALL be a Custom pod.

#### Scenario: No category chosen
- **GIVEN** a person creating a pod
- **WHEN** they choose no category
- **THEN** the pod is a Custom pod

### Requirement: Category fixed at creation
The app SHALL set a pod's category only when the pod is created and SHALL NOT offer changing it afterwards. It SHALL NOT derive or change a pod's category from the pod's name, position in the tree or tags. Whether Auto File may record a category on an existing Custom pod is open (see open question 29).

#### Scenario: Pod renamed
- **GIVEN** a pod created in the Pets category
- **WHEN** it is renamed to "Notes"
- **THEN** its category is still Pets

#### Scenario: No edit action
- **GIVEN** an existing pod with a category
- **WHEN** the person views its details
- **THEN** no action to change the category is offered

### Requirement: Moving does not change category
Moving a pod in the person's tree SHALL NOT change its category, and the app SHALL NOT treat a pod's position as a record of its category.

#### Scenario: Pod moved
- **GIVEN** a pod in the Pets category under Pets
- **WHEN** the person moves it under Home
- **THEN** its category is still Pets

### Requirement: Every shipped category has a template
The app SHALL have a template for every shipped category, the two roots included. The app SHALL let a person choose any non-root shipped category so that creating a pod in that category starts from its template. The Person and Organization roots SHALL organize the taxonomy and SHALL NOT be categories of an Instance pod.

#### Scenario: Chosen category
- **GIVEN** a shipped category
- **WHEN** a person creates a pod in it
- **THEN** the pod starts from that category's template

#### Scenario: Root not selectable
- **GIVEN** a person creating a pod
- **WHEN** they browse the category choices
- **THEN** Person and Organization organize the choices but are not offered as categories to create a pod in

### Requirement: Organization category extensions
The app SHALL show and offer categories from an organization's published category extension that it knows, placed under the shipped category the extension links to. For a received pod whose extension category the app does not know, the app SHALL still show the pod and keep it filed under the nearest shipped broader category. How the unknown category is labeled is open (see open question 26).

#### Scenario: Extension category known
- **GIVEN** an installed extension from the Boston Hub Society
- **WHEN** a person creates a pod
- **THEN** the society's categories are offered beneath the shipped category they extend

#### Scenario: Extension category unknown
- **GIVEN** a received pod in a category from an extension the app does not know
- **WHEN** it arrives
- **THEN** the pod is shown and filed under the shipped category that category links to

### Requirement: Category and tags are separate
A category SHALL be a filing decision made once; a tag SHALL be a retrieval label. Adding or removing a tag SHALL NOT change a pod's category.

#### Scenario: Tag added
- **GIVEN** a pod in the Finances category
- **WHEN** the person adds the tag "taxes"
- **THEN** the pod's category is unchanged
