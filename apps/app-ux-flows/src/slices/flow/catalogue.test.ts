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
      flowId: 'exp-9',
      variants: [
        {
          code: 'EXP-9-A',
          descriptionKey: null,
          nameKey: 'exp9.a',
          screens: [{ frame: homeFrame, screenId: 'home' }],
          variantId: 'a',
        },
        {
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
    })
  })

  it('lists the base flow as a single entry when the flow has no variants', () => {
    expect(listFlowCatalogue(plainFlow)).toEqual({
      code: null,
      flowId: 'plain',
      variants: [
        {
          code: null,
          descriptionKey: null,
          nameKey: null,
          screens: [{ frame: null, screenId: 'home' }],
          variantId: null,
        },
      ],
    })
  })
})
