import { createStore as createJotaiStore } from 'jotai'

import {
  apoquelMedication,
  createDoseHistory,
  createScheduledDose,
  gingerMembers,
  gingerSharedPod,
  pastCourses,
} from '../../pods/ginger/apoquel-fixture'
import {
  DEFAULT_HISTORY_FILTER,
  doseHistoryAtom,
  doseHistoryFilterAtom,
  medicationAtom,
  medicationCoursesAtom,
  medicationDoseAtom,
  podAtom,
  podMembersAtom,
} from '../../pods/ginger/model'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  DEFAULT_DOSE_START,
  doseTimes,
  type ScPet002Components,
  type ScPet002InitialState,
  type ScPet002ScreenId,
  toastAtom,
} from './model'
import { DoseHistoryScreen } from './screens/dose-history-screen'
import { GiveDoseScreen } from './screens/give-dose-screen'
import { MedicalScreen } from './screens/medical-screen'
import { UndoDoseScreen } from './screens/undo-dose-screen'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

const key = (path: string) => `flows.scPet002.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scPet002Flow = defineFlow<ScPet002ScreenId, ScPet002Components, ScPet002InitialState>({
  cases: {
    a: {
      code: 'SC-PET-002-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { doseStart: 'overdue' },
      nameKey: caseKey('a', 'name'),
      questionKeys: [caseKey('a', 'questions.skip')],
    },
    b: {
      code: 'SC-PET-002-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      hints: { medical: caseKey('b', 'hints.medical') },
      initialState: { doseStart: 'given-by-mistake' },
      nameKey: caseKey('b', 'name'),
      questionKeys: [caseKey('b', 'questions.limit')],
    },
  },
  code: 'SC-PET-002',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    const { scheduledAt, givenAt } = doseTimes(initialState?.doseStart ?? DEFAULT_DOSE_START, new Date())
    store.set(podAtom, gingerSharedPod)
    store.set(podMembersAtom, gingerMembers)
    store.set(medicationAtom, apoquelMedication)
    store.set(medicationCoursesAtom, pastCourses)
    store.set(medicationDoseAtom, createScheduledDose(scheduledAt, givenAt))
    store.set(doseHistoryAtom, createDoseHistory(scheduledAt))
    store.set(doseHistoryFilterAtom, DEFAULT_HISTORY_FILTER)
    store.set(toastAtom, null)
    return store
  },
  descriptionKey: key('description'),
  designFrames: {
    'dose-history': figmaFrame('SC-PET-002-B - Dose history', '1390-30541'),
    'give-dose': figmaFrame('SC-PET-002-A - Give dose (sheet over Medical)', '1390-30383'),
    medical: figmaFrame('SC-PET-002-A - Medical (dose overdue)', '1390-30353'),
    'undo-dose': figmaFrame('SC-PET-002-B - Undo dose (sheet over Medical)', '1390-30478'),
  },
  hidden: true,
  hints: {
    'dose-history': key('hints.doseHistory'),
    'give-dose': key('hints.giveDose'),
    medical: key('hints.medical'),
    'undo-dose': key('hints.undoDose'),
  },
  id: 'sc-pet-002',
  initialScreen: 'medical',
  kind: 'showcase',
  questionKeys: [key('questions.whoCanUndo')],
  screenNotes: {
    'dose-history': { aboutKey: key('screens.doseHistory.about') },
    'give-dose': { aboutKey: key('screens.giveDose.about') },
    medical: {
      aboutKey: key('screens.medical.about'),
      questionKeys: [key('screens.medical.questions.overdueTone')],
    },
    'undo-dose': {
      aboutKey: key('screens.undoDose.about'),
      questionKeys: [key('screens.undoDose.questions.confirm')],
    },
  },
  screens: {
    'dose-history': DoseHistoryScreen,
    'give-dose': GiveDoseScreen,
    medical: MedicalScreen,
    'undo-dose': UndoDoseScreen,
  },
  titleKey: key('title'),
})
