import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { expPet002Flow } from './flows/exp-pet-002/flow'
import { createRegistry, findFlow, hasScreen, listFlows } from './registry'
import { defineFlow } from './runtime/define-flow'
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

  describe('hidden flows, variants and cases', () => {
    const base = {
      components: {},
      createStore: () => createStore(),
      initialScreen: 'home' as const,
      screens: { home: () => null },
      titleKey: 'fixture.title',
    }
    const visible = defineFlow({ ...base, id: 'visible', kind: 'showcase' })
    const hidden = defineFlow({ ...base, hidden: true, id: 'hidden', kind: 'showcase' })
    const withHiddenCase = defineFlow({
      ...base,
      cases: { a: { code: 'SC-1-A', hidden: true, nameKey: 'a' }, b: { code: 'SC-1-B', nameKey: 'b' } },
      id: 'with-hidden-case',
      kind: 'showcase',
    })
    const fixtures = [visible, hidden, withHiddenCase]

    it('keeps every flow when hidden ones are shown, as in development builds', () => {
      const registry = createRegistry(fixtures, true)

      expect(registry.listFlows()).toEqual(fixtures)
      expect(registry.findFlow('with-hidden-case')).toBe(withHiddenCase)
    })

    it('leaves out hidden flows and cases otherwise, as in production builds', () => {
      const registry = createRegistry(fixtures, false)

      expect(registry.listFlows().map(({ id }) => id)).toEqual(['visible', 'with-hidden-case'])
      expect(registry.findFlow('hidden')).toBeUndefined()
      expect(Object.keys(registry.findFlow('with-hidden-case')?.cases ?? {})).toEqual(['b'])
    })

    it('returns the same flow on every lookup', () => {
      const registry = createRegistry(fixtures, false)

      expect(registry.findFlow('with-hidden-case')).toBe(registry.findFlow('with-hidden-case'))
      expect(registry.findFlow('visible')).toBe(visible)
    })
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

    it('declares URL-safe case ids with unique display codes when it has cases', () => {
      if (flow.cases === undefined) return

      const cases = Object.entries(flow.cases)
      expect(cases.length).toBeGreaterThan(0)
      for (const [caseId] of cases) expect(caseId).toMatch(variantIdPattern)
      const codes = cases.map(([, { code }]) => code)
      expect(new Set(codes).size).toBe(codes.length)
    })

    it.each(Object.keys(flow.cases ?? {}))('resolves case %s with its initial screen', (caseId) => {
      const resolved = resolveFlow(flow, null, caseId)

      expect(resolved.caseId).toBe(caseId)
      expect(hasScreen(resolved, resolved.initialScreen)).toBe(true)
    })

    it.each(listVariantIds(flow.variants))('resolves variant %s with its initial screen', (variantId) => {
      const resolved = resolveFlow(flow, variantId)

      expect(hasScreen(resolved, resolved.initialScreen)).toBe(true)
    })
  })
})
