## Purpose

Defines how `app-ux-flows` is packaged as a container image and how that container serves the SPA: build inputs, routing, caching, health checking and runtime configuration. One image can then be deployed to any environment.

## ADDED Requirements

### Requirement: Container image build
The `app-ux-flows` workspace SHALL contain a container image definition and its build-context ignore rules. Building it with the repository root as the build context SHALL produce an image that serves the production build of `app-ux-flows`. The build SHALL use the Node.js version pinned for the repository and the pnpm version declared by the repository. It SHALL install dependencies from the committed lockfile without changing it, and SHALL install only what `app-ux-flows` needs. The build SHALL fail if the app's type check or production build fails. The final image SHALL contain only the web server, its configuration, the startup script and the built static assets, with no Node.js runtime, source code or `node_modules`.

#### Scenario: Build from the repository root
- **WHEN** a developer builds the image with the repository root as context and the app's image definition
- **THEN** the build succeeds and produces an image that contains the built static assets

#### Scenario: Lockfile out of date
- **WHEN** `apps/app-ux-flows/package.json` declares a dependency that the committed lockfile does not cover
- **THEN** the image build fails instead of resolving a new dependency tree

#### Scenario: Type error fails the build
- **WHEN** a file in `apps/app-ux-flows/src` has a TypeScript error
- **THEN** the image build fails

### Requirement: Build context excludes secrets and local files
The build context ignore rules SHALL exclude every `.npmrc` file, every `.env` and `.env.*` file (except `.env.example`), all `node_modules` and `dist` directories, the `.git` directory, and native `ios/` and `android/` projects. No registry token or local environment value SHALL end up in any image layer.

#### Scenario: Registry token is not in the image
- **WHEN** the repository root contains an `.npmrc` with a registry auth token and the image is built
- **THEN** no layer of the resulting image contains that `.npmrc` or the token

#### Scenario: Local Matomo settings are not baked in
- **WHEN** `apps/app-ux-flows/.env.local` sets a Matomo URL and the image is built
- **THEN** the built assets do not contain that URL

### Requirement: Serving the SPA
The container SHALL serve the app over HTTP on port 8080 and SHALL run its web server as a non-root user. A request for a path that matches a built static file SHALL return that file. A request for any other path that does not look like a file (no file extension) SHALL return the app's `index.html` with status 200, so client-side routes work as deep links. A request for a missing path that looks like a file SHALL return 404.

#### Scenario: Deep link to a flow screen
- **WHEN** a browser opens `/flows/exp-demo-001/ginger-info?variant=b` on a running container
- **THEN** the container returns `index.html` with status 200 and the app shows that screen

#### Scenario: Missing asset
- **WHEN** a client requests `/assets/does-not-exist.js`
- **THEN** the container responds with 404, not with `index.html`

### Requirement: Caching headers
Fingerprinted build assets SHALL be served with a long-lived, immutable cache policy. `index.html` and the runtime configuration file SHALL be served with a policy that makes browsers revalidate them on every load, so a new deployment or configuration takes effect on the next page load.

#### Scenario: Fingerprinted asset is cached
- **WHEN** a client requests a file under `/assets/`
- **THEN** the response allows caching for at least one year and marks it immutable

#### Scenario: Entry point is not cached
- **WHEN** a client requests `/` or a deep link
- **THEN** the response tells the browser not to reuse it without revalidation

### Requirement: Health endpoint
The container SHALL answer `GET /healthz` with status 200 and a short plain-text body while the web server is running, without serving the app. The image SHALL declare a health check that uses this endpoint.

#### Scenario: Health check
- **WHEN** an orchestrator requests `/healthz` on a running container
- **THEN** it receives status 200

### Requirement: Runtime configuration from environment variables
At startup the container SHALL read the app's analytics settings from environment variables with the same names as the app's build-time variables (`VITE_ANALYTICS_ENABLED`, `VITE_ANALYTICS_DEBUG`, `VITE_MATOMO_URL`, `VITE_MATOMO_SITE_ID` and the `VITE_MATOMO_DIMENSION_*` ids). It SHALL publish them to the app as runtime configuration before the app loads. Only variables set on the container SHALL be included. Values SHALL be escaped so that no value can inject script into the page. Restarting the container with different values SHALL change the app's configuration without rebuilding the image. Environment variables not in this list SHALL NOT be exposed to the browser.

#### Scenario: Configure Matomo on a running deployment
- **WHEN** the same image is started once with `VITE_MATOMO_URL` and `VITE_MATOMO_SITE_ID` set and once without them
- **THEN** the first container's app sends analytics to that Matomo instance and the second loads no Matomo script

#### Scenario: Unlisted variables stay private
- **WHEN** the container is started with an unrelated environment variable such as `DATABASE_PASSWORD`
- **THEN** that variable's value does not appear in any response the container serves

#### Scenario: Value with quotes
- **WHEN** a configured value contains a double quote or a `</script>` sequence
- **THEN** the runtime configuration remains valid and the value is delivered as a plain string

### Requirement: Deployment documentation
The `app-ux-flows` workspace SHALL document how to build the image, run it locally, and set each runtime configuration variable, including which port to publish and the health endpoint.

#### Scenario: Run locally from the docs
- **WHEN** a developer follows the documented build and run commands
- **THEN** the app is reachable in a browser on the documented local port
