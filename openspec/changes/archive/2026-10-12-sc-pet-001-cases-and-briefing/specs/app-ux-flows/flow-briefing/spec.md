## Purpose

Defines how a showcase briefs the person running it in `app-ux-flows`. It covers what they are asked to do (the goal), a hint for the screen they are on, a mission card when a run starts, a "Goal reached" moment, and a way to start over. Showcases are demonstrated or tested in moderated sessions without analytics, so the brief is the only place the task lives inside the app.

## ADDED Requirements

### Requirement: Goals and hints
A showcase MAY declare a goal: one sentence telling the tester what they are asked to achieve. Each of its cases (see "Showcase cases" in `app-ux-flows/flow-runtime`) MAY declare its own goal, which replaces the showcase's goal for runs of that case.

A showcase MAY declare a hint for any of its screens: one sentence about what to do on that screen. A case MAY replace the hint of any screen. Screens without a hint have none.

Goals and hints SHALL be shown through i18next. Experiments SHALL NOT show a briefing, whatever they declare.

#### Scenario: Case goal replaces the showcase goal
- **WHEN** a showcase declares the goal "Create a pod for your cat Ginger" and its case B declares "Ask Telli to create a pod for your new cat, Ginger"
- **THEN** a run of case B shows the case's goal, and no part of the briefing shows the showcase's goal

#### Scenario: Experiments are not briefed
- **WHEN** an experiment is run
- **THEN** no mission card, goal, hint, "Goal reached" message or "Start over" action from this capability is shown

### Requirement: Mission card
When a showcase run starts on its initial screen, including after "Start over", the application SHALL show a mission card over the phone frame. The card SHALL show:
- the flow's title;
- the case's display code and name, when the run is in a case;
- the label "Your goal" and the goal, when one is declared;
- a "Start" action.

The screen behind the card SHALL NOT be operable. Activating "Start" SHALL close the card and leave the initial screen in place. The card SHALL be shown at most once per run. A run opened directly on any other screen SHALL NOT show the card.

#### Scenario: Briefed before the first tap
- **WHEN** a tester starts SC-PET-001 case C from the home page
- **THEN** a card shows "Create Ginger", "SC-PET-001-C" with the case name, "Your goal" and case C's goal, and the Home screen behind it cannot be used until "Start" is activated

#### Scenario: No card on a direct link
- **WHEN** someone opens a showcase directly on a screen other than its initial screen
- **THEN** no mission card is shown

### Requirement: Briefing side panel
While a showcase run is shown at desktop widths, the side panel next to the phone frame SHALL show, below the existing "Back to all flows" link and flow title:
- the case's display code and name, when the run is in a case;
- "Your goal" and the goal, when one is declared;
- "On this screen" and the current screen's hint, when it has one;
- a "Start over" action.

The hint SHALL change as the tester moves between screens.

At phone widths, where the side panel is hidden, the application SHALL show a small "Goal" button over the top of the screen area. Activating it SHALL open the same content in an overlay, and the overlay SHALL close with a close action or Escape.

#### Scenario: Hint follows the screen
- **WHEN** a tester in case C moves from `home` to `telli`
- **THEN** the side panel's "On this screen" text changes from the hint for `home` to the hint for `telli`

#### Scenario: Phone width
- **WHEN** a showcase run is shown at a width of 480 px or less
- **THEN** a "Goal" button is visible, and activating it shows the goal, the current hint and "Start over"

### Requirement: Goal reached
When a showcase run completes, the briefing SHALL show "Goal reached" with the message "You reached the goal of this case." (or "of this flow." for a showcase without cases). It SHALL show it in the side panel, and in the Goal overlay at phone widths, which SHALL open by itself. Next to the message it SHALL show:
- "Start over";
- for a showcase with cases, one "Try case {code}" action for every other case, which starts a fresh run of that case.

The phone screen SHALL stay as it is.

#### Scenario: Try another case
- **WHEN** a tester completes SC-PET-001 case A
- **THEN** the side panel shows "Goal reached", "Start over", "Try case SC-PET-001-B" and "Try case SC-PET-001-C", and activating "Try case SC-PET-001-B" starts a fresh run of case B on its initial screen with its mission card

### Requirement: Start over
A showcase run SHALL be restartable at any time through the briefing's "Start over" action. Starting over SHALL behave as the flow restart defined by `app-ux-flows/flow-runtime`: same case, the run's initial state, the initial screen, and no completed status. It SHALL then show the mission card again. Experiments SHALL NOT offer "Start over" outside their completion view.

#### Scenario: Start over mid-run
- **WHEN** a tester in SC-PET-001 case A has created Ginger and activates "Start over"
- **THEN** Home is shown in case A with no pod, an empty New Pod sheet behind "+ Add Pod", and the mission card
