## ADDED Requirements

### Requirement: Analytics in dev mode
When a production build is in dev mode turned on through the URL, as defined by `app-ux-flows/flow-runtime`, analytics SHALL NOT be sent to Matomo for the rest of that page load: no Matomo script SHALL be loaded and no Matomo request SHALL be made, whatever the analytics configuration says. Every analytics event SHALL instead be written to the browser console, as defined in "Development console output". Flows SHALL record events as usual, so the console shows what a participant's run would send. A development build's analytics SHALL be unchanged. A production build not in dev mode SHALL use the analytics configuration as before.

#### Scenario: Reviewer runs are not tracked
- **WHEN** a production build with Matomo configured is opened with `?mode=dev` and a reviewer runs an experiment
- **THEN** no Matomo script is loaded and no Matomo request is made, and each event is written to the console

#### Scenario: Dev mode survives a reload without tracking
- **WHEN** a reviewer in dev mode on a production build reloads the page without the `mode` parameter
- **THEN** the app is still in dev mode, and still sends nothing to Matomo

#### Scenario: Tracking resumes after turning dev mode off
- **WHEN** a reviewer turns dev mode off and then runs an experiment in the same tab
- **THEN** events are sent to Matomo according to the analytics configuration
