import { chatAddMedicationFlow } from './flows/chat-add-medication/flow'
import { expDemo001Flow } from './flows/exp-demo-001/flow'
import { expPet002Flow } from './flows/exp-pet-002/flow'
import type { AnyFlow, ComponentEnvironment } from './runtime/define-flow'
import type { ResolvedFlow } from './runtime/resolve-flow'

const flows: ReadonlyMap<string, AnyFlow> = new Map(
  [expPet002Flow, chatAddMedicationFlow, expDemo001Flow].map((flow) => [flow.id, flow]),
)

export const listFlows = (): readonly AnyFlow[] => [...flows.values()]

export const findFlow = (flowId: string): AnyFlow | undefined => flows.get(flowId)

export const hasScreen = (flow: ResolvedFlow<string, ComponentEnvironment, object>, screenId: string) =>
  Object.hasOwn(flow.screens, screenId)
