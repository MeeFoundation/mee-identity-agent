## 1. Verify specs against implementation

- [x] 1.1 Confirm `specs/packages/core/workspace/spec.md` against `packages/core/package.json` and `packages/core/src/index.ts`: package name `@mee/core`, `main`/`types` pointing at source, no runtime dependencies, and the exact `sharedGreeting` output. Verify by reading the files and running `pnpm --filter @mee/core check-types`; fix any spec mismatch.
- [x] 1.2 Confirm `specs/app-production/workspace/spec.md` against `apps/app-production/{package.json,app.json,tsconfig.json,metro.config.js,src/app/index.tsx,ios/Podfile}`: workspace name, `Mee Production` identity distinct from `com.mee.concepts`, the two text lines, the `@mee/core` dependency and aliases, and the root `node_modules` autolinking patch. Verify by reading the files; fix any spec mismatch.
- [x] 1.3 Confirm `specs/app-concepts/workspace/spec.md` against `apps/app-concepts/{package.json,tsconfig.json,metro.config.js}` and the folder listing: the self-contained file list, the `@mee/core` dependency and aliases, and that Metro keeps the SVG transformer and NativeWind. Verify by reading the files and running `ls apps/app-concepts`; fix any spec mismatch.
- [x] 1.4 Confirm the root scripts named in the specs (`concepts:*`, `production:*`, `lint`, `check-types`, `steiger:concepts`) exist in the root `package.json` with the commands described in `design.md`. Verify by reading the file.

## 2. Retire the ai-specs document

- [x] 2.1 Delete `ai-specs/APPS_SPLIT_SPEC.md`. Verify that `git status` shows it as deleted and that `grep -r APPS_SPLIT --exclude-dir=node_modules --exclude-dir=Pods .` returns no references outside `openspec/changes/`.

## 3. Validate

- [x] 3.1 Run `openspec validate adopt-apps-split-spec --strict` and verify that it passes.
- [x] 3.2 Run `pnpm lint` and `pnpm check-types` and verify they report no errors caused by this change (it touches no code; note any pre-existing failures instead of fixing them). Lint passes. Check-types fails only on an existing, unrelated error: `app-concepts/src/app/(tabs)/wallet/[section]/[document].tsx` imports `sf-symbols-typescript`, which is not installed.
