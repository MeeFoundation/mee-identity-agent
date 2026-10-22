import { createInstance } from 'i18next'
import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { toDoseStatus } from '../../pods/ginger/dose-status'
import {
  careInstructionsAtom,
  feedingHistoryAtom,
  feedingScheduleAtom,
  gingerCareInstructions,
  groupFeedingByDay,
  mealsAtom,
  selectedMealIdAtom,
  toFeedingHistory,
} from '../../pods/ginger/feeding'
import { PARTICIPANT_ID, podAtom, podMembersAtom } from '../../pods/ginger/model'
import { findFlow } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPet003Flow } from './flow'
import {
  chatAtom,
  goalAtom,
  isOwnerAtom,
  type ScPet003ScreenId,
  scheduleReply,
  sendMessageAtom,
  TELLI_DELAY_MS,
  toastAtom,
} from './model'
import { en } from '@/app/locales/en'

// Resolves an i18next key such as `flows.scPet003.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const testI18n = createInstance()
testI18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

// The `Trans` element the chat renders for a Telli answer, with its Care & Feeding link.
type TelliAnswerProps = { components?: { careFeeding?: ReactElement<{ onClick: () => void }> } }

const caseRun = (caseId: string) => resolveFlow(scPet003Flow, null, caseId).createStore()

// The real sheet only renders its content once open in a browser.
const InlineSheet = ({ children }: { children: ReactNode }) => children

const textOf = (children: ReactNode) =>
  Children.toArray(children)
    .filter((child) => typeof child === 'string')
    .join('')

// Renders a screen with its buttons and suggestion captured, so a test can activate one by its label.
const render = (caseId: string, screenId: ScPet003ScreenId, store = caseRun(caseId)) => {
  const buttons = new Map<string, () => void>()
  const Button = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
    const label = textOf(children)
    if (label) buttons.set(label, onClick)
    return null
  }
  const AiSuggestion = ({ label, onClick }: { label: string; onClick: () => void }) => {
    buttons.set(label, onClick)
    return null
  }
  const effects = renderScreen(resolveFlow(scPet003Flow, null, caseId), screenId, {
    components: { AiSuggestion, BottomSheet: InlineSheet, Button },
    store,
  })
  const click = (label: string) => {
    const onClick = buttons.get(label)
    if (!onClick) throw new Error(`No button "${label}"`)
    onClick()
  }
  return { buttons, click, effects, store }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('SC-PET-003 Care instructions', () => {
  it('is a registered showcase with four cases, all starting on Info', () => {
    expect(scPet003Flow.kind).toBe('showcase')
    expect(scPet003Flow.code).toBe('SC-PET-003')
    expect(scPet003Flow.initialScreen).toBe('info')
    expect(findFlow('sc-pet-003')).toBe(scPet003Flow)
    expect(resolveFlow(scPet003Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PET-003-A'],
      ['b', 'SC-PET-003-B'],
      ['c', 'SC-PET-003-C'],
      ['d', 'SC-PET-003-D'],
    ])
  })

  it('renders every screen in every case', () => {
    for (const caseId of ['a', 'b', 'c', 'd']) {
      const flow = resolveFlow(scPet003Flow, null, caseId)
      for (const screenId of Object.keys(flow.screens) as (keyof typeof flow.screens)[]) {
        expect(() => renderScreen(flow, screenId), `${caseId}/${screenId}`).not.toThrow()
      }
    }
  })

  it('declares its screens and no Figma frames', () => {
    expect(Object.keys(scPet003Flow.screens).sort()).toEqual([
      'care-feeding',
      'chat',
      'edit-instructions',
      'feed-meal',
      'feeding-history',
      'info',
      'schedule-sheet',
      'undo-meal',
    ])
    expect(scPet003Flow.designFrames).toBeUndefined()
  })

  it('translates every key it declares', () => {
    const keys = ['a', 'b', 'c', 'd'].flatMap((caseId) => {
      const flow = resolveFlow(scPet003Flow, null, caseId)
      return [
        flow.titleKey,
        flow.descriptionKey,
        flow.goalKey,
        flow.caseNameKey,
        ...Object.values(flow.hints),
        ...flow.notes.flow.questionKeys,
        flow.notes.case?.aboutKey,
        ...(flow.notes.case?.questionKeys ?? []),
        ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
      ]
    })
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('starts each case from its own pod, instructions and goal', () => {
    const a = caseRun('a')
    expect(a.get(isOwnerAtom)).toBe(true)
    expect(a.get(careInstructionsAtom)).toBe('')
    expect(a.get(podAtom).memberCount).toBe(1)
    expect(a.get(goalAtom)).toBe('write')
    expect(a.get(mealsAtom)).toEqual([])

    for (const caseId of ['b', 'c']) {
      const store = caseRun(caseId)
      expect(store.get(isOwnerAtom)).toBe(false)
      expect(store.get(careInstructionsAtom)).toBe(gingerCareInstructions)
      expect(store.get(podMembersAtom).map(({ name }) => name)).toEqual(['Alice'])
      expect(store.get(podAtom).memberCount).toBe(2)
      expect(store.get(chatAtom).map(({ author }) => author)).toEqual(['alice'])
      expect(store.get(feedingScheduleAtom).map(({ name }) => name)).toEqual(['breakfast', 'dinner'])
      const [breakfast, dinner] = store.get(mealsAtom)
      expect(breakfast).toMatchObject({ givenBy: PARTICIPANT_ID, name: 'breakfast', status: 'given' })
      expect(dinner?.name).toBe('dinner')
      expect(dinner && toDoseStatus(dinner, new Date())).toBe('due')
      expect(store.get(feedingHistoryAtom)).toHaveLength(12)
    }
    expect(caseRun('b').get(goalAtom)).toBe('feed')

    const d = caseRun('d')
    expect(d.get(isOwnerAtom)).toBe(true)
    expect(d.get(careInstructionsAtom)).toBe(gingerCareInstructions)
    expect(d.get(feedingScheduleAtom)).toEqual([])
    expect(d.get(chatAtom)).toEqual([])
  })

  it('lets only the owner change the instructions, while the sitter can still record meals', () => {
    expect(render('d', 'care-feeding').buttons.has('Edit')).toBe(true)
    const sitter = render('b', 'care-feeding')
    expect(sitter.buttons.has('Edit')).toBe(false)
    expect(sitter.buttons.has('Set up schedule')).toBe(false)
    expect(sitter.buttons.has('Mark as fed')).toBe(true)
    const editor = render('b', 'edit-instructions')
    expect(editor.buttons.has('Save')).toBe(false)
    expect(editor.buttons.has('Mark as fed')).toBe(true)
  })

  it('has the sitter feed dinner in case B, completing the run and adding it to the history', () => {
    const screen = render('b', 'care-feeding')
    screen.click('Mark as fed')
    expect(screen.store.get(selectedMealIdAtom)).toBe('dinner')
    expect(screen.effects.navigations).toEqual(['feed-meal'])

    const sheet = render('b', 'feed-meal', screen.store)
    sheet.click('Mark as fed')
    expect(sheet.store.get(mealsAtom)[1]).toMatchObject({ amount: 'all', givenBy: PARTICIPANT_ID, status: 'given' })
    expect(sheet.store.get(toastAtom)).toEqual({ kind: 'fed', meal: 'dinner' })
    expect(sheet.effects.completed).toBe(true)

    const history = toFeedingHistory(sheet.store.get(mealsAtom), sheet.store.get(feedingHistoryAtom), new Date())
    expect(history.slice(0, 2).map(({ id }) => id)).toEqual(['dinner-today', 'breakfast-today'])
  })

  it('keeps the sitter’s meals under Today on a morning run, with 6 full days before it', () => {
    vi.useFakeTimers()
    const now = new Date('2026-10-14T09:00:00')
    vi.setSystemTime(now)
    const store = caseRun('b')
    const days = groupFeedingByDay(toFeedingHistory(store.get(mealsAtom), store.get(feedingHistoryAtom), now))
    expect(days.map(({ day }) => day)).toEqual([
      '2026-10-14',
      '2026-10-13',
      '2026-10-12',
      '2026-10-11',
      '2026-10-10',
      '2026-10-09',
      '2026-10-08',
    ])
    expect(days[0]?.events.map(({ id }) => id)).toEqual(['breakfast-today'])
    expect(days.slice(1).map(({ events }) => events.length)).toEqual([2, 2, 2, 2, 2, 2])
  })

  it('saves the instructions in case A and completes the run', () => {
    const store = caseRun('a')
    store.set(careInstructionsAtom, ' Dry food twice a day ')
    const { click, effects } = render('a', 'edit-instructions', store)
    click('Save')
    expect(store.get(careInstructionsAtom)).toBe('Dry food twice a day')
    expect(store.get(toastAtom)).toEqual({ kind: 'saved' })
    // Back to Care & Feeding, so the editor isn't left in the history behind it.
    expect(effects.navigations).toEqual(['back'])
    expect(effects.completed).toBe(true)
  })

  it('cancels editing without saving', () => {
    const { click, effects, store } = render('d', 'edit-instructions')
    click('Cancel')
    expect(store.get(careInstructionsAtom)).toBe(gingerCareInstructions)
    expect(effects.navigations).toEqual(['back'])
  })

  it('suggests the schedule in case D and sets it up from the sheet', () => {
    const screen = render('d', 'care-feeding')
    screen.click('Set up schedule')
    expect(screen.effects.navigations).toEqual(['schedule-sheet'])

    const sheet = render('d', 'schedule-sheet')
    sheet.click('Set up schedule')
    expect(sheet.store.get(feedingScheduleAtom)).toEqual([
      { name: 'breakfast', time: '07:00' },
      { name: 'dinner', time: '18:00' },
    ])
    expect(sheet.store.get(toastAtom)).toEqual({ kind: 'scheduled' })
    expect(sheet.effects.navigations).toEqual(['back'])
    expect(sheet.effects.completed).toBe(true)
    expect(render('d', 'care-feeding', sheet.store).buttons.has('Set up schedule')).toBe(false)
  })

  it('leaves everything as it was on "Not now"', () => {
    const { click, effects, store } = render('d', 'schedule-sheet')
    click('Not now')
    expect(store.get(feedingScheduleAtom)).toEqual([])
    expect(effects.navigations).toEqual(['back'])
  })

  it('has Telli answer a feeding question from the pod', () => {
    vi.useFakeTimers()
    const store = caseRun('c')
    const onAnswer = vi.fn()
    scheduleReply(store, 'How much does Ginger eat at dinner?', onAnswer)
    vi.advanceTimersByTime(TELLI_DELAY_MS)
    expect(store.get(chatAtom).at(-1)).toMatchObject({ author: 'telli', textKey: 'pods.ginger.telli.answers.feeding' })
    expect(onAnswer).toHaveBeenCalledWith(true)

    scheduleReply(store, 'Does Ginger like toys?', onAnswer)
    vi.advanceTimersByTime(TELLI_DELAY_MS)
    expect(onAnswer).toHaveBeenLastCalledWith(false)
  })

  it("shows the empty state in the owner's empty chat until the first message", () => {
    // How many times the chat renders its empty state for a case's run.
    const emptyStatesIn = (caseId: string, store = caseRun(caseId)) => {
      let emptyStates = 0
      const ChatEmptyState = () => {
        emptyStates += 1
        return null
      }
      renderScreen(resolveFlow(scPet003Flow, null, caseId), 'chat', { components: { ChatEmptyState }, store })
      return emptyStates
    }
    const store = caseRun('a')
    expect(emptyStatesIn('a', store)).toBe(1)

    store.set(sendMessageAtom, 'Hello', new Date())
    expect(emptyStatesIn('a', store)).toBe(0)
    expect(emptyStatesIn('b')).toBe(0)
  })

  it("links Care & Feeding in Telli's feeding answer to its screen", () => {
    const store = caseRun('c')
    store.set(chatAtom, [
      ...store.get(chatAtom),
      { author: 'telli', id: 'answer', sentAt: new Date(), textKey: 'pods.ginger.telli.answers.feeding' },
    ])
    store.set(toastAtom, { kind: 'saved' })
    const messages: ReactElement<TelliAnswerProps>[] = []
    const GroupChatMessage = ({ children }: { children: ReactNode }) => {
      if (isValidElement<TelliAnswerProps>(children)) messages.push(children)
      return null
    }
    const effects = renderScreen(resolveFlow(scPet003Flow, null, 'c'), 'chat', {
      components: { GroupChatMessage },
      store,
    })
    const answer = messages.at(-1)
    if (!answer) throw new Error('No Telli answer')
    // The tag must not be an HTML void element such as <link>, or the link renders empty.
    expect(renderToStaticMarkup(createElement(I18nextProvider, { i18n: testI18n }, answer))).toMatch(
      /It’s in <button[^>]*>Care &amp; Feeding<\/button>\.$/,
    )
    answer.props.components?.careFeeding?.props.onClick()
    expect(effects.navigations).toEqual(['care-feeding'])
    expect(store.get(toastAtom)).toBeNull()
  })
})
