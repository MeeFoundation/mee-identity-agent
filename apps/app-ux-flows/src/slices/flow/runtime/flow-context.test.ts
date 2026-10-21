import { createStore } from 'jotai'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'

import { defineFlow } from './define-flow'
import { useFlowScreen } from './flow-context'
import { renderScreen } from './render-screen'
import { resolveFlow } from './resolve-flow'

let seen: string | null = null

const ScreenReader = () => {
  seen = useFlowScreen()
  return createElement('span')
}

const flow = defineFlow<'one' | 'two', Record<string, never>, object>({
  components: {},
  createStore: () => createStore(),
  id: 'screen-reader',
  initialScreen: 'one',
  kind: 'showcase',
  screens: { one: ScreenReader, two: ScreenReader },
  titleKey: 'title',
})

describe('useFlowScreen', () => {
  it('tells a screen which screen id the route shows', () => {
    const resolved = resolveFlow(flow, null)
    renderScreen(resolved, 'two')
    expect(seen).toBe('two')
  })
})
