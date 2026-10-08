import { describe, expect, it } from 'vitest'

import { expPet002Flow } from './flows/exp-pet-002/flow'
import { findFlow, hasScreen, listFlows } from './registry'
import { resolveFlow } from './runtime/resolve-flow'

const variantIdPattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

const listVariantIds = (variants: object | undefined): (string | null)[] =>
  variants === undefined ? [null] : Object.keys(variants)

describe('flow registry', () => {
  it('lists every registered flow', () => {
    expect(listFlows()).toContain(expPet002Flow)
  })

  it('resolves a known flow id', () => {
    expect(findFlow(expPet002Flow.id)).toBe(expPet002Flow)
  })

  it('returns undefined for an unknown flow id instead of throwing', () => {
    expect(findFlow('does-not-exist')).toBeUndefined()
    expect(findFlow('constructor')).toBeUndefined()
  })

  it('checks screen ids against the resolved flow screens', () => {
    const flow = resolveFlow(expPet002Flow, 'a')

    expect(hasScreen(flow, 'medical')).toBe(true)
    expect(hasScreen(flow, 'does-not-exist')).toBe(false)
    expect(hasScreen(flow, 'constructor')).toBe(false)
  })

  describe.each(listFlows().map((flow) => [flow.id, flow] as const))('flow %s', (_, flow) => {
    it('declares a non-empty set of URL-safe variant ids when it has variants', () => {
      if (flow.variants === undefined) return

      const variantIds = Object.keys(flow.variants)
      expect(variantIds.length).toBeGreaterThan(0)
      for (const variantId of variantIds) expect(variantId).toMatch(variantIdPattern)
    })

    it('declares a default variant that exists', () => {
      if (flow.defaultVariant === undefined) return

      expect(Object.keys(flow.variants ?? {})).toContain(flow.defaultVariant)
    })

    it.each(listVariantIds(flow.variants))('resolves variant %s with its initial screen', (variantId) => {
      const resolved = resolveFlow(flow, variantId)

      expect(hasScreen(resolved, resolved.initialScreen)).toBe(true)
    })
  })
})
