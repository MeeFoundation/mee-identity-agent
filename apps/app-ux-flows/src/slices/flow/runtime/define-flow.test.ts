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
  it('requires a kind and forbids variants on showcases at compile time', () => {
    const experiment = defineFlow({ ...base, code: 'EXP-1', kind: 'experiment', variants: { a: { nameKey: 'a' } } })
    const showcase = defineFlow({ ...base, kind: 'showcase' })
    const researchScenario = defineFlow({ ...base, code: 'SC-PET-001', kind: 'showcase' })

    // @ts-expect-error a flow must declare its kind
    defineFlow({ ...base })
    // @ts-expect-error showcases cannot declare variants
    defineFlow({ ...base, kind: 'showcase', variants: { a: { nameKey: 'a' } } })
    // @ts-expect-error showcases cannot declare a variant selection mode
    defineFlow({ ...base, kind: 'showcase', variantSelection: 'automatic' })
    // @ts-expect-error showcases cannot declare a default variant
    defineFlow({ ...base, defaultVariant: 'a', kind: 'showcase' })

    expect(experiment.kind).toBe('experiment')
    expect(showcase.kind).toBe('showcase')
    expect(researchScenario.code).toBe('SC-PET-001')
  })

  it('lets showcases declare cases, goals and hints, and forbids cases on experiments', () => {
    const showcase = defineFlow({
      ...base,
      cases: {
        a: { code: 'SC-1-A', goalKey: 'a.goal', hints: { home: 'a.home' }, nameKey: 'a' },
        b: { code: 'SC-1-B', nameKey: 'b' },
      },
      goalKey: 'fixture.goal',
      hints: { home: 'fixture.home' },
      kind: 'showcase',
    })
    const experimentWithGoal = defineFlow({ ...base, goalKey: 'fixture.goal', kind: 'experiment' })

    // @ts-expect-error experiments cannot declare cases
    defineFlow({ ...base, cases: { a: { code: 'EXP-1-A', nameKey: 'a' } }, kind: 'experiment' })
    // @ts-expect-error a case needs a display code
    defineFlow({ ...base, cases: { a: { nameKey: 'a' } }, kind: 'showcase' })
    // @ts-expect-error hints name the flow's own screens
    defineFlow({ ...base, hints: { missing: 'fixture.missing' }, kind: 'showcase' })

    expect(Object.keys(showcase.cases ?? {})).toEqual(['a', 'b'])
    expect(experimentWithGoal.goalKey).toBe('fixture.goal')
  })
})
