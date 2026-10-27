# tellipod/mobile/pod-tags-and-discovery Specification

## Purpose

Defines how the Tellipod mobile app handles tags on pods and how a person finds pods by tag or by a property of a form. User tags are shared labels; service tags are hidden bookkeeping written by a module and are never part of what the person sees or searches. Tags never change a pod's category (`mobile/pod-categories`). Service tags are not shared with other members.

## Requirements

### Requirement: User tags
The app SHALL let a person add and remove non-empty free-text user tags on a pod, and SHALL show a pod's user tags. The app SHALL NOT add an empty user tag. User tags SHALL be shared with all members of the pod. The app SHALL let every member, owner or not, add and remove user tags.

#### Scenario: Tag added
- **GIVEN** a pod
- **WHEN** a person adds the tag "vet"
- **THEN** the pod shows the tag "vet" to all of its members

#### Scenario: Non-owner removes a tag
- **GIVEN** a shared pod tagged "vet" by another member
- **WHEN** a non-owner member removes the tag
- **THEN** the tag is removed for all members

#### Scenario: Empty tag
- **GIVEN** a pod
- **WHEN** a person tries to add an empty tag
- **THEN** no tag is added

### Requirement: Service tags are hidden
The app SHALL NOT show service tags to the person as tags and SHALL NOT include them in any search or search result.

#### Scenario: Service tag present
- **GIVEN** a pod carrying a service tag written by an agent
- **WHEN** the person views the pod's tags or searches
- **THEN** the service tag is not shown and no search finds the pod through it

### Requirement: Find pods by tag
The app SHALL let a person search by user tag by asking the node, and SHALL show a flat list of pod links to the matching pods the node reports in the person's own tree. Only user tags SHALL be searched. The app SHALL NOT apply its own matching rules to the node's result.

#### Scenario: Match
- **GIVEN** two pods in the person's tree tagged "vet" and one untagged pod
- **WHEN** the person searches for "vet"
- **THEN** a flat list of two pod links is returned, with no hierarchy

#### Scenario: No match
- **GIVEN** no pod carries the searched tag
- **WHEN** the person searches
- **THEN** the result is empty and says nothing was found

### Requirement: Find pods by property
The app SHALL let a person find pods by the value of a property in a form's claims, for example a loyalty program id, by asking the node, and SHALL show the same kind of flat list of pod links. Which properties can be searched is up to the node. How the person names or picks the property is open (see open question 35) and SHALL NOT be assumed.

#### Scenario: Loyalty number
- **GIVEN** a Hilton pod with a form holding a loyalty program id
- **WHEN** the person searches for that id
- **THEN** the Hilton pod is in the result without any tag being involved

### Requirement: Search stays within the person's own pods
The app SHALL search only pods the person can access and that are in their own tree, and SHALL NOT include any other pod or reveal that one exists.

#### Scenario: Pod the person is not in
- **GIVEN** a pod the person is not a member of
- **WHEN** the person searches for something it contains
- **THEN** it is not in the results

### Requirement: Tags are for what no field models
The app SHALL offer tags for information no form field or member contact field models. When such a field exists for a piece of information, the app SHOULD steer the person to it, because properties are preferred when available.

#### Scenario: Field available
- **GIVEN** a pod whose form has a loyalty program id field
- **WHEN** the person is about to tag the pod with a loyalty number
- **THEN** the app suggests using the field instead
