import type { AnyFlow, DesignFrame } from './runtime/define-flow'
import { resolveFlow } from './runtime/resolve-flow'

type CatalogueScreen = {
  screenId: string
  frame: DesignFrame | null
}

// One variant or case of a flow, or the base flow when it has neither.
export type CatalogueEntry = {
  variantId: string | null
  caseId: string | null
  code: string | null
  nameKey: string | null
  descriptionKey: string | null
  hidden: boolean
  screens: readonly CatalogueScreen[]
}

export type FlowCatalogue = {
  flowId: string
  code: string | null
  entries: readonly CatalogueEntry[]
}

const listCatalogueEntry = (flow: AnyFlow, variantId: string | null, caseId: string | null): CatalogueEntry => {
  const resolved = resolveFlow(flow, variantId, caseId)
  const variant = variantId === null ? undefined : flow.variants?.[variantId]
  const flowCase = caseId === null ? undefined : flow.cases?.[caseId]
  const choice = variant ?? flowCase

  return {
    caseId,
    code: resolved.variantCode ?? resolved.caseCode,
    descriptionKey: choice?.descriptionKey ?? null,
    hidden: choice?.hidden === true,
    nameKey: choice?.nameKey ?? null,
    screens: Object.keys(flow.screens)
      .filter((screenId) => Object.hasOwn(resolved.screens, screenId))
      .map((screenId) => ({ frame: resolved.designFrames[screenId] ?? null, screenId })),
    variantId,
  }
}

export const listFlowCatalogue = (flow: AnyFlow): FlowCatalogue => {
  const entries =
    flow.variants !== undefined
      ? Object.keys(flow.variants).map((variantId) => listCatalogueEntry(flow, variantId, null))
      : flow.cases !== undefined
        ? Object.keys(flow.cases).map((caseId) => listCatalogueEntry(flow, null, caseId))
        : [listCatalogueEntry(flow, null, null)]

  return {
    code: flow.code ?? null,
    entries,
    flowId: flow.id,
  }
}
