## 1. Dependencies and Storybook scaffold

- [x] 1.1 With user confirmation, install Storybook dev dependencies in `apps/app-tellipod` with `pnpm --filter app-tellipod add -D ...` (react-native, ondevice-controls, ondevice-actions and any required peers); verify `pnpm install` succeeds and the lockfile changes only in the expected packages
- [x] 1.2 Add `.rnstorybook/main.ts` with story globs for `packages/ui/src/**/*.stories.tsx` and `apps/app-tellipod/src/**/*.stories.tsx`; verify story index generation lists a placeholder story
- [x] 1.3 Wrap `metro.config.js` with `withStorybook`, enabled by `EXPO_PUBLIC_STORYBOOK`; verify `expo start` still bundles with the flag unset
- [x] 1.4 Gitignore the generated `storybook.requires.ts` and add a `storybook-generate` script to `apps/app-tellipod/package.json`; verify `git status` does not show the generated file after running it

## 2. Launch gate and context

- [x] 2.1 Render the Storybook root from the app root only when `EXPO_PUBLIC_STORYBOOK` is `true`, leaving the normal tree unchanged otherwise; verify the app launches normally without the flag and shows the story browser with it
- [x] 2.2 Implement `.rnstorybook/preview.tsx` decorators for `SafeAreaProvider`, i18n, Public Sans font loading and a per-story Jotai `Provider`; verify a story with translated text shows English copy, not keys
- [x] 2.3 Add `tellipod:storybook` to the root `package.json` and `storybook` to the app `package.json`; verify the script launches the app in Storybook mode on iOS

## 3. @mee/ui stories

- [x] 3.1 Add `packages/ui/src/Button.stories.tsx` with controls for variant, size and disabled, plus a press action; verify all three variants and sizes and the disabled state render in the browser
- [x] 3.2 Add the Storybook types as a devDependency of `@mee/ui` and verify `pnpm --filter @mee/ui check-types` passes and `src/index.ts` exports no story code

## 4. app-tellipod stories

- [x] 4.1 Add a story rendering all `shared/ui/icons` with size and color controls; verify every icon is visible
- [x] 4.2 Add stories for `widgets/app-footer` (including the unread indicator state) and each `widgets/app-header` variant; verify each renders and the footer tab press is logged as an action
- [x] 4.3 Exclude `*.stories.tsx` from Jest and verify `pnpm --filter app-tellipod test` passes

## 5. Verification

- [x] 5.1 Run `pnpm check-types` and `pnpm lint` from the repo root and verify both pass with no errors
- [x] 5.2 Build a release or production bundle without the flag and verify it contains no Storybook modules
- [x] 5.3 Edit a `@mee/ui` story while Storybook runs and verify the change reloads on device, then document the launch steps in the app's README or `CLAUDE.md` run section
