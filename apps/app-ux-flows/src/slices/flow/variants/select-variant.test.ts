import { createStore as createJotaiStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { type AnyFlow, defineFlow } from '../runtime/define-flow'
import { type AssignmentStore, createAssignmentStore } from './assignment-store'
import { isVariantOf, listVariantChoices, pickWeighted, selectVariant } from './select-variant'

const HomeScreen = () => null

const baseFlow = defineFlow<'home', Record<string, never>, object>({
  components: {},
  createStore: () => createJotaiStore(),
  id: 'fixture',
  initialScreen: 'home',
  screens: { home: HomeScreen },
  titleKey: 'fixture.title',
})

const variants = {
  alpha: { nameKey: 'alpha.name' },
  beta: { descriptionKey: 'beta.description', nameKey: 'beta.name' },
  control: { nameKey: 'control.name' },
}

const explicitFlow: AnyFlow = { ...baseFlow, defaultVariant: 'control', variants }
const automaticFlow: AnyFlow = { ...baseFlow, variantSelection: 'automatic', variants }

const createMemoryAssignments = () => {
  const store = createAssignmentStore(() => undefined)
  const writes: [string, string][] = []
  const tracked: AssignmentStore = {
    clear: store.clear,
    read: store.read,
    write: (flowId, variantId) => {
      writes.push([flowId, variantId])
      store.write(flowId, variantId)
    },
  }
  return { store: tracked, writes }
}

const fixedRandom = (value: number) => () => value

describe('isVariantOf', () => {
  it('accepts only declared variant ids', () => {
    expect(isVariantOf(explicitFlow, 'beta')).toBe(true)
    expect(isVariantOf(explicitFlow, 'nope')).toBe(false)
    expect(isVariantOf(explicitFlow, 'constructor')).toBe(false)
    expect(isVariantOf(baseFlow, 'control')).toBe(false)
  })
})

describe('pickWeighted', () => {
  const entries = [
    { id: 'a', weight: 1 },
    { id: 'b', weight: 1 },
  ]

  it('splits equal weights at one half', () => {
    expect(pickWeighted(entries, fixedRandom(0))).toBe('a')
    expect(pickWeighted(entries, fixedRandom(0.4999))).toBe('a')
    expect(pickWeighted(entries, fixedRandom(0.5))).toBe('b')
    expect(pickWeighted(entries, fixedRandom(0.9999))).toBe('b')
  })

  it('respects relative weights', () => {
    const weighted = [
      { id: 'a', weight: 7 },
      { id: 'b', weight: 3 },
    ]
    expect(pickWeighted(weighted, fixedRandom(0.69))).toBe('a')
    expect(pickWeighted(weighted, fixedRandom(0.7))).toBe('b')
  })
})

describe('selectVariant', () => {
  it('returns null for a flow without variants, ignoring any request', () => {
    const { store } = createMemoryAssignments()
    expect(selectVariant(baseFlow, 'control', store)).toEqual({ source: 'none', variantId: null })
  })

  it('uses a valid requested variant without writing an assignment', () => {
    const { store, writes } = createMemoryAssignments()
    store.write(automaticFlow.id, 'alpha')
    writes.length = 0

    expect(selectVariant(automaticFlow, 'beta', store)).toEqual({ source: 'url', variantId: 'beta' })
    expect(writes).toEqual([])
    expect(store.read(automaticFlow.id)).toBe('alpha')
  })

  it('reuses a valid stored assignment for an automatic flow', () => {
    const { store, writes } = createMemoryAssignments()
    store.write(automaticFlow.id, 'beta')
    writes.length = 0

    expect(selectVariant(automaticFlow, undefined, store, fixedRandom(0))).toEqual({
      source: 'stored',
      variantId: 'beta',
    })
    expect(writes).toEqual([])
  })

  it('assigns and stores a variant when an automatic flow has no assignment', () => {
    const { store, writes } = createMemoryAssignments()

    const assigned = selectVariant(automaticFlow, undefined, store, fixedRandom(0.99))

    expect(assigned).toEqual({ source: 'assigned', variantId: 'control' })
    expect(writes).toEqual([[automaticFlow.id, 'control']])
  })

  it('replaces a stale stored assignment', () => {
    const { store, writes } = createMemoryAssignments()
    store.write(automaticFlow.id, 'removed-variant')
    writes.length = 0

    expect(selectVariant(automaticFlow, undefined, store, fixedRandom(0))).toEqual({
      source: 'assigned',
      variantId: 'alpha',
    })
    expect(writes).toEqual([[automaticFlow.id, 'alpha']])
  })

  it('ignores an invalid request and falls back to the remaining rules', () => {
    const { store } = createMemoryAssignments()
    store.write(automaticFlow.id, 'beta')

    expect(selectVariant(automaticFlow, 'nope', store)).toEqual({ source: 'stored', variantId: 'beta' })
  })

  it('uses the default variant for an explicit flow without a request', () => {
    const { store, writes } = createMemoryAssignments()

    expect(selectVariant(explicitFlow, undefined, store)).toEqual({ source: 'default', variantId: 'control' })
    expect(writes).toEqual([])
  })

  it('uses the first variant key when an explicit flow declares no default', () => {
    const { store } = createMemoryAssignments()

    expect(selectVariant({ ...explicitFlow, defaultVariant: undefined }, undefined, store)).toEqual({
      source: 'default',
      variantId: 'alpha',
    })
  })
})

describe('listVariantChoices', () => {
  it('lists choices with the default variant first for explicit flows', () => {
    expect(listVariantChoices(explicitFlow)).toEqual([
      { descriptionKey: undefined, id: 'control', nameKey: 'control.name' },
      { descriptionKey: undefined, id: 'alpha', nameKey: 'alpha.name' },
      { descriptionKey: 'beta.description', id: 'beta', nameKey: 'beta.name' },
    ])
  })

  it('returns null for automatic flows and flows without variants', () => {
    expect(listVariantChoices(automaticFlow)).toBeNull()
    expect(listVariantChoices(baseFlow)).toBeNull()
  })
})
