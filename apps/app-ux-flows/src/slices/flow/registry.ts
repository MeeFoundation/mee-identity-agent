import { exampleFlow } from './flows/example-flow'
import type { Flow } from './model'

const flows: ReadonlyMap<string, Flow> = new Map([exampleFlow].map((flow) => [flow.id, flow]))

export const listFlows = (): readonly Flow[] => [...flows.values()]

export const findFlow = (flowId: string): Flow | undefined => flows.get(flowId)

export const hasScreen = (flow: Flow, screenId: string) => flow.screens.some((screen) => screen.id === screenId)
