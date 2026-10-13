## MODIFIED Requirements

### Requirement: Scenario identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-001`, display code `SC-PET-001`, title "Create Ginger" and the description "Create a pod for your cat by name, then add pet structure from a suggested template." It SHALL have the three cases defined in "Cases and goals". It SHALL be listed after the existing flows.

The flow SHALL declare these screens:
- `home`: the Home screen (01).
- `telli`: the global Telli chat, reached from the Ask Telli tab.
- `new-pod`: the New Pod sheet, both while empty (02) and once a name is entered (03).
- `pod-empty`: the new, generic pod (04).
- `pod-template-suggested`: the pod with a template suggestion (05).
- `pod-template-applied`: the pod after the Pet template was applied (06).

`home` SHALL be the initial screen in every case. Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame |
|---|---|
| `home` | Home - 1 |
| `telli` | Pod / Chat - 5 |
| `new-pod` | Home / New Pod (modal) |
| `pod-empty` | Cell New - 2 |

`pod-template-suggested` and `pod-template-applied` have no Figma frame and SHALL NOT declare one. "Pod / Chat - 5" is a pod's chat; `telli` follows its chat design under a Telli top bar.

#### Scenario: Start the scenario
- **WHEN** a tester chooses case B of "Create Ginger" on the home page
- **THEN** the Home screen is shown at `/flows/sc-pet-001/home?case=b`, with case B's mission card

#### Scenario: Scenario code in the catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Create Ginger" is listed with the code `SC-PET-001` and its cases with the codes `SC-PET-001-A`, `SC-PET-001-B` and `SC-PET-001-C`

### Requirement: Home
`home` SHALL show:
- the greeting "Welcome, Alice";
- a card with the title "Create your first Pod" and the message "A Pod is a private little room for any info — your kid, a trip, a project. Fill it with info, files, and notes and start collaborating. Every Pod you create or receive from others is automatically organized into Tellipod categories.";
- a "+ Add Pod" action on the card;
- a "Maybe later" action on the card;
- the app tab bar, with Home active.

Activating "+ Add Pod" SHALL show `new-pod`. Activating the Ask Telli tab SHALL show `telli`. "Maybe later", the Home and Navigation tabs and the rest of the screen SHALL do nothing. All cases SHALL offer both "+ Add Pod" and Ask Telli; only the goal tells the tester which way to use.

#### Scenario: Open New Pod
- **WHEN** a tester on `home` activates "+ Add Pod"
- **THEN** `new-pod` is shown

#### Scenario: Open Telli
- **WHEN** a tester on `home` activates the Ask Telli tab
- **THEN** `telli` is shown with Ask Telli active

### Requirement: New Pod with an optional category
`new-pod` SHALL show a bottom sheet with:
- the title "New Pod";
- the description "A digital room for one part of your life. You’ll invite people and add things once this Pod is created.";
- a "Pod name" text field;
- a "Your role in this Pod" text field, optional;
- a "Category" select showing "Choose category" while no category is chosen;
- a "Create Pod" button.

The sheet SHALL be shown over the screen it was opened from: Home when opened with "+ Add Pod", or `telli` when opened from a quick action without a name. Opened by a direct link, it SHALL be shown over Home.

When opened with "+ Add Pod", the fields SHALL hold what was entered before in the run, empty at run start. When opened from a quick action, the name SHALL be emptied and the category SHALL be replaced by the action's category, or left unset where the action has none. The role SHALL be kept. While the category is the one a quick action provided, the caption "Suggested by Telli from your chat" SHALL be shown under the Category select. Changing the category SHALL remove the caption.

The Category select SHALL list the categories whose template adds structure to a pod; in this scenario that is Pets. Choosing a category SHALL be optional.

"Create Pod" SHALL be unavailable while the name is empty or only whitespace, whatever the category. The entered values SHALL be kept in the scenario state for the rest of the run.

Activating "Create Pod" SHALL create the pod:
- with no category chosen, it SHALL show `pod-empty`;
- with Pets chosen, the pod SHALL be created with the Pets template already applied, and `pod-template-applied` SHALL be shown without a suggestion.

Creating SHALL happen at most once per run. Returning to `new-pod` after the pod was created SHALL show the sheet with "Create Pod" unavailable and the caption "Pod created".

Dismissing the sheet, by tapping outside it or pressing Escape, SHALL perform a back navigation and SHALL NOT create a pod.

#### Scenario: Empty sheet
- **WHEN** a tester opens `new-pod` with "+ Add Pod" in a new run
- **THEN** Pod name and Your role are empty, Category shows "Choose category", and "Create Pod" is unavailable

#### Scenario: Name without a category is enough
- **WHEN** a tester types "Ginger" into Pod name and leaves Category on "Choose category"
- **THEN** "Create Pod" becomes available

#### Scenario: Create generic Ginger
- **WHEN** a tester enters "Ginger", leaves Category unset and activates "Create Pod"
- **THEN** `pod-empty` is shown with the title "Ginger"

#### Scenario: Create Ginger as a pet up front
- **WHEN** a tester enters "Ginger", chooses Pets and activates "Create Pod"
- **THEN** `pod-template-applied` is shown with the breadcrumb "Pets", and no suggestion is shown

#### Scenario: Pre-filled by Telli
- **WHEN** a tester activates a quick action holding the category Pets and no name
- **THEN** `new-pod` is shown over `telli` with an empty Pod name, Category "Pets", the caption "Suggested by Telli from your chat", and "Create Pod" unavailable until a name is entered

#### Scenario: Dismiss without creating
- **WHEN** a tester dismisses the sheet
- **THEN** the screen it was opened from is shown and no pod has been created

## ADDED Requirements

### Requirement: Cases and goals
SC-PET-001 SHALL have three cases, each with its own display code, name and goal:

| Case | Code | Name | Goal |
|---|---|---|---|
| `a` | SC-PET-001-A | With the Add Pod button | Create a pod for your cat Ginger using the Add Pod button. |
| `b` | SC-PET-001-B | With Telli, one message | Ask Telli to create a pod for your new cat, Ginger. |
| `c` | SC-PET-001-C | With Telli, a conversation | Tell Telli about your new pet and let it help you create Ginger’s pod. |

The cases SHALL share every screen and differ only in their goal, their hints and their Telli conversation (see "Telli conversation"). The showcase SHALL declare these hints, which every case uses unless the table says otherwise:

| Screen | Hint |
|---|---|
| `home` | A: "Start a new pod from the Home screen." B, C: "Open Ask Telli from the bottom bar." |
| `telli` | "Send the message, then use Telli’s card when you’re ready." |
| `new-pod` | A: "Name the pod and create it." B, C: "Check what Telli filled in, then create the pod." |
| `pod-empty` | "Take a look — the app may suggest something." |
| `pod-template-suggested` | "Decide whether to use the Pet template." |

`pod-template-applied` SHALL have no hint.

#### Scenario: Case-specific hint
- **WHEN** a tester in case B is on `home`
- **THEN** the briefing's "On this screen" hint reads "Open Ask Telli from the bottom bar."

### Requirement: Telli chat
`telli` SHALL show the global Telli chat:
- a top bar with Telli's avatar and the title "Telli";
- the conversation;
- a composer with the placeholder "Write your message. Tag @Telli for help...";
- the app tab bar, with Ask Telli active.

The conversation SHALL start with Telli's greeting "Hey! I am @Telli, tag me whenever you need help." Messages SHALL use the shared chat components, styled after "Pod / Chat - 4" and "Pod / Chat - 5".

The tester SHALL NOT type freely. While the case's conversation has a next message for the tester, the composer SHALL hold that message, and the tester can only send it. Otherwise the composer SHALL be empty and sending SHALL NOT be possible.

Sending SHALL:
1. show the message as the user's bubble with "Sending…" under it;
2. after about 0.8 seconds, change the status to "Sent" and show "@Telli is thinking...";
3. after about 2.5 more seconds, replace the thinking line with Telli's reply.

After the reply, the composer SHALL hold the next message, if there is one. Each step SHALL happen at most once per run. The conversation SHALL be kept, and resume from its current step, when the tester leaves `telli` and returns.

Activating the Home tab SHALL show `home`. The Navigation tab SHALL do nothing.

#### Scenario: Telli is thinking
- **WHEN** a tester in case B sends the prepared message
- **THEN** after about 0.8 seconds "Sent" is shown under it with "@Telli is thinking...", and about 2.5 seconds later Telli's reply replaces the thinking line

#### Scenario: Nothing to say in case A
- **WHEN** a tester in case A opens `telli`
- **THEN** only Telli's greeting is shown and the composer cannot send

### Requirement: Telli conversation
Each case SHALL define its conversation as data: an ordered list of turns, each with the tester's message, Telli's reply, and optionally a quick action that comes with that reply. The `telli` screen SHALL play whatever conversation its case defines, and SHALL contain no case-specific conditions. A quick action to create a pod SHALL carry a pod draft: an optional name and an optional category.

The cases SHALL define:

| Case | Tester sends | Telli replies | Quick action draft |
|---|---|---|---|
| `a` | (no turns) | | |
| `b` | "@Telli create new pet Ginger" | "Here’s a pod for Ginger. Check the details and create it." | name "Ginger", category Pets |
| `c` | "@Telli I have a new pet!" | "Congrats! What’s its name?" | category Pets |
| `c` | "It’s Ginger" | "What a beautiful name! Shall I create a pod for Ginger?" | name "Ginger", category Pets |

#### Scenario: Conversation in two turns
- **WHEN** a tester in case C sends "@Telli I have a new pet!" and Telli has replied
- **THEN** Telli's reply carries a quick action with the category Pets and no name, and the composer holds "It’s Ginger"

### Requirement: Quick actions in the Telli chat
A quick action SHALL be shown as a chat action card inside the Telli reply that carries it:
- title: the draft's name, with its first letter as the avatar, or "New pod" when the draft has no name;
- rows: "Category" with the category's label, when the draft has one;
- action: "Create pod".

Every card SHALL keep the draft it was shown with, and activating "Create pod" SHALL act on that card's draft, even after newer cards have appeared:
- when the draft has a name, the pod SHALL be created at once from the draft, without showing `new-pod`, keeping the role entered earlier in the run. The chat is the confirmation. The created pod SHALL then be shown as after "Create Pod" in the sheet: `pod-template-applied` with a category, `pod-empty` without one;
- when the draft has no name, `new-pod` SHALL open pre-filled from the draft, as defined in "New Pod with an optional category".

Once the pod is created, the card it was created from, directly or through the sheet, if any, SHALL show the status "Pod created" and the action "Open pod". That action SHALL show `pod-template-applied` when the pod has a category and `pod-empty` otherwise. Every other card's action SHALL be unavailable.

#### Scenario: Act early
- **WHEN** a tester in case C activates "Create pod" on Telli's first card, after the second card has appeared
- **THEN** `new-pod` opens with an empty Pod name and Category "Pets"

#### Scenario: Act on the full card
- **WHEN** a tester in case B activates "Create pod" on Telli's card
- **THEN** no sheet is shown, `pod-template-applied` is shown for "Ginger" with the breadcrumb "Pets", and the run completes

#### Scenario: Card after creation
- **WHEN** a tester returns to `telli` after creating the pod from a card
- **THEN** that card shows "Pod created" and "Open pod", and every other card's "Create pod" is unavailable
