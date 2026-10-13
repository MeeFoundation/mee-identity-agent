# packages/core/workspace Specification

## Purpose

Defines the contract of the shared `@mee/core` package: how workspaces consume it, what it exports today, and what kind of code may live in it.

## Requirements

### Requirement: Consumable as a workspace package
`packages/core` SHALL be a workspace package named `@mee/core`. Any workspace SHALL be able to depend on it with `"@mee/core": "workspace:*"` and import it from its TypeScript source, with no separate build or publish step.

#### Scenario: App consumes the package from source
- **WHEN** an app declares `"@mee/core": "workspace:*"` and the workspace is installed with `pnpm install`
- **THEN** the app can import `@mee/core` and receives the current contents of `packages/core/src`

### Requirement: Proof-of-concept greeting
`@mee/core` SHALL export a function `sharedGreeting(name: string): string` that returns `Hello from core, <name>!`.

#### Scenario: Greeting for a name
- **WHEN** a consumer calls `sharedGreeting('world')`
- **THEN** it returns `Hello from core, world!`

### Requirement: Framework-agnostic shared code only
`@mee/core` SHALL contain only code that is shared by more than one app and does not depend on Expo, React Native, screen routing or any single app. It SHALL NOT contain mock API data or app-specific code. Code SHALL be moved into it only when a second app needs it.

#### Scenario: Package has no framework dependencies
- **WHEN** a developer inspects `packages/core/package.json`
- **THEN** it has no runtime dependency on `expo`, `react-native`, `expo-router` or any app workspace

#### Scenario: Package type checks on its own
- **WHEN** `pnpm --filter @mee/core check-types` runs
- **THEN** it passes without any Expo or React Native type declarations
