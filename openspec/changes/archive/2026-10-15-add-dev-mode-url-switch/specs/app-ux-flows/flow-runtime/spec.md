## ADDED Requirements

### Requirement: Dev mode
The application SHALL have a dev mode, decided once when the page loads:
- A development build (the local dev server) SHALL always be in dev mode.
- A production build SHALL be in dev mode when the page is opened with the URL parameter `mode=dev`. It SHALL then stay in dev mode for that browser tab, across in-app navigation and page reloads, until the tab is closed or the page is opened with `mode=off`.
- Opening a production build with `mode=off` SHALL end dev mode for that tab.
- Any other `mode` value SHALL be ignored. On a development build, `mode=off` SHALL have no effect.
- When the browser keeps no per-tab storage, dev mode SHALL last only for the page opened with `mode=dev`.

A production build in dev mode SHALL behave as a development build for every `app-ux-flows` requirement that tells development and production builds apart. That includes:
- the home page catalogue, display codes, Figma references, stored assignments and variant information;
- the variant label while a flow runs;
- hidden flows, variants and cases, which SHALL be listed, labelled "Hidden in production" and runnable.

The exception is analytics, as defined by `app-ux-flows/flow-analytics`. A production build not in dev mode SHALL behave as a production build.

When dev mode was turned on through the URL, the home page SHALL show a note, "Dev mode", with a "Turn off" action. The action SHALL reload the app at the home page with `mode=off`. A development build SHALL NOT show the note.

Dev mode SHALL NOT be access control. It changes what is shown, not what the bundle contains.

#### Scenario: Turning dev mode on in production
- **WHEN** someone opens a production build at `/?mode=dev`
- **THEN** the home page shows the catalogue, display codes, hidden flows with the label "Hidden in production", and the "Dev mode" note with "Turn off"

#### Scenario: Dev mode lasts for the tab
- **WHEN** someone opened a production build with `?mode=dev`, then starts a flow from the home page and reloads the page
- **THEN** the flow screen still shows the variant label, and the home page still shows the catalogue

#### Scenario: Hidden flow in dev mode
- **WHEN** showcase `sc-pet-004` is hidden and someone opens `/flows/sc-pet-004/info?mode=dev` in a production build
- **THEN** the flow runs instead of showing the not-found state

#### Scenario: Turning dev mode off
- **WHEN** someone in dev mode on a production build activates "Turn off" on the home page
- **THEN** the app reloads at `/?mode=off`, and hidden flows, the catalogue and the note are no longer shown in that tab

#### Scenario: Another tab is not in dev mode
- **WHEN** someone opened a production build with `?mode=dev` in one tab and opens the app's root URL in a new tab
- **THEN** the new tab is not in dev mode

#### Scenario: Unknown mode value
- **WHEN** someone opens a production build with `?mode=preview`
- **THEN** the app behaves as a production build

#### Scenario: Development build ignores mode=off
- **WHEN** a developer opens the local dev server with `?mode=off`
- **THEN** the app stays in dev mode, and the "Dev mode" note is not shown
