import { describe, expect, it } from 'vitest'

import { familyTitleKeys } from './flow-families'
import { groupFlowsByFamily, groupFlowsByKind } from './group-flows'
import { createRegistry, flowDefinitions } from '@/slices/flow/registry'

describe('familyTitleKeys', () => {
  it('has a title for every family the registry shows as a group', () => {
    const flows = createRegistry(flowDefinitions, true)
      .listFlows()
      .map((flow) => ({ code: flow.code ?? null, kind: flow.kind }))
    const families = groupFlowsByKind(flows).flatMap((section) =>
      groupFlowsByFamily(section.flows).flatMap((item) => (item.type === 'group' ? [item.family] : [])),
    )

    expect(families.length).toBeGreaterThan(0)
    expect(families.filter((family) => !Object.hasOwn(familyTitleKeys, family))).toEqual([])
  })
})
