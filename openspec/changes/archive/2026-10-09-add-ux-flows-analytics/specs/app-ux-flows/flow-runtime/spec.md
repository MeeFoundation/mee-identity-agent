## MODIFIED Requirements

### Requirement: Explicit flow completion
A screen SHALL be able to explicitly mark its run as complete. By default, a completed run SHALL show the participant a completion view with options to restart the flow or return to the list of flows. A screen MAY instead complete the run silently: the run is marked complete, but the current and later screens keep rendering normally and no completion view is shown. This is for flows whose end state is a real screen. A run SHALL be completed at most once. Later completion requests in the same run SHALL be ignored, whichever mode they use. Completion SHALL be observable by the application outside the flow's screens, so that it can be recorded.

#### Scenario: Completing a run
- **WHEN** a screen marks the run as complete
- **THEN** the participant is shown the completion view and the application is notified once that this run completed

#### Scenario: Completing a run silently
- **WHEN** a screen marks the run as complete without the completion view
- **THEN** the participant keeps seeing that screen and can keep navigating the flow, and the application is notified once that this run completed

#### Scenario: Repeated completion is ignored
- **WHEN** a run was already completed, silently or not, and a screen requests completion again
- **THEN** the application is not notified again and the visible screen does not change

#### Scenario: Completed run is not re-entered as in-progress
- **WHEN** a participant uses browser back/forward, or opens another screen URL of the same flow, while the run is completed with the completion view
- **THEN** the completion view keeps being shown instead of an in-progress screen, until the run is restarted or a new run starts
