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
