import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { bogdan, geo, geoInvite } from '../../pods/people/sharing'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  DEFAULT_MEMBERS,
  invitesAtom,
  membersAtom,
  type ScPpl002Components,
  type ScPpl002InitialState,
  type ScPpl002ScreenId,
  selectedInviteIdAtom,
  selectedMemberIdAtom,
  toastAtom,
  todayAtom,
  usedLinksAtom,
} from './model'
import { InfoScreen } from './screens/info-screen'
import { InviteDetailScreen } from './screens/invite-detail-screen'
import { InviteNameScreen } from './screens/invite-name-screen'
import { InviteShareScreen } from './screens/invite-share-screen'
import { MemberDetailScreen } from './screens/member-detail-screen'
import { MembersScreen } from './screens/members-screen'
import { RemoveConfirmScreen } from './screens/remove-confirm-screen'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

const key = (path: string) => `flows.scPpl002.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scPpl002Flow = defineFlow<ScPpl002ScreenId, ScPpl002Components, ScPpl002InitialState>({
  cases: {
    a: {
      code: 'SC-PPL-002-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { invites: [], members: [bogdan] },
      nameKey: caseKey('a', 'name'),
    },
    b: {
      code: 'SC-PPL-002-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { invites: [geoInvite], members: [bogdan] },
      nameKey: caseKey('b', 'name'),
      questionKeys: [caseKey('b', 'questions.expire')],
    },
    c: {
      code: 'SC-PPL-002-C',
      descriptionKey: caseKey('c', 'description'),
      goalKey: caseKey('c', 'goal'),
      initialState: { invites: [], members: [bogdan, geo] },
      nameKey: caseKey('c', 'name'),
    },
  },
  code: 'SC-PPL-002',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    const invites = initialState?.invites ?? []
    store.set(todayAtom, new Date())
    store.set(membersAtom, initialState?.members ?? DEFAULT_MEMBERS)
    store.set(invitesAtom, invites)
    store.set(
      usedLinksAtom,
      invites.map(({ link }) => link),
    )
    store.set(selectedInviteIdAtom, null)
    store.set(selectedMemberIdAtom, null)
    store.set(toastAtom, null)
    return store
  },
  descriptionKey: key('description'),
  designFrames: {
    info: figmaFrame('SC-PPL-002-A - About Sofia (info)', '1348-27324'),
    'invite-detail': figmaFrame("SC-PPL-002-B - Geo's invite (sheet)", '1348-27418'),
    'invite-name': figmaFrame('SC-PPL-002-A - Invite name (sheet)', '1348-27356'),
    'invite-share': figmaFrame('SC-PPL-002-A - Share invite link (sheet)', '1348-27367'),
    'member-detail': figmaFrame('SC-PPL-002-C - Geo (member detail)', '1348-27485'),
    members: figmaFrame('SC-PPL-002-A - Members', '1348-27346'),
    'remove-confirm': figmaFrame('SC-PPL-002-C - Remove Geo (confirm sheet)', '1348-27509'),
  },
  hints: {
    info: key('hints.info'),
    'invite-detail': key('hints.inviteDetail'),
    'invite-name': key('hints.inviteName'),
    'invite-share': key('hints.inviteShare'),
    'member-detail': key('hints.memberDetail'),
    members: key('hints.members'),
    'remove-confirm': key('hints.removeConfirm'),
  },
  id: 'sc-ppl-002',
  initialScreen: 'info',
  kind: 'showcase',
  questionKeys: [key('questions.viewOnly'), key('questions.telliCount')],
  screenNotes: {
    info: { aboutKey: key('screens.info.about') },
    'invite-detail': {
      aboutKey: key('screens.inviteDetail.about'),
      questionKeys: [key('screens.inviteDetail.questions.newLink'), key('screens.inviteDetail.questions.tellInvitee')],
    },
    'invite-name': {
      aboutKey: key('screens.inviteName.about'),
      questionKeys: [],
    },
    'invite-share': {
      aboutKey: key('screens.inviteShare.about'),
      questionKeys: [
        key('screens.inviteShare.questions.closedWithoutSending'),
        key('screens.inviteShare.questions.tone'),
      ],
    },
    'member-detail': {
      aboutKey: key('screens.memberDetail.about'),
      questionKeys: [key('screens.memberDetail.questions.changeAccess')],
    },
    members: { aboutKey: key('screens.members.about'), questionKeys: [key('screens.members.questions.pendingLabel')] },
    'remove-confirm': {
      aboutKey: key('screens.removeConfirm.about'),
      questionKeys: [
        key('screens.removeConfirm.questions.tellMember'),
        key('screens.removeConfirm.questions.messages'),
      ],
    },
  },
  screens: {
    info: InfoScreen,
    'invite-detail': InviteDetailScreen,
    'invite-name': InviteNameScreen,
    'invite-share': InviteShareScreen,
    'member-detail': MemberDetailScreen,
    members: MembersScreen,
    'remove-confirm': RemoveConfirmScreen,
  },
  titleKey: key('title'),
})
