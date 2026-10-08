## Purpose

Defines how app-production lives inside the pnpm monorepo: its current placeholder screen, how it is started from the repository root, how it consumes the shared `@mee/core` package, and which root quality checks cover it.

## ADDED Requirements

### Requirement: Self-contained app workspace
app-production SHALL live in `apps/app-production` as its own workspace named `app-production`, with its own Expo configuration (display name `Mee Production`, slug `mee-production`), source and native iOS and Android projects. It SHALL NOT depend on files inside other app workspaces.

#### Scenario: App identity
- **WHEN** app-production is installed on a device
- **THEN** it appears as `Mee Production` and installs alongside app-concepts without replacing it

#### Scenario: No dependency on other apps
- **WHEN** a developer searches `apps/app-production` for imports or paths into `apps/app-concepts` or `apps/app-tellipod`
- **THEN** none are found

### Requirement: Placeholder home screen
app-production SHALL show a single home screen with two lines of text, centred on screen: `New App`, and below it the greeting produced by `@mee/core` for the name `world` (`Hello from core, world!`).

#### Scenario: Launch shows the placeholder
- **WHEN** a user launches app-production
- **THEN** the screen shows `New App` and `Hello from core, world!`

### Requirement: Run from the repository root
app-production SHALL be buildable and runnable from the repository root with `pnpm production:ios` and `pnpm production:android`. On iOS, native modules installed in the repository root `node_modules` SHALL be linked into the build.

#### Scenario: Run on iOS from the root
- **WHEN** a developer runs `pnpm production:ios` in the repository root
- **THEN** app-production builds, launches and shows the placeholder home screen

#### Scenario: Run on Android from the root
- **WHEN** a developer runs `pnpm production:android` in the repository root
- **THEN** app-production builds, launches and shows the placeholder home screen

### Requirement: Consume @mee/core
app-production SHALL declare `@mee/core` as a `workspace:*` dependency. Imports of `@mee/core` and `@mee/core/<path>` SHALL resolve to the package source both when type checking and when bundling, without a build step for the package.

#### Scenario: Shared greeting reaches the screen
- **WHEN** the shared greeting in `@mee/core` is changed and app-production is reloaded
- **THEN** the home screen shows the new greeting

#### Scenario: Type checking resolves the shared package
- **WHEN** `pnpm check-types` runs in the repository root
- **THEN** the `@mee/core` import in app-production resolves to `packages/core/src` and reports no error

### Requirement: Covered by root quality checks
app-production SHALL be checked by the root commands `pnpm lint` and `pnpm check-types`. Each command SHALL fail when app-production has an error of the kind it checks.

#### Scenario: Type error fails the root check
- **WHEN** a file in `apps/app-production/src` has a TypeScript error
- **THEN** `pnpm check-types` in the repository root exits with a failure

#### Scenario: Lint error fails the root check
- **WHEN** a file in `apps/app-production` has a Biome lint warning or error
- **THEN** `pnpm lint` in the repository root exits with a failure
