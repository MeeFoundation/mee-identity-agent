import type { FlowKind } from '@/slices/flow/runtime/define-flow'

type FlowSection<F> = {
  kind: FlowKind
  flows: readonly F[]
}

const sectionOrder: readonly FlowKind[] = ['showcase', 'experiment']

// Showcases first, then experiments; registry order within a section, and no empty sections.
export const groupFlowsByKind = <F extends { kind: FlowKind }>(flows: readonly F[]): FlowSection<F>[] =>
  sectionOrder
    .map((kind) => ({ flows: flows.filter((flow) => flow.kind === kind), kind }))
    .filter((section) => section.flows.length > 0)

// `SC-PET-003` belongs to `SC-PET`; a code without a hyphen has no family.
export const codeFamily = (code: string | null): string | null => {
  if (code === null) return null
  const end = code.lastIndexOf('-')
  return end > 0 ? code.slice(0, end) : null
}

export type FlowListItem<F> = { type: 'flow'; flow: F } | { type: 'group'; family: string; flows: F[] }

// Every flow with a family joins its group, placed at its first flow; a flow without a family stays a row.
export const groupFlowsByFamily = <F extends { code: string | null }>(flows: readonly F[]): FlowListItem<F>[] => {
  const items: FlowListItem<F>[] = []
  const groups = new Map<string, F[]>()
  for (const flow of flows) {
    const family = codeFamily(flow.code)
    if (family === null) {
      items.push({ flow, type: 'flow' })
      continue
    }
    const group = groups.get(family)
    if (group) {
      group.push(flow)
    } else {
      const created = [flow]
      groups.set(family, created)
      items.push({ family, flows: created, type: 'group' })
    }
  }
  return items
}
