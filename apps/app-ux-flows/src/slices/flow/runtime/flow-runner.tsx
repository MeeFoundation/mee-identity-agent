import { Provider } from 'jotai'
import { useMemo, useRef, useState } from 'react'

import type { VariantSource } from '@/shared/analytics/analytics-event'

import type { FlowEventSink } from '../analytics/flow-events'
import { useFlowRunAnalytics } from '../analytics/use-flow-run-analytics'
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
}

type FlowRunnerProps<S extends string, C extends ComponentEnvironment, I extends object> = {
  flow: ResolvedFlow<S, C, I>
  variantSource: VariantSource
  screenId: S
  initialState?: I
  componentOverrides?: Partial<C>
  onComplete?: () => void
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
  navigateToScreen,
  goBack,
  exit,
}: FlowRunnerProps<S, C, I>) => {
  const [run, setRun] = useState<FlowRun>(() => ({
    completionView: false,
    id: 0,
    status: 'in-progress',
    store: flow.createStore(initialState),
  }))
  const completedRunId = useRef<number | null>(null)
  const showCompletionView = run.status === 'completed' && run.completionView

  const tracker = useFlowRunAnalytics({
    completed: run.status === 'completed',
    completionViewShowing: showCompletionView,
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
          completionView: false,
          id: previous.id + 1,
          status: 'in-progress',
          store: flow.createStore(initialState),
        }))
        navigateToScreen(flow.initialScreen)
      },
    }),
    [flow, initialState, run.id, onComplete, navigateToScreen, goBack, tracker, screenId],
  )

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
          <Screen key={run.id} />
        )}
      </FlowRuntimeContext.Provider>
    </Provider>
  )
}
