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
  kind: 'experiment',
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
  kind: 'experiment',
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
    expect(resolved.kind).toBe('experiment')
  })

  it('resolves a showcase without a variant and exposes its kind', () => {
    const showcase = defineFlow<'home', { Footer: typeof Footer }, FixtureState>({
      components: { Footer },
      createStore: () => createJotaiStore(),
      id: 'showcase',
      initialScreen: 'home',
      kind: 'showcase',
      screens: { home: HomeScreen },
      titleKey: 'showcase.title',
    })

    const resolved = resolveFlow(showcase, null)

    expect(resolved.kind).toBe('showcase')
    expect(resolved.variantId).toBeNull()
    expect(resolved.code).toBeNull()
    expect(resolved.screens).toEqual({ home: HomeScreen })
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

  it('resolves a flow without metadata to empty metadata', () => {
    const resolved = resolveFlow(noVariantFlow, null)

    expect(resolved.code).toBeNull()
    expect(resolved.variantCode).toBeNull()
    expect(resolved.descriptionKey).toBeNull()
    expect(resolved.designFrames).toEqual({})
  })

  it('exposes codes and lets a variant override individual design frames', () => {
    const homeFrame = { name: 'EXP-1-A - Home', url: 'https://figma.example/home-a' }
    const formFrame = { name: 'EXP-1-A - Form', url: 'https://figma.example/form-a' }
    const variantHomeFrame = { name: 'EXP-1-B - Home', url: 'https://figma.example/home-b' }
    const experimentFlow = defineFlow<'home' | 'form', { Footer: typeof Footer }, FixtureState>({
      ...noVariantFlow,
      code: 'EXP-1',
      descriptionKey: 'experiment.description',
      designFrames: { form: formFrame, home: homeFrame },
      id: 'experiment',
      screens: { form: FormScreen, home: HomeScreen },
      variants: {
        a: { code: 'EXP-1-A', nameKey: 'a' },
        b: { code: 'EXP-1-B', designFrames: { home: variantHomeFrame }, nameKey: 'b' },
      },
    })

    const a = resolveFlow(experimentFlow, 'a')
    expect(a.code).toBe('EXP-1')
    expect(a.variantCode).toBe('EXP-1-A')
    expect(a.descriptionKey).toBe('experiment.description')
    expect(a.designFrames).toEqual({ form: formFrame, home: homeFrame })

    const b = resolveFlow(experimentFlow, 'b')
    expect(b.variantCode).toBe('EXP-1-B')
    expect(b.designFrames).toEqual({ form: formFrame, home: variantHomeFrame })
  })

  it('returns the same resolved flow for repeated calls', () => {
    expect(resolveFlow(fixtureFlow, 'prominent')).toBe(resolveFlow(fixtureFlow, 'prominent'))
    expect(resolveFlow(fixtureFlow, 'prominent')).not.toBe(resolveFlow(fixtureFlow, 'control'))
  })

  describe('cases', () => {
    const casedFlow = defineFlow<'home' | 'form', { Footer: typeof Footer }, FixtureState>({
      cases: {
        first: { code: 'SC-1-A', nameKey: 'first.name' },
        second: {
          code: 'SC-1-B',
          goalKey: 'second.goal',
          hints: { form: 'second.form' },
          initialState: { items: ['case'] },
          nameKey: 'second.name',
        },
      },
      components: { Footer },
      createStore(initialState) {
        const store = createJotaiStore()
        store.set(itemsAtom, initialState?.items ?? ['fixture'])
        store.set(labelAtom, initialState?.label ?? 'fixture')
        return store
      },
      goalKey: 'base.goal',
      hints: { form: 'base.form', home: 'base.home' },
      id: 'cased',
      initialScreen: 'home',
      kind: 'showcase',
      screens: { form: FormScreen, home: HomeScreen },
      titleKey: 'cased.title',
    })

    it('runs the first declared case when none is requested', () => {
      const resolved = resolveFlow(casedFlow, null)

      expect(resolved.caseId).toBe('first')
      expect(resolved.caseCode).toBe('SC-1-A')
      expect(resolved.caseNameKey).toBe('first.name')
      expect(resolved).toBe(resolveFlow(casedFlow, null, 'first'))
    })

    it('lists every case in declaration order', () => {
      expect(resolveFlow(casedFlow, null, 'second').cases).toEqual([
        { code: 'SC-1-A', id: 'first', nameKey: 'first.name' },
        { code: 'SC-1-B', id: 'second', nameKey: 'second.name' },
      ])
      expect(resolveFlow(noVariantFlow, null).cases).toEqual([])
    })

    it('keeps the base goal and hints unless the case replaces them, hint by hint', () => {
      const first = resolveFlow(casedFlow, null, 'first')
      expect(first.goalKey).toBe('base.goal')
      expect(first.hints).toEqual({ form: 'base.form', home: 'base.home' })

      const second = resolveFlow(casedFlow, null, 'second')
      expect(second.goalKey).toBe('second.goal')
      expect(second.hints).toEqual({ form: 'second.form', home: 'base.home' })
    })

    it('resolves a flow without a goal, hints or cases to none', () => {
      const resolved = resolveFlow(noVariantFlow, null)

      expect(resolved.caseId).toBeNull()
      expect(resolved.caseCode).toBeNull()
      expect(resolved.goalKey).toBeNull()
      expect(resolved.hints).toEqual({})
    })

    it('layers initial state as fixtures < case < run start', () => {
      expect(resolveFlow(casedFlow, null, 'first').createStore().get(itemsAtom)).toEqual(['fixture'])

      const second = resolveFlow(casedFlow, null, 'second')
      expect(second.createStore().get(itemsAtom)).toEqual(['case'])
      expect(second.createStore().get(labelAtom)).toBe('fixture')

      const runStore = second.createStore({ label: 'run' })
      expect(runStore.get(itemsAtom)).toEqual(['case'])
      expect(runStore.get(labelAtom)).toBe('run')
    })

    it('resolves explanations and questions, with case screen notes replacing explanations and adding questions', () => {
      const notedFlow = defineFlow<'home' | 'form', { Footer: typeof Footer }, FixtureState>({
        cases: {
          first: { code: 'SC-2-A', nameKey: 'first.name' },
          second: {
            code: 'SC-2-B',
            descriptionKey: 'second.description',
            nameKey: 'second.name',
            questionKeys: ['second.q1'],
            screenNotes: {
              form: { questionKeys: ['second.form.q1'] },
              home: { aboutKey: 'second.home.about', questionKeys: ['second.home.q1'] },
            },
          },
        },
        components: { Footer },
        createStore: () => createJotaiStore(),
        descriptionKey: 'noted.description',
        id: 'noted',
        initialScreen: 'home',
        kind: 'showcase',
        questionKeys: ['noted.q1', 'noted.q2'],
        screenNotes: { home: { aboutKey: 'noted.home.about', questionKeys: ['noted.home.q1', 'noted.home.q2'] } },
        screens: { form: FormScreen, home: HomeScreen },
        titleKey: 'noted.title',
      })

      const first = resolveFlow(notedFlow, null, 'first')
      expect(first.notes.flow).toEqual({ aboutKey: 'noted.description', questionKeys: ['noted.q1', 'noted.q2'] })
      expect(first.notes.case).toEqual({ aboutKey: null, questionKeys: [] })
      expect(first.notes.screens).toEqual({
        home: { aboutKey: 'noted.home.about', questionKeys: ['noted.home.q1', 'noted.home.q2'] },
      })

      const second = resolveFlow(notedFlow, null, 'second')
      expect(second.notes.case).toEqual({ aboutKey: 'second.description', questionKeys: ['second.q1'] })
      expect(second.notes.screens).toEqual({
        form: { aboutKey: null, questionKeys: ['second.form.q1'] },
        home: { aboutKey: 'second.home.about', questionKeys: ['noted.home.q1', 'noted.home.q2', 'second.home.q1'] },
      })
    })

    it('resolves a flow without notes to empty notes', () => {
      const resolved = resolveFlow(noVariantFlow, null)

      expect(resolved.notes).toEqual({ case: null, flow: { aboutKey: null, questionKeys: [] }, screens: {} })
    })

    it('caches each case separately and throws for an unknown case', () => {
      expect(resolveFlow(casedFlow, null, 'second')).toBe(resolveFlow(casedFlow, null, 'second'))
      expect(resolveFlow(casedFlow, null, 'second')).not.toBe(resolveFlow(casedFlow, null, 'first'))
      expect(() => resolveFlow(casedFlow, null, 'missing')).toThrow()
      expect(() => resolveFlow(casedFlow, null, 'constructor')).toThrow()
      expect(() => resolveFlow(noVariantFlow, null, 'first')).toThrow()
    })
  })
})
