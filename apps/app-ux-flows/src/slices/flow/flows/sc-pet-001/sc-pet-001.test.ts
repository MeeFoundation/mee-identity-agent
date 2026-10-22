import { createInstance } from 'i18next'
import { Children, type ComponentProps, createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'

import { podCategoryIris } from '../../pods/catalog/categories'
import { categoriesWithStructure } from '../../pods/catalog/templates'
import { findFlow, listFlows } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPet001Flow } from './flow'
import {
  activeSuggestionAtom,
  applyQuickActionAtom,
  applySuggestedTemplateAtom,
  categoryFromTelliAtom,
  chooseCategoryAtom,
  choosePodImageAtom,
  chosenCategoryAtom,
  conversationAtom,
  createdPodAtom,
  createPodAtom,
  createPodFromQuickActionAtom,
  dismissSuggestionAtom,
  ensurePodAtom,
  infoHasDotAtom,
  newPodOriginAtom,
  nextTelliStage,
  nextUserMessageAtom,
  podImageAtom,
  podInfoScreenAtom,
  podNameAtom,
  type ScPet001ScreenId,
  scenarioStateAtom,
  sendNextMessageAtom,
  shouldOfferSuggestionAtom,
  suggestionReadyAtom,
  telliProgressAtom,
} from './model'
import { en } from '@/app/locales/en'
import { HomeTopBar } from '@/shared/ui/home-top-bar'

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

// Renders a screen with its buttons captured, so a test can activate one by its label.
const renderWithButtons = (screenId: ScPet001ScreenId, store: ReturnType<typeof caseRun>, caseId = 'a') => {
  const buttons = new Map<string, () => void>()
  const Button = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
    const label = Children.toArray(children)
      .filter((child) => typeof child === 'string')
      .join('')
    if (label) buttons.set(label, onClick)
    return null
  }
  const InlineSheet = ({ children }: { children: ReactNode }) => children
  const effects = renderScreen(resolveFlow(scPet001Flow, null, caseId), screenId, {
    components: { BottomSheet: InlineSheet, Button },
    store,
  })
  const click = (label: string) => {
    const onClick = buttons.get(label)
    if (!onClick) throw new Error(`No button "${label}"`)
    onClick()
  }
  return { click, effects }
}

const runWithPod = (name: string, category: string | null = null) => {
  const store = newRun()
  store.set(podNameAtom, name)
  store.set(chosenCategoryAtom, category)
  store.set(createPodAtom)
  return store
}

describe('SC-PET-001 Create Ginger', () => {
  it('is a registered showcase with the code SC-PET-001, cases instead of variants, listed before SC-PET-002', () => {
    expect(scPet001Flow.kind).toBe('showcase')
    expect(scPet001Flow.code).toBe('SC-PET-001')
    expect(scPet001Flow.variants).toBeUndefined()
    expect(scPet001Flow.initialScreen).toBe('home')
    expect(findFlow('sc-pet-001')).toBe(scPet001Flow)
    const ids = listFlows().map(({ id }) => id)
    expect(ids[ids.indexOf('sc-pet-001') + 1]).toBe('sc-pet-002')
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
        'pod-notes',
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

  it('declares the Notes tab the pod opens on, with its hint and no design frame', () => {
    const flow = resolveFlow(scPet001Flow, null, 'a')

    expect(Object.keys(flow.screens)).toContain('pod-notes')
    expect(flow.designFrames['pod-notes']).toBeUndefined()
    expect(translate(flow.hints['pod-notes'] ?? '')).toBe(
      'Look around the pod — a dot shows where something is waiting.',
    )
  })

  it('creates generic Ginger for a direct link to the Notes tab, with Info leading to the empty pod', () => {
    const store = newRun()
    store.set(ensurePodAtom)

    expect(store.get(createdPodAtom)).toMatchObject({ category: null, name: 'Ginger' })
    expect(store.get(podInfoScreenAtom)).toBe('pod-empty')
    expect(store.get(shouldOfferSuggestionAtom)).toBe(true)
  })

  it('starts each run with the suggestion not yet ready', () => {
    expect(newRun().get(suggestionReadyAtom)).toBe(false)
  })

  it('references the Telli chat design frame', () => {
    expect(resolveFlow(scPet001Flow, null).designFrames.telli?.name).toBe('Pod / Chat - 5')
  })

  it('leaves Notifications inert on Home and in the Telli chat', () => {
    for (const screenId of ['home', 'telli'] as const) {
      let selectTab: ((tab: string) => void) | undefined
      const effects = renderScreen(resolveFlow(scPet001Flow, null, 'b'), screenId, {
        components: {
          AppTabBar: ({ onSelect }: { onSelect: (tab: string) => void }) => {
            selectTab = onSelect
            return null
          },
        },
      })
      selectTab?.('notifications')

      expect(effects.tracked).toEqual([])
      expect(effects.navigations).toEqual([])
    }
  })

  it('starts with no name, category, pod or template', () => {
    const store = newRun()

    expect(store.get(scenarioStateAtom)).toEqual({
      petTemplateApplied: false,
      podCreated: false,
      podImage: null,
      podName: '',
    })
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
    const pod = store.get(createdPodAtom)
    store.set(podNameAtom, 'Other')
    store.set(createPodAtom)

    expect(store.get(createdPodAtom)).toBe(pod)
    expect(pod).toMatchObject({ breadcrumb: [], category: null, forms: [], memberCount: 1, name: 'Ginger' })
    expect(store.get(scenarioStateAtom)).toEqual({
      petTemplateApplied: false,
      podCreated: true,
      podImage: null,
      podName: 'Ginger',
    })
  })

  it('records no creator role on the pod', () => {
    expect(runWithPod('Ginger').get(createdPodAtom)).not.toHaveProperty('creatorRole')
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
    expect(store.get(scenarioStateAtom)).toEqual({
      petTemplateApplied: true,
      podCreated: true,
      podImage: null,
      podName: 'Ginger',
    })
    expect(store.get(activeSuggestionAtom)).toBeNull()
  })

  it('suggests nothing when the run is started without a suggested template', () => {
    const store = newRun({ suggestedTemplate: null })
    store.set(podNameAtom, 'Ginger')
    store.set(createPodAtom)

    expect(store.get(shouldOfferSuggestionAtom)).toBe(false)
  })

  it('marks the Info tab only once the suggestion is ready, and routes Info to it', () => {
    const store = runWithPod('Ginger')
    expect(store.get(infoHasDotAtom)).toBe(false)
    expect(store.get(podInfoScreenAtom)).toBe('pod-empty')

    store.set(suggestionReadyAtom, true)
    expect(store.get(infoHasDotAtom)).toBe(true)
    expect(store.get(podInfoScreenAtom)).toBe('pod-template-suggested')
  })

  it('clears the dot and the suggestion route once the suggestion is dismissed', () => {
    const store = runWithPod('Ginger')
    store.set(suggestionReadyAtom, true)
    store.set(dismissSuggestionAtom)

    expect(store.get(infoHasDotAtom)).toBe(false)
    expect(store.get(podInfoScreenAtom)).toBe('pod-empty')
  })

  it('routes Info to the Pet structure once the template is applied, without a dot', () => {
    const suggested = runWithPod('Ginger')
    suggested.set(suggestionReadyAtom, true)
    suggested.set(applySuggestedTemplateAtom)
    const upFront = runWithPod('Ginger', podCategoryIris.pets)

    for (const store of [suggested, upFront]) {
      expect(store.get(infoHasDotAtom)).toBe(false)
      expect(store.get(podInfoScreenAtom)).toBe('pod-template-applied')
    }
  })

  it('never marks Info when the run suggests no template', () => {
    const store = newRun({ suggestedTemplate: null })
    store.set(podNameAtom, 'Ginger')
    store.set(createPodAtom)
    store.set(suggestionReadyAtom, true)

    expect(store.get(infoHasDotAtom)).toBe(false)
    expect(store.get(podInfoScreenAtom)).toBe('pod-empty')
  })

  it('creates generic Ginger for a direct link, and only when no pod exists', () => {
    const direct = newRun()
    direct.set(chosenCategoryAtom, podCategoryIris.pets)
    direct.set(ensurePodAtom)
    expect(direct.get(scenarioStateAtom)).toEqual({
      petTemplateApplied: false,
      podCreated: true,
      podImage: null,
      podName: 'Ginger',
    })

    const created = runWithPod('Luna')
    created.set(ensurePodAtom)
    expect(created.get(createdPodAtom)?.name).toBe('Luna')
  })

  describe('profile image and pod-created', () => {
    it('declares pod-created with its frame and no hint, and the New Pod frame with the image field', () => {
      const flow = resolveFlow(scPet001Flow, null, 'a')

      expect(Object.keys(flow.screens)).toContain('pod-created')
      expect(flow.designFrames['pod-created']?.url).toContain('node-id=1435-44400')
      expect(flow.designFrames['new-pod']?.url).toContain('node-id=905-15244')
      expect(flow.hints['pod-created']).toBeUndefined()
    })

    it('creates the pod with the chosen image as its avatar', () => {
      const store = newRun()
      store.set(choosePodImageAtom, 'blob:ginger')
      store.set(podNameAtom, 'Ginger')
      store.set(createPodAtom)

      expect(store.get(createdPodAtom)).toMatchObject({ avatarLetter: 'G', avatarSrc: 'blob:ginger' })
      expect(store.get(scenarioStateAtom).podImage).toBe('blob:ginger')
    })

    it('keeps the letter avatar when no image was chosen', () => {
      expect(runWithPod('Ginger').get(createdPodAtom)).not.toHaveProperty('avatarSrc')
    })

    it('does not make the image count towards creating the pod', () => {
      const store = newRun()
      store.set(choosePodImageAtom, 'blob:ginger')
      store.set(createPodAtom)

      expect(store.get(createdPodAtom)).toBeNull()
      expect(store.get(podImageAtom)).toBe('blob:ginger')
    })

    it('shows pod-created after Create Pod in the sheet', () => {
      const store = newRun()
      store.set(podNameAtom, 'Ginger')
      const sheet = renderWithButtons('new-pod', store)
      sheet.click('Create Pod')

      expect(store.get(createdPodAtom)?.name).toBe('Ginger')
      expect(sheet.effects.navigations).toEqual(['pod-created'])
    })

    it('shows pod-created after Create pod on a named quick action, and Open pod later goes to Notes', () => {
      const store = caseRun('b')
      playTurns(store, 1)
      const actions: (() => void)[] = []
      const ChatActionCard = ({ action }: { action: { onAction: () => void } }) => {
        actions.push(action.onAction)
        return null
      }
      const telli = renderScreen(resolveFlow(scPet001Flow, null, 'b'), 'telli', {
        components: { ChatActionCard },
        store,
      })
      actions[0]?.()

      expect(store.get(createdPodAtom)?.category).toBe(podCategoryIris.pets)
      expect(telli.navigations).toEqual(['pod-created'])

      actions.length = 0
      const again = renderScreen(resolveFlow(scPet001Flow, null, 'b'), 'telli', {
        components: { ChatActionCard },
        store,
      })
      actions[0]?.()
      expect(again.navigations).toEqual(['pod-notes'])
    })

    it('offers Open pod on every card once the pod exists, even when it was created elsewhere', () => {
      const store = caseRun('c')
      playTurns(store, 2)
      store.set(podNameAtom, 'Ginger')
      store.set(createPodAtom)
      const cardActions: { label: string; onAction: () => void; disabled?: boolean }[] = []
      const ChatActionCard = ({ action }: { action: { label: string; onAction: () => void; disabled?: boolean } }) => {
        cardActions.push(action)
        return null
      }
      const telli = renderScreen(resolveFlow(scPet001Flow, null, 'c'), 'telli', {
        components: { ChatActionCard },
        store,
      })

      expect(cardActions.map(({ disabled, label }) => ({ disabled, label }))).toEqual([
        { disabled: undefined, label: 'Open pod' },
        { disabled: undefined, label: 'Open pod' },
      ])
      cardActions[0]?.onAction()
      expect(telli.navigations).toEqual(['pod-notes'])
    })

    it('leaves pod-created for the pod, by Go to, without completing the run itself', () => {
      const store = runWithPod('Ginger', podCategoryIris.pets)
      const sheet = renderWithButtons('pod-created', store)
      sheet.click('Go to Ginger')

      expect(sheet.effects).toMatchObject({ completed: false, navigations: ['pod-notes'] })
    })

    it('creates generic Ginger for a direct link to pod-created', () => {
      const store = newRun()
      store.set(ensurePodAtom)

      expect(store.get(createdPodAtom)).toMatchObject({ category: null, name: 'Ginger' })
    })
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

    it('fills the sheet from each card’s own draft', () => {
      const store = caseRun('c')
      playTurns(store, 2)
      store.set(podNameAtom, 'Typed')

      store.set(applyQuickActionAtom, 0)
      expect(store.get(podNameAtom)).toBe('')
      expect(store.get(chosenCategoryAtom)).toBe(podCategoryIris.pets)
      expect(store.get(categoryFromTelliAtom)).toBe(true)
      expect(store.get(newPodOriginAtom)).toBe('telli')

      store.set(applyQuickActionAtom, 1)
      expect(store.get(podNameAtom)).toBe('Ginger')
    })

    it('drops the Telli caption once the category is changed', () => {
      const store = caseRun('b')
      playTurns(store, 1)
      store.set(applyQuickActionAtom, 0)
      store.set(chooseCategoryAtom, null)

      expect(store.get(categoryFromTelliAtom)).toBe(false)
      expect(store.get(chosenCategoryAtom)).toBeNull()
    })

    it('creates the pod straight from a card that names it', () => {
      const store = caseRun('b')
      playTurns(store, 1)
      store.set(createPodFromQuickActionAtom, 0)

      expect(store.get(createdPodAtom)).toMatchObject({
        category: podCategoryIris.pets,
        name: 'Ginger',
      })
    })

    it('creates nothing straight from a card without a name', () => {
      const store = caseRun('c')
      playTurns(store, 1)
      store.set(createPodFromQuickActionAtom, 0)

      expect(store.get(createdPodAtom)).toBeNull()
    })

    it('applies no quick action once the pod exists', () => {
      const store = caseRun('c')
      playTurns(store, 2)
      store.set(applyQuickActionAtom, 1)
      store.set(createPodAtom)
      store.set(applyQuickActionAtom, 0)

      expect(store.get(podNameAtom)).toBe('Ginger')
      expect(store.get(createdPodAtom)).toMatchObject({ category: podCategoryIris.pets, name: 'Ginger' })
    })
  })

  it('creates and templates Ginger when the result is opened directly', () => {
    const store = newRun()
    store.set(applySuggestedTemplateAtom)

    expect(store.get(scenarioStateAtom)).toEqual({
      petTemplateApplied: true,
      podCreated: true,
      podImage: null,
      podName: 'Ginger',
    })
  })

  it('shows the Home top bar on home, with a search field that does nothing', () => {
    let topBar: ComponentProps<typeof HomeTopBar> | undefined
    const effects = renderScreen(resolveFlow(scPet001Flow, null), 'home', {
      components: {
        HomeTopBar: (props: ComponentProps<typeof HomeTopBar>) => {
          topBar = props
          return null
        },
      },
    })
    if (!topBar) throw new Error('home did not render the Home top bar')

    const i18n = createInstance()
    i18n.init({ initAsync: false, lng: 'en', resources: { en: { translation: en } } })
    const markup = renderToStaticMarkup(createElement(I18nextProvider, { i18n }, createElement(HomeTopBar, topBar)))

    expect(markup).toContain('<h1 class="font-semibold text-gray-900 text-xl">Welcome, Alice</h1>')
    expect(markup).toContain('Device-to-device sharing, pod members only.')
    expect(markup).toMatch(/<button[^>]*type="button"[^>]*>.*Search, or ask Telli…<\/span><\/button>/)
    expect(topBar.onSearchSelect).toBeUndefined()
    expect(effects.navigations).toEqual([])
  })
})
