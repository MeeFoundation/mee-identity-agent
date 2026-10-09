## ADDED Requirements

### Requirement: Showcases are not tracked
Flow analytics SHALL apply only to experiments. A run of a showcase SHALL NOT be an analytics Flow Run. For a showcase, the application SHALL NOT:
- record lifecycle events or interaction events,
- deliver any flow event to any analytics destination, including the development console,
- send Matomo page views or Matomo events,
- create a run id or store a resumable run.

The showcase SHALL behave exactly as it would with analytics disabled: it starts, navigates, restarts and completes normally. Screens and shared components used by a showcase MAY call the interaction API, and those calls SHALL have no effect. Experiments SHALL be tracked as before, including when a participant opens an experiment after a showcase in the same browser tab.

#### Scenario: Running a showcase sends nothing
- **WHEN** Matomo is configured and a viewer runs `chat-add-medication` from its first screen to completion
- **THEN** Matomo receives no page view and no event for that run, and the development console shows no flow analytics entry

#### Scenario: Reloading a showcase
- **WHEN** a viewer reloads a screen of `chat-add-medication`
- **THEN** no `flow_resumed`, `flow_started` or `screen_viewed` is recorded

#### Scenario: Experiment after a showcase
- **WHEN** a participant returns to the home page from a showcase and starts `exp-pet-002`
- **THEN** `exp-pet-002` gets a new run id and records `flow_started` and `screen_viewed` as usual
