## MODIFIED Requirements

### Requirement: Home
`home` SHALL show:
- the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field;
- a card with the title "Create your first Pod" and the message "A Pod is a private little room for any info — your kid, a trip, a project. Fill it with info, files, and notes and start collaborating. Every Pod you create or receive from others is automatically organized into Tellipod categories.";
- a "+ Add Pod" action on the card;
- a "Maybe later" action on the card;
- the app tab bar, with Home active.

Activating "+ Add Pod" SHALL show `new-pod`. Activating the Ask Telli tab SHALL show `telli`. "Maybe later", the search field, the Home, Notifications and Navigation tabs and the rest of the screen SHALL do nothing. All cases SHALL offer both "+ Add Pod" and Ask Telli; only the goal tells the tester which way to use.

#### Scenario: Open New Pod
- **WHEN** a tester on `home` activates "+ Add Pod"
- **THEN** `new-pod` is shown

#### Scenario: Open Telli
- **WHEN** a tester on `home` activates the Ask Telli tab
- **THEN** `telli` is shown with Ask Telli active

#### Scenario: Notifications does nothing
- **WHEN** a tester on `home` activates Notifications
- **THEN** `home` stays shown and nothing changes

#### Scenario: New Home top bar
- **WHEN** a tester opens `home` in any case
- **THEN** the avatar "A" is shown beside "Welcome, Alice", with "Device-to-device sharing, pod members only." under it and the "Search, or ask Telli…" field below

#### Scenario: Search does nothing
- **WHEN** a tester on `home` activates the search field
- **THEN** `home` stays shown and nothing changes
