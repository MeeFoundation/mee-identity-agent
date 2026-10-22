import { atom } from 'jotai'

import type { NoteBlock } from '../../pods/notes/tidy'
import type { ContactInfoRecord } from '../../pods/people/contact-info'
import { bogdan, daysBefore, geo, type Member } from '../../pods/people/sharing'
import { answerFor } from '../../pods/people/telli-answers'
import type { FlowStore } from '../../runtime/define-flow'
import type { DefaultComponents } from '@/shared/ui/default-components'
import type { GroupChatComponents } from '@/shared/ui/group-chat-components'
import type { PodComponents } from '@/shared/ui/pod-components'

export type ScPpl003ScreenId = 'notes' | 'chat' | 'info' | 'contact-info' | 'members'

export type ScPpl003Components = DefaultComponents & PodComponents & GroupChatComponents

// What completes the run: reaching Members (case A) or Telli's first answer from the pod (case B).
export type ScPpl003Goal = 'members' | 'telli'

export type ScPpl003InitialState = {
  goal?: ScPpl003Goal
}

// Bogdan's note and Contact info, as Geo sees them; nothing here can be changed.
export const sofiaNote: readonly NoteBlock[] = [
  { id: 'top', kind: 'text', text: '#family #care\n' },
  { id: 'link', kind: 'contact-link' },
  { id: 'bottom', kind: 'text', text: 'Piano on Tuesdays\n' },
]

export const sofiaContact: ContactInfoRecord = { dateOfBirth: '2018-04-08', firstName: 'Sofia', lastName: 'Walker' }

// Geo is the person using the app.
export const podMembers: readonly Member[] = [bogdan, geo]

export const TELLI_DELAY_MS = 1000

type ChatAuthor = 'bogdan' | 'telli' | 'me'

// A message's text is either what Geo typed or a string resource.
type MessageText = { text: string } | { textKey: string }

export type ChatEntry =
  | { id: string; kind: 'day'; labelKey: string }
  | { id: string; kind: 'joined'; name: string }
  | ({ id: string; kind: 'message'; author: ChatAuthor; sentAt: Date } & MessageText)

const atTime = (day: Date, hours: number, minutes: number) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes)

export const startingChat = (today: Date): ChatEntry[] => {
  const yesterday = daysBefore(today, 1)
  return [
    { id: 'day', kind: 'day', labelKey: 'flows.scPpl003.chat.yesterday' },
    {
      author: 'bogdan',
      id: 'welcome-pod',
      kind: 'message',
      sentAt: atTime(yesterday, 18, 40),
      textKey: 'flows.scPpl003.chat.bogdanSetUp',
    },
    { id: 'joined', kind: 'joined', name: geo.name },
    {
      author: 'bogdan',
      id: 'welcome-geo',
      kind: 'message',
      sentAt: atTime(yesterday, 18, 42),
      textKey: 'flows.scPpl003.chat.bogdanWelcome',
    },
  ]
}

export const goalAtom = atom<ScPpl003Goal>('members')

export const chatAtom = atom<readonly ChatEntry[]>([])

// Telli's answers on their way; "Telli is typing…" shows while there is one.
export const pendingRepliesAtom = atom(0)

export const telliTypingAtom = atom((get) => get(pendingRepliesAtom) > 0)

const nextId = (chat: readonly ChatEntry[]) => `message-${chat.length}`

export const sendMessageAtom = atom(null, (get, set, text: string, sentAt: Date) => {
  const chat = get(chatAtom)
  set(chatAtom, [...chat, { author: 'me', id: nextId(chat), kind: 'message', sentAt, text: text.trim() }])
})

// Started by the send action rather than the chat screen, so the answer arrives even after Geo leaves the chat.
export const scheduleReply = (store: FlowStore, message: string, onAnswer: (fromPod: boolean) => void) => {
  const answer = answerFor(message)
  if (!answer) return
  store.set(pendingRepliesAtom, store.get(pendingRepliesAtom) + 1)
  setTimeout(() => {
    const chat = store.get(chatAtom)
    store.set(chatAtom, [
      ...chat,
      { author: 'telli', id: nextId(chat), kind: 'message', sentAt: new Date(), textKey: answer.key },
    ])
    store.set(pendingRepliesAtom, store.get(pendingRepliesAtom) - 1)
    onAnswer(answer.fromPod)
  }, TELLI_DELAY_MS)
}
