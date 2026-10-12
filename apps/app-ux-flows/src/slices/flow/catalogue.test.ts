import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { listFlowCatalogue } from './catalogue'
import { defineFlow } from './runtime/define-flow'

const HomeScreen = () => null
const ExtraScreen = () => null

const homeFrame = { name: 'EXP-9-A - Home', url: 'https://figma.example/home-a' }
const variantHomeFrame = { name: 'EXP-9-B - Home', url: 'https://figma.example/home-b' }
const extraFrame = { name: 'EXP-9-B - Extra', url: 'https://figma.example/extra-b' }

const experimentFlow = defineFlow<'home' | 'extra', Record<string, never>, object>({
  code: 'EXP-9',
  components: {},
  createStore: () => createStore(),
  designFrames: { home: homeFrame },
  id: 'exp-9',
  initialScreen: 'home',
  kind: 'experiment',
  screens: { extra: null, home: HomeScreen },
  titleKey: 'exp9.title',
  variants: {
    a: { code: 'EXP-9-A', nameKey: 'exp9.a' },
    b: {
      code: 'EXP-9-B',
      descriptionKey: 'exp9.b.description',
      designFrames: { extra: extraFrame, home: variantHomeFrame },
      nameKey: 'exp9.b',
      screens: { extra: ExtraScreen },
    },
  },
})

const casedFlow = defineFlow<'home', Record<string, never>, object>({
  cases: {
    a: { code: 'SC-9-A', nameKey: 'sc9.a' },
    b: { code: 'SC-9-B', descriptionKey: 'sc9.b.description', nameKey: 'sc9.b' },
  },
  code: 'SC-9',
  components: {},
  createStore: () => createStore(),
  designFrames: { home: homeFrame },
  id: 'sc-9',
  initialScreen: 'home',
  kind: 'showcase',
  screens: { home: HomeScreen },
  titleKey: 'sc9.title',
})

const plainFlow = defineFlow<'home', Record<string, never>, object>({
  components: {},
  createStore: () => createStore(),
  id: 'plain',
  initialScreen: 'home',
  kind: 'experiment',
  screens: { home: HomeScreen },
  titleKey: 'plain.title',
})

describe('listFlowCatalogue', () => {
  it('lists every variant with its codes, keys, available screens and frames', () => {
    expect(listFlowCatalogue(experimentFlow)).toEqual({
      code: 'EXP-9',
      entries: [
        {
          caseId: null,
          code: 'EXP-9-A',
          descriptionKey: null,
          nameKey: 'exp9.a',
          screens: [{ frame: homeFrame, screenId: 'home' }],
          variantId: 'a',
        },
        {
          caseId: null,
          code: 'EXP-9-B',
          descriptionKey: 'exp9.b.description',
          nameKey: 'exp9.b',
          screens: [
            { frame: extraFrame, screenId: 'extra' },
            { frame: variantHomeFrame, screenId: 'home' },
          ],
          variantId: 'b',
        },
      ],
      flowId: 'exp-9',
    })
  })

  it('lists the base flow as a single entry when the flow has no variants', () => {
    expect(listFlowCatalogue(plainFlow)).toEqual({
      code: null,
      entries: [
        {
          caseId: null,
          code: null,
          descriptionKey: null,
          nameKey: null,
          screens: [{ frame: null, screenId: 'home' }],
          variantId: null,
        },
      ],
      flowId: 'plain',
    })
  })

  it('lists every case of a showcase with its code, keys and screens', () => {
    expect(listFlowCatalogue(casedFlow)).toEqual({
      code: 'SC-9',
      entries: [
        {
          caseId: 'a',
          code: 'SC-9-A',
          descriptionKey: null,
          nameKey: 'sc9.a',
          screens: [{ frame: homeFrame, screenId: 'home' }],
          variantId: null,
        },
        {
          caseId: 'b',
          code: 'SC-9-B',
          descriptionKey: 'sc9.b.description',
          nameKey: 'sc9.b',
          screens: [{ frame: homeFrame, screenId: 'home' }],
          variantId: null,
        },
      ],
      flowId: 'sc-9',
    })
  })
})
