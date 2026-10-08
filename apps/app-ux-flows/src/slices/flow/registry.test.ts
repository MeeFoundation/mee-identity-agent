import { describe, expect, it } from 'vitest'

import { exampleFlow } from './flows/example-flow'
import { findFlow, listFlows } from './registry'

describe('flow registry', () => {
  it('lists every registered flow', () => {
    expect(listFlows()).toContain(exampleFlow)
  })

  it('resolves a known flow id', () => {
    expect(findFlow(exampleFlow.id)).toBe(exampleFlow)
  })

  it('returns undefined for an unknown flow id instead of throwing', () => {
    expect(findFlow('does-not-exist')).toBeUndefined()
    expect(findFlow('constructor')).toBeUndefined()
  })
})
