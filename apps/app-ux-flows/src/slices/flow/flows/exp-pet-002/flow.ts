import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { gingerMedication, gingerPod, medicationAtom, medicationFormAddedAtom, podAtom } from '../../pods/ginger/model'
import { noteTextAtom } from '../../pods/notes/model'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  type ExpPet002Components,
  type ExpPet002InitialState,
  type ExpPet002ScreenId,
  sheetOriginAtom,
  showAiSuggestionAtom,
} from './model'
import { AddFormScreen } from './screens/add-form-screen'
import { GingerInfoScreen } from './screens/ginger-info-screen'
import { GingerNotesScreen } from './screens/ginger-notes-screen'
import { MedicalScreen } from './screens/medical-screen'
import { MedicationAddedScreen } from './screens/medication-added-screen'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

export const expPet002Flow = defineFlow<ExpPet002ScreenId, ExpPet002Components, ExpPet002InitialState>({
  code: 'EXP-PET-002',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(podAtom, initialState?.pod ?? gingerPod)
    store.set(medicationAtom, initialState?.medication ?? gingerMedication)
    store.set(medicationFormAddedAtom, false)
    store.set(showAiSuggestionAtom, initialState?.showAiSuggestion ?? false)
    store.set(sheetOriginAtom, 'ginger-info')
    store.set(noteTextAtom, '')
    return store
  },
  descriptionKey: 'flows.expPet002.description',
  designFrames: {
    'add-form': figmaFrame('EXP-PET-002-A - Add medication (modal)', '1213-28668'),
    'ginger-info': figmaFrame('EXP-PET-002-A - Ginger (info, with Medical)', '1203-25805'),
    'ginger-notes': figmaFrame('EXP-PET-002-A - Ginger (notes)', '1213-29157'),
    medical: figmaFrame('EXP-PET-002-A - Medical (empty)', '1203-25845'),
    'medication-added': figmaFrame('EXP-PET-002-A - Medication added', '1213-28891'),
  },
  id: 'exp-pet-002',
  initialScreen: 'ginger-notes',
  kind: 'experiment',
  screens: {
    'add-form': AddFormScreen,
    'ginger-info': GingerInfoScreen,
    'ginger-notes': GingerNotesScreen,
    medical: MedicalScreen,
    'medication-added': MedicationAddedScreen,
  },
  titleKey: 'flows.expPet002.title',
  variantSelection: 'explicit',
  variants: {
    a: {
      code: 'EXP-PET-002-A',
      descriptionKey: 'flows.expPet002.variants.a.description',
      nameKey: 'flows.expPet002.variants.a.name',
    },
    b: {
      code: 'EXP-PET-002-B',
      descriptionKey: 'flows.expPet002.variants.b.description',
      designFrames: {
        'ginger-info': figmaFrame('EXP-PET-002-B - Ginger (with quick add)', '1203-25879'),
        'medication-added': figmaFrame('EXP-PET-002-B - Medication added', '1213-29848'),
      },
      initialState: { showAiSuggestion: true },
      nameKey: 'flows.expPet002.variants.b.name',
    },
  },
})
