import { createStore as createJotaiStore } from 'jotai'

import { gingerMembers, gingerSharedPod } from '../../pods/ginger/apoquel-fixture'
import {
  careInstructionsAtom,
  feedingHistoryAtom,
  feedingScheduleAtom,
  gingerCareInstructions,
  mealsAtom,
  selectedMealIdAtom,
} from '../../pods/ginger/feeding'
import { podAtom, podMembersAtom } from '../../pods/ginger/model'
import { defineFlow } from '../../runtime/define-flow'
import {
  DEFAULT_MEAL_START,
  goalAtom,
  pastMeals,
  type ScPet004Components,
  type ScPet004InitialState,
  type ScPet004ScreenId,
  toastAtom,
  todaysMeals,
} from './model'
import { CareFeedingScreen } from './screens/care-feeding-screen'
import { FeedAgainScreen } from './screens/feed-again-screen'
import { FeedMealScreen } from './screens/feed-meal-screen'
import { FeedingHistoryScreen } from './screens/feeding-history-screen'
import { InfoScreen } from './screens/info-screen'
import { UndoMealScreen } from './screens/undo-meal-screen'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

const key = (path: string) => `flows.scPet004.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scPet004Flow = defineFlow<ScPet004ScreenId, ScPet004Components, ScPet004InitialState>({
  cases: {
    a: {
      code: 'SC-PET-004-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { goal: 'feed', mealStart: 'breakfast-due' },
      nameKey: caseKey('a', 'name'),
      questionKeys: [caseKey('a', 'questions.oneTap')],
    },
    b: {
      code: 'SC-PET-004-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { goal: 'notice', mealStart: 'fed-by-sam' },
      nameKey: caseKey('b', 'name'),
      questionKeys: [caseKey('b', 'questions.noticeable')],
    },
    c: {
      code: 'SC-PET-004-C',
      descriptionKey: caseKey('c', 'description'),
      goalKey: caseKey('c', 'goal'),
      hints: { 'care-feeding': caseKey('c', 'hints.careFeeding') },
      initialState: { goal: 'undo', mealStart: 'dinner-by-mistake' },
      nameKey: caseKey('c', 'name'),
      questionKeys: [caseKey('c', 'questions.tellSam')],
    },
    d: {
      code: 'SC-PET-004-D',
      descriptionKey: caseKey('d', 'description'),
      goalKey: caseKey('d', 'goal'),
      hints: { 'feed-meal': caseKey('d', 'hints.feedMeal') },
      initialState: { goal: 'feed', mealStart: 'breakfast-due' },
      nameKey: caseKey('d', 'name'),
      questionKeys: [caseKey('d', 'questions.none')],
    },
  },
  code: 'SC-PET-004',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(podAtom, gingerSharedPod)
    store.set(podMembersAtom, gingerMembers)
    store.set(careInstructionsAtom, gingerCareInstructions)
    store.set(feedingScheduleAtom, [])
    const now = new Date()
    const meals = todaysMeals(initialState?.mealStart ?? DEFAULT_MEAL_START, now)
    store.set(mealsAtom, meals)
    store.set(feedingHistoryAtom, pastMeals(meals, now))
    store.set(selectedMealIdAtom, null)
    store.set(goalAtom, initialState?.goal ?? 'feed')
    store.set(toastAtom, null)
    return store
  },
  descriptionKey: key('description'),
  hidden: true,
  hints: {
    'care-feeding': key('hints.careFeeding'),
    'feed-again': key('hints.feedAgain'),
    'feed-meal': key('hints.feedMeal'),
    'feeding-history': key('hints.feedingHistory'),
    info: key('hints.info'),
    'undo-meal': key('hints.undoMeal'),
  },
  id: 'sc-pet-004',
  initialScreen: 'info',
  kind: 'showcase',
  questionKeys: [key('questions.sharedToday')],
  screenNotes: {
    'care-feeding': {
      aboutKey: key('screens.careFeeding.about'),
      questionKeys: [key('screens.careFeeding.questions.missed')],
    },
    'feed-again': {
      aboutKey: key('screens.feedAgain.about'),
      questionKeys: [key('screens.feedAgain.questions.allow')],
    },
    'feed-meal': { aboutKey: key('screens.feedMeal.about') },
    'feeding-history': { aboutKey: key('screens.feedingHistory.about') },
    info: { aboutKey: key('screens.info.about') },
    'undo-meal': { aboutKey: key('screens.undoMeal.about') },
  },
  screens: {
    'care-feeding': CareFeedingScreen,
    'feed-again': FeedAgainScreen,
    'feed-meal': FeedMealScreen,
    'feeding-history': FeedingHistoryScreen,
    info: InfoScreen,
    'undo-meal': UndoMealScreen,
  },
  titleKey: key('title'),
})
