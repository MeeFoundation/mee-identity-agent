import { describe, expect, it } from 'vitest'

import { EmptyStateCard } from '@/shared/ui/empty-state-card'

import { gingerMedication, gingerPod, medicationAtom, medicationFormAddedAtom, podAtom } from '../../pods/ginger/model'
import { resolveFlow } from '../../runtime/resolve-flow'
import { ProminentEmptyStateCard } from './components/prominent-empty-state-card'
import { expDemo001Flow } from './flow'

describe('exp-demo-001 flow', () => {
  it('offers explicit variants a and b, defaulting to a', () => {
    expect(expDemo001Flow.variantSelection).toBe('explicit')
    expect(Object.keys(expDemo001Flow.variants ?? {})).toEqual(['a', 'b'])
    expect(expDemo001Flow.defaultVariant).toBe('a')
  })

  it('opens the pod on its Notes tab in both variants', () => {
    for (const variantId of ['a', 'b']) {
      const flow = resolveFlow(expDemo001Flow, variantId)

      expect(flow.initialScreen).toBe('ginger-notes')
      expect(Object.keys(flow.screens).sort()).toEqual(['ginger-info', 'ginger-notes', 'medication-added'])
    }
  })

  it('uses the standard empty state card in variant a', () => {
    expect(resolveFlow(expDemo001Flow, 'a').components.EmptyStateCard).toBe(EmptyStateCard)
  })

  it('swaps only the empty state card in variant b', () => {
    const a = resolveFlow(expDemo001Flow, 'a')
    const b = resolveFlow(expDemo001Flow, 'b')

    expect(b.components.EmptyStateCard).toBe(ProminentEmptyStateCard)
    expect({ ...b.components, EmptyStateCard }).toEqual(a.components)
    expect(b.screens).toEqual(a.screens)
    expect(b.initialScreen).toBe(a.initialScreen)
    expect(b.designFrames).toEqual(a.designFrames)
  })

  it('starts both variants from the same state, with the medication form not added', () => {
    for (const variantId of ['a', 'b']) {
      const store = resolveFlow(expDemo001Flow, variantId).createStore()

      expect(store.get(podAtom)).toBe(gingerPod)
      expect(store.get(medicationAtom)).toBe(gingerMedication)
      expect(store.get(medicationFormAddedAtom)).toBe(false)
    }
  })
})
