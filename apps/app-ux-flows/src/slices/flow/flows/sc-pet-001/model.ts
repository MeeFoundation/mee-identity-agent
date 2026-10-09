import { atom } from 'jotai'

import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

import { podCategoryIris } from '../../pods/catalog/categories'
import { applyTemplate, createPodFromTemplate, type PodInstance } from '../../pods/catalog/create-pod'
import { findSuggestion, type TemplateSuggestion } from '../../pods/catalog/suggestions'

export type ScPet001ScreenId = 'home' | 'new-pod' | 'pod-empty' | 'pod-template-suggested' | 'pod-template-applied'

export type ScPet001Components = DefaultComponents & PodComponents

export type ScPet001InitialState = {
  // The category whose template the pod suggests; `null` suggests nothing.
  suggestedTemplate?: string | null
}

export type ScenarioState = {
  podName: string
  podCreated: boolean
  petTemplateApplied: boolean
}

export const DEFAULT_SUGGESTED_TEMPLATE = podCategoryIris.pets

const DEFAULT_POD_NAME = 'Ginger'

export const canCreatePod = (name: string) => name.trim() !== ''

// The New Pod sheet's fields as entered; the created pod keeps its own trimmed copies.
export const podNameAtom = atom('')

export const roleAtom = atom('')

// The sheet's optional category; `null` creates a generic pod.
export const chosenCategoryAtom = atom<string | null>(null)

// The one record every pod screen renders.
export const createdPodAtom = atom<PodInstance | null>(null)

export const suggestedTemplateAtom = atom<string | null>(DEFAULT_SUGGESTED_TEMPLATE)

export const suggestionDismissedAtom = atom(false)

export const scenarioStateAtom = atom<ScenarioState>((get) => {
  const pod = get(createdPodAtom)
  return {
    petTemplateApplied: pod?.category === podCategoryIris.pets,
    podCreated: pod !== null,
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

// Creates at most one pod per run. A chosen category is applied through its template, as if suggested later.
export const createPodAtom = atom(null, (get, set) => {
  const name = get(podNameAtom)
  if (get(createdPodAtom) || !canCreatePod(name)) return
  const pod = createPodFromTemplate({ name, role: get(roleAtom) })
  const category = get(chosenCategoryAtom)
  set(createdPodAtom, category ? applyTemplate(pod, category) : pod)
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
