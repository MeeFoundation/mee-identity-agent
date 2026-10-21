# app-ux-flows/showcases/sc-onb-004 Specification

## Purpose

Defines the showcase SC-ONB-004 "Tellipod intro: Onboarding v2" in `app-ux-flows`. It is a clickable version of the Onboarding v2 prototype: a one-minute tour of pods, then local profile setup. It is for demos and comparison with SC-ONB-001–003. It has no variants or cases, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-onb-004`, display code `SC-ONB-004`, title "Tellipod intro: Onboarding v2" and the description "The next first-run: a one-minute tour of pods, then set up a local profile. No account." It SHALL declare no cases, so the home page offers a single start action. Its goal SHALL be "Go through the intro and get started with Tellipod." It SHALL be listed directly after SC-ONB-003, in both development and production builds. The `SC-ONB` family SHALL still group on the home page under "Onboarding".

The flow SHALL declare these screens: `landing` (initial), `pod-anything`, `share-once`, `yours-to-keep`, `setup`, `profile-choose`, `profile-form`, `devices`, `pairing` and `next`. No screen SHALL declare a Figma frame.

#### Scenario: Start the showcase
- **WHEN** a reviewer starts "Tellipod intro: Onboarding v2" on the home page
- **THEN** `landing` is shown at `/flows/sc-onb-004/landing` with the mission card showing the goal

#### Scenario: Onboarding family on the home page
- **WHEN** a reviewer opens the home page
- **THEN** the three existing intros and "Tellipod intro: Onboarding v2" are listed together under "Onboarding"

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Tellipod intro: Onboarding v2" is listed with the code `SC-ONB-004`, no cases, and the screens listed above, each marked as having no Figma frame

### Requirement: Other onboarding showcases unchanged
SC-ONB-001, SC-ONB-002 and SC-ONB-003 SHALL keep their screens, copy, motion and stand-ins. This showcase SHALL NOT share scene code with `pods/tellipod-intro/`.

#### Scenario: Existing intros still start on rooms
- **WHEN** a reviewer starts "Tellipod intro: Rooms"
- **THEN** `rooms` is shown for SC-ONB-001, not `landing`

### Requirement: Landing
`landing` SHALL show the Tellipod wordmark, the headline "Get to know Tellipod in a minute", a decorative cluster of the logo and people, a primary **Show me around** action, and a secondary **I know Tellipod, skip to setup** action.

#### Scenario: Enter the tour
- **WHEN** the reviewer presses Show me around
- **THEN** `pod-anything` is shown at `/flows/sc-onb-004/pod-anything`

#### Scenario: Skip to setup
- **WHEN** the reviewer presses I know Tellipod, skip to setup
- **THEN** `setup` is shown, without playing the tour

### Requirement: Tour navigation
The tour SHALL have three beats: `pod-anything`, `share-once`, `yours-to-keep`. Each beat SHALL show a top bar with Back on the left, the Tellipod wordmark in the centre, and Skip on the right except on `yours-to-keep`. The first two beats SHALL offer **Next**; the last SHALL offer **Got it, let's set up**. A pager SHALL be announced as "Step N of 3", with the current step's mark drawn wider. Skip and the last-beat action SHALL open `setup`. Back on `pod-anything` SHALL return to `landing`; Back on a later beat SHALL return to the previous beat. The URL and the briefing SHALL follow the current beat.

#### Scenario: Next moves forward
- **WHEN** the reviewer on `pod-anything` presses Next
- **THEN** `share-once` is shown at `/flows/sc-onb-004/share-once` and the pager is on step 2 of 3

#### Scenario: Skip from the tour
- **WHEN** the reviewer on `pod-anything` or `share-once` presses Skip
- **THEN** `setup` is shown

### Requirement: Beat 1 — a pod for anything
`pod-anything` SHALL show the headline "A pod for anything" and a phone-card scene with tabs Trip, Care, Pets, Reno and Books. The scene SHALL auto-advance through the examples about every 5.6 seconds until the reviewer picks a tab or swipes the card. Each example SHALL show its pod name, a note, members, and the caption:

| Tab | Pod name | Caption |
|---|---|---|
| Trip | Lisbon trip | Everyone has the same plan, even offline. |
| Care | Mom's care | You and your siblings see the same meds list, always current. |
| Pets | Pet care | The walker always has the latest vet number. |
| Reno | Kitchen reno | Quotes and decisions in one place, not lost in texts. |
| Books | Book club | The next book and host, without scrolling back. |

#### Scenario: Choosing an example
- **WHEN** the reviewer presses the Reno tab
- **THEN** the Kitchen reno card and its caption are shown, and auto-advance stops

### Requirement: Beat 2 — share once
`share-once` SHALL show the headline "Share it once. Everyone stays up to date." and a scene of a Pet care card between a Dog walker and a Partner. The scene SHALL play a share story: the card is shared, the others receive it, the vet phone updates from 555-0142 to 555-0199 on the shared copies, and the people confirm they are in sync.

#### Scenario: Share story plays
- **WHEN** `share-once` is shown
- **THEN** the share story runs through to the synced vet number without further input

### Requirement: Beat 3 — yours to keep
`yours-to-keep` SHALL not show its internal title as a visible headline. It SHALL reveal, in sequence, the lines "No accounts.", "No data centers.", "No ads.", "No tracking.", then dim those lines and show "Just you and the people you choose." as the prominent closing line.

#### Scenario: Closing line
- **WHEN** beat 3 has finished its sequence
- **THEN** "Just you and the people you choose." is the prominent line and the four "No …" lines are dimmed

### Requirement: Setup chooser
`setup` SHALL show "Let's set up your Tellipod", "Just two quick steps: your name, then your other devices. No account or password.", a phone illustration, **Set up on this phone**, and **Pair with my other device**. Back SHALL return to `yours-to-keep`, or to `landing` if the reviewer skipped the tour.

#### Scenario: Set up on this phone
- **WHEN** the reviewer presses Set up on this phone
- **THEN** `profile-choose` is shown

#### Scenario: Pair from the chooser
- **WHEN** the reviewer presses Pair with my other device
- **THEN** `pairing` is shown

### Requirement: Profile chooser
`profile-choose` SHALL show "Set up your profile", "This is how you'll appear to others on Tellipod.", a people illustration, **Fill in from my contact card**, **Enter details manually**, and "Saved on your device only. No cloud, no servers."

#### Scenario: Manual details
- **WHEN** the reviewer presses Enter details manually
- **THEN** `profile-form` is shown, empty except for a default country code

### Requirement: Simulated contact card
Fill in from my contact card SHALL use in-app permission and picker dialogs on `profile-choose` that match the prototype's contact-access sequence. It SHALL NOT call the operating system's Contacts API. Confirming a fixture contact SHALL open `profile-form` filled with that contact. Declining SHALL open `profile-form` empty.

#### Scenario: Don't allow
- **WHEN** the reviewer declines the simulated contacts prompt
- **THEN** `profile-form` is shown empty

### Requirement: Profile form
`profile-form` SHALL collect first name (required), last name, optional email, and optional phone with a country-code control, plus the prototype's privacy copy. Continue SHALL not leave the screen while first name is empty. Continuing SHALL show `devices` labelled "{first name}'s Tellipod". Nothing SHALL be saved outside this run.

#### Scenario: First name required
- **WHEN** the reviewer presses Continue with an empty first name
- **THEN** `profile-form` stays shown

#### Scenario: Continue with a name
- **WHEN** the reviewer enters a first name and presses Continue
- **THEN** `devices` is shown with that name on the this-phone label

### Requirement: Devices step
`devices` SHALL show "Do you use more than one device?", explain that spaces live only on this phone until another device is paired, an illustration of this phone beside other devices, **Pair another device**, **I'll do this later**, and that pairing can be done later in Settings.

#### Scenario: Pair another device
- **WHEN** the reviewer presses Pair another device
- **THEN** `pairing` is shown and the run is not completed

### Requirement: Stand-ins and completion
`pairing` SHALL be a sheet titled "Pairing another device" that says this part of setup is still being designed. Closing it SHALL return to `devices` without completing the run.

`next` SHALL be a sheet titled "What comes next" with the same "still being designed" body. Pressing I'll do this later SHALL show `next` and SHALL complete the run without the completion view, so the briefing shows "Goal reached".

Each stand-in SHALL offer "Replay intro", which starts a new run on `landing`.

#### Scenario: Close pairing
- **WHEN** the reviewer closes `pairing`
- **THEN** `devices` is shown and the run is not completed

#### Scenario: Finish setup
- **WHEN** the reviewer presses I'll do this later
- **THEN** `next` is shown and the briefing shows "Goal reached"

#### Scenario: Replay
- **WHEN** the reviewer on `pairing` or `next` activates Replay intro
- **THEN** `landing` is shown in a new run

### Requirement: Reduced motion
When the reviewer prefers reduced motion, looping and choreographed motion on landing, the three beats and the devices illustration SHALL NOT play. The rest state of each scene SHALL be shown instead.

#### Scenario: Beat 1 without looping
- **WHEN** reduced motion is preferred and `pod-anything` is shown
- **THEN** one pod example is shown and it does not auto-advance

#### Scenario: Beat 2 without the share play
- **WHEN** reduced motion is preferred and `share-once` is shown
- **THEN** the scene is shown already in its synced rest state

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- Is a one-minute tour clearer than the four-beat rooms story?
- Does skipping to setup make it too easy to miss what a pod is?
- Should simulated contacts stay in a demo, or only a manual form?

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `landing` | Offer a short tour or skip straight to local setup. | Is "in a minute" a promise we can keep? |
| `pod-anything` | Pods are for anything you share: a trip, care, pets, a reno, a book club. | Do the five examples help, or is one enough? |
| `share-once` | Share once; everyone sees the same vet number. | Does the share play read as device-to-device, or as chat? |
| `yours-to-keep` | No accounts, data centers, ads or tracking. | Does the closing line land after the "No …" list? |
| `setup` | Two steps: name, then other devices. No password. | Is pairing this early a distraction? |
| `profile-choose` | Appear as yourself. Data stays on the device. | Is "contact card" meaningful before a real OS prompt? |
| `profile-form` | First name is enough to continue. | Are email and phone too much for a first run? |
| `devices` | Spaces live on this phone until you pair another. | Is "I'll do this later" the right way out? |
| `pairing` | Stand-in: pairing is not built in this prototype. | none |
| `next` | Stand-in: what comes after setup is not built here. | none |

#### Scenario: Notes follow the screen
- **WHEN** a reviewer moves from `landing` to `pod-anything`
- **THEN** the briefing's "This screen" group changes from the explanation and questions of `landing` to those of `pod-anything`, and "This flow" stays the same
