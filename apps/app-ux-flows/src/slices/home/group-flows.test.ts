import { describe, expect, it } from 'vitest'

import { groupFlowsByKind } from './group-flows'

describe('groupFlowsByKind', () => {
  it('puts experiments before showcases and keeps registry order within each', () => {
    const flows = [
      { id: 'showcase-1', kind: 'showcase' as const },
      { id: 'exp-1', kind: 'experiment' as const },
      { id: 'showcase-2', kind: 'showcase' as const },
      { id: 'exp-2', kind: 'experiment' as const },
    ]

    expect(groupFlowsByKind(flows).map(({ kind, flows }) => [kind, flows.map((flow) => flow.id)])).toEqual([
      ['experiment', ['exp-1', 'exp-2']],
      ['showcase', ['showcase-1', 'showcase-2']],
    ])
  })

  it('leaves out a kind without flows', () => {
    expect(groupFlowsByKind([{ id: 'exp-1', kind: 'experiment' as const }]).map((section) => section.kind)).toEqual([
      'experiment',
    ])
    expect(groupFlowsByKind([])).toEqual([])
  })
})
