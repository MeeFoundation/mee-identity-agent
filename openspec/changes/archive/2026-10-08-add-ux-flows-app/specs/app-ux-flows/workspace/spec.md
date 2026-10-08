## Purpose

Defines how `app-ux-flows` lives inside the pnpm monorepo as a browser-only web SPA workspace: how it is started from the repository root, and which root quality checks cover it.

## ADDED Requirements

### Requirement: Self-contained app workspace
`app-ux-flows` SHALL live in `apps/app-ux-flows` as its own workspace named `app-ux-flows`. Everything the app needs to build and run SHALL live inside that folder: its source, assets, and its own Vite, TypeScript and Biome-covered configuration. The workspace SHALL NOT contain native `ios/` or `android/` projects and SHALL NOT depend on app-specific files at the repository root.

#### Scenario: App files are inside the workspace
- **WHEN** a developer lists `apps/app-ux-flows`
- **THEN** it contains `src/`, `index.html`, `package.json`, `tsconfig.json` and a Vite config, and no `ios/` or `android/` directory

### Requirement: Run from the repository root
`app-ux-flows` SHALL be runnable in development from the repository root with a dedicated pnpm script, and SHALL build to a static browser bundle with no server-rendering step.

#### Scenario: Start the dev server from the root
- **WHEN** a developer runs the `app-ux-flows` dev script from the repository root
- **THEN** a local dev server starts and serves the SPA in a browser

#### Scenario: Production build is static
- **WHEN** a developer builds `app-ux-flows` for production
- **THEN** the build produces a static set of browser assets that can be served without a Node.js server process

### Requirement: Covered by root quality checks
`app-ux-flows` SHALL be checked by the root commands `pnpm lint` (Biome) and `pnpm check-types` (TypeScript, per workspace). Each command SHALL fail when `app-ux-flows` has an error of the kind it checks.

#### Scenario: Lint error fails the root check
- **WHEN** a file in `apps/app-ux-flows/src` has a Biome lint error
- **THEN** `pnpm lint` in the repository root exits with a failure

#### Scenario: Type error fails the root check
- **WHEN** a file in `apps/app-ux-flows/src` has a TypeScript error
- **THEN** `pnpm check-types` in the repository root exits with a failure

### Requirement: App-scoped unused-code check
`app-ux-flows` SHALL have its own Knip configuration, run via a script scoped to that workspace, that detects unused files, unused exports, and unused dependencies within the app.

#### Scenario: Unused dependency is detected
- **WHEN** `apps/app-ux-flows/package.json` declares a dependency that no file in the app imports
- **THEN** running the app's Knip script reports that dependency as unused

#### Scenario: Unused export is detected
- **WHEN** a file in `apps/app-ux-flows/src` exports a value that no other file in the app imports
- **THEN** running the app's Knip script reports that export as unused
