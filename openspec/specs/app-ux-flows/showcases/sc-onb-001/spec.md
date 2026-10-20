# app-ux-flows/showcases/sc-onb-001 Specification

## Purpose

Defines the showcase SC-ONB-001 "Tellipod intro: Rooms" in `app-ux-flows`. It is a clickable version of the "v1 · Rooms" first-run intro from the "Tellipod Intro" prototype: four beats that explain pods as private rooms, Telli as an assistant you invite, sharing a pod with another person's phone, and devices as the place pods live. It is for demos and discussion: it has no variants or cases, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-onb-001`, display code `SC-ONB-001`, title "Tellipod intro: Rooms" and the description "The first-run intro that shows pods as rooms in a home on your phone, Telli tidying a pod, and Paula joining it from her phone." It SHALL declare no cases, so the home page offers a single start action. Its goal SHALL be "Go through the intro and get started with Tellipod." It SHALL be listed after the existing flows, in both development and production builds. Its code family `SC-ONB` SHALL have the title "Onboarding", used once the family holds more than one flow.

The flow SHALL declare these screens:
- `rooms`: beat 1, "Pods are small private rooms.";
- `ginger-pod`: beat 2, "Telli tidies. You decide.", including every state of its Telli demo;
- `paula`: beat 3, "Invite Paula. Same pod, her phone.";
- `welcome`: beat 4, "Welcome to Tellipod. Host your world.";
- `telli-handoff`: the stand-in for Get Started;
- `existing-device`: the stand-in for "Already have Tellipod on another device?";
- `restore`: the stand-in for "Restoring from backup?".

`rooms` SHALL be the initial screen. No screen SHALL declare a Figma frame.

#### Scenario: Start the showcase
- **WHEN** a reviewer starts "Tellipod intro: Rooms" on the home page
- **THEN** `rooms` is shown at `/flows/sc-onb-001/rooms` with the mission card showing the goal

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Tellipod intro: Rooms" is listed with the code `SC-ONB-001`, no cases, and the screens `rooms`, `ginger-pod`, `paula`, `welcome`, `telli-handoff`, `existing-device` and `restore`, each marked as having no Figma frame

### Requirement: Intro layout
Each beat screen (`rooms`, `ginger-pod`, `paula`, `welcome`) SHALL show, from top to bottom:
- a top bar with a Back control on the left on every beat except `rooms`, the Tellipod logo in the centre, and a "Skip" control on the right on every beat except `welcome`;
- the animated scene (see "Animated scene");
- the beat's headline and subline, with the accented words in the brand colour;
- the beat's actions;
- on every beat except `welcome`, a pager of four dots with the current beat's dot drawn wider and in the brand colour.

The headlines and sublines SHALL be:

| Beat | Headline (accented part in bold) | Subline |
|---|---|---|
| `rooms` | "**Pods** are small private rooms." | "One for your kid, a trip, your cat." |
| `ginger-pod` | "Telli tidies. **You decide.**" | "Telli, your AI assistant, sees only pods you invite it into." |
| `paula` | "Invite Paula. **Same pod**, her phone." | "Direct device-to-device sharing, pod members only." |
| `welcome` | "Welcome to **Tellipod**. Host your world." | "Pods live on your devices, not in a corporate data center." |

The headline of `rooms` and `ginger-pod` SHALL break after "small" and after "tidies." respectively, and the others after "Paula." and "Tellipod.". On `rooms`, `ginger-pod` and `paula` the action SHALL be a secondary "Next" button that moves to the next beat. Back SHALL move to the previous beat and Skip to `welcome`. The logo and the pager SHALL NOT react to input. The pager SHALL be announced to assistive technology as "Step N of 4", and "Next" SHALL carry the same hint. The headline, subline, actions and pager SHALL follow the scene continuously: each beat's copy slides and fades in and out with the camera, and the pager's current dot moves with it.

The four beat screens SHALL be one continuous scene: moving between them SHALL NOT reload or redraw the scene from scratch. The URL and the briefing SHALL follow the beat: when the scene passes the middle of a move, the URL SHALL show the screen id of the beat it is nearest to, so the briefing's notes and hint follow it.

#### Scenario: Next moves forward
- **WHEN** a reviewer on `rooms` activates "Next"
- **THEN** the scene moves to `ginger-pod`, the URL becomes `/flows/sc-onb-001/ginger-pod`, and the second pager dot is current

#### Scenario: Back moves back
- **WHEN** a reviewer on `paula` activates Back
- **THEN** the scene moves back to `ginger-pod`

#### Scenario: Skip goes to the last beat
- **WHEN** a reviewer on `rooms`, `ginger-pod` or `paula` activates "Skip"
- **THEN** the scene fades out, `welcome` is shown with the whole story complete, and the scene fades back in

#### Scenario: Browser back
- **WHEN** a reviewer on `paula` uses the browser's back navigation to `/flows/sc-onb-001/ginger-pod`
- **THEN** the scene moves back to `ginger-pod`, as with Back

### Requirement: Animated scene
The scene SHALL be the isometric world of the "Tellipod Intro" prototype's "v1 · Rooms" version, drawn and animated as in the prototype: one world viewed through a camera, not a picture per beat. Its motion SHALL match the prototype's timings and easing. In particular:
- **Camera.** Each beat has a camera framing: the whole home (`rooms`), a close-up of Ginger's room (`ginger-pod`), your home and Paula's phone side by side (`paula`), and the whole home again (`welcome`). Moving between beats SHALL pan and zoom the camera continuously between framings (about 800 ms for one beat, eased), never cut.
- **`rooms`.** When the intro starts, the home SHALL assemble: the phone and the house shell appear, then the Kyoto trip, Ginger and Sofia rooms and the empty room, with a short halo. The tags "Kyoto trip" (airplane icon), "Ginger" (cat avatar, brand tone) and "Sofia" (initial "S") drop in next to their rooms.
- **`ginger-pod`.** As the camera arrives in Ginger's room, the pod card docks next to the Ginger tag, the other rooms dim, and the note is written into the card. Telli waits outside the closed door. "Invite Telli" plays the next part of the story: the door opens, Telli comes in, the note line is lifted into the card's Info tab, and the rows Meals and Portion arrive marked "(suggested)". "Add all suggested info" plays the last part: the rows are confirmed and the button folds away.
- **`paula`.** The camera pulls out while Paula's phone appears. A one-time key travels to it, a dotted line draws from Ginger's room to Paula's phone, and Paula's room lights up. Both phones show a synced Ginger card, the sync icons turn, and "Ginger's fed!" arrives on both.
- **`welcome`.** The camera returns to the whole home. Ginger's tag shows the members you, Telli and Paula and a red new-message dot, and the dotted line still leaves Ginger's room.

The tags, the pod card, the synced cards and member avatars SHALL be real text drawn over the scene, positioned on the world so they move with the camera. The scene SHALL scale to the space between the top bar and the copy, keeping its framing. The scene SHALL have the text alternatives in "Scene text alternatives".

On `rooms`, the "Ginger" tag SHALL be a button labelled "Enter Ginger's pod" with the hint "Same as Next", and activating it SHALL move to `ginger-pod`. The other tags SHALL NOT react to input.

#### Scenario: Camera move
- **WHEN** a reviewer on `rooms` activates "Next"
- **THEN** the camera zooms continuously from the whole home into Ginger's room, and the pod card docks beside the Ginger tag

#### Scenario: Ginger tag opens the pod
- **WHEN** a reviewer on `rooms` activates the "Ginger" tag
- **THEN** the scene moves to `ginger-pod`, as with "Next"

#### Scenario: Story plays on Next
- **WHEN** a reviewer on `ginger-pod` activates "Next" without inviting Telli
- **THEN** the rest of beat 2's story plays first (Telli comes in, the info is suggested and added), and then the camera moves to `paula`

### Requirement: Swipe between beats
On the four beat screens, dragging horizontally on the scene or the copy SHALL scrub through the intro: the camera, the story and the copy SHALL follow the finger or pointer continuously, one beat per beat-width of drag. Dragging past the first or last beat SHALL resist like a rubber band. Releasing SHALL settle on the nearest beat, taking the release velocity into account, and SHALL move at most one beat from where the drag started. A short drag that doesn't move SHALL count as a tap, so the controls under it still work. Vertical drags SHALL NOT scrub.

#### Scenario: Drag to the next beat
- **WHEN** a reviewer on `rooms` drags the scene from right to left by more than half a beat and releases
- **THEN** the scene settles on `ginger-pod` and the URL follows

#### Scenario: Fling
- **WHEN** a reviewer on `ginger-pod` flicks quickly from left to right over a short distance
- **THEN** the scene settles back on `rooms`

#### Scenario: Rubber band
- **WHEN** a reviewer on `rooms` drags from left to right
- **THEN** the scene moves only a little, resisting, and returns to `rooms` on release

### Requirement: Reduced motion
When the reviewer prefers reduced motion, moving between beats SHALL fade the scene out and back in at the next beat instead of moving the camera, and the Telli demo's steps SHALL change with a short fade instead of playing. Swiping SHALL change beats on release once the drag passes a fifth of the width, without scrubbing. The scene SHALL show the same end state of each beat as with motion.

#### Scenario: Reduced motion
- **WHEN** a reviewer whose system prefers reduced motion activates "Next" on `rooms`
- **THEN** the scene fades to `ginger-pod` without a camera move

### Requirement: Scene text alternatives
The scene SHALL be announced with these text alternatives:

| Beat | Text alternative |
|---|---|
| `rooms` | "Illustration: a small home standing on a phone. Its rooms are pods named Kyoto trip, Ginger and Sofia. A cat sits in Ginger's room." |
| `ginger-pod` | the "before", "suggested" or "added" text in "Telli demo" |
| `paula` | "Your phone and Paula's phone. A one-time link opened the same Ginger pod on her phone, joined directly by one line. Paula says: Ginger's fed!" |
| `welcome` | "Your home again. Ginger's pod now has you, Telli and Paula, and a new message." |

#### Scenario: Beat 2 alternative follows the demo
- **WHEN** a reviewer on `ginger-pod` activates "Invite Telli" and the story finishes playing
- **THEN** the scene is announced with the "suggested" text

### Requirement: Telli demo
`ginger-pod` SHALL show, over the scene, a "Ginger" tag followed by member avatars, and a pod card with the tabs Notes, Chat and Info. The tabs SHALL show which one is selected but SHALL NOT react to input. The demo SHALL have three states:

1. **Before** (on first arrival): the "you" member avatar only; Notes selected; the note "#ginger" (in the tag colour) and "feeds 7am & 6pm, ½ cup dry"; and an "Invite Telli" button with the Telli icon and the hint "Demo, optional. Opens the door for Telli. Nothing is shared.". Text alternative: "Inside Ginger's pod. A note says: feeds 7am and 6pm, half cup dry. Telli waits outside the door."
2. **Suggested** (after "Invite Telli" has played): the Telli avatar joins the members, Telli is inside the room; Info selected; the rows "Meals: 7:00 AM · 6:00 PM" and "Portion: ½ cup, dry food", each labelled "(suggested)" with the Telli icon and an add icon; and an "Add all suggested info" button with the hint "Demo, optional. Nothing is saved.". Text alternative: "Telli came in and suggested info from the note: meals 7:00 AM and 6:00 PM; portion half a cup of dry food. It waits for you to add it."
3. **Added**: every row is a plain saved row with an edit icon, and "Add all suggested info" is gone. Text alternative: "You added the suggested info. Ginger's pod now has you and Telli."

"Invite Telli" SHALL be available only while the scene rests on `ginger-pod` in **Before**, and "Add all suggested info" only while it rests there in **Suggested**. The rows' add and edit icons SHALL NOT react to input. Shortly after the scene comes to rest on `ginger-pod` in **Before** or **Suggested**, the available button SHALL pulse once to draw attention, unless it was pressed before. The demo SHALL be optional: "Next", "Skip", Back and swiping SHALL work in every state. Returning to `ginger-pod` SHALL show the demo in the state the reviewer left it in. Nothing in the demo SHALL be stored outside the run.

#### Scenario: Invite Telli
- **WHEN** a reviewer resting on `ginger-pod` activates "Invite Telli"
- **THEN** the door opens and Telli comes in, the card switches to Info with Meals and Portion marked "(suggested)", the Telli avatar appears next to the Ginger tag, and "Add all suggested info" is shown

#### Scenario: Add all
- **WHEN** the reviewer then activates "Add all suggested info"
- **THEN** both rows lose "(suggested)" and show an edit icon, and the button folds away

#### Scenario: Skipping the demo
- **WHEN** a reviewer on `ginger-pod` activates "Next" without inviting Telli
- **THEN** `paula` is shown exactly as it is after completing the demo

#### Scenario: Demo is kept
- **WHEN** a reviewer invites Telli, moves to `paula` and activates Back
- **THEN** `ginger-pod` shows the demo in the **Suggested** state

### Requirement: Shared pod on two phones
`paula` SHALL show, over the scene, two labelled cards:
- "Paula's phone" with an avatar "P": a "Ginger" card with a sync icon, the rows "Meals 7:00 AM · 6:00 PM" and "Portion ½ cup, dry food", and Paula's own message "Ginger's fed!" at "7:05", drawn as a sent message;
- "Your phone", with the member avatars you, Telli and Paula: the same "Ginger" card, with Paula's message drawn as a received message from "P".

Both cards SHALL show the same values. `paula` SHALL look the same whether or not the Telli demo was used.

#### Scenario: Same pod on both phones
- **WHEN** a reviewer reaches `paula`
- **THEN** both cards show Meals "7:00 AM · 6:00 PM", Portion "½ cup, dry food" and "Ginger's fed!" at 7:05, sent on Paula's phone and received on yours

### Requirement: Welcome actions and stand-ins
`welcome` SHALL show a primary "Get Started" button with the hint "Opens Telli, your assistant", followed by the links "Already have Tellipod on another device?" and "Restoring from backup?". Activating them SHALL show `telli-handoff`, `existing-device` and `restore` respectively.

Each stand-in screen SHALL show, centred, a "Prototype stand-in" badge, an avatar with an icon, a title, a body ending with "Only the intro is built in this prototype." and a "Replay intro" link:

| Screen | Icon | Title | Body |
|---|---|---|---|
| `telli-handoff` | Telli | "Hey, I'm Telli!" | "Get Started continues into Telli's naming chat in the existing onboarding." |
| `existing-device` | phone | "Already have Tellipod on another device?" | "This link opens the existing "How would you like to proceed?" sheet." |
| `restore` | cloud | "Restoring from backup?" | "This link opens the restore flow." |

The stand-ins SHALL have no top bar and no pager. "Replay intro" SHALL start a new run on `rooms`. Showing `telli-handoff` SHALL complete the run without the completion view, so the briefing shows "Goal reached". The two link stand-ins SHALL NOT complete the run.

#### Scenario: Get Started reaches the goal
- **WHEN** a reviewer on `welcome` activates "Get Started"
- **THEN** `telli-handoff` shows "Hey, I'm Telli!", and the briefing shows "Goal reached"

#### Scenario: Link stand-in
- **WHEN** a reviewer on `welcome` activates "Restoring from backup?"
- **THEN** `restore` is shown and the run is not completed

#### Scenario: Replay
- **WHEN** a reviewer on any stand-in activates "Replay intro"
- **THEN** `rooms` is shown in a new run

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- Does the "rooms in a home" picture make pods clear before people have any of their own?
- Four beats: is anything missing, or could one go?
- Should the Telli demo be required, or stay optional as it is now?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `rooms` | Pods as rooms in a home on your phone: a trip, a cat and a kid each get one. | Are "Kyoto trip", "Ginger" and "Sofia" good examples? · Is it obvious that the Ginger tag can be tapped? |
| `ginger-pod` | Telli only enters a pod you invite it into, and only suggests. Nothing is saved until you add it. | Is "Invite Telli" clear as an optional demo? · Is "(suggested)" enough to tell Telli's info from yours? |
| `paula` | The same pod on Paula's phone, shared directly between devices with pod members only. | Is it clear that Paula sees the same pod, not a copy? · Does "device-to-device" mean anything to people at this point? |
| `welcome` | Pods live on your devices. From here the existing onboarding takes over. | Should the two links be this prominent on a first run? |
| `telli-handoff` | A stand-in for Telli's naming chat, which is not part of this prototype. | none |
| `existing-device` | A stand-in for the existing "How would you like to proceed?" sheet. | none |
| `restore` | A stand-in for the restore flow. | none |

#### Scenario: Notes follow the beat
- **WHEN** a reviewer moves from `rooms` to `ginger-pod`
- **THEN** the briefing's "This screen" group changes from the explanation and questions of `rooms` to those of `ginger-pod`, and "This flow" stays the same
