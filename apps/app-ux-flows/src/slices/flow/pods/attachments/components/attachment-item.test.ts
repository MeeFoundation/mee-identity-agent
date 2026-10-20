import { createInstance } from 'i18next'
import { type ComponentProps, createElement, type ReactElement } from 'react'
import { FileEarmarkPlay } from 'react-bootstrap-icons'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { en } from '@/app/locales/en'

import { type PodComponents, podComponents } from '@/shared/ui/pod-components'

import type { ComponentEnvironment } from '../../../runtime/define-flow'
import { FlowRuntimeContext } from '../../../runtime/flow-context'
import { sofiaAttachments } from '../sofia-fixture'
import { AttachmentItem } from './attachment-item'

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

const render = (element: ReactElement, components: ComponentEnvironment = podComponents) =>
  renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        FlowRuntimeContext.Provider,
        {
          value: {
            analytics: { track: () => {} },
            components,
            navigation: { back: () => {}, complete: () => {}, goToScreen: () => {}, restart: () => {} },
            screenId: 'test',
          },
        },
        element,
      ),
    ),
  )

type RowProps = ComponentProps<PodComponents['AttachmentRow']>

const captureRow = (element: ReactElement) => {
  const rows: RowProps[] = []
  const AttachmentRow = (props: RowProps) => {
    rows.push(props)
    return null
  }
  render(element, { ...podComponents, AttachmentRow })
  return rows
}

const [funnyMoment] = sofiaAttachments

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 16))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('AttachmentItem', () => {
  it('passes the file’s kind icon, name and detail line to the row', () => {
    if (!funnyMoment) throw new Error('Sofia’s fixture is empty')
    const onMenu = vi.fn()
    const [row] = captureRow(createElement(AttachmentItem, { attachment: funnyMoment, onMenu }))

    expect(row?.icon).toBe(FileEarmarkPlay)
    expect(row?.name).toBe('funny-moment.mp4')
    expect(row?.detail).toBe('10 MB · Aug 7')
    expect(row?.onOpen).toBeUndefined()
    row?.onMenu()
    expect(onMenu).toHaveBeenCalledOnce()
  })

  it('makes the row a button only when it has an open action', () => {
    if (!funnyMoment) throw new Error('Sofia’s fixture is empty')
    const withoutOpen = render(createElement(AttachmentItem, { attachment: funnyMoment, onMenu: () => {} }))
    const withOpen = render(
      createElement(AttachmentItem, { attachment: funnyMoment, onMenu: () => {}, onOpen: () => {} }),
    )

    expect(withoutOpen.match(/<button/g)).toHaveLength(1)
    expect(withoutOpen).toContain('aria-label="More actions for funny-moment.mp4"')
    expect(withOpen.match(/<button/g)).toHaveLength(2)
    expect(withOpen).toContain('aria-label="funny-moment.mp4, 10 MB · Aug 7"')
  })
})
