## MODIFIED Requirements

### Requirement: Home
`home` SHALL show a greeting, a "Pods" section label and one pod row for Ginger, with Ginger's avatar, the title "Ginger" and the breadcrumb "Pets". The app tab bar SHALL be shown with Home active. Activating the Ginger row SHALL open Ginger on the tab the run starts pods on. Activating the Ask Telli or Navigation tab SHALL be recorded and SHALL do nothing else. Activating Home SHALL do nothing.

#### Scenario: Open Ginger
- **WHEN** a participant on `home` activates the Ginger row in a run that starts pods on the Notes tab
- **THEN** `ginger-notes` is shown

#### Scenario: Ask Telli is inert
- **WHEN** a participant on `home` activates Ask Telli
- **THEN** `home` stays shown

## REMOVED Requirements

### Requirement: Pod opening tab
**Reason**: Pods now open on the Notes tab by default in every flow; replaced by "Pod opening tab with Notes by default".
**Migration**: Runs that relied on the Info default must now choose the Info tab through the flow's initial state.

## ADDED Requirements

### Requirement: Pod opening tab with Notes by default
The flow's initial state SHALL be able to choose whether opening Ginger from Home shows the Info tab or the Notes tab. When it does not choose, Ginger SHALL open on the Notes tab. All variants SHALL share this setting.

#### Scenario: Default opens Notes
- **WHEN** a run starts without choosing a tab and the participant opens Ginger from Home
- **THEN** `ginger-notes` is shown

#### Scenario: Opening on Info
- **WHEN** a run is started with pods opening on the Info tab and the participant opens Ginger from Home
- **THEN** `ginger-info` is shown
