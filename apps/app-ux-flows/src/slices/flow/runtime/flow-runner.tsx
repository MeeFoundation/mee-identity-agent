import { Provider } from 'jotai'
import { useMemo, useRef, useState } from 'react'

import { CompletionView } from './completion-view'
import type { ComponentEnvironment, FlowDefinition, FlowStore, ScreenComponent } from './define-flow'
import { type FlowNavigation, FlowRuntimeContext } from './flow-context'

type FlowRun = {
  id: number
  store: FlowStore
  status: 'in-progress' | 'completed'
}

type FlowRunnerProps<S extends string, C extends ComponentEnvironment, I> = {
  flow: FlowDefinition<S, C, I>
  screenId: S
  initialState?: I
  componentOverrides?: Partial<C>
  onComplete?: () => void
  navigateToScreen: (screenId: S) => void
  goBack: () => void
  exit: () => void
}

export const FlowRunner = <S extends string, C extends ComponentEnvironment, I>({
  flow,
  screenId,
  initialState,
  componentOverrides,
  onComplete,
  navigateToScreen,
  goBack,
  exit,
}: FlowRunnerProps<S, C, I>) => {
  const [run, setRun] = useState<FlowRun>(() => ({
    id: 0,
    status: 'in-progress',
    store: flow.createStore(initialState),
  }))
  const completedRunId = useRef<number | null>(null)

  const components = useMemo(
    () => ({ ...flow.components, ...componentOverrides }),
    [flow.components, componentOverrides],
  )

  const navigation = useMemo<FlowNavigation<S>>(
    () => ({
      back: goBack,
      complete: () => {
        if (completedRunId.current === run.id) return
        completedRunId.current = run.id
        setRun((previous) => ({ ...previous, status: 'completed' }))
        onComplete?.()
      },
      goToScreen: navigateToScreen,
      restart: () => {
        setRun((previous) => ({
          id: previous.id + 1,
          status: 'in-progress',
          store: flow.createStore(initialState),
        }))
        navigateToScreen(flow.initialScreen)
      },
    }),
    [flow, initialState, run.id, onComplete, navigateToScreen, goBack],
  )

  const runtime = useMemo(() => ({ components, navigation }), [components, navigation])

  const Screen: ScreenComponent = flow.screens[screenId]

  return (
    <Provider store={run.store}>
      <FlowRuntimeContext.Provider value={runtime}>
        {run.status === 'completed' ? (
          <CompletionView onExit={exit} onRestart={navigation.restart} titleKey={flow.titleKey} />
        ) : (
          <Screen key={run.id} />
        )}
      </FlowRuntimeContext.Provider>
    </Provider>
  )
}
