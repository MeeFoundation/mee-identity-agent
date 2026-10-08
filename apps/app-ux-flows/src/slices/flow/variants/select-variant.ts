import type { AnyFlow } from '../runtime/define-flow'
import type { AssignmentStore } from './assignment-store'

type WeightedVariant = {
  id: string
  weight: number
}

export type VariantChoice = {
  id: string
  nameKey: string
  descriptionKey?: string
}

export const isVariantOf = (flow: AnyFlow, variantId: string) =>
  flow.variants !== undefined && Object.hasOwn(flow.variants, variantId)

export const pickWeighted = (entries: readonly WeightedVariant[], random: () => number): string => {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0)
  let remaining = random() * total
  for (const entry of entries) {
    remaining -= entry.weight
    if (remaining < 0) return entry.id
  }

  const last = entries.at(-1)
  if (!last) throw new Error('Cannot pick a variant from an empty list')
  return last.id
}

const getVariantIds = (flow: AnyFlow) => Object.keys(flow.variants ?? {})

const getDefaultVariantId = (flow: AnyFlow, firstVariantId: string) => flow.defaultVariant ?? firstVariantId

export const selectVariant = (
  flow: AnyFlow,
  requestedVariantId: string | undefined,
  assignments: AssignmentStore,
  random: () => number = Math.random,
): string | null => {
  const variantIds = getVariantIds(flow)
  const [firstVariantId] = variantIds
  if (firstVariantId === undefined) return null

  if (requestedVariantId !== undefined && isVariantOf(flow, requestedVariantId)) return requestedVariantId

  if (flow.variantSelection !== 'automatic') return getDefaultVariantId(flow, firstVariantId)

  const stored = assignments.read(flow.id)
  if (stored !== null && isVariantOf(flow, stored)) return stored

  const assigned = pickWeighted(
    variantIds.map((id) => ({ id, weight: 1 })),
    random,
  )
  assignments.write(flow.id, assigned)
  return assigned
}

export const listVariantChoices = (flow: AnyFlow): VariantChoice[] | null => {
  const { variants } = flow
  if (!variants || flow.variantSelection === 'automatic') return null

  const variantIds = getVariantIds(flow)
  const [firstVariantId] = variantIds
  if (firstVariantId === undefined) return null

  const defaultVariantId = getDefaultVariantId(flow, firstVariantId)
  const ordered = [...variantIds].sort((a, b) => Number(b === defaultVariantId) - Number(a === defaultVariantId))

  return ordered.map((id) => {
    const { nameKey, descriptionKey } = variants[id]
    return { descriptionKey, id, nameKey }
  })
}
