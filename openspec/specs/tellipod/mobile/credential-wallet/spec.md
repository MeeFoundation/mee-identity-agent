# tellipod/mobile/credential-wallet Specification

## Purpose

Defines how the Tellipod mobile app acts as a person's wallet for credentials, together with the Tellipod browser extension in the person's browser. The extension sees a site offer or ask for a credential and carries it between the site and the app. The app keeps each credential in the pod of the site it concerns. How the app and the extension are connected is open (see open question 51), and so is what the person approves before a credential is presented (see open question 50).

## Requirements

### Requirement: Credentials are kept exactly as received
The app SHALL keep a credential as an attachment of a pod, byte for byte as the issuer sent it, and SHALL NOT alter, reformat or break it into fields, so that it can still be verified by whoever it is later presented to. The app SHALL show a credential as an attachment and SHALL NOT present a form for it.

#### Scenario: Credential stored
- **GIVEN** a credential issued to the person
- **WHEN** the app stores it
- **THEN** it is an attachment of a pod and its content is exactly what the issuer sent

### Requirement: One pod per site
The app SHALL keep the credentials that pass between the person and a site in a pod for that site, found by the site's domain. When more than one pod matches the domain, the app SHALL ask the person which to use. When none matches, the app SHALL create a pod holding the person and a member standing for that site. The app SHALL give every pod it finds or creates this way a Browser tool, adding one to a found pod that lacks it.

#### Scenario: Known site
- **GIVEN** exactly one pod for a site's domain
- **WHEN** the person deals with that site through the extension
- **THEN** the app uses that pod

#### Scenario: Several pods for a domain
- **GIVEN** two pods for the same domain
- **WHEN** the person deals with that site
- **THEN** the app asks which pod to use

#### Scenario: Found pod without a Browser tool
- **GIVEN** one pod for a site's domain that has no Browser tool
- **WHEN** the person deals with that site through the extension
- **THEN** the app uses that pod and it gains a Browser tool

#### Scenario: New site
- **GIVEN** no pod for a site's domain
- **WHEN** the person deals with that site
- **THEN** the app creates a pod holding the person and a member for that domain, with a Browser tool

### Requirement: Category of a new site pod
The app SHALL give a new site pod the category matching the kind of company behind the site, and SHALL give it the Companies category when it cannot tell with confidence. The category SHALL stay fixed (`mobile/pod-categories`) and the pod SHALL be movable.

#### Scenario: Unsure
- **GIVEN** a site the app cannot classify with confidence
- **WHEN** it creates the site's pod
- **THEN** the pod's category is Companies

### Requirement: Store an issued credential
When the extension reports that a site issues a credential, the app SHALL ask the person whether to store it. When a pod for the issuing site exists, the app SHALL ask whether to add the credential to it. Nothing SHALL be stored until the person agrees.

#### Scenario: First credential from a site
- **GIVEN** a site that issues a credential and no pod for it
- **WHEN** the person agrees to store it
- **THEN** a pod for the site is created and holds the credential as an attachment

#### Scenario: Declined
- **GIVEN** a site that issues a credential
- **WHEN** the person declines
- **THEN** nothing is stored and no pod is created

### Requirement: Present a stored credential
When a site asks for a credential from any of a set of issuers it trusts, the app SHALL find or create the requesting site's pod. When that pod holds no suitable credential, the app SHALL look in the person's pods for one from a trusted issuer and SHALL copy it unchanged into the requesting site's pod, leaving the original in place. The extension SHALL then pass it to the site from that pod.

#### Scenario: Credential held in another pod
- **GIVEN** an age credential in the pod of the site that issued it
- **WHEN** another site asks for an age credential from that issuer
- **THEN** the credential is copied unchanged into the requesting site's pod and the original stays where it was

#### Scenario: No suitable credential
- **GIVEN** no pod of the person holds a credential from a trusted issuer
- **WHEN** a site asks for one
- **THEN** the person is told they hold none the site accepts, and nothing is copied

### Requirement: Holding is not presenting
For a credential bound to its holder, the app SHALL offer presenting it only to the member it was issued to, and SHALL show to any other member of the pod that the credential is held but cannot be presented by them. A credential with no holder binding can be presented by anyone who holds it, and the app SHALL NOT claim otherwise. How the app knows which member a credential was issued to is open (see open question 60) and SHALL NOT be assumed. The app SHALL NOT show a credential's signing key as part of a pod.

#### Scenario: Another member
- **GIVEN** a pod shared by Alice and Bob that holds a holder-bound credential issued to Alice
- **WHEN** Bob views it
- **THEN** Bob can read and copy it, and presenting it is not offered to him

#### Scenario: Credential with no holder binding
- **GIVEN** a pod shared by Alice and Bob that holds a credential with no holder binding
- **WHEN** Bob views it
- **THEN** the app does not say that only Alice can present it
