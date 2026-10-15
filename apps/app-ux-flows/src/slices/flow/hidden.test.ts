import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { withoutHidden } from './hidden'
import { type AnyFlow, defineFlow } from './runtime/define-flow'
import { isCaseOf, resolveFlow } from './runtime/resolve-flow'
import { createAssignmentStore } from './variants/assignment-store'
import { isVariantOf, listVariantChoices, selectVariant } from './variants/select-variant'

const HomeScreen = () => null

const base = {
  components: {},
  createStore: () => createStore(),
  id: 'fixture',
  initialScreen: 'home' as const,
  screens: { home: HomeScreen },
  titleKey: 'fixture.title',
}

const experiment = (
  variants: Record<string, { hidden?: true }>,
  defaultVariant?: string,
  variantSelection?: 'automatic',
): AnyFlow =>
  defineFlow({
    ...base,
    defaultVariant,
    kind: 'experiment',
    variantSelection,
    variants: Object.fromEntries(Object.entries(variants).map(([id, rest]) => [id, { ...rest, nameKey: id }])),
  })

const showcase = (cases: Record<string, { hidden?: true }>): AnyFlow =>
  defineFlow({
    ...base,
    cases: Object.fromEntries(
      Object.entries(cases).map(([id, rest]) => [id, { ...rest, code: `SC-1-${id}`, nameKey: id }]),
    ),
    kind: 'showcase',
  })

describe('withoutHidden', () => {
  it('drops a hidden flow', () => {
    expect(withoutHidden(defineFlow({ ...base, hidden: true, kind: 'showcase' }))).toBeUndefined()
    expect(withoutHidden({ ...experiment({ a: {} }), hidden: true })).toBeUndefined()
  })

  it('returns a flow with nothing hidden as the same object', () => {
    const plain = defineFlow({ ...base, kind: 'showcase' })
    const withVariants = experiment({ a: {}, b: {} })
    const withCases = showcase({ a: {}, b: {} })

    expect(withoutHidden(plain)).toBe(plain)
    expect(withoutHidden(withVariants)).toBe(withVariants)
    expect(withoutHidden(withCases)).toBe(withCases)
  })

  it('leaves out hidden variants and keeps the rest in order', () => {
    const flow = withoutHidden(experiment({ a: {}, b: { hidden: true }, c: {} }, 'a'))

    expect(Object.keys(flow?.variants ?? {})).toEqual(['a', 'c'])
    expect(flow?.defaultVariant).toBe('a')
  })

  it('drops a default variant that is hidden, so the first visible variant is the default', () => {
    const flow = withoutHidden(experiment({ a: {}, b: { hidden: true }, c: {} }, 'b'))

    expect(Object.keys(flow?.variants ?? {})).toEqual(['a', 'c'])
    expect(flow).not.toHaveProperty('defaultVariant')
  })

  it('leaves out hidden cases, including the first one', () => {
    const flow = withoutHidden(showcase({ a: { hidden: true }, b: {}, c: { hidden: true } }))

    expect(Object.keys(flow?.cases ?? {})).toEqual(['b'])
  })

  it('drops a flow whose variants or cases are all hidden', () => {
    expect(withoutHidden(experiment({ a: { hidden: true }, b: { hidden: true } }))).toBeUndefined()
    expect(withoutHidden(showcase({ a: { hidden: true } }))).toBeUndefined()
  })
})

describe('a flow with hidden items left out, as in production builds', () => {
  const memoryAssignments = () => createAssignmentStore(() => undefined)
  const filtered = (flow: AnyFlow) => {
    const result = withoutHidden(flow)
    if (!result) throw new Error('Expected the flow to stay visible')
    return result
  }

  it('never assigns a hidden variant, and replaces a stored assignment to one', () => {
    const flow = filtered(experiment({ control: {}, 'prominent-action': { hidden: true } }, undefined, 'automatic'))
    const assignments = memoryAssignments()
    assignments.write(flow.id, 'prominent-action')

    expect(selectVariant(flow, undefined, assignments, () => 0.99)).toEqual({
      source: 'assigned',
      variantId: 'control',
    })
    expect(assignments.read(flow.id)).toBe('control')
  })

  it('runs the first visible variant when the default is hidden', () => {
    const flow = filtered(experiment({ a: {}, b: { hidden: true }, c: {} }, 'b'))

    expect(selectVariant(flow, undefined, memoryAssignments())).toEqual({ source: 'default', variantId: 'a' })
    expect(listVariantChoices(flow)?.map(({ id }) => id)).toEqual(['a', 'c'])
  })

  it('treats a hidden variant or case in the URL as unknown', () => {
    const variants = filtered(experiment({ a: {}, b: { hidden: true } }))
    const cases = filtered(showcase({ a: {}, d: { hidden: true } }))

    expect(isVariantOf(variants, 'b')).toBe(false)
    expect(selectVariant(variants, 'b', memoryAssignments())).toEqual({ source: 'default', variantId: 'a' })
    expect(isCaseOf(cases, 'd')).toBe(false)
  })

  it('runs the first visible case, and lists only visible cases', () => {
    const resolved = resolveFlow(filtered(showcase({ a: { hidden: true }, b: {}, c: {} })), null)

    expect(resolved.caseId).toBe('b')
    expect(resolved.cases.map(({ id }) => id)).toEqual(['b', 'c'])
  })
})
