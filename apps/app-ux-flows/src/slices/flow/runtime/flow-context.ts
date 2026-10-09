import { createContext, useContext } from 'react'

import type { FlowAnalytics, FlowEventMap, FlowEventSink } from '../analytics/flow-events'
import type { ComponentEnvironment } from './define-flow'

// Method syntax lets a runner typed for its flow's screen ids provide the context typed for `string`.
export type FlowNavigation<S extends string> = {
  goToScreen(screenId: S): void
  back(): void
  restart(): void
  complete(options?: { showCompletionView?: boolean }): void
}

type FlowRuntime = {
  components: ComponentEnvironment
  navigation: FlowNavigation<string>
  analytics: FlowEventSink
}

export const FlowRuntimeContext = createContext<FlowRuntime | null>(null)

const useFlowRuntime = (hookName: string) => {
  const runtime = useContext(FlowRuntimeContext)
  if (!runtime) throw new Error(`${hookName} must be used inside a FlowRunner`)
  return runtime
}

export const useFlowNavigation = <S extends string = never>(): FlowNavigation<S> =>
  useFlowRuntime('useFlowNavigation').navigation

export const useFlowComponents = <C extends ComponentEnvironment>(): C =>
  useFlowRuntime('useFlowComponents').components as C

export const useFlowAnalytics = <E extends FlowEventMap = never>(): FlowAnalytics<E> =>
  useFlowRuntime('useFlowAnalytics').analytics as FlowAnalytics<E>
