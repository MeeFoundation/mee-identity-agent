import { Provider } from 'jotai'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { VariantSource } from '@/shared/analytics/analytics-event'

import type { FlowEventSink } from '../analytics/flow-events'
import { useFlowRunAnalytics } from '../analytics/use-flow-run-analytics'
import { MissionCard } from '../briefing/mission-card'
import { CompletionView } from './completion-view'
import type { ComponentEnvironment, FlowStore, ScreenComponent } from './define-flow'
import { type FlowNavigation, FlowRuntimeContext } from './flow-context'
import type { ResolvedFlow } from './resolve-flow'

type FlowRun = {
  id: number
  store: FlowStore
  status: 'in-progress' | 'completed'
  // Whether a completed run replaces the screen with the completion view.
  completionView: boolean
  // Whether the mission card still covers the screen; only showcase runs that start on the initial screen get one.
  briefing: boolean
  // After a restart, until the route reaches the initial screen: the old screen must not mount on the new store.
  restarting: boolean
}

// What the page around the runner needs to brief the tester and offer "Start over".
export type FlowRunState = {
  id: number
  completed: boolean
  restart: () => void
}

type FlowRunnerProps<S extends string, C extends ComponentEnvironment, I extends object> = {
  flow: ResolvedFlow<S, C, I>
  variantSource: VariantSource
  screenId: S
  initialState?: I
  componentOverrides?: Partial<C>
  onComplete?: () => void
  onRunChange?: (run: FlowRunState) => void
  navigateToScreen: (screenId: S) => void
  goBack: () => void
  exit: () => void
}

export const FlowRunner = <S extends string, C extends ComponentEnvironment, I extends object>({
  flow,
  variantSource,
  screenId,
  initialState,
  componentOverrides,
  onComplete,
  onRunChange,
  navigateToScreen,
  goBack,
  exit,
}: FlowRunnerProps<S, C, I>) => {
  const isShowcase = flow.kind === 'showcase'
  const [run, setRun] = useState<FlowRun>(() => ({
    briefing: isShowcase && screenId === flow.initialScreen,
    completionView: false,
    id: 0,
    restarting: false,
    status: 'in-progress',
    store: flow.createStore(initialState),
  }))
  const completedRunId = useRef<number | null>(null)
  const showCompletionView = run.status === 'completed' && run.completionView

  const tracker = useFlowRunAnalytics({
    completed: run.status === 'completed',
    completionViewShowing: showCompletionView,
    enabled: flow.kind === 'experiment',
    flowId: flow.flowId,
    runKey: run.id,
    screenId,
    variantId: flow.variantId,
    variantSource,
  })

  const components = useMemo(
    () => ({ ...flow.components, ...componentOverrides }),
    [flow.components, componentOverrides],
  )

  const navigation = useMemo<FlowNavigation<S>>(
    () => ({
      back: goBack,
      complete: (options) => {
        if (completedRunId.current === run.id) return
        completedRunId.current = run.id
        const completionView = options?.showCompletionView ?? true
        setRun((previous) => ({ ...previous, completionView, status: 'completed' }))
        onComplete?.()
      },
      goToScreen: navigateToScreen,
      restart: () => {
        tracker.restart(screenId, flow.initialScreen)
        setRun((previous) => ({
          briefing: isShowcase,
          completionView: false,
          id: previous.id + 1,
          restarting: true,
          status: 'in-progress',
          store: flow.createStore(initialState),
        }))
        navigateToScreen(flow.initialScreen)
      },
    }),
    [flow, initialState, run.id, onComplete, navigateToScreen, goBack, tracker, screenId, isShowcase],
  )

  // A stable restart for the page, always running the current run's restart.
  const restartRef = useRef(navigation.restart)
  useLayoutEffect(() => {
    restartRef.current = navigation.restart
  }, [navigation.restart])
  const restart = useCallback(() => restartRef.current(), [])

  const completed = run.status === 'completed'
  useEffect(() => {
    onRunChange?.({ completed, id: run.id, restart })
  }, [onRunChange, completed, run.id, restart])

  const awaitingInitialScreen = run.restarting && screenId !== flow.initialScreen
  useLayoutEffect(() => {
    if (run.restarting && screenId === flow.initialScreen) setRun((previous) => ({ ...previous, restarting: false }))
  }, [run.restarting, screenId, flow.initialScreen])

  const startRun = useCallback(() => setRun((previous) => ({ ...previous, briefing: false })), [])

  // Bound to the rendered screen, so an interaction that navigates away is still attributed to its screen.
  const analytics = useMemo<FlowEventSink>(
    () => ({ track: (event, props) => tracker.track(screenId, event, props) }),
    [tracker, screenId],
  )

  const runtime = useMemo(() => ({ analytics, components, navigation }), [analytics, components, navigation])

  const Screen: ScreenComponent | undefined = flow.screens[screenId]
  if (!Screen) throw new Error(`Flow "${flow.flowId}" has no screen "${screenId}" in its resolved variant`)

  return (
    <Provider store={run.store}>
      <FlowRuntimeContext.Provider value={runtime}>
        {showCompletionView ? (
          <CompletionView onExit={exit} onRestart={navigation.restart} titleKey={flow.titleKey} />
        ) : (
          !awaitingInitialScreen && <Screen key={run.id} />
        )}
        {run.briefing && <MissionCard flow={flow} key={`mission-${run.id}`} onStart={startRun} />}
      </FlowRuntimeContext.Provider>
    </Provider>
  )
}
