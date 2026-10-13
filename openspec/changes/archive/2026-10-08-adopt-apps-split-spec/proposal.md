## Why

The monorepo split is described in `ai-specs/APPS_SPLIT_SPEC.md`, which sits outside OpenSpec. The split itself was implemented in `403c202` ("implement app separation logic (2 apps) according to spec"), so the document is now a finished plan rather than a living contract. Moving it into OpenSpec records what each workspace guarantees today, scoped per app, so later changes (more shared code in `@mee/core`, new apps, extracting an app into its own repository) can be proposed as deltas against it.

## What Changes

- Add baseline capability specs for how `app-concepts`, `app-production` and `@mee/core` take part in the pnpm monorepo, written from the current implementation.
- Move the workspace wiring details (root scripts, `pnpm-workspace.yaml`, per-app Metro and TypeScript resolution, the chosen `check-types` strategy, the iOS Podfile autolinking patch) into `design.md`.
- Record where the implementation differs from the old document. The main gap: `app-concepts` declares and aliases `@mee/core` but does not import it anywhere, so only `app-production` proves runtime resolution.
- Delete `ai-specs/APPS_SPLIT_SPEC.md` once its content is captured in OpenSpec.
- No runtime behavior changes. This change only documents the existing implementation.

## Capabilities

### New Capabilities
- `app-concepts/workspace`: app-concepts as a monorepo workspace. It is run from the repo root, depends on `@mee/core` through the workspace protocol, resolves it in both TypeScript and Metro alongside NativeWind and SVG imports, and is covered by the root lint, type check and FSD check.
- `app-production/workspace`: app-production as a monorepo workspace. It shows a single placeholder screen with "New App" and the `@mee/core` greeting, is run from the repo root on iOS and Android, and is covered by the root lint and type check.
- `packages/core/workspace`: the `@mee/core` package contract. It is consumable from any workspace through `workspace:*`, exports the `sharedGreeting` proof-of-concept function, and stays free of app-specific, routing, mock-data and Expo/React Native code.

### Modified Capabilities
<!-- None: openspec/specs/ only has app-concepts/attributes, which this change does not touch. -->

## Impact

- Code: none. The specs describe `apps/app-concepts`, `apps/app-production`, `packages/core` and the root `package.json` / `pnpm-workspace.yaml` as they are today.
- Docs: `ai-specs/APPS_SPLIT_SPEC.md` is removed. The archived `adopt-attribute-types-and-formats-spec` design mentions it only as a non-goal and is not edited.
- Out of scope: `apps/app-tellipod` and `packages/ui`, which were added after the split, and the README, which already reflects the split for the two original apps.
