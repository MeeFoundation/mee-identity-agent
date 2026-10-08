import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'

import { defineFlow } from '../../runtime/define-flow'
import { PetCard } from './components/pet-card'
import { QuickAction } from './components/quick-action'
import {
  type AddMedicationComponents,
  type AddMedicationInitialState,
  type AddMedicationScreenId,
  emptyMedicationDraft,
  gingerFixture,
  medicationDraftAtom,
  medicationsAtom,
  petAtom,
} from './model'
import { ConfirmationScreen } from './screens/confirmation-screen'
import { HomeScreen } from './screens/home-screen'
import { MedicationFormScreen } from './screens/medication-form-screen'

export const addMedicationFlow = defineFlow<AddMedicationScreenId, AddMedicationComponents, AddMedicationInitialState>({
  components: { ...defaultComponents, PetCard, QuickAction },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(petAtom, initialState?.pet ?? gingerFixture)
    store.set(medicationsAtom, initialState?.medications ?? [])
    store.set(medicationDraftAtom, emptyMedicationDraft)
    return store
  },
  id: 'add-medication',
  initialScreen: 'home',
  screens: {
    confirmation: ConfirmationScreen,
    home: HomeScreen,
    'medication-form': MedicationFormScreen,
  },
  titleKey: 'flows.addMedication.title',
})
