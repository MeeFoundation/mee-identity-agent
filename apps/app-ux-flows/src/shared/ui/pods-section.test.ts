import { createInstance } from 'i18next'
import { type ComponentProps, createElement, type ReactElement } from 'react'
import { People } from 'react-bootstrap-icons'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'

import type { PodSummary } from './pod-summary'
import { PodsSection } from './pods-section'
import { en } from '@/app/locales/en'

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

const render = (element: ReactElement) => renderToStaticMarkup(createElement(I18nextProvider, { i18n }, element))

const section = (props: ComponentProps<typeof PodsSection>) => render(createElement(PodsSection, props))

const aboutSofia: PodSummary = {
  avatarSrc: null,
  category: { icon: People, label: 'People' },
  hasUnread: false,
  id: 'about-sofia',
  name: 'About Sofia',
  subcategory: { label: 'Immediate family' },
}

const maya: PodSummary = {
  avatarSrc: '/maya.png',
  category: { label: 'Pets' },
  hasUnread: true,
  id: 'maya',
  name: 'Maya',
}

const cardCount = (markup: string) => markup.match(/<button[^>]*aria-label=/g)?.length ?? 0

describe('PodsSection', () => {
  it('shows the header with See all pods above a card per pod', () => {
    const markup = section({ onSeeAll: () => {}, pods: [aboutSofia, maya], status: 'ready' })

    expect(markup).toContain('Recent Pods')
    expect(markup).toContain('See all pods')
    expect(cardCount(markup)).toBe(2)
    expect(markup.indexOf('Recent Pods')).toBeLessThan(markup.indexOf('About Sofia'))
  })

  it('shows the label and no link without a See all pods handler', () => {
    const markup = section({ pods: [maya], status: 'ready' })

    expect(markup).toContain('Recent Pods')
    expect(markup).not.toContain('See all pods')
  })

  it('shows at most the limit of pods', () => {
    const pods = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ ...maya, id, name: `Pod ${id}` }))

    expect(cardCount(section({ limit: 2, pods, status: 'ready' }))).toBe(2)
    expect(cardCount(section({ pods, status: 'ready' }))).toBe(2)
  })

  it('names a card by its pod, its categories and its unread state, and hides the decoration', () => {
    const markup = section({ pods: [aboutSofia, maya], status: 'ready' })

    expect(markup).toContain('aria-label="About Sofia, People, Immediate family"')
    expect(markup).toContain('aria-label="Maya, Pets, Unread"')
  })

  it('shows the avatar image, or a gray circle with the first letter', () => {
    const markup = section({ pods: [aboutSofia, maya], status: 'ready' })

    expect(markup).toContain('src="/maya.png"')
    expect(markup).toMatch(/bg-gray-200[^>]*>A<\/span>/)
  })

  it('shows the breadcrumb of a pod with a subcategory', () => {
    const markup = section({ pods: [aboutSofia], status: 'ready' })

    expect(markup).toMatch(/People<\/span>.*Immediate family/)
    expect(markup).toContain('<svg')
  })

  it('shows the unread dot only on a pod with unread activity', () => {
    expect(section({ pods: [maya], status: 'ready' })).toContain('bg-error-700')
    expect(section({ pods: [aboutSofia], status: 'ready' })).not.toContain('bg-error-700')
  })

  it('shows the header and limit placeholders in one busy region while loading', () => {
    const markup = section({ limit: 3, pods: [maya], status: 'loading' })

    expect(markup).toContain('Recent Pods')
    expect(markup).toMatch(/<output[^>]*aria-busy="true"[^>]*aria-label="Loading pods"/)
    expect(markup.match(/aria-hidden="true"/g)?.length).toBe(3)
    expect(markup).not.toContain('Maya')
    expect(markup).not.toContain('Create your first Pod')
  })

  it('stops the pulse under reduced motion', () => {
    expect(section({ status: 'loading' })).toContain('motion-reduce:animate-none')
  })

  it('shows the header, the message and Retry when loading failed', () => {
    const markup = section({ pods: [maya], status: 'error' })

    expect(markup).toContain('Recent Pods')
    expect(markup).toContain('Couldn&#x27;t load your pods.')
    expect(markup).toContain('Retry')
    expect(cardCount(markup)).toBe(0)
  })

  it('shows the first-run card and no header when loaded without pods', () => {
    const markup = section({ onAddPod: () => {}, status: 'ready' })

    expect(markup).not.toContain('Recent Pods')
    expect(markup).toContain('Create your first Pod')
    expect(markup).toContain('A Pod is a private little room for any info')
    expect(markup).toContain('Add Pod')
    expect(markup).toContain('Maybe later')
  })

  it('leaves out Add Pod when there is no handler for it', () => {
    const markup = section({ status: 'ready' })

    expect(markup).toContain('Create your first Pod')
    expect(markup).toContain('Maybe later')
    expect(markup).not.toContain('Add Pod')
  })

  it('hides the icons of the first-run card from assistive technology', () => {
    expect(section({ status: 'ready' })).toMatch(/<span aria-hidden="true"[^>]*><svg/)
  })
})
