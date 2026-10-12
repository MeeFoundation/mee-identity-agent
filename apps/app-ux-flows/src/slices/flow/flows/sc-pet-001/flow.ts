import { createStore as createJotaiStore } from 'jotai'

import { chatComponents } from '@/shared/ui/chat-components'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { podCategoryIris } from '../../pods/catalog/categories'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  categoryFromTelliAtom,
  chosenCategoryAtom,
  conversationAtom,
  createdPodAtom,
  DEFAULT_SUGGESTED_TEMPLATE,
  newPodOriginAtom,
  podNameAtom,
  roleAtom,
  type ScPet001Components,
  type ScPet001InitialState,
  type ScPet001ScreenId,
  suggestedTemplateAtom,
  suggestionDismissedAtom,
  type TelliTurn,
  telliProgressAtom,
  usedActionTurnAtom,
} from './model'
import { HomeScreen } from './screens/home-screen'
import { NewPodScreen } from './screens/new-pod-screen'
import { PodEmptyScreen } from './screens/pod-empty-screen'
import { PodTemplateAppliedScreen } from './screens/pod-template-applied-screen'
import { PodTemplateSuggestedScreen } from './screens/pod-template-suggested-screen'
import { TelliScreen } from './screens/telli-screen'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

const caseKey = (caseId: string, key: string) => `flows.scPet001.cases.${caseId}.${key}`

const caseHints = (caseId: string) => ({
  home: caseKey(caseId, 'hints.home'),
  'new-pod': caseKey(caseId, 'hints.newPod'),
})

const conversationB: readonly TelliTurn[] = [
  {
    action: { draft: { category: podCategoryIris.pets, name: 'Ginger' }, kind: 'create-pod' },
    replyKey: caseKey('b', 'messages.reply'),
    userKey: caseKey('b', 'messages.user'),
  },
]

const conversationC: readonly TelliTurn[] = [
  {
    action: { draft: { category: podCategoryIris.pets }, kind: 'create-pod' },
    replyKey: caseKey('c', 'messages.firstReply'),
    userKey: caseKey('c', 'messages.firstUser'),
  },
  {
    action: { draft: { category: podCategoryIris.pets, name: 'Ginger' }, kind: 'create-pod' },
    replyKey: caseKey('c', 'messages.secondReply'),
    userKey: caseKey('c', 'messages.secondUser'),
  },
]

export const scPet001Flow = defineFlow<ScPet001ScreenId, ScPet001Components, ScPet001InitialState>({
  cases: {
    a: {
      code: 'SC-PET-001-A',
      goalKey: caseKey('a', 'goal'),
      hints: caseHints('a'),
      initialState: { conversation: [] },
      nameKey: caseKey('a', 'name'),
    },
    b: {
      code: 'SC-PET-001-B',
      goalKey: caseKey('b', 'goal'),
      hints: caseHints('b'),
      initialState: { conversation: conversationB },
      nameKey: caseKey('b', 'name'),
    },
    c: {
      code: 'SC-PET-001-C',
      goalKey: caseKey('c', 'goal'),
      hints: caseHints('c'),
      initialState: { conversation: conversationC },
      nameKey: caseKey('c', 'name'),
    },
  },
  code: 'SC-PET-001',
  components: { ...defaultComponents, ...podComponents, ...chatComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(podNameAtom, '')
    store.set(roleAtom, '')
    store.set(chosenCategoryAtom, null)
    store.set(createdPodAtom, null)
    // `null` is a deliberate "suggest nothing", so only a missing value falls back to the default.
    store.set(
      suggestedTemplateAtom,
      initialState?.suggestedTemplate === undefined ? DEFAULT_SUGGESTED_TEMPLATE : initialState.suggestedTemplate,
    )
    store.set(suggestionDismissedAtom, false)
    store.set(conversationAtom, initialState?.conversation ?? [])
    store.set(telliProgressAtom, { stage: 'idle', turn: 0 })
    store.set(usedActionTurnAtom, null)
    store.set(newPodOriginAtom, 'home')
    store.set(categoryFromTelliAtom, false)
    return store
  },
  descriptionKey: 'flows.scPet001.description',
  designFrames: {
    home: figmaFrame('Home - 1', '13-1146'),
    'new-pod': figmaFrame('Home / New Pod (modal)', '868-14331'),
    'pod-empty': figmaFrame('Cell New - 2', '380-14769'),
    telli: figmaFrame('Pod / Chat - 5', '919-30381'),
  },
  goalKey: 'flows.scPet001.goal',
  hints: {
    'pod-empty': 'flows.scPet001.hints.podEmpty',
    'pod-template-suggested': 'flows.scPet001.hints.podTemplateSuggested',
    telli: 'flows.scPet001.hints.telli',
  },
  id: 'sc-pet-001',
  initialScreen: 'home',
  kind: 'showcase',
  screens: {
    home: HomeScreen,
    'new-pod': NewPodScreen,
    'pod-empty': PodEmptyScreen,
    'pod-template-applied': PodTemplateAppliedScreen,
    'pod-template-suggested': PodTemplateSuggestedScreen,
    telli: TelliScreen,
  },
  titleKey: 'flows.scPet001.title',
})
