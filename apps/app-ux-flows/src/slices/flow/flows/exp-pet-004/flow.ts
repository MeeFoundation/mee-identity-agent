import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { gingerPod, medicationAtom, podAtom } from '../../pods/ginger/model'
import { noteTextAtom } from '../../pods/notes/model'
import { defineFlow } from '../../runtime/define-flow'
import {
  apoquelMedication,
  DEFAULT_EDIT_ENTRY_POINT,
  DEFAULT_MEDICATION_SHORTCUT,
  type ExpPet004Components,
  type ExpPet004InitialState,
  type ExpPet004ScreenId,
  editEntryPointAtom,
  medicationShortcutAtom,
  scheduleDraftAtom,
  scheduleSavedAtom,
} from './model'
import { GingerInfoScreen } from './screens/ginger-info-screen'
import { GingerNotesScreen } from './screens/ginger-notes-screen'
import { HomeScreen } from './screens/home-screen'
import { MedicalScreen } from './screens/medical-screen'
import { MedicationScreen } from './screens/medication-screen'
import { MedicationUpdatedScreen } from './screens/medication-updated-screen'

export const expPet004Flow = defineFlow<ExpPet004ScreenId, ExpPet004Components, ExpPet004InitialState>({
  code: 'EXP-PET-004',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    const medication = initialState?.medication ?? apoquelMedication
    store.set(podAtom, initialState?.pod ?? gingerPod)
    store.set(medicationAtom, medication)
    store.set(medicationShortcutAtom, initialState?.medicationShortcut ?? DEFAULT_MEDICATION_SHORTCUT)
    store.set(editEntryPointAtom, DEFAULT_EDIT_ENTRY_POINT)
    store.set(scheduleDraftAtom, medication.frequencyPerDay)
    store.set(scheduleSavedAtom, false)
    store.set(noteTextAtom, '')
    return store
  },
  descriptionKey: 'flows.expPet004.description',
  hidden: true,
  id: 'exp-pet-004',
  initialScreen: 'home',
  kind: 'experiment',
  screens: {
    'ginger-info': GingerInfoScreen,
    'ginger-notes': GingerNotesScreen,
    home: HomeScreen,
    medical: MedicalScreen,
    medication: MedicationScreen,
    'medication-updated': MedicationUpdatedScreen,
  },
  titleKey: 'flows.expPet004.title',
  variantSelection: 'explicit',
  variants: {
    a: {
      code: 'EXP-PET-004-A',
      descriptionKey: 'flows.expPet004.variants.a.description',
      initialState: { medicationShortcut: 'none' },
      nameKey: 'flows.expPet004.variants.a.name',
    },
    b: {
      code: 'EXP-PET-004-B',
      descriptionKey: 'flows.expPet004.variants.b.description',
      initialState: { medicationShortcut: 'edit' },
      nameKey: 'flows.expPet004.variants.b.name',
    },
    c: {
      code: 'EXP-PET-004-C',
      descriptionKey: 'flows.expPet004.variants.c.description',
      initialState: { medicationShortcut: 'change-schedule' },
      nameKey: 'flows.expPet004.variants.c.name',
    },
  },
})
