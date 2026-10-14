import { atom } from 'jotai'

import type { ChatComponents } from '@/shared/ui/chat-components'
import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

import { podCategoryIris } from '../../pods/catalog/categories'
import { applyTemplate, createPodFromTemplate, type PodInstance } from '../../pods/catalog/create-pod'
import { findSuggestion, type TemplateSuggestion } from '../../pods/catalog/suggestions'

export type ScPet001ScreenId =
  | 'home'
  | 'telli'
  | 'new-pod'
  | 'pod-created'
  | 'pod-notes'
  | 'pod-empty'
  | 'pod-template-suggested'
  | 'pod-template-applied'

export type ScPet001Components = DefaultComponents & PodComponents & ChatComponents

// What Telli understood so far; each field is optional because a card may come before Telli knows it.
type PodDraft = {
  name?: string
  category?: string
}

export type QuickAction = {
  kind: 'create-pod'
  draft: PodDraft
}

// One scripted exchange: the tester's prepared message, Telli's reply, and optionally a card on that reply.
export type TelliTurn = {
  userKey: string
  replyKey: string
  replyValues?: Record<string, string>
  action?: QuickAction
}

export type ScPet001InitialState = {
  // The category whose template the pod suggests; `null` suggests nothing.
  suggestedTemplate?: string | null
  conversation?: readonly TelliTurn[]
}

export type ScenarioState = {
  podName: string
  // The chosen profile image as an object URL, or `null`.
  podImage: string | null
  podCreated: boolean
  petTemplateApplied: boolean
}

export const DEFAULT_SUGGESTED_TEMPLATE = podCategoryIris.pets

const DEFAULT_POD_NAME = 'Ginger'

export const canCreatePod = (name: string) => name.trim() !== ''

// The New Pod sheet's fields as entered; the created pod keeps its own trimmed copies.
export const podNameAtom = atom('')

// The sheet's optional category; `null` creates a generic pod.
export const chosenCategoryAtom = atom<string | null>(null)

// The sheet's optional profile image, an object URL that lives only as long as the page.
export const podImageAtom = atom<string | null>(null)

// The one record every pod screen renders.
export const createdPodAtom = atom<PodInstance | null>(null)

export const suggestedTemplateAtom = atom<string | null>(DEFAULT_SUGGESTED_TEMPLATE)

export const suggestionDismissedAtom = atom(false)

// Set per case through the initial state; the Telli screen plays whatever it holds.
export const conversationAtom = atom<readonly TelliTurn[]>([])

type TelliStage = 'idle' | 'sending' | 'thinking'

// `turn` counts the finished turns; the stage belongs to the turn after them.
export type TelliProgress = {
  turn: number
  stage: TelliStage
}

export const telliProgressAtom = atom<TelliProgress>({ stage: 'idle', turn: 0 })

// The turn whose card opened the New Pod sheet, so only that card offers "Open pod" afterwards.
export const usedActionTurnAtom = atom<number | null>(null)

export type NewPodOrigin = 'home' | 'telli'

export const newPodOriginAtom = atom<NewPodOrigin>('home')

// Whether the sheet's category is the one a quick action provided.
export const categoryFromTelliAtom = atom(false)

const SEND_DELAY_MS = 800
const TELLI_THINKING_MS = 2500

// The timed steps after sending, as in `chat-add-medication`: "Sent" after 0.8 s, Telli's reply 2.5 s later.
export const nextTelliStage = (progress: TelliProgress): { progress: TelliProgress; afterMs: number } | null => {
  if (progress.stage === 'sending') return { afterMs: SEND_DELAY_MS, progress: { ...progress, stage: 'thinking' } }
  if (progress.stage === 'thinking')
    return { afterMs: TELLI_THINKING_MS, progress: { stage: 'idle', turn: progress.turn + 1 } }
  return null
}

// The tester's next prepared message, if the conversation has one and Telli is not busy.
export const nextUserMessageAtom = atom<TelliTurn | null>((get) => {
  const progress = get(telliProgressAtom)
  if (progress.stage !== 'idle') return null
  return get(conversationAtom)[progress.turn] ?? null
})

export const sendNextMessageAtom = atom(null, (get, set) => {
  if (!get(nextUserMessageAtom)) return
  set(telliProgressAtom, { ...get(telliProgressAtom), stage: 'sending' })
})

export const openNewPodFromHomeAtom = atom(null, (_get, set) => set(newPodOriginAtom, 'home'))

// Fills the sheet from one card's own draft: name and category replaced. Nothing once the pod exists.
export const applyQuickActionAtom = atom(null, (get, set, turn: number) => {
  const action = get(conversationAtom)[turn]?.action
  if (get(createdPodAtom) || action?.kind !== 'create-pod') return
  set(podNameAtom, action.draft.name ?? '')
  set(chosenCategoryAtom, action.draft.category ?? null)
  set(categoryFromTelliAtom, action.draft.category !== undefined)
  set(newPodOriginAtom, 'telli')
  set(usedActionTurnAtom, turn)
})

// Replaces the chosen image, releasing the previous one unless the created pod shows it.
export const choosePodImageAtom = atom(null, (get, set, src: string) => {
  const previous = get(podImageAtom)
  if (previous && previous !== get(createdPodAtom)?.avatarSrc) URL.revokeObjectURL(previous)
  set(podImageAtom, src)
})

export const chooseCategoryAtom = atom(null, (_get, set, category: string | null) => {
  set(chosenCategoryAtom, category)
  set(categoryFromTelliAtom, false)
})

export const scenarioStateAtom = atom<ScenarioState>((get) => {
  const pod = get(createdPodAtom)
  return {
    petTemplateApplied: pod?.category === podCategoryIris.pets,
    podCreated: pod !== null,
    podImage: get(podImageAtom),
    podName: pod?.name ?? get(podNameAtom),
  }
})

// The suggestion that fits the pod as it is now: none once the pod has a category.
export const activeSuggestionAtom = atom<TemplateSuggestion | null>((get) => {
  const pod = get(createdPodAtom)
  const category = get(suggestedTemplateAtom)
  if (!pod || pod.category !== null || !category) return null
  return findSuggestion(category) ?? null
})

export const shouldOfferSuggestionAtom = atom(
  (get) => get(activeSuggestionAtom) !== null && !get(suggestionDismissedAtom),
)

// Set once the pod has been on screen long enough for the suggestion to arrive; it then waits on the Info tab.
export const suggestionReadyAtom = atom(false)

export const infoHasDotAtom = atom((get) => get(suggestionReadyAtom) && get(shouldOfferSuggestionAtom))

type PodInfoScreenId = Extract<ScPet001ScreenId, 'pod-empty' | 'pod-template-suggested' | 'pod-template-applied'>

// What the Info tab shows for the pod as it is now.
export const podInfoScreenAtom = atom<PodInfoScreenId>((get) => {
  if (get(createdPodAtom)?.category) return 'pod-template-applied'
  return get(infoHasDotAtom) ? 'pod-template-suggested' : 'pod-empty'
})

// Creates at most one pod per run. A chosen category is applied through its template, as if suggested later.
export const createPodAtom = atom(null, (get, set) => {
  const name = get(podNameAtom)
  if (get(createdPodAtom) || !canCreatePod(name)) return
  const pod = createPodFromTemplate({ avatarSrc: get(podImageAtom) ?? undefined, name })
  const category = get(chosenCategoryAtom)
  set(createdPodAtom, category ? applyTemplate(pod, category) : pod)
})

// A card that already names the pod needs no sheet: the chat was the confirmation, so it creates the pod at once.
export const canCreateFromDraft = (draft: PodDraft) => canCreatePod(draft.name ?? '')

export const createPodFromQuickActionAtom = atom(null, (get, set, turn: number) => {
  const action = get(conversationAtom)[turn]?.action
  if (!action || !canCreateFromDraft(action.draft)) return
  set(applyQuickActionAtom, turn)
  set(createPodAtom)
})

// Pod screens call this, so a direct link still has a pod: generic Ginger, as if the tester had created her.
export const ensurePodAtom = atom(null, (get, set) => {
  if (get(createdPodAtom)) return
  set(podNameAtom, DEFAULT_POD_NAME)
  set(chosenCategoryAtom, null)
  set(createPodAtom)
})

export const applySuggestedTemplateAtom = atom(null, (get, set) => {
  set(ensurePodAtom)
  const pod = get(createdPodAtom)
  const category = get(suggestedTemplateAtom)
  if (pod && category) set(createdPodAtom, applyTemplate(pod, category))
})

export const dismissSuggestionAtom = atom(null, (_get, set) => set(suggestionDismissedAtom, true))
