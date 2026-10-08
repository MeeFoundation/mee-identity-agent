## Why

The team needs a way to demo interactive UX flows to stakeholders, run usability tests, and later A/B test flow variants, without building throwaway prototypes inside the production or concepts apps. `app-concepts` and `app-production` are Expo/React Native apps with native iOS/Android projects — the wrong shape for a flow that only needs to run in a browser and be shared as a URL. A dedicated web SPA, scoped as its own monorepo workspace, keeps this experimentation surface isolated from the native apps while reusing the repo's existing package manager, lint, and type-check tooling.

## What Changes

- Add a new app workspace, `app-ux-flows`, under `apps/` as a Vite + React web SPA (no native `ios/`/`android/` projects, no SSR).
- Wire it into the existing pnpm workspace and root quality gates: `pnpm lint` (Biome, already globbed to `apps/**/*`), `pnpm check-types` (`pnpm -r --parallel exec tsc --noEmit`), and a new root dev script.
- Introduce the Flow domain model: a Flow is a self-contained, URL-addressable interactive scenario of one or more screens, defined in TypeScript and composed from React components.
- Introduce a Flow Registry: a static, in-code map of flow id → flow definition, used to list flows on the home page and resolve a flow by URL.
- Introduce a Flow Runtime: per-flow-instance state (initial/mock data plus participant progress) that stays consistent as the participant navigates between a flow's screens, scoped so it does not leak between separate flow instances.
- Add basic client-side routing: a home page listing all registered flows, and a direct URL per flow (and per screen within a flow) using the flow/screen ids from the registry.
- Add a flow completion step: the last screen of a flow marks the flow instance complete and shows a completion screen.
- Design the Flow, Registry, and Runtime types so that a later change can add A/B variant overrides (prop/copy/visibility/composition overrides keyed by variant id) without changing the flow authoring shape. Variant selection, assignment, Figma-sourced components, and Matomo analytics are explicitly **not** implemented in this change.

## Capabilities

### New Capabilities
- `app-ux-flows/workspace`: `app-ux-flows` as a pnpm workspace — Vite + React SPA scaffolding, TypeScript and Biome coverage, and the root script(s) used to run it.
- `app-ux-flows/flow-runtime`: the Flow domain model, Flow Registry, Flow Runtime (flow-scoped state that persists across a flow's screens), screen composition, routing (home page listing flows, direct flow and screen URLs), and flow completion.

### Modified Capabilities
<!-- None: this change only adds the new app-ux-flows workspace and does not change behavior of app-concepts, app-production, app-tellipod, @mee/core, or @mee/ui. -->

## Impact

- Code: new directory `apps/app-ux-flows` (package.json, tsconfig.json, vite config, `src/`); root `package.json` gains a new script (e.g. `ux-flows:dev`); `pnpm-workspace.yaml` already globs `apps/*` so no change needed there.
- Dependencies: new app-local dependencies for Vite, React, TanStack Router, and Jotai (reusing the state-management convention already used by `app-concepts`); no changes to `@mee/core` or `@mee/ui`.
- Tooling: no change to root Biome config (`apps/**/*` already included) or root `tsconfig.json`; `lefthook.yml`'s `pre-commit` lint/check-types hooks pick the new workspace up automatically. `pnpm steiger:concepts` is unaffected since it is scoped to `app-concepts` (it enforces FSD, which `app-ux-flows` does not use). `app-ux-flows` adds its own app-scoped Knip config/script for unused-code checks - new to the repo, but not wired at the root.
- Out of scope: Figma MCP-sourced components, Matomo analytics wiring, A/B variant assignment/override logic, and any backend/API — all explicitly deferred per the request, with the domain model shaped to accommodate them later.
