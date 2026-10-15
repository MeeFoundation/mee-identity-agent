# app-ux-flows/flow-analytics Specification

## Purpose

Records how participants move through `app-ux-flows` UX flows, and which intentional interactions they perform, in a form that makes A/B variants directly comparable. Matomo is the reporting system, but screens and the Flow Runtime never depend on it.

## Requirements

### Requirement: Analytics is observational
Analytics SHALL never change or block what a participant experiences. If the analytics backend is disabled, not configured, blocked by the browser, fails to load, is unreachable, or throws, every flow SHALL still start, navigate, restart and complete exactly as it does without analytics, and no error SHALL be shown to the participant. A failure in one analytics destination SHALL NOT prevent delivery to the others.

#### Scenario: Tracker blocked by the browser
- **WHEN** a content blocker prevents the Matomo script from loading and a participant runs a flow to completion
- **THEN** every screen, navigation and the completion behave normally and no error is shown

#### Scenario: Destination throws
- **WHEN** one analytics destination throws while recording an event
- **THEN** the participant's action still completes, and the other configured destinations still receive the event

#### Scenario: Analytics disabled
- **WHEN** the app is built with analytics disabled
- **THEN** no analytics script is loaded, no analytics network request is made, and flows behave as before

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

### Requirement: Development console output
In development builds, and in any build with debug output turned on, every analytics event SHALL also be written to the browser console, one entry per event. Each entry SHALL show the event name, its kind (lifecycle or interaction), the flow id, variant id, screen id, run id and the event's properties. This SHALL work without a Matomo instance. Production builds SHALL NOT write analytics to the console unless debug output is explicitly turned on.

#### Scenario: Inspecting events in development
- **WHEN** a developer runs the app in development mode without Matomo configured and taps an instrumented action
- **THEN** the console shows that event with its flow, variant, screen and run ids

### Requirement: Analytics Flow Run
Every analytics event of a flow SHALL belong to an analytics Flow Run: one participant execution of one flow in one variant. Each Flow Run SHALL have a random, unguessable run id that is generated in the browser and contains no participant information. The run id SHALL stay the same across all screen changes of that run, including flow navigation, browser back and forward, and screen-requested back. The run id SHALL be identity only. Whether a run's state is kept or reset is governed by `app-ux-flows/flow-runtime`, not by the run id.

A new Flow Run, with a new run id, SHALL start when:
- a participant starts a flow from the home page, or opens a flow URL from inside the app, while no Flow Run of that flow and variant is active in the current page,
- a participant opens a flow URL by link, by typing it, or in a new tab, as a fresh page load (not a reload or a history traversal),
- the run is restarted,
- the active variant changes while the flow is open.

The current Flow Run SHALL continue, with the same run id and its completed or in-progress status, when the page is reloaded or re-entered by browser history traversal in the same browser tab and the flow and variant are unchanged. A completed Flow Run that continues this way SHALL stay completed: it is never completed a second time, even if the runtime shows its screens again. Leaving the flow inside the app, for example to the home page, SHALL end the Flow Run so that it cannot be continued later.

#### Scenario: Run id is stable across navigation
- **WHEN** a participant moves from `ginger-notes` to `ginger-info`, presses browser back, then browser forward
- **THEN** every event of those screens carries the same run id

#### Scenario: Reload continues the run
- **WHEN** a participant reloads the page on a screen of an in-progress run
- **THEN** events after the reload carry the same run id as before, and no new start is recorded for it

#### Scenario: Starting again from the home page
- **WHEN** a participant leaves a flow to the home page and starts the same flow again
- **THEN** a new run id is used

#### Scenario: Direct link in a new tab
- **WHEN** someone opens `/flows/<flowId>/<screenId>` in a new tab
- **THEN** a new Flow Run starts, and that screen is recorded as its entry screen

#### Scenario: Reload after completion
- **WHEN** a participant reloads `medication-added` after their run was silently completed there
- **THEN** events after the reload carry the same run id, and no second `flow_started` or `flow_completed` is recorded

#### Scenario: Variant change
- **WHEN** the `variant` URL parameter is edited to another valid variant while the flow is open
- **THEN** a new Flow Run starts in the new variant

### Requirement: Automatic runtime context
Every flow analytics event SHALL automatically carry the flow id, the active variant id (or none for flows without variants), the current screen id, the run id, and how the active variant was selected: `url`, `stored`, `assigned`, `default` or `none`. Screens and components SHALL NOT supply any of these values, and SHALL NOT be able to override them. An interaction recorded on a screen SHALL carry the id of the screen that was showing when it was recorded, even if that interaction then navigates to another screen.

#### Scenario: Interaction is enriched
- **WHEN** in variant `b` of `exp-pet-002`, on screen `ginger-info`, a screen records `medication_form_added` with `method: ai_suggestion`
- **THEN** the recorded event carries flow `exp-pet-002`, variant `b`, screen `ginger-info`, the current run id and the variant source, although the screen supplied only the event name and `method`

#### Scenario: Preview links are distinguishable
- **WHEN** a reviewer opens an automatic flow with `?variant=b`
- **THEN** that run's events carry variant source `url`, while automatically assigned participants' events carry `stored` or `assigned`

### Requirement: Lifecycle events
The runtime SHALL record these lifecycle events automatically, from where the flow is run and not from screens:

| Event | When | Properties besides the context |
|---|---|---|
| `flow_started` | a new Flow Run starts | entry screen id, start trigger (`start` or `restart`), previous run id after a restart |
| `flow_resumed` | a Flow Run continues after a reload or history traversal | none |
| `screen_viewed` | the screen shown for the run changes, or the run starts or resumes on a screen | none |
| `flow_completed` | the run is completed through the runtime | duration since the run started, in whole seconds, and the number of distinct screens viewed in the run |
| `flow_restarted` | the run is restarted | none; the event carries the run id that ended and the screen it was restarted from |

Screens SHALL NOT be able to record lifecycle event names through the interaction API. `flow_started` SHALL be recorded at most once per run id. `flow_completed` SHALL be recorded at most once per run id, including after reloads. `screen_viewed` SHALL be recorded once per screen change. Re-renders, repeated renders in development mode, and a redirect that lands on the same screen SHALL NOT record it again. `screen_viewed` SHALL NOT be recorded while a completed run's completion view is showing. A run's duration SHALL be measured from its own `flow_started`, across reloads.

The runtime SHALL NOT record a flow abandonment event. Abandonment is derived during analysis from runs that have `flow_started` but no `flow_completed`.

#### Scenario: Navigation records screen views
- **WHEN** a participant starts `exp-pet-002`, moves to `ginger-info`, then presses browser back
- **THEN** `flow_started`, then `screen_viewed` for `ginger-notes`, then `ginger-info`, then `ginger-notes` are recorded, all with the same run id

#### Scenario: Direct screen link
- **WHEN** someone opens `/flows/exp-pet-002/medical` as a fresh page load
- **THEN** `flow_started` with entry screen `medical` and `screen_viewed` for `medical` are recorded

#### Scenario: Completion is recorded once
- **WHEN** a run is completed, and the participant then uses browser back and forward, reloads, or the completing screen renders again
- **THEN** exactly one `flow_completed` is recorded for that run id

#### Scenario: Restart
- **WHEN** a participant restarts a run
- **THEN** `flow_restarted` is recorded with the old run id, then `flow_started` with a new run id, trigger `restart` and the old run id as previous run, then `screen_viewed` for the initial screen

#### Scenario: Reload mid-run
- **WHEN** a participant reloads on screen `ginger-info` of an in-progress run
- **THEN** `flow_resumed` and `screen_viewed` for `ginger-info` are recorded with the existing run id, and no `flow_started` is recorded

### Requirement: Semantic interaction events
Screens and flow-specific components SHALL be able to record a meaningful participant interaction by giving only a stable event name and, optionally, a small set of properties. Interactions SHALL be recorded only where code records them intentionally. The application SHALL NOT capture clicks, input, focus or pointer movement automatically. Shared building-block components SHALL NOT record flow-specific interactions themselves.

Each flow SHALL declare its interaction events and each event's properties in one typed place. Recording an event the flow does not declare, omitting required properties, or passing properties of the wrong type SHALL fail type checking.

#### Scenario: Declared event compiles
- **WHEN** an `exp-pet-002` screen records `medication_form_added` with `method: 'add_form'`
- **THEN** the app passes type checking

#### Scenario: Unknown event fails type checking
- **WHEN** a screen records an event name its flow does not declare
- **THEN** `pnpm check-types` reports an error

#### Scenario: Wrong payload fails type checking
- **WHEN** a screen records `medication_form_added` without `method`, or with a value not in its declared set
- **THEN** `pnpm check-types` reports an error

### Requirement: Event naming
Every analytics event name SHALL be a stable, machine-readable `snake_case` identifier. It SHALL NOT be derived from display text, translated copy or a variant id. Lifecycle names SHALL be the fixed `flow_*` and `screen_*` names above, and interaction events SHALL NOT use those prefixes. When participants in different variants perform an action with the same intent, every variant SHALL record the same event name. The variant is identified only by the automatic context. An action that exists in only one variant MAY have its own event name only if it is semantically different. If it achieves the same outcome as an action in other variants, it SHALL use the shared outcome event and set a property to tell the paths apart.

#### Scenario: Same intent in two variants
- **WHEN** a participant adds the medication form in variant `a` through the Add form sheet, and another participant does so in variant `b` through the AI suggestion
- **THEN** both record `medication_form_added`, differing only in the variant context and the `method` property

#### Scenario: Copy change does not change the event
- **WHEN** a button's label is changed in one variant
- **THEN** the event recorded by that button keeps the same name

### Requirement: Analytics payload privacy
Analytics event properties SHALL be limited to explicitly declared fields whose values are booleans, numbers, or strings from a fixed, declared set of values. Analytics SHALL NOT send participant-entered free text (such as notes or names), form contents, flow run state, or any personal information. The run id SHALL be random and SHALL NOT be derived from participant or device data. No participant user id SHALL be set in Matomo.

#### Scenario: Notes are not tracked
- **WHEN** a participant types in the `exp-pet-002` notes area
- **THEN** no analytics event contains the typed text

#### Scenario: State is not dumped
- **WHEN** any flow event is recorded
- **THEN** its properties contain only the fields declared for that event, plus the automatic context

### Requirement: Matomo screen page views
When Matomo is configured, each `screen_viewed` SHALL be sent as one Matomo page view. The page view SHALL use the custom URL `/flows/<flowId>/<screenId>`, with no query parameters, and the page title `<flowId>/<screenId>`, built from ids and not from translated text. The previous screen's URL SHALL be the referrer for screen changes within a run. The variant, run, flow, screen and variant-source dimensions SHALL be attached to the page view. The app SHALL NOT also send automatic page views on route changes, so each screen view is counted exactly once. Pages outside flows SHALL NOT be sent as page views by this capability.

#### Scenario: Screen change is one page view
- **WHEN** a participant in variant `b` moves from `ginger-info` to `add-form`
- **THEN** Matomo receives exactly one page view for `/flows/exp-pet-002/add-form`, with variant dimension `b`

#### Scenario: Variant links aggregate per screen
- **WHEN** one participant views `ginger-info` through `?variant=b` and another through automatic assignment to `b`
- **THEN** both page views have the URL `/flows/exp-pet-002/ginger-info` and are told apart only by the variant-source dimension

### Requirement: Matomo events and dimensions
When Matomo is configured, every lifecycle event other than `screen_viewed`, and every interaction event, SHALL be sent as one Matomo event:
- category `flow_lifecycle` for lifecycle events and `flow_interaction` for interaction events,
- the event name as the action,
- the event's properties encoded as the event name in the form `key=value`, sorted by key, separated by `;`, and omitted when there are none,
- a numeric value only for `flow_completed`, which carries the duration in seconds.

Flow id, variant id, run id, screen id and variant source SHALL be sent as Matomo custom dimensions on every page view and event. They SHALL be attached to each request individually, so one request never carries another run's or screen's values. They SHALL NOT be encoded into event categories, actions or names.

#### Scenario: Interaction event mapping
- **WHEN** `add_form_clicked` with `entry_point: medical_section` is recorded
- **THEN** Matomo receives an event with category `flow_interaction`, action `add_form_clicked`, name `entry_point=medical_section`, and the flow, variant, run, screen and variant-source dimensions

#### Scenario: Completion mapping
- **WHEN** a run completes 95 seconds after it started
- **THEN** Matomo receives an event with category `flow_lifecycle`, action `flow_completed` and value 95

### Requirement: New test session resets analytics
Starting a new test session from the home page SHALL end every resumable Flow Run in the browser tab, so that no later reload continues it. It SHALL also ask the analytics backend to attribute subsequent activity to a new visit, so that consecutive participants on one device are not merged into one Matomo visit.

#### Scenario: Next participant
- **WHEN** a facilitator chooses "Start new test session" and the next participant starts a flow
- **THEN** that flow gets a new run id and its activity is recorded in a new Matomo visit

### Requirement: Feedback-ready run identity
The run context (flow id, variant id, run id) SHALL be available to code running inside a flow through the analytics API, as automatic context on recorded events. A later participant-feedback event can then be recorded with the same flow, variant and run as the run it is about, without screens reading the variant id.

#### Scenario: Future feedback event
- **WHEN** a later change records a feedback event from inside a flow
- **THEN** it carries the same flow id, variant id and run id as the run's other events, without the feedback code supplying them

### Requirement: Showcases are not tracked
Flow analytics SHALL apply only to experiments. A run of a showcase SHALL NOT be an analytics Flow Run. For a showcase, the application SHALL NOT:
- record lifecycle events or interaction events,
- deliver any flow event to any analytics destination, including the development console,
- send Matomo page views or Matomo events,
- create a run id or store a resumable run.

The showcase SHALL behave exactly as it would with analytics disabled: it starts, navigates, restarts and completes normally. Screens and shared components used by a showcase MAY call the interaction API, and those calls SHALL have no effect. Experiments SHALL be tracked as before, including when a participant opens an experiment after a showcase in the same browser tab.

#### Scenario: Running a showcase sends nothing
- **WHEN** Matomo is configured and a viewer runs `chat-add-medication` from its first screen to completion
- **THEN** Matomo receives no page view and no event for that run, and the development console shows no flow analytics entry

#### Scenario: Reloading a showcase
- **WHEN** a viewer reloads a screen of `chat-add-medication`
- **THEN** no `flow_resumed`, `flow_started` or `screen_viewed` is recorded

#### Scenario: Experiment after a showcase
- **WHEN** a participant returns to the home page from a showcase and starts `exp-pet-002`
- **THEN** `exp-pet-002` gets a new run id and records `flow_started` and `screen_viewed` as usual

### Requirement: Analytics in dev mode
When a production build is in dev mode turned on through the URL, as defined by `app-ux-flows/flow-runtime`, analytics SHALL NOT be sent to Matomo for the rest of that page load: no Matomo script SHALL be loaded and no Matomo request SHALL be made, whatever the analytics configuration says. Every analytics event SHALL instead be written to the browser console, as defined in "Development console output". Flows SHALL record events as usual, so the console shows what a participant's run would send. A development build's analytics SHALL be unchanged. A production build not in dev mode SHALL use the analytics configuration as before.

#### Scenario: Reviewer runs are not tracked
- **WHEN** a production build with Matomo configured is opened with `?mode=dev` and a reviewer runs an experiment
- **THEN** no Matomo script is loaded and no Matomo request is made, and each event is written to the console

#### Scenario: Dev mode survives a reload without tracking
- **WHEN** a reviewer in dev mode on a production build reloads the page without the `mode` parameter
- **THEN** the app is still in dev mode, and still sends nothing to Matomo

#### Scenario: Tracking resumes after turning dev mode off
- **WHEN** a reviewer turns dev mode off and then runs an experiment in the same tab
- **THEN** events are sent to Matomo according to the analytics configuration
