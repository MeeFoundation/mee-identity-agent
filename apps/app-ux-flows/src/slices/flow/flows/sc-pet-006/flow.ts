import { createStore as createJotaiStore } from 'jotai'

import {
  apoquelMedication,
  createDoseHistory,
  createScheduledDose,
  gingerMembers,
  pastCourses,
} from '../../pods/ginger/apoquel-fixture'
import {
  DEFAULT_HISTORY_FILTER,
  doseHistoryAtom,
  doseHistoryFilterAtom,
  gingerPod,
  medicationAtom,
  medicationCoursesAtom,
  medicationDoseAtom,
  podAtom,
  podMembersAtom,
} from '../../pods/ginger/model'
import { defineFlow } from '../../runtime/define-flow'
import {
  accessAtom,
  DEFAULT_ACCESS,
  doseToastAtom,
  goalAtom,
  invitesAtom,
  membersAtom,
  type ScPet006Components,
  type ScPet006InitialState,
  type ScPet006ScreenId,
  sam,
  selectedInviteIdAtom,
  sentToastAtom,
  sitter,
  todayAtom,
  usedLinksAtom,
} from './model'
import { DoseHistoryScreen } from './screens/dose-history-screen'
import { GiveDoseScreen } from './screens/give-dose-screen'
import { InfoScreen } from './screens/info-screen'
import { InviteNameScreen } from './screens/invite-name-screen'
import { InviteShareScreen } from './screens/invite-share-screen'
import { MedicalScreen } from './screens/medical-screen'
import { MembersScreen } from './screens/members-screen'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

const key = (path: string) => `flows.scPet006.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scPet006Flow = defineFlow<ScPet006ScreenId, ScPet006Components, ScPet006InitialState>({
  cases: {
    a: {
      code: 'SC-PET-006-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { access: 'owner', goal: 'invite' },
      nameKey: caseKey('a', 'name'),
      questionKeys: [key('questions.expire')],
    },
    b: {
      code: 'SC-PET-006-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { access: 'viewer', goal: 'history' },
      nameKey: caseKey('b', 'name'),
    },
    c: {
      code: 'SC-PET-006-C',
      descriptionKey: caseKey('c', 'description'),
      goalKey: caseKey('c', 'goal'),
      hints: { medical: caseKey('c', 'hints.medical') },
      initialState: { access: 'logger', goal: 'dose' },
      nameKey: caseKey('c', 'name'),
      questionKeys: [key('questions.notify')],
    },
  },
  code: 'SC-PET-006',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    const access = initialState?.access ?? DEFAULT_ACCESS
    const members = access === 'owner' ? [sam] : [sam, sitter(access === 'logger' ? 'logger' : 'viewer')]
    const scheduledAt = new Date()
    store.set(accessAtom, access)
    store.set(goalAtom, initialState?.goal ?? 'invite')
    store.set(membersAtom, members)
    store.set(invitesAtom, [])
    store.set(usedLinksAtom, [])
    store.set(selectedInviteIdAtom, null)
    store.set(sentToastAtom, null)
    store.set(doseToastAtom, null)
    store.set(todayAtom, new Date())
    store.set(podAtom, { ...gingerPod, memberCount: members.length })
    store.set(podMembersAtom, gingerMembers)
    store.set(medicationAtom, apoquelMedication)
    store.set(medicationCoursesAtom, pastCourses)
    store.set(medicationDoseAtom, createScheduledDose(scheduledAt))
    store.set(doseHistoryAtom, createDoseHistory(scheduledAt))
    store.set(doseHistoryFilterAtom, DEFAULT_HISTORY_FILTER)
    return store
  },
  descriptionKey: key('description'),
  hints: {
    'dose-history': key('hints.doseHistory'),
    'give-dose': key('hints.giveDose'),
    info: key('hints.info'),
    'invite-name': key('hints.inviteName'),
    'invite-share': key('hints.inviteShare'),
    medical: key('hints.medical'),
    members: key('hints.members'),
  },
  id: 'sc-pet-006',
  initialScreen: 'info',
  kind: 'showcase',
  screenNotes: {
    'dose-history': { aboutKey: key('screens.doseHistory.about') },
    'give-dose': {
      aboutKey: key('screens.giveDose.about'),
      questionKeys: [key('screens.giveDose.questions.note')],
    },
    info: { aboutKey: key('screens.info.about') },
    'invite-name': { aboutKey: key('screens.inviteName.about') },
    'invite-share': { aboutKey: key('screens.inviteShare.about') },
    medical: { aboutKey: key('screens.medical.about') },
    members: {
      aboutKey: key('screens.members.about'),
      questionKeys: [key('screens.members.questions.changeAccess')],
    },
  },
  screens: {
    'dose-history': DoseHistoryScreen,
    'give-dose': GiveDoseScreen,
    info: InfoScreen,
    'invite-name': InviteNameScreen,
    'invite-share': InviteShareScreen,
    medical: MedicalScreen,
    members: MembersScreen,
  },
  titleKey: key('title'),
})
