import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { gingerMedication, gingerPod, medicationAtom, noteTextAtom, podAtom } from '../../pods/ginger/model'
import { defineFlow } from '../../runtime/define-flow'
import {
  DEFAULT_MEDICAL_PRESENTATION,
  DEFAULT_POD_OPENING_TAB,
  type ExpPet003Components,
  type ExpPet003InitialState,
  type ExpPet003ScreenId,
  medicalPresentationAtom,
  podOpensOnAtom,
} from './model'
import { GingerInfoScreen } from './screens/ginger-info-screen'
import { GingerNotesScreen } from './screens/ginger-notes-screen'
import { HomeScreen } from './screens/home-screen'
import { MedicalScreen } from './screens/medical-screen'
import { MedicationScreen } from './screens/medication-screen'

export const expPet003Flow = defineFlow<ExpPet003ScreenId, ExpPet003Components, ExpPet003InitialState>({
  code: 'EXP-PET-003',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(podAtom, initialState?.pod ?? gingerPod)
    store.set(medicationAtom, initialState?.medication ?? gingerMedication)
    store.set(medicalPresentationAtom, initialState?.medicalPresentation ?? DEFAULT_MEDICAL_PRESENTATION)
    store.set(podOpensOnAtom, initialState?.podOpensOn ?? DEFAULT_POD_OPENING_TAB)
    store.set(noteTextAtom, '')
    return store
  },
  descriptionKey: 'flows.expPet003.description',
  id: 'exp-pet-003',
  initialScreen: 'home',
  kind: 'experiment',
  screens: {
    'ginger-info': GingerInfoScreen,
    'ginger-notes': GingerNotesScreen,
    home: HomeScreen,
    // Variant C lists the medication on Info itself and has no Medical screen.
    medical: null,
    medication: MedicationScreen,
  },
  titleKey: 'flows.expPet003.title',
  variantSelection: 'explicit',
  variants: {
    a: {
      code: 'EXP-PET-003-A',
      descriptionKey: 'flows.expPet003.variants.a.description',
      initialState: { medicalPresentation: 'row' },
      nameKey: 'flows.expPet003.variants.a.name',
      screens: { medical: MedicalScreen },
    },
    b: {
      code: 'EXP-PET-003-B',
      descriptionKey: 'flows.expPet003.variants.b.description',
      initialState: { medicalPresentation: 'row-with-preview' },
      nameKey: 'flows.expPet003.variants.b.name',
      screens: { medical: MedicalScreen },
    },
    c: {
      code: 'EXP-PET-003-C',
      descriptionKey: 'flows.expPet003.variants.c.description',
      initialState: { medicalPresentation: 'inline' },
      nameKey: 'flows.expPet003.variants.c.name',
    },
  },
})
