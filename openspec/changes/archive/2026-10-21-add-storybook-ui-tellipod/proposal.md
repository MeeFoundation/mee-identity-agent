## Why

`@mee/ui` and app-tellipod's shared UI and widgets can only be seen by running the full app and navigating to the right screen, with the right state. There is no isolated place to review components, their variants and states, so visual regressions and design drift go unnoticed. A component catalog gives designers and developers one place to browse and verify them.

## What Changes

- Add on-device Storybook (`@storybook/react-native`) to app-tellipod, started through an opt-in flag so the normal app entry is unchanged.
- Add a story for every `@mee/ui` component (currently `Button`), colocated in `packages/ui/src`, and rendered by app-tellipod's Storybook.
- Add stories for app-tellipod's reusable UI: `shared/ui` icons and the `widgets` (app footer, app header variants).
- Add a Storybook decorator that provides the same runtime context the app provides (fonts, i18n, safe area), so stories look like the app.
- Add root and workspace scripts to launch app-tellipod with Storybook.
- Add the Metro integration so stories from `packages/ui` are bundled.

## Capabilities

### New Capabilities
- `app-tellipod/storybook`: how Storybook is launched in app-tellipod, which stories it lists, and the app context stories render in.
- `packages/ui/storybook`: the requirement that every `@mee/ui` component ships stories covering its variants and states.

### Modified Capabilities

## Impact

- `apps/app-tellipod`: new dev dependencies, `.rnstorybook/` config, `metro.config.js` wrapper, a Storybook entry gate, new `*.stories.tsx` files, new scripts.
- `packages/ui`: new `*.stories.tsx` files only; the package's runtime exports are unchanged.
- Root `package.json`: a `tellipod:storybook` script.
- Storybook code is excluded from production behavior: it is reachable only when the flag is on.
- Dependencies are installed with `pnpm` (needs user confirmation per `CLAUDE.md`).
