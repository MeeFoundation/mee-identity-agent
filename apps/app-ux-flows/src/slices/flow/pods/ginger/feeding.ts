import { atom } from 'jotai'

import { localDay } from './dose-history'
import { toDoseStatus } from './dose-status'
import { PARTICIPANT_ID } from './model'

// The Tellipod example's own Care & Feeding claim for Ginger (graph 60): one free-text comment.
export const gingerCareInstructions =
  "Fed twice daily, 7am and 6pm: half a cup of dry food (Purina Pro Plan) plus a spoonful of wet food. Fresh water bowl refilled daily. Sleeps in a cat bed in Alice's bedroom. Litter box is in the laundry room and is scooped daily."

// The portion of each of Ginger's meals, as her instructions put it.
export const gingerPortion = 'Half a cup of dry food, a spoonful of wet food'

export type MealName = 'breakfast' | 'lunch' | 'dinner'

export type MealAmount = 'all' | 'half' | 'little' | 'none'

// A meal of the feeding schedule at a fixed time of day, before anyone logs it.
export type ScheduledMeal = {
  name: MealName
  // 24-hour local time, HH:mm.
  time: string
}

// One of today's meals; the ontology has no feeding schedule, so this is the prototype's own shape.
// It has the fields of a `MedicationDose`, so a meal follows the same due windows as a dose.
export type Meal = {
  id: string
  name: MealName
  portion: string
  // ISO date-time.
  scheduledAt: string
  status: 'due' | 'given'
  // ISO date-time, set once the meal is fed.
  givenAt?: string
  // Member id of whoever fed it.
  givenBy?: string
  amount?: MealAmount
  // A second feeding of a meal someone else already gave.
  extra?: { givenAt: string; givenBy: string }
}

// Whether a meal can be marked as fed now: due or overdue, as its card offers "Mark as fed" only then.
export const canFeed = (meal: Meal, now: Date) => {
  const status = toDoseStatus(meal, now)
  return status === 'due' || status === 'overdue'
}

// A clock time written in the instructions, such as "7am" or "6:30 pm".
export type RecognisedMealTime = ScheduledMeal & {
  start: number
  end: number
}

const clockTimePattern = /\b(\d{1,2})(?::(\d{2}))?\s?(am|pm)\b/gi

const pad = (value: number) => String(value).padStart(2, '0')

const mealNameAt = (hours: number): MealName => {
  if (hours < 12) return 'breakfast'
  if (hours < 16) return 'lunch'
  return 'dinner'
}

export const recogniseMealTimes = (text: string): RecognisedMealTime[] =>
  [...text.matchAll(clockTimePattern)].flatMap((match) => {
    const hour = Number(match[1])
    const minutes = Number(match[2] ?? '0')
    if (hour < 1 || hour > 12 || minutes > 59) return []
    const hours = (hour % 12) + (match[3]?.toLowerCase() === 'pm' ? 12 : 0)
    return [
      {
        end: match.index + match[0].length,
        name: mealNameAt(hours),
        start: match.index,
        time: `${pad(hours)}:${pad(minutes)}`,
      },
    ]
  })

// Each time once, as the instructions may mention the same meal time twice.
export const distinctMealTimes = (times: readonly RecognisedMealTime[]) =>
  times.filter((time, index) => times.findIndex((other) => other.time === time.time) === index)

export const formatMealTime = (time: string, language: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return new Intl.DateTimeFormat(language, { timeStyle: 'short' }).format(date)
}

// A past meal, or one of today's once fed; a second feeding of a meal is an event of its own.
export type FeedingEvent = {
  id: string
  // The local calendar day (YYYY-MM-DD) whose meals this is one of; a meal can be fed on the day before or after.
  day: string
  meal: MealName
  // ISO date-time.
  scheduledAt: string
  status: 'fed' | 'missed'
  // ISO date-time, for a fed meal.
  givenAt?: string
  givenBy?: string
  amount?: MealAmount
  extra?: true
}

export type FeedingDay = {
  // Local calendar date (YYYY-MM-DD).
  day: string
  events: FeedingEvent[]
}

const HISTORY_DAYS = 7

const todaysEvents = (meal: Meal, day: string): FeedingEvent[] => [
  ...(meal.status === 'given'
    ? [
        {
          amount: meal.amount,
          day,
          givenAt: meal.givenAt,
          givenBy: meal.givenBy,
          id: `${meal.id}-today`,
          meal: meal.name,
          scheduledAt: meal.scheduledAt,
          status: 'fed' as const,
        },
      ]
    : []),
  ...(meal.extra
    ? [
        {
          day,
          extra: true as const,
          givenAt: meal.extra.givenAt,
          givenBy: meal.extra.givenBy,
          id: `${meal.id}-extra`,
          meal: meal.name,
          scheduledAt: meal.scheduledAt,
          status: 'fed' as const,
        },
      ]
    : []),
]

const eventTime = (event: FeedingEvent) => new Date(event.givenAt ?? event.scheduledAt).getTime()

// The local calendar day a given number of days before `now`, counted in calendar days so a DST change can't skip one.
const dayBefore = (now: Date, days: number) => {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  return localDay(date.toISOString())
}

// The last 7 days of meals, today included, newest first; today's meals join once fed, under today.
export const toFeedingHistory = (meals: readonly Meal[], past: readonly FeedingEvent[], now: Date): FeedingEvent[] => {
  const since = dayBefore(now, HISTORY_DAYS - 1)
  return [...meals.flatMap((meal) => todaysEvents(meal, dayBefore(now, 0))), ...past]
    .filter((event) => event.day >= since)
    .sort((a, b) => b.day.localeCompare(a.day) || eventTime(b) - eventTime(a))
}

// Consecutive events of the same day, keeping the list's order.
export const groupFeedingByDay = (events: readonly FeedingEvent[]): FeedingDay[] =>
  events.reduce<FeedingDay[]>((days, event) => {
    const last = days.at(-1)
    if (last?.day === event.day) last.events.push(event)
    else days.push({ day: event.day, events: [event] })
    return days
  }, [])

const MISSED_DAY = 4
const HALF_EATEN_DAY = 2
const BETWEEN_MEALS_MS = 11 * 3_600_000

// Breakfast and dinner on each of the 6 days before today, at the time of today's breakfast and 11 hours later.
// Today's breakfast may fall on the calendar day before `now`, so each day is counted back from `now` instead.
// One dinner is missed and one breakfast half eaten; `fedBy` names who fed the meals a given number of days ago.
export const createFeedingHistory = (
  breakfastAt: Date,
  fedBy: (daysAgo: number) => string,
  now: Date,
): FeedingEvent[] =>
  Array.from({ length: HISTORY_DAYS - 1 }, (_, index) => index + 1).flatMap((daysAgo) => {
    const day = dayBefore(now, daysAgo)
    const breakfast = new Date(breakfastAt)
    breakfast.setDate(breakfast.getDate() - daysAgo)
    const dinner = new Date(breakfast.getTime() + BETWEEN_MEALS_MS)
    const fed = (meal: MealName, scheduledAt: Date, lateMinutes: number, amount: MealAmount): FeedingEvent => ({
      amount,
      day,
      givenAt: new Date(scheduledAt.getTime() + lateMinutes * 60_000).toISOString(),
      givenBy: fedBy(daysAgo),
      id: `${meal}-${daysAgo}`,
      meal,
      scheduledAt: scheduledAt.toISOString(),
      status: 'fed',
    })
    return [
      daysAgo === MISSED_DAY
        ? {
            day,
            id: `dinner-${daysAgo}`,
            meal: 'dinner' as const,
            scheduledAt: dinner.toISOString(),
            status: 'missed' as const,
          }
        : fed('dinner', dinner, (daysAgo * 7) % 20, 'all'),
      fed('breakfast', breakfast, (daysAgo * 5) % 15, daysAgo === HALF_EATEN_DAY ? 'half' : 'all'),
    ]
  })

// The toast on Care & Feeding after saving the instructions, setting up the schedule, or a meal sheet.
export type CareFeedingToastValue =
  | { kind: 'saved' | 'scheduled' }
  | { kind: 'fed' | 'undone' | 'extra'; meal: MealName }

export const careInstructionsAtom = atom('')

export const feedingScheduleAtom = atom<readonly ScheduledMeal[]>([])

export const mealsAtom = atom<readonly Meal[]>([])

// Meals before today; today's are derived from `mealsAtom`.
export const feedingHistoryAtom = atom<readonly FeedingEvent[]>([])

// The meal a sheet is about; sheets are screens of their own, so the card that opens one sets it.
export const selectedMealIdAtom = atom<string | null>(null)

export const selectedMealAtom = atom((get) => get(mealsAtom).find((meal) => meal.id === get(selectedMealIdAtom)))

const updateMeal = (meals: readonly Meal[], mealId: string, update: (meal: Meal) => Meal) =>
  meals.map((meal) => (meal.id === mealId ? update(meal) : meal))

export const feedMealAtom = atom(null, (get, set, mealId: string, amount: MealAmount, now: Date) => {
  set(
    mealsAtom,
    updateMeal(get(mealsAtom), mealId, (meal) => ({
      ...meal,
      amount,
      givenAt: now.toISOString(),
      givenBy: PARTICIPANT_ID,
      status: 'given',
    })),
  )
})

// Reverts a meal marked as fed by mistake: it keeps its scheduled time and forgets how much was eaten.
export const undoMealAtom = atom(null, (get, set, mealId: string) => {
  set(
    mealsAtom,
    updateMeal(get(mealsAtom), mealId, ({ id, name, portion, scheduledAt }) => ({
      id,
      name,
      portion,
      scheduledAt,
      status: 'due',
    })),
  )
})

// Leaves the first feeding as it was, so whoever gave it stays on record.
export const feedAgainAtom = atom(null, (get, set, mealId: string, now: Date) => {
  set(
    mealsAtom,
    updateMeal(get(mealsAtom), mealId, (meal) => ({
      ...meal,
      extra: { givenAt: now.toISOString(), givenBy: PARTICIPANT_ID },
    })),
  )
})

// Turns the meal times found in the instructions into the feeding schedule.
export const setUpScheduleAtom = atom(null, (get, set) => {
  set(
    feedingScheduleAtom,
    distinctMealTimes(recogniseMealTimes(get(careInstructionsAtom))).map(({ name, time }) => ({ name, time })),
  )
})
