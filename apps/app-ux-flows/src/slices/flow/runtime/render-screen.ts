import { createInstance } from 'i18next'
import { Provider } from 'jotai'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'

import { en } from '@/app/locales/en'

import type { AnalyticsProps } from '@/shared/analytics/analytics-event'

import type { ComponentEnvironment, FlowStore } from './define-flow'
import { type FlowNavigation, FlowRuntimeContext } from './flow-context'
import type { ResolvedFlow } from './resolve-flow'

type TrackedEvent = { event: string; props?: AnalyticsProps }

// What a screen did through the runtime: the events it recorded, the screens it asked for in order, and completion.
export type ScreenEffects = {
  tracked: TrackedEvent[]
  navigations: string[]
  completed: boolean
}

type RenderOptions = {
  // Replace flow components, for example to capture the handlers a screen passes them.
  components?: Partial<ComponentEnvironment>
  // A store prepared by the test; a new run's store by default.
  store?: FlowStore
}

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

// Renders one screen once, without a DOM, so a test can call the handlers that components captured during render.
export const renderScreen = <S extends string, C extends ComponentEnvironment>(
  flow: ResolvedFlow<S, C, object>,
  screenId: S,
  { components = {}, store = flow.createStore() }: RenderOptions = {},
): ScreenEffects => {
  const Screen = flow.screens[screenId]
  if (!Screen) throw new Error(`Flow "${flow.flowId}" has no screen "${screenId}"`)

  const effects: ScreenEffects = { completed: false, navigations: [], tracked: [] }
  const navigation: FlowNavigation<string> = {
    back: () => effects.navigations.push('back'),
    complete: () => {
      effects.completed = true
    },
    goToScreen: (id) => effects.navigations.push(id),
    restart: () => {},
  }

  renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        Provider,
        { store },
        createElement(
          FlowRuntimeContext.Provider,
          {
            value: {
              analytics: { track: (event, props) => effects.tracked.push({ event, props }) },
              components: { ...flow.components, ...components },
              navigation,
            },
          },
          createElement(Screen),
        ),
      ),
    ),
  )

  return effects
}
