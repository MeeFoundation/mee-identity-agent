import { Children, createElement, type ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { en } from '@/app/locales/en'

import { toDoseStatus } from '../../pods/ginger/dose-status'
import {
  feedingHistoryAtom,
  groupFeedingByDay,
  type Meal,
  type MealAmount,
  mealsAtom,
  selectedMealIdAtom,
  toFeedingHistory,
} from '../../pods/ginger/feeding'
import { PARTICIPANT_ID, podAtom } from '../../pods/ginger/model'
import { findFlow } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPet004Flow } from './flow'
import { mealTimes, SAM_ID, type ScPet004ScreenId, toastAtom } from './model'

// The amount is the feed sheet's own state, which a render without a DOM can't change; the screen's handler can be.
const feedSheet = vi.hoisted(() => ({ onConfirm: (_amount: MealAmount) => {} }))
vi.mock('../../pods/ginger/components/meal-sheets', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../pods/ginger/components/meal-sheets')>()
  return {
    ...original,
    FeedMealSheet: (props: Parameters<typeof original.FeedMealSheet>[0]) => {
      feedSheet.onConfirm = props.onConfirm
      return createElement(original.FeedMealSheet, props)
    },
  }
})

// Resolves an i18next key such as `flows.scPet004.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPet004Flow, null, caseId).createStore()

type Store = ReturnType<typeof caseRun>

const mealOf = (store: Store, mealId: string): Meal | undefined =>
  store.get(mealsAtom).find((meal) => meal.id === mealId)

// The real sheet only renders its content once open in a browser.
const InlineSheet = ({ children }: { children: ReactNode }) => children

// Renders a sheet over a meal with its buttons captured, so a test can activate one by its label.
const renderSheet = (caseId: string, screenId: ScPet004ScreenId, mealId: string, store = caseRun(caseId)) => {
  store.set(selectedMealIdAtom, mealId)
  const buttons = new Map<string, () => void>()
  const Button = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
    const label = Children.toArray(children)
      .filter((child) => typeof child === 'string')
      .join('')
    if (label) buttons.set(label, onClick)
    return null
  }
  const effects = renderScreen(resolveFlow(scPet004Flow, null, caseId), screenId, {
    components: { BottomSheet: InlineSheet, Button },
    store,
  })
  const click = (label: string) => {
    const onClick = buttons.get(label)
    if (!onClick) throw new Error(`No button "${label}"`)
    onClick()
  }
  return { buttons, click, effects, store }
}

// Renders Info with its category rows captured, so a test can open one by its label.
const renderInfo = (caseId: string, store = caseRun(caseId)) => {
  const rows = new Map<string, () => void>()
  const CategoryRow = ({ label, onClick }: { label: string; onClick: () => void }) => {
    rows.set(label, onClick)
    return null
  }
  const effects = renderScreen(resolveFlow(scPet004Flow, null, caseId), 'info', { components: { CategoryRow }, store })
  return { effects, open: (label: string) => rows.get(label)?.(), store }
}

const todaysGroup = (store: Store, now: Date) =>
  groupFeedingByDay(toFeedingHistory(store.get(mealsAtom), store.get(feedingHistoryAtom), now))

afterEach(() => {
  vi.useRealTimers()
})

describe('SC-PET-004 Meals', () => {
  it('is a registered showcase with four cases, all starting on Info', () => {
    expect(scPet004Flow.kind).toBe('showcase')
    expect(scPet004Flow.code).toBe('SC-PET-004')
    expect(scPet004Flow.initialScreen).toBe('info')
    expect(findFlow('sc-pet-004')).toBe(scPet004Flow)
    expect(resolveFlow(scPet004Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PET-004-A'],
      ['b', 'SC-PET-004-B'],
      ['c', 'SC-PET-004-C'],
      ['d', 'SC-PET-004-D'],
    ])
  })

  it('renders every screen in every case', () => {
    for (const caseId of ['a', 'b', 'c', 'd']) {
      const flow = resolveFlow(scPet004Flow, null, caseId)
      for (const screenId of Object.keys(flow.screens) as (keyof typeof flow.screens)[]) {
        expect(() => renderScreen(flow, screenId), `${caseId}/${screenId}`).not.toThrow()
      }
    }
  })

  it('declares its screens and no Figma frames', () => {
    expect(Object.keys(scPet004Flow.screens).sort()).toEqual([
      'care-feeding',
      'feed-again',
      'feed-meal',
      'feeding-history',
      'info',
      'undo-meal',
    ])
    expect(scPet004Flow.designFrames).toBeUndefined()
  })

  it('translates every key it declares', () => {
    const keys = ['a', 'b', 'c', 'd'].flatMap((caseId) => {
      const flow = resolveFlow(scPet004Flow, null, caseId)
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

  it('sets meal times relative to the run, with dinner 11 hours after breakfast', () => {
    const now = new Date('2026-10-14T08:00:00')
    expect(mealTimes('breakfast-due', now)).toEqual({
      breakfast: { scheduledAt: new Date('2026-10-14T07:50:00') },
      dinner: { scheduledAt: new Date('2026-10-14T18:50:00') },
    })
    expect(mealTimes('fed-by-sam', now).breakfast).toEqual({
      givenAt: new Date('2026-10-14T07:40:00'),
      givenBy: SAM_ID,
      scheduledAt: new Date('2026-10-14T07:30:00'),
    })
    expect(mealTimes('dinner-by-mistake', now)).toEqual({
      breakfast: {
        givenAt: new Date('2026-10-13T20:50:00'),
        givenBy: SAM_ID,
        scheduledAt: new Date('2026-10-13T20:45:00'),
      },
      dinner: {
        givenAt: new Date('2026-10-14T07:50:00'),
        givenBy: PARTICIPANT_ID,
        scheduledAt: new Date('2026-10-14T07:45:00'),
      },
    })
  })

  it('starts each case from its meals, in Ginger’s pod shared with Sam', () => {
    const now = new Date()
    for (const caseId of ['a', 'd']) {
      const store = caseRun(caseId)
      expect(store.get(podAtom).memberCount).toBe(2)
      expect(toDoseStatus(mealOf(store, 'breakfast') as Meal, now)).toBe('due')
      expect(toDoseStatus(mealOf(store, 'dinner') as Meal, now)).toBe('upcoming')
    }
    expect(mealOf(caseRun('b'), 'breakfast')).toMatchObject({ amount: 'all', givenBy: SAM_ID, status: 'given' })
    const c = caseRun('c')
    expect(mealOf(c, 'breakfast')).toMatchObject({ givenBy: SAM_ID, status: 'given' })
    expect(mealOf(c, 'dinner')).toMatchObject({ givenBy: PARTICIPANT_ID, status: 'given' })
  })

  it('logs breakfast with all eaten in case A and completes the run', () => {
    const { click, effects, store } = renderSheet('a', 'feed-meal', 'breakfast')
    click('Mark as fed')
    expect(mealOf(store, 'breakfast')).toMatchObject({ amount: 'all', givenBy: PARTICIPANT_ID, status: 'given' })
    expect(store.get(toastAtom)).toEqual({ kind: 'fed', meal: 'breakfast' })
    expect(effects.navigations).toEqual(['care-feeding'])
    expect(effects.completed).toBe(true)
  })

  it('records about half eaten in case D and completes the run', () => {
    const { effects, store } = renderSheet('d', 'feed-meal', 'breakfast')
    feedSheet.onConfirm('half')
    expect(mealOf(store, 'breakfast')).toMatchObject({ amount: 'half', status: 'given' })
    expect(effects.navigations).toEqual(['care-feeding'])
    expect(effects.completed).toBe(true)
  })

  it('completes case B on opening Care & Feeding, where Sam’s breakfast shows, and no other case', () => {
    const b = renderInfo('b')
    b.open('Care & Feeding')
    expect(b.effects.navigations).toEqual(['care-feeding'])
    expect(b.effects.completed).toBe(true)

    const a = renderInfo('a')
    a.open('Care & Feeding')
    expect(a.effects.completed).toBe(false)
  })

  it('keeps today’s meals under Today however early the run starts', () => {
    vi.useFakeTimers()
    for (const [caseId, at] of [
      ['b', '2026-10-14T00:10:00'],
      ['c', '2026-10-14T09:00:00'],
    ] as const) {
      const now = new Date(at)
      vi.setSystemTime(now)
      const days = todaysGroup(caseRun(caseId), now)
      expect(days[0]?.day, `${caseId} at ${at}`).toBe('2026-10-14')
      expect(days[0]?.events.map(({ id }) => id)).toContain('breakfast-today')
      expect(days.slice(1).map(({ events }) => events.length)).toEqual([2, 2, 2, 2, 2, 2])
    }
  })

  it('undoes dinner back to due in case C and completes the run', () => {
    const { click, effects, store } = renderSheet('c', 'undo-meal', 'dinner')
    click('Mark as not fed')
    expect(toDoseStatus(mealOf(store, 'dinner') as Meal, new Date())).toBe('due')
    expect(mealOf(store, 'dinner')?.amount).toBeUndefined()
    expect(store.get(toastAtom)).toEqual({ kind: 'undone', meal: 'dinner' })
    expect(effects.completed).toBe(true)
  })

  it('keeps dinner as fed on "Keep as fed"', () => {
    const { click, effects, store } = renderSheet('c', 'undo-meal', 'dinner')
    click('Keep as fed')
    expect(mealOf(store, 'dinner')).toMatchObject({ givenBy: PARTICIPANT_ID, status: 'given' })
    expect(store.get(toastAtom)).toBeNull()
    expect(effects.navigations).toEqual(['back'])
  })

  it('warns before feeding Sam’s breakfast again in case B', () => {
    const dontFeed = renderSheet('b', 'feed-again', 'breakfast')
    dontFeed.click('Don’t feed')
    expect(mealOf(dontFeed.store, 'breakfast')?.extra).toBeUndefined()
    expect(dontFeed.effects.navigations).toEqual(['back'])

    const feed = renderSheet('b', 'feed-again', 'breakfast')
    feed.click('Feed again')
    expect(mealOf(feed.store, 'breakfast')).toMatchObject({ extra: { givenBy: PARTICIPANT_ID }, givenBy: SAM_ID })
    expect(feed.store.get(toastAtom)).toEqual({ kind: 'extra', meal: 'breakfast' })
    expect(feed.effects.completed).toBe(false)
  })

  it('lists Sam’s breakfast first in the feeding history of case B, after 6 days of turns', () => {
    const store = caseRun('b')
    const past = store.get(feedingHistoryAtom)
    expect(past).toHaveLength(12)
    expect(new Set(past.flatMap(({ givenBy }) => (givenBy ? [givenBy] : [])))).toEqual(
      new Set([PARTICIPANT_ID, SAM_ID]),
    )
    const [latest] = toFeedingHistory(store.get(mealsAtom), past, new Date())
    expect(latest).toMatchObject({ givenBy: SAM_ID, id: 'breakfast-today', status: 'fed' })
  })

  it('shows Care & Feeding instead of a sheet that no longer applies', () => {
    expect(renderSheet('b', 'feed-meal', 'breakfast').buttons.has('Mark as fed')).toBe(false)
    // Dinner is 11 hours away in case A, so it isn't due yet.
    expect(renderSheet('a', 'feed-meal', 'dinner').buttons.has('Cancel')).toBe(false)
    expect(renderSheet('b', 'undo-meal', 'breakfast').buttons.has('Mark as not fed')).toBe(false)
    expect(renderSheet('a', 'feed-again', 'breakfast').buttons.has('Feed again')).toBe(false)
  })
})
