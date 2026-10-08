import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'

import { defineFlow } from '../../runtime/define-flow'
import { PetCard } from './components/pet-card'
import { ProminentQuickAction } from './components/prominent-quick-action'
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
  showMedicationHintAtom,
} from './model'
import { AlternativeHomeScreen } from './screens/alternative-home-screen'
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
    store.set(showMedicationHintAtom, initialState?.showMedicationHint ?? false)
    return store
  },
  defaultVariant: 'control',
  id: 'add-medication',
  initialScreen: 'home',
  screens: {
    confirmation: ConfirmationScreen,
    home: HomeScreen,
    'medication-form': MedicationFormScreen,
  },
  titleKey: 'flows.addMedication.title',
  variantSelection: 'automatic',
  variants: {
    'alternative-home': {
      descriptionKey: 'flows.addMedication.variants.alternativeHome.description',
      nameKey: 'flows.addMedication.variants.alternativeHome.name',
      screens: { home: AlternativeHomeScreen },
    },
    control: {
      nameKey: 'flows.addMedication.variants.control.name',
    },
    'prominent-action': {
      components: { QuickAction: ProminentQuickAction },
      descriptionKey: 'flows.addMedication.variants.prominentAction.description',
      initialState: { showMedicationHint: true },
      nameKey: 'flows.addMedication.variants.prominentAction.name',
    },
  },
})
