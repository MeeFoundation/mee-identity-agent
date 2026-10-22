import { atom } from 'jotai'

import {
  type CareFeedingToastValue,
  createFeedingHistory,
  type FeedingEvent,
  gingerPortion,
  type Meal,
  type ScheduledMeal,
} from '../../pods/ginger/feeding'
import { type GingerPodComponents, PARTICIPANT_ID, type PodMember } from '../../pods/ginger/model'
import { answerFor } from '../../pods/ginger/telli-answers'
import type { FlowStore } from '../../runtime/define-flow'
import type { GroupChatComponents } from '@/shared/ui/group-chat-components'

export type ScPet003ScreenId =
  | 'info'
  | 'care-feeding'
  | 'edit-instructions'
  | 'schedule-sheet'
  | 'feed-meal'
  | 'undo-meal'
  | 'feeding-history'
  | 'chat'

export type ScPet003Components = GingerPodComponents & GroupChatComponents

// The owner writes the instructions; a sitter looks after Ginger in a pod Alice shared, reads them and feeds her.
export type Role = 'owner' | 'sitter'

// What completes the run: saving the instructions (A), recording a meal (B), Telli's answer from the pod (C),
// or setting up the schedule (D).
export type ScPet003Goal = 'write' | 'feed' | 'telli' | 'schedule'

export type ScPet003InitialState = {
  role?: Role
  instructions?: 'empty' | 'filled'
  goal?: ScPet003Goal
}

export const alice: PodMember = { id: 'alice', name: 'Alice' }

// The schedule Alice set up from her instructions before she left.
export const sitterSchedule: readonly ScheduledMeal[] = [
  { name: 'breakfast', time: '07:00' },
  { name: 'dinner', time: '18:00' },
]

const MINUTE_MS = 60_000

const BETWEEN_MEALS_MS = 11 * 60 * MINUTE_MS

// Relative to the run's start: dinner is due, and the sitter fed breakfast 11 hours earlier.
export const sitterMeals = (now: Date): Meal[] => {
  const dinner = new Date(now.getTime() - 10 * MINUTE_MS)
  const breakfast = new Date(dinner.getTime() - BETWEEN_MEALS_MS)
  return [
    {
      amount: 'all',
      givenAt: new Date(breakfast.getTime() + 5 * MINUTE_MS).toISOString(),
      givenBy: PARTICIPANT_ID,
      id: 'breakfast',
      name: 'breakfast',
      portion: gingerPortion,
      scheduledAt: breakfast.toISOString(),
      status: 'given',
    },
    { id: 'dinner', name: 'dinner', portion: gingerPortion, scheduledAt: dinner.toISOString(), status: 'due' },
  ]
}

// The sitter has fed Ginger for the last 3 days; Alice did before she left.
export const sitterHistory = (meals: readonly Meal[], now: Date): FeedingEvent[] => {
  const breakfast = meals.find((meal) => meal.name === 'breakfast')
  return breakfast
    ? createFeedingHistory(
        new Date(breakfast.scheduledAt),
        (daysAgo) => (daysAgo <= 3 ? PARTICIPANT_ID : alice.id),
        now,
      )
    : []
}

export const isOwnerAtom = atom(true)

export const goalAtom = atom<ScPet003Goal>('write')

export const toastAtom = atom<CareFeedingToastValue | null>(null)

export const TELLI_DELAY_MS = 1000

type ChatAuthor = 'alice' | 'telli' | 'me'

// A message's text is either what the participant typed or a string resource.
type MessageText = { text: string } | { textKey: string }

export type ChatEntry = { id: string; author: ChatAuthor; sentAt: Date } & MessageText

// The sitter finds Alice's thanks in the chat; an owner's chat starts empty.
export const startingChat = (role: Role, now: Date): ChatEntry[] =>
  role === 'sitter'
    ? [
        {
          author: 'alice',
          id: 'thanks',
          sentAt: new Date(now.getTime() - 2 * 3_600_000),
          textKey: 'flows.scPet003.chat.aliceThanks',
        },
      ]
    : []

export const chatAtom = atom<readonly ChatEntry[]>([])

// Telli's answers on their way; "Telli is typing…" shows while there is one.
export const pendingRepliesAtom = atom(0)

export const telliTypingAtom = atom((get) => get(pendingRepliesAtom) > 0)

const nextId = (chat: readonly ChatEntry[]) => `message-${chat.length}`

export const sendMessageAtom = atom(null, (get, set, text: string, sentAt: Date) => {
  const chat = get(chatAtom)
  set(chatAtom, [...chat, { author: 'me', id: nextId(chat), sentAt, text: text.trim() }])
})

// Started by the send action rather than the chat screen, so the answer arrives even after leaving the chat.
export const scheduleReply = (store: FlowStore, message: string, onAnswer: (fromPod: boolean) => void) => {
  const answer = answerFor(message)
  if (!answer) return
  store.set(pendingRepliesAtom, store.get(pendingRepliesAtom) + 1)
  setTimeout(() => {
    const chat = store.get(chatAtom)
    store.set(chatAtom, [...chat, { author: 'telli', id: nextId(chat), sentAt: new Date(), textKey: answer.key }])
    store.set(pendingRepliesAtom, store.get(pendingRepliesAtom) - 1)
    onAnswer(answer.fromPod)
  }, TELLI_DELAY_MS)
}
