## Why

`app-ux-flows` can only be run with the local Vite dev server. To put flows in front of test participants and stakeholders, it needs a deployable artifact. A container image is the most portable option. Analytics settings (Matomo URL, site id, dimension ids) are now baked in at build time, which would mean one image per environment. Deployments need to configure them when the container starts instead.

## What Changes

- Add a container image definition for `app-ux-flows`, kept inside the app workspace. The image:
  - builds the app from the monorepo with the pinned Node and pnpm versions, installing only the app's dependencies,
  - serves the static bundle from a small web server,
  - falls back to the SPA's `index.html` for deep links such as `/flows/exp-demo-001/ginger-info?variant=b`,
  - caches fingerprinted assets long-term and never caches the HTML entry point or runtime config,
  - exposes a health endpoint.
- Keep secrets and local files out of the build context: the root `.npmrc` with its registry token, `.env*` files, `node_modules`, and `dist`.
- Let the container read analytics settings from environment variables at startup and expose them to the app as runtime configuration. Build-time values from `.env.local` remain the fallback for local development. One image works in every environment.
- Document how to build, run and configure the image.

## Capabilities

### New Capabilities
- `app-ux-flows/deployment`: building `app-ux-flows` into a container image, and how that container serves the SPA (routing fallback, caching, health check, runtime configuration, build-context hygiene).

### Modified Capabilities
- `app-ux-flows/flow-analytics`: the "Analytics configuration" requirement changes from build-time-only environment variables to runtime configuration provided by the deployment, falling back to build-time variables.

## Impact

- New files in `apps/app-ux-flows/`: the Dockerfile, its dockerignore file, the web server config, the container startup script that writes runtime config, a default runtime config file served in development, and deployment docs.
- `apps/app-ux-flows/index.html`: loads the runtime config before the app bundle.
- `apps/app-ux-flows/src/app/analytics.ts` (and its test, plus a type declaration for the runtime config global): analytics config is resolved from runtime config first, then from build-time env.
- `apps/app-ux-flows/.env.example`: notes that the same variables can be set on the container.
- Requires Docker with BuildKit, the default in current Docker, so the per-Dockerfile ignore file is applied. No changes to other apps, packages or CI.
