import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { defineFlow } from './define-flow'

const HomeScreen = () => null

const base = {
  components: {},
  createStore: () => createStore(),
  id: 'fixture',
  initialScreen: 'home' as const,
  screens: { home: HomeScreen },
  titleKey: 'fixture.title',
}

describe('defineFlow typing', () => {
  it('requires a kind and forbids variants and codes on showcases at compile time', () => {
    const experiment = defineFlow({ ...base, code: 'EXP-1', kind: 'experiment', variants: { a: { nameKey: 'a' } } })
    const showcase = defineFlow({ ...base, kind: 'showcase' })

    // @ts-expect-error a flow must declare its kind
    defineFlow({ ...base })
    // @ts-expect-error showcases cannot declare variants
    defineFlow({ ...base, kind: 'showcase', variants: { a: { nameKey: 'a' } } })
    // @ts-expect-error showcases cannot declare a display code
    defineFlow({ ...base, code: 'SHW-1', kind: 'showcase' })
    // @ts-expect-error showcases cannot declare a variant selection mode
    defineFlow({ ...base, kind: 'showcase', variantSelection: 'automatic' })
    // @ts-expect-error showcases cannot declare a default variant
    defineFlow({ ...base, defaultVariant: 'a', kind: 'showcase' })

    expect(experiment.kind).toBe('experiment')
    expect(showcase.kind).toBe('showcase')
  })
})
