import { atom } from 'jotai'

import {
  type CareFeedingToastValue,
  createFeedingHistory,
  type FeedingEvent,
  gingerPortion,
  type Meal,
  type MealName,
} from '../../pods/ginger/feeding'
import { type GingerPodComponents, PARTICIPANT_ID } from '../../pods/ginger/model'

export type ScPet004ScreenId = 'info' | 'care-feeding' | 'feed-meal' | 'undo-meal' | 'feed-again' | 'feeding-history'

export type ScPet004Components = GingerPodComponents

// The meals each case starts from: breakfast due, breakfast already fed by Sam, or dinner marked as fed by mistake.
export type MealStart = 'breakfast-due' | 'fed-by-sam' | 'dinner-by-mistake'

// What completes the run: recording a meal (A, D), opening Care & Feeding (B), or undoing a meal (C).
export type ScPet004Goal = 'feed' | 'notice' | 'undo'

export type ScPet004InitialState = {
  mealStart?: MealStart
  goal?: ScPet004Goal
}

export const DEFAULT_MEAL_START: MealStart = 'breakfast-due'

export const SAM_ID = 'sam'

type MealTime = { scheduledAt: Date; givenAt?: Date; givenBy?: string }

const MINUTE_MS = 60_000

// Dinner is 11 hours after breakfast, as 7am and 6pm in Ginger's instructions.
const BETWEEN_MEALS_MS = 11 * 60 * MINUTE_MS

const minutesBefore = (now: Date, minutes: number) => new Date(now.getTime() - minutes * MINUTE_MS)

// Relative to the run's start, so the case reads the same whenever it is shown.
export const mealTimes = (mealStart: MealStart, now: Date): Record<'breakfast' | 'dinner', MealTime> => {
  if (mealStart === 'dinner-by-mistake') {
    const dinner = minutesBefore(now, 15)
    const breakfast = new Date(dinner.getTime() - BETWEEN_MEALS_MS)
    return {
      breakfast: { givenAt: new Date(breakfast.getTime() + 5 * MINUTE_MS), givenBy: SAM_ID, scheduledAt: breakfast },
      dinner: { givenAt: minutesBefore(now, 10), givenBy: PARTICIPANT_ID, scheduledAt: dinner },
    }
  }
  const breakfast: MealTime =
    mealStart === 'fed-by-sam'
      ? { givenAt: minutesBefore(now, 20), givenBy: SAM_ID, scheduledAt: minutesBefore(now, 30) }
      : { scheduledAt: minutesBefore(now, 10) }
  return { breakfast, dinner: { scheduledAt: new Date(breakfast.scheduledAt.getTime() + BETWEEN_MEALS_MS) } }
}

const toMeal = (name: MealName, { scheduledAt, givenAt, givenBy }: MealTime): Meal =>
  givenAt && givenBy
    ? {
        amount: 'all',
        givenAt: givenAt.toISOString(),
        givenBy,
        id: name,
        name,
        portion: gingerPortion,
        scheduledAt: scheduledAt.toISOString(),
        status: 'given',
      }
    : { id: name, name, portion: gingerPortion, scheduledAt: scheduledAt.toISOString(), status: 'due' }

export const todaysMeals = (mealStart: MealStart, now: Date): Meal[] => {
  const times = mealTimes(mealStart, now)
  return [toMeal('breakfast', times.breakfast), toMeal('dinner', times.dinner)]
}

// The participant and Sam take turns, day by day.
export const pastMeals = (meals: readonly Meal[], now: Date): FeedingEvent[] => {
  const breakfast = meals.find((meal) => meal.name === 'breakfast')
  return breakfast
    ? createFeedingHistory(
        new Date(breakfast.scheduledAt),
        (daysAgo) => (daysAgo % 2 === 0 ? SAM_ID : PARTICIPANT_ID),
        now,
      )
    : []
}

export const goalAtom = atom<ScPet004Goal>('feed')

export const toastAtom = atom<CareFeedingToastValue | null>(null)
