import { describe, expect, it } from 'vitest'

import { podCategoryIris } from '../../pods/catalog/categories'
import { categoriesWithStructure } from '../../pods/catalog/templates'
import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPet001Flow } from './flow'
import {
  activeSuggestionAtom,
  applySuggestedTemplateAtom,
  chosenCategoryAtom,
  createdPodAtom,
  createPodAtom,
  dismissSuggestionAtom,
  ensurePodAtom,
  podNameAtom,
  roleAtom,
  scenarioStateAtom,
  shouldOfferSuggestionAtom,
} from './model'

const newRun = (initialState?: Parameters<typeof scPet001Flow.createStore>[0]) =>
  resolveFlow(scPet001Flow, null).createStore(initialState)

const runWithPod = (name: string, category: string | null = null) => {
  const store = newRun()
  store.set(podNameAtom, name)
  store.set(chosenCategoryAtom, category)
  store.set(createPodAtom)
  return store
}

describe('SC-PET-001 Create Ginger', () => {
  it('is a registered showcase with the code SC-PET-001 and no variants, listed last', () => {
    expect(scPet001Flow.kind).toBe('showcase')
    expect(scPet001Flow.code).toBe('SC-PET-001')
    expect(scPet001Flow.variants).toBeUndefined()
    expect(scPet001Flow.initialScreen).toBe('home')
    expect(findFlow('sc-pet-001')).toBe(scPet001Flow)
    expect(listFlows().at(-1)).toBe(scPet001Flow)
  })

  it('starts with no name, role, category, pod or template', () => {
    const store = newRun()

    expect(store.get(scenarioStateAtom)).toEqual({ petTemplateApplied: false, podCreated: false, podName: '' })
    expect(store.get(roleAtom)).toBe('')
    expect(store.get(chosenCategoryAtom)).toBeNull()
  })

  it('offers Pets as the only category a pod can be given up front', () => {
    expect(categoriesWithStructure().map((category) => category.label)).toEqual(['Pets'])
  })

  it('creates nothing for a blank name', () => {
    expect(runWithPod('   ').get(createdPodAtom)).toBeNull()
  })

  it('creates one generic pod by name when no category is chosen', () => {
    const store = runWithPod(' Ginger ')
    store.set(roleAtom, 'Owner')
    const pod = store.get(createdPodAtom)
    store.set(podNameAtom, 'Other')
    store.set(createPodAtom)

    expect(store.get(createdPodAtom)).toBe(pod)
    expect(pod).toMatchObject({ breadcrumb: [], category: null, forms: [], memberCount: 1, name: 'Ginger' })
    expect(store.get(scenarioStateAtom)).toEqual({ petTemplateApplied: false, podCreated: true, podName: 'Ginger' })
  })

  it('keeps the entered role on the pod', () => {
    const store = newRun()
    store.set(podNameAtom, 'Ginger')
    store.set(roleAtom, ' Owner ')
    store.set(createPodAtom)

    expect(store.get(createdPodAtom)?.creatorRole).toBe('Owner')
  })

  it('creates the pod with the Pet structure straight away when Pets is chosen', () => {
    const upFront = runWithPod('Ginger', podCategoryIris.pets)
    const suggested = runWithPod('Ginger')
    suggested.set(applySuggestedTemplateAtom)

    expect(upFront.get(scenarioStateAtom).petTemplateApplied).toBe(true)
    expect(upFront.get(activeSuggestionAtom)).toBeNull()
    expect(upFront.get(createdPodAtom)).toMatchObject({
      breadcrumb: suggested.get(createdPodAtom)?.breadcrumb,
      category: suggested.get(createdPodAtom)?.category,
      forms: suggested.get(createdPodAtom)?.forms,
    })
  })

  it('carries the entered name, not a hardcoded Ginger, into the state and the suggestion', () => {
    const store = runWithPod('Luna')

    expect(store.get(scenarioStateAtom).podName).toBe('Luna')
    expect(store.get(activeSuggestionAtom)?.category).toBe(podCategoryIris.pets)
  })

  it('offers the Pets suggestion until it is dismissed', () => {
    const store = runWithPod('Ginger')
    expect(store.get(shouldOfferSuggestionAtom)).toBe(true)

    store.set(dismissSuggestionAtom)
    expect(store.get(shouldOfferSuggestionAtom)).toBe(false)
    expect(store.get(scenarioStateAtom).petTemplateApplied).toBe(false)
  })

  it('applies the Pets template to the existing pod, once', () => {
    const store = runWithPod('Ginger')
    const generic = store.get(createdPodAtom)
    store.set(applySuggestedTemplateAtom)
    const pet = store.get(createdPodAtom)
    store.set(applySuggestedTemplateAtom)

    expect(store.get(createdPodAtom)).toBe(pet)
    expect(pet).toMatchObject({ breadcrumb: ['Pets'], category: podCategoryIris.pets, id: generic?.id, name: 'Ginger' })
    expect(store.get(scenarioStateAtom)).toEqual({ petTemplateApplied: true, podCreated: true, podName: 'Ginger' })
    expect(store.get(activeSuggestionAtom)).toBeNull()
  })

  it('suggests nothing when the run is started without a suggested template', () => {
    const store = newRun({ suggestedTemplate: null })
    store.set(podNameAtom, 'Ginger')
    store.set(createPodAtom)

    expect(store.get(shouldOfferSuggestionAtom)).toBe(false)
  })

  it('creates generic Ginger for a direct link, and only when no pod exists', () => {
    const direct = newRun()
    direct.set(chosenCategoryAtom, podCategoryIris.pets)
    direct.set(ensurePodAtom)
    expect(direct.get(scenarioStateAtom)).toEqual({ petTemplateApplied: false, podCreated: true, podName: 'Ginger' })

    const created = runWithPod('Luna')
    created.set(ensurePodAtom)
    expect(created.get(createdPodAtom)?.name).toBe('Luna')
  })

  it('creates and templates Ginger when the result is opened directly', () => {
    const store = newRun()
    store.set(applySuggestedTemplateAtom)

    expect(store.get(scenarioStateAtom)).toEqual({ petTemplateApplied: true, podCreated: true, podName: 'Ginger' })
  })
})
