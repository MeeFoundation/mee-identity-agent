import { atom } from 'jotai'

import type { GingerPodComponents, MedicationRecord, Pod } from '../../pods/ginger/model'
import type { ChatComponents } from '@/shared/ui/chat-components'

export type ChatAddMedicationScreenId = 'ginger-notes' | 'chat' | 'ginger-info' | 'medication-added'

export type ChatAddMedicationComponents = GingerPodComponents & ChatComponents

export type ChatAddMedicationInitialState = {
  pod?: Pod
  medication?: MedicationRecord
}

// The scripted exchange only moves forward: drafted, sending, Telli typing, then Telli's reply.
type ChatStage = 'draft' | 'sending' | 'typing' | 'replied'

export const chatStageAtom = atom<ChatStage>('draft')

export const sendMessageAtom = atom(null, (get, set) => {
  if (get(chatStageAtom) === 'draft') set(chatStageAtom, 'sending')
})

const SEND_DELAY_MS = 800
const TELLI_TYPING_MS = 2500

// The timed steps after sending, about 3.3 seconds in total so the reply feels like a real round trip.
export const nextStage = (stage: ChatStage): { stage: ChatStage; afterMs: number } | null => {
  if (stage === 'sending') return { afterMs: SEND_DELAY_MS, stage: 'typing' }
  if (stage === 'typing') return { afterMs: TELLI_TYPING_MS, stage: 'replied' }
  return null
}
