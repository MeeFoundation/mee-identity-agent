# Deploying app-ux-flows

`app-ux-flows` ships as a container image: nginx serves the static Vite build. You can deploy the same image to any environment. Analytics is configured with environment variables when the container starts, so you don't rebuild per environment.

## Build

Run from the **repository root**. The build needs the root lockfile and workspace files:

```sh
docker build -f apps/app-ux-flows/Dockerfile -t app-ux-flows .
```

Requires Docker with BuildKit, the default since Docker 23. BuildKit applies `apps/app-ux-flows/Dockerfile.dockerignore`, which sends only the root manifests, the lockfile, the root `tsconfig.json` and the app workspace to the build. `.npmrc`, `.env*` files (except `.env.example`), `node_modules` and `dist` are never sent.

The build installs dependencies from `pnpm-lock.yaml` with `--frozen-lockfile` and runs the app's type check and production build. It fails if the lockfile is out of date or the type check fails.

## Run

```sh
docker run --rm -p 8080:8080 app-ux-flows
```

Open http://localhost:8080. If port 8080 is busy on your machine (for example, local Matomo from `just matomo-start`), publish a different host port: `-p 8090:8080`.

- The container listens on port **8080** and runs nginx as a non-root user (uid 101).
- `GET /healthz` returns `200 ok`. The image declares a Docker `HEALTHCHECK` that uses it.
- Client-side routes such as `/flows/exp-demo-001/ginger-info?variant=b` serve `index.html`. A missing path with a file extension returns 404.

## Runtime configuration

Set the analytics variables on the container. They have the same names as in `.env.example`:

```sh
docker run --rm -p 8080:8080 \
  -e VITE_MATOMO_URL=https://matomo.example.com/ \
  -e VITE_MATOMO_SITE_ID=3 \
  -e VITE_MATOMO_DIMENSION_FLOW_ID=1 \
  app-ux-flows
```

| Variable | Meaning |
|---|---|
| `VITE_ANALYTICS_ENABLED` | Master switch, `true` by default. `false` loads no analytics at all. |
| `VITE_ANALYTICS_DEBUG` | `true` writes every analytics event to the browser console. |
| `VITE_MATOMO_URL` | Matomo base URL. Matomo is used only when both this and the site id are set. |
| `VITE_MATOMO_SITE_ID` | Matomo site id (integer). |
| `VITE_MATOMO_DIMENSION_FLOW_ID` | Custom dimension id for the flow id. |
| `VITE_MATOMO_DIMENSION_VARIANT_ID` | Custom dimension id for the variant id. |
| `VITE_MATOMO_DIMENSION_RUN_ID` | Custom dimension id for the run id. |
| `VITE_MATOMO_DIMENSION_SCREEN_ID` | Custom dimension id for the screen id. |
| `VITE_MATOMO_DIMENSION_VARIANT_SOURCE` | Custom dimension id for the variant source. |

At startup the container writes the variables that are set (and only those) to `/config.js` as `window.__UX_FLOWS_CONFIG__`, and the app reads it before it loads. A variable set on the container wins over the build-time value, even when it is empty. A variable that isn't set falls back to the build-time value. In images built with this Dockerfile there are no build-time values, so the variable is simply unset. Other environment variables are never exposed to the browser. To change the configuration, restart the container with new values; no rebuild is needed.

In local development, `public/config.js` is an empty object, so `.env.local` applies as before.

## Caching

| Path | Cache-Control |
|---|---|
| `/assets/*` (fingerprinted) | `public, max-age=31536000, immutable` |
| `/`, `/index.html`, client-side routes | `no-cache` |
| `/config.js` | `no-cache` |

A new deployment or configuration change takes effect on the next page load.
