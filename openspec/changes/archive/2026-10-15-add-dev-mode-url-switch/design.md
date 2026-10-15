## Context

`import.meta.env.DEV` is the dev-only switch today, and every check of it happens when the page loads or renders:
- `slices/flow/registry.ts` builds the registry once, with `createRegistry(allFlows, import.meta.env.DEV)`, which drops hidden items outside development;
- `routes/home.tsx` passes the catalogue and the stored assignment only in development;
- `routes/flow.$screenId.tsx` shows "Variant (dev only)" only in development;
- `app/analytics.ts` turns console output on for `env.DEV` (inside `parseAnalyticsConfig`), and decides on Matomo from runtime and build config. It is evaluated once, when the app loads;
- three `console.warn` diagnostics (`use-flow-run-analytics.ts`, `fan-out.ts`, and the invalid-config warning in `analytics.ts`).

The app already uses `sessionStorage` for per-tab state (`browserRunStorage`) behind a `() => Storage` getter, with storage failures caught (`assignment-store.ts`). Vitest runs with `DEV` true.

## Goals / Non-Goals

**Goals:**
- One value, worked out once per page load, answers "is this dev mode, and did it come from the URL?". Every switch reads that value.
- Reviewer runs in dev mode on a deployed app can never reach Matomo.

**Non-Goals:**
- Access control or a secret. The parameter is public, and the code is already in the bundle.
- Turning dev mode on or off without a reload. A change takes effect on the next page load, which "Turn off" triggers.
- The three `console.warn` diagnostics. They are developer tooling, not specified behaviour, and stay on `import.meta.env.DEV`.
- A runtime container variable for dev mode. The URL parameter covers the need.

## Decisions

### 1. `shared/lib/dev-mode.ts`: a pure resolver plus one module-level value

```ts
export type DevMode = { on: boolean; fromUrl: boolean }
export const resolveDevMode = (input: { devBuild: boolean; search: string; storage: () => Storage | undefined }): DevMode
export const devMode: DevMode = resolveDevMode({ devBuild: import.meta.env.DEV, search: globalThis.location?.search ?? '', storage: () => globalThis.sessionStorage })
```

Rules:
- In a dev build: `{ on: true, fromUrl: false }`, and storage is never touched.
- Otherwise:
  - `mode=dev` writes the key `ux-flows:dev-mode` to storage;
  - `mode=off` removes it;
  - any other value does nothing;
  - the result is `{ on, fromUrl: on }`, where `on` means the key is present, or `mode=dev` is in the URL when storage throws or is missing.

Storage access is wrapped in try/catch, as in `assignment-store.ts`.

`fromUrl` stands for "turned on by the URL in this tab", including later reloads that read the stored key. It drives the analytics exclusion and the home note.

*Alternative:* reading the parameter through TanStack Router search params. The flow routes' `validateSearch` drops unknown keys and redirects, and the registry and analytics initialise before the router exists. Reading `location.search` once at module load avoids both problems.

### 2. Switch the four spec-relevant checks to `devMode.on`

- `registry.ts`: `createRegistry(allFlows, devMode.on)`. It still runs once, which is fine because dev mode can only change on a page load.
- `routes/home.tsx`: the catalogue and the assigned variant use `devMode.on`. A new `devModeNote` prop is `devMode.fromUrl`.
- `routes/flow.$screenId.tsx`: the variant label uses `devMode.on`.
- `app/analytics.ts`: see decision 3.

### 3. Analytics: dev mode decides console output, and `fromUrl` excludes Matomo

`parseAnalyticsConfig(env, mode: DevMode)`:
- `console` is `enabled && (mode.on || debug)`;
- `matomo` is `null` when `mode.fromUrl`, whatever the URL or site id say.

`env.DEV` is no longer read inside the parser. The module-level call passes `devMode`. Excluding Matomo at config time means no script tag is ever added, which `createMatomoAdapter` does on creation, and no request is made.

*Alternative:* filtering events in the fan-out. Matomo would still load and send its own page views.

### 4. Home "Dev mode" note with "Turn off"

`HomePage` gains `devModeNote: boolean` and `onTurnOffDevMode: () => void`. When the note is on, the header shows a small muted note, "Dev mode" (`home.devMode.label`), and a link-style button, "Turn off" (`home.devMode.turnOff`). The route implements the action with `window.location.assign('/?mode=off')`. A full reload is required, because the registry and analytics are fixed per page load.

### 5. Tests

- `dev-mode.test.ts` covers `resolveDevMode` with a fake storage: a dev build ignores the URL and storage; `mode=dev` stores the key; a reload without the parameter keeps dev mode; `mode=off` clears it; an unknown value is ignored; throwing storage falls back to the URL only.
- `analytics.test.ts` changes its existing `parseAnalyticsConfig` cases to pass a mode, and adds:
  - `fromUrl` gives `matomo: null` and `console: true` while Matomo is configured;
  - `on` from the build keeps Matomo.
- A home page test that the note renders only when `devModeNote` is true.

## Risks / Trade-offs

- [Someone shares a `?mode=dev` link with a participant] → That participant's runs aren't tracked and they see hidden items. Only use dev links with reviewers; `DEPLOYMENT.md` says so.
- [Dev mode set but `sessionStorage` unavailable, as in private modes] → Dev mode lasts only for the opened page, as the spec says. Navigation inside the SPA keeps it, because it's computed once per load.
- [`mode` stays in the home URL] → It's harmless: it only re-applies the same state on reload.

## Migration Plan

No data migration. Deploy as usual. `?mode=dev` works as soon as the new image is serving. To roll back, redeploy the previous image; stored `ux-flows:dev-mode` keys are then simply ignored.
