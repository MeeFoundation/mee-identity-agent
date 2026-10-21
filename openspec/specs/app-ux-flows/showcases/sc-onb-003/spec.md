# app-ux-flows/showcases/sc-onb-003 Specification

## Purpose

Defines the showcase SC-ONB-003 "Tellipod intro: Living pod" in `app-ux-flows`. It is a clickable version of the "v2 · Living pod" first-run intro from the "Tellipod Intro" prototype. It tells the same four-beat story as SC-ONB-001, but on a flat card that becomes the pod instead of an isometric home. It is for demos and for comparison with SC-ONB-001 and SC-ONB-002: it has no variants or cases, records no analytics, and carries its own explanations and open questions.

## Requirements


### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-onb-003`, display code `SC-ONB-003`, title "Tellipod intro: Living pod" and the description "The intro without the isometric home: a flat pod card grows from a deck of pods, opens, is shared and joins your list." It SHALL declare no cases, so the home page offers a single start action. Its goal SHALL be "Go through the intro and get started with Tellipod." It SHALL be listed directly after SC-ONB-002, in both development and production builds. All three onboarding showcases share the code family `SC-ONB`, so the home page SHALL group them under "Onboarding".

The flow SHALL declare the same screens as SC-ONB-001: `rooms`, `ginger-pod`, `paula` and `welcome` (the four beats), and `telli-handoff`, `existing-device` and `restore` (the stand-ins). `rooms` SHALL be the initial screen. No screen SHALL declare a Figma frame.

#### Scenario: Start the showcase
- **WHEN** a reviewer starts "Tellipod intro: Living pod" on the home page
- **THEN** `rooms` is shown at `/flows/sc-onb-003/rooms` with the mission card showing the goal

#### Scenario: Onboarding family on the home page
- **WHEN** a reviewer opens the home page
- **THEN** "Tellipod intro: Rooms", "Tellipod intro: Tap through" and "Tellipod intro: Living pod" are listed together under "Onboarding"

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Tellipod intro: Living pod" is listed with the code `SC-ONB-003`, no cases, and the screens `rooms`, `ginger-pod`, `paula`, `welcome`, `telli-handoff`, `existing-device` and `restore`, each marked as having no Figma frame

### Requirement: Top layout
Each beat screen SHALL show, from top to bottom:
- the top bar of SC-ONB-001: Back on every beat except `rooms`, the Tellipod logo, and "Skip" on every beat except `welcome`;
- the beat's headline and subline, directly under the top bar;
- the animated scene, filling the space between the copy and the "Next" button;
- on every beat except `welcome`, the "Next" button and the pager of four dots, announced as "Step N of 4".

The headlines, sublines and line breaks of `ginger-pod`, `paula` and `welcome` SHALL be the same as SC-ONB-001's. `rooms` SHALL show the headline "**Pods** for every part of life." (with "Pods" in the accent colour, broken after "every") and the subline "One for a trip, your kid, your cat.". On `welcome`, "Get Started" and the two links SHALL sit at the bottom of the screen, as in SC-ONB-001. Next, Back and Skip SHALL behave as in SC-ONB-001: Next moves to the next beat, Back to the previous beat, and Skip to `welcome` with the whole story complete. The copy and the pager SHALL follow the scene continuously. The four beats SHALL be one continuous scene, and the URL and the briefing SHALL follow the nearest beat.

When the scene would be too short to read, the screen SHALL use SC-ONB-001's layout instead.

#### Scenario: Copy above the scene
- **WHEN** a reviewer views `rooms`, `ginger-pod` or `paula`
- **THEN** the headline sits under the top bar, the scene fills the space down to the "Next" button, and the pager is shown

#### Scenario: Next moves on
- **WHEN** a reviewer on `rooms` activates "Next"
- **THEN** the scene moves to `ginger-pod` and the URL becomes `/flows/sc-onb-003/ginger-pod`

#### Scenario: Skip goes to the last beat
- **WHEN** a reviewer on `rooms`, `ginger-pod` or `paula` activates "Skip"
- **THEN** the scene fades out, `welcome` is shown with the whole story complete, and the scene fades back in

#### Scenario: Short screen
- **WHEN** a reviewer views the showcase on a screen too short for the scene
- **THEN** the screen uses SC-ONB-001's layout and every beat is still reachable

### Requirement: Flat living-pod scene
The scene SHALL be a flat card that changes shape from beat to beat. It SHALL NOT show the isometric home, the door, the cat illustration or a camera move. It SHALL have text alternatives for each beat, in the same style as SC-ONB-001's.

- On `rooms`, four pod cards SHALL fall into a deck one after another: Home, Kyoto trip, Sofia, and Ginger last, so Ginger ends on top. Each card SHALL show its pod's tile, name, category with icon and member avatars, a "Note" with one line of text, a "Files" row with one file, one chat message with its time, and an empty "Message…" field with a send button. The contents are: Home, "Bins go out Sunday night.", "Lease.pdf", A's "Plumber comes at 3" at 11:20; Kyoto trip, "Flight JL 5 lands 7:40 AM.", "Itinerary.pdf", M's "Booked the ryokan!" at 9:12; Sofia, "Soccer Tue & Thu, 5 pm.", "Insurance card.jpg", G's "I'll do Tuesday" at 8:30; Ginger, "Loves the sunny window seat.", "Vaccines.pdf", your "Vet on Friday, 10am" at 10:02. Cards behind the top card SHALL sit slightly higher and smaller, and fade out with depth. The deck SHALL finish assembling about 2.4 s after the screen opens.
- On `ginger-pod`, the Ginger card SHALL open into the pod card with the tabs Notes, Chat and Info, and Telli waiting above it, as in "Telli demo".
- On `paula`, the pod SHALL be shown on your phone and, smaller beside it, on Paula's phone, with a sync badge on each, "Paula" with the caption "Pet sitter" above Paula's phone, and the same values and messages as in SC-ONB-001.
- On `welcome`, the pod card SHALL shrink into a list of four pod rows: Ginger, Kyoto trip, Sofia and Home, each with its tile, name, category and member avatars, and a chevron. Ginger SHALL be first and highlighted, with an unread dot, its members you, Telli and Paula, and the preview "Paula: Ginger's fed!". The other rows SHALL fade with depth.

Moving between beats SHALL animate the card continuously and SHALL follow the same swipe-scrub as SC-ONB-001.

#### Scenario: Deck assembles
- **WHEN** a reviewer opens `rooms`
- **THEN** the Home, Kyoto trip and Sofia cards fall into a deck one after another, and the Ginger card lands on top, showing its note, file and message

#### Scenario: No isometric home
- **WHEN** a reviewer views any beat
- **THEN** no isometric home, door or cat illustration is shown

#### Scenario: Card opens into the pod
- **WHEN** a reviewer on `rooms` activates "Next"
- **THEN** the deck gives way to Ginger's card, which grows into the open pod with Telli above it

#### Scenario: Pods list on welcome
- **WHEN** a reviewer reaches `welcome`
- **THEN** the pod card has shrunk into a list of pods, where Ginger shows you, Telli and Paula and "Paula: Ginger's fed!"

### Requirement: Telli demo
`ginger-pod` SHALL show Ginger's pod card with the tabs Notes, Chat and Info, and a Telli key above it. The demo has three states, **Before**, **Suggested** and **Added**:
- **Before:** the Notes tab shows "#ginger" and "feeds 7am & 6pm, ½ cup dry", with the button "Invite Telli" and a formatting toolbar under it.
- **Suggested:** after "Invite Telli", Telli moves into the pod and its avatar joins the members, and the card switches to Info. It shows Meals "7:00 AM · 6:00 PM" and Portion "½ cup, dry food", each marked "(suggested)" with a plus button, and the button "Add all suggested info" appears under them.
- **Added:** after "Add all suggested info", the rows lose their "(suggested)" mark and show edit icons, and the button goes away.

The hints, text alternatives and story timing SHALL be those of SC-ONB-001's demo. The demo SHALL be optional: "Next", "Skip", Back and swiping SHALL work in every state. Swiping forward from **Before** or **Suggested** SHALL play the rest of the story before the scene moves on, as in SC-ONB-001. Returning to `ginger-pod` SHALL show the demo in the state the reviewer left it in. Nothing SHALL be stored outside the run.

#### Scenario: Run the demo
- **WHEN** a reviewer resting on `ginger-pod` activates "Invite Telli", then "Add all suggested info"
- **THEN** Telli comes in and suggests Meals and Portion, and the rows are added and show edit icons

#### Scenario: Skip the demo
- **WHEN** a reviewer on `ginger-pod` in **Before** activates "Next"
- **THEN** the rest of beat 2's story plays and the scene settles on `paula`, shown exactly as after completing the demo

### Requirement: Shared pod on two phones
`paula` SHALL show the same pod on two cards, your phone and Paula's, with the Info rows Meals "7:00 AM · 6:00 PM" and Portion "½ cup, dry food" as added, the line "Paula joined" and Paula's message "Ginger's fed!" at 7:05.

#### Scenario: Same pod on both phones
- **WHEN** a reviewer reaches `paula`
- **THEN** both cards show Meals "7:00 AM · 6:00 PM", Portion "½ cup, dry food" and "Ginger's fed!" at 7:05, sent on Paula's phone and received on yours

### Requirement: Swipe and reduced motion
Swiping between beats, the rubber band, settling on release, and the reduced-motion fades SHALL behave as in SC-ONB-001. When the reviewer prefers reduced motion, the deck SHALL appear already assembled, and moving between beats SHALL cross-fade the copy and the scene instead of morphing the card. A tap that doesn't become a drag SHALL reach the control under it.

#### Scenario: Drag to the next beat
- **WHEN** a reviewer on `rooms` drags the scene from right to left by more than half a beat and releases
- **THEN** the scene settles on `ginger-pod` and the URL follows

#### Scenario: Reduced motion
- **WHEN** a reviewer whose system prefers reduced motion opens `rooms`
- **THEN** the deck is already assembled, and "Next" cross-fades the scene to `ginger-pod` without a card morph

### Requirement: Welcome actions and stand-ins
`welcome` SHALL show "Get Started" and the links "Already have Tellipod on another device?" and "Restoring from backup?", as in SC-ONB-001. They SHALL open the stand-in screens `telli-handoff`, `existing-device` and `restore`, whose content is the same as in SC-ONB-001. "Replay intro" SHALL start a new run of SC-ONB-003 on `rooms`. Showing `telli-handoff` SHALL complete the run without the completion view, so the briefing shows "Goal reached". The link stand-ins SHALL NOT complete the run.

#### Scenario: Get Started reaches the goal
- **WHEN** a reviewer on `welcome` activates "Get Started"
- **THEN** `telli-handoff` shows "Hey, I'm Telli!", and the briefing shows "Goal reached"

#### Scenario: Replay
- **WHEN** a reviewer on any stand-in activates "Replay intro"
- **THEN** `/flows/sc-onb-003/rooms` is shown in a new run

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- Is a flat pod card clearer than the isometric home for explaining what a pod is?
- Does the deck on the first beat read as "your pods", or as a stack of cards?
- Is it clear that the pod on Paula's phone is the same pod?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `rooms` | Pods as cards in a deck: Home, Kyoto trip, Sofia and Ginger, each with a note, a file and a message. Ginger lands on top because it is the one the story follows. | Do the cards read as separate private pods? |
| `ginger-pod` | Telli only enters a pod you invite it into, and only suggests. The demo is optional. | Does the open card show enough of what a pod holds? |
| `paula` | The same pod on Paula's phone, shared directly between devices. | Does the flat version still say "device to device"? |
| `welcome` | The pod joins your list, now with Telli and Paula in it. From here the existing onboarding takes over. | Does the list make clear Ginger is one pod of many? |
| `telli-handoff` | A stand-in for Telli's naming chat, which is not part of this prototype. | none |
| `existing-device` | A stand-in for the existing "How would you like to proceed?" sheet. | none |
| `restore` | A stand-in for the restore flow. | none |

#### Scenario: Notes follow the beat
- **WHEN** a reviewer moves from `rooms` to `ginger-pod`
- **THEN** the briefing's "This screen" group changes from the explanation and questions of `rooms` to those of `ginger-pod`, and "This flow" stays the same
