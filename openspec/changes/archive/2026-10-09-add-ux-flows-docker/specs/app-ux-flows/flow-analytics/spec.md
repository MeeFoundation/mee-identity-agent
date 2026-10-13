## MODIFIED Requirements

### Requirement: Analytics configuration
Analytics SHALL be configured by a set of settings covering: whether analytics is enabled, the Matomo base URL, the Matomo site id, the Matomo custom dimension id for each analytics dimension, and whether debug console output is on. Each setting SHALL be read from the runtime configuration provided by the deployment when the deployment sets it. Otherwise it SHALL fall back to the app's build-time environment variable of the same name. A setting the deployment provides SHALL win over the build-time value, even when it is empty. Settings SHALL be read once, when the app loads. Matomo SHALL be used only when analytics is enabled and both the base URL and site id are set. No environment-specific Matomo URL, site id or dimension id SHALL appear in source code. A dimension whose id is not configured SHALL be omitted from what is sent to Matomo, without affecting the others. The settings SHALL be documented in an example environment file inside the app workspace.

#### Scenario: Matomo not configured
- **WHEN** analytics is enabled but no Matomo URL or site id is set
- **THEN** no Matomo script is loaded and flows work normally

#### Scenario: Dimension id not configured
- **WHEN** the run dimension has no configured id
- **THEN** page views and events are sent to Matomo without a run dimension, and every configured dimension is still sent

#### Scenario: Deployment configures Matomo at startup
- **WHEN** a deployed container is started with a Matomo URL and site id, and the image was built without them
- **THEN** the app loads Matomo with that URL and site id

#### Scenario: Runtime value overrides build-time value
- **WHEN** the build-time environment enables analytics and the deployment sets analytics enabled to `false`
- **THEN** no analytics script is loaded and no analytics network request is made

#### Scenario: Local development without runtime configuration
- **WHEN** a developer runs the dev server with Matomo settings in the app's local environment file and no deployment-provided settings
- **THEN** analytics uses the settings from the local environment file
