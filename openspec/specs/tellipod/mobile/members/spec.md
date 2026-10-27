# tellipod/mobile/members Specification

## Purpose

Defines how the Tellipod mobile app shows a pod's members and roles and which actions it offers each member. The node decides what is allowed; the app offers only allowed actions and shows denials. The app does not decide how services join a pod; it only shows the members the node reports.

## Requirements

### Requirement: Show members and roles
The app SHALL show a pod's members, each with their kind (person or service) and role (owner, member or service), and the member count. Services SHALL be counted as members.

#### Scenario: Agent in the list
- **GIVEN** a pod with two people and an invited agent
- **WHEN** the person views its members
- **THEN** three members are shown, the agent marked as a service, and the count is three

### Requirement: Invite only as a person
The app SHALL offer inviting a member only to people, and SHALL let a person invite another person or a service: their own agent, a backup service or an organization's service. The app SHALL let the person who invited a member uninvite them, whether or not that person is an owner.

#### Scenario: Agent cannot invite
- **GIVEN** the participant is a service
- **WHEN** members are shown
- **THEN** no invite action is offered

#### Scenario: Uninvite
- **GIVEN** a non-owner member who invited Dave
- **WHEN** they view Dave
- **THEN** uninviting Dave is offered, and removing other members is not

### Requirement: Invitations are accepted or declined
A person SHALL join a pod only by accepting an invitation, and the app SHALL let an invitee decline it. An invitation SHALL be pending from when it is sent until it is accepted, declined or withdrawn by the inviter. Who besides the invitee sees a pending invitation is open (see open question 56) and SHALL NOT be assumed.

#### Scenario: Declined
- **GIVEN** Dave has a pending invitation to a pod
- **WHEN** Dave declines it
- **THEN** Dave does not join the pod and the invitation is no longer pending

### Requirement: Owner actions
The app SHALL offer removing a member, promoting, demoting and deleting for all members only to owners. It SHALL NOT offer promotion of a service. It SHALL NOT offer demoting to the last owner. Who may rename a pod for all members is open (see open question 1) and is not part of this requirement. Whether the last owner may leave is open (see open question 40) and SHALL NOT be assumed.

#### Scenario: Non-owner
- **GIVEN** a non-owner member
- **WHEN** they view a member
- **THEN** no remove or role-change action is offered

#### Scenario: Last owner
- **GIVEN** a pod with one owner
- **WHEN** that owner views their own membership
- **THEN** demoting themselves is not offered

### Requirement: Own claims only
The app SHALL offer editing and deleting a claim only to its claimant, and offer deleting any claim to owners. It SHALL NOT offer editing another member's claim to anyone.

#### Scenario: Other member's claim
- **GIVEN** a claim made by another member
- **WHEN** an owner views it
- **THEN** deleting is offered but editing is not

### Requirement: Own attachments
The app SHALL offer deleting an attachment only to its adder and to owners, and SHALL NOT offer editing an attachment to anyone.

#### Scenario: Someone else's attachment
- **GIVEN** an attachment added by another member
- **WHEN** a non-owner views it
- **THEN** no delete action is offered

### Requirement: Contact a member outside the pod
The app SHALL offer a person contacting another member of a pod by email or SMS, using only the contact details that member has put in the pod. It SHALL NOT offer this to a service, and SHALL NOT offer it for a member who has put no such detail in the pod.

#### Scenario: Member with an email address
- **GIVEN** a member who put an email address in the pod
- **WHEN** another person views that member
- **THEN** contacting them by email is offered

#### Scenario: Member without contact details
- **GIVEN** a member who put no email address or phone number in the pod
- **WHEN** another person views that member
- **THEN** no outside contact is offered

#### Scenario: Service
- **GIVEN** an agent member of the pod
- **WHEN** it is viewed
- **THEN** no outside contact is offered, and the agent cannot contact a member outside the pod

### Requirement: Handle denials
When the node denies a command, the app SHALL leave the pod unchanged and tell the person the action is not allowed, distinct from a failure.

#### Scenario: Denied removal
- **GIVEN** the app offered an action that the node then denies
- **WHEN** the denial arrives
- **THEN** the pod looks as before and a not-allowed message is shown, not a failure message
