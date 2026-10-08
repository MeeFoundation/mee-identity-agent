import { atom, createStore as createJotaiStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { defineFlow } from './define-flow'
import { resolveFlow } from './resolve-flow'

type FixtureState = { items?: string[]; flag?: boolean; label?: string }

const itemsAtom = atom<string[]>([])
const flagAtom = atom(false)
const labelAtom = atom('')

const HomeScreen = () => null
const AlternativeHomeScreen = () => null
const FormScreen = () => null
const ExplanationScreen = () => null
const Card = (_props: { title: string }) => null
const ProminentCard = (_props: { title: string }) => null
const Footer = () => null

const fixtureFlow = defineFlow<
  'home' | 'explanation' | 'form',
  { Card: typeof Card; Footer: typeof Footer },
  FixtureState
>({
  components: { Card, Footer },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(itemsAtom, initialState?.items ?? ['fixture'])
    store.set(flagAtom, initialState?.flag ?? false)
    store.set(labelAtom, initialState?.label ?? 'fixture')
    return store
  },
  id: 'fixture',
  initialScreen: 'home',
  screens: { explanation: null, form: FormScreen, home: HomeScreen },
  titleKey: 'fixture.title',
  variants: {
    'alternative-home': { nameKey: 'alternative', screens: { home: AlternativeHomeScreen } },
    control: { nameKey: 'control' },
    flagged: { initialState: { flag: true, items: ['variant'] }, nameKey: 'flagged' },
    guided: { nameKey: 'guided', screens: { explanation: ExplanationScreen } },
    prominent: { components: { Card: ProminentCard }, nameKey: 'prominent' },
  },
})

const noVariantFlow = defineFlow<'home', { Footer: typeof Footer }, FixtureState>({
  components: { Footer },
  createStore: () => createJotaiStore(),
  id: 'plain',
  initialScreen: 'home',
  screens: { home: HomeScreen },
  titleKey: 'plain.title',
})

describe('resolveFlow', () => {
  it('resolves a flow without variants to its base configuration', () => {
    const resolved = resolveFlow(noVariantFlow, null)

    expect(resolved.flowId).toBe('plain')
    expect(resolved.variantId).toBeNull()
    expect(resolved.screens).toEqual({ home: HomeScreen })
    expect(resolved.components).toEqual({ Footer })
  })

  it('resolves the control variant to the base screens and components without null screens', () => {
    const resolved = resolveFlow(fixtureFlow, 'control')

    expect(resolved.variantId).toBe('control')
    expect(resolved.screens).toEqual({ form: FormScreen, home: HomeScreen })
    expect(resolved.components).toEqual({ Card, Footer })
  })

  it('replaces only the overridden components', () => {
    expect(resolveFlow(fixtureFlow, 'prominent').components).toEqual({ Card: ProminentCard, Footer })
  })

  it('replaces only the overridden screens', () => {
    expect(resolveFlow(fixtureFlow, 'alternative-home').screens).toEqual({
      form: FormScreen,
      home: AlternativeHomeScreen,
    })
  })

  it('includes a variant-only screen only in the variant that implements it', () => {
    expect(resolveFlow(fixtureFlow, 'guided').screens.explanation).toBe(ExplanationScreen)
    expect(Object.hasOwn(resolveFlow(fixtureFlow, 'control').screens, 'explanation')).toBe(false)
  })

  it('layers initial state as fixtures < variant < run start, replacing lists wholesale', () => {
    const controlStore = resolveFlow(fixtureFlow, 'control').createStore()
    expect(controlStore.get(flagAtom)).toBe(false)
    expect(controlStore.get(itemsAtom)).toEqual(['fixture'])

    const flagged = resolveFlow(fixtureFlow, 'flagged')
    const variantStore = flagged.createStore()
    expect(variantStore.get(flagAtom)).toBe(true)
    expect(variantStore.get(itemsAtom)).toEqual(['variant'])
    expect(variantStore.get(labelAtom)).toBe('fixture')

    const runStore = flagged.createStore({ items: ['run'], label: 'run' })
    expect(runStore.get(flagAtom)).toBe(true)
    expect(runStore.get(itemsAtom)).toEqual(['run'])
    expect(runStore.get(labelAtom)).toBe('run')
  })

  it('throws for an unknown variant id', () => {
    expect(() => resolveFlow(fixtureFlow, 'does-not-exist')).toThrow()
    expect(() => resolveFlow(fixtureFlow, 'constructor')).toThrow()
  })

  it('throws when the variant id does not match whether the flow has variants', () => {
    expect(() => resolveFlow(fixtureFlow, null)).toThrow()
    expect(() => resolveFlow(noVariantFlow, 'control')).toThrow()
  })

  it('throws when the initial screen is not implemented after resolution', () => {
    const brokenFlow = defineFlow<'home' | 'form', { Footer: typeof Footer }, FixtureState>({
      ...noVariantFlow,
      id: 'broken',
      screens: { form: FormScreen, home: null },
    })

    expect(() => resolveFlow(brokenFlow, null)).toThrow()
  })

  it('returns the same resolved flow for repeated calls', () => {
    expect(resolveFlow(fixtureFlow, 'prominent')).toBe(resolveFlow(fixtureFlow, 'prominent'))
    expect(resolveFlow(fixtureFlow, 'prominent')).not.toBe(resolveFlow(fixtureFlow, 'control'))
  })
})
