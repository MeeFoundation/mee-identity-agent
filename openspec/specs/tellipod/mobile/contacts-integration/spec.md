# tellipod/mobile/contacts-integration Specification

## Purpose

Defines how the Tellipod mobile app syncs a person's address book on their device with their pods: bringing contact records in, sending a person's information back out, and keeping address book groups. Sharing a contact with someone who has no node is not specified here (see open question 17). Which contacts are synced, what happens when the same contact changed on both sides, and where an imported contact is filed are open (see open questions 53, 54 and 55).

## Requirements

### Requirement: Nothing without permission
The app SHALL read or change the address book only after the person has allowed it, and SHALL tell the person when it cannot because they have not.

#### Scenario: Permission refused
- **GIVEN** a person who has not allowed the app to use their address book
- **WHEN** they start a sync
- **THEN** nothing is read or changed and the person is told the app needs permission

### Requirement: Import a contact record
The app SHALL turn each contact record it imports into a graph in a pod (`mobile/claims-and-forms`), keeping every field the record has, including names, phone numbers, addresses, organization, job title, birthday and photo. When the contact is not a member of the pod, the app SHALL keep it in a form graph whose topic is that contact, rather than making it a member graph. The app SHALL NOT make the address book or an imported contact a member of the pod merely by importing it. The sync is a Contacts tool on the pod, not a service.

#### Scenario: Contact imported
- **GIVEN** a contact record with a name, two phone numbers and a birthday
- **WHEN** the person imports it
- **THEN** a pod shows that name, both numbers and the birthday in a graph about that contact

### Requirement: Export as one contact record
The app SHALL send a person's contact information back to the address book as a single contact record, however many parts of the pod it is held in, and SHALL label each value with the label of the graph it came from.

#### Scenario: Information from two graphs
- **GIVEN** a person whose phone number is in one graph and whose address is in another
- **WHEN** the person is exported
- **THEN** one contact record results, each value labeled with the label of its graph

### Requirement: Address book groups are kept
The app SHALL keep the address book group a contact belonged to, so that a later export puts the contact back in the same group. The app SHALL NOT show the group as a tag, SHALL NOT include it in any search, and SHALL NOT share it with other members.

#### Scenario: Round trip
- **GIVEN** a contact in the group "Christmas List"
- **WHEN** the contact is imported and later exported
- **THEN** it is back in "Christmas List"

#### Scenario: Group not shown
- **GIVEN** a pod imported from a contact in a group
- **WHEN** the person views the pod's tags or searches
- **THEN** the group is not shown and no search finds the pod through it

### Requirement: Changes carry both ways
The app SHALL carry a later change made on one side to the other when the person syncs, and SHALL NOT lose a group, a field or a source label in doing so.

#### Scenario: Edited in the address book
- **GIVEN** a contact imported earlier
- **WHEN** the person changes its phone number in the address book and syncs
- **THEN** the pod shows the new number

#### Scenario: Edited in the pod
- **GIVEN** a contact imported earlier
- **WHEN** the person changes its phone number in the pod and syncs
- **THEN** the address book record has the new number
