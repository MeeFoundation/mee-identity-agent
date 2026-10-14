import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { toDoseStatus } from './dose-status'
import {
  careInstructionsAtom,
  createFeedingHistory,
  feedAgainAtom,
  feedingScheduleAtom,
  feedMealAtom,
  gingerCareInstructions,
  groupFeedingByDay,
  type Meal,
  mealsAtom,
  recogniseMealTimes,
  setUpScheduleAtom,
  toFeedingHistory,
  undoMealAtom,
} from './feeding'
import { PARTICIPANT_ID } from './model'

const breakfast: Meal = {
  id: 'breakfast',
  name: 'breakfast',
  portion: 'Half a cup of dry food',
  scheduledAt: '2026-10-14T07:00:00.000Z',
  status: 'due',
}

const storeWith = (meal: Meal) => {
  const store = createStore()
  store.set(mealsAtom, [meal])
  return store
}

describe('recogniseMealTimes', () => {
  it('finds breakfast and dinner in Ginger’s instructions, with where they are written', () => {
    const times = recogniseMealTimes(gingerCareInstructions)
    expect(times.map(({ name, time }) => [name, time])).toEqual([
      ['breakfast', '07:00'],
      ['dinner', '18:00'],
    ])
    expect(times.map(({ start, end }) => gingerCareInstructions.slice(start, end))).toEqual(['7am', '6pm'])
  })

  it('reads minutes, a space before am or pm, and names an early afternoon time lunch', () => {
    expect(recogniseMealTimes('7:30am, 6 pm and 12:15PM').map(({ name, time }) => [name, time])).toEqual([
      ['breakfast', '07:30'],
      ['dinner', '18:00'],
      ['lunch', '12:15'],
    ])
  })

  it('finds nothing without a clock time, and ignores impossible ones', () => {
    expect(recogniseMealTimes('Dry food twice a day')).toEqual([])
    expect(recogniseMealTimes('13pm and 7:75am')).toEqual([])
  })
})

describe('feeding atoms', () => {
  it('gives a meal the due windows of a dose', () => {
    expect(toDoseStatus(breakfast, new Date('2026-10-14T07:10:00.000Z'))).toBe('due')
    expect(toDoseStatus(breakfast, new Date('2026-10-14T09:00:00.000Z'))).toBe('overdue')
  })

  it('records who fed a meal, when, and how much was eaten', () => {
    const store = storeWith(breakfast)
    const now = new Date('2026-10-14T07:12:00.000Z')
    store.set(feedMealAtom, 'breakfast', 'half', now)
    expect(store.get(mealsAtom)[0]).toMatchObject({
      amount: 'half',
      givenAt: now.toISOString(),
      givenBy: PARTICIPANT_ID,
      status: 'given',
    })
  })

  it('undoes a meal back to its schedule and forgets the amount', () => {
    const store = storeWith({
      ...breakfast,
      amount: 'all',
      givenAt: breakfast.scheduledAt,
      givenBy: PARTICIPANT_ID,
      status: 'given',
    })
    store.set(undoMealAtom, 'breakfast')
    expect(store.get(mealsAtom)[0]).toEqual(breakfast)
  })

  it('adds an extra feeding without changing the first one', () => {
    const fedBySam: Meal = {
      ...breakfast,
      amount: 'all',
      givenAt: breakfast.scheduledAt,
      givenBy: 'sam',
      status: 'given',
    }
    const store = storeWith(fedBySam)
    const now = new Date('2026-10-14T07:30:00.000Z')
    store.set(feedAgainAtom, 'breakfast', now)
    expect(store.get(mealsAtom)[0]).toEqual({
      ...fedBySam,
      extra: { givenAt: now.toISOString(), givenBy: PARTICIPANT_ID },
    })
  })

  it('sets up the schedule from the times in the instructions', () => {
    const store = createStore()
    store.set(careInstructionsAtom, gingerCareInstructions)
    store.set(setUpScheduleAtom)
    expect(store.get(feedingScheduleAtom)).toEqual([
      { name: 'breakfast', time: '07:00' },
      { name: 'dinner', time: '18:00' },
    ])
  })

  it('schedules a time mentioned twice only once', () => {
    const store = createStore()
    store.set(careInstructionsAtom, 'Feed at 7am. Remember, 7am sharp.')
    store.set(setUpScheduleAtom)
    expect(store.get(feedingScheduleAtom)).toEqual([{ name: 'breakfast', time: '07:00' }])
  })
})

describe('feeding history', () => {
  const now = new Date('2026-10-14T19:00:00')
  const breakfastAt = new Date('2026-10-14T07:00:00')
  const fedBy = (daysAgo: number) => (daysAgo <= 3 ? PARTICIPANT_ID : 'alice')
  const past = createFeedingHistory(breakfastAt, fedBy, now)
  const todaysBreakfast: Meal = { ...breakfast, scheduledAt: breakfastAt.toISOString() }

  it('builds two meals a day for the 6 days before today, one missed and one half eaten', () => {
    expect(past).toHaveLength(12)
    expect(past.filter((event) => event.status === 'missed').map(({ id }) => id)).toEqual(['dinner-4'])
    expect(past.filter((event) => event.amount === 'half').map(({ id }) => id)).toEqual(['breakfast-2'])
    expect(past.find(({ id }) => id === 'breakfast-1')).toMatchObject({ givenBy: PARTICIPANT_ID })
    expect(past.find(({ id }) => id === 'breakfast-5')).toMatchObject({ givenBy: 'alice' })
    expect(new Date(past.find(({ id }) => id === 'dinner-1')?.scheduledAt ?? '')).toEqual(
      new Date('2026-10-13T18:00:00'),
    )
  })

  it('adds today’s meals once fed, and a second feeding as its own event, newest first', () => {
    const fed: Meal = {
      ...todaysBreakfast,
      amount: 'all',
      extra: { givenAt: new Date('2026-10-14T08:00:00').toISOString(), givenBy: PARTICIPANT_ID },
      givenAt: new Date('2026-10-14T07:05:00').toISOString(),
      givenBy: 'sam',
      status: 'given',
    }
    const history = toFeedingHistory([fed], past, now)
    expect(history.slice(0, 2).map(({ id }) => id)).toEqual(['breakfast-extra', 'breakfast-today'])
    expect(history).toHaveLength(14)
  })

  it('leaves out today’s due meals and anything older than 7 days', () => {
    const old = { ...past[0], day: '2026-10-07', id: 'old', scheduledAt: new Date('2026-10-07T07:00:00').toISOString() }
    const history = toFeedingHistory([todaysBreakfast], [...past, old], now)
    expect(history.map(({ id }) => id)).not.toContain('breakfast-today')
    expect(history.map(({ id }) => id)).not.toContain('old')
  })

  // Meal times are relative to the run, so on a morning run today's breakfast was scheduled the evening before.
  it('keeps today’s meals under today, and 6 full days before it, when breakfast was the evening before', () => {
    const morning = new Date('2026-10-14T09:00:00')
    const eveningBreakfast = new Date('2026-10-13T21:50:00')
    const fed: Meal = {
      ...breakfast,
      amount: 'all',
      givenAt: new Date('2026-10-13T21:55:00').toISOString(),
      givenBy: PARTICIPANT_ID,
      scheduledAt: eveningBreakfast.toISOString(),
      status: 'given',
    }
    const days = groupFeedingByDay(
      toFeedingHistory([fed], createFeedingHistory(eveningBreakfast, fedBy, morning), morning),
    )
    expect(days.map(({ day, events }) => [day, events.length])).toEqual([
      ['2026-10-14', 1],
      ['2026-10-13', 2],
      ['2026-10-12', 2],
      ['2026-10-11', 2],
      ['2026-10-10', 2],
      ['2026-10-09', 2],
      ['2026-10-08', 2],
    ])
    expect(days[0]?.events[0]?.id).toBe('breakfast-today')
  })

  it('counts days back by the calendar across a DST change', () => {
    const tz = process.env.TZ
    process.env.TZ = 'Europe/Berlin'
    try {
      // The day after the EU spring-forward, with breakfast just after midnight.
      const runAt = new Date('2026-03-30T11:40:00')
      const history = createFeedingHistory(new Date('2026-03-30T00:30:00'), fedBy, runAt)
      const breakfasts = history.filter(({ meal }) => meal === 'breakfast')
      expect(breakfasts.map(({ day }) => day)).toEqual([
        '2026-03-29',
        '2026-03-28',
        '2026-03-27',
        '2026-03-26',
        '2026-03-25',
        '2026-03-24',
      ])
      expect(breakfasts.map(({ scheduledAt }) => new Date(scheduledAt).getHours())).toEqual([0, 0, 0, 0, 0, 0])
    } finally {
      process.env.TZ = tz
    }
  })
})
