import { devMode } from '@/shared/lib/dev-mode'

import { chatAddMedicationFlow } from './flows/chat-add-medication/flow'
import { expPet002Flow } from './flows/exp-pet-002/flow'
import { expPet003Flow } from './flows/exp-pet-003/flow'
import { expPet004Flow } from './flows/exp-pet-004/flow'
import { expPet005Flow } from './flows/exp-pet-005/flow'
import { scAtt001Flow } from './flows/sc-att-001/flow'
import { scOnb001Flow } from './flows/sc-onb-001/flow'
import { scOnb002Flow } from './flows/sc-onb-002/flow'
import { scOnb003Flow } from './flows/sc-onb-003/flow'
import { scPet001Flow } from './flows/sc-pet-001/flow'
import { scPet002Flow } from './flows/sc-pet-002/flow'
import { scPet003Flow } from './flows/sc-pet-003/flow'
import { scPet004Flow } from './flows/sc-pet-004/flow'
import { scPpl001Flow } from './flows/sc-ppl-001/flow'
import { scPpl002Flow } from './flows/sc-ppl-002/flow'
import { scPpl003Flow } from './flows/sc-ppl-003/flow'
import { withoutHidden } from './hidden'
import type { AnyFlow, ComponentEnvironment } from './runtime/define-flow'
import type { ResolvedFlow } from './runtime/resolve-flow'

// Dev mode keeps every flow; otherwise what is hidden is left out, once, so lookups keep their identity.
export const createRegistry = (definitions: readonly AnyFlow[], showHidden: boolean) => {
  const flows: ReadonlyMap<string, AnyFlow> = new Map(
    (showHidden ? definitions : definitions.flatMap((flow) => withoutHidden(flow) ?? [])).map((flow) => [
      flow.id,
      flow,
    ]),
  )

  return {
    findFlow: (flowId: string): AnyFlow | undefined => flows.get(flowId),
    listFlows: (): readonly AnyFlow[] => [...flows.values()],
  }
}

export const flowDefinitions: readonly AnyFlow[] = [
  expPet002Flow,
  expPet003Flow,
  expPet004Flow,
  expPet005Flow,
  scPet001Flow,
  scPet002Flow,
  scPet003Flow,
  scPet004Flow,
  chatAddMedicationFlow,
  scPpl001Flow,
  scPpl002Flow,
  scPpl003Flow,
  scAtt001Flow,
  scOnb001Flow,
  scOnb002Flow,
  scOnb003Flow,
]

export const { listFlows, findFlow } = createRegistry(flowDefinitions, devMode.on)

export const hasScreen = (flow: ResolvedFlow<string, ComponentEnvironment, object>, screenId: string) =>
  Object.hasOwn(flow.screens, screenId)
