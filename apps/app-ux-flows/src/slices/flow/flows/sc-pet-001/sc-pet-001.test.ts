import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { podCategoryIris } from '../../pods/catalog/categories'
import { categoriesWithStructure } from '../../pods/catalog/templates'
import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPet001Flow } from './flow'
import {
  activeSuggestionAtom,
  applyQuickActionAtom,
  applySuggestedTemplateAtom,
  categoryFromTelliAtom,
  chooseCategoryAtom,
  chosenCategoryAtom,
  conversationAtom,
  createdPodAtom,
  createPodAtom,
  createPodFromQuickActionAtom,
  dismissSuggestionAtom,
  ensurePodAtom,
  newPodOriginAtom,
  nextTelliStage,
  nextUserMessageAtom,
  podNameAtom,
  roleAtom,
  scenarioStateAtom,
  sendNextMessageAtom,
  shouldOfferSuggestionAtom,
  telliProgressAtom,
  usedActionTurnAtom,
} from './model'

// Resolves an i18next key such as `flows.scPet001.goal` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPet001Flow, null, caseId).createStore()

// Plays turns to completion without timers, as the Telli screen does after each delay.
const playTurns = (store: ReturnType<typeof caseRun>, turns: number) => {
  for (let played = 0; played < turns; played++) {
    store.set(sendNextMessageAtom)
    let next = nextTelliStage(store.get(telliProgressAtom))
    while (next) {
      store.set(telliProgressAtom, next.progress)
      next = nextTelliStage(next.progress)
    }
  }
}

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
  it('is a registered showcase with the code SC-PET-001, cases instead of variants, listed last', () => {
    expect(scPet001Flow.kind).toBe('showcase')
    expect(scPet001Flow.code).toBe('SC-PET-001')
    expect(scPet001Flow.variants).toBeUndefined()
    expect(scPet001Flow.initialScreen).toBe('home')
    expect(findFlow('sc-pet-001')).toBe(scPet001Flow)
    expect(listFlows().at(-1)).toBe(scPet001Flow)
    expect(resolveFlow(scPet001Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PET-001-A'],
      ['b', 'SC-PET-001-B'],
      ['c', 'SC-PET-001-C'],
    ])
  })

  it('briefs every case with its own goal, translated, and per-case hints for home and new-pod', () => {
    const goals = new Set<string>()
    for (const { id } of resolveFlow(scPet001Flow, null).cases) {
      const resolved = resolveFlow(scPet001Flow, null, id)
      expect(resolved.goalKey).not.toBe('flows.scPet001.goal')
      expect(typeof translate(resolved.goalKey ?? '')).toBe('string')
      expect(typeof translate(resolved.caseNameKey ?? '')).toBe('string')
      goals.add(resolved.goalKey ?? '')

      expect(Object.keys(resolved.hints).sort()).toEqual([
        'home',
        'new-pod',
        'pod-empty',
        'pod-template-suggested',
        'telli',
      ])
      for (const hintKey of Object.values(resolved.hints)) expect(typeof translate(hintKey ?? '')).toBe('string')
    }
    expect(goals.size).toBe(3)
    expect(translate(resolveFlow(scPet001Flow, null, 'b').hints.home ?? '')).toBe('Open Ask Telli from the bottom bar.')
  })

  it('gives each case its own conversation, with every message translated', () => {
    expect(caseRun('a').get(conversationAtom)).toEqual([])

    const b = caseRun('b').get(conversationAtom)
    expect(b.map((turn) => turn.action?.draft)).toEqual([{ category: podCategoryIris.pets, name: 'Ginger' }])

    const c = caseRun('c').get(conversationAtom)
    expect(c.map((turn) => turn.action?.draft)).toEqual([
      { category: podCategoryIris.pets },
      { category: podCategoryIris.pets, name: 'Ginger' },
    ])

    for (const turn of [...b, ...c]) {
      expect(typeof translate(turn.userKey)).toBe('string')
      expect(typeof translate(turn.replyKey)).toBe('string')
    }
  })

  it('references the Telli chat design frame', () => {
    expect(resolveFlow(scPet001Flow, null).designFrames.telli?.name).toBe('Pod / Chat - 5')
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

  describe('Telli conversation', () => {
    it('sends only when idle and a next message exists', () => {
      const a = caseRun('a')
      a.set(sendNextMessageAtom)
      expect(a.get(telliProgressAtom)).toEqual({ stage: 'idle', turn: 0 })

      const b = caseRun('b')
      b.set(sendNextMessageAtom)
      expect(b.get(telliProgressAtom)).toEqual({ stage: 'sending', turn: 0 })
      b.set(telliProgressAtom, { stage: 'thinking', turn: 0 })
      b.set(sendNextMessageAtom)
      expect(b.get(telliProgressAtom)).toEqual({ stage: 'thinking', turn: 0 })
    })

    it('moves from sending to thinking to the reply in order, then waits', () => {
      expect(nextTelliStage({ stage: 'idle', turn: 0 })).toBeNull()
      expect(nextTelliStage({ stage: 'sending', turn: 1 })).toEqual({
        afterMs: 800,
        progress: { stage: 'thinking', turn: 1 },
      })
      expect(nextTelliStage({ stage: 'thinking', turn: 1 })).toEqual({
        afterMs: 2500,
        progress: { stage: 'idle', turn: 2 },
      })
    })

    it('prepares the next message after each reply, and none at the end', () => {
      const store = caseRun('c')
      expect(store.get(nextUserMessageAtom)?.userKey).toBe('flows.scPet001.cases.c.messages.firstUser')
      playTurns(store, 1)
      expect(store.get(nextUserMessageAtom)?.userKey).toBe('flows.scPet001.cases.c.messages.secondUser')
      playTurns(store, 1)
      expect(store.get(telliProgressAtom)).toEqual({ stage: 'idle', turn: 2 })
      expect(store.get(nextUserMessageAtom)).toBeNull()
    })

    it('fills the sheet from each card’s own draft and keeps the role', () => {
      const store = caseRun('c')
      playTurns(store, 2)
      store.set(roleAtom, 'Owner')
      store.set(podNameAtom, 'Typed')

      store.set(applyQuickActionAtom, 0)
      expect(store.get(podNameAtom)).toBe('')
      expect(store.get(chosenCategoryAtom)).toBe(podCategoryIris.pets)
      expect(store.get(roleAtom)).toBe('Owner')
      expect(store.get(categoryFromTelliAtom)).toBe(true)
      expect(store.get(newPodOriginAtom)).toBe('telli')
      expect(store.get(usedActionTurnAtom)).toBe(0)

      store.set(applyQuickActionAtom, 1)
      expect(store.get(podNameAtom)).toBe('Ginger')
      expect(store.get(usedActionTurnAtom)).toBe(1)
    })

    it('drops the Telli caption once the category is changed', () => {
      const store = caseRun('b')
      playTurns(store, 1)
      store.set(applyQuickActionAtom, 0)
      store.set(chooseCategoryAtom, null)

      expect(store.get(categoryFromTelliAtom)).toBe(false)
      expect(store.get(chosenCategoryAtom)).toBeNull()
    })

    it('creates the pod straight from a card that names it, keeping the role', () => {
      const store = caseRun('b')
      playTurns(store, 1)
      store.set(roleAtom, 'Owner')
      store.set(createPodFromQuickActionAtom, 0)

      expect(store.get(createdPodAtom)).toMatchObject({
        category: podCategoryIris.pets,
        creatorRole: 'Owner',
        name: 'Ginger',
      })
      expect(store.get(usedActionTurnAtom)).toBe(0)
    })

    it('creates nothing straight from a card without a name', () => {
      const store = caseRun('c')
      playTurns(store, 1)
      store.set(createPodFromQuickActionAtom, 0)

      expect(store.get(createdPodAtom)).toBeNull()
      expect(store.get(usedActionTurnAtom)).toBeNull()
    })

    it('applies no quick action once the pod exists', () => {
      const store = caseRun('c')
      playTurns(store, 2)
      store.set(applyQuickActionAtom, 1)
      store.set(createPodAtom)
      store.set(applyQuickActionAtom, 0)

      expect(store.get(usedActionTurnAtom)).toBe(1)
      expect(store.get(podNameAtom)).toBe('Ginger')
      expect(store.get(createdPodAtom)).toMatchObject({ category: podCategoryIris.pets, name: 'Ginger' })
    })
  })

  it('creates and templates Ginger when the result is opened directly', () => {
    const store = newRun()
    store.set(applySuggestedTemplateAtom)

    expect(store.get(scenarioStateAtom)).toEqual({ petTemplateApplied: true, podCreated: true, podName: 'Ginger' })
  })
})
