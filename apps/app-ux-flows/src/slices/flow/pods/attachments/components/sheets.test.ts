import { createInstance } from 'i18next'
import { type ComponentProps, createElement, Fragment, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { en } from '@/app/locales/en'

import { type PodComponents, podComponents } from '@/shared/ui/pod-components'

import { FlowRuntimeContext } from '../../../runtime/flow-context'
import { sofiaAttachments } from '../sofia-fixture'
import { AddAttachmentSheet } from './add-attachment-sheet'
import { AttachmentActionsSheet } from './attachment-actions-sheet'

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

type SheetProps = ComponentProps<PodComponents['BottomSheet']>
type ActionListProps = ComponentProps<PodComponents['SheetActionList']>

// Renders a sheet with its BottomSheet replaced, as it portals into the device frame. The action list stays real,
// so the markup shows it, and its props are captured so a test can run each action's handler.
const renderSheet = (element: ReactElement) => {
  const sheets: SheetProps[] = []
  const actionLists: ActionListProps[] = []
  const BottomSheet = (props: SheetProps) => {
    sheets.push(props)
    return createElement(Fragment, null, props.children)
  }
  const SheetActionList = (props: ActionListProps) => {
    actionLists.push(props)
    return createElement(podComponents.SheetActionList, props)
  }
  const markup = renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        FlowRuntimeContext.Provider,
        {
          value: {
            analytics: { track: () => {} },
            components: { ...podComponents, BottomSheet, SheetActionList },
            navigation: { back: () => {}, complete: () => {}, goToScreen: () => {}, restart: () => {} },
          },
        },
        element,
      ),
    ),
  )
  const [sheet] = sheets
  const actions = actionLists[0]?.actions ?? []
  if (!sheet) throw new Error('No bottom sheet was rendered')
  return { actions, markup, sheet }
}

const [funnyMoment] = sofiaAttachments

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 16))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('AddAttachmentSheet', () => {
  it('offers a media file or a document, and no folder', () => {
    const { sheet, actions } = renderSheet(
      createElement(AddAttachmentSheet, { onDismiss: () => {}, onDocument: () => {}, onMediaFile: () => {} }),
    )

    expect(sheet.title).toBe('Add to Files')
    expect(sheet.description).toBe('Everyone in this pod can see it, add to it, and change it.')
    expect(actions.map((action) => action.label)).toEqual(['Media file', 'Document'])
  })

  it('runs only the chosen option’s handler, and passes dismissal to the sheet', () => {
    const onMediaFile = vi.fn()
    const onDocument = vi.fn()
    const onDismiss = vi.fn()
    const { sheet, actions } = renderSheet(createElement(AddAttachmentSheet, { onDismiss, onDocument, onMediaFile }))

    actions[1]?.onClick()
    expect(onDocument).toHaveBeenCalledOnce()
    expect(onMediaFile).not.toHaveBeenCalled()
    actions[0]?.onClick()
    expect(onMediaFile).toHaveBeenCalledOnce()
    sheet.onDismiss()
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})

describe('AttachmentActionsSheet', () => {
  const handlers = () => ({ onDelete: vi.fn(), onDismiss: vi.fn(), onRename: vi.fn(), onSave: vi.fn() })

  it('is titled with the file and says the participant added it', () => {
    if (!funnyMoment) throw new Error('Sofia’s fixture is empty')
    const { sheet } = renderSheet(createElement(AttachmentActionsSheet, { attachment: funnyMoment, ...handlers() }))

    expect(sheet.title).toBe('funny-moment.mp4')
    expect(sheet.description).toBe('10 MB · Aug 7 · added by you')
  })

  it('names the member who added the file', () => {
    if (!funnyMoment) throw new Error('Sofia’s fixture is empty')
    const { sheet } = renderSheet(
      createElement(AttachmentActionsSheet, { addedByName: 'Anna', attachment: funnyMoment, ...handlers() }),
    )

    expect(sheet.description).toBe('10 MB · Aug 7 · added by Anna')
  })

  it('offers save, rename and a red delete, and no move to a folder', () => {
    if (!funnyMoment) throw new Error('Sofia’s fixture is empty')
    const { actions, markup } = renderSheet(
      createElement(AttachmentActionsSheet, { attachment: funnyMoment, ...handlers() }),
    )

    expect(actions.map((action) => [action.label, action.tone ?? 'default'])).toEqual([
      ['Save to device', 'default'],
      ['Rename', 'default'],
      ['Delete file', 'danger'],
    ])
    expect(markup).toMatch(/<button[^>]*text-error-700[^>]*>.*Delete file<\/button>/)
    expect(markup).not.toMatch(/<button[^>]*text-error-700[^>]*>.*Rename<\/button>/)
    expect(markup).not.toContain('folder')
  })

  it('runs only the chosen action’s handler, with no confirmation before delete', () => {
    if (!funnyMoment) throw new Error('Sofia’s fixture is empty')
    const sheetHandlers = handlers()
    const { actions, sheet } = renderSheet(
      createElement(AttachmentActionsSheet, { attachment: funnyMoment, ...sheetHandlers }),
    )

    actions[2]?.onClick()
    expect(sheetHandlers.onDelete).toHaveBeenCalledOnce()
    expect(sheetHandlers.onSave).not.toHaveBeenCalled()
    expect(sheetHandlers.onRename).not.toHaveBeenCalled()
    actions[0]?.onClick()
    actions[1]?.onClick()
    expect(sheetHandlers.onSave).toHaveBeenCalledOnce()
    expect(sheetHandlers.onRename).toHaveBeenCalledOnce()
    sheet.onDismiss()
    expect(sheetHandlers.onDismiss).toHaveBeenCalledOnce()
  })
})
