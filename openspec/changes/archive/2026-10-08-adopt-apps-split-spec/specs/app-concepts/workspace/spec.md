## Purpose

Defines how app-concepts lives inside the pnpm monorepo: how it is started from the repository root, how it consumes the shared `@mee/core` package, and which root quality checks cover it.

## ADDED Requirements

### Requirement: Self-contained app workspace
app-concepts SHALL live in `apps/app-concepts` as its own workspace named `app-concepts`. Everything the app needs to build and run SHALL live inside that folder: its source, native iOS and Android projects, assets, ambient type declarations, Expo, Babel, Metro, Tailwind, Steiger, Jest and CocoaPods configuration. The app SHALL NOT depend on app-specific files at the repository root.

#### Scenario: App files are inside the workspace
- **WHEN** a developer lists `apps/app-concepts`
- **THEN** it contains `src/`, `ios/`, `android/`, `assets/`, `@types/`, `app.json`, `package.json`, `tsconfig.json`, `metro.config.js`, `babel.config.js`, `tailwind.config.js` and `steiger.config.mjs`

#### Scenario: Native build uses the workspace's own projects
- **WHEN** a developer builds app-concepts for iOS or Android
- **THEN** the build uses `apps/app-concepts/ios` or `apps/app-concepts/android`, not a native project at the repository root

### Requirement: Run from the repository root
app-concepts SHALL be buildable and runnable from the repository root with `pnpm concepts:ios` and `pnpm concepts:android`.

#### Scenario: Run on iOS from the root
- **WHEN** a developer runs `pnpm concepts:ios` in the repository root
- **THEN** app-concepts builds and launches on an iOS simulator or device

#### Scenario: Run on Android from the root
- **WHEN** a developer runs `pnpm concepts:android` in the repository root
- **THEN** app-concepts builds and launches on an Android emulator or device

### Requirement: Consume @mee/core
app-concepts SHALL declare `@mee/core` as a `workspace:*` dependency. Code in app-concepts SHALL be able to import `@mee/core` and `@mee/core/<path>`, and those imports SHALL resolve to the package source both when type checking and when bundling, without a build step for the package.

#### Scenario: Type checking resolves the shared package
- **WHEN** a file in `apps/app-concepts/src` imports `sharedGreeting` from `@mee/core`
- **THEN** `pnpm check-types` resolves the import to `packages/core/src` and reports no error for it

#### Scenario: Bundler resolves the shared package
- **WHEN** a file in `apps/app-concepts/src` imports from `@mee/core` and the app is bundled
- **THEN** Metro resolves the import from the workspace and the bundle builds

#### Scenario: Editing the shared package reloads the app
- **WHEN** the app is running in development and a developer edits a file in `packages/core/src` that the app imports
- **THEN** Metro picks up the change without restarting the bundler

### Requirement: Existing bundling features keep working
Monorepo resolution SHALL NOT break the app's existing bundling features: NativeWind class styling from `src/shared/global.css`, and importing `.svg` files as React components.

#### Scenario: NativeWind styles apply
- **WHEN** app-concepts runs in the monorepo
- **THEN** components styled with Tailwind class names render with those styles

#### Scenario: SVG imports render as components
- **WHEN** a file imports an `.svg` file and renders it
- **THEN** the SVG renders as a React component and is not treated as a static asset

### Requirement: Covered by root quality checks
app-concepts SHALL be checked by the root commands `pnpm lint` (Biome), `pnpm check-types` (TypeScript, per workspace) and `pnpm steiger:concepts` (FSD architecture). Each command SHALL fail when app-concepts has an error of the kind it checks.

#### Scenario: Type error fails the root check
- **WHEN** a file in `apps/app-concepts/src` has a TypeScript error
- **THEN** `pnpm check-types` in the repository root exits with a failure

#### Scenario: Lint error fails the root check
- **WHEN** a file in `apps/app-concepts` has a Biome lint warning or error
- **THEN** `pnpm lint` in the repository root exits with a failure

#### Scenario: FSD violation fails the architecture check
- **WHEN** an entity in `apps/app-concepts/src/entities` imports another entity's main barrel
- **THEN** `pnpm steiger:concepts` reports the violation
