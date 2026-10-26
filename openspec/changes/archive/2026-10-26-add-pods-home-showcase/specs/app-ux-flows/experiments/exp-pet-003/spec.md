## MODIFIED Requirements

### Requirement: Home
`home` SHALL show the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field, then the pods section defined by `app-ux-flows/design-system` with the label "Recent Pods", no "See all pods" link and one pod card for Ginger, with Ginger's avatar, the title "Ginger" and the breadcrumb "Pets". The app tab bar SHALL be shown with Home active. Activating the Ginger card SHALL open Ginger on the tab the run starts pods on. Activating the Ask Telli, Notifications or Navigation tab SHALL be recorded and SHALL do nothing else. Activating the search field SHALL be recorded and SHALL do nothing else. Activating Home SHALL do nothing.

#### Scenario: Open Ginger
- **WHEN** a participant on `home` activates the Ginger card in a run that starts pods on the Notes tab
- **THEN** `ginger-notes` is shown

#### Scenario: Ask Telli is inert
- **WHEN** a participant on `home` activates Ask Telli
- **THEN** `home` stays shown

#### Scenario: Notifications is inert
- **WHEN** a participant on `home` activates the Notifications tab
- **THEN** `app_tab_selected` is recorded with `tab` `notifications` and `home` stays shown

#### Scenario: Search is recorded
- **WHEN** a participant on `home` activates the search field
- **THEN** `search_selected` is recorded and `home` stays shown

#### Scenario: Recent Pods section
- **WHEN** a participant opens `home`
- **THEN** the header "RECENT PODS" is shown without a "See all pods" link, above one Ginger card with the breadcrumb "Pets"
