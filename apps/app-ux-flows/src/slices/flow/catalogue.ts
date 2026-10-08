import type { AnyFlow, DesignFrame } from './runtime/define-flow'
import { resolveFlow } from './runtime/resolve-flow'

type CatalogueScreen = {
  screenId: string
  frame: DesignFrame | null
}

type CatalogueVariant = {
  variantId: string | null
  code: string | null
  nameKey: string | null
  descriptionKey: string | null
  screens: readonly CatalogueScreen[]
}

export type FlowCatalogue = {
  flowId: string
  code: string | null
  variants: readonly CatalogueVariant[]
}

const listCatalogueVariant = (flow: AnyFlow, variantId: string | null): CatalogueVariant => {
  const resolved = resolveFlow(flow, variantId)
  const variant = variantId === null ? undefined : flow.variants?.[variantId]

  return {
    code: resolved.variantCode,
    descriptionKey: variant?.descriptionKey ?? null,
    nameKey: variant?.nameKey ?? null,
    screens: Object.keys(flow.screens)
      .filter((screenId) => Object.hasOwn(resolved.screens, screenId))
      .map((screenId) => ({ frame: resolved.designFrames[screenId] ?? null, screenId })),
    variantId,
  }
}

export const listFlowCatalogue = (flow: AnyFlow): FlowCatalogue => {
  const variantIds = flow.variants === undefined ? [null] : Object.keys(flow.variants)

  return {
    code: flow.code ?? null,
    flowId: flow.id,
    variants: variantIds.map((variantId) => listCatalogueVariant(flow, variantId)),
  }
}
