import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  chosenCategoryAtom,
  createdPodAtom,
  DEFAULT_SUGGESTED_TEMPLATE,
  podNameAtom,
  roleAtom,
  type ScPet001Components,
  type ScPet001InitialState,
  type ScPet001ScreenId,
  suggestedTemplateAtom,
  suggestionDismissedAtom,
} from './model'
import { HomeScreen } from './screens/home-screen'
import { NewPodScreen } from './screens/new-pod-screen'
import { PodEmptyScreen } from './screens/pod-empty-screen'
import { PodTemplateAppliedScreen } from './screens/pod-template-applied-screen'
import { PodTemplateSuggestedScreen } from './screens/pod-template-suggested-screen'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

export const scPet001Flow = defineFlow<ScPet001ScreenId, ScPet001Components, ScPet001InitialState>({
  code: 'SC-PET-001',
  components: { ...defaultComponents, ...podComponents },
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
    return store
  },
  descriptionKey: 'flows.scPet001.description',
  designFrames: {
    home: figmaFrame('Home - 1', '13-1146'),
    'new-pod': figmaFrame('Home / New Pod (modal)', '868-14331'),
    'pod-empty': figmaFrame('Cell New - 2', '380-14769'),
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
  },
  titleKey: 'flows.scPet001.title',
})
