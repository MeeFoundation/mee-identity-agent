import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { groupChatComponents } from '@/shared/ui/group-chat-components'
import { podComponents } from '@/shared/ui/pod-components'

import {
  careInstructionsAtom,
  feedingHistoryAtom,
  feedingScheduleAtom,
  gingerCareInstructions,
  mealsAtom,
  selectedMealIdAtom,
} from '../../pods/ginger/feeding'
import { gingerPod, podAtom, podMembersAtom } from '../../pods/ginger/model'
import { defineFlow } from '../../runtime/define-flow'
import {
  alice,
  chatAtom,
  goalAtom,
  isOwnerAtom,
  pendingRepliesAtom,
  type ScPet003Components,
  type ScPet003InitialState,
  type ScPet003ScreenId,
  sitterHistory,
  sitterMeals,
  sitterSchedule,
  startingChat,
  toastAtom,
} from './model'
import { CareFeedingScreen } from './screens/care-feeding-screen'
import { ChatScreen } from './screens/chat-screen'
import { EditInstructionsScreen } from './screens/edit-instructions-screen'
import { FeedMealScreen } from './screens/feed-meal-screen'
import { FeedingHistoryScreen } from './screens/feeding-history-screen'
import { InfoScreen } from './screens/info-screen'
import { ScheduleSheetScreen } from './screens/schedule-sheet-screen'
import { UndoMealScreen } from './screens/undo-meal-screen'

const key = (path: string) => `flows.scPet003.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scPet003Flow = defineFlow<ScPet003ScreenId, ScPet003Components, ScPet003InitialState>({
  cases: {
    a: {
      code: 'SC-PET-003-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { goal: 'write', instructions: 'empty', role: 'owner' },
      nameKey: caseKey('a', 'name'),
      questionKeys: [caseKey('a', 'questions.emptyState')],
    },
    b: {
      code: 'SC-PET-003-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { goal: 'feed', instructions: 'filled', role: 'sitter' },
      nameKey: caseKey('b', 'name'),
      questionKeys: [caseKey('b', 'questions.historyBefore')],
    },
    c: {
      code: 'SC-PET-003-C',
      descriptionKey: caseKey('c', 'description'),
      goalKey: caseKey('c', 'goal'),
      hints: { info: caseKey('c', 'hints.info') },
      initialState: { goal: 'telli', instructions: 'filled', role: 'sitter' },
      nameKey: caseKey('c', 'name'),
      questionKeys: [caseKey('c', 'questions.quote')],
    },
    d: {
      code: 'SC-PET-003-D',
      descriptionKey: caseKey('d', 'description'),
      goalKey: caseKey('d', 'goal'),
      initialState: { goal: 'schedule', instructions: 'filled', role: 'owner' },
      nameKey: caseKey('d', 'name'),
      questionKeys: [caseKey('d', 'questions.afterSchedule')],
    },
  },
  code: 'SC-PET-003',
  components: { ...defaultComponents, ...podComponents, ...groupChatComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    const role = initialState?.role ?? 'owner'
    const sitter = role === 'sitter'
    const members = sitter ? [alice] : []
    const now = new Date()
    const meals = sitter ? sitterMeals(now) : []
    store.set(podAtom, { ...gingerPod, memberCount: 1 + members.length })
    store.set(podMembersAtom, members)
    store.set(isOwnerAtom, role === 'owner')
    store.set(goalAtom, initialState?.goal ?? 'write')
    store.set(careInstructionsAtom, initialState?.instructions === 'filled' ? gingerCareInstructions : '')
    store.set(feedingScheduleAtom, sitter ? sitterSchedule : [])
    store.set(mealsAtom, meals)
    store.set(feedingHistoryAtom, sitterHistory(meals, now))
    store.set(selectedMealIdAtom, null)
    store.set(toastAtom, null)
    store.set(chatAtom, startingChat(role, now))
    store.set(pendingRepliesAtom, 0)
    return store
  },
  descriptionKey: key('description'),
  hidden: true,
  hints: {
    'care-feeding': key('hints.careFeeding'),
    chat: key('hints.chat'),
    'edit-instructions': key('hints.editInstructions'),
    'feed-meal': key('hints.feedMeal'),
    'feeding-history': key('hints.feedingHistory'),
    info: key('hints.info'),
    'schedule-sheet': key('hints.scheduleSheet'),
    'undo-meal': key('hints.undoMeal'),
  },
  id: 'sc-pet-003',
  initialScreen: 'info',
  kind: 'showcase',
  questionKeys: [key('questions.freeText')],
  screenNotes: {
    'care-feeding': {
      aboutKey: key('screens.careFeeding.about'),
      questionKeys: [key('screens.careFeeding.questions.sections')],
    },
    chat: { aboutKey: key('screens.chat.about') },
    'edit-instructions': { aboutKey: key('screens.editInstructions.about') },
    'feed-meal': { aboutKey: key('screens.feedMeal.about') },
    'feeding-history': { aboutKey: key('screens.feedingHistory.about') },
    info: { aboutKey: key('screens.info.about') },
    'schedule-sheet': {
      aboutKey: key('screens.scheduleSheet.about'),
      questionKeys: [key('screens.scheduleSheet.questions.editable')],
    },
    'undo-meal': { aboutKey: key('screens.undoMeal.about') },
  },
  screens: {
    'care-feeding': CareFeedingScreen,
    chat: ChatScreen,
    'edit-instructions': EditInstructionsScreen,
    'feed-meal': FeedMealScreen,
    'feeding-history': FeedingHistoryScreen,
    info: InfoScreen,
    'schedule-sheet': ScheduleSheetScreen,
    'undo-meal': UndoMealScreen,
  },
  titleKey: key('title'),
})
