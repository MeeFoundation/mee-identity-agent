import { describe, expect, it } from 'vitest'

import type { AnalyticsEvent } from '@/shared/analytics/analytics-event'

import { createFlowRunTracker, type FlowRunTrackerOptions, type RunnerState } from './flow-run-tracker'
import { createRunStorage, type RunStorage } from './run-storage'

const createMemoryStorage = (): RunStorage => {
  const items = new Map<string, string>()
  return createRunStorage(() => ({
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    get length() {
      return items.size
    },
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, value)
    },
  }))
}

type Harness = {
  events: AnalyticsEvent[]
  storage: RunStorage
  clock: { now: number }
  warnings: string[]
  create: (overrides?: Partial<FlowRunTrackerOptions>) => ReturnType<typeof createFlowRunTracker>
}

const createHarness = (): Harness => {
  const events: AnalyticsEvent[] = []
  const storage = createMemoryStorage()
  const clock = { now: 1_000_000 }
  const warnings: string[] = []
  let nextId = 0

  return {
    clock,
    create: (overrides = {}) =>
      createFlowRunTracker({
        consumeFirstMount: () => true,
        createId: () => {
          nextId += 1
          return `run-${nextId}`
        },
        entryPath: '/flows/exp-pet-002/ginger-notes',
        flowId: 'exp-pet-002',
        navigationType: 'navigate',
        now: () => clock.now,
        sink: { record: (event) => events.push(event) },
        storage,
        variantId: 'b',
        variantSource: 'assigned',
        warn: (message) => warnings.push(message),
        ...overrides,
      }),
    events,
    storage,
    warnings,
  }
}

const state = (screenId: string, overrides: Partial<RunnerState> = {}): RunnerState => ({
  completed: false,
  completionViewShowing: false,
  runKey: 0,
  screenId,
  ...overrides,
})

const names = (events: AnalyticsEvent[]) => events.map((event) => `${event.name}:${event.dimensions.screenId}`)

const reloadOptions = (entryPath: string): Partial<FlowRunTrackerOptions> => ({ entryPath, navigationType: 'reload' })

describe('flow run tracker', () => {
  it('starts a run and keeps its run id across screen changes', () => {
    const { create, events } = createHarness()
    const tracker = create()

    tracker.sync(state('ginger-notes'))
    tracker.sync(state('ginger-info'))
    tracker.sync(state('ginger-notes'))

    expect(names(events)).toEqual([
      'flow_started:ginger-notes',
      'screen_viewed:ginger-notes',
      'screen_viewed:ginger-info',
      'screen_viewed:ginger-notes',
    ])
    expect(new Set(events.map((event) => event.dimensions.runId))).toEqual(new Set(['run-1']))
    expect(events[0].props).toEqual({ entry_screen_id: 'ginger-notes', trigger: 'start' })
  })

  it('builds page views with the previous screen as referrer', () => {
    const { create, events } = createHarness()
    const tracker = create()

    tracker.sync(state('ginger-notes'))
    tracker.sync(state('ginger-info'))

    expect(events[1].page).toEqual({
      path: '/flows/exp-pet-002/ginger-notes',
      referrerPath: null,
      title: 'exp-pet-002/ginger-notes',
    })
    expect(events[2].page?.referrerPath).toBe('/flows/exp-pet-002/ginger-notes')
  })

  it('does not re-emit for a repeated sync of the same screen', () => {
    const { create, events } = createHarness()
    const tracker = create()

    tracker.sync(state('ginger-notes'))
    tracker.sync(state('ginger-notes'))
    tracker.end()
    tracker.sync(state('ginger-notes'))

    expect(names(events)).toEqual(['flow_started:ginger-notes', 'screen_viewed:ginger-notes'])
  })

  it('keeps the run record across the development double mount', () => {
    const { create, storage } = createHarness()
    const tracker = create()

    tracker.sync(state('ginger-notes'))
    tracker.end()
    tracker.sync(state('ginger-notes'))

    expect(storage.read('exp-pet-002')?.runId).toBe('run-1')
  })

  it('records the entry screen of a direct link', () => {
    const { create, events } = createHarness()

    create({ entryPath: '/flows/exp-pet-002/medical' }).sync(state('medical'))

    expect(names(events)).toEqual(['flow_started:medical', 'screen_viewed:medical'])
    expect(events[0].props.entry_screen_id).toBe('medical')
  })

  it('resumes an in-progress run on reload without a new start', () => {
    const { create, events } = createHarness()
    create().sync(state('ginger-notes'))
    events.length = 0

    create(reloadOptions('/flows/exp-pet-002/ginger-info')).sync(state('ginger-info'))

    expect(names(events)).toEqual(['flow_resumed:ginger-info', 'screen_viewed:ginger-info'])
    expect(events.every((event) => event.dimensions.runId === 'run-1')).toBe(true)
  })

  it('resumes on history traversal into the flow', () => {
    const { create, events } = createHarness()
    create().sync(state('ginger-notes'))
    events.length = 0

    create({ entryPath: '/flows/exp-pet-002/ginger-notes', navigationType: 'back_forward' }).sync(state('ginger-notes'))

    expect(events[0].name).toBe('flow_resumed')
  })

  it('resumes a completed run without completing it again', () => {
    const { create, events } = createHarness()
    const first = create()
    first.sync(state('ginger-notes'))
    first.sync(state('medication-added'))
    first.sync(state('medication-added', { completed: true }))
    events.length = 0

    const resumed = create(reloadOptions('/flows/exp-pet-002/medication-added'))
    resumed.sync(state('medication-added'))
    resumed.sync(state('medication-added', { completed: true }))

    expect(names(events)).toEqual(['flow_resumed:medication-added', 'screen_viewed:medication-added'])
  })

  it('starts a new run on a fresh navigation even when a record exists', () => {
    const { create, events } = createHarness()
    create().sync(state('ginger-notes'))
    events.length = 0

    create().sync(state('ginger-info'))

    expect(events[0].name).toBe('flow_started')
    expect(events[0].dimensions.runId).toBe('run-2')
  })

  it.each([
    ['the document was loaded outside the flow', { consumeFirstMount: () => true, entryPath: '/' }],
    ['another runner was already mounted', { consumeFirstMount: () => false, entryPath: '/flows/exp-pet-002/medical' }],
    ['the record belongs to another flow path', { consumeFirstMount: () => true, entryPath: '/flows/exp-pet-0022/a' }],
  ])('starts a new run on reload when %s', (_, overrides) => {
    const { create, events } = createHarness()
    create().sync(state('ginger-notes'))
    events.length = 0

    create({ navigationType: 'reload', ...overrides }).sync(state('ginger-notes'))

    expect(events[0].name).toBe('flow_started')
  })

  it('starts a new run when the variant changed', () => {
    const { create, events } = createHarness()
    create().sync(state('ginger-notes'))
    events.length = 0

    create({ ...reloadOptions('/flows/exp-pet-002/ginger-notes'), variantId: 'a', variantSource: 'url' }).sync(
      state('ginger-notes'),
    )

    expect(events[0].name).toBe('flow_started')
    expect(events[0].dimensions).toMatchObject({ runId: 'run-2', variantId: 'a', variantSource: 'url' })
  })

  it('records completion once with duration and visited screen count', () => {
    const { create, events, clock } = createHarness()
    const tracker = create()

    tracker.sync(state('ginger-notes'))
    tracker.sync(state('ginger-info'))
    tracker.sync(state('ginger-notes'))
    clock.now += 95_400
    tracker.sync(state('medication-added', { completed: true }))
    tracker.sync(state('medication-added', { completed: true }))
    tracker.sync(state('ginger-info', { completed: true }))
    tracker.sync(state('medication-added', { completed: true }))

    const completions = events.filter((event) => event.name === 'flow_completed')
    expect(completions).toHaveLength(1)
    expect(completions[0]).toMatchObject({
      dimensions: { screenId: 'medication-added' },
      kind: 'lifecycle',
      props: { duration_seconds: 95, visited_screen_count: 3 },
      value: 95,
    })
    expect(names(events).slice(4, 6)).toEqual(['screen_viewed:medication-added', 'flow_completed:medication-added'])
  })

  it('measures duration from the original start across a reload', () => {
    const { create, events, clock } = createHarness()
    create().sync(state('ginger-notes'))
    clock.now += 60_000

    create(reloadOptions('/flows/exp-pet-002/ginger-notes')).sync(state('ginger-notes', { completed: true }))

    expect(events.find((event) => event.name === 'flow_completed')?.value).toBe(60)
  })

  it('records no screen view while the completion view shows', () => {
    const { create, events } = createHarness()
    const tracker = create()

    tracker.sync(state('ginger-notes'))
    tracker.sync(state('ginger-notes', { completed: true, completionViewShowing: true }))
    tracker.sync(state('ginger-info', { completed: true, completionViewShowing: true }))

    expect(names(events)).toEqual([
      'flow_started:ginger-notes',
      'screen_viewed:ginger-notes',
      'flow_completed:ginger-notes',
    ])
  })

  it('restarts with a new run id that points to the previous run', () => {
    const { create, events } = createHarness()
    const tracker = create()
    tracker.sync(state('ginger-notes'))
    tracker.sync(state('medical', { completed: true, completionViewShowing: true }))
    events.length = 0

    tracker.restart('medical', 'ginger-notes')
    // The runner renders the new run before navigation to the initial screen lands.
    tracker.sync(state('medical', { runKey: 1 }))
    tracker.sync(state('ginger-notes', { runKey: 1 }))

    expect(names(events)).toEqual(['flow_restarted:medical', 'flow_started:ginger-notes', 'screen_viewed:ginger-notes'])
    expect(events[0].dimensions.runId).toBe('run-1')
    expect(events[1].dimensions.runId).toBe('run-2')
    expect(events[1].props).toEqual({ entry_screen_id: 'ginger-notes', previous_run_id: 'run-1', trigger: 'restart' })
  })

  it('enriches interaction events with the full context and the given screen', () => {
    const { create, events } = createHarness()
    const tracker = create({ variantSource: 'url' })
    tracker.sync(state('ginger-info'))

    tracker.track('ginger-info', 'medication_form_added', { method: 'ai_suggestion' })
    tracker.sync(state('medication-added'))

    expect(events[2]).toEqual({
      dimensions: {
        flowId: 'exp-pet-002',
        runId: 'run-1',
        screenId: 'ginger-info',
        variantId: 'b',
        variantSource: 'url',
      },
      kind: 'interaction',
      name: 'medication_form_added',
      props: { method: 'ai_suggestion' },
    })
  })

  it('drops reserved event names passed as interactions', () => {
    const { create, events, warnings } = createHarness()
    const tracker = create()
    tracker.sync(state('ginger-notes'))
    events.length = 0

    tracker.track('ginger-notes', 'flow_completed')
    tracker.track('ginger-notes', 'screen_viewed')

    expect(events).toEqual([])
    expect(warnings).toHaveLength(2)
  })

  it('removes the run record when it ends', () => {
    const { create, storage } = createHarness()
    const tracker = create()
    tracker.sync(state('ginger-notes'))

    tracker.end()

    expect(storage.read('exp-pet-002')).toBeNull()
  })
})
