## ADDED Requirements

### Requirement: Showcase explanations and open questions
A showcase MAY declare explanations and open questions at three levels:
- **Flow:** its existing description serves as the flow's explanation, and the flow MAY declare a list of open questions.
- **Screen:** for any of its screens, the flow MAY declare an explanation (what the screen is for) and a list of open questions.
- **Case:** a case's existing description serves as the case's explanation, describing how the case differs from the others. A case MAY declare a list of open questions about the case, and for any screen, an explanation that replaces the flow's explanation of that screen and a list of open questions added after the flow's questions for that screen.

An open question is a single sentence put to the people reviewing the showcase, for example "Is it obvious that the link opens Contact info?". It is not a survey. Questions SHALL have no answer controls and SHALL NOT be recorded. Explanations and questions SHALL be shown through i18next, and each list SHALL keep its declaration order. Experiments SHALL NOT be able to declare them; declaring any of them on an experiment SHALL fail type checking.

#### Scenario: Case adds to a screen's questions
- **WHEN** a showcase declares two questions for screen `tidy-confirm` and its case B declares one more question for `tidy-confirm`
- **THEN** a run of case B on `tidy-confirm` lists the two flow questions followed by the case's question, and a run of case A lists only the two flow questions

#### Scenario: Case replaces a screen's explanation
- **WHEN** a showcase explains screen `notes-tidied` and its case B declares its own explanation of `notes-tidied`
- **THEN** a run of case B on `notes-tidied` shows only case B's explanation of that screen

#### Scenario: Experiments cannot declare questions
- **WHEN** an experiment definition declares open questions or a screen explanation
- **THEN** `pnpm check-types` reports an error

### Requirement: Explanations and questions in the briefing
While a showcase run is shown, the briefing side panel, and the Goal overlay at phone widths, SHALL show the following groups after the existing briefing content and its actions, each separated from the previous one:
1. **"This screen"**: the current screen's explanation and its open questions;
2. **"This case"**: the case's explanation and its open questions, only when the run is in a case;
3. **"This flow"**: the flow's explanation and its open questions.

Within a group, the explanation SHALL come first, followed by the label "Open questions" and the questions as a list. A group with neither an explanation nor questions SHALL NOT be shown, and a group with no questions SHALL NOT show the "Open questions" label. The "This screen" group SHALL follow the current screen, like the hint. The groups SHALL be shown to everyone, in development and production builds alike, including after "Goal reached". The mission card SHALL NOT show them.

#### Scenario: Notes follow the screen
- **WHEN** a reviewer in SC-PPL-001 case A moves from `notes` to `tidy-confirm`
- **THEN** the "This screen" group changes from the explanation and questions of `notes` to those of `tidy-confirm`, while "This case" and "This flow" stay the same

#### Scenario: Screen without notes
- **WHEN** the current screen has no explanation and no open questions
- **THEN** no "This screen" group is shown, and the "This case" and "This flow" groups are still shown when they have content

#### Scenario: Phone width
- **WHEN** a showcase run is shown at a width of 480 px or less and the reviewer opens the Goal overlay
- **THEN** the overlay shows the same "This screen", "This case" and "This flow" groups as the side panel

#### Scenario: Not on the mission card
- **WHEN** the mission card is shown at the start of a run
- **THEN** it shows no explanation and no open question
