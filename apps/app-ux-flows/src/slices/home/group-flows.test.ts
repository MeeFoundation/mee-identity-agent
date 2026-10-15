import { describe, expect, it } from 'vitest'

import { codeFamily, groupFlowsByFamily, groupFlowsByKind } from './group-flows'

describe('groupFlowsByKind', () => {
  it('puts showcases before experiments and keeps registry order within each', () => {
    const flows = [
      { id: 'showcase-1', kind: 'showcase' as const },
      { id: 'exp-1', kind: 'experiment' as const },
      { id: 'showcase-2', kind: 'showcase' as const },
      { id: 'exp-2', kind: 'experiment' as const },
    ]

    expect(groupFlowsByKind(flows).map(({ kind, flows }) => [kind, flows.map((flow) => flow.id)])).toEqual([
      ['showcase', ['showcase-1', 'showcase-2']],
      ['experiment', ['exp-1', 'exp-2']],
    ])
  })

  it('leaves out a kind without flows', () => {
    expect(groupFlowsByKind([{ id: 'exp-1', kind: 'experiment' as const }]).map((section) => section.kind)).toEqual([
      'experiment',
    ])
    expect(groupFlowsByKind([])).toEqual([])
  })
})

describe('codeFamily', () => {
  it('drops the final segment of the display code', () => {
    expect(codeFamily('SC-PET-005')).toBe('SC-PET')
    expect(codeFamily('EXP-PET-002')).toBe('EXP-PET')
  })

  it('has no family without a code or a hyphen', () => {
    expect(codeFamily(null)).toBeNull()
    expect(codeFamily('DEMO')).toBeNull()
  })
})

describe('groupFlowsByFamily', () => {
  const summarize = (items: ReturnType<typeof groupFlowsByFamily<{ id: string; code: string | null }>>) =>
    items.map((item) => (item.type === 'flow' ? item.flow.id : [item.family, item.flows.map((flow) => flow.id)]))

  it('groups a family at the place of its first flow, keeping their order', () => {
    const flows = [
      { code: 'EXP-PET-002', id: 'exp-pet-002' },
      { code: 'SC-PPL-001', id: 'sc-ppl-001' },
      { code: 'EXP-PET-003', id: 'exp-pet-003' },
      { code: 'EXP-PET-004', id: 'exp-pet-004' },
    ]

    expect(summarize(groupFlowsByFamily(flows))).toEqual([
      ['EXP-PET', ['exp-pet-002', 'exp-pet-003', 'exp-pet-004']],
      ['SC-PPL', ['sc-ppl-001']],
    ])
  })

  it('groups a single-flow family and keeps a flow without a code as a plain row', () => {
    const flows = [
      { code: null, id: 'no-code' },
      { code: 'SC-PET-001', id: 'sc-pet-001' },
      { code: 'SC-PPL-001', id: 'sc-ppl-001' },
      { code: 'SC-PET-005', id: 'chat-add-medication' },
    ]

    expect(summarize(groupFlowsByFamily(flows))).toEqual([
      'no-code',
      ['SC-PET', ['sc-pet-001', 'chat-add-medication']],
      ['SC-PPL', ['sc-ppl-001']],
    ])
  })
})
