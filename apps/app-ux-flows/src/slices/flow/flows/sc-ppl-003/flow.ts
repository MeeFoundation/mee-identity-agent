import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { groupChatComponents } from '@/shared/ui/group-chat-components'
import { podComponents } from '@/shared/ui/pod-components'

import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  chatAtom,
  goalAtom,
  pendingRepliesAtom,
  type ScPpl003Components,
  type ScPpl003InitialState,
  type ScPpl003ScreenId,
  startingChat,
} from './model'
import { ChatScreen } from './screens/chat-screen'
import { ContactInfoScreen } from './screens/contact-info-screen'
import { InfoScreen } from './screens/info-screen'
import { MembersScreen } from './screens/members-screen'
import { NotesScreen } from './screens/notes-screen'

const tellipodFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

const designSystemFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/MX0vkzAw7MfoG7ZMQUmfhu/Mee---Design-System-v5.2.2?node-id=${nodeId}`,
})

const key = (path: string) => `flows.scPpl003.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scPpl003Flow = defineFlow<ScPpl003ScreenId, ScPpl003Components, ScPpl003InitialState>({
  cases: {
    a: {
      code: 'SC-PPL-003-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { goal: 'members' },
      nameKey: caseKey('a', 'name'),
    },
    b: {
      code: 'SC-PPL-003-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { goal: 'telli' },
      nameKey: caseKey('b', 'name'),
    },
  },
  code: 'SC-PPL-003',
  components: { ...defaultComponents, ...podComponents, ...groupChatComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(goalAtom, initialState?.goal ?? 'members')
    store.set(chatAtom, startingChat(new Date()))
    store.set(pendingRepliesAtom, 0)
    return store
  },
  descriptionKey: key('description'),
  designFrames: {
    chat: designSystemFrame('Chat', '6473-3081'),
    info: tellipodFrame('Pod - 6', '908-19475'),
    members: tellipodFrame('Pod - 7', '908-19728'),
  },
  hints: {
    chat: key('hints.chat'),
    'contact-info': key('hints.contactInfo'),
    info: key('hints.info'),
    members: key('hints.members'),
    notes: key('hints.notes'),
  },
  id: 'sc-ppl-003',
  initialScreen: 'notes',
  kind: 'showcase',
  questionKeys: [key('questions.noticeReadOnly'), key('questions.tryToEdit')],
  screenNotes: {
    chat: {
      aboutKey: key('screens.chat.about'),
      questionKeys: [key('screens.chat.questions.source')],
    },
    'contact-info': { aboutKey: key('screens.contactInfo.about') },
    info: { aboutKey: key('screens.info.about'), questionKeys: [key('screens.info.questions.categories')] },
    members: { aboutKey: key('screens.members.about'), questionKeys: [key('screens.members.questions.pending')] },
    notes: { aboutKey: key('screens.notes.about'), questionKeys: [key('screens.notes.questions.sayReadOnly')] },
  },
  screens: {
    chat: ChatScreen,
    'contact-info': ContactInfoScreen,
    info: InfoScreen,
    members: MembersScreen,
    notes: NotesScreen,
  },
  titleKey: key('title'),
})
