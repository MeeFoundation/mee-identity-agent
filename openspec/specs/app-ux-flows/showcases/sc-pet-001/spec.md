# app-ux-flows/showcases/sc-pet-001 Specification

## Purpose

Defines the research scenario SC-PET-001 "Create Ginger" in `app-ux-flows`. Alice creates a pod for her cat Ginger. The category is optional, so she can create a generic pod by name alone. Once she is inside the pod, the app suggests a Pet template, and applying it adds the pet-specific structure. The scenario studies structure as a byproduct of use rather than a prerequisite. It is a deterministic, clickable prototype for usability testing, shown as a showcase: it has no variants and records no analytics.

## Requirements

### Requirement: Scenario identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-001`, display code `SC-PET-001`, title "Create Ginger" and the description "Create a pod for your cat by name, then add pet structure from a suggested template." It SHALL have the three cases defined in "Cases and goals". It SHALL be listed after the existing flows.

The flow SHALL declare these screens:
- `home`: the Home screen (01).
- `telli`: the global Telli chat, reached from the Ask Telli tab.
- `new-pod`: the New Pod sheet, both while empty (02) and once a name is entered (03).
- `pod-notes`: the pod's Notes tab, where the pod opens.
- `pod-empty`: the new, generic pod's Info tab (04).
- `pod-template-suggested`: the Info tab with a template suggestion (05).
- `pod-template-applied`: the Info tab after the Pet template was applied (06).

`home` SHALL be the initial screen in every case. Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame |
|---|---|
| `home` | Home - 1 |
| `telli` | Pod / Chat - 5 |
| `new-pod` | Home / New Pod (modal) |
| `pod-empty` | Cell New - 2 |

`pod-notes`, `pod-template-suggested` and `pod-template-applied` have no Figma frame and SHALL NOT declare one. "Pod / Chat - 5" is a pod's chat; `telli` follows its chat design under a Telli top bar.

#### Scenario: Start the scenario
- **WHEN** a tester chooses case B of "Create Ginger" on the home page
- **THEN** the Home screen is shown at `/flows/sc-pet-001/home?case=b`, with case B's mission card

#### Scenario: Scenario code in the catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Create Ginger" is listed with the code `SC-PET-001` and its cases with the codes `SC-PET-001-A`, `SC-PET-001-B` and `SC-PET-001-C`, and `pod-notes` is listed among its screens

### Requirement: Shared scenario state
A run SHALL keep one record of the pod, shared by every screen. Its observable state SHALL be:
- `podName`: the name entered on `new-pod`, trimmed once the pod is created;
- `podCreated`: whether the pod exists;
- `petTemplateApplied`: whether the Pet template has been applied to the pod.

At run start `podName` SHALL be empty and the other two SHALL be false. Every screen after creation SHALL show the name from this state; no screen SHALL hardcode "Ginger". The template to suggest SHALL come from the flow's initial state, defaulting to the Pets template, and SHALL NOT be decided inside the pod screens. No screen SHALL fetch data.

#### Scenario: The entered name is the shown name
- **WHEN** a tester creates a pod named "Luna"
- **THEN** `pod-empty`, `pod-template-suggested` and `pod-template-applied` show "Luna" as the title, and the suggestion asks "Is Luna a pet?"

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
- a "Category" select showing "Choose category" while no category is chosen;
- a "Create Pod" button.

The sheet SHALL NOT ask for the creator's role in the pod.

The sheet SHALL be shown over the screen it was opened from: Home when opened with "+ Add Pod", or `telli` when opened from a quick action without a name. Opened by a direct link, it SHALL be shown over Home.

When opened with "+ Add Pod", the fields SHALL hold what was entered before in the run, empty at run start. When opened from a quick action, the name SHALL be emptied and the category SHALL be replaced by the action's category, or left unset where the action has none. While the category is the one a quick action provided, the caption "Suggested by Telli from your chat" SHALL be shown under the Category select. Changing the category SHALL remove the caption.

The Category select SHALL list the categories whose template adds structure to a pod; in this scenario that is Pets. Choosing a category SHALL be optional.

"Create Pod" SHALL be unavailable while the name is empty or only whitespace, whatever the category. The entered values SHALL be kept in the scenario state for the rest of the run.

Activating "Create Pod" SHALL create the pod and open it on `pod-notes`:
- with no category chosen, the pod SHALL be generic;
- with Pets chosen, the pod SHALL be created with the Pets template already applied, and no suggestion SHALL be offered.

Creating SHALL happen at most once per run. Returning to `new-pod` after the pod was created SHALL show the sheet with "Create Pod" unavailable and the caption "Pod created".

Dismissing the sheet, by tapping outside it or pressing Escape, SHALL perform a back navigation and SHALL NOT create a pod.

#### Scenario: Empty sheet
- **WHEN** a tester opens `new-pod` with "+ Add Pod" in a new run
- **THEN** Pod name is empty, Category shows "Choose category", no role field is shown, and "Create Pod" is unavailable

#### Scenario: Name without a category is enough
- **WHEN** a tester types "Ginger" into Pod name and leaves Category on "Choose category"
- **THEN** "Create Pod" becomes available

#### Scenario: Create generic Ginger
- **WHEN** a tester enters "Ginger", leaves Category unset and activates "Create Pod"
- **THEN** `pod-notes` is shown with the title "Ginger" and no breadcrumb

#### Scenario: Create Ginger as a pet up front
- **WHEN** a tester enters "Ginger", chooses Pets and activates "Create Pod"
- **THEN** `pod-notes` is shown with the breadcrumb "Pets", no dot on the Info tab, and selecting Info shows `pod-template-applied`

#### Scenario: Pre-filled by Telli
- **WHEN** a tester activates a quick action holding the category Pets and no name
- **THEN** `new-pod` is shown over `telli` with an empty Pod name, Category "Pets", the caption "Suggested by Telli from your chat", and "Create Pod" unavailable until a name is entered

#### Scenario: Dismiss without creating
- **WHEN** a tester dismisses the sheet
- **THEN** the screen it was opened from is shown and no pod has been created

### Requirement: Generic pod
A pod created without a category SHALL have no category. It SHALL take:
- the trimmed name as its name,
- one member, the creator,
- the first letter of its name as its avatar,
- no breadcrumb,
- no forms, following the ontology's template for a pod without a category.

`pod-notes`, `pod-empty`, `pod-template-suggested` and `pod-template-applied` SHALL show the pod top bar with:
- a back control,
- the pod's avatar, name and breadcrumb,
- a menu control,
- three tabs: Notes, Chat and Info, with Notes selected on `pod-notes` and Info selected on the other three.

Activating the back control SHALL show `home`, not the New Pod sheet the pod came from. Activating Notes SHALL show `pod-notes`. Activating Info SHALL show the pod's Info tab as defined in "Pod Info tab". The Chat tab and the menu control SHALL do nothing.

`pod-notes` SHALL show the pod's note area and formatting toolbar, as on the Notes tab of the Ginger pod flows, with the same placeholder. Typing SHALL be possible. The text SHALL be kept for the rest of the run and has no other effect. The toolbar buttons SHALL do nothing.

`pod-empty` SHALL show, in this order:
1. a "Forms" section label;
2. an empty-state card with the title "You have no forms yet.", the message "Forms help you hold this pod’s information." and a "+ Add form" action that does nothing;
3. a divider;
4. the rows Attachments 0, Subpods 0 and Members 1, which do nothing.

`pod-empty` SHALL NOT show Medical, Care & Feeding or Pet information.

#### Scenario: Back to Home
- **WHEN** a tester on `pod-notes`, `pod-empty`, `pod-template-suggested` or `pod-template-applied` activates the back control
- **THEN** `home` is shown, and the pod keeps its state for the rest of the run

#### Scenario: Ginger opens on Notes
- **WHEN** a tester creates the pod "Ginger" without a category
- **THEN** `pod-notes` shows the title "Ginger", the avatar letter "G", no breadcrumb, the Notes tab selected and the empty note area

#### Scenario: Ginger is still generic
- **WHEN** a tester on `pod-notes` of the generic pod "Ginger" selects Info before any suggestion is ready
- **THEN** `pod-empty` shows the empty Forms card, and Attachments 0, Subpods 0 and Members 1, with no Medical, Care & Feeding or Pet information

#### Scenario: Notes are kept
- **WHEN** a tester types a note on `pod-notes`, switches to Info and back to Notes
- **THEN** the typed note is still shown

### Requirement: Pod Info tab
Activating the Info tab on `pod-notes` SHALL show:
- `pod-template-applied` when the pod has a category;
- otherwise `pod-template-suggested` when the suggestion is ready;
- otherwise `pod-empty`.

Activating Notes on any of those three screens SHALL show `pod-notes`.

#### Scenario: Info for a pet pod
- **WHEN** a tester on `pod-notes` of a pod with the Pets template selects Info
- **THEN** `pod-template-applied` is shown

#### Scenario: Notes from Info
- **WHEN** a tester on `pod-template-suggested` selects Notes
- **THEN** `pod-notes` is shown, the suggestion stays ready, and the Info tab shows a dot

### Requirement: Template suggestion
About 1.5 seconds after the pod is first shown, on either tab, the suggestion SHALL become ready. This happens only if all of these hold:
- the pod exists,
- the pod has no category,
- a template to suggest was given,
- the suggestion has not been dismissed in this run.

The suggestion SHALL stay ready until it is dismissed or the template is applied. While it is ready:
- on `pod-notes`, the Info tab SHALL show a dot, and the Notes content SHALL NOT change;
- `pod-empty` SHALL be replaced by `pod-template-suggested`, both when the tester is already on it and when the tester opens the Info tab.

`pod-template-suggested` SHALL show the content of `pod-empty`, with a suggestion card above the Forms section. For the Pets template, the card reads:
- the title "Is {name} a pet?", where {name} is the pod's name;
- the message "Add a Pet template to keep medical, care and feeding information organized.";
- the actions "Not now" and "Use template".

The card's content SHALL come from the suggested template, not from conditions on the pod's name.

Activating "Not now" SHALL dismiss the suggestion and show `pod-empty`. The pod stays generic, the dot SHALL disappear, and the suggestion SHALL NOT be shown again in that run. Activating "Use template" SHALL apply the suggested template to the pod and show `pod-template-applied`.

#### Scenario: Suggestion appears
- **WHEN** a tester creates the pod "Ginger" without a category and waits on `pod-notes`
- **THEN** after about 1.5 seconds a dot appears on the Info tab, and `pod-notes` otherwise stays the same

#### Scenario: Suggestion on Info
- **WHEN** a tester on `pod-notes` selects Info while the dot is shown
- **THEN** `pod-template-suggested` is shown with "Is Ginger a pet?", "Not now" and "Use template"

#### Scenario: Info opened early
- **WHEN** a tester selects Info on `pod-notes` before the suggestion is ready, and waits
- **THEN** `pod-empty` is shown, and once the suggestion is ready `pod-template-suggested` is shown in its place

#### Scenario: Not now
- **WHEN** a tester activates "Not now"
- **THEN** `pod-empty` is shown with Ginger still generic, waiting on it does not bring the suggestion back, and the Info tab shows no dot on `pod-notes`

#### Scenario: Use template
- **WHEN** a tester activates "Use template"
- **THEN** `pod-template-applied` is shown, and the Info tab shows no dot on `pod-notes`

#### Scenario: Nothing to suggest
- **WHEN** a run starts with no template to suggest and the tester creates a generic pod
- **THEN** no dot ever appears on the Info tab and the Info tab always shows `pod-empty`

### Requirement: Pet template applied
Applying the Pets template SHALL:
- set the pod's category to Pets,
- show the pod's taxonomy breadcrumb, as in the Figma pod header: the category's icon followed by the category's path in the category tree, top first, separated by chevrons. For Pets this is the Pets icon and "Pets"; a pod in a sub-category such as Medical would show "Pets > Medical",
- add the forms the Pets template declares, not yet filled in.

The pod's name, avatar and members SHALL NOT change. Applying SHALL be idempotent. A pod created with Pets chosen SHALL have the same structure as a generic pod that later had the Pets template applied.

`pod-template-applied` SHALL show, in this order:
1. a "Pet information" section label;
2. a "Pet information" row for the Pet profile form declared by the template;
3. a "Medical" row and a "Care & Feeding" row, taken from the narrower categories of Pets;
4. a divider;
5. the rows Attachments 0, Subpods 0 and Members 1.

The rows SHALL do nothing in this scenario. The visual design SHALL use the same components as the other pod screens.

#### Scenario: Pet structure
- **WHEN** a tester accepts the Pet template for "Ginger"
- **THEN** `pod-template-applied` shows the title "Ginger", the Pets icon and the breadcrumb "Pets", the "Pet information" section with Pet information, Medical and Care & Feeding, and Attachments 0, Subpods 0 and Members 1

### Requirement: Direct links
When `pod-notes`, `pod-empty`, `pod-template-suggested` or `pod-template-applied` is opened in a run in which no pod was created, the scenario SHALL first create the generic pod "Ginger", as if the tester had created it without a category. When `pod-template-applied` is opened in a run in which the template was not applied, the scenario SHALL apply it. When `pod-template-suggested` is opened directly, it SHALL show the suggestion for the default template.

#### Scenario: Direct link to the result
- **WHEN** someone opens `/flows/sc-pet-001/pod-template-applied` in a new run
- **THEN** Ginger is shown with the Pets breadcrumb and the Pet information section

#### Scenario: Direct link to the empty pod
- **WHEN** someone opens `/flows/sc-pet-001/pod-empty` in a new run
- **THEN** the generic pod "Ginger" is shown

#### Scenario: Direct link to Notes
- **WHEN** someone opens `/flows/sc-pet-001/pod-notes` in a new run
- **THEN** the generic pod "Ginger" is shown on its Notes tab, and after about 1.5 seconds the Info tab shows a dot

### Requirement: Scenario completion
The run SHALL complete silently once the pod with the Pets template applied is shown, on either tab: through the suggestion, by choosing Pets on `new-pod`, or from a Telli quick action that carries Pets. The screen stays visible and no completion view is shown. This SHALL also apply when `pod-template-applied` is opened directly by URL. The run SHALL be completed at most once. Showing a generic pod, on `pod-notes` or `pod-empty`, SHALL NOT complete the run.

#### Scenario: Completion keeps Ginger visible
- **WHEN** a tester activates "Use template"
- **THEN** `pod-template-applied` stays on screen and no completion view is shown

#### Scenario: Created as a pet
- **WHEN** a tester creates "Ginger" with Pets chosen
- **THEN** the run completes while `pod-notes` is shown

#### Scenario: Generic pod does not complete
- **WHEN** a tester creates a generic pod and stays on `pod-notes`
- **THEN** the run is not completed

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
| `pod-notes` | "Look around the pod — a dot shows where something is waiting." |
| `pod-empty` | "Take a look — the app may suggest something." |
| `pod-template-suggested` | "Decide whether to use the Pet template." |

`pod-template-applied` SHALL have no hint.

#### Scenario: Case-specific hint
- **WHEN** a tester in case B is on `home`
- **THEN** the briefing's "On this screen" hint reads "Open Ask Telli from the bottom bar."

#### Scenario: Hint on Notes
- **WHEN** a tester in any case is on `pod-notes`
- **THEN** the briefing's "On this screen" hint reads "Look around the pod — a dot shows where something is waiting."

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
- when the draft has a name, the pod SHALL be created at once from the draft, without showing `new-pod`. The chat is the confirmation. The created pod SHALL then be opened on `pod-notes`, as after "Create Pod" in the sheet;
- when the draft has no name, `new-pod` SHALL open pre-filled from the draft, as defined in "New Pod with an optional category".

Once the pod is created, the card it was created from, directly or through the sheet, if any, SHALL show the status "Pod created" and the action "Open pod". That action SHALL open the pod on `pod-notes`. Every other card's action SHALL be unavailable.

#### Scenario: Act early
- **WHEN** a tester in case C activates "Create pod" on Telli's first card, after the second card has appeared
- **THEN** `new-pod` opens with an empty Pod name and Category "Pets"

#### Scenario: Act on the full card
- **WHEN** a tester in case B activates "Create pod" on Telli's card
- **THEN** no sheet is shown, `pod-notes` is shown for "Ginger" with the breadcrumb "Pets", and the run completes

#### Scenario: Card after creation
- **WHEN** a tester returns to `telli` after creating the pod from a card
- **THEN** that card shows "Pod created" and "Open pod", and every other card's "Create pod" is unavailable

#### Scenario: Open pod lands on Notes
- **WHEN** a tester activates "Open pod" on the card the pod was created from
- **THEN** `pod-notes` is shown
