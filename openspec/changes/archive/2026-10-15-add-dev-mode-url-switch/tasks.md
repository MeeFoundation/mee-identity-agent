## 1. Dev mode value

- [x] 1.1 Add `src/shared/lib/dev-mode.ts` with `DevMode`, a pure `resolveDevMode({ devBuild, search, storage })` and the module-level `devMode`, following design §1. It uses the `sessionStorage` key `ux-flows:dev-mode` and wraps storage access in try/catch. Verify with `dev-mode.test.ts` using a fake storage:
  - a dev build ignores `mode=off` and leaves storage untouched;
  - `mode=dev` turns dev mode on with `fromUrl` and stores the key;
  - a later load without the parameter stays on;
  - `mode=off` clears the key and turns it off;
  - `mode=preview` is ignored;
  - storage that throws falls back to the URL alone.

## 2. Switch the app to dev mode

- [x] 2.1 Build the registry with `createRegistry(allFlows, devMode.on)` in `slices/flow/registry.ts`, and use `devMode.on` for the catalogue and the assigned variant in `routes/home.tsx` and for the variant label in `routes/flow.$screenId.tsx`. Leave the three `console.warn` diagnostics on `import.meta.env.DEV`. Verify that `pnpm check-types` passes, and that `grep import.meta.env.DEV` finds only `dev-mode.ts` and the three diagnostics.
- [x] 2.2 Change `parseAnalyticsConfig(env, mode)` in `app/analytics.ts`: console output when `mode.on` or debug, `matomo: null` when `mode.fromUrl`, and the module-level call passes `devMode`. Verify with `analytics.test.ts`: the existing cases are updated to pass a mode, and new cases check that `fromUrl` gives no Matomo but console output while Matomo is configured, and that a dev build keeps Matomo.

## 3. Home page note

- [x] 3.1 Add `devModeNote` and `onTurnOffDevMode` props to `HomePage`. When the note is on, show "Dev mode" and a "Turn off" link-style button in the header (`home.devMode.label` and `home.devMode.turnOff` in `app/locales/en.ts`). `routes/home.tsx` passes `devMode.fromUrl` and `() => window.location.assign('/?mode=off')`. Verify with a test that renders `HomePage` to markup: the note and "Turn off" appear only with `devModeNote` true, and activating "Turn off" calls the handler.

## 4. Docs and verification

- [x] 4.1 Add a "Dev mode" section to `apps/app-ux-flows/DEPLOYMENT.md` covering `?mode=dev` and `?mode=off`, that dev mode lasts per tab, that Matomo is never used in it, and that dev links are for reviewers, not participants. Add one line to "Flow conventions" in `AGENTS.md`: hidden items show on the dev server and in `?mode=dev`. Verify that both are present.
- [x] 4.2 Browser check on a production build (`vite build` into the scratchpad, then `vite preview`), with one flow temporarily marked hidden and Matomo configured through a temporary `public/config.js` in the scratchpad build:
  - `/` shows no catalogue and no hidden flow;
  - `/?mode=dev` shows the catalogue, the hidden flow with its label, and the "Dev mode · Turn off" note;
  - starting a flow and reloading keeps the variant label;
  - no request reaches the Matomo URL while in dev mode;
  - "Turn off" returns to the plain production home;
  - a new tab without the parameter is not in dev mode.

  Revert the temporary hidden mark, and verify with `git diff` that no flow is left hidden.
- [x] 4.3 Run `pnpm check-types`, `pnpm lint`, `pnpm --filter app-ux-flows knip` and `pnpm --filter app-ux-flows test`. Verify that all pass.
