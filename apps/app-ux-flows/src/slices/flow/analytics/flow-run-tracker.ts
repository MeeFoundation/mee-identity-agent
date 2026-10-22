import { isReservedEventName } from './flow-events'
import type { RunRecord, RunStorage } from './run-storage'
import type {
  AnalyticsAdapter,
  AnalyticsDimensions,
  AnalyticsEvent,
  AnalyticsProps,
  VariantSource,
} from '@/shared/analytics/analytics-event'

export type FlowRunTrackerOptions = {
  flowId: string
  variantId: string | null
  variantSource: VariantSource
  sink: Pick<AnalyticsAdapter, 'record'>
  storage: RunStorage
  now: () => number
  createId: () => string
  // `PerformanceNavigationTiming.type` of the document.
  navigationType: string
  // Path the document was loaded on.
  entryPath: string
  // Returns true only for the first runner mounted in the document, and consumes that state.
  consumeFirstMount: () => boolean
  warn?: (message: string) => void
}

// Committed runner state the tracker derives lifecycle events from.
export type RunnerState = {
  // Changes whenever the runner starts a new run.
  runKey: number
  screenId: string
  completed: boolean
  completionViewShowing: boolean
}

export type FlowRunTracker = {
  sync(state: RunnerState): void
  restart(fromScreenId: string, toScreenId: string): void
  track(screenId: string, event: string, props?: AnalyticsProps): void
  end(): void
}

type PendingRestart = {
  previousRunId: string
  entryScreenId: string
}

const screenPath = (flowId: string, screenId: string) => `/flows/${flowId}/${screenId}`

export const createFlowRunTracker = (options: FlowRunTrackerOptions): FlowRunTracker => {
  const { flowId, variantId, sink, storage, now, createId } = options

  let current: RunRecord | null = null
  let currentRunKey: number | null = null
  let lastScreenId: string | null = null
  let pendingRestart: PendingRestart | null = null
  let resumeChecked = false
  let ended = false

  const persist = () => {
    if (current) storage.write(flowId, current)
  }

  const dimensionsFor = (run: RunRecord, screenId: string): AnalyticsDimensions => ({
    flowId,
    runId: run.runId,
    screenId,
    variantId: run.variantId,
    variantSource: run.variantSource,
  })

  const emit = (run: RunRecord, screenId: string, event: Omit<AnalyticsEvent, 'dimensions'>) => {
    sink.record({ ...event, dimensions: dimensionsFor(run, screenId) })
  }

  const canResume = () => {
    if (resumeChecked) return false
    resumeChecked = true
    if (!options.consumeFirstMount()) return false
    if (options.navigationType !== 'reload' && options.navigationType !== 'back_forward') return false
    return `${options.entryPath}/`.includes(`/flows/${flowId}/`)
  }

  const beginRun = (screenId: string) => {
    if (canResume()) {
      const stored = storage.read(flowId)
      if (stored && stored.variantId === variantId) {
        current = stored
        emit(stored, screenId, { kind: 'lifecycle', name: 'flow_resumed', props: {} })
        return
      }
    }

    const restart = pendingRestart
    pendingRestart = null
    const run: RunRecord = {
      runId: createId(),
      startedAt: now(),
      status: 'in-progress',
      variantId,
      variantSource: options.variantSource,
      visitedScreenIds: [],
    }
    current = run
    persist()
    emit(run, screenId, {
      kind: 'lifecycle',
      name: 'flow_started',
      props: restart
        ? { entry_screen_id: screenId, previous_run_id: restart.previousRunId, trigger: 'restart' }
        : { entry_screen_id: screenId, trigger: 'start' },
    })
  }

  return {
    end: () => {
      ended = true
      storage.remove(flowId)
    },

    restart: (fromScreenId, toScreenId) => {
      if (!current) return
      emit(current, fromScreenId, { kind: 'lifecycle', name: 'flow_restarted', props: {} })
      pendingRestart = { entryScreenId: toScreenId, previousRunId: current.runId }
    },

    sync: (state) => {
      // React's development double-mount ends the tracker and immediately syncs it again.
      if (ended) {
        ended = false
        persist()
      }

      if (state.runKey !== currentRunKey) {
        // A restarted run starts once the runner has navigated to its initial screen.
        if (pendingRestart && state.screenId !== pendingRestart.entryScreenId) return
        currentRunKey = state.runKey
        lastScreenId = null
        beginRun(state.screenId)
      }

      const run = current
      if (!run) return

      if (!state.completionViewShowing && state.screenId !== lastScreenId) {
        const referrerPath = lastScreenId === null ? null : screenPath(flowId, lastScreenId)
        lastScreenId = state.screenId
        if (!run.visitedScreenIds.includes(state.screenId)) run.visitedScreenIds.push(state.screenId)
        persist()
        emit(run, state.screenId, {
          kind: 'screen_view',
          name: 'screen_viewed',
          page: { path: screenPath(flowId, state.screenId), referrerPath, title: `${flowId}/${state.screenId}` },
          props: {},
        })
      }

      if (state.completed && run.status !== 'completed') {
        const durationSeconds = Math.max(0, Math.round((now() - run.startedAt) / 1000))
        run.status = 'completed'
        persist()
        emit(run, state.screenId, {
          kind: 'lifecycle',
          name: 'flow_completed',
          props: { duration_seconds: durationSeconds, visited_screen_count: run.visitedScreenIds.length },
          value: durationSeconds,
        })
      }
    },

    track: (screenId, event, props = {}) => {
      if (isReservedEventName(event)) {
        options.warn?.(`"${event}" is a reserved lifecycle event name and was not recorded`)
        return
      }
      if (!current) return
      emit(current, screenId, { kind: 'interaction', name: event, props })
    },
  }
}

const ignore = () => {}

const disabledFlowRunTracker: FlowRunTracker = { end: ignore, restart: ignore, sync: ignore, track: ignore }

// Showcases are not tracked: no run id, no stored run and no events, so the real tracker is never created.
export const selectFlowRunTracker = (enabled: boolean, create: () => FlowRunTracker): FlowRunTracker =>
  enabled ? create() : disabledFlowRunTracker
