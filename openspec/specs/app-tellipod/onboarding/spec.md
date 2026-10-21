# app-tellipod/onboarding Specification

## Purpose

Defines the first-launch onboarding gate of app-tellipod and how its completion is remembered across launches, as a base for the later onboarding steps and animation.

## Requirements

### Requirement: Onboarding shown on first launch
On the first launch, before onboarding has been completed, app-tellipod SHALL show the onboarding screen and SHALL NOT allow access to the tab screens or Pod info. The onboarding screen SHALL show a localized title and a Start button, and SHALL show neither header nor footer.

#### Scenario: Fresh install
- **WHEN** a user launches the app for the first time
- **THEN** the onboarding screen is shown with a Start button and no header or footer

#### Scenario: Deep link before completion
- **WHEN** the app is opened with a link to a tab screen or Pod info before onboarding is completed
- **THEN** the onboarding screen is shown instead

### Requirement: Completing onboarding
Pressing Start SHALL mark onboarding as completed and SHALL take the user to Home, from where the onboarding screen cannot be reached by navigating back.

#### Scenario: Start
- **WHEN** the user presses Start
- **THEN** the Home screen is shown with header and footer

#### Scenario: No return to onboarding
- **WHEN** the user presses the system back action on Home after completing onboarding
- **THEN** the onboarding screen is not shown

### Requirement: Persisted completion
Onboarding completion SHALL be stored on the device and SHALL survive app restarts. After completion, launching the app SHALL show Home directly, without displaying the onboarding screen at any point.

#### Scenario: Relaunch after completion
- **WHEN** the user relaunches the app after completing onboarding
- **THEN** Home is shown directly and the onboarding screen is not displayed, not even briefly

#### Scenario: Relaunch without completion
- **WHEN** the user closes the app on the onboarding screen without pressing Start and relaunches it
- **THEN** the onboarding screen is shown again

### Requirement: Localized onboarding text
The onboarding title and the Start button label SHALL come from the app's translation resources.

#### Scenario: No hardcoded text
- **WHEN** a developer searches the onboarding screen for literal user-facing strings
- **THEN** none are found; text is resolved through translation keys
