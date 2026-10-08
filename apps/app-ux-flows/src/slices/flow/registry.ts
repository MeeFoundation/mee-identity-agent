import { addMedicationFlow } from './flows/add-medication/flow'
import type { ComponentEnvironment, FlowDefinition } from './runtime/define-flow'

type AnyFlow = FlowDefinition<string, ComponentEnvironment, never>

const flows: ReadonlyMap<string, AnyFlow> = new Map([addMedicationFlow].map((flow) => [flow.id, flow]))

export const listFlows = (): readonly AnyFlow[] => [...flows.values()]

export const findFlow = (flowId: string): AnyFlow | undefined => flows.get(flowId)

export const hasScreen = (flow: AnyFlow, screenId: string) => Object.hasOwn(flow.screens, screenId)
