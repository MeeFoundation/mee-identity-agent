import { type ComponentProps, createElement, Fragment } from 'react'
import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import type { PodComponents } from '@/shared/ui/pod-components'

import { findFlow, listFlows } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scAtt001Flow } from './flow'
import { filesAtom, goalAtom, selectedIdAtom, toastAtom } from './model'

// Resolves an i18next key such as `flows.scAtt001.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scAtt001Flow, null, caseId).createStore()

const resolved = (caseId: string) => resolveFlow(scAtt001Flow, null, caseId)

type SheetActions = ComponentProps<PodComponents['SheetActionList']>['actions']
type RowProps = ComponentProps<PodComponents['AttachmentRow']>
type EditorProps = ComponentProps<PodComponents['InlineFieldEditor']>
type FieldProps = { value: string; onChange: (value: string) => void; error?: string }

// Renders a screen with the pieces a test drives replaced by recorders; the rest renders for real.
const captured = () => {
  const rows: RowProps[] = []
  const actions: SheetActions[] = []
  const editors: EditorProps[] = []
  const fields: FieldProps[] = []
  const sheetTitles: unknown[] = []
  const components = {
    AttachmentRow: (props: RowProps) => {
      rows.push(props)
      return null
    },
    BottomSheet: (props: ComponentProps<PodComponents['BottomSheet']>) => {
      sheetTitles.push(props.title)
      return createElement(Fragment, null, props.children)
    },
    InlineFieldEditor: (props: EditorProps) => {
      editors.push(props)
      return createElement(Fragment, null, props.children)
    },
    SheetActionList: (props: { actions: SheetActions }) => {
      actions.push(props.actions)
      return null
    },
    TextField: (props: FieldProps) => {
      fields.push(props)
      return null
    },
  }
  return { actions, components, editors, fields, rows, sheetTitles }
}

const labels = (list: SheetActions | undefined) => list?.map((action) => action.label)

describe('SC-ATT-001 Sofia’s files', () => {
  it('is a registered showcase with three cases, listed after SC-PPL-003 and starting on the files', () => {
    expect(scAtt001Flow.kind).toBe('showcase')
    expect(scAtt001Flow.code).toBe('SC-ATT-001')
    expect(scAtt001Flow.initialScreen).toBe('files')
    expect(findFlow('sc-att-001')).toBe(scAtt001Flow)
    const ids = listFlows().map((flow) => flow.id)
    expect(ids.indexOf('sc-att-001')).toBe(ids.indexOf('sc-ppl-003') + 1)
    expect(resolved('a').cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-ATT-001-A'],
      ['b', 'SC-ATT-001-B'],
      ['c', 'SC-ATT-001-C'],
    ])
  })

  it('declares its screens and the Figma frames of the three that have one', () => {
    expect(Object.keys(scAtt001Flow.screens).sort()).toEqual(['actions', 'add', 'files', 'rename'])
    expect(
      Object.fromEntries(Object.entries(scAtt001Flow.designFrames ?? {}).map(([id, frame]) => [id, frame?.url])),
    ).toEqual({
      actions: expect.stringContaining('node-id=486-27239'),
      add: expect.stringContaining('node-id=486-27195'),
      files: expect.stringContaining('node-id=486-24413'),
    })
  })

  it('translates every key it declares', () => {
    const keys = ['a', 'b', 'c'].flatMap((caseId) => {
      const flow = resolved(caseId)
      return [
        flow.titleKey,
        flow.descriptionKey,
        flow.goalKey,
        flow.caseNameKey,
        ...Object.values(flow.hints),
        ...flow.notes.flow.questionKeys,
        flow.notes.case?.aboutKey,
        ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
      ]
    })
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('gives each case its own goal and the four sample files', () => {
    expect(caseRun('a').get(goalAtom)).toBe('add')
    expect(caseRun('b').get(goalAtom)).toBe('rename')
    expect(caseRun('c').get(goalAtom)).toBe('delete')
    expect(
      caseRun('a')
        .get(filesAtom)
        .map((file) => file.name),
    ).toEqual(['funny-moment.mp4', 'photo-Sofia.jpg', 'Activities-tracker.xls', 'About Sophia.databook.mc'])
  })

  describe('files', () => {
    it('lists the files as rows and opens the actions of the one whose menu is used', () => {
      const store = caseRun('a')
      const { components, rows } = captured()
      const effects = renderScreen(resolved('a'), 'files', { components, store })
      expect(rows.map((row) => row.name)).toEqual([
        'funny-moment.mp4',
        'photo-Sofia.jpg',
        'Activities-tracker.xls',
        'About Sophia.databook.mc',
      ])
      rows[1]?.onMenu()
      expect(store.get(selectedIdAtom)).toBe('photo-sofia')
      expect(effects.navigations).toEqual(['actions'])
    })

    it('opens the add sheet from the Add attachment button', () => {
      const { components } = captured()
      const clicks: (() => void)[] = []
      const effects = renderScreen(resolved('a'), 'files', {
        components: {
          ...components,
          FloatingActionButton: (props: ComponentProps<PodComponents['FloatingActionButton']>) => {
            clicks.push(props.onClick)
            return null
          },
        },
      })
      clicks[0]?.()
      expect(effects.navigations).toEqual(['add'])
    })

    it('shows the empty state after the last file is deleted', () => {
      const store = caseRun('c')
      store.set(filesAtom, [])
      const { components, rows } = captured()
      const titles: string[] = []
      renderScreen(resolved('c'), 'files', {
        components: {
          ...components,
          EmptyStateCard: (props: ComponentProps<PodComponents['EmptyStateCard']>) => {
            titles.push(props.title)
            return null
          },
        },
        store,
      })
      expect(rows).toEqual([])
      expect(titles).toEqual(['No files yet'])
    })

    it('shows the saved toast with the file name, and no toast when there is none', () => {
      const store = caseRun('a')
      store.set(toastAtom, 'funny-moment.mp4')
      const shown: ComponentProps<PodComponents['Toast']>[] = []
      const Toast = (props: ComponentProps<PodComponents['Toast']>) => {
        shown.push(props)
        return null
      }
      renderScreen(resolved('a'), 'files', { components: { Toast }, store })
      expect(shown.map(({ title, description }) => [title, description])).toEqual([
        ['Saved to your device', 'funny-moment.mp4'],
      ])
      shown.length = 0
      renderScreen(resolved('a'), 'files', { components: { Toast } })
      expect(shown).toEqual([])
    })
  })

  describe('add', () => {
    const handlers = (caseId: string) => {
      const store = caseRun(caseId)
      const { components, actions } = captured()
      const effects = renderScreen(resolved(caseId), 'add', { components, store })
      const [media, document] = actions[0] ?? []
      return { document, effects, media, store }
    }

    it('offers Media file and Document only', () => {
      const { components, actions } = captured()
      renderScreen(resolved('a'), 'add', { components })
      expect(labels(actions[0])).toEqual(['Media file', 'Document'])
    })

    it('adds a media file, returns to the files and completes case A', () => {
      const { effects, media, store } = handlers('a')
      media?.onClick()
      expect(store.get(filesAtom)[0]?.name).toBe('photo-jul-15.jpg')
      expect(effects.navigations).toEqual(['files'])
      expect(effects.completed).toBe(true)
    })

    it('adds a document without completing case A', () => {
      const { document, effects, store } = handlers('a')
      document?.onClick()
      expect(store.get(filesAtom)[0]?.name).toBe('Invoice-june.pdf')
      expect(effects.completed).toBe(false)
    })

    it('does not complete the other cases', () => {
      const { effects, media } = handlers('c')
      media?.onClick()
      expect(effects.completed).toBe(false)
    })
  })

  describe('actions', () => {
    const open = (caseId: string, fileId: string) => {
      const store = caseRun(caseId)
      store.set(selectedIdAtom, fileId)
      const { components, actions, sheetTitles } = captured()
      const effects = renderScreen(resolved(caseId), 'actions', { components, store })
      const [save, rename, remove] = actions[0] ?? []
      return { effects, remove, rename, save, sheetTitles, store }
    }

    it('offers Save to device, Rename and Delete file, with Delete in the danger tone', () => {
      const { components, actions } = captured()
      const store = caseRun('c')
      store.set(selectedIdAtom, 'funny-moment')
      renderScreen(resolved('c'), 'actions', { components, store })
      expect(labels(actions[0])).toEqual(['Save to device', 'Rename', 'Delete file'])
      expect(actions[0]?.map((action) => action.tone)).toEqual([undefined, undefined, 'danger'])
    })

    it('titles the sheet with the file name', () => {
      expect(open('c', 'photo-sofia').sheetTitles).toEqual(['photo-Sofia.jpg'])
    })

    it('saves to the device with a toast and leaves the list as it was', () => {
      const { effects, save, store } = open('a', 'funny-moment')
      save?.onClick()
      expect(store.get(toastAtom)).toBe('funny-moment.mp4')
      expect(store.get(filesAtom)).toHaveLength(4)
      expect(effects.navigations).toEqual(['files'])
    })

    it('goes to rename for the same file', () => {
      const { effects, rename, store } = open('b', 'about-sophia')
      rename?.onClick()
      expect(effects.navigations).toEqual(['rename'])
      expect(store.get(selectedIdAtom)).toBe('about-sophia')
    })

    it('deletes at once and completes case C for the tracker only', () => {
      const tracker = open('c', 'activities-tracker')
      tracker.remove?.onClick()
      expect(tracker.store.get(filesAtom)).toHaveLength(3)
      expect(tracker.effects.navigations).toEqual(['files'])
      expect(tracker.effects.completed).toBe(true)

      const other = open('c', 'funny-moment')
      other.remove?.onClick()
      expect(other.store.get(filesAtom)).toHaveLength(3)
      expect(other.effects.completed).toBe(false)
    })

    it('does not complete the other cases when deleting the tracker', () => {
      const run = open('a', 'activities-tracker')
      run.remove?.onClick()
      expect(run.effects.completed).toBe(false)
    })
  })

  describe('rename', () => {
    const open = (caseId: string, fileId: string) => {
      const store = caseRun(caseId)
      store.set(selectedIdAtom, fileId)
      const recorded = captured()
      const effects = renderScreen(resolved(caseId), 'rename', { components: recorded.components, store })
      return { ...recorded, effects, store }
    }

    it('shows the sheet with the current name and nothing blocking Save', () => {
      const { editors, fields, sheetTitles } = open('b', 'about-sophia')
      expect(sheetTitles).toEqual(['Rename file'])
      expect(fields[0]?.value).toBe('About Sophia.databook.mc')
      expect(fields[0]?.error).toBeUndefined()
      expect(editors[0]?.saveDisabled).toBe(false)
    })

    it('saves the current name without completing', () => {
      const { editors, effects, store } = open('b', 'about-sophia')
      editors[0]?.onSave()
      expect(effects.navigations).toEqual(['files'])
      expect(effects.completed).toBe(false)
      expect(store.get(filesAtom)[3]?.name).toBe('About Sophia.databook.mc')
    })

    it('cancels back to the files', () => {
      const { editors, effects } = open('b', 'about-sophia')
      editors[0]?.onCancel()
      expect(effects.navigations).toEqual(['files'])
    })

    it('shows nothing for a fresh run with no file chosen', () => {
      const { components, sheetTitles, rows } = captured()
      renderScreen(resolved('b'), 'rename', { components })
      expect(sheetTitles).toEqual([])
      expect(rows).toHaveLength(4)
    })
  })

  describe('actions and rename without a file', () => {
    it.each(['actions', 'rename'] as const)('show the files, not the %s sheet', (screen) => {
      const { components, sheetTitles, rows } = captured()
      renderScreen(resolved('a'), screen, { components })
      expect(sheetTitles).toEqual([])
      expect(rows).toHaveLength(4)
    })
  })
})
