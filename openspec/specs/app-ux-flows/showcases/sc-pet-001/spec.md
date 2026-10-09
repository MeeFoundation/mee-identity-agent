# app-ux-flows/showcases/sc-pet-001 Specification

## Purpose

Defines the research scenario SC-PET-001 "Create Ginger" in `app-ux-flows`. Alice creates a pod for her cat Ginger. The category is optional, so she can create a generic pod by name alone. Once she is inside the pod, the app suggests a Pet template, and applying it adds the pet-specific structure. The scenario studies structure as a byproduct of use rather than a prerequisite. It is a deterministic, clickable prototype for usability testing, shown as a showcase: it has no variants and records no analytics.

## Requirements

### Requirement: Scenario identity and screens
The application SHALL register a showcase flow with flow id `sc-pet-001`, display code `SC-PET-001`, title "Create Ginger" and the description "Create a pod for your cat by name, then add pet structure from a suggested template." It SHALL have no variants. It SHALL be listed after the existing flows.

The flow SHALL declare these screens:
- `home`: the Home screen (01).
- `new-pod`: the New Pod sheet, both while empty (02) and once a name is entered (03).
- `pod-empty`: the new, generic pod (04).
- `pod-template-suggested`: the pod with a template suggestion (05).
- `pod-template-applied`: the pod after the Pet template was applied (06).

`home` SHALL be the initial screen. Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame |
|---|---|
| `home` | Home - 1 |
| `new-pod` | Home / New Pod (modal) |
| `pod-empty` | Cell New - 2 |

`pod-template-suggested` and `pod-template-applied` have no Figma frame and SHALL NOT declare one.

#### Scenario: Start the scenario
- **WHEN** a tester starts "Create Ginger" from the home page
- **THEN** the Home screen is shown at `/flows/sc-pet-001/home`, with no `variant` URL parameter

#### Scenario: Scenario code in the catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Create Ginger" is listed with the code `SC-PET-001`

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
- a "Maybe later" action on the card.

Activating "+ Add Pod" SHALL show `new-pod`. "Maybe later" and the rest of the screen SHALL do nothing.

#### Scenario: Open New Pod
- **WHEN** a tester on `home` activates "+ Add Pod"
- **THEN** `new-pod` is shown

### Requirement: New Pod with an optional category
`new-pod` SHALL show a bottom sheet over Home with:
- the title "New Pod";
- the description "A digital room for one part of your life. You’ll invite people and add things once this Pod is created.";
- a "Pod name" text field, empty at run start;
- a "Your role in this Pod" text field, empty at run start and optional;
- a "Category" select showing "Choose category" at run start;
- a "Create Pod" button.

The Category select SHALL list the categories whose template adds structure to a pod; in this scenario that is Pets. Choosing a category SHALL be optional.

"Create Pod" SHALL be unavailable while the name is empty or only whitespace, whatever the category. The entered values SHALL be kept in the scenario state for the rest of the run.

Activating "Create Pod" SHALL create the pod:
- with no category chosen, it SHALL show `pod-empty`;
- with Pets chosen, the pod SHALL be created with the Pets template already applied, and `pod-template-applied` SHALL be shown without a suggestion.

Creating SHALL happen at most once per run. Returning to `new-pod` after the pod was created SHALL show the sheet with "Create Pod" unavailable and the caption "Pod created".

Dismissing the sheet, by tapping outside it or pressing Escape, SHALL perform a back navigation and SHALL NOT create a pod.

#### Scenario: Empty sheet
- **WHEN** a tester opens `new-pod` in a new run
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

#### Scenario: Dismiss without creating
- **WHEN** a tester dismisses the sheet
- **THEN** `home` is shown and no pod has been created

### Requirement: Generic pod
A pod created without a category SHALL have no category. It SHALL take:
- the trimmed name as its name,
- the entered role as the creator's role,
- one member, the creator,
- the first letter of its name as its avatar,
- no breadcrumb,
- no forms, following the ontology's template for a pod without a category.

`pod-empty`, `pod-template-suggested` and `pod-template-applied` SHALL show the pod top bar with:
- a back control,
- the pod's avatar, name and breadcrumb,
- a menu control,
- three tabs: Notes, Chat and Info, with Info selected.

Activating the back control SHALL show `home`, not the New Pod sheet the pod came from. The tabs and the menu control SHALL do nothing.

`pod-empty` SHALL show, in this order:
1. a "Forms" section label;
2. an empty-state card with the title "You have no forms yet.", the message "Forms help you hold this pod’s information." and a "+ Add form" action that does nothing;
3. a divider;
4. the rows Attachments 0, Subpods 0 and Members 1, which do nothing.

`pod-empty` SHALL NOT show Medical, Care & Feeding or Pet information.

#### Scenario: Back to Home
- **WHEN** a tester on `pod-empty`, `pod-template-suggested` or `pod-template-applied` activates the back control
- **THEN** `home` is shown, and the pod keeps its state for the rest of the run

#### Scenario: Ginger is still generic
- **WHEN** a tester creates the pod "Ginger" without a category
- **THEN** `pod-empty` shows the title "Ginger", the avatar letter "G", no breadcrumb, the empty Forms card, and Attachments 0, Subpods 0 and Members 1, with no Medical, Care & Feeding or Pet information

### Requirement: Template suggestion
About 1.5 seconds after `pod-empty` is shown, the scenario SHALL show `pod-template-suggested` in its place. This happens only if all of these hold:
- the pod exists,
- the pod has no category,
- the suggestion has not been dismissed in this run.

`pod-template-suggested` SHALL show the content of `pod-empty`, with a suggestion card above the Forms section. For the Pets template, the card reads:
- the title "Is {name} a pet?", where {name} is the pod's name;
- the message "Add a Pet template to keep medical, care and feeding information organized.";
- the actions "Not now" and "Use template".

The card's content SHALL come from the suggested template, not from conditions on the pod's name.

Activating "Not now" SHALL dismiss the suggestion and show `pod-empty`. The pod stays generic, and the suggestion SHALL NOT be shown again in that run. Activating "Use template" SHALL apply the suggested template to the pod and show `pod-template-applied`.

#### Scenario: Suggestion appears
- **WHEN** a tester creates the pod "Ginger" without a category and waits on `pod-empty`
- **THEN** after about 1.5 seconds `pod-template-suggested` is shown with "Is Ginger a pet?", "Not now" and "Use template"

#### Scenario: Not now
- **WHEN** a tester activates "Not now"
- **THEN** `pod-empty` is shown with Ginger still generic, and waiting on it does not bring the suggestion back

#### Scenario: Use template
- **WHEN** a tester activates "Use template"
- **THEN** `pod-template-applied` is shown

### Requirement: Pet template applied
Applying the Pets template SHALL:
- set the pod's category to Pets,
- show the pod's taxonomy breadcrumb, as in the Figma pod header: the category's icon followed by the category's path in the category tree, top first, separated by chevrons. For Pets this is the Pets icon and "Pets"; a pod in a sub-category such as Medical would show "Pets > Medical",
- add the forms the Pets template declares, not yet filled in.

The pod's name, avatar, role and members SHALL NOT change. Applying SHALL be idempotent. A pod created with Pets chosen SHALL have the same structure as a generic pod that later had the Pets template applied.

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
When `pod-empty`, `pod-template-suggested` or `pod-template-applied` is opened in a run in which no pod was created, the scenario SHALL first create the generic pod "Ginger", as if the tester had created it without a category. When `pod-template-applied` is opened in a run in which the template was not applied, the scenario SHALL apply it. When `pod-template-suggested` is opened directly, it SHALL show the suggestion for the default template.

#### Scenario: Direct link to the result
- **WHEN** someone opens `/flows/sc-pet-001/pod-template-applied` in a new run
- **THEN** Ginger is shown with the Pets breadcrumb and the Pet information section

#### Scenario: Direct link to the empty pod
- **WHEN** someone opens `/flows/sc-pet-001/pod-empty` in a new run
- **THEN** the generic pod "Ginger" is shown

### Requirement: Scenario completion
Reaching `pod-template-applied` SHALL complete the run silently, by either path: through the suggestion, or by choosing Pets on `new-pod`. The screen stays visible and no completion view is shown. This SHALL also apply when it is opened directly by URL. The run SHALL be completed at most once. Reaching `pod-empty` SHALL NOT complete the run.

#### Scenario: Completion keeps Ginger visible
- **WHEN** a tester activates "Use template"
- **THEN** `pod-template-applied` stays on screen and no completion view is shown
