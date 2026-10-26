import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPpl001Flow } from './flow'
import {
  ANALYSIS_DELAY_MS,
  analyseNoteAtom,
  confirmTidyAtom,
  contactInfoAtom,
  contactLinkLabelAtom,
  editTidyFieldAtom,
  linkPulseAtom,
  noteBlocksAtom,
  noteHasContactLinkAtom,
  notesScreenAtom,
  openTidyAtom,
  scheduleAnalysis,
  setBlockTextAtom,
  suggestionAtom,
  tidiedAtom,
  tidyPreviewAtom,
} from './model'
import { en } from '@/app/locales/en'

// Resolves an i18next key such as `flows.scPpl001.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPpl001Flow, null, caseId).createStore()

type Store = ReturnType<typeof caseRun>

const textOf = (store: Store, blockId: string) => {
  const block = store.get(noteBlocksAtom).find((candidate) => candidate.id === blockId)
  return block?.kind === 'text' ? block.text : undefined
}

// Types at the end of a text block and lets the pause pass, as the notes screen does.
const typeAndPause = (store: Store, blockId: string, typed: string) => {
  store.set(setBlockTextAtom, blockId, `${textOf(store, blockId) ?? ''}${typed}`)
  store.set(analyseNoteAtom)
}

describe('SC-PPL-001 Tidy Sofia’s notes', () => {
  it('is a registered showcase with three cases, listed before the sharing showcases', () => {
    expect(scPpl001Flow.kind).toBe('showcase')
    expect(scPpl001Flow.code).toBe('SC-PPL-001')
    expect(scPpl001Flow.initialScreen).toBe('notes')
    expect(findFlow('sc-ppl-001')).toBe(scPpl001Flow)
    expect(listFlows().at(-9)).toBe(scPpl001Flow)
    expect(resolveFlow(scPpl001Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PPL-001-A'],
      ['b', 'SC-PPL-001-B'],
      ['c', 'SC-PPL-001-C'],
    ])
  })

  it('declares its screens and the Figma frames they implement', () => {
    expect(Object.keys(scPpl001Flow.screens)).toEqual(['contact-info', 'notes', 'notes-tidied', 'tidy-confirm'])
    expect(
      Object.fromEntries(Object.entries(scPpl001Flow.designFrames ?? {}).map(([id, frame]) => [id, frame?.name])),
    ).toEqual({ notes: 'Pod / Notes - 3 - 3', 'notes-tidied': 'Pod / Notes - 3 - 4', 'tidy-confirm': 'Modal' })
    expect(scPpl001Flow.designFrames?.['contact-info']).toBeUndefined()
  })

  it('translates every key it declares', () => {
    const resolved = ['a', 'b', 'c'].map((caseId) => resolveFlow(scPpl001Flow, null, caseId))
    const keys = resolved.flatMap((flow) => [
      flow.titleKey,
      flow.goalKey,
      flow.caseNameKey,
      ...Object.values(flow.hints),
      flow.notes.flow.aboutKey,
      ...flow.notes.flow.questionKeys,
      flow.notes.case?.aboutKey,
      ...(flow.notes.case?.questionKeys ?? []),
      ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
    ])
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('explains every screen, and case B adds to notes-tidied', () => {
    const caseA = resolveFlow(scPpl001Flow, null, 'a')
    for (const screenId of Object.keys(scPpl001Flow.screens) as (keyof typeof caseA.notes.screens)[]) {
      expect(caseA.notes.screens[screenId]?.aboutKey).toBeTruthy()
    }

    const caseB = resolveFlow(scPpl001Flow, null, 'b').notes.screens['notes-tidied']
    expect(caseB?.aboutKey).toBe('flows.scPpl001.cases.b.screens.notesTidied.about')
    expect(caseB?.questionKeys).toEqual([
      'flows.scPpl001.screens.notesTidied.questions.linkTarget',
      'flows.scPpl001.screens.notesTidied.questions.moved',
      'flows.scPpl001.cases.b.screens.notesTidied.questions.wentIntoLink',
      'flows.scPpl001.cases.b.screens.notesTidied.questions.lightUp',
    ])
  })

  it('starts each case with its own note and Contact info', () => {
    expect(caseRun('a').get(contactInfoAtom)).toEqual({})
    expect(caseRun('b').get(contactInfoAtom)).toEqual({
      dateOfBirth: '2018-04-08',
      firstName: 'Sofia',
      lastName: 'Walker',
    })
    expect(textOf(caseRun('a'), 'note')).toBe('#family #care\n\nSofia Walker\nBorn 04/08/2018\n')
    expect(caseRun('a').get(noteHasContactLinkAtom)).toBe(false)
    expect(caseRun('b').get(noteHasContactLinkAtom)).toBe(true)
    expect(textOf(caseRun('c'), 'note')).toBe('#family #care\n\nPiano on Tuesdays\nHates broccoli\n')
    for (const caseId of ['a', 'b', 'c']) {
      const store = caseRun(caseId)
      expect(store.get(suggestionAtom)).toEqual([])
      expect(store.get(notesScreenAtom)).toBe('notes')
    }
  })

  it('drops the suggestion as soon as the note is edited', () => {
    const store = caseRun('a')
    typeAndPause(store, 'note', 'email sofiawalker18@gmail.com')
    expect(store.get(suggestionAtom).map((line) => line.status)).toEqual(['new', 'new', 'new'])

    store.set(setBlockTextAtom, 'note', `${textOf(store, 'note')}!`)
    expect(store.get(suggestionAtom)).toEqual([])
  })

  it('previews and tidies case A into a link named from Contact info', () => {
    const store = caseRun('a')
    typeAndPause(store, 'note', 'email sofiawalker18@gmail.com')
    expect(store.get(noteHasContactLinkAtom)).toBe(false)
    expect(store.get(tidyPreviewAtom).newFields.size).toBe(4)

    store.set(confirmTidyAtom)

    expect(store.get(noteBlocksAtom).map((block) => block.kind)).toEqual(['text', 'contact-link', 'text'])
    expect(store.get(contactInfoAtom).email).toBe('sofiawalker18@gmail.com')
    expect(store.get(contactLinkLabelAtom)).toBe('Sofia Walker')
    expect(store.get(tidiedAtom)).toBe(true)
    expect(store.get(notesScreenAtom)).toBe('notes-tidied')
    expect(store.get(linkPulseAtom)).toBe(false)
    expect(store.get(suggestionAtom)).toEqual([])
  })

  it('offers only the new line in case B, adds it to the existing link and lights the link up', () => {
    const store = caseRun('b')
    typeAndPause(store, 'bottom', 'Sofia email: sofia@example.com')
    expect(store.get(suggestionAtom)).toHaveLength(1)
    expect(store.get(tidyPreviewAtom).record).toEqual({
      dateOfBirth: '2018-04-08',
      email: 'sofia@example.com',
      firstName: 'Sofia',
      lastName: 'Walker',
    })
    expect([...store.get(tidyPreviewAtom).newFields]).toEqual(['email'])

    store.set(confirmTidyAtom)

    expect(store.get(noteBlocksAtom).filter((block) => block.kind === 'contact-link')).toHaveLength(1)
    expect(textOf(store, 'bottom')).toBe('Piano on Tuesdays')
    expect(store.get(contactInfoAtom).email).toBe('sofia@example.com')
    expect(store.get(linkPulseAtom)).toBe(true)
  })

  it('saves values changed in the sheet, and forgets them when the sheet is opened again', () => {
    const store = caseRun('b')
    typeAndPause(store, 'bottom', 'Sofia email: sofia@example.com')
    store.set(openTidyAtom, 'notes')
    store.set(editTidyFieldAtom, 'dateOfBirth', '2018-05-09')
    expect(store.get(tidyPreviewAtom).record.dateOfBirth).toBe('2018-05-09')

    store.set(openTidyAtom, 'notes')
    expect(store.get(tidyPreviewAtom).record.dateOfBirth).toBe('2018-04-08')

    store.set(editTidyFieldAtom, 'dateOfBirth', '2018-05-09')
    store.set(confirmTidyAtom)
    expect(store.get(contactInfoAtom)).toEqual({
      dateOfBirth: '2018-05-09',
      email: 'sofia@example.com',
      firstName: 'Sofia',
      lastName: 'Walker',
    })
  })

  it('offers nothing in case C', () => {
    const store = caseRun('c')
    typeAndPause(store, 'note', 'Loves horses')
    expect(store.get(suggestionAtom)).toEqual([])

    store.set(confirmTidyAtom)
    expect(store.get(tidiedAtom)).toBe(false)
  })
})

describe('SC-PPL-001 analysis timing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('never analyses a note nobody edited', () => {
    const store = caseRun('a')
    expect(scheduleAnalysis(store)).toBeNull()
    vi.advanceTimersByTime(ANALYSIS_DELAY_MS * 2)
    expect(store.get(suggestionAtom)).toEqual([])
  })

  it('suggests only after the pause, and an edit restarts the wait', () => {
    const store = caseRun('a')
    store.set(setBlockTextAtom, 'note', `${textOf(store, 'note')}email sofia@example.com`)
    let cancel = scheduleAnalysis(store)

    vi.advanceTimersByTime(ANALYSIS_DELAY_MS - 1)
    expect(store.get(suggestionAtom)).toEqual([])

    store.set(setBlockTextAtom, 'note', `${textOf(store, 'note')}m`)
    cancel?.()
    cancel = scheduleAnalysis(store)
    vi.advanceTimersByTime(ANALYSIS_DELAY_MS - 1)
    expect(store.get(suggestionAtom)).toEqual([])

    vi.advanceTimersByTime(1)
    expect(store.get(suggestionAtom)).toHaveLength(3)
    expect(scheduleAnalysis(store)).toBeNull()
  })
})
