import type { ComponentAuthoredProps, ComponentKey } from './component-registry'

type FlowData = Readonly<Record<string, string>>

export type FlowComponentRuntimeProps = {
  data: FlowData
  setValue: (key: string, value: string) => void
  completeScreen: () => void
}

export type ScreenBlock = {
  [K in ComponentKey]: { id: string; component: K; props: ComponentAuthoredProps<K> }
}[ComponentKey]

type FlowScreen = {
  id: string
  blocks: readonly ScreenBlock[]
}

export type Flow = {
  id: string
  titleKey: string
  screens: readonly [FlowScreen, ...FlowScreen[]]
  createInitialData: () => FlowData
}

export type FlowInstance = {
  status: 'in-progress' | 'completed'
  currentScreenId: string
  data: FlowData
}
