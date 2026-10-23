# app-tellipod/storybook Specification

## Purpose

Defines how app-tellipod exposes an on-device component catalog (Storybook): how it is started, what it lists, and the context in which stories render.

## Requirements

### Requirement: Opt-in Storybook launch
app-tellipod SHALL show the Storybook component browser instead of the normal app when launched in Storybook mode, and SHALL show the normal app otherwise. Storybook mode SHALL be enabled only by an explicit launch flag.

#### Scenario: Launched in Storybook mode
- **WHEN** the app is started with Storybook mode enabled
- **THEN** the story browser is shown and the onboarding and tab screens are not

#### Scenario: Launched normally
- **WHEN** the app is started without Storybook mode
- **THEN** the normal app is shown and no Storybook UI is reachable

### Requirement: Story catalog
The Storybook SHALL list the stories of `@mee/ui` components and of app-tellipod's reusable UI (icons, app footer, app header variants), grouped by origin so a user can tell shared-package components from app components.

#### Scenario: Browsing the catalog
- **WHEN** the user opens the story browser
- **THEN** stories from `@mee/ui` and from app-tellipod appear under separate groups

#### Scenario: New story appears
- **WHEN** a `*.stories.tsx` file is added in `packages/ui/src` or `apps/app-tellipod/src`
- **THEN** it is listed in the browser after the story index is regenerated

### Requirement: App-faithful rendering context
Every story SHALL render with the app's fonts, localized strings and safe-area insets available, so a story looks and reads the same as the component does in the app.

#### Scenario: Localized component in a story
- **WHEN** a story renders a component that shows translated text
- **THEN** the translated English text is displayed, not the translation key

#### Scenario: Branded font
- **WHEN** a story renders text that uses the app's Public Sans font
- **THEN** the text is displayed in Public Sans

### Requirement: Interactive controls
A story SHALL expose a component's configurable props as on-device controls, and SHALL log callback props as actions.

#### Scenario: Changing a prop
- **WHEN** the user changes a control value in the story
- **THEN** the rendered component updates to reflect it

#### Scenario: Pressing a component
- **WHEN** the user presses a component whose press callback is wired to an action
- **THEN** the press is recorded in the actions panel

### Requirement: Sheet-capable rendering context
Every story SHALL render with the hosts a `@mee/ui` `Sheet` needs, so a story can present a sheet and the user can drag, dismiss and type into it exactly as in the app.

#### Scenario: Opening a sheet from a story
- **WHEN** the user presses the open button in a `Sheet` story
- **THEN** the sheet is presented over the story browser and can be dragged down to dismiss

#### Scenario: Other stories unaffected
- **WHEN** a story that does not use a sheet is rendered
- **THEN** it looks and behaves the same as before
