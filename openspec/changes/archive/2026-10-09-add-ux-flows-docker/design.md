## Context

`app-ux-flows` is a Vite + React SPA (`apps/app-ux-flows`). `vite build` turns it into a fully static bundle (see `app-ux-flows/workspace`). Its build script runs `tsc --noEmit && vite build`. The app uses no `@mee/*` workspace packages. TanStack Router runs in browser-history mode (the default `createRouter` in `src/routes/router.ts`), so deep links like `/flows/<id>/<screen>` need a server-side fallback to `index.html`.

Analytics settings come from `import.meta.env` in `src/app/analytics.ts` (`parseAnalyticsConfig(import.meta.env)`), evaluated once at module load. `import.meta.env.DEV` also gates development-only UI and logging. That must stay a build-time flag.

Monorepo facts that shape the build:
- `pnpm-lock.yaml` and `pnpm-workspace.yaml` are at the repository root, so the build context must be the root.
- The root `.npmrc` is git-ignored but holds a plaintext GitHub Packages token. The lockfile has no `@MeeFoundation/*` packages, so the app builds from the public registry without it.
- Node is pinned in `.nvmrc` (22.19.0). pnpm is pinned in the root `packageManager` (`pnpm@9.1.1`).
- The root devDependencies include `lefthook`, whose install hooks try to touch `.git`.

## Goals / Non-Goals

**Goals:**
- A single image that can be deployed to any environment, with analytics configured at container start.
- Every container file kept inside `apps/app-ux-flows/`, so the app stays separable from the monorepo.
- A small, non-root runtime image with predictable caching.

**Non-Goals:**
- CI pipelines, registry publishing, orchestration manifests (Kubernetes, compose for production) or TLS termination. The image is deployed behind whatever ingress the target platform provides.
- Serving the app under a sub-path. The image serves it at `/`.
- Runtime configuration of anything other than the analytics settings.
- Containerising the other apps or the local Matomo setup (`docker-compose.matomo.yml` stays as is).

## Decisions

### 1. Dockerfile lives in the app, built with root context
`apps/app-ux-flows/Dockerfile`, built with `docker build -f apps/app-ux-flows/Dockerfile -t app-ux-flows .` from the root. Ignore rules go in `apps/app-ux-flows/Dockerfile.dockerignore`. BuildKit applies a `<Dockerfile>.dockerignore` next to the Dockerfile in place of the root `.dockerignore`.
- *Alternative:* a root `Dockerfile` / `.dockerignore`. Rejected: it puts app-specific files at the root, which goes against the separability goal, and a root `.dockerignore` would apply to any future image.

### 2. Multi-stage build: `pnpm fetch` + offline filtered install on Debian slim
- **build stage** `node:22.19.0-bookworm-slim`. Run `corepack enable` with the root `package.json`'s `packageManager` so the pinned pnpm is used.
  1. Copy `pnpm-lock.yaml` and run `pnpm fetch`. This layer depends only on the lockfile, so it caches well.
  2. Copy the root `package.json`, `pnpm-workspace.yaml` and `apps/app-ux-flows/`.
  3. Run `pnpm install --offline --frozen-lockfile --filter app-ux-flows`. This doesn't install the root importer, so `lefthook` and its git hooks never run.
  4. Run `pnpm --filter app-ux-flows build`. Because the build includes `tsc --noEmit`, a type error fails the image build.
- **runtime stage** `nginxinc/nginx-unprivileged:1.27-alpine`. Copy `dist/` and the nginx and startup files.
- *Why glibc for the build stage:* Vite 8 (Rolldown), Tailwind's oxide engine and lightningcss ship per-platform native binaries as optional dependencies. glibc builds are the most reliably resolved from an existing lockfile. musl/Alpine variants risk a missing binary.
- *Alternative:* `pnpm deploy` or copying the whole repo then installing. Rejected: copying the whole repo invalidates the install layer on any change anywhere in the repo, and `pnpm deploy` is not needed for a static output.

### 3. nginx (unprivileged image) on port 8080
`nginx-unprivileged` runs as uid 101 and listens on 8080 by default, which meets the non-root requirement with no custom user setup. `apps/app-ux-flows/docker/nginx.conf` replaces the default server:
- `location = /healthz` → `200 ok` (text/plain, `access_log off`).
- `location /assets/` → `try_files $uri =404`, `Cache-Control: public, max-age=31536000, immutable`.
- `location = /config.js` → `Cache-Control: no-cache`.
- `location ~ \.[A-Za-z0-9]+$` → `try_files $uri =404`, so missing files return 404 instead of the SPA.
- `location /` → `try_files $uri /index.html`, `Cache-Control: no-cache`.
- `server_tokens off`, gzip for text types, and `X-Content-Type-Options: nosniff`.
- *Alternative:* Caddy, or `vite preview`. The user chose nginx. `vite preview` is not meant for production.

### 4. Runtime config via a generated `/config.js`
- `index.html` loads `<script src="/config.js"></script>` (a classic, blocking script) before the module entry. It sets `window.__UX_FLOWS_CONFIG__`, so the value is defined when `analytics.ts` evaluates.
- `apps/app-ux-flows/public/config.js` is committed with `window.__UX_FLOWS_CONFIG__ = {}`. The dev server and plain `vite build` output then have an empty runtime config, and everything falls back to `.env.local` as before.
- The startup script `apps/app-ux-flows/docker/40-ux-flows-config.sh` goes into `/docker-entrypoint.d/`, so the stock nginx entrypoint runs it before nginx starts. It rewrites `/usr/share/nginx/html/config.js` from a fixed allowlist of variable names and includes a key only when the variable is set (`${VAR+x}`). Values are escaped for a JavaScript string literal: `\` → `\\`, `"` → `\"`, `<` → `<`, and newlines/CR removed. The file is copied with `--chown=101:101` so the unprivileged user can overwrite it.
- Variable names stay the same as the build-time ones (`VITE_*`), so one documented list serves `.env.local` and the container.
- *Alternatives:* `envsubst` templates (cannot express "only if set", no escaping), or fetching `/config.json` at startup (makes analytics init async and needs changes to app bootstrap). Both rejected.

### 5. Merging runtime and build-time settings in the app
`src/app/analytics.ts` gets a small pure function that builds the `AnalyticsEnv` passed to `parseAnalyticsConfig`. For each analytics key, it uses the runtime value when that key is a string on the runtime object, otherwise the `import.meta.env` value. `DEV` always comes from `import.meta.env`. Non-string runtime values are ignored. The module calls it with `window.__UX_FLOWS_CONFIG__` (guarded for a missing `window`/object, since Vitest runs in Node). A global type declaration for `__UX_FLOWS_CONFIG__` goes in `src/vite-env.d.ts`. `parseAnalyticsConfig` itself is unchanged, so its existing tests stay valid. New tests cover the merge.

### 6. Health check
`HEALTHCHECK CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1`. BusyBox `wget` is in the Alpine base, so no extra packages are needed.

### 7. Documentation
`apps/app-ux-flows/DEPLOYMENT.md` covers build and run commands (`docker run -p 8080:8080 -e VITE_MATOMO_URL=… app-ux-flows`), the variable table, the health endpoint, caching behaviour and the BuildKit requirement. `.env.example` gets a one-line pointer to it.

## Risks / Trade-offs

- [`pnpm fetch` + filtered offline install doesn't match the lockfile, for example because other workspaces' importers are missing] → pnpm's frozen check covers only the selected importers. If it still fails, the fallback is to copy every workspace `package.json` (not sources) before installing. The fallback is noted in tasks.
- [Runtime config is visible to anyone who loads the page] → Only the allowlisted, already-public analytics settings are emitted. Matomo URLs and ids are public by nature.
- [Old BuildKit-less Docker ignores `Dockerfile.dockerignore`, so `.npmrc` would enter the context] → The docs state the BuildKit requirement (default since Docker 23). The Dockerfile never `COPY`s the repository root wholesale or `.npmrc`, so even with an ignored ignore file the token is not copied into a layer.
- [Native binary not resolved in the build stage] → Use Debian slim (glibc), and pin the Node image to `.nvmrc`'s version.
- [A cached `config.js` keeps old settings] → `no-cache` on `/config.js` and `index.html`.

## Migration Plan

This change adds only a deployment path. Local development is unchanged (`public/config.js` is empty, so `.env.local` still applies). To deploy, build the image and run it with the analytics variables set. To roll back, redeploy the previous image tag. Nothing persistent is involved.
