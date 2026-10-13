## Context

See proposal.md, "Why". The split landed in `403c202`. The wiring today:

```
pnpm-workspace.yaml              packages: apps/*, packages/*
package.json (root)              private; lint, check-types, concepts:*, production:*, tellipod:*, steiger:concepts
tsconfig.json (root)             shared strict compiler options only; no project references
apps/app-concepts/
  package.json                   name app-concepts; "@mee/core": "workspace:*"; check-types, lint, steiger scripts
  tsconfig.json                  extends expo/tsconfig.base; paths @mee/core → ../../packages/core/src/index.ts, @mee/core/* → src/*, plus @/ FSD aliases
  metro.config.js                watchFolders [workspaceRoot]; nodeModulesPaths [app, root]; SVG transformer; withNativeWind(src/shared/global.css)
  app.json                       "Mee Concepts", com.mee.concepts
apps/app-production/
  package.json                   name app-production; "@mee/core": "workspace:*"; minimal Expo Router deps
  tsconfig.json                  extends expo/tsconfig.base; same @mee/core paths
  metro.config.js                watchFolders + nodeModulesPaths only
  app.json                       "Mee Production", mee-production, com.mee.production
  src/app/index.tsx              "New App" + sharedGreeting('world')
  ios/Podfile                    use_expo_modules! searchPaths + react-native-config search path → root node_modules
packages/core/
  package.json                   name @mee/core; main/types → src/index.ts; no runtime deps
  src/index.ts                   sharedGreeting
```

Where the code differs from `ai-specs/APPS_SPLIT_SPEC.md`:

| Old document says | Code does |
|---|---|
| Both apps import `sharedGreeting` to prove resolution | Only app-production imports it. app-concepts declares the dependency and the path alias but has no import of `@mee/core` |
| `check-types` strategy is an open decision (A: `tsc --build`, B: `pnpm -r exec tsc --noEmit`) | Option B is in place: `pnpm -r --parallel exec tsc --noEmit`. The root `tsconfig.json` is a shared options file, not a references file |
| app-production has `src/`, config files and `package.json` only | It also has generated `ios/` and `android/` projects, and its Podfile is patched for root `node_modules` autolinking |
| Root scripts: lint, check-types, concepts:*, production:* | Also `steiger:concepts` and `tellipod:*` (added later) |
| tsconfig adds `@mee/core/*` alias | Also adds a bare `@mee/core` alias to `src/index.ts` |
| Metro configs use `require('path')` | They use `require('node:path')` (Biome rule) |

## Goals / Non-Goals

**Goals:**
- Write the current workspace contract down as specs (`specs/app-concepts/workspace`, `specs/app-production/workspace`, `specs/packages/core/workspace`).
- Keep the wiring details and the `check-types` decision in this design, since they are not observable behavior.

**Non-Goals:**
- Adding a `@mee/core` import to app-concepts, or any other code change. See Risks.
- Specs for `apps/app-tellipod` or `packages/ui`. They need their own adoption or feature changes.
- Cleaning up leftovers at the repository root (see Risks).
- Editing the README.

## Decisions

**1. One `workspace` capability per app plus one for `@mee/core`, not a single repo-wide spec.**
The project rules say each app owns its own specs so it can be moved out of the monorepo with only those specs, and shared-package behavior goes under `packages/<package>`. The alternative, one `monorepo` spec covering all three workspaces, was rejected because it would have to be split up the moment an app leaves. The root scripts (`concepts:*`, `production:*`, `lint`, `check-types`) are stated from each app's point of view ("app X is run with…", "app X is covered by…"). The domain name `workspace` was chosen over `monorepo` because it still makes sense if an app later becomes a standalone repository.

**2. The specs state behavior; the wiring stays here.**
Metro `watchFolders` and `nodeModulesPaths`, the tsconfig `paths`, the Podfile `searchPaths` and `pnpm-workspace.yaml` are how the guarantees are met, not the guarantees. The specs keep what a developer can observe: which commands run which app, that `@mee/core` resolves from source in both the type checker and the bundler without a build step, that NativeWind and SVG imports still work, and which checks fail on which errors.

**3. `check-types` stays on Option B (per-workspace `tsc --noEmit`).**
This was the old document's recommendation and is what the code does. Project references (Option A) would need `composite: true` in every workspace, which does not fit Expo's `tsconfig.base` well, and the repo is small enough that incremental builds do not matter yet. The specs only require that the root command fails on a type error in any workspace, so switching to Option A later does not change them.

**4. Document current behavior, gaps included.**
This is an adoption. The app-concepts spec requires that `@mee/core` *can* be imported and resolves, which the tsconfig alias and Metro config already provide. It does not require an import to exist. The missing import is listed under Risks rather than fixed here.

### Recipe: wiring a new app into the monorepo

1. Create `apps/<app>/` with its own `package.json` (`"name": "<app>"`, `"@mee/core": "workspace:*"` if needed, `check-types: tsc --noEmit`).
2. `tsconfig.json`: extend `expo/tsconfig.base` and add `paths` for `@mee/core` → `../../packages/core/src/index.ts` and `@mee/core/*` → `../../packages/core/src/*`.
3. `metro.config.js`: set `watchFolders = [workspaceRoot]` and `resolver.nodeModulesPaths = [app/node_modules, root/node_modules]`. Layer any transformers (SVG, NativeWind) on top without replacing the resolver.
4. Give the app a unique `name`, `slug`, `scheme`, iOS `bundleIdentifier` and Android `package` in `app.json`.
5. After `expo prebuild`, patch `ios/Podfile`: pass `searchPaths` pointing to the root `node_modules` to `use_expo_modules!`, and add the root `node_modules` path to the `expo-modules-autolinking react-native-config` command. Reapply after every prebuild.
6. Add `<app>:ios` and `<app>:android` scripts to the root `package.json`.
7. Propose an OpenSpec change that adds `specs/<app>/workspace`.

## Risks / Trade-offs

- **[app-concepts never imports `@mee/core`]** Metro resolution of the package is untested in app-concepts until something is shared. The first real import may hit a resolution problem the type checker does not catch → A follow-up change can add the import when the first shared code moves to core, and verify `pnpm concepts:ios` at that point.
- **[The Podfile patch is lost on `expo prebuild`]** Regenerating `apps/app-production/ios` drops the `searchPaths` patch, and native modules from the root `node_modules` stop linking → Documented in CLAUDE.md and in the recipe above. A config plugin could automate it later.
- **[Leftovers at the repository root]** The root still has `ios/` and `android/` folders with only ignored build output and Pods (`expotst.xcodeproj`), an ignored `expo-env.d.ts`, `.bundle/config` (tracked, CocoaPods/Bundler settings for the old root Gemfile) and `.storybook/`. None of them is used by the apps → Out of scope; a cleanup change can remove them.
- **[The recipe lives in a design that will be archived]** → The spec Purposes point at the workspace contract; if the team wants a durable guide, the recipe can move into the README.

## Migration Plan

Documentation only. Delete `ai-specs/APPS_SPLIT_SPEC.md` when the change is applied; the main specs are created under `openspec/specs/{app-concepts,app-production,packages/core}/workspace/` when it is archived. To roll back, restore the file from git.
