## Purpose

Defines the showcase SC-ONB-002 "Tellipod intro: Tap through" in `app-ux-flows`. It is a clickable version of the "v1.2 · Tap through" first-run intro from the "Tellipod Intro" prototype. It tells the same four-beat story as SC-ONB-001, but people move forward by tapping highlighted controls in the scene instead of a Next button. It is for demos and for comparison with SC-ONB-001: it has no variants or cases, records no analytics, and carries its own explanations and open questions.

## ADDED Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-onb-002`, display code `SC-ONB-002`, title "Tellipod intro: Tap through" and the description "The Rooms intro without a Next button: you move through it by tapping what lights up in the scene." It SHALL declare no cases, so the home page offers a single start action. Its goal SHALL be "Go through the intro and get started with Tellipod." It SHALL be listed directly after SC-ONB-001, in both development and production builds. Both showcases share the code family `SC-ONB`, so the home page SHALL group them under "Onboarding".

The flow SHALL declare the same screens as SC-ONB-001: `rooms`, `ginger-pod`, `paula` and `welcome` (the four beats), and `telli-handoff`, `existing-device` and `restore` (the stand-ins). `rooms` SHALL be the initial screen. No screen SHALL declare a Figma frame.

#### Scenario: Start the showcase
- **WHEN** a reviewer starts "Tellipod intro: Tap through" on the home page
- **THEN** `rooms` is shown at `/flows/sc-onb-002/rooms` with the mission card showing the goal

#### Scenario: Onboarding family on the home page
- **WHEN** a reviewer opens the home page
- **THEN** "Tellipod intro: Rooms" and "Tellipod intro: Tap through" are listed together under "Onboarding"

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Tellipod intro: Tap through" is listed with the code `SC-ONB-002`, no cases, and the screens `rooms`, `ginger-pod`, `paula`, `welcome`, `telli-handoff`, `existing-device` and `restore`, each marked as having no Figma frame

### Requirement: Tap layout
Each beat screen SHALL show, from top to bottom:
- the top bar of SC-ONB-001: Back on every beat except `rooms`, the Tellipod logo, and "Skip" on every beat except `welcome`;
- the beat's headline and subline, directly under the top bar;
- the animated scene, filling the space between the copy and the pager, up to 600 px tall;
- on every beat except `welcome`, the pager of four dots, announced as "Step N of 4".

The headlines, sublines and line breaks SHALL be the same as SC-ONB-001's. There SHALL be no "Next" button on any beat. On `welcome`, "Get Started" and the two links SHALL sit at the bottom of the screen, over the scene.

Back SHALL move to the previous beat and Skip to `welcome`, with the whole story complete, as in SC-ONB-001. The copy and the pager SHALL follow the scene continuously. The four beats SHALL be one continuous scene, and the URL and the briefing SHALL follow the nearest beat.

#### Scenario: No Next button
- **WHEN** a reviewer views `rooms`, `ginger-pod` or `paula`
- **THEN** the headline sits under the top bar, the scene fills the screen below it, and no "Next" button is shown

#### Scenario: Skip goes to the last beat
- **WHEN** a reviewer on `rooms`, `ginger-pod` or `paula` activates "Skip"
- **THEN** the scene fades out, `welcome` is shown with the whole story complete, and the scene fades back in

#### Scenario: Back moves back
- **WHEN** a reviewer on `paula` activates Back
- **THEN** the scene moves back to `ginger-pod`

### Requirement: Animated scene
The scene SHALL be the same isometric world as in SC-ONB-001, with the same camera framings, beat stories, timings and easing, and the same text alternatives. The only exceptions are those listed in this specification. The camera framings SHALL fit the tap layout's taller scene. On `ginger-pod` the camera SHALL frame Ginger's room above the pod card. On `welcome` the dotted line from Ginger's room SHALL fade away as the camera returns to the whole home, instead of staying.

#### Scenario: Line fades on the way home
- **WHEN** a reviewer on `paula` activates "Home"
- **THEN** the dotted line between the phones fades out as the camera returns to the whole home, and is gone on `welcome`

#### Scenario: Camera move
- **WHEN** a reviewer on `rooms` activates the "Ginger" tag
- **THEN** the camera zooms continuously from the whole home into Ginger's room, and the pod card docks at the bottom of the scene

### Requirement: Tap targets and attention ring
Each beat SHALL move forward only through one control in the scene, or through "Get Started" on `welcome`:

| Beat | Control | Label and hint | Available when |
|---|---|---|---|
| `rooms` | the "Ginger" tag, drawn large next to Ginger's room | "Enter Ginger's pod", hint "Opens Ginger's pod" | the scene rests on `rooms` and the home has finished assembling |
| `ginger-pod` | "Invite Paula" on the pod card, with a person-plus icon | "Invite Paula", hint "Shares Ginger's pod with Paula" | the scene rests on `ginger-pod` in **Added** (see "Telli demo") |
| `paula` | a "Home" tag with a house icon, at the lower left near your phone | "Home", hint "Back to all your pods" | the scene rests on `paula` and the sync story has finished |
| `welcome` | "Get Started" | as in SC-ONB-001 | the scene rests on `welcome` |

Activating the Ginger tag SHALL move to `ginger-pod`, Invite Paula to `paula`, Home to `welcome`, and Get Started SHALL show `telli-handoff`. A control SHALL NOT react to input while it is unavailable. "Invite Paula" SHALL fade in once the info has been added, and "Home" once Paula's message has arrived. The Ginger tag SHALL shrink to its normal size as the camera moves into Ginger's room.

While a control is available, including "Invite Telli" and "Add all suggested info" on `ginger-pod`, it SHALL show an attention ring: a brand-coloured ring around it with a ripple that spreads and fades, repeating every 1.5 s. The ring SHALL disappear when the control becomes unavailable. When the reviewer prefers reduced motion, the ring SHALL stay still, without the ripple. The one-time pulses that SC-ONB-001 plays on "Invite Telli" and "Add all suggested info" SHALL NOT play.

#### Scenario: Ginger tag opens the pod
- **WHEN** a reviewer resting on `rooms` activates the ringed "Ginger" tag
- **THEN** the scene moves to `ginger-pod` and the URL becomes `/flows/sc-onb-002/ginger-pod`

#### Scenario: Home returns to all pods
- **WHEN** a reviewer on `paula` waits until "Ginger's fed!" has arrived on both phones
- **THEN** the ringed "Home" tag appears, and activating it moves the scene to `welcome`

#### Scenario: Ring follows availability
- **WHEN** a reviewer on `ginger-pod` activates the ringed "Invite Telli"
- **THEN** its ring disappears while the story plays, and "Add all suggested info" is ringed once it appears

#### Scenario: Reduced-motion ring
- **WHEN** a reviewer whose system prefers reduced motion rests on `rooms`
- **THEN** the "Ginger" tag has a still ring with no ripple

### Requirement: Telli demo
`ginger-pod` SHALL show the "Ginger" tag with member avatars and a full-width pod card docked at the bottom of the scene, with the tabs Notes, Chat and Info. The demo SHALL have SC-ONB-001's three states, **Before**, **Suggested** and **Added**, with the same content, buttons, hints, text alternatives and story. The differences are:
- In **Added**, "Add all suggested info" SHALL give way to "Invite Paula" in the same place, and the card SHALL keep its height.
- Tapping through the scene SHALL require the demo: "Invite Telli", then "Add all suggested info", then "Invite Paula".

"Skip", Back and swiping SHALL still work in every state. Swiping forward from **Before** or **Suggested** SHALL play the rest of the story before the camera moves, as in SC-ONB-001. Returning to `ginger-pod` SHALL show the demo in the state the reviewer left it in. Nothing SHALL be stored outside the run.

#### Scenario: Demo leads to Paula
- **WHEN** a reviewer resting on `ginger-pod` activates "Invite Telli", then "Add all suggested info", then "Invite Paula"
- **THEN** Telli comes in and suggests Meals and Portion, the rows are added and show edit icons, "Invite Paula" appears in place of "Add all suggested info", and the scene then moves to `paula`

#### Scenario: Invite Paula only after adding
- **WHEN** a reviewer resting on `ginger-pod` is in **Before** or **Suggested**
- **THEN** no "Invite Paula" button is shown

#### Scenario: Swiping past the demo
- **WHEN** a reviewer on `ginger-pod` in **Before** drags from right to left by more than half a beat and releases
- **THEN** the rest of beat 2's story plays and the scene settles on `paula`, shown exactly as after completing the demo

### Requirement: Shared pod on two phones
`paula` SHALL show the same two cards as SC-ONB-001, "Paula's phone" and "Your phone", with the same values and messages, plus the "Home" tag from "Tap targets and attention ring".

#### Scenario: Same pod on both phones
- **WHEN** a reviewer reaches `paula`
- **THEN** both cards show Meals "7:00 AM · 6:00 PM", Portion "½ cup, dry food" and "Ginger's fed!" at 7:05, sent on Paula's phone and received on yours

### Requirement: Swipe and reduced motion
Swiping between beats, the rubber band, settling on release, and the reduced-motion fades SHALL behave as in SC-ONB-001. A tap that doesn't become a drag SHALL reach the control under it, including the Ginger tag, the pod card's buttons and the Home tag.

#### Scenario: Drag to the next beat
- **WHEN** a reviewer on `rooms` drags the scene from right to left by more than half a beat and releases
- **THEN** the scene settles on `ginger-pod` and the URL follows

#### Scenario: Reduced motion
- **WHEN** a reviewer whose system prefers reduced motion activates the "Ginger" tag on `rooms`
- **THEN** the scene fades to `ginger-pod` without a camera move

### Requirement: Welcome actions and stand-ins
`welcome` SHALL show "Get Started" with its attention ring, and the links "Already have Tellipod on another device?" and "Restoring from backup?". They SHALL open the stand-in screens `telli-handoff`, `existing-device` and `restore`, whose content is the same as in SC-ONB-001. "Replay intro" SHALL start a new run of SC-ONB-002 on `rooms`. Showing `telli-handoff` SHALL complete the run without the completion view, so the briefing shows "Goal reached". The link stand-ins SHALL NOT complete the run.

#### Scenario: Get Started reaches the goal
- **WHEN** a reviewer on `welcome` activates "Get Started"
- **THEN** `telli-handoff` shows "Hey, I'm Telli!", and the briefing shows "Goal reached"

#### Scenario: Replay
- **WHEN** a reviewer on any stand-in activates "Replay intro"
- **THEN** `/flows/sc-onb-002/rooms` is shown in a new run

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- Does tapping the scene make the story more engaging than a Next button, or slower?
- With no Next button, is it always clear what to tap next?
- Tapping forward now requires the Telli demo. Is that the right trade-off against Rooms, where it is optional?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `rooms` | Pods as rooms in a home on your phone. The Ginger tag is the only way forward, so it is drawn large and ringed. | Without a Next button, is the ringed Ginger tag enough of a cue? |
| `ginger-pod` | Telli only enters a pod you invite it into, and only suggests. Each step leads to the next: invite Telli, add its suggestions, then invite Paula. | "Invite Telli" still says "Demo, optional" although it's the way forward. Should the hint change? · Does "Invite Paula" on the pod card read as sharing this pod? |
| `paula` | The same pod on Paula's phone, shared directly between devices. "Home" returns to all your pods. | Is "Home" clear as the way to move on? |
| `welcome` | Pods live on your devices. From here the existing onboarding takes over. | Does the ring on Get Started still help after every beat had one? |
| `telli-handoff` | A stand-in for Telli's naming chat, which is not part of this prototype. | none |
| `existing-device` | A stand-in for the existing "How would you like to proceed?" sheet. | none |
| `restore` | A stand-in for the restore flow. | none |

#### Scenario: Notes follow the beat
- **WHEN** a reviewer moves from `rooms` to `ginger-pod`
- **THEN** the briefing's "This screen" group changes from the explanation and questions of `rooms` to those of `ginger-pod`, and "This flow" stays the same
