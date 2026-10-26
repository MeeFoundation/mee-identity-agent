import { createInstance } from 'i18next'
import { type ComponentProps, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'

import { FlowRuntimeContext } from '../../../runtime/flow-context'
import { gingerPod } from '../model'
import { GingerHomeView } from './ginger-home-view'
import { en } from '@/app/locales/en'
import { type PodComponents, podComponents } from '@/shared/ui/pod-components'

type SectionProps = ComponentProps<PodComponents['PodsSection']>

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

const sectionsOf = (onOpenPod: () => void) => {
  const sections: SectionProps[] = []
  const PodsSection = (props: SectionProps) => {
    sections.push(props)
    return null
  }
  renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        FlowRuntimeContext.Provider,
        {
          value: {
            analytics: { track: () => {} },
            components: { ...podComponents, PodsSection },
            navigation: { back: () => {}, complete: () => {}, goToScreen: () => {}, restart: () => {} },
            screenId: 'home',
          },
        },
        createElement(GingerHomeView, { onAppTabSelect: () => {}, onOpenPod }),
      ),
    ),
  )
  return sections
}

describe('GingerHomeView', () => {
  it('shows Ginger as the one pod of the Recent Pods section, with no See all pods link', () => {
    const [section] = sectionsOf(() => {})

    expect(section?.status).toBe('ready')
    expect(section?.onSeeAll).toBeUndefined()
    expect(section?.pods).toEqual([
      {
        avatarSrc: gingerPod.avatarSrc,
        category: { icon: expect.anything(), label: 'Pets' },
        hasUnread: false,
        id: 'ginger',
        name: 'Ginger',
        subcategory: undefined,
      },
    ])
  })

  it('opens the pod when its card is pressed', () => {
    const onOpenPod = vi.fn()
    const [section] = sectionsOf(onOpenPod)
    const [pod] = section?.pods ?? []
    if (!pod) throw new Error('No pod was shown')
    section?.onPodPress?.(pod)

    expect(onOpenPod).toHaveBeenCalledOnce()
  })
})
