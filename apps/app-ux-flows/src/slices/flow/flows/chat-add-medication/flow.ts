import { createStore as createJotaiStore } from 'jotai'

import { chatComponents } from '@/shared/ui/chat-components'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { gingerMedication, gingerPod, medicationAtom, medicationFormAddedAtom, podAtom } from '../../pods/ginger/model'
import { noteTextAtom } from '../../pods/notes/model'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  type ChatAddMedicationComponents,
  type ChatAddMedicationInitialState,
  type ChatAddMedicationScreenId,
  chatStageAtom,
} from './model'
import { ChatScreen } from './screens/chat-screen'
import { GingerInfoScreen } from './screens/ginger-info-screen'
import { GingerNotesScreen } from './screens/ginger-notes-screen'
import { MedicationAddedScreen } from './screens/medication-added-screen'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

export const chatAddMedicationFlow = defineFlow<
  ChatAddMedicationScreenId,
  ChatAddMedicationComponents,
  ChatAddMedicationInitialState
>({
  components: { ...defaultComponents, ...podComponents, ...chatComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(podAtom, initialState?.pod ?? gingerPod)
    store.set(medicationAtom, initialState?.medication ?? gingerMedication)
    store.set(medicationFormAddedAtom, false)
    store.set(noteTextAtom, '')
    store.set(chatStageAtom, 'draft')
    return store
  },
  descriptionKey: 'flows.chatAddMedication.description',
  designFrames: {
    chat: figmaFrame('EXP-PET-002-C - Telli suggests adding medication', '1203-26045'),
    'ginger-notes': figmaFrame('EXP-PET-002-B - Ginger (notes)', '1212-28435'),
    'medication-added': figmaFrame('EXP-PET-002-C - Medication added', '1203-26069'),
  },
  id: 'chat-add-medication',
  initialScreen: 'ginger-notes',
  kind: 'showcase',
  screens: {
    chat: ChatScreen,
    'ginger-info': GingerInfoScreen,
    'ginger-notes': GingerNotesScreen,
    'medication-added': MedicationAddedScreen,
  },
  titleKey: 'flows.chatAddMedication.title',
})
