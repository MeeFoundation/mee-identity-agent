# AI Agent Constraints & Rules
- NEVER execute `git push` commands.
- NEVER perform database migrations (e.g., `supabase db push`, `prisma migrate`, `alembic upgrade`, `rails db:migrate`, `sqlx migrate` etc.).
- NEVER push database migrations to remote.
- NEVER run `git commit` without explicit user request.
- If database changes, code pushes, or function deployments are required, provide me with the exact commands in the chat so I can review and execute them manually.
- Always ask for explicit user confirmation before executing any terminal command that modifies the project state or remote resources (e.g., `pnpm install`, `pod install`, `expo prebuild`).

## Package Manager
- Always use `pnpm` for installing and managing dependencies. Never use `npm`, `yarn`, or `bun`.

## Monorepo Structure

This is a **pnpm monorepo** with three workspaces:

| Workspace | Path | Purpose |
|---|---|---|
| `app-concepts` | `apps/app-concepts/` | Full prototype app with mocked API. Has `ios/` and `android/` native projects. |
| `app-production` | `apps/app-production/` | Minimal production app. Has `ios/` and `android/` native projects. |
| `@mee/core` | `packages/core/` | Shared utilities imported by both apps. No Expo/RN-specific code. |

### Key paths
- Shared code lives in `packages/core/src/` — imported as `@mee/core`
- App-concepts source: `apps/app-concepts/src/` (FSD structure)
- App-production source: `apps/app-production/src/`
- Native iOS projects: `apps/app-concepts/ios/`, `apps/app-production/ios/`
- Root `node_modules/` is the pnpm hoisted store — all packages live here

### iOS native module autolinking (monorepo quirk)
pnpm hoists all packages to root `node_modules/`. The `expo-modules-autolinking` tool by default only searches the app's own `node_modules/`. For `app-production`, the Podfile is manually patched to pass `searchPaths` and an extra search path to `react-native-config` pointing to the workspace root `node_modules/`. If `expo prebuild` is re-run for `app-production`, these Podfile changes must be reapplied manually.

## Dev Workflow

### Run apps
- `pnpm concepts:ios` — build and run app-concepts on iOS
- `pnpm concepts:android` — build and run app-concepts on Android
- `pnpm production:ios` — build and run app-production on iOS
- `pnpm production:android` — build and run app-production on Android
- `pnpm tellipod:ios` / `pnpm tellipod:android` — build and run app-tellipod
- `pnpm tellipod:storybook:ios` / `pnpm tellipod:storybook:android` — run app-tellipod in Storybook mode (`EXPO_PUBLIC_STORYBOOK=true`); stories live next to components as `*.stories.tsx` in `packages/ui/src` and `apps/app-tellipod/src`, and `pnpm --filter app-tellipod storybook:generate` regenerates the story index

### Quality checks (run from repo root)
- `pnpm lint` — Biome lint across all packages and apps
- `pnpm check-types` — TypeScript type check across all workspaces
- `pnpm steiger:concepts` — FSD architecture check for app-concepts

### Workspace-scoped commands
- `pnpm --filter app-concepts <script>` — run a script in app-concepts
- `pnpm --filter app-production <script>` — run a script in app-production
- `pnpm --filter @mee/core <script>` — run a script in core

## FSD Cross-Entity Imports
- Entities on the same layer cannot import from each other's main barrel (`@/entities/foo`)
- Use `@x/` boundary files for controlled cross-entity access: `@/entities/foo/@x/bar.ts`
- When adding a type needed by another entity, export it from the relevant `@x/` file, not from `index.ts`
- Run `pnpm steiger:concepts` to catch violations

## Code Conventions
- Follow feature-sliced design: `/entities`, `/widgets`, `/features`, `/app`, `/shared`
- Use Jotai atoms for state — no `useState` for shared state
- All user-facing strings must use i18next (`t('key')`)
- TypeScript strict mode — no `any`, no `// @ts-ignore`
- Linter/formatter is **Biome** — no ESLint, no Prettier

## AI Behavior Rules
- Never leave `console.log` debug statements in code
- Never add placeholder or TODO code — implement fully or ask
- Do not add comments unless the logic is non-obvious
- Do not refactor code outside the scope of the requested task

## Testing
- Run `pnpm check-types` after changes to verify types
- Run `pnpm lint` after changes to verify no lint errors
- Do not mark a task complete if type errors or lint errors exist
